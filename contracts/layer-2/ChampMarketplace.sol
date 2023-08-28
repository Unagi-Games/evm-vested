// SPDX-License-Identifier: MIT
// Unagi Contracts v1.0.0 (ChampMarketplace.sol)
pragma solidity 0.8.12;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

/**
 * @title ChampMarketplace
 * @dev This contract allows CHAMP (Ultimate Champions Token) and NFCHAMP
 * (Non Fungible Ultimate Champions) holders to exchange theirs assets.
 *
 * A NFT holder can create, update or delete a sale for one of his NFTs.
 * To create a sale, the NFT holder must give his approval for the ChampMarketplace
 * on the NFT he wants to sell. Then, the NFT holder must call the function `createSaleFrom`.
 * A reserved sale can also be created, meaning only a specific CHAMP holder, approved by
 * the NFT owner, can accept the sale. To remove the sale, the NFT holder must call the
 * function `destroySaleFrom`.
 *
 * A NFT holder can also update their existing sales through the `updateSaleFrom` function.
 * This function allows the NFT holder to update a given sale's price and reserved offer.
 *
 * A CHAMP holder can accept a sale if the sale is either public, or has a reserved offer
 * set for CHAMP holder. The function `isReservationOpenFor` can be used to verify if a given CHAMP holder
 * can accept a specifc sale. To accept a sale, the CHAMP holder must approve CHAMP tokens to
 * the ChampMarketplace address and call the function `acceptSale`.
 *
 * Once a NFT is sold, sell, buy and burn fees (readable through `marketplacePercentFees()`)
 * will be applied on the CHAMP payment. Sell and buy fees are forwarded to the marketplace
 * fees receiver (readable through `marketplaceFeesReceiver()`), while the burn fee is forwarded to the DEAD address.
 * The rest is sent to the seller.
 *
 * The fees is editable by FEE_MANAGER_ROLE.
 * The fee receiver is editable by FEE_MANAGER_ROLE.
 *
 * For off-chain payments, an option can be set on a sale.
 * Options are restricted to only one per sale at any time.
 * Options are rate limited per sale.
 *
 * @custom:security-contact security@unagi.ch
 */
