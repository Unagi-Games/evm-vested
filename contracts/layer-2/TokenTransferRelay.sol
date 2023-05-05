// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (TokenTransferRelay.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title TokenTransferRelay
 * @dev TokenTransferRelay smart contract implements a two-step token transfer service that allows for refundable token transfers.
 * Each contract instance can relay only one ERC20 / ERC721 tokens per deployment. 
 * 
 * ERC20 / ERC721 token transfers can be reserved on behalf of a token holder, by calling the `reserveTransfer` function. 
 * This places the token holder's funds in escrow, allowing for later execution, or refund of the transfer. To interact with this
 * function, the caller must be granted OPERATOR_ROLE and approved by the token holder to manage their funds.
 *
 * Calling `executeTransfer` executes a reserved transfer, relaying the funds under escrow to either ERC721Receiver, or ERC20Receiver.
 * Alternatively, a reserved transfer can be refunded back to the original token holder by calling `revertTransfer`.
 * Both of these functions require the caller to be granted OPERATOR_ROLE.
 * 
 * The ERC721Receiver and ERC20Receiver addresses can be configured by caller's granted MAINTENANCE_ROLE. 
 *
 */
contract TokenTransferRelay is IERC721Receiver, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant RECEIVER_ROLE = keccak256("RECEIVER_ROLE");
    bytes32 public constant MAINTENANCE_ROLE = keccak256("MAINTENANCE_ROLE");

    // Possible states for an existing token transfer
    bytes32 public constant TRANSFER_RESERVED = keccak256("TRANSFER_RESERVED");
    bytes32 public constant TRANSFER_EXECUTED = keccak256("TRANSFER_EXECUTED");
    bytes32 public constant TRANSFER_REVERTED = keccak256("TRANSFER_REVERTED");

    // The ERC721 origin contract from which tokens will be transferred
    IERC721 public ERC721Origin;

    // The ERC20 origin contract from which tokens will be transfered
    IERC20 public ERC20Origin;

    // Address to which ERC20 tokens will be sent once a transfer is executed
    address public ERC20Receiver;

    // Address to which ERC20 tokens will be sent once a transfer is executed
    address public ERC721Receiver;

    struct Transfer {
        address from;
        uint256[] tokenIds;
        uint256 amount;
        bytes32 state;
    }

    // (keccak256 UID => Transfer) mapping of transfer operations
    mapping(bytes32 => Transfer) private _transfers;

    constructor(
        address _erc721,
        address _erc20,
        address _erc721Receiver,
        address _erc20Receiver
    ) {
        ERC721Origin = IERC721(_erc721);
        ERC20Origin = IERC20(_erc20);
        ERC721Receiver = _erc721Receiver;
        ERC20Receiver = _erc20Receiver;

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
    function setERC721Receiver(address _erc721Receiver)
        external
        onlyRole(MAINTENANCE_ROLE)
    {
        _checkRole(RECEIVER_ROLE, _erc721Receiver);
        ERC721Receiver = _erc721Receiver;
    }

    /**
     * @dev sets the address to which ERC721 tokens should be sent to.
     * The function caller must have been granted MAINTENANCE_ROLE.
     */
    function setERC20Receiver(address _erc20Receiver)
        external
        onlyRole(MAINTENANCE_ROLE)
    {
        _checkRole(RECEIVER_ROLE, _erc20Receiver);
        ERC20Receiver = _erc20Receiver;
    }

    function getTransfer(bytes32 UID) external view returns (Transfer memory) {
        return _transfers[UID];
    }

    function isTransferReserved(bytes32 UID) public view returns (bool) {
        return _transfers[UID].state == TRANSFER_RESERVED;
    }

    function isTransferProcessed(bytes32 UID) public view returns (bool) {
        return
            _transfers[UID].state == TRANSFER_EXECUTED ||
            _transfers[UID].state == TRANSFER_REVERTED;
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
     * Reserves a token transfer on behalf of a NFCHAMP/CHAMP holder, placing the holder's tokens under escrow.
     *
     * @dev Function transfers `tokenIds` and `amount` of erc20 to the contract's account.
     * A new Payment instance holding the payment details is assigned to `UID`.
     *
     * Transfer intent is placed in TRANSFER_RESERVED state.
     *
     * Requirements:
     * - `tokenIds` must contain at least 1 token ID
     * - `amount` must be greater than 0
     * - reserved transfer must not exist for given `UID`
     * - processed transfer must not exist for given `UID`
     */
    function reserveTransfer(
        bytes32 UID,
        address from,
        uint256[] calldata tokenIds,
        uint256 amount
    ) external onlyRole(OPERATOR_ROLE) {
        require(!isTransferReserved(UID), "TokenTransferRelay: Transfer already reserved");
        require(!isTransferProcessed(UID), "TokenTransferRelay: Transfer already processed");

        // Save new Transfer instance to storage
        _transfers[UID] = Transfer(from, tokenIds, amount, TRANSFER_RESERVED);

        // Place NFTs under escrow
        _batchERC721Transfer(from, address(this), tokenIds);
        _ERC20Transfer(from, address(this), amount);

        emit TransferReserved(UID, from, tokenIds, amount);
    }

    function executeTransfer(bytes32 UID) external onlyRole(OPERATOR_ROLE) {
        require(isTransferReserved(UID), "TokenTransferRelay: Transfer is not reserved");

        Transfer storage transfer = _transfers[UID];
        transfer.state = TRANSFER_EXECUTED;

        _batchERC721Transfer(address(this), ERC721Receiver, transfer.tokenIds);
        _ERC20Transfer(address(this), ERC20Receiver, transfer.amount);

        emit TransferExecuted(UID);
    }

    function revertTransfer(bytes32 UID) external onlyRole(OPERATOR_ROLE) {
        require(isTransferReserved(UID), "TokenTransferRelay: Transfer is not reserved");

        Transfer storage transfer = _transfers[UID];
        transfer.state = TRANSFER_REVERTED;

        _batchERC721Transfer(address(this), transfer.from, transfer.tokenIds);
        _ERC20Transfer(address(this), transfer.from, transfer.amount);

        emit TransferReverted(UID);
    }

    event TransferReserved(
        bytes32 UID,
        address from,
        uint256[] tokenIds,
        uint256 amount
    );
    event TransferExecuted(bytes32 UID);
    event TransferReverted(bytes32 UID);
}
