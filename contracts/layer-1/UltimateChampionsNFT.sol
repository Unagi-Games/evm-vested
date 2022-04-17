// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (UltimateChampionsNFT.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title UltimateChampionsNFT
 * @dev Implementation of IERC721. NFCHAMP is described using the ERC721Metadata extension.
 * See https://github.com/ethereum/EIPs/blob/34a2d1fcdf3185ca39969a7b076409548307b63b/EIPS/eip-721.md#specification
 * @custom:security-contact security@unagi.ch
 */
contract UltimateChampionsNFT is
    ERC721URIStorage,
    AccessControl,
    Multicall,
    Pausable
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant PREDICATE_ROLE = keccak256("PREDICATE_ROLE");

    /**
     * @dev Create NFCHAMP contract.
     *
     * Setup predicate address as the predicate role.
     * See https://github.com/maticnetwork/matic-docs/blob/ae7315656703ed5d1394640e830ca6c8f591a7e4/docs/develop/ethereum-polygon/mintable-assets.md#contract-to-be-deployed-on-ethereum
     */
    constructor(address predicate)
        ERC721("Non Fungible Ultimate Champions", "NFCHAMP")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(PREDICATE_ROLE, predicate);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return
            ERC721.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }

    /**
     * @dev Pause token transfers.
     *
     * Requirements:
     *
     * - Caller must have role PAUSER_ROLE.
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause token transfers.
     *
     * Requirements:
     *
     * - Caller must have role PAUSER_ROLE.
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Decode token metadata from L2 to L1.
     */
    function setTokenMetadata(uint256 tokenId, bytes memory data)
        internal
        virtual
    {
        string memory uri = abi.decode(data, (string));
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Called by predicate contract to mint tokens while withdrawing
     *
     * Requirements:
     *
     * - Caller must have role PREDICATE_ROLE.
     */
    function mint(address to, uint256 tokenId)
        external
        onlyRole(PREDICATE_ROLE)
    {
        _mint(to, tokenId);
    }

    /**
     * @dev Called by predicate contract to mint tokens while withdrawing
     * Bring metadata associated with token from L2 to L1.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` must not exist.
     * - Caller must have role PREDICATE_ROLE.
     *
     * Emits a {Transfer} event.
     */
    function mint(
        address to,
        uint256 tokenId,
        bytes calldata metaData
    ) external onlyRole(PREDICATE_ROLE) {
        _safeMint(to, tokenId);
        setTokenMetadata(tokenId, metaData);
    }

    /**
     * @dev Check if token already exists, return true if it does exist
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /**
     * @dev Before token transfer hook.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
