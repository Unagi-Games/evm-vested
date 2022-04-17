// SPDX-License-Identifier: MIT
// Unagi Vesting Contracts v1.0.0 (TestLockable.sol)
pragma solidity 0.8.12;

import "../layer-1/champ/Lockable.sol";

contract TestLockable is Lockable {
    constructor() {}

    function lock(uint256 duration) public {
        _lock(duration);
    }

    function permanentLock() public {
        _permanentLock();
    }

    function doWhenNotLocked() public whenNotLocked {}

    function doWhenLocked() public whenLocked {}
}
