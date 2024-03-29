import moment from "moment";
import { Address, CHAMPAmount, ScheduleStep, UnixTimestamp } from "./types";

// Unagi maintenance accounts
export const L1_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER: Address = "";
export const L1_UNAGI_MAINTENANCE_MULTISIG: Address = "";
export const L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER: Address = "";
export const L2_UNAGI_MAINTENANCE_MULTISIG: Address = "";
export const BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER: Address = "";
export const BINANCE_UNAGI_MAINTENANCE_MULTISIG: Address = "";

// Unagi minter
export const L2_UNAGI_MINTER_BCI: Address = "";
export const BINANCE_UNAGI_MINTER_BCI: Address = "";

const GAME_LAUNCH = moment();
const TGE = moment();
const SIX_MONTH_AFTER_GAME_LAUNCH = moment(GAME_LAUNCH).add(6, "month");

// ┌──────────────────────────────────────────────────────┐
// │ Team                                                 │
// │                                                      │
// │ Split team reserve evenly between those wallets.     |
// └──────────────────────────────────────────────────────┘
export const TEAM: Address[] = [];

// ┌──────────────────────────────────────────────────────┐
// │ Private Sale                                         │
// │                                                      │
// │ Release 5% at game launch then                       |
// | monthly linear release over 33 months (3% per month) |
// │ -- Not editable --                                   │
// └──────────────────────────────────────────────────────┘
export const PRIVATE_SALE_INVESTORS: [CHAMPAmount, Address][] = [];
export const PRIVATE_SALE_START: UnixTimestamp = GAME_LAUNCH.unix();
export const PRIVATE_SALE_SCHEDULE: ScheduleStep[] = [
  [5, 0],
  [95, moment(GAME_LAUNCH).add(33, "month").diff(GAME_LAUNCH, "second")],
];
export const PRIVATE_SALE_EDITABLE = false;

// ┌──────────────────────────────────────────────────────┐
// │ Public Sale                                          │
// │                                                      │
// │ Full release on TGE                                  |
// └──────────────────────────────────────────────────────┘
export const PUBLIC_SALE_RESERVE: Address = "";
export const PUBLIC_SALE_AMOUNT: CHAMPAmount = 0;

// ┌──────────────────────────────────────────────────────┐
// │ KOLs Reserve                                         │
// │                                                      │
// │ Release 5% at game launch then                       |
// | monthly linear release over 33 months (3% per month) |
// │ -- Not editable --                                   │
// └──────────────────────────────────────────────────────┘
export const KOLS_RESERVE: Address = "";
export const KOLS_RESERVE_AMOUNT: CHAMPAmount = 0;
export const KOLS_RESERVE_START: UnixTimestamp = GAME_LAUNCH.unix();
export const KOLS_RESERVE_SCHEDULE: ScheduleStep[] = [
  [5, 0],
  [95, moment(GAME_LAUNCH).add(33, "month").diff(GAME_LAUNCH, "second")],
];
export const KOLS_RESERVE_EDITABLE = false;

// ┌──────────────────────────────────────────────────────┐
// │ Play to Earn Reserve                                 │
// │                                                      │
// │ Release 30% at TGE, 23% during Year 1,        |
// | 12% during Year 2, 9% during Year 3,                 |
// | 7% during Year 4.                                    |
// | then yearly linear release (3% per year)             |
// │ -- Editable 6 months after game release --           │
// └──────────────────────────────────────────────────────┘
export const PLAY_TO_EARN_RESERVE: Address = "";
export const PLAY_TO_EARN_RESERVE_AMOUNT: CHAMPAmount = 0;
export const PLAY_TO_EARN_RESERVE_START: UnixTimestamp = TGE.unix();
export const PLAY_TO_EARN_RESERVE_SCHEDULE: ScheduleStep[] = [
  [30, 0],
  [23, 365 * 24 * 36000],
  [12, 365 * 24 * 36000],
  [9, 365 * 24 * 36000],
  [7, 365 * 24 * 36000],
  [19, Math.floor(6.334 * 365 * 24 * 36000)],
];
export const PLAY_TO_EARN_RESERVE_EDITABLE = SIX_MONTH_AFTER_GAME_LAUNCH.diff(
  TGE,
  "seconds"
);