contract ChampMarketplace is AccessControlEnumerableUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    struct Option {
        address buyer;
        uint256 until;
    }

    struct OptionLock {
        uint64 tokenId;
        uint256 until;
    }

    struct RateLimit {
        uint8 renew;
        uint256 until;
    }

    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");
    bytes32 public constant OPTION_ROLE = keccak256("OPTION_ROLE");

    IERC20Upgradeable public _CHAMP_TOKEN_CONTRACT;
    IERC721Upgradeable public _NFCHAMP_CONTRACT;

    // @deprecated ERC777 compatibility
    IERC1820RegistryUpgradeable internal constant _ERC1820_REGISTRY =
        IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    bytes32 private constant _TOKENS_RECIPIENT_INTERFACE_HASH =
        keccak256("ERC777TokensRecipient");

    uint256 internal constant _RATE_LIMIT_TIME = 30 minutes;
    uint256 internal constant _RATE_LIMIT_MAX_RENEW = 2;
    uint256 internal constant _OPTION_TIME = 3 minutes;

    // (nft ID => prices as CHAMP wei) mapping of sales
    mapping(uint64 => uint256) private _sales;
    // (nft ID => Option) mapping of options
    mapping(uint64 => Option) private _options;
    // (nft ID => wallet => RateLimit) mapping of rate limit
    mapping(uint64 => mapping(address => RateLimit)) _rateLimits;
    // (wallet => Option) mapping of locks to prevent multiple options per wallet
    mapping(address => OptionLock) private _optionLock;

    // Percent fees applied on each sale. Stores sell and buy fees: 0-128bits buy fee, 128-256bits -> sell fee
    uint256 private _marketplacePercentFees;
    // Fees receiver address
    address private _marketplaceFeesReceiver;

    // (nft ID => address) mapping of reserved offers
    mapping(uint64 => address) private _reservedOffers;

    // Percent BURN fees
    uint256 private _marketplaceBurnPercentFees;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address champTokenAddress, address nfChampAddress)
        public
        initializer
    {
        _CHAMP_TOKEN_CONTRACT = IERC20Upgradeable(champTokenAddress);
        _NFCHAMP_CONTRACT = IERC721Upgradeable(nfChampAddress);

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(FEE_MANAGER_ROLE, _msgSender());
        _setupRole(OPTION_ROLE, _msgSender());
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
        returns (
            uint256 sellerShare,
            uint256 marketplaceSellFeeShare,
            uint256 marketplaceBuyFeeShare,
            uint256 marketplaceBurnFeeShare
        )
    {
        (
            uint128 sellFee,
            uint128 buyFee,
            uint256 burnFee
        ) = marketplacePercentFees();
        marketplaceSellFeeShare = weiPrice.mul(sellFee).div(100);
        marketplaceBuyFeeShare = weiPrice.mul(buyFee).div(100);
        marketplaceBurnFeeShare = weiPrice.mul(burnFee).div(100);
        sellerShare = weiPrice.sub(marketplaceSellFeeShare).sub(
            marketplaceBurnFeeShare
        );
    }

    /**
     * @dev See _createSaleFrom(address,uint64,uint256,address)
     */
    function createSaleFrom(
        address from,
        uint64 tokenId,
        uint256 tokenWeiPrice
    ) external {
        _createSaleFrom(from, tokenId, tokenWeiPrice, address(0));
    }

    /**
     * @dev See _createSaleFrom(address,uint64,uint256,address)
     */
    function createSaleFrom(
        address from,
        uint64 tokenId,
        uint256 tokenWeiPrice,
        address reserve
    ) external {
        require(
            reserve != address(0),
            "ChampMarketplace: Cant not create reserved sale for 0 address"
        );

        _createSaleFrom(from, tokenId, tokenWeiPrice, reserve);
    }

    /**
     * @dev See _acceptSale(uint64,uint256,address)
     */
    function acceptSale(uint64 tokenId, uint256 salePrice) external {
        _acceptSale(tokenId, salePrice, msg.sender);
    }

    /**
     * @dev See _acceptSale(uint64,uint256,address)
     */
    function acceptSale(
        uint64 tokenId,
        uint256 salePrice,
        address nftReceiver
    ) external {
        _acceptSale(tokenId, salePrice, nftReceiver);
    }

    /**
     * @dev Allow to destroy a sale for a given NFCHAMP ID.
     *
     * Emits a {SaleDestroyed} event.
     *
     * Requirements:
     *
     * - NFCHAMP ID should be on sale.
     * - from can interact with the sale.
     * - from must be the NFCHAMP owner.
     * - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner.
     * - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     */
    function destroySaleFrom(address from, uint64 tokenId) external {
        require(hasSale(tokenId), "ChampMarketplace: Sale does not exists");
        require(
            canInteract(from, tokenId),
            "ChampMarketplace: An option exists on this sale"
        );
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

        if (_reservedOffers[tokenId] != address(0)) {
            delete _reservedOffers[tokenId];
        }

        emit SaleDestroyed(tokenId, nftOwner);
    }

    /**
     * @dev Allow to update a sale for a given NFCHAMP ID at a given CHAMP wei price.
     *
     * Emits a {SaleUpdated} event.
     *
     * Requirements:
     *
     * - NFCHAMP ID should be on sale.
     * - from can interact with the sale.
     * - tokenWeiPrice should be strictly positive.
     * - reserve address must be different than from.
     * - from must be the NFCHAMP owner.
     * - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner.
     * - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     */
    function updateSaleFrom(
        address from,
        uint64 tokenId,
        uint256 tokenWeiPrice,
        address reserve
    ) external {
        require(hasSale(tokenId), "ChampMarketplace: Sale does not exists");
        require(
            canInteract(from, tokenId),
            "ChampMarketplace: An option exists on this sale"
        );
        address nftOwner = _NFCHAMP_CONTRACT.ownerOf(tokenId);
        require(
            nftOwner == from,
            "ChampMarketplace: Update sale of token that is not own"
        );
        require(
            nftOwner == msg.sender ||
                _NFCHAMP_CONTRACT.isApprovedForAll(nftOwner, msg.sender),
            "ChampMarketplace: Only the token owner or its operator are allowed to update a sale."
        );
        require(
            tokenWeiPrice > 0,
            "ChampMarketplace: Price should be strictly positive"
        );
        require(
            nftOwner != reserve,
            "ChampMarketplace: Can not reserve sale for token owner."
        );

        _sales[tokenId] = tokenWeiPrice;
        _reservedOffers[tokenId] = reserve;

        emit SaleUpdated(tokenId, tokenWeiPrice, nftOwner, reserve);
    }

    /**
     * @return Buyer that have an option on the sale.
     * @return Option is active until this timestamp.
     */
    function getOption(uint64 tokenId) public view returns (address, uint256) {
        Option memory option = _getOption(tokenId);
        return (option.buyer, option.until);
    }

    /**
     * @dev Returns the CHAMP wei price to buy a given NFCHAMP ID and the address for which
     * the sale is reserved. If the returned address is the 0 address, that means the sale is public.
     *
     * If the sale does not exists, the function returns a wei price of 0.
     */
    function getSale(uint64 tokenId) public view returns (uint256, address) {
        if (_NFCHAMP_CONTRACT.getApproved(tokenId) != address(this)) {
            return (0, address(0));
        }
        return (_sales[tokenId], _reservedOffers[tokenId]);
    }

    /**
     * @dev Returns the CHAMP wei price to buy a given NFCHAMP ID with included buyer fees.
     *
     * If the sale does not exists, the function returns a wei price of 0.
     */
    function getBuyerSalePrice(uint64 tokenId) public view returns (uint256) {
        if (_NFCHAMP_CONTRACT.getApproved(tokenId) != address(this)) {
            return 0;
        }

        (, , uint256 marketplaceBuyFeeShare, ) = computeSaleShares(
            _sales[tokenId]
        );
        return _sales[tokenId] + marketplaceBuyFeeShare;
    }

    /**
     * Returns true if the given address has an option on a sale for the specified NFT.
     * If no option is set on the sale, it means that anyone can purchase the NFT.
     *
     * @param from the address to check for an option
     * @param tokenId the ID of the NFT to check for an option
     * @return true if the given address has an option on the sale, or false if no option is set or if the option is held by a different address
     */
    function hasOption(address from, uint64 tokenId)
        public
        view
        returns (bool)
    {
        Option memory option = _getOption(tokenId);
        return option.buyer == from;
    }

    /**
     * Returns true if the given address has a reserved offer on a sale of the specified NFT.
     * If the sale is not reserved for a specific buyer, it means that anyone can purchase the NFT.
     *
     * @param from the address to check for a reservation
     * @param tokenId the ID of the NFT to check for a reserved offer
     * @return true if the given address has a reserved offer on the sale, or false if no reservation is set or if the reserve is held by a different address
     */
    function hasReservedOffer(address from, uint64 tokenId)
        public
        view
        returns (bool)
    {
        return _reservedOffers[tokenId] == from;
    }

    /**
     * @dev Returns true if a tokenID is on sale.
     */
    function hasSale(uint64 tokenId) public view returns (bool) {
        (uint256 salePrice, ) = getSale(tokenId);
        return salePrice > 0;
    }

    /**
     * @dev Getter for the marketplace fees receiver address.
     */
    function marketplaceFeesReceiver() public view returns (address) {
        return _marketplaceFeesReceiver;
    }

    /**
     * @dev Getter for the marketplace fees.
     */
    function marketplacePercentFees()
        public
        view
        returns (
            uint128 sellFee,
            uint128 buyFee,
            uint256 burnFee
        )
    {
        sellFee = uint128(_marketplacePercentFees >> 128);
        buyFee = uint128(_marketplacePercentFees);
        burnFee = _marketplaceBurnPercentFees;
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
     * @dev Setter for the marketplace fees.
     *
     * Emits a {MarketplaceFeesUpdated} event.
     *
     * Requirements:
     *
     * - Sum of nMarketplaceSellPercentFees and nMarketplaceBurnPercentFees must be an integer between 0 and 100 included.
     * - Caller must have role FEE_MANAGER_ROLE.
     */
    function setMarketplacePercentFees(
        uint128 nMarketplaceSellPercentFees,
        uint128 nMarketplaceBuyPercentFees,
        uint256 nMarketplaceBurnPercentFees
    ) external onlyRole(FEE_MANAGER_ROLE) {
        require(
            nMarketplaceSellPercentFees + nMarketplaceBurnPercentFees <= 100,
            "ChampMarketplace: total marketplace sell and burn fees should be below 100"
        );
        _marketplacePercentFees =
            (uint256(nMarketplaceSellPercentFees) << 128) |
            uint256(nMarketplaceBuyPercentFees);
        _marketplaceBurnPercentFees = nMarketplaceBurnPercentFees;

        emit MarketplaceFeesUpdated(
            nMarketplaceSellPercentFees,
            nMarketplaceBuyPercentFees,
            nMarketplaceBurnPercentFees
        );
    }

    /**
     * @dev Set an option on a sale.
     *
     * Emits a {OptionSet} event.
     *
     * Requirements:
     *
     * - msg.sender should be an authorized operator of from
     * - NFCHAMP ID should be on sale.
     * - from can interact with the sale.
     * - from should not have any other active option.
     * - from should not be rate limited.
     */
    function setOption(address from, uint64 tokenId)
        public
        onlyRole(OPTION_ROLE)
    {
        require(hasSale(tokenId), "ChampMarketplace: Sale does not exists");
        require(
            canInteract(from, tokenId),
            "ChampMarketplace: An option exists on this sale"
        );
        require(
            _optionLock[from].tokenId == 0 ||
                _optionLock[from].tokenId == tokenId ||
                _optionLock[from].until < block.timestamp,
            "ChampMarketplace: Cannot set an option on multiple sales at the same time"
        );
        require(
            _consumeRateLimit(from, tokenId) <= _RATE_LIMIT_MAX_RENEW,
            "ChampMarketplace: Rate limit reached"
        );

        Option memory option = _getOption(tokenId);
        uint256 previousUntil = option.until == 0
            ? block.timestamp
            : option.until;

        _options[tokenId].until = previousUntil + _OPTION_TIME;
        _options[tokenId].buyer = from;

        // Set a global lock for from to prevent multiple options at the same time.
        _optionLock[from] = OptionLock(tokenId, _options[tokenId].until);

        emit OptionSet(
            tokenId,
            _options[tokenId].buyer,
            _options[tokenId].until
        );
    }

    /**
     * Returns true if the given address is allowed to interact with the specified NFT.
     * If no option is set on the sale, it means that anyone can interact with the NFT.
     *
     * @param from the address to check for permission to interact
     * @param tokenId the ID of the NFT to check for interaction permission
     * @return true if the given address is allowed to interact with the NFT, or false if an option is set on the sale and held by a different address
     */
    function canInteract(address from, uint64 tokenId)
        public
        view
        returns (bool)
    {
        Option memory option = _getOption(tokenId);
        return option.buyer == address(0) || option.buyer == from;
    }

    /**
     * Returns true if the given address is allowed to accept a sale of the given NFT.
     * If no reservation is set on the sale, it means that anyone can buy the NFT.
     *
     * @param from the address to test for the permission to buy the NFT,
     * @param tokenId the ID of the NFT to check for buy permission
     * @return true if the given address is allowed to buy the NFT, or false if a reservation is set on the sale and held by a different address
     */
    function isReservationOpenFor(address from, uint64 tokenId)
        public
        view
        returns (bool)
    {
        return
            _reservedOffers[tokenId] == address(0) ||
            _reservedOffers[tokenId] == from;
    }

    /**
     * @dev Update rate limitation for a given wallet and a given tokenId.
     * @return Updated rate limit.
     */
    function _consumeRateLimit(address from, uint64 tokenId)
        private
        returns (uint8)
    {
        // We should reset rate limit if previous one is outdated.
        bool shouldReset = _rateLimits[tokenId][from].until < block.timestamp;

        uint256 previousUntil = shouldReset
            ? block.timestamp
            : _rateLimits[tokenId][from].until;
        uint8 previousRenew = shouldReset
            ? 0
            : _rateLimits[tokenId][from].renew;

        _rateLimits[tokenId][from].until = previousUntil + _RATE_LIMIT_TIME;
        _rateLimits[tokenId][from].renew = previousRenew + 1;

        return _rateLimits[tokenId][from].renew;
    }

    /**
     * @return Active option for a given tokenId.
     */
    function _getOption(uint64 tokenId) internal view returns (Option memory) {
        if (_options[tokenId].until < block.timestamp) {
            return Option(address(0), 0);
        }
        return _options[tokenId];
    }

    /**
     * @dev Unset an option before it expires and remove all limitation for this wallet.
     *
     * Emits a {OptionSet} event.
     *
     * Requirements:
     *
     * - Option must exists for this wallet.
     */
    function _unsetOption(address from, uint64 tokenId) private {
        require(
            hasOption(from, tokenId),
            "ChampMarketplace: Option does not exists"
        );

        delete _options[tokenId];
        delete _rateLimits[tokenId][from];
        delete _optionLock[from];

        emit OptionSet(tokenId, from, 0);
    }

    /**
     * @dev Allow to create a reserved sale for a given NFCHAMP ID at a given CHAMP wei price.
     *
     * Only the `reserve` address is allowed to accept the new sale offer. If `reserve` is the 0 address
     * that means the sale is public and anyone can accept the sale offer.
     *
     * Emits a {SaleCreated} event.
     *
     * Requirements:
     *
     * - tokenWeiPrice should be strictly positive.
     * - reserve address must not be the same as NFCHAMP owner.
     * - from must be the NFCHAMP owner.
     * - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner.
     * - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     * - NFCHAMP ID should not be on sale.
     */
    function _createSaleFrom(
        address from,
        uint64 tokenId,
        uint256 tokenWeiPrice,
        address reserve
    ) private {
        require(
            tokenWeiPrice > 0,
            "ChampMarketplace: Price should be strictly positive"
        );

        address nftOwner = _NFCHAMP_CONTRACT.ownerOf(tokenId);
        require(
            nftOwner != reserve,
            "ChampMarketplace: Can not reserve sale for token owner."
        );
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

        if (reserve != address(0)) {
            _reservedOffers[tokenId] = reserve;
        }

        emit SaleCreated(tokenId, tokenWeiPrice, nftOwner, reserve);
    }

    /**
     * @dev Allow to accept a sale for a given NFCHAMP ID at a given CHAMP wei price. NFCHAMP will be sent to nftReceiver wallet.
     *
     * This function is used to buy a NFCHAMP listed on the ChampMarketplace contract.
     * To buy a NFCHAMP, a CHAMP holder must approve ChampMarketplace contract as a spender.
     *
     * Once a NFT is sold, a fee will be applied on the CHAMP payment and forwarded
     * to the marketplace fees receiver.
     *
     * Emits a {SaleAccepted} event.
     *
     * Requirements:
     *
     * - NFCHAMP ID must be on sale.
     * - salePrice must match sale price.
     * - nftReceiver can interact with the sale.
     * - sale reservation is open for nftReceiver.
     * - ChampMarketplace allowance must be greater than sale price including buy fees.
     */
    function _acceptSale(
        uint64 tokenId,
        uint256 salePrice_,
        address nftReceiver
    ) private {
        (uint256 salePrice, ) = getSale(tokenId);

        //
        // 1.
        // Requirements
        //
        require(hasSale(tokenId), "ChampMarketplace: Sale does not exists");
        require(
            salePrice_ == salePrice,
            "ChampMarketplace: Sale price does not match"
        );
        require(
            canInteract(nftReceiver, tokenId),
            "ChampMarketplace: An option exists on this sale"
        );
        require(
            isReservationOpenFor(nftReceiver, tokenId),
            "ChampMarketplace: A reservation exists for this sale"
        );

        //
        // 2.
        // Process sale
        //
        address seller = _NFCHAMP_CONTRACT.ownerOf(tokenId);
        (
            uint256 sellerShare,
            uint256 marketplaceSellFeeShare,
            uint256 marketplaceBuyFeeShare,
            uint256 marketplaceBurnFeeShare
        ) = computeSaleShares(salePrice);

        require(
            _CHAMP_TOKEN_CONTRACT.allowance(msg.sender, address(this)) >=
                salePrice + marketplaceBuyFeeShare,
            "ChampMarketplace: Allowance is lower than buyer sale price"
        );

        //
        // 3.
        // Execute sale
        //
        delete _sales[tokenId];

        _NFCHAMP_CONTRACT.safeTransferFrom(seller, nftReceiver, tokenId);
        _CHAMP_TOKEN_CONTRACT.safeTransferFrom(msg.sender, seller, sellerShare);

        uint256 marketplaceFeesShare = marketplaceSellFeeShare +
            marketplaceBuyFeeShare;
        if (marketplaceFeesShare > 0) {
            _CHAMP_TOKEN_CONTRACT.safeTransferFrom(
                msg.sender,
                marketplaceFeesReceiver(),
                marketplaceFeesShare
            );
        }
        if (marketplaceBurnFeeShare > 0) {
            _CHAMP_TOKEN_CONTRACT.safeTransferFrom(
                msg.sender,
                0x000000000000000000000000000000000000dEaD,
                marketplaceBurnFeeShare
            );
        }

        //
        // 4.
        // Clean state
        //
        if (hasOption(nftReceiver, tokenId)) {
            _unsetOption(nftReceiver, tokenId);
        }
        if (_reservedOffers[tokenId] != address(0)) {
            delete _reservedOffers[tokenId];
        }

        emit SaleAccepted(tokenId, salePrice, seller, nftReceiver);
    }

    event MarketplaceFeesUpdated(
        uint128 sellerPercentFees,
        uint128 buyerPercentFees,
        uint256 burnPercentFees
    );

    event MarketplaceFeesReceiverUpdated(address feesReceiver);

    event SaleCreated(
        uint64 tokenId,
        uint256 tokenWeiPrice,
        address seller,
        address reserve
    );

    event SaleUpdated(
        uint64 tokenId,
        uint256 tokenWeiPrice,
        address seller,
        address reserve
    );

    event SaleAccepted(
        uint64 tokenId,
        uint256 tokenWeiPrice,
        address seller,
        address buyer
    );

    event SaleDestroyed(uint64 tokenId, address seller);

    event OptionSet(uint64 tokenId, address buyer, uint256 until);

    uint256[50] __gap;
}
