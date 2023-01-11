// SPDX-License-Identifier: MIT
// Unagi Vesting Contracts v1.0.0 (TestLockable.sol)
pragma solidity 0.8.12;

import "../layer-2/IPaymentRelay_V0.sol";

contract TestPaymentRelay_V0 is IPaymentRelay_V0 {
    constructor() {}

    function getPayment(bytes32 UID) external view returns (address, uint256) {
        return (address(0), 0);
    }
}