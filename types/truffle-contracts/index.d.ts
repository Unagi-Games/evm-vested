/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { AccessControlContract } from "./AccessControl";
import { AccessControlEnumerableContract } from "./AccessControlEnumerable";
import { AccessControlEnumerableUpgradeableContract } from "./AccessControlEnumerableUpgradeable";
import { AccessControlUpgradeableContract } from "./AccessControlUpgradeable";
import { ChampMarketplaceContract } from "./ChampMarketplace";
import { ChampTokenContract } from "./ChampToken";
import { ChildChampTokenContract } from "./ChildChampToken";
import { ChildMgcTokenContract } from "./ChildMgcToken";
import { ContextUpgradeableContract } from "./ContextUpgradeable";
import { DistributionManagerContract } from "./DistributionManager";
import { ERC165Contract } from "./ERC165";
import { ERC165UpgradeableContract } from "./ERC165Upgradeable";
import { ERC721Contract } from "./ERC721";
import { ERC721URIStorageContract } from "./ERC721URIStorage";
import { ERC777Contract } from "./ERC777";
import { ERC777PresetFixedSupplyContract } from "./ERC777PresetFixedSupply";
import { IAccessControlContract } from "./IAccessControl";
import { IAccessControlEnumerableContract } from "./IAccessControlEnumerable";
import { IAccessControlEnumerableUpgradeableContract } from "./IAccessControlEnumerableUpgradeable";
import { IAccessControlUpgradeableContract } from "./IAccessControlUpgradeable";
import { IChildTokenContract } from "./IChildToken";
import { IERC165Contract } from "./IERC165";
import { IERC165UpgradeableContract } from "./IERC165Upgradeable";
import { IERC1820RegistryContract } from "./IERC1820Registry";
import { IERC1820RegistryUpgradeableContract } from "./IERC1820RegistryUpgradeable";
import { IERC20Contract } from "./IERC20";
import { IERC20MetadataContract } from "./IERC20Metadata";
import { IERC20PermitUpgradeableContract } from "./IERC20PermitUpgradeable";
import { IERC20UpgradeableContract } from "./IERC20Upgradeable";
import { IERC721Contract } from "./IERC721";
import { IERC721MetadataContract } from "./IERC721Metadata";
import { IERC721ReceiverContract } from "./IERC721Receiver";
import { IERC721UpgradeableContract } from "./IERC721Upgradeable";
import { IERC777Contract } from "./IERC777";
import { IERC777RecipientContract } from "./IERC777Recipient";
import { IERC777RecipientUpgradeableContract } from "./IERC777RecipientUpgradeable";
import { IERC777SenderContract } from "./IERC777Sender";
import { IERC777UpgradeableContract } from "./IERC777Upgradeable";
import { InitializableContract } from "./Initializable";
import { IPaymentRelay_V0Contract } from "./IPaymentRelay_V0";
import { LockableContract } from "./Lockable";
import { LockedChampTokenContract } from "./LockedChampToken";
import { MgcTokenContract } from "./MgcToken";
import { MigrationsContract } from "./Migrations";
import { MulticallContract } from "./Multicall";
import { OwnableContract } from "./Ownable";
import { PausableContract } from "./Pausable";
import { PaymentRelayContract } from "./PaymentRelay";
import { PaymentSplitterContract } from "./PaymentSplitter";
import { TestChampMarketplaceContract } from "./TestChampMarketplace";
import { TestLockableContract } from "./TestLockable";
import { TestPaymentRelay_V0Contract } from "./TestPaymentRelay_V0";
import { UltimateChampionsNFTContract } from "./UltimateChampionsNFT";
import { UPaymentSplitterContract } from "./UPaymentSplitter";
import { VestingWalletContract } from "./VestingWallet";
import { VestingWalletMultiLinearContract } from "./VestingWalletMultiLinear";

