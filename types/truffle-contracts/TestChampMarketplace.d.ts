/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface TestChampMarketplaceContract
  extends Truffle.Contract<TestChampMarketplaceInstance> {
  "new"(
    meta?: Truffle.TransactionDetails
  ): Promise<TestChampMarketplaceInstance>;
}

export interface Initialized {
  name: "Initialized";
  args: {
    version: BN;
    0: BN;
  };
}

export interface MarketplaceFeesReceiverUpdated {
  name: "MarketplaceFeesReceiverUpdated";
  args: {
    feesReceiver: string;
    0: string;
  };
}

export interface MarketplaceFeesUpdated {
  name: "MarketplaceFeesUpdated";
  args: {
    percentFees: BN;
    0: BN;
  };
}

export interface OptionSet {
  name: "OptionSet";
  args: {
    tokenId: BN;
    buyer: string;
    until: BN;
    0: BN;
    1: string;
    2: BN;
  };
}

export interface RoleAdminChanged {
  name: "RoleAdminChanged";
  args: {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface RoleGranted {
  name: "RoleGranted";
  args: {
    role: string;
    account: string;
    sender: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface RoleRevoked {
  name: "RoleRevoked";
  args: {
    role: string;
    account: string;
    sender: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface SaleAccepted {
  name: "SaleAccepted";
  args: {
    tokenId: BN;
    tokenWeiPrice: BN;
    seller: string;
    buyer: string;
    0: BN;
    1: BN;
    2: string;
    3: string;
  };
}

export interface SaleCreated {
  name: "SaleCreated";
  args: {
    tokenId: BN;
    tokenWeiPrice: BN;
    seller: string;
    0: BN;
    1: BN;
    2: string;
  };
}

export interface SaleDestroyed {
  name: "SaleDestroyed";
  args: {
    tokenId: BN;
    seller: string;
    0: BN;
    1: string;
  };
}

export interface SaleUpdated {
  name: "SaleUpdated";
  args: {
    tokenId: BN;
    tokenWeiPrice: BN;
    seller: string;
    0: BN;
    1: BN;
    2: string;
  };
}

type AllEvents =
  | Initialized
  | MarketplaceFeesReceiverUpdated
  | MarketplaceFeesUpdated
  | OptionSet
  | RoleAdminChanged
  | RoleGranted
  | RoleRevoked
  | SaleAccepted
  | SaleCreated
  | SaleDestroyed
  | SaleUpdated;

export interface TestChampMarketplaceInstance extends Truffle.ContractInstance {
  DEFAULT_ADMIN_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  FEE_MANAGER_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  OPTION_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  _CHAMP_TOKEN_CONTRACT(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  _NFCHAMP_CONTRACT(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * Returns true if the given address is allowed to interact with the specified NFT. If no option is set on the sale, it means that anyone can interact with the NFT.
   * @param from the address to check for permission to interact
   * @param tokenId the ID of the NFT to check for interaction permission
   */
  canInteract(
    from: string,
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Compute the current share for a given price. Remainder is given to the seller. Return a tuple of wei: - First element is CHAMP wei for the seller. - Second element is CHAMP wei fee.
   */
  computeSaleShares(
    weiPrice: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: BN; 1: BN }>;

  /**
   * Allow to create a sale for a given NFCHAMP ID at a given CHAMP wei price. Emits a {SaleCreated} event. Requirements: - tokenWeiPrice should be strictly positive. - from must be the NFCHAMP owner. - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner. - ChampMarketplace contract should be approved for the given NFCHAMP ID. - NFCHAMP ID should not be on sale.
   */
  createSaleFrom: {
    (
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Allow to destroy a sale for a given NFCHAMP ID. Emits a {SaleDestroyed} event. Requirements: - NFCHAMP ID should be on sale. - from can interact with the sale. - from must be the NFCHAMP owner. - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner. - ChampMarketplace contract should be approved for the given NFCHAMP ID.
   */
  destroySaleFrom: {
    (
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   */
  getOption(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<{ 0: string; 1: BN }>;

  /**
   * Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.
   */
  getRoleAdmin(
    role: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.
   */
  getRoleMember(
    role: string,
    index: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.
   */
  getRoleMemberCount(
    role: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Returns the CHAMP wei price to buy a given NFCHAMP ID. If the sale does not exists, the function returns 0.
   */
  getSale(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event.
   */
  grantRole: {
    (
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Returns true if the given address has an option on a sale for the specified NFT. If no option is set on the sale, it means that anyone can purchase the NFT.
   * @param from the address to check for an option
   * @param tokenId the ID of the NFT to check for an option
   */
  hasOption(
    from: string,
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Returns `true` if `account` has been granted `role`.
   */
  hasRole(
    role: string,
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Returns true if a tokenID is on sale.
   */
  hasSale(
    tokenId: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  initialize: {
    (
      champTokenAddress: string,
      nfChampAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      champTokenAddress: string,
      nfChampAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      champTokenAddress: string,
      nfChampAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      champTokenAddress: string,
      nfChampAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Getter for the marketplace fees receiver address.
   */
  marketplaceFeesReceiver(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Getter for the marketplace fees.
   */
  marketplacePercentFees(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.
   */
  renounceRole: {
    (
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event.
   */
  revokeRole: {
    (
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Setter for the marketplace fees receiver address. Emits a {MarketplaceFeesReceiverUpdated} event. Requirements: - Caller must have role FEE_MANAGER_ROLE.
   */
  setMarketplaceFeesReceiver: {
    (
      nMarketplaceFeesReceiver: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      nMarketplaceFeesReceiver: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      nMarketplaceFeesReceiver: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      nMarketplaceFeesReceiver: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Setter for the marketplace fees. Emits a {MarketplaceFeesUpdated} event. Requirements: - nMarketplacePercentFees must be a percentage (Between 0 and 100 included). - Caller must have role FEE_MANAGER_ROLE.
   */
  setMarketplacePercentFees: {
    (
      nMarketplacePercentFees: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      nMarketplacePercentFees: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      nMarketplacePercentFees: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      nMarketplacePercentFees: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Set an option on a sale. Emits a {OptionSet} event. Requirements: - msg.sender should be an authorized operator of from - NFCHAMP ID should be on sale. - from can interact with the sale. - from should not have any other active option. - from should not be rate limited.
   */
  setOption: {
    (
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface(
    interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Called by an {IERC777} CHAMP token contract whenever tokens are being sent to the ChampMarketplace contract. This function is used to buy a NFCHAMP listed on the ChampMarketplace contract. To buy a NFCHAMP, a CHAMP holder must send CHAMP wei price (or above) to the ChampMarketplace contract with some extra data: - MANDATORY: Bytes 0 to 7 (8 bytes, uint64) corresponds to the NFCHAMP ID to buy - OPTIONAL: Bytes 8 to 27 (20 bytes, address) can be provided to customize the wallet that will receive the NFCHAMP if the sale is executed. Once a NFT is sold, a fee will be applied on the CHAMP payment and forwarded to the marketplace fees receiver. Emits a {SaleAccepted} event. Requirements: - Received tokens must be CHAMP. - NFCHAMP ID must be on sale. - nftReceiver can interact with the sale. - Received tokens amount must be greater than sale price.
   */
  tokensReceived: {
    (
      arg0: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      arg0: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      arg0: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      arg0: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Allow to update a sale for a given NFCHAMP ID at a given CHAMP wei price. Emits a {SaleUpdated} event. Requirements: - NFCHAMP ID should be on sale. - from can interact with the sale. - tokenWeiPrice should be strictly positive. - from must be the NFCHAMP owner. - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner. - ChampMarketplace contract should be approved for the given NFCHAMP ID.
   */
  updateSaleFrom: {
    (
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      from: string,
      tokenId: number | BN | string,
      tokenWeiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    DEFAULT_ADMIN_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    FEE_MANAGER_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    OPTION_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    _CHAMP_TOKEN_CONTRACT(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    _NFCHAMP_CONTRACT(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * Returns true if the given address is allowed to interact with the specified NFT. If no option is set on the sale, it means that anyone can interact with the NFT.
     * @param from the address to check for permission to interact
     * @param tokenId the ID of the NFT to check for interaction permission
     */
    canInteract(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Compute the current share for a given price. Remainder is given to the seller. Return a tuple of wei: - First element is CHAMP wei for the seller. - Second element is CHAMP wei fee.
     */
    computeSaleShares(
      weiPrice: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: BN; 1: BN }>;

    /**
     * Allow to create a sale for a given NFCHAMP ID at a given CHAMP wei price. Emits a {SaleCreated} event. Requirements: - tokenWeiPrice should be strictly positive. - from must be the NFCHAMP owner. - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner. - ChampMarketplace contract should be approved for the given NFCHAMP ID. - NFCHAMP ID should not be on sale.
     */
    createSaleFrom: {
      (
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Allow to destroy a sale for a given NFCHAMP ID. Emits a {SaleDestroyed} event. Requirements: - NFCHAMP ID should be on sale. - from can interact with the sale. - from must be the NFCHAMP owner. - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner. - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     */
    destroySaleFrom: {
      (
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     */
    getOption(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<{ 0: string; 1: BN }>;

    /**
     * Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role's admin, use {_setRoleAdmin}.
     */
    getRoleAdmin(
      role: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Returns one of the accounts that have `role`. `index` must be a value between 0 and {getRoleMemberCount}, non-inclusive. Role bearers are not sorted in any particular way, and their ordering may change at any point. WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure you perform all queries on the same block. See the following https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post] for more information.
     */
    getRoleMember(
      role: string,
      index: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Returns the number of accounts that have `role`. Can be used together with {getRoleMember} to enumerate all bearers of a role.
     */
    getRoleMemberCount(
      role: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Returns the CHAMP wei price to buy a given NFCHAMP ID. If the sale does not exists, the function returns 0.
     */
    getSale(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleGranted} event.
     */
    grantRole: {
      (
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Returns true if the given address has an option on a sale for the specified NFT. If no option is set on the sale, it means that anyone can purchase the NFT.
     * @param from the address to check for an option
     * @param tokenId the ID of the NFT to check for an option
     */
    hasOption(
      from: string,
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Returns `true` if `account` has been granted `role`.
     */
    hasRole(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Returns true if a tokenID is on sale.
     */
    hasSale(
      tokenId: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    initialize: {
      (
        champTokenAddress: string,
        nfChampAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        champTokenAddress: string,
        nfChampAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        champTokenAddress: string,
        nfChampAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        champTokenAddress: string,
        nfChampAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Getter for the marketplace fees receiver address.
     */
    marketplaceFeesReceiver(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Getter for the marketplace fees.
     */
    marketplacePercentFees(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`. May emit a {RoleRevoked} event.
     */
    renounceRole: {
      (
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role. May emit a {RoleRevoked} event.
     */
    revokeRole: {
      (
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        role: string,
        account: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Setter for the marketplace fees receiver address. Emits a {MarketplaceFeesReceiverUpdated} event. Requirements: - Caller must have role FEE_MANAGER_ROLE.
     */
    setMarketplaceFeesReceiver: {
      (
        nMarketplaceFeesReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        nMarketplaceFeesReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        nMarketplaceFeesReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        nMarketplaceFeesReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Setter for the marketplace fees. Emits a {MarketplaceFeesUpdated} event. Requirements: - nMarketplacePercentFees must be a percentage (Between 0 and 100 included). - Caller must have role FEE_MANAGER_ROLE.
     */
    setMarketplacePercentFees: {
      (
        nMarketplacePercentFees: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        nMarketplacePercentFees: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        nMarketplacePercentFees: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        nMarketplacePercentFees: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Set an option on a sale. Emits a {OptionSet} event. Requirements: - msg.sender should be an authorized operator of from - NFCHAMP ID should be on sale. - from can interact with the sale. - from should not have any other active option. - from should not be rate limited.
     */
    setOption: {
      (
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        tokenId: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Called by an {IERC777} CHAMP token contract whenever tokens are being sent to the ChampMarketplace contract. This function is used to buy a NFCHAMP listed on the ChampMarketplace contract. To buy a NFCHAMP, a CHAMP holder must send CHAMP wei price (or above) to the ChampMarketplace contract with some extra data: - MANDATORY: Bytes 0 to 7 (8 bytes, uint64) corresponds to the NFCHAMP ID to buy - OPTIONAL: Bytes 8 to 27 (20 bytes, address) can be provided to customize the wallet that will receive the NFCHAMP if the sale is executed. Once a NFT is sold, a fee will be applied on the CHAMP payment and forwarded to the marketplace fees receiver. Emits a {SaleAccepted} event. Requirements: - Received tokens must be CHAMP. - NFCHAMP ID must be on sale. - nftReceiver can interact with the sale. - Received tokens amount must be greater than sale price.
     */
    tokensReceived: {
      (
        arg0: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        arg0: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        arg0: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        arg0: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Allow to update a sale for a given NFCHAMP ID at a given CHAMP wei price. Emits a {SaleUpdated} event. Requirements: - NFCHAMP ID should be on sale. - from can interact with the sale. - tokenWeiPrice should be strictly positive. - from must be the NFCHAMP owner. - msg.sender should be either the NFCHAMP owner or approved by the NFCHAMP owner. - ChampMarketplace contract should be approved for the given NFCHAMP ID.
     */
    updateSaleFrom: {
      (
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        from: string,
        tokenId: number | BN | string,
        tokenWeiPrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See _acceptSale(uint64,uint256,address)
     */
    "acceptSale(uint64,uint256)": {
      (
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See _acceptSale(uint64,uint256,address)
     */
    "acceptSale(uint64,uint256,address)": {
      (
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        nftReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        nftReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        nftReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        tokenId: number | BN | string,
        salePrice: number | BN | string,
        nftReceiver: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
