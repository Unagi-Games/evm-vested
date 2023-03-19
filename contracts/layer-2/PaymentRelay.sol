// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (PaymentRelay.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";

/**
 * @title PaymentRelay
 * @dev Allows to sent payment with offchain triggers through a two-stage payment flow. This is intended
 * to allow flow for payment refunds.
 *
 * The payment flow is as follows:
 * 1 - Funds owner calls `reservePayment`, placing his funds in escrow and creating a new payment reservation;
 * 2 - Funds owner, or authorized operator, calls `execPayment` to forward the funds to an approved recipient;
 * 3 - In case the payment's offchain transaction fails, an authorized operator calls `refundPayment` to trigger
 * an escrow refund to the payment's originator
 *
 * For calling `execPayment` or `refundPayment`, the caller must have EXECUTION_ROLE, or REFUND_ROLE, respectively.
 * `refundPayment` can only be called by and authorized operator besides the fund's owner.
 *
 * @custom:security-contact security@unagi.ch
 */
contract PaymentRelay is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant TOKEN_ROLE = keccak256("TOKEN_ROLE");
    bytes32 public constant RECEIVER_ROLE = keccak256("RECEIVER_ROLE");

    // Possible states for an existing payment
    bytes32 public constant PAYMENT_RESERVED = keccak256("PAYMENT_RESERVED");
    bytes32 public constant PAYMENT_EXECUTED = keccak256("PAYMENT_EXECUTED");
    bytes32 public constant PAYMENT_REFUNDED = keccak256("PAYMENT_REFUNDED");

    struct Payment {
        address token;
        uint256 amount;
        bytes32 state;
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

    function isPaymentReserved(bytes32 UID, address from)
        public
        view
        returns (bool)
    {
        Payment memory payment = _getPayment(UID, from);
        return payment.state == PAYMENT_RESERVED;
    }

    function isPaymentProcessed(bytes32 UID, address from)
        public
        view
        returns (bool)
    {
        Payment memory payment = _getPayment(UID, from);
        return
            payment.state == PAYMENT_EXECUTED ||
            payment.state == PAYMENT_REFUNDED;
    }

    function getPayment(bytes32 UID, address from)
        external
        view
        returns (
            address,
            uint256,
            bytes32
        )
    {
        Payment memory payment = _getPayment(UID, from);
        return (payment.token, payment.amount, payment.state);
    }

    function _getPayment(bytes32 UID, address from)
        private
        view
        returns (Payment memory)
    {
        return _payments[getPaymentKey(UID, from)];
    }

    /**
     * @dev Function transfers `amount` of `token` from `from` the contract account.
     * A new Payment instance holding payment details is assigned to `UID`.
     *
     * Payment is placed in PAYMENT_RESERVED state.
     *
     * Requirements:
     * - `from` must not have a reserved payment for `UID`
     * - `from` must not have a processed payment for `UID`
     */
    function _reservePayment(
        bytes32 UID,
        address from,
        address token,
        uint256 amount
    ) private {
        require(
            !isPaymentReserved(UID, from) && !isPaymentProcessed(UID, from),
            "PaymentRelay: Payment already processed or reserved"
        );

        _payments[getPaymentKey(UID, from)] = Payment(
            token,
            amount,
            PAYMENT_RESERVED
        );

        IERC20 tokenContract = IERC20(token);
        tokenContract.safeTransferFrom(from, address(this), amount);
    }

    /**
     * Places the function caller's funds under escrow, creating a payment reservation
     * that can be later executed.
     *
     * @dev See _reservePayment()
     *
     * Requirements:
     * - `tokenAddress` must be approved token
     * - `amount` must be greater than 0
     */
    function reservePayment(
        address tokenAddress,
        uint256 amount,
        bytes32 UID
    ) external {
        _checkRole(TOKEN_ROLE, tokenAddress);
        require(
            amount > 0,
            "PaymentRelay: Payment amount should be strictly positive"
        );

        _reservePayment(UID, msg.sender, tokenAddress, amount);

        emit PaymentReserved(UID, msg.sender, tokenAddress, amount);
    }

    /**
     * Refunds an existing payment reservation. This operation can only be executed by
     * an authorized operator. The payment owner can not refund their
     * own payment reservation.
     *
     * @dev Function refunds a payment to `from`. Payment details are identified by `UID`
     * and retrieved from storage.
     *
     * The payment is placed in PAYMENT_EXECUTED state.
     *
     * The function caller must have OPERATOR_ROLE and not be `from`.
     *
     * Requirements:
     * - Payment to be refunded is currently reserved
     * - Function caller is not refund recipient
     * - Function caller has OPERATOR_ROLE
     */
    function refundPayment(address from, bytes32 UID) external {
        require(
            isPaymentReserved(UID, from),
            "PaymentRelay: Payment reserve not found"
        );
        require(
            msg.sender != from && hasRole(OPERATOR_ROLE, msg.sender),
            "PaymentRelay: Caller does not have permission to refund payment"
        );

        Payment storage payment = _payments[getPaymentKey(UID, from)];

        payment.state = PAYMENT_REFUNDED;

        IERC20 tokenContract = IERC20(payment.token);
        tokenContract.safeTransferFrom(address(this), from, payment.amount);

        emit PaymentRefunded(UID, from, payment.token, payment.amount);
    }

    /**
     * Forwards an existing payment reservation to an authorized recipient account.
     *
     * @dev Function executes an existing payment reservation on behalf of `from`.
     * Payment details identified by `UID` are retrieved from storage and funds in escrow
     * matching the reservation amount are forwarded to `forwardTo`.
     *
     * Payment is placed in PAYMENT_EXECUTED state.
     *
     * The function caller be either `from`, or have must have EXECUTION_ROLE.
     *
     * Requirements:
     * - Payment to be executed is currently reserved
     * - Function caller is the funds' owner, or has EXECUTION_ROLE
     */
    function execPayment(
        address from,
        bytes32 UID,
        address forwardTo
    ) external {
        require(
            isPaymentReserved(UID, from),
            "PaymentRelay: Payment reserve not found"
        );
        require(
            msg.sender == from || hasRole(OPERATOR_ROLE, msg.sender),
            "PaymentRelay: Caller does not have permission to execute payment"
        );
        _checkRole(RECEIVER_ROLE, forwardTo);

        Payment storage payment = _payments[getPaymentKey(UID, from)];

        payment.state = PAYMENT_EXECUTED;

        IERC20 tokenContract = IERC20(payment.token);
        tokenContract.safeTransferFrom(
            address(this),
            forwardTo,
            payment.amount
        );

        emit PaymentSent(UID, from, payment.token, payment.amount);
    }

    event PaymentReserved(
        bytes32 UID,
        address from,
        address token,
        uint256 amount
    );
    event PaymentSent(bytes32 UID, address from, address token, uint256 amount);
    event PaymentRefunded(
        bytes32 UID,
        address from,
        address token,
        uint256 amount
    );
}
