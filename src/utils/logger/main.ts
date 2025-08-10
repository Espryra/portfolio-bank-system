import Config from "../../lib/config";
import Time from "../time/main";

export default class Logger {
  public static Info(...data: any[]) {
    console.log(`§7[§r§9INFO§r§7]§r §7[§r§e${Time.Now()}§r§7]§r`, ...data);
  }
  public static Warn(...data: any[]) {
    console.log(`§7[§r§6WARN§r§7]§r §7[§r§e${Time.Now()}§r§7]§r`, ...data);
  }
  public static Error(...data: any[]) {
    console.log(`§7[§r§cERROR§r§7]§r §7[§r§e${Time.Now()}§r§7]§r`, ...data);
  }
  public static Success(...data: any[]) {
    console.log(`§7[§r§aSUCCESS§r§7]§r §7[§r§e${Time.Now()}§r§7]§r`, ...data);
  }
  public static Debug(...data: any[]) {
    if (!Config.debug) {
      return;
    }

    console.log(`§7[§r§dDEBUG§r§7]§r §7[§r§e${Time.Now()}§r§7]§r`, ...data);
  }

  public static InfoElapsed(...data: any[]) {
    console.log(`§7[§r§9INFO§r§7]§r §7[§r§e${Time.Elapsed()}§r§7]§r`, ...data);
  }
  public static WarnElapsed(...data: any[]) {
    console.log(`§7[§r§6WARN§r§7]§r §7[§r§e${Time.Elapsed()}§r§7]§r`, ...data);
  }
  public static ErrorElapsed(...data: any[]) {
    console.log(`§7[§r§cERROR§r§7]§r §7[§r§e${Time.Elapsed()}§r§7]§r`, ...data);
  }
  public static SuccessElapsed(...data: any[]) {
    console.log(
      `§7[§r§aSUCCESS§r§7]§r §7[§r§e${Time.Elapsed()}§r§7]§r`,
      ...data,
    );
  }
  public static DebugElapsed(...data: any[]) {
    if (!Config.debug) {
      return;
    }

    console.log(`§7[§r§dDEBUG§r§7]§r §7[§r§e${Time.Elapsed()}§r§7]§r`, ...data);
  }
}