declare global {
  namespace Truffle {
    interface Artifacts {
      require(name: "AccessControl"): AccessControlContract;
      require(name: "AccessControlEnumerable"): AccessControlEnumerableContract;
      require(
        name: "AccessControlEnumerableUpgradeable"
      ): AccessControlEnumerableUpgradeableContract;
      require(
        name: "AccessControlUpgradeable"
      ): AccessControlUpgradeableContract;
      require(name: "ChampMarketplace"): ChampMarketplaceContract;
      require(name: "ChampToken"): ChampTokenContract;
      require(name: "ChildChampToken"): ChildChampTokenContract;
      require(name: "ChildMgcToken"): ChildMgcTokenContract;
      require(name: "ContextUpgradeable"): ContextUpgradeableContract;
      require(name: "DistributionManager"): DistributionManagerContract;
      require(name: "ERC165"): ERC165Contract;
      require(name: "ERC165Upgradeable"): ERC165UpgradeableContract;
      require(name: "ERC721"): ERC721Contract;
      require(name: "ERC721URIStorage"): ERC721URIStorageContract;
      require(name: "ERC777"): ERC777Contract;
      require(name: "ERC777PresetFixedSupply"): ERC777PresetFixedSupplyContract;
      require(name: "IAccessControl"): IAccessControlContract;
      require(
        name: "IAccessControlEnumerable"
      ): IAccessControlEnumerableContract;
      require(
        name: "IAccessControlEnumerableUpgradeable"
      ): IAccessControlEnumerableUpgradeableContract;
      require(
        name: "IAccessControlUpgradeable"
      ): IAccessControlUpgradeableContract;
      require(name: "IChildToken"): IChildTokenContract;
      require(name: "IERC165"): IERC165Contract;
      require(name: "IERC165Upgradeable"): IERC165UpgradeableContract;
      require(name: "IERC1820Registry"): IERC1820RegistryContract;
      require(
        name: "IERC1820RegistryUpgradeable"
      ): IERC1820RegistryUpgradeableContract;
      require(name: "IERC20"): IERC20Contract;
      require(name: "IERC20Metadata"): IERC20MetadataContract;
      require(name: "IERC20PermitUpgradeable"): IERC20PermitUpgradeableContract;
      require(name: "IERC20Upgradeable"): IERC20UpgradeableContract;
      require(name: "IERC721"): IERC721Contract;
      require(name: "IERC721Metadata"): IERC721MetadataContract;
      require(name: "IERC721Receiver"): IERC721ReceiverContract;
      require(name: "IERC721Upgradeable"): IERC721UpgradeableContract;
      require(name: "IERC777"): IERC777Contract;
      require(name: "IERC777Recipient"): IERC777RecipientContract;
      require(
        name: "IERC777RecipientUpgradeable"
      ): IERC777RecipientUpgradeableContract;
      require(name: "IERC777Sender"): IERC777SenderContract;
      require(name: "IERC777Upgradeable"): IERC777UpgradeableContract;
      require(name: "Initializable"): InitializableContract;
      require(name: "IPaymentRelay_V0"): IPaymentRelay_V0Contract;
      require(name: "Lockable"): LockableContract;
      require(name: "LockedChampToken"): LockedChampTokenContract;
      require(name: "MgcToken"): MgcTokenContract;
      require(name: "Migrations"): MigrationsContract;
      require(name: "Multicall"): MulticallContract;
      require(name: "Ownable"): OwnableContract;
      require(name: "Pausable"): PausableContract;
      require(name: "PaymentRelay"): PaymentRelayContract;
      require(name: "PaymentSplitter"): PaymentSplitterContract;
      require(name: "TestChampMarketplace"): TestChampMarketplaceContract;
      require(name: "TestLockable"): TestLockableContract;
      require(name: "TestPaymentRelay_V0"): TestPaymentRelay_V0Contract;
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
export {
  AccessControlEnumerableUpgradeableContract,
  AccessControlEnumerableUpgradeableInstance,
} from "./AccessControlEnumerableUpgradeable";
export {
  AccessControlUpgradeableContract,
  AccessControlUpgradeableInstance,
} from "./AccessControlUpgradeable";
export {
  ChampMarketplaceContract,
  ChampMarketplaceInstance,
} from "./ChampMarketplace";
export { ChampTokenContract, ChampTokenInstance } from "./ChampToken";
export {
  ChildChampTokenContract,
  ChildChampTokenInstance,
} from "./ChildChampToken";
export { ChildMgcTokenContract, ChildMgcTokenInstance } from "./ChildMgcToken";
export {
  ContextUpgradeableContract,
  ContextUpgradeableInstance,
} from "./ContextUpgradeable";
export {
  DistributionManagerContract,
  DistributionManagerInstance,
} from "./DistributionManager";
export { ERC165Contract, ERC165Instance } from "./ERC165";
export {
  ERC165UpgradeableContract,
  ERC165UpgradeableInstance,
} from "./ERC165Upgradeable";
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
export {
  IAccessControlEnumerableUpgradeableContract,
  IAccessControlEnumerableUpgradeableInstance,
} from "./IAccessControlEnumerableUpgradeable";
export {
  IAccessControlUpgradeableContract,
  IAccessControlUpgradeableInstance,
} from "./IAccessControlUpgradeable";
export { IChildTokenContract, IChildTokenInstance } from "./IChildToken";
export { IERC165Contract, IERC165Instance } from "./IERC165";
export {
  IERC165UpgradeableContract,
  IERC165UpgradeableInstance,
} from "./IERC165Upgradeable";
export {
  IERC1820RegistryContract,
  IERC1820RegistryInstance,
} from "./IERC1820Registry";
export {
  IERC1820RegistryUpgradeableContract,
  IERC1820RegistryUpgradeableInstance,
} from "./IERC1820RegistryUpgradeable";
export { IERC20Contract, IERC20Instance } from "./IERC20";
export {
  IERC20MetadataContract,
  IERC20MetadataInstance,
} from "./IERC20Metadata";
export {
  IERC20PermitUpgradeableContract,
  IERC20PermitUpgradeableInstance,
} from "./IERC20PermitUpgradeable";
export {
  IERC20UpgradeableContract,
  IERC20UpgradeableInstance,
} from "./IERC20Upgradeable";
export { IERC721Contract, IERC721Instance } from "./IERC721";
export {
  IERC721MetadataContract,
  IERC721MetadataInstance,
} from "./IERC721Metadata";
export {
  IERC721ReceiverContract,
  IERC721ReceiverInstance,
} from "./IERC721Receiver";
export {
  IERC721UpgradeableContract,
  IERC721UpgradeableInstance,
} from "./IERC721Upgradeable";
export { IERC777Contract, IERC777Instance } from "./IERC777";
export {
  IERC777RecipientContract,
  IERC777RecipientInstance,
} from "./IERC777Recipient";
export {
  IERC777RecipientUpgradeableContract,
  IERC777RecipientUpgradeableInstance,
} from "./IERC777RecipientUpgradeable";
export { IERC777SenderContract, IERC777SenderInstance } from "./IERC777Sender";
export {
  IERC777UpgradeableContract,
  IERC777UpgradeableInstance,
} from "./IERC777Upgradeable";
export { InitializableContract, InitializableInstance } from "./Initializable";
export {
  IPaymentRelay_V0Contract,
  IPaymentRelay_V0Instance,
} from "./IPaymentRelay_V0";
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
export { PaymentRelayContract, PaymentRelayInstance } from "./PaymentRelay";
export {
  PaymentSplitterContract,
  PaymentSplitterInstance,
} from "./PaymentSplitter";
export {
  TestChampMarketplaceContract,
  TestChampMarketplaceInstance,
} from "./TestChampMarketplace";
export { TestLockableContract, TestLockableInstance } from "./TestLockable";
export {
  TestPaymentRelay_V0Contract,
  TestPaymentRelay_V0Instance,
} from "./TestPaymentRelay_V0";
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
