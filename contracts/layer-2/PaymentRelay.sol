// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (PaymentRelay.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

/**
 * @title PaymentRelay
 * @dev Allow to sent payment with offchain triggers only once.
 * @custom:security-contact security@unagi.ch
 */
contract PaymentRelay is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant TOKEN_ROLE = keccak256("TOKEN_ROLE");
    bytes32 public constant RECEIVER_ROLE = keccak256("RECEIVER_ROLE");

    struct Payment {
        address token;
        uint256 amount;
    }

    // (keccak256 UID => payment) mapping of payments
    mapping(bytes32 => Payment) private _payments;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(TOKEN_ROLE, _msgSender());
        _setupRole(RECEIVER_ROLE, _msgSender());
    }

    function getPaymentKey(bytes32 UID, address from)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(UID, from));
    }

    function isPaymentProcessed(bytes32 UID, address from)
        public
        view
        returns (bool)
    {
        Payment memory payment = _getPayment(UID, from);
        return payment.amount > 0;
    }

    function getPayment(bytes32 UID, address from)
        external
        view
        returns (address, uint256)
    {
        Payment memory payment = _getPayment(UID, from);
        return (payment.token, payment.amount);
    }

    function _getPayment(bytes32 UID, address from)
        private
        view
        returns (Payment memory)
    {
        return _payments[getPaymentKey(UID, from)];
    }

    function _reservePayment(
        bytes32 UID,
        address from,
        address token,
        uint256 amount
    ) private {
        require(
            !isPaymentProcessed(UID, from),
            "PaymentRelay: Payment already processed"
        );

        _payments[getPaymentKey(UID, from)] = Payment(token, amount);
    }

    function execPayment(
        address tokenAddress,
        uint256 amount,
        bytes32 UID,
        address forwardTo
    ) external {
        _checkRole(TOKEN_ROLE, tokenAddress);
        require(
            amount > 0,
            "PaymentRelay: Payment amount should be strictly positive"
        );
        _checkRole(RECEIVER_ROLE, forwardTo);

        _reservePayment(UID, msg.sender, tokenAddress, amount);
        IERC20 tokenContract = IERC20(tokenAddress);
        tokenContract.safeTransferFrom(msg.sender, forwardTo, amount);

        emit PaymentSent(UID, msg.sender, tokenAddress, amount);
    }

    event PaymentSent(bytes32 UID, address from, address token, uint256 amount);
}
