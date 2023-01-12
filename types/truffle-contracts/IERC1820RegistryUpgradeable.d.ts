/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IERC1820RegistryUpgradeableContract
  extends Truffle.Contract<IERC1820RegistryUpgradeableInstance> {
  "new"(
    meta?: Truffle.TransactionDetails
  ): Promise<IERC1820RegistryUpgradeableInstance>;
}

export interface InterfaceImplementerSet {
  name: "InterfaceImplementerSet";
  args: {
    account: string;
    interfaceHash: string;
    implementer: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface ManagerChanged {
  name: "ManagerChanged";
  args: {
    account: string;
    newManager: string;
    0: string;
    1: string;
  };
}

type AllEvents = InterfaceImplementerSet | ManagerChanged;

export interface IERC1820RegistryUpgradeableInstance
  extends Truffle.ContractInstance {
  /**
   * Sets `newManager` as the manager for `account`. A manager of an account is able to set interface implementers for it. By default, each account is its own manager. Passing a value of `0x0` in `newManager` will reset the manager to this initial state. Emits a {ManagerChanged} event. Requirements: - the caller must be the current manager for `account`.
   */
  setManager: {
    (
      account: string,
      newManager: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      account: string,
      newManager: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      account: string,
      newManager: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      account: string,
      newManager: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Returns the manager for `account`. See {setManager}.
   */
  getManager(
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Sets the `implementer` contract as ``account``'s implementer for `interfaceHash`. `account` being the zero address is an alias for the caller's address. The zero address can also be used in `implementer` to remove an old one. See {interfaceHash} to learn how these are created. Emits an {InterfaceImplementerSet} event. Requirements: - the caller must be the current manager for `account`. - `interfaceHash` must not be an {IERC165} interface id (i.e. it must not end in 28 zeroes). - `implementer` must implement {IERC1820Implementer} and return true when queried for support, unless `implementer` is the caller. See {IERC1820Implementer-canImplementInterfaceForAddress}.
   */
  setInterfaceImplementer: {
    (
      account: string,
      _interfaceHash: string,
      implementer: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      account: string,
      _interfaceHash: string,
      implementer: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      account: string,
      _interfaceHash: string,
      implementer: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      account: string,
      _interfaceHash: string,
      implementer: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Returns the implementer of `interfaceHash` for `account`. If no such implementer is registered, returns the zero address. If `interfaceHash` is an {IERC165} interface id (i.e. it ends with 28 zeroes), `account` will be queried for support of it. `account` being the zero address is an alias for the caller's address.
   */
  getInterfaceImplementer(
    account: string,
    _interfaceHash: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Returns the interface hash for an `interfaceName`, as defined in the corresponding https://eips.ethereum.org/EIPS/eip-1820#interface-name[section of the EIP].
   */
  interfaceHash(
    interfaceName: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  /**
   * Updates the cache with whether the contract implements an ERC165 interface or not.
   * @param account Address of the contract for which to update the cache.
   * @param interfaceId ERC165 interface for which to update the cache.
   */
  updateERC165Cache: {
    (
      account: string,
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      account: string,
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      account: string,
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      account: string,
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Checks whether a contract implements an ERC165 interface or not. If the result is not cached a direct lookup on the contract address is performed. If the result is not cached or the cached value is out-of-date, the cache MUST be updated manually by calling {updateERC165Cache} with the contract address.
   * @param account Address of the contract to check.
   * @param interfaceId ERC165 interface to check.
   */
  implementsERC165Interface(
    account: string,
    interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Checks whether a contract implements an ERC165 interface or not without using or updating the cache.
   * @param account Address of the contract to check.
   * @param interfaceId ERC165 interface to check.
   */
  implementsERC165InterfaceNoCache(
    account: string,
    interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  methods: {
    /**
     * Sets `newManager` as the manager for `account`. A manager of an account is able to set interface implementers for it. By default, each account is its own manager. Passing a value of `0x0` in `newManager` will reset the manager to this initial state. Emits a {ManagerChanged} event. Requirements: - the caller must be the current manager for `account`.
     */
    setManager: {
      (
        account: string,
        newManager: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        account: string,
        newManager: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        account: string,
        newManager: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        account: string,
        newManager: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Returns the manager for `account`. See {setManager}.
     */
    getManager(
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Sets the `implementer` contract as ``account``'s implementer for `interfaceHash`. `account` being the zero address is an alias for the caller's address. The zero address can also be used in `implementer` to remove an old one. See {interfaceHash} to learn how these are created. Emits an {InterfaceImplementerSet} event. Requirements: - the caller must be the current manager for `account`. - `interfaceHash` must not be an {IERC165} interface id (i.e. it must not end in 28 zeroes). - `implementer` must implement {IERC1820Implementer} and return true when queried for support, unless `implementer` is the caller. See {IERC1820Implementer-canImplementInterfaceForAddress}.
     */
    setInterfaceImplementer: {
      (
        account: string,
        _interfaceHash: string,
        implementer: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        account: string,
        _interfaceHash: string,
        implementer: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        account: string,
        _interfaceHash: string,
        implementer: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        account: string,
        _interfaceHash: string,
        implementer: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Returns the implementer of `interfaceHash` for `account`. If no such implementer is registered, returns the zero address. If `interfaceHash` is an {IERC165} interface id (i.e. it ends with 28 zeroes), `account` will be queried for support of it. `account` being the zero address is an alias for the caller's address.
     */
    getInterfaceImplementer(
      account: string,
      _interfaceHash: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Returns the interface hash for an `interfaceName`, as defined in the corresponding https://eips.ethereum.org/EIPS/eip-1820#interface-name[section of the EIP].
     */
    interfaceHash(
      interfaceName: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    /**
     * Updates the cache with whether the contract implements an ERC165 interface or not.
     * @param account Address of the contract for which to update the cache.
     * @param interfaceId ERC165 interface for which to update the cache.
     */
    updateERC165Cache: {
      (
        account: string,
        interfaceId: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        account: string,
        interfaceId: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        account: string,
        interfaceId: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        account: string,
        interfaceId: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Checks whether a contract implements an ERC165 interface or not. If the result is not cached a direct lookup on the contract address is performed. If the result is not cached or the cached value is out-of-date, the cache MUST be updated manually by calling {updateERC165Cache} with the contract address.
     * @param account Address of the contract to check.
     * @param interfaceId ERC165 interface to check.
     */
    implementsERC165Interface(
      account: string,
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Checks whether a contract implements an ERC165 interface or not without using or updating the cache.
     * @param account Address of the contract to check.
     * @param interfaceId ERC165 interface to check.
     */
    implementsERC165InterfaceNoCache(
      account: string,
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
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