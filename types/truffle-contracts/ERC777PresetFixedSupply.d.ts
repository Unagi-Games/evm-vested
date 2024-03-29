/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface ERC777PresetFixedSupplyContract
  extends Truffle.Contract<ERC777PresetFixedSupplyInstance> {
  "new"(
    name: string,
    symbol: string,
    defaultOperators: string[],
    initialSupply: number | BN | string,
    owner: string,
    meta?: Truffle.TransactionDetails
  ): Promise<ERC777PresetFixedSupplyInstance>;
}

export interface Approval {
  name: "Approval";
  args: {
    owner: string;
    spender: string;
    value: BN;
    0: string;
    1: string;
    2: BN;
  };
}

export interface AuthorizedOperator {
  name: "AuthorizedOperator";
  args: {
    operator: string;
    tokenHolder: string;
    0: string;
    1: string;
  };
}

export interface Burned {
  name: "Burned";
  args: {
    operator: string;
    from: string;
    amount: BN;
    data: string;
    operatorData: string;
    0: string;
    1: string;
    2: BN;
    3: string;
    4: string;
  };
}

export interface Minted {
  name: "Minted";
  args: {
    operator: string;
    to: string;
    amount: BN;
    data: string;
    operatorData: string;
    0: string;
    1: string;
    2: BN;
    3: string;
    4: string;
  };
}

export interface RevokedOperator {
  name: "RevokedOperator";
  args: {
    operator: string;
    tokenHolder: string;
    0: string;
    1: string;
  };
}

export interface Sent {
  name: "Sent";
  args: {
    operator: string;
    from: string;
    to: string;
    amount: BN;
    data: string;
    operatorData: string;
    0: string;
    1: string;
    2: string;
    3: BN;
    4: string;
    5: string;
  };
}

export interface Transfer {
  name: "Transfer";
  args: {
    from: string;
    to: string;
    value: BN;
    0: string;
    1: string;
    2: BN;
  };
}

type AllEvents =
  | Approval
  | AuthorizedOperator
  | Burned
  | Minted
  | RevokedOperator
  | Sent
  | Transfer;

