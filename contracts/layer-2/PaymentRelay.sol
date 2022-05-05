// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (PaymentRelay.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

/**
 * @title PaymentRelay
 * @dev Allow to sent payment with offchain triggers only once.
 * @custom:security-contact security@unagi.ch
 */
contract PaymentRelay is AccessControl, IERC777Recipient {
    bytes32 public constant TOKEN_ROLE = keccak256("TOKEN_ROLE");
    bytes32 public constant PAYMENT_ROLE = keccak256("PAYMENT_ROLE");

    IERC1820Registry internal constant _ERC1820_REGISTRY =
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    bytes32 private constant _TOKENS_RECIPIENT_INTERFACE_HASH =
        keccak256("ERC777TokensRecipient");

    struct Payment {
        address token;
        uint256 amount;
    }

    // (keccak256 UID => payment) mapping of payments
    mapping(bytes32 => Payment) private _payments;

    constructor() {
        _ERC1820_REGISTRY.setInterfaceImplementer(
            address(this),
            _TOKENS_RECIPIENT_INTERFACE_HASH,
            address(this)
        );

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(TOKEN_ROLE, _msgSender());
        _setupRole(PAYMENT_ROLE, _msgSender());
    }

    function isPaymentProcessed(bytes32 UID) public view returns (bool) {
        Payment memory payment = _getPayment(UID);
        return payment.amount > 0;
    }

    function getPayment(bytes32 UID) external view returns (address, uint256) {
        Payment memory payment = _getPayment(UID);
        return (payment.token, payment.amount);
    }

    function _getPayment(bytes32 UID) private view returns (Payment memory) {
        return _payments[UID];
    }

    function _reservePayment(bytes32 UID, address token, uint256 amount) private {
        require(!isPaymentProcessed(UID), "PaymentRelay: Payment already processed");

        _payments[UID] = Payment(token, amount);
    }

    function tokensReceived(
        address operator,
        address,
        address,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override onlyRole(TOKEN_ROLE) {
        _checkRole(PAYMENT_ROLE, operator);
        require(amount > 0, "PaymentRelay: Payment amount should be strictly positive");

        address tokenAddress = msg.sender;
        bytes32 UID = bytes32(BytesLib.slice(operatorData, 0, 32));
        address forwardTo = BytesLib.toAddress(operatorData, 32);

        _reservePayment(UID, tokenAddress, amount);
        IERC777 tokenContract = IERC777(tokenAddress);
        tokenContract.send(forwardTo, amount, userData);

        emit PaymentSent(UID, tokenAddress, amount);
    }

    event PaymentSent(bytes32 UID, address token, uint256 amount);
}
