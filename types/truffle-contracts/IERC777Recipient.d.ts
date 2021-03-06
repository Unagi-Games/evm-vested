/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface IERC777RecipientContract
  extends Truffle.Contract<IERC777RecipientInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<IERC777RecipientInstance>;
}

type AllEvents = never;

export interface IERC777RecipientInstance extends Truffle.ContractInstance {
  /**
   * Called by an {IERC777} token contract whenever tokens are being moved or created into a registered account (`to`). The type of operation is conveyed by `from` being the zero address or not. This call occurs _after_ the token contract's state is updated, so {IERC777-balanceOf}, etc., can be used to query the post-operation state. This function may revert to prevent the operation from being executed.
   */
  tokensReceived: {
    (
      operator: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      operator: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      operator: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      operator: string,
      from: string,
      to: string,
      amount: number | BN | string,
      userData: string,
      operatorData: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    /**
     * Called by an {IERC777} token contract whenever tokens are being moved or created into a registered account (`to`). The type of operation is conveyed by `from` being the zero address or not. This call occurs _after_ the token contract's state is updated, so {IERC777-balanceOf}, etc., can be used to query the post-operation state. This function may revert to prevent the operation from being executed.
     */
    tokensReceived: {
      (
        operator: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        operator: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        operator: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        operatorData: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        operator: string,
        from: string,
        to: string,
        amount: number | BN | string,
        userData: string,
        operatorData: string,
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