export interface ERC777PresetFixedSupplyInstance
  extends Truffle.ContractInstance {
  /**
   * See {IERC20-allowance}. Note that operator and allowance concepts are orthogonal: operators may not have allowance, and accounts with allowance may not be operators themselves.
   */
  allowance(
    holder: string,
    spender: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * See {IERC20-approve}. NOTE: If `value` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Note that accounts cannot have allowance issued by their operators.
   */
  approve: {
    (
      spender: string,
      value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      spender: string,
      value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      spender: string,
      value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      spender: string,
      value: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC777-authorizeOperator}.
   */
  authorizeOperator: {
    (operator: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * Returns the amount of tokens owned by an account (`tokenHolder`).
   */
  balanceOf(
    tokenHolder: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  /**
   * See {IERC777-burn}. Also emits a {IERC20-Transfer} event for ERC20 compatibility.
   */
  burn: {
    (
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {ERC20-decimals}. Always returns 18, as per the [ERC777 EIP](https://eips.ethereum.org/EIPS/eip-777#backward-compatibility).
   */
  decimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * See {IERC777-defaultOperators}.
   */
  defaultOperators(txDetails?: Truffle.TransactionDetails): Promise<string[]>;

  /**
   * See {IERC777-granularity}. This implementation always returns `1`.
   */
  granularity(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * See {IERC777-isOperatorFor}.
   */
  isOperatorFor(
    operator: string,
    tokenHolder: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  /**
   * See {IERC777-name}.
   */
  name(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * See {IERC777-operatorBurn}. Emits {Burned} and {IERC20-Transfer} events.
   */
  operatorBurn: {
    (
      account: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      account: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      account: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      account: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC777-operatorSend}. Emits {Sent} and {IERC20-Transfer} events.
   */
  operatorSend: {
    (
      sender: string,
      recipient: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      sender: string,
      recipient: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      sender: string,
      recipient: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      sender: string,
      recipient: string,
      amount: number | BN | string,
      data: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC777-revokeOperator}.
   */
  revokeOperator: {
    (operator: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      operator: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC777-send}. Also emits a {IERC20-Transfer} event for ERC20 compatibility.
   */
  send: {
    (
      recipient: string,
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      recipient: string,
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      recipient: string,
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      recipient: string,
      amount: number | BN | string,
      data: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC777-symbol}.
   */
  symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

  /**
   * See {IERC777-totalSupply}.
   */
  totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  /**
   * See {IERC20-transfer}. Unlike `send`, `recipient` is _not_ required to implement the {IERC777Recipient} interface if it is a contract. Also emits a {Sent} event.
   */
  transfer: {
    (
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  /**
   * See {IERC20-transferFrom}. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Note that operator and allowance concepts are orthogonal: operators cannot call `transferFrom` (unless they have allowance), and accounts with allowance cannot call `operatorSend` (unless they are operators). Emits {Sent}, {IERC20-Transfer} and {IERC20-Approval} events.
   */
  transferFrom: {
    (
      holder: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      holder: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;
    sendTransaction(
      holder: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      holder: string,
      recipient: string,
      amount: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    /**
     * See {IERC20-allowance}. Note that operator and allowance concepts are orthogonal: operators may not have allowance, and accounts with allowance may not be operators themselves.
     */
    allowance(
      holder: string,
      spender: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * See {IERC20-approve}. NOTE: If `value` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Note that accounts cannot have allowance issued by their operators.
     */
    approve: {
      (
        spender: string,
        value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        spender: string,
        value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        spender: string,
        value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        spender: string,
        value: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC777-authorizeOperator}.
     */
    authorizeOperator: {
      (operator: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        operator: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        operator: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        operator: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * Returns the amount of tokens owned by an account (`tokenHolder`).
     */
    balanceOf(
      tokenHolder: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    /**
     * See {IERC777-burn}. Also emits a {IERC20-Transfer} event for ERC20 compatibility.
     */
    burn: {
      (
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {ERC20-decimals}. Always returns 18, as per the [ERC777 EIP](https://eips.ethereum.org/EIPS/eip-777#backward-compatibility).
     */
    decimals(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * See {IERC777-defaultOperators}.
     */
    defaultOperators(txDetails?: Truffle.TransactionDetails): Promise<string[]>;

    /**
     * See {IERC777-granularity}. This implementation always returns `1`.
     */
    granularity(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * See {IERC777-isOperatorFor}.
     */
    isOperatorFor(
      operator: string,
      tokenHolder: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    /**
     * See {IERC777-name}.
     */
    name(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * See {IERC777-operatorBurn}. Emits {Burned} and {IERC20-Transfer} events.
     */
    operatorBurn: {
      (
        account: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        account: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        account: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        account: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC777-operatorSend}. Emits {Sent} and {IERC20-Transfer} events.
     */
    operatorSend: {
      (
        sender: string,
        recipient: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        sender: string,
        recipient: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        sender: string,
        recipient: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        sender: string,
        recipient: string,
        amount: number | BN | string,
        data: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC777-revokeOperator}.
     */
    revokeOperator: {
      (operator: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        operator: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        operator: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        operator: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC777-send}. Also emits a {IERC20-Transfer} event for ERC20 compatibility.
     */
    send: {
      (
        recipient: string,
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        recipient: string,
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        recipient: string,
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        recipient: string,
        amount: number | BN | string,
        data: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC777-symbol}.
     */
    symbol(txDetails?: Truffle.TransactionDetails): Promise<string>;

    /**
     * See {IERC777-totalSupply}.
     */
    totalSupply(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    /**
     * See {IERC20-transfer}. Unlike `send`, `recipient` is _not_ required to implement the {IERC777Recipient} interface if it is a contract. Also emits a {Sent} event.
     */
    transfer: {
      (
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    /**
     * See {IERC20-transferFrom}. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Note that operator and allowance concepts are orthogonal: operators cannot call `transferFrom` (unless they have allowance), and accounts with allowance cannot call `operatorSend` (unless they are operators). Emits {Sent}, {IERC20-Transfer} and {IERC20-Approval} events.
     */
    transferFrom: {
      (
        holder: string,
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        holder: string,
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<boolean>;
      sendTransaction(
        holder: string,
        recipient: string,
        amount: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        holder: string,
        recipient: string,
        amount: number | BN | string,
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
