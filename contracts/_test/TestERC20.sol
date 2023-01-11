// SPDX-License-Identifier: MIT
// Unagi Vesting Contracts v1.0.0 (TestERC20.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor(uint256 initialBalance) ERC20("Test ERC20", "ERC20") {
        _mint(msg.sender, initialBalance);
    }
}
