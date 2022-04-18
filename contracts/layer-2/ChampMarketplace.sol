// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (ChampMarketplace.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/**
 * @title ChampMarketplace
 * @dev This contract allows CHAMP (Ultimate Champions Token) and NFCHAMP
 * (Non Fungible Ultimate Champions) holders to exchange theirs assets.
 *
 * A NFT holder can create, edit or delete a sale for one of his NFTs.
 * To create a sale, the NFT holder must give his approval for the ChampMarketplace
 * on the NFT he wants to sell. Then, the NFT holder must call the function
 * `createSaleFrom`. To remove the sale, the NFT holder must call the function
 * `destroySaleFrom`.
 *
 * A CHAMP holder can accept a sale. To accept a sale, the CHAMP holder must
 * send CHAMP tokens to the ChampMarketplace address with the `ERC77.send`
 * function from the ChampToken smartcontract. The NFT ID must be provided
 * as `data` parameter (See `ChampMarketplace.tokensReceived` for more details).
 *
 * Once a NFT is sold, a fee (readable through `marketplacePercentFees()`)
 * will be applied on the CHAMP payment and forwarded to the marketplace
 * fees receiver (readable through `marketplaceFeesReceiver()`).
 * The rest is sent to the seller.
 *
 * The fees is editable by FEE_MANAGER_ROLE.
 * The fee receiver is editable by FEE_MANAGER_ROLE.
 *
 * @custom:security-contact security@unagi.ch
 */