// ┌──────────────────────────────────────────────────────┐
// │ Stacking Reserve                                     │
// │                                                      │
// │ Release 100% on 5 years                              |
// │ -- Editable 6 months after game release --           │
// └──────────────────────────────────────────────────────┘
export const STACKING_RESERVE: Address = "";
export const STACKING_RESERVE_AMOUNT: CHAMPAmount = 0;
export const STACKING_RESERVE_START: UnixTimestamp = TGE.unix();
export const STACKING_RESERVE_SCHEDULE: ScheduleStep[] = [
  [100, 5 * 365 * 24 * 36000],
];
export const STACKING_RESERVE_EDITABLE = SIX_MONTH_AFTER_GAME_LAUNCH.diff(
  TGE,
  "seconds"
);

// ┌──────────────────────────────────────────────────────┐
// │ Unagi Reserve                                        │
// │                                                      │
// │ Release 5% at game launch then                       |
// | monthly linear release over 33 months (3% per month) |
// │ -- Not editable --                                   │
// └──────────────────────────────────────────────────────┘
export const UNAGI_RESERVE: Address = "";
export const UNAGI_RESERVE_AMOUNT: CHAMPAmount = 0;
export const UNAGI_RESERVE_START: UnixTimestamp = GAME_LAUNCH.unix();
export const UNAGI_RESERVE_SCHEDULE: ScheduleStep[] = [
  [5, 0],
  [95, moment(GAME_LAUNCH).add(33, "month").diff(GAME_LAUNCH, "second")],
];
export const UNAGI_RESERVE_EDITABLE = false;

// ┌──────────────────────────────────────────────────────┐
// │ Team                                                 │
// │                                                      │
// │ Release 5% at game launch then                       |
// | monthly linear release over 33 months (3% per month) |
// │ 6-month cliff                                        │
// │ -- Not editable --                                   │
// └──────────────────────────────────────────────────────┘
export const TEAM_RESERVE_AMOUNT: CHAMPAmount = 0;
export const TEAM_RESERVE_START: UnixTimestamp = GAME_LAUNCH.unix();
export const TEAM_RESERVE_SCHEDULE: ScheduleStep[] = [
  [5, 0],
  [95, moment(GAME_LAUNCH).add(33, "month").diff(GAME_LAUNCH, "second")],
];
export const TEAM_RESERVE_EDITABLE = false;

// ┌──────────────────────────────────────────────────────┐
// │ Advisors                                             │
// │                                                      │
// │ Release 5% at game launch then                       |
// | monthly linear release over 33 months (3% per month) |
// │ 6-month cliff                                        │
// │ -- Not editable --                                   │
// └──────────────────────────────────────────────────────┘
export const ADVISOR_RESERVE: Address = "";
export const ADVISOR_RESERVE_AMOUNT: CHAMPAmount = 0;
export const ADVISOR_RESERVE_START: UnixTimestamp = GAME_LAUNCH.unix();
export const ADVISOR_RESERVE_SCHEDULE: ScheduleStep[] = [
  [5, 0],
  [95, moment(GAME_LAUNCH).add(33, "month").diff(GAME_LAUNCH, "second")],
];
export const ADVISOR_RESERVE_EDITABLE = false;

// ┌──────────────────────────────────────────────────────┐
// │ Employees Rewards                                    │
// │                                                      │
// │ Release 5% at game launch then                       |
// | monthly linear release over 33 months (3% per month) |
// │ 6-month cliff                                        │
// │ -- Not editable --                                   │
// └──────────────────────────────────────────────────────┘
export const EMPLOYEE_RESERVE: Address = "";
export const EMPLOYEE_RESERVE_AMOUNT: CHAMPAmount = 0;
export const EMPLOYEE_RESERVE_START: UnixTimestamp = GAME_LAUNCH.unix();
export const EMPLOYEE_RESERVE_SCHEDULE: ScheduleStep[] = [
  [5, 0],
  [95, moment(GAME_LAUNCH).add(33, "month").diff(GAME_LAUNCH, "second")],
];
export const EMPLOYEE_RESERVE_EDITABLE = false;
