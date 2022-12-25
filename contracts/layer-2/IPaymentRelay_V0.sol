// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (IPaymentRelay_V0.sol)
pragma solidity 0.8.12;

interface IPaymentRelay_V0 {
    function getPayment(bytes32 UID) external view returns (address, uint256);
}
