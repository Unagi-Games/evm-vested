import moment from "moment";
import { Address, CHAMPAmount, ScheduleStep, UnixTimestamp } from "./types";

const GAME_LAUNCH = moment(0);
const TGE = moment(0);
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
// │ Swap IFO                                             │
// │                                                      │
// │ 100% at TGE                                          |
// └──────────────────────────────────────────────────────┘
export const SWAP_IFO: Address = "";
export const SWAP_IFO_AMOUNT: CHAMPAmount = 0;

// ┌──────────────────────────────────────────────────────┐
// │ Swap Liquidity                                       │
// │                                                      │
// │ 100% at TGE                                          |
// └──────────────────────────────────────────────────────┘
export const SWAP_LIQUIDITY: Address = "";
export const SWAP_LIQUIDITY_AMOUNT: CHAMPAmount = 0;

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
// │ Release 30% during Year 1, 23% during Year 2,        |
// | 12% during Year 3, 9% during Year 4,                 |
// | 7% during Year 5.                                    |
// | then yearly linear release (3% per year)             |
// │ -- Editable 6 months after game release --           │
// └──────────────────────────────────────────────────────┘
export const PLAY_TO_EARN_RESERVE: Address = "";
export const PLAY_TO_EARN_RESERVE_AMOUNT: CHAMPAmount = 0;
export const PLAY_TO_EARN_RESERVE_START: UnixTimestamp = GAME_LAUNCH.unix();
export const PLAY_TO_EARN_RESERVE_SCHEDULE: ScheduleStep[] = [
  [30, 365 * 24 * 36000],
  [23, 365 * 24 * 36000],
  [12, 365 * 24 * 36000],
  [9, 365 * 24 * 36000],
  [7, 365 * 24 * 36000],
  [19, Math.floor(6.334 * 365 * 24 * 36000)],
];
export const PLAY_TO_EARN_RESERVE_EDITABLE = SIX_MONTH_AFTER_GAME_LAUNCH.diff(
  GAME_LAUNCH,
  "seconds"
);

// ┌──────────────────────────────────────────────────────┐
// │ Stacking Reserve                                     │
// │                                                      │
// │ Release 100% during Year 2                           |
// │ -- Editable 6 months after game release --           │
// └──────────────────────────────────────────────────────┘
export const STACKING_RESERVE: Address = "";
export const STACKING_RESERVE_AMOUNT: CHAMPAmount = 0;
export const STACKING_RESERVE_START: UnixTimestamp = moment(TGE)
  .add(1, "year")
  .unix();
export const STACKING_RESERVE_SCHEDULE: ScheduleStep[] = [
  [100, 365 * 24 * 36000],
];
export const STACKING_RESERVE_EDITABLE = SIX_MONTH_AFTER_GAME_LAUNCH.diff(
  GAME_LAUNCH,
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
  [20, SIX_MONTH_AFTER_GAME_LAUNCH.diff(GAME_LAUNCH, "second")],
  [
    80,
    moment(GAME_LAUNCH)
      .add(27, "month")
      .diff(SIX_MONTH_AFTER_GAME_LAUNCH, "second"),
  ],
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
  [20, SIX_MONTH_AFTER_GAME_LAUNCH.diff(GAME_LAUNCH, "second")],
  [
    80,
    moment(GAME_LAUNCH)
      .add(27, "month")
      .diff(SIX_MONTH_AFTER_GAME_LAUNCH, "second"),
  ],
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
  [20, SIX_MONTH_AFTER_GAME_LAUNCH.diff(GAME_LAUNCH, "second")],
  [
    80,
    moment(GAME_LAUNCH)
      .add(27, "month")
      .diff(SIX_MONTH_AFTER_GAME_LAUNCH, "second"),
  ],
];
export const ADVISOR_RESERVE_EDITABLE = false;

// ┌──────────────────────────────────────────────────────┐
// │ Employee Rewards                                     │
// │                                                      │
// │ 100% at TGE                                          |
// └──────────────────────────────────────────────────────┘
export const EMPLOYEE_REWARDS: Address = "";
export const EMPLOYEE_REWARDS_AMOUNT: CHAMPAmount = 0;
