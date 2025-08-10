import type BankSession from "../../modules/bank/session";

export default class Cache {
  public static BankSessions: Record<string, BankSession>;

  public constructor() {
    Cache.BankSessions = {};
  }
}
