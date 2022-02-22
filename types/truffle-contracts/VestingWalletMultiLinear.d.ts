/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface VestingWalletMultiLinearContract
  extends Truffle.Contract<VestingWalletMultiLinearInstance> {
  "new"(
    beneficiaryAddress: string,
    startTimestamp: number | BN | string,
    meta?: Truffle.TransactionDetails
  ): Promise<VestingWalletMultiLinearInstance>;
}

export interface ERC20Released {
  name: "ERC20Released";
  args: {
    token: string;
    amount: BN;
    0: string;
    1: BN;
  };
}

export interface EtherReleased {
  name: "EtherReleased";
  args: {
    amount: BN;
    0: BN;
  };
}

export interface Locked {
  name: "Locked";
  args: {
    account: string;
    duration: BN;
    0: string;
    1: BN;
  };
}

export interface Paused {
  name: "Paused";
  args: {
    account: string;
    0: string;
  };
}

export interface PermanentlyLocked {
  name: "PermanentlyLocked";
  args: {
    account: string;
    0: string;
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

export interface Unpaused {
  name: "Unpaused";
  args: {
    account: string;
    0: string;
  };
}

type AllEvents =
  | ERC20Released
  | EtherReleased
  | Locked
  | Paused
  | PermanentlyLocked
  | RoleAdminChanged
  | RoleGranted
  | RoleRevoked
  | Unpaused;

export interface VestingWalletMultiLinearInstance
  extends Truffle.ContractInstance {
  BENEFICIARY_MANAGER_ROLE(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

  DEFAULT_ADMIN_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  PAUSER_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

  SCHEDULE_MANAGER_ROLE(
    txDetails?: Truffle.TransactionDetails
  ): Promise<string>;

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
   * Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role.
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
   * Returns `true` if `account` has been granted `role`.
   */
  hasRole(
    role: string,
    account: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * Getter for the lock end. Requirements: - The contract must be temporary locked.
   */
  lockEnd(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * Returns true if the contract is locked, and false otherwise.
   */
  locked(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  /**
   * Returns true if the contract is paused, and false otherwise.
   */
  paused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  /**
   * Getter for the permanently locked.
   */
  permanentlyLocked(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

  /**
   * Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`.
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
   * Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role.
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
   * Getter for the start timestamp.
   */
  start(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * See {IERC165-supportsInterface}.
   */
  supportsInterface(
    interfaceId: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * See {IERC777Recipient-tokensReceived}.
   */
  tokensReceived: {
    (
      arg0: string,
      arg1: string,
      arg2: string,
      arg3: number | BN | string,
      arg4: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      arg0: string,
      arg1: string,
      arg2: string,
      arg3: number | BN | string,
      arg4: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      arg0: string,
      arg1: string,
      arg2: string,
      arg3: number | BN | string,
      arg4: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      arg0: string,
      arg1: string,
      arg2: string,
      arg3: number | BN | string,
      arg4: string,
      arg5: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Pause token releases.
   */
  pause: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * Unpause token releases. Requirements: - Caller must have role PAUSER_ROLE.
   */
  unpause: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * Lock schedule edition for a duration. Requirements: - Caller must have role DEFAULT_ADMIN_ROLE.
   */
  lock: {
    (
      lockDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      lockDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      lockDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      lockDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Permanently lock schedule edition. Requirements: - Caller must have role DEFAULT_ADMIN_ROLE.
   */
  permanentLock: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * Getter for the beneficiary address.
   */
  beneficiary(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * Setter for the beneficiary address. Requirements: - Caller must have role BENEFICIARY_MANAGER_ROLE.
   */
  setBeneficiary: {
    (
      beneficiaryAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      beneficiaryAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      beneficiaryAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      beneficiaryAddress: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Add a step to the schedule. Requirements: - Caller must have role SCHEDULE_MANAGER_ROLE. - step percent sum should not go above 100.
   */
  addToSchedule: {
    (
      stepPercent: number | BN | string,
      stepDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      stepPercent: number | BN | string,
      stepDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      stepPercent: number | BN | string,
      stepDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      stepPercent: number | BN | string,
      stepDuration: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Delete all steps of the schedule. Requirements: - Caller must have role SCHEDULE_MANAGER_ROLE. - The contract must not be locked.
   */
  resetSchedule: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  /**
   * Getter for the step percent sum.
   */
  stepPercentSum(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * Getter for the vesting duration.
   */
  duration(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  methods: {
    BENEFICIARY_MANAGER_ROLE(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

    DEFAULT_ADMIN_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    PAUSER_ROLE(txDetails?: Truffle.TransactionDetails): Promise<string>;

    SCHEDULE_MANAGER_ROLE(
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;

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
     * Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``'s admin role.
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
     * Returns `true` if `account` has been granted `role`.
     */
    hasRole(
      role: string,
      account: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * Getter for the lock end. Requirements: - The contract must be temporary locked.
     */
    lockEnd(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Returns true if the contract is locked, and false otherwise.
     */
    locked(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    /**
     * Returns true if the contract is paused, and false otherwise.
     */
    paused(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    /**
     * Getter for the permanently locked.
     */
    permanentlyLocked(txDetails?: Truffle.TransactionDetails): Promise<boolean>;

    /**
     * Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function's purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`.
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
     * Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``'s admin role.
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
     * Getter for the start timestamp.
     */
    start(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * See {IERC165-supportsInterface}.
     */
    supportsInterface(
      interfaceId: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * See {IERC777Recipient-tokensReceived}.
     */
    tokensReceived: {
      (
        arg0: string,
        arg1: string,
        arg2: string,
        arg3: number | BN | string,
        arg4: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        arg0: string,
        arg1: string,
        arg2: string,
        arg3: number | BN | string,
        arg4: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        arg0: string,
        arg1: string,
        arg2: string,
        arg3: number | BN | string,
        arg4: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        arg0: string,
        arg1: string,
        arg2: string,
        arg3: number | BN | string,
        arg4: string,
        arg5: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Pause token releases.
     */
    pause: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * Unpause token releases. Requirements: - Caller must have role PAUSER_ROLE.
     */
    unpause: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * Lock schedule edition for a duration. Requirements: - Caller must have role DEFAULT_ADMIN_ROLE.
     */
    lock: {
      (
        lockDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        lockDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        lockDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        lockDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Permanently lock schedule edition. Requirements: - Caller must have role DEFAULT_ADMIN_ROLE.
     */
    permanentLock: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * Getter for the beneficiary address.
     */
    beneficiary(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * Setter for the beneficiary address. Requirements: - Caller must have role BENEFICIARY_MANAGER_ROLE.
     */
    setBeneficiary: {
      (
        beneficiaryAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        beneficiaryAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        beneficiaryAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        beneficiaryAddress: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Add a step to the schedule. Requirements: - Caller must have role SCHEDULE_MANAGER_ROLE. - step percent sum should not go above 100.
     */
    addToSchedule: {
      (
        stepPercent: number | BN | string,
        stepDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        stepPercent: number | BN | string,
        stepDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        stepPercent: number | BN | string,
        stepDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        stepPercent: number | BN | string,
        stepDuration: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Delete all steps of the schedule. Requirements: - Caller must have role SCHEDULE_MANAGER_ROLE. - The contract must not be locked.
     */
    resetSchedule: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    /**
     * Getter for the step percent sum.
     */
    stepPercentSum(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Getter for the vesting duration.
     */
    duration(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Amount of eth already released
     */
    "released()"(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * Amount of token already released
     */
    "released(address)"(
      token: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Calculates the amount of ether that has already vested. Default implementation is a linear vesting curve.
     */
    "vestedAmount(uint64)"(
      timestamp: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Calculates the amount of tokens that has already vested. Default implementation is a linear vesting curve.
     */
    "vestedAmount(address,uint64)"(
      token: string,
      timestamp: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * Release the tokens that have already vested. Emits a {TokensReleased} event. Requirements: - The contract must not be paused.
     */
    "release(address)": {
      (token: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        token: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Release the native token (ether) that have already vested. Emits a {TokensReleased} event. Requirements: - The contract must not be paused.
     */
    "release()": {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
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
