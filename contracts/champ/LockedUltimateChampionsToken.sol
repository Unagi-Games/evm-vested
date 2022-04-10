// SPDX-License-Identifier: MIT
// Unagi Vesting Contracts v1.0.0 (LockedUltimateChampionsToken.sol)
pragma solidity 0.8.12;

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

    uint8 private constant MAX_TRACKED_WALLETS = 200;

    IERC20Metadata private immutable _champContract;

    /**
     * @dev Initialize the CHAMP contract.
     */
    constructor(address champAddress) {
        require(
            champAddress != address(0),
            "LockedUltimateChampionsToken: champAddress should be a valid address. Received address(0)."
        );
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
    function totalSupply() external view returns (uint256) {
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
     * Emits a {LockedWalletTracked} event.
     *
     * Requirements:
     *
     * - The caller must be the owner.
     * - The number of tracked locked wallets should remains bellow MAX_TRACKED_WALLETS items.
     */
    function setLockedWallet(address lockedWallet, address vestingContract)
        external
        onlyOwner
    {
        require(
            lockedWallet != address(0),
            "LockedUltimateChampionsToken: lockedWallet should be a valid address. Received address(0)."
        );
        require(
            vestingContract != address(0),
            "LockedUltimateChampionsToken: vestingContract should be a valid address. Received address(0)."
        );

        if (!_lockedWalletsTracked[lockedWallet]) {
            require(
                _lockedWallets.length < MAX_TRACKED_WALLETS,
                "Too much tracked wallets. Consider creating a new instance of this contract to handle more."
            );

            _lockedWallets.push(lockedWallet);
            _lockedWalletsTracked[lockedWallet] = true;
        }
        _lockedWalletToVestingContract[lockedWallet] = vestingContract;

        emit LockedWalletTracked(lockedWallet, vestingContract);
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

    event LockedWalletTracked(address lockedWallet, address vestingContract);
}
