// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (NFTBurner.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

/**
 * @title NFTBurner
 * @dev TODO
 */
contract NFTBurner is IERC721Receiver, AccessControl {
    using SafeERC20 for IERC20;

    address public constant DEAD_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // Possible states for an existing token burn
    bytes32 public constant BURN_RESERVED = keccak256("BURN_RESERVED");
    bytes32 public constant BURN_EXECUTED = keccak256("BURN_EXECUTED");
    bytes32 public constant BURN_REVERTED = keccak256("BURN_REVERTED");

    struct Burn {
        address from;
        uint256[] tokenIds;
        bytes32 state;
    }

    IERC721 public UltimateChampionsNFT;

    // (keccak256 UID => Burn) mapping of burn operations
    mapping(bytes32 => Burn) private _burns;

    constructor(address nft) {
        UltimateChampionsNFT = IERC721(nft);
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
    function _batchTokenTransfer(
        address from,
        address to,
        uint256[] memory tokenIds
    ) private {
        uint256 length = tokenIds.length;
        for (uint256 i = 0; i < length; ) {
            UltimateChampionsNFT.safeTransferFrom(from, to, tokenIds[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * Reserves a token burn on behalf of a NFCHAMP/CHAMP holder, placeing the holder's tokens under escrow.
     *
     * @dev Function transfers `tokenIds` and `amount` of  to the contract's account.
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
        uint256[] calldata tokenIds
    ) external onlyRole(OPERATOR_ROLE) {
        require(
            tokenIds.length > 0,
            "NFTBurner: Burn must be reserved for at least 1 token"
        );
        require(!isBurnReserved(UID), "NFTBurner: Burn already reserved");
        require(!isBurnProcessed(UID), "NFTBurner: Burn already processed");

        // Save new Burn instance to storage
        _burns[UID] = Burn(from, tokenIds, BURN_RESERVED);

        // Place NFTs under escrow
        _batchTokenTransfer(from, address(this), tokenIds);

        emit BurnReserved(UID, from, tokenIds);
    }

    function executeBurn(bytes32 UID) external onlyRole(OPERATOR_ROLE) {
        require(isBurnReserved(UID), "NFTBurner: Burn is not reserved");

        Burn storage burn = _burns[UID];
        burn.state = BURN_EXECUTED;
        _batchTokenTransfer(address(this), DEAD_ADDRESS, burn.tokenIds);

        emit BurnExecuted(UID);
    }

    function revertBurn(bytes32 UID) external onlyRole(OPERATOR_ROLE) {
        require(isBurnReserved(UID), "NFTBurner: Burn is not reserved");

        Burn storage burn = _burns[UID];
        burn.state = BURN_REVERTED;
        _batchTokenTransfer(address(this), burn.from, burn.tokenIds);

        emit BurnReverted(UID);
    }

    event BurnReserved(bytes32 UID, address from, uint256[] tokenIds);
    event BurnExecuted(bytes32 UID);
    event BurnReverted(bytes32 UID);
}
