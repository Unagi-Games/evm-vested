// SPDX-License-Identifier: MIT
// Unagi Vesting Contracts v1.0.0 (TestChampMarketplace.sol)
pragma solidity 0.8.12;

import "../layer-2/ChampMarketplace.sol";

contract TestChampMarketplace is ChampMarketplace {
    function _disableInitializers() internal override {}
}
