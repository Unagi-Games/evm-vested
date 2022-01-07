// SPDX-License-Identifier: MIT
// Unagi Vesting Contracts v1.0.0 (LockedUltimateChampionsToken.sol)
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/**
 * @title LockedUltimateChampionsToken
 * @dev Partial implementation of IERC20 which allows to check balance of locked CHAMP for a given beneficiary.
 * This contract acts like a view of the CHAMP token and will simply return the balance of a vesting wallet assigned to a beneficiary.
 * @custom:security-contact security@unagi.ch
 */
contract LockedUltimateChampionsToken is Ownable {
    address[] private _lockedWallets;
    mapping(address => bool) private _lockedWalletsTracked;
    mapping(address => address) private _lockedWalletToVestingContract;

    IERC20Metadata private immutable _champContract;

    /**
     * @dev Initialize the CHAMP contract.
     */
    constructor(address champAddress) {
        _champContract = IERC20Metadata(champAddress);
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() external pure returns (string memory) {
        return "Locked Ultimate Champions Token";
    }

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external pure returns (string memory) {
        return "CHAMP_LOCK";
    }

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8) {
        return _champContract.decimals();
    }

    /**
     * @dev Returns the sum of locked CHAMPs.
     */
    function totalSupply() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _lockedWallets.length; i++) {
            total += _champContract.balanceOf(
                getVestingContract(_lockedWallets[i])
            );
        }
        return total;
    }

    /**
     * @dev Returns the amount of locked CHAMP tokens owned by `tokenHolder`.
     */
    function balanceOf(address tokenHolder) public view returns (uint256) {
        return _champContract.balanceOf(getVestingContract(tokenHolder));
    }

    /**
     * @dev Allow to update the list of locked wallets with their associated vesting contract.
     *
     * Requirements:
     *
     * - The caller must be the owner.
     */
    function setLockedWallet(address lockedWallet, address vestingContract)
        public
        onlyOwner
    {
        if (!_lockedWalletsTracked[lockedWallet]) {
            _lockedWallets.push(lockedWallet);
            _lockedWalletsTracked[lockedWallet] = true;
        }
        _lockedWalletToVestingContract[lockedWallet] = vestingContract;
    }

    /**
     * @dev Getter to retrieve for a given locked wallet its associated vesting contract.
     */
    function getVestingContract(address lockedWallet)
        public
        view
        returns (address)
    {
        return _lockedWalletToVestingContract[lockedWallet];
    }
}
