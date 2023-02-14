// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (ChildMgcToken.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IChildToken.sol";

/**
 * @title Layer 2 MgcToken
 * @dev See MgcToken@0x960c1b741B4D4FFb8D5Dc6019534386ef764d69d
 * @custom:security-contact security@unagi.ch
 */
contract ChildMgcToken is ERC777, IChildToken, AccessControl, Multicall {
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 public constant DEPOSITOR_ROLE = keccak256("DEPOSITOR_ROLE");

    constructor(address depositor)
        ERC777("Manager Contracts Token", "MGC", new address[](0))
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINT_ROLE, _msgSender());
        _setupRole(DEPOSITOR_ROLE, depositor);
    }

    /**
     * @notice called when token is deposited on root chain
     * @dev Should be callable only by ChildChainManager
     * Should handle deposit by minting the required amount for user
     * Make sure minting is done only by this function
     * @param user user address for whom deposit is being done
     * @param depositData abi encoded amount
     */
    function deposit(address user, bytes calldata depositData)
        external
        override
        onlyRole(DEPOSITOR_ROLE)
    {
        uint256 amount = abi.decode(depositData, (uint256));
        _mint(user, amount, "", "");
    }

    /**
     * @notice called when user wants to withdraw tokens back to root chain
     * @dev Should burn user's tokens. This transaction will be verified when exiting on root chain
     * @param amount amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external {
        _burn(_msgSender(), amount, "", "");
    }

    /**
     * @notice Example function to handle minting tokens on matic chain
     * @dev Minting can be done as per requirement,
     * This implementation allows only admin to mint tokens but it can be changed as per requirement
     * @param to user for whom tokens are being minted
     * @param amount amount of token to mint
     */
    function mint(address to, uint256 amount) public onlyRole(MINT_ROLE) {
        _mint(to, amount, "", "");
    }
}
