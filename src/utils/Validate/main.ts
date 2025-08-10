export default class Validate {
  public static Balance(amount: number): boolean {
    return !isNaN(amount) && amount > 0 && !amount.toString().includes(".");
  }
}
