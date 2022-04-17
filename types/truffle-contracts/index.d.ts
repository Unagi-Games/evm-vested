/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { AccessControlContract } from "./AccessControl";
import { AccessControlEnumerableContract } from "./AccessControlEnumerable";
import { ChampTokenContract } from "./ChampToken";
import { ChildChampTokenContract } from "./ChildChampToken";
import { ChildMgcTokenContract } from "./ChildMgcToken";
import { ERC165Contract } from "./ERC165";
import { ERC721Contract } from "./ERC721";
import { ERC721URIStorageContract } from "./ERC721URIStorage";
import { ERC777Contract } from "./ERC777";
import { ERC777PresetFixedSupplyContract } from "./ERC777PresetFixedSupply";
import { IAccessControlContract } from "./IAccessControl";
import { IAccessControlEnumerableContract } from "./IAccessControlEnumerable";
import { IChildTokenContract } from "./IChildToken";
import { IERC165Contract } from "./IERC165";
import { IERC1820RegistryContract } from "./IERC1820Registry";
import { IERC20Contract } from "./IERC20";
import { IERC20MetadataContract } from "./IERC20Metadata";
import { IERC721Contract } from "./IERC721";
import { IERC721MetadataContract } from "./IERC721Metadata";
import { IERC721ReceiverContract } from "./IERC721Receiver";
import { IERC777Contract } from "./IERC777";
import { IERC777RecipientContract } from "./IERC777Recipient";
import { IERC777SenderContract } from "./IERC777Sender";
import { LockableContract } from "./Lockable";
import { LockedChampTokenContract } from "./LockedChampToken";
import { MgcTokenContract } from "./MgcToken";
import { MigrationsContract } from "./Migrations";
import { MulticallContract } from "./Multicall";
import { OwnableContract } from "./Ownable";
import { PausableContract } from "./Pausable";
import { PaymentSplitterContract } from "./PaymentSplitter";
import { TestLockableContract } from "./TestLockable";
import { UltimateChampionsNFTContract } from "./UltimateChampionsNFT";
import { UPaymentSplitterContract } from "./UPaymentSplitter";
import { VestingWalletContract } from "./VestingWallet";
import { VestingWalletMultiLinearContract } from "./VestingWalletMultiLinear";

declare global {
  namespace Truffle {
    interface Artifacts {
      require(name: "AccessControl"): AccessControlContract;
      require(name: "AccessControlEnumerable"): AccessControlEnumerableContract;
      require(name: "ChampToken"): ChampTokenContract;
      require(name: "ChildChampToken"): ChildChampTokenContract;
      require(name: "ChildMgcToken"): ChildMgcTokenContract;
      require(name: "ERC165"): ERC165Contract;
      require(name: "ERC721"): ERC721Contract;
      require(name: "ERC721URIStorage"): ERC721URIStorageContract;
      require(name: "ERC777"): ERC777Contract;
      require(name: "ERC777PresetFixedSupply"): ERC777PresetFixedSupplyContract;
      require(name: "IAccessControl"): IAccessControlContract;
      require(
        name: "IAccessControlEnumerable"
      ): IAccessControlEnumerableContract;
      require(name: "IChildToken"): IChildTokenContract;
      require(name: "IERC165"): IERC165Contract;
      require(name: "IERC1820Registry"): IERC1820RegistryContract;
      require(name: "IERC20"): IERC20Contract;
      require(name: "IERC20Metadata"): IERC20MetadataContract;
      require(name: "IERC721"): IERC721Contract;
      require(name: "IERC721Metadata"): IERC721MetadataContract;
      require(name: "IERC721Receiver"): IERC721ReceiverContract;
      require(name: "IERC777"): IERC777Contract;
      require(name: "IERC777Recipient"): IERC777RecipientContract;
      require(name: "IERC777Sender"): IERC777SenderContract;
      require(name: "Lockable"): LockableContract;
      require(name: "LockedChampToken"): LockedChampTokenContract;
      require(name: "MgcToken"): MgcTokenContract;
      require(name: "Migrations"): MigrationsContract;
      require(name: "Multicall"): MulticallContract;
      require(name: "Ownable"): OwnableContract;
      require(name: "Pausable"): PausableContract;
      require(name: "PaymentSplitter"): PaymentSplitterContract;
      require(name: "TestLockable"): TestLockableContract;
      require(name: "UltimateChampionsNFT"): UltimateChampionsNFTContract;
      require(name: "UPaymentSplitter"): UPaymentSplitterContract;
      require(name: "VestingWallet"): VestingWalletContract;
      require(
        name: "VestingWalletMultiLinear"
      ): VestingWalletMultiLinearContract;
    }
  }
}