contract ChampMarketplace is
    AccessControlEnumerable,
    IERC777Recipient,
    Multicall
{
    using SafeMath for uint256;

    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");

    IERC777 public immutable _CHAMP_TOKEN_CONTRACT;
    IERC721 public immutable _NFCHAMP_CONTRACT;

    IERC1820Registry internal constant _ERC1820_REGISTRY =
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    bytes32 private constant _TOKENS_RECIPIENT_INTERFACE_HASH =
        keccak256("ERC777TokensRecipient");

    // (nft ID => prices as CHAMP wei) mapping of sales
    mapping(uint256 => uint256) private _sales;

    // Percent fees applied on each sale.
    uint256 private _marketplacePercentFees;
    // Fees receiver address
    address private _marketplaceFeesReceiver;

    constructor(address champTokenAddress, address nfChampAddress) {
        _CHAMP_TOKEN_CONTRACT = IERC777(champTokenAddress);
        _NFCHAMP_CONTRACT = IERC721(nfChampAddress);

        _ERC1820_REGISTRY.setInterfaceImplementer(
            address(this),
            _TOKENS_RECIPIENT_INTERFACE_HASH,
            address(this)
        );

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(FEE_MANAGER_ROLE, _msgSender());
    }

    /**
     * @dev Returns true if a tokenID is on sale.
     */
    function hasSale(uint64 tokenId) public view returns (bool) {
        return getSale(tokenId) > 0;
    }

    /**
     * @dev Returns the CHAMP wei price to buy a given NFCHAMP ID.
     * If the sale does not exists, the function returns 0.
     */
    function getSale(uint64 tokenId) public view returns (uint256) {
        uint256 salePrice = _sales[tokenId];
        if (_NFCHAMP_CONTRACT.getApproved(tokenId) != address(this)) {
            return 0;
        }
        return salePrice;
    }

    /**
     * @dev Setter for the marketplace fees.
     *
     * Emits a {MarketplaceFeesUpdated} event.
     *
     * Requirements:
     *
     * - nMarketplacePercentFees must be a percentage (Between 0 and 100 included).
     * - Caller must have role FEE_MANAGER_ROLE.
     */
    function setMarketplacePercentFees(uint256 nMarketplacePercentFees)
        external
        onlyRole(FEE_MANAGER_ROLE)
    {
        require(
            nMarketplacePercentFees >= 0,
            "ChampMarketplace: nMarketplacePercentFees should be positive"
        );
        require(
            nMarketplacePercentFees <= 100,
            "ChampMarketplace: nMarketplacePercentFees should be below 100"
        );
        _marketplacePercentFees = nMarketplacePercentFees;

        emit MarketplaceFeesUpdated(_marketplacePercentFees);
    }

    /**
     * @dev Getter for the marketplace fees.
     */
    function marketplacePercentFees() public view returns (uint256) {
        return _marketplacePercentFees;
    }

    /**
     * @dev Compute the current share for a given price.
     * Remainder is given to the seller.
     * Return a tuple of wei:
     * - First element is CHAMP wei for the seller.
     * - Second element is CHAMP wei fee.
     */
    function computeSaleShares(uint256 weiPrice)
        public
        view
        returns (uint256, uint256)
    {
        uint256 saleFees = weiPrice.mul(marketplacePercentFees()).div(100);
        return (weiPrice.sub(saleFees), saleFees);
    }

    /**
     * @dev Setter for the marketplace fees receiver address.
     *
     * Emits a {MarketplaceFeesReceiverUpdated} event.
     *
     * Requirements:
     *
     * - Caller must have role FEE_MANAGER_ROLE.
     */
    function setMarketplaceFeesReceiver(address nMarketplaceFeesReceiver)
        external
        onlyRole(FEE_MANAGER_ROLE)
    {
        _marketplaceFeesReceiver = nMarketplaceFeesReceiver;

        emit MarketplaceFeesReceiverUpdated(_marketplaceFeesReceiver);
    }

    /**
     * @dev Getter for the marketplace fees receiver address.
     */
    function marketplaceFeesReceiver() public view returns (address) {
        return _marketplaceFeesReceiver;
    }

    /**
     * @dev Allow to create a sale for a given NFCHAMP ID at a given CHAMP wei price.
     *
     * Emits a {SaleCreated} event.
     *
     * Requirements:
     *
     * - tokenWeiPrice should be strictly positive.
     * - from must be the NFCHAMP owner.
     * - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner.
     * - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     * - NFCHAMP ID should not be on sale.
     */
    function createSaleFrom(
        address from,
        uint64 tokenId,
        uint256 tokenWeiPrice
    ) external {
        require(
            tokenWeiPrice > 0,
            "ChampMarketplace: Price should be strictly positive"
        );

        address nftOwner = _NFCHAMP_CONTRACT.ownerOf(tokenId);
        require(
            nftOwner == from,
            "ChampMarketplace: Create sale of token that is not own"
        );
        require(
            nftOwner == msg.sender ||
                _NFCHAMP_CONTRACT.isApprovedForAll(nftOwner, msg.sender),
            "ChampMarketplace: Only the token owner or its operator are allowed to create a sale."
        );
        require(
            _NFCHAMP_CONTRACT.getApproved(tokenId) == address(this),
            "ChampMarketplace: Contract should be approved by the token owner."
        );
        require(
            !hasSale(tokenId),
            "ChampMarketplace: Sale already exists. Destroy the previous sale first."
        );

        _sales[tokenId] = tokenWeiPrice;

        emit SaleCreated(tokenId, tokenWeiPrice, nftOwner);
    }

    /**
     * @dev Allow to edit a sale for a given NFCHAMP ID at a given CHAMP wei price.
     *
     * Emits a {SaleEdited} event.
     *
     * Requirements:
     *
     * - NFCHAMP ID should be on sale.
     * - tokenWeiPrice should be strictly positive.
     * - from must be the NFCHAMP owner.
     * - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner.
     * - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     */
    function editSaleFrom(
        address from,
        uint64 tokenId,
        uint256 tokenWeiPrice
    ) external {
        require(hasSale(tokenId), "ChampMarketplace: Sale does not exists");
        address nftOwner = _NFCHAMP_CONTRACT.ownerOf(tokenId);
        require(
            nftOwner == from,
            "ChampMarketplace: Edit sale of token that is not own"
        );
        require(
            nftOwner == msg.sender ||
                _NFCHAMP_CONTRACT.isApprovedForAll(nftOwner, msg.sender),
            "ChampMarketplace: Only the token owner or its operator are allowed to edit a sale."
        );
        require(
            tokenWeiPrice > 0,
            "ChampMarketplace: Price should be strictly positive"
        );

        _sales[tokenId] = tokenWeiPrice;

        emit SaleEdited(tokenId, tokenWeiPrice, nftOwner);
    }

    /**
     * @dev Allow to destroy a sale for a given NFCHAMP ID.
     *
     * Emits a {SaleDestroyed} event.
     *
     * Requirements:
     *
     * - NFCHAMP ID should be on sale.
     * - from must be the NFCHAMP owner.
     * - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner.
     * - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     */
    function destroySaleFrom(address from, uint64 tokenId) external {
        require(hasSale(tokenId), "ChampMarketplace: Sale does not exists");
        address nftOwner = _NFCHAMP_CONTRACT.ownerOf(tokenId);
        require(
            nftOwner == from,
            "ChampMarketplace: Destroy sale of token that is not own"
        );
        require(
            nftOwner == msg.sender ||
                _NFCHAMP_CONTRACT.isApprovedForAll(nftOwner, msg.sender),
            "ChampMarketplace: Only the token owner or its operator are allowed to destroy a sale."
        );

        delete _sales[tokenId];

        emit SaleDestroyed(tokenId, nftOwner);
    }

    /**
     * @dev Called by an {IERC777} CHAMP token contract whenever tokens are being
     * sent to the ChampMarketplace contract.
     *
     * This function is used to buy a NFCHAMP listed on the ChampMarketplace contract.
     * To buy a NFCHAMP, a CHAMP holder must send CHAMP wei price (or above) to the
     * ChampMarketplace contract with some extra data:
     * - MANDATORY: Bytes 0 to 7 (8 bytes, uint64) corresponds to the NFCHAMP ID to buy
     * - OPTIONAL: Bytes 8 to 27 (20 bytes, address) can be provided to customize
     * the wallet that will receive the NFCHAMP if the sale is executed.
     *
     * Once a NFT is sold, a fee will be applied on the CHAMP payment and forwarded
     * to the marketplace fees receiver.
     *
     * Emits a {SaleAccepted} event.
     *
     * Requirements:
     *
     * - Received tokens must be CHAMP.
     * - NFCHAMP ID must be on sale.
     * - Received tokens amount must be greater than sale price.
     */
    function tokensReceived(
        address,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata
    ) external override {
        //
        // 1.
        // Requirements
        //
        require(to == address(this), "ChampMarketplace: Invalid recipient");
        require(
            msg.sender == address(_CHAMP_TOKEN_CONTRACT),
            "ChampMarketplace: Invalid ERC777 token"
        );

        // Read NFCHAMP ID
        uint64 tokenId = BytesLib.toUint64(userData, 0);
        // Read optional address that will receive NFCHAMP
        // By default, `from` will receive the NFCHAMP
        address nftReceiver = userData.length > 8
            ? BytesLib.toAddress(userData, 8)
            : from;

        require(hasSale(tokenId), "ChampMarketplace: Sale does not exists");
        require(
            amount >= _sales[tokenId],
            "ChampMarketplace: You must match the sale price to accept the sale."
        );

        //
        // 2.
        // Process sale
        //
        address seller = _NFCHAMP_CONTRACT.ownerOf(tokenId);
        uint256 sellerTokenWeiShare;
        uint256 marketplaceFeesTokenWeiShare;
        (sellerTokenWeiShare, marketplaceFeesTokenWeiShare) = computeSaleShares(
            amount
        );

        //
        // 3.
        // Execute sale
        //
        delete _sales[tokenId];
        _NFCHAMP_CONTRACT.safeTransferFrom(seller, nftReceiver, tokenId);
        _CHAMP_TOKEN_CONTRACT.send(seller, sellerTokenWeiShare, "");
        if (marketplaceFeesTokenWeiShare > 0) {
            _CHAMP_TOKEN_CONTRACT.send(
                marketplaceFeesReceiver(),
                marketplaceFeesTokenWeiShare,
                ""
            );
        }

        emit SaleAccepted(tokenId, amount, seller, nftReceiver);
    }

    event MarketplaceFeesUpdated(uint256 percentFees);

    event MarketplaceFeesReceiverUpdated(address feesReceiver);

    event SaleCreated(uint64 tokenId, uint256 tokenWeiPrice, address seller);

    event SaleEdited(uint64 tokenId, uint256 tokenWeiPrice, address seller);

    event SaleAccepted(
        uint64 tokenId,
        uint256 tokenWeiPrice,
        address seller,
        address buyer
    );

    event SaleDestroyed(uint64 tokenId, address seller);
}
