import type { PlayerJoinAfterEvent } from "@minecraft/server";
import { UsernameDatabase } from "../../assets/constants";

export default class Username {
  public static OnJoin(event: PlayerJoinAfterEvent): void {
    UsernameDatabase.Set(event.playerId, event.playerName);
  }
}
