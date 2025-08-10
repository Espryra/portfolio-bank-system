import { type BankAccount } from "../modules/bank/types";
import Database from "../utils/database/main";

export const TIMESTARTED = new Date();

export const UsernameDatabase = new Database<string>("usernames");
export const BankAccountDatabase = new Database<BankAccount>("accounts");
