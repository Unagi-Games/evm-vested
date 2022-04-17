import {
  ADVISOR_RESERVE,
  ADVISOR_RESERVE_AMOUNT,
  ADVISOR_RESERVE_EDITABLE,
  ADVISOR_RESERVE_SCHEDULE,
  ADVISOR_RESERVE_START,
  EMPLOYEE_REWARDS,
  EMPLOYEE_REWARDS_AMOUNT,
  KOLS_RESERVE,
  KOLS_RESERVE_AMOUNT,
  KOLS_RESERVE_EDITABLE,
  KOLS_RESERVE_SCHEDULE,
  KOLS_RESERVE_START,
  PLAY_TO_EARN_RESERVE,
  PLAY_TO_EARN_RESERVE_AMOUNT,
  PLAY_TO_EARN_RESERVE_EDITABLE,
  PLAY_TO_EARN_RESERVE_SCHEDULE,
  PLAY_TO_EARN_RESERVE_START,
  PRIVATE_SALE_EDITABLE,
  PRIVATE_SALE_INVESTORS,
  PRIVATE_SALE_SCHEDULE,
  PRIVATE_SALE_START,
  STACKING_RESERVE,
  STACKING_RESERVE_AMOUNT,
  STACKING_RESERVE_EDITABLE,
  STACKING_RESERVE_SCHEDULE,
  STACKING_RESERVE_START,
  SWAP_IFO,
  SWAP_IFO_AMOUNT,
  SWAP_LIQUIDITY,
  SWAP_LIQUIDITY_AMOUNT,
  TEAM,
  TEAM_RESERVE_AMOUNT,
  TEAM_RESERVE_EDITABLE,
  TEAM_RESERVE_SCHEDULE,
  TEAM_RESERVE_START,
  UNAGI_MAINTENANCE_MULTISIG,
  UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  UNAGI_RESERVE,
  UNAGI_RESERVE_AMOUNT,
  UNAGI_RESERVE_EDITABLE,
  UNAGI_RESERVE_SCHEDULE,
  UNAGI_RESERVE_START,
} from "../config";
import {
  Address,
  CHAMPAmountWEI,
  Duration,
  Network,
  ScheduleStep,
  UnixTimestamp,
} from "../types";
import {
  BENEFICIARY_MANAGER_ROLE,
  DEFAULT_ADMIN_ROLE,
  PAUSER_ROLE,
  SCHEDULE_MANAGER_ROLE,
} from "../roles";

const LockedChampToken = artifacts.require("LockedChampToken");
const ChampToken = artifacts.require("ChampToken");
const VestingWalletMultiLinear = artifacts.require("VestingWalletMultiLinear");
const PaymentSplitter = artifacts.require("UPaymentSplitter");

let rootAccount: string;

async function buildVestingContract(
  beneficiary: Address,
  start: UnixTimestamp,
  schedule: ScheduleStep[],
  editable: false | Duration
) {
  const vestingContract = await VestingWalletMultiLinear.new(
    beneficiary,
    start
  );

  for (const [percent, duration] of schedule) {
    await vestingContract.addToSchedule(percent, duration);
  }

  if (editable === false) {
    await vestingContract.permanentLock();
  } else {
    await vestingContract.lock(editable);
  }

  await vestingContract.grantRole(
    DEFAULT_ADMIN_ROLE,
    UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
  );
  await vestingContract.grantRole(PAUSER_ROLE, UNAGI_MAINTENANCE_MULTISIG);
  await vestingContract.grantRole(
    SCHEDULE_MANAGER_ROLE,
    UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
  );
  await vestingContract.grantRole(
    BENEFICIARY_MANAGER_ROLE,
    UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
  );

  await vestingContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
  await vestingContract.renounceRole(PAUSER_ROLE, rootAccount);
  await vestingContract.renounceRole(SCHEDULE_MANAGER_ROLE, rootAccount);
  await vestingContract.renounceRole(BENEFICIARY_MANAGER_ROLE, rootAccount);

  return vestingContract.address;
}

interface LockedWallet {
  lockedWallet: Address;
  vestingWallet: Address;
}

