// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (NFTBurner.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PayableNFTBurner
 * @dev TODO
 */
contract PayableNFTBurner is IERC721Receiver, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant MAINTENANCE_ROLE = keccak256("MAINTENANCE_ROLE");
    bytes32 public constant RECEIVER_ROLE = keccak256("RECEIVER_ROLE");

    // ERC721 tokens will be sent to this address
    address public constant DEAD_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    // Possible states for an existing token burn
    bytes32 public constant BURN_RESERVED = keccak256("BURN_RESERVED");
    bytes32 public constant BURN_EXECUTED = keccak256("BURN_EXECUTED");
    bytes32 public constant BURN_REVERTED = keccak256("BURN_REVERTED");

    // The ERC721 origin contract from which tokens will be burned
    IERC721 public ERC721Origin;

    // The ERC20 origin contract from which tokens will be transfered
    IERC20 public ERC20Origin;

    // Address to which ERC20 tokens will be sent once a burn is executed
    address public ERC20ReceiverAddress;

    struct Burn {
        address from;
        uint256[] tokenIds;
        uint256 amount;
        bytes32 state;
    }

    // (keccak256 UID => Burn) mapping of burn operations
    mapping(bytes32 => Burn) private _burns;

    constructor(
        address _erc721,
        address _erc20,
        address _erc20Receiver
    ) {
        ERC721Origin = IERC721(_erc721);
        ERC20Origin = IERC20(_erc20);
        ERC20ReceiverAddress = _erc20Receiver;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl)
        returns (bool)
    {
        return
            interfaceId == type(IERC721Receiver).interfaceId ||
            AccessControl.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Receiver-onERC721Received}.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /**
     * @dev sets the address to which ERC20 tokens should be sent to.
     * The function caller must have been granted MAINTENANCE_ROLE.
     */
    function setERC20Receiver(address _erc20Receiver)
        external
        onlyRole(MAINTENANCE_ROLE)
    {
        _checkRole(RECEIVER_ROLE, _erc20Receiver);
        ERC20ReceiverAddress = _erc20Receiver;
    }

    function getBurn(bytes32 UID) external view returns (Burn memory) {
        return _burns[UID];
    }

    function isBurnReserved(bytes32 UID) public view returns (bool) {
        return _burns[UID].state == BURN_RESERVED;
    }

    function isBurnProcessed(bytes32 UID) public view returns (bool) {
        return
            _burns[UID].state == BURN_EXECUTED ||
            _burns[UID].state == BURN_REVERTED;
    }

    /**
     * @dev sends a batch of NFCHAMP tokens from `from` to `to`.
     * Requires this contract to be approved by the tokens' holder before hand.
     */
    function _batchERC721Transfer(
        address from,
        address to,
        uint256[] memory tokenIds
    ) private {
        uint256 length = tokenIds.length;
        for (uint256 i = 0; i < length; ) {
            ERC721Origin.safeTransferFrom(from, to, tokenIds[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @dev sends `amount` of ERC20Origin tokens from `from` to `to`.
     * Requires this contract to be approved by the tokens' holder before hand.
     */
    function _ERC20Transfer(
        address from,
        address to,
        uint256 amount
    ) private {
        if (amount > 0) {
            ERC20Origin.safeTransferFrom(from, to, amount);
        }
    }

    /**
     * Reserves a token burn on behalf of a NFCHAMP/CHAMP holder, placing the holder's tokens under escrow.
     *
     * @dev Function transfers `tokenIds` and `amount` of erc20 to the contract's account.
     * A new Payment instance holding the payment details is assigned to `UID`.
     *
     * Burn intent is placed in BURN_RESERVED state.
     *
     * Requirements:
     * - `tokenIds` must contain at least 1 token ID
     * - `amount` must be greater than 0
     * - reserved burn must not exist for given `UID`
     * - processed burn must not exist for given `UID`
     */
    function reserveBurn(
        bytes32 UID,
        address from,
        uint256[] calldata tokenIds,
        uint256 amount
    ) external onlyRole(OPERATOR_ROLE) {
        require(
            tokenIds.length > 0,
            "NFTBurner: Burn must be reserved for at least 1 token"
        );
        require(!isBurnReserved(UID), "NFTBurner: Burn already reserved");
        require(!isBurnProcessed(UID), "NFTBurner: Burn already processed");

        // Save new Burn instance to storage
        _burns[UID] = Burn(from, tokenIds, amount, BURN_RESERVED);

        // Place NFTs under escrow
        _batchERC721Transfer(from, address(this), tokenIds);
        _ERC20Transfer(from, address(this), amount);

        emit BurnReserved(UID, from, tokenIds, amount);
    }

    function executeBurn(bytes32 UID) external onlyRole(OPERATOR_ROLE) {
        require(isBurnReserved(UID), "NFTBurner: Burn is not reserved");

        Burn storage burn = _burns[UID];
        burn.state = BURN_EXECUTED;

        _batchERC721Transfer(address(this), DEAD_ADDRESS, burn.tokenIds);
        _ERC20Transfer(address(this), ERC20ReceiverAddress, burn.amount);

        emit BurnExecuted(UID);
    }

    function revertBurn(bytes32 UID) external onlyRole(OPERATOR_ROLE) {
        require(isBurnReserved(UID), "NFTBurner: Burn is not reserved");

        Burn storage burn = _burns[UID];
        burn.state = BURN_REVERTED;

        _batchERC721Transfer(address(this), burn.from, burn.tokenIds);
        _ERC20Transfer(address(this), burn.from, burn.amount);

        emit BurnReverted(UID);
    }

    event BurnReserved(
        bytes32 UID,
        address from,
        uint256[] tokenIds,
        uint256 amount
    );
    event BurnExecuted(bytes32 UID);
    event BurnReverted(bytes32 UID);
}