export { AccessControlContract, AccessControlInstance } from "./AccessControl";
export {
  AccessControlEnumerableContract,
  AccessControlEnumerableInstance,
} from "./AccessControlEnumerable";
export { ChampTokenContract, ChampTokenInstance } from "./ChampToken";
export {
  ChildChampTokenContract,
  ChildChampTokenInstance,
} from "./ChildChampToken";
export { ChildMgcTokenContract, ChildMgcTokenInstance } from "./ChildMgcToken";
export { ERC165Contract, ERC165Instance } from "./ERC165";
export { ERC721Contract, ERC721Instance } from "./ERC721";
export {
  ERC721URIStorageContract,
  ERC721URIStorageInstance,
} from "./ERC721URIStorage";
export { ERC777Contract, ERC777Instance } from "./ERC777";
export {
  ERC777PresetFixedSupplyContract,
  ERC777PresetFixedSupplyInstance,
} from "./ERC777PresetFixedSupply";
export {
  IAccessControlContract,
  IAccessControlInstance,
} from "./IAccessControl";
export {
  IAccessControlEnumerableContract,
  IAccessControlEnumerableInstance,
} from "./IAccessControlEnumerable";
export { IChildTokenContract, IChildTokenInstance } from "./IChildToken";
export { IERC165Contract, IERC165Instance } from "./IERC165";
export {
  IERC1820RegistryContract,
  IERC1820RegistryInstance,
} from "./IERC1820Registry";
export { IERC20Contract, IERC20Instance } from "./IERC20";
export {
  IERC20MetadataContract,
  IERC20MetadataInstance,
} from "./IERC20Metadata";
export { IERC721Contract, IERC721Instance } from "./IERC721";
export {
  IERC721MetadataContract,
  IERC721MetadataInstance,
} from "./IERC721Metadata";
export {
  IERC721ReceiverContract,
  IERC721ReceiverInstance,
} from "./IERC721Receiver";
export { IERC777Contract, IERC777Instance } from "./IERC777";
export {
  IERC777RecipientContract,
  IERC777RecipientInstance,
} from "./IERC777Recipient";
export { IERC777SenderContract, IERC777SenderInstance } from "./IERC777Sender";
export { LockableContract, LockableInstance } from "./Lockable";
export {
  LockedChampTokenContract,
  LockedChampTokenInstance,
} from "./LockedChampToken";
export { MgcTokenContract, MgcTokenInstance } from "./MgcToken";
export { MigrationsContract, MigrationsInstance } from "./Migrations";
export { MulticallContract, MulticallInstance } from "./Multicall";
export { OwnableContract, OwnableInstance } from "./Ownable";
export { PausableContract, PausableInstance } from "./Pausable";
export {
  PaymentSplitterContract,
  PaymentSplitterInstance,
} from "./PaymentSplitter";
export { TestLockableContract, TestLockableInstance } from "./TestLockable";
export {
  UltimateChampionsNFTContract,
  UltimateChampionsNFTInstance,
} from "./UltimateChampionsNFT";
export {
  UPaymentSplitterContract,
  UPaymentSplitterInstance,
} from "./UPaymentSplitter";
export { VestingWalletContract, VestingWalletInstance } from "./VestingWallet";
export {
  VestingWalletMultiLinearContract,
  VestingWalletMultiLinearInstance,
} from "./VestingWalletMultiLinear";
