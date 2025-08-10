import { system } from "@minecraft/server";
import Bank from "../modules/bank/main";

system.beforeEvents.startup.subscribe((event) => {
  Bank.OnStartup(event);
});
