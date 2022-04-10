// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (UltimateChampionsNFT.sol)
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
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
contract UltimateChampionsNFT is ERC721, AccessControl, Multicall, Pausable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Counter for token ID
    Counters.Counter private _tokenIds;

    // Mapping from token ID to metadata URI.
    mapping(uint256 => string) private _tokenURIs;

    /**
     * @dev Construct NFCHAMP
     */
    constructor() ERC721("Non Fungible Ultimate Champions", "NFCHAMP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
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
     * @dev Returns the URI associated to `tokenId` that point to a JSON file conforms to ERC721Metadata extension..
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "UltimateChampionsNFT: URI query for nonexistent token"
        );

        return string(abi.encodePacked("ipfs://", _tokenURIs[tokenId]));
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Safely mints a new token, set `ipfsMedataURI` as it metadata and transfers it to `to`.
     * @return uint256 Token ID of the minted token.
     *
     * Requirements:
     *
     * - Caller must have role MINTER_ROLE.
     * - The contract must not be paused.
     *
     * Emits a {Transfer} event.
     */
    function safeMint(address to, string memory ipfsMedataURI)
        public
        onlyRole(MINTER_ROLE)
        whenNotPaused
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, ipfsMedataURI);
        return newTokenId;
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     * - The contract must not be paused.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal override whenNotPaused {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
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