module.exports =
  (web3: Web3) =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    rootAccount = accounts[0];
    const lockedWallets: LockedWallet[] = [];
    const champHolders: Address[] = [];
    const champHoldersBalances: CHAMPAmountWEI[] = [];

    // Private Sale
    for (const [tokensBought, investorAddress] of PRIVATE_SALE_INVESTORS) {
      const investorVesting = await buildVestingContract(
        investorAddress,
        PRIVATE_SALE_START,
        PRIVATE_SALE_SCHEDULE,
        PRIVATE_SALE_EDITABLE
      );
      console.log(
        `Vesting contract for ${investorAddress} deployed at ${investorVesting}`
      );

      champHolders.push(investorVesting);
      champHoldersBalances.push(
        web3.utils.toWei(String(tokensBought), "ether")
      );
      lockedWallets.push({
        lockedWallet: investorAddress,
        vestingWallet: investorVesting,
      });
    }

    // Swap IFO
    champHolders.push(SWAP_IFO);
    champHoldersBalances.push(
      web3.utils.toWei(String(SWAP_IFO_AMOUNT), "ether")
    );

    // Swap Liquidity
    champHolders.push(SWAP_LIQUIDITY);
    champHoldersBalances.push(
      web3.utils.toWei(String(SWAP_LIQUIDITY_AMOUNT), "ether")
    );

    // KOLs Reserve
    const kolsVesting = await buildVestingContract(
      KOLS_RESERVE,
      KOLS_RESERVE_START,
      KOLS_RESERVE_SCHEDULE,
      KOLS_RESERVE_EDITABLE
    );
    console.log(`KOLs Reserve vesting deployed at ${kolsVesting}`);
    champHolders.push(kolsVesting);
    champHoldersBalances.push(
      web3.utils.toWei(String(KOLS_RESERVE_AMOUNT), "ether")
    );

    // Play to Earn Reserve
    const pteVesting = await buildVestingContract(
      PLAY_TO_EARN_RESERVE,
      PLAY_TO_EARN_RESERVE_START,
      PLAY_TO_EARN_RESERVE_SCHEDULE,
      PLAY_TO_EARN_RESERVE_EDITABLE
    );
    console.log(`Play to Earn Reserve vesting deployed at ${pteVesting}`);
    champHolders.push(pteVesting);
    champHoldersBalances.push(
      web3.utils.toWei(String(PLAY_TO_EARN_RESERVE_AMOUNT), "ether")
    );

    // Stacking Reserve
    const stackingVesting = await buildVestingContract(
      STACKING_RESERVE,
      STACKING_RESERVE_START,
      STACKING_RESERVE_SCHEDULE,
      STACKING_RESERVE_EDITABLE
    );
    console.log(`Stacking Reserve vesting deployed at ${stackingVesting}`);
    champHolders.push(stackingVesting);
    champHoldersBalances.push(
      web3.utils.toWei(String(STACKING_RESERVE_AMOUNT), "ether")
    );

    // Unagi Reserve
    const unagiVesting = await buildVestingContract(
      UNAGI_RESERVE,
      UNAGI_RESERVE_START,
      UNAGI_RESERVE_SCHEDULE,
      UNAGI_RESERVE_EDITABLE
    );
    console.log(`Unagi Reserve vesting deployed at ${unagiVesting}`);
    champHolders.push(unagiVesting);
    champHoldersBalances.push(
      web3.utils.toWei(String(UNAGI_RESERVE_AMOUNT), "ether")
    );

    // Team
    const teamSplitter = await PaymentSplitter.new(
      TEAM,
      TEAM.map(() => Math.floor(100 / TEAM.length))
    );
    const teamVesting = await buildVestingContract(
      teamSplitter.address,
      TEAM_RESERVE_START,
      TEAM_RESERVE_SCHEDULE,
      TEAM_RESERVE_EDITABLE
    );
    console.log(`Team vesting deployed at ${teamVesting}`);
    champHolders.push(teamVesting);
    champHoldersBalances.push(
      web3.utils.toWei(String(TEAM_RESERVE_AMOUNT), "ether")
    );

    // Advisors
    const advisorVesting = await buildVestingContract(
      ADVISOR_RESERVE,
      ADVISOR_RESERVE_START,
      ADVISOR_RESERVE_SCHEDULE,
      ADVISOR_RESERVE_EDITABLE
    );
    console.log(`Advisors vesting deployed at ${advisorVesting}`);
    champHolders.push(advisorVesting);
    champHoldersBalances.push(
      web3.utils.toWei(String(ADVISOR_RESERVE_AMOUNT), "ether")
    );

    // Employee Rewards - 100% at TGE
    champHolders.push(EMPLOYEE_REWARDS);
    champHoldersBalances.push(
      web3.utils.toWei(String(EMPLOYEE_REWARDS_AMOUNT), "ether")
    );

    // Deploy and setup ChampToken
    await deployer.deploy(ChampToken, champHolders, champHoldersBalances);
    const champTokenContract = await ChampToken.deployed();
    await champTokenContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await champTokenContract.grantRole(PAUSER_ROLE, UNAGI_MAINTENANCE_MULTISIG);
    await champTokenContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
    await champTokenContract.renounceRole(PAUSER_ROLE, rootAccount);

    // Deploy and setup LockedChampToken
    await deployer.deploy(LockedChampToken, champTokenContract.address);
    const lockedChampTokenContract = await LockedChampToken.deployed();

    for (const lock of lockedWallets) {
      await lockedChampTokenContract.setLockedWallet(
        lock.lockedWallet,
        lock.vestingWallet
      );
    }

    await lockedChampTokenContract.transferOwnership(
      UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
  };
