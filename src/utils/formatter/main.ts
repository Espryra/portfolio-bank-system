import type { Vector3 } from "@minecraft/server";
import Logger from "../logger/main";

export default class Formatter {
  public static ToShort(number: number): string {
    let result: string;

    switch (true) {
      case number >= 1000000000:
        result = (number / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
        break;
      case number >= 1000000:
        result = (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
        break;
      case number >= 1000:
        result = (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
        break;
      default:
        result = number.toFixed(2);
    }

    return result;
  }

  public static ToComma(number: number): string {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  public static ToLocation(text: string): Vector3 {
    const [x, y, z] = text.split(" ");

    if (x === undefined || y === undefined || z === undefined) {
      return { x: 0, y: 0, z: 0 };
    }

    return {
      x: Number(x),
      y: Number(y),
      z: Number(z),
    };
  }

  public static ToExpiration(text: string): Date {
    let milliseconds = 0;

    if (text.length === 0) {
      return new Date();
    }

    const pieces = text.split(", ");

    for (const piece of pieces) {
      switch (true) {
        case piece.endsWith("d"):
          milliseconds += 86400000 * Number(piece.replace("d", ""));
          break;
        case piece.endsWith("h"):
          milliseconds += 3600000 * Number(piece.replace("h", ""));
          break;
        case piece.endsWith("m"):
          milliseconds += 60000 * Number(piece.replace("m", ""));
          break;
        case piece.endsWith("s"):
          milliseconds += 1000 * Number(piece.replace("s", ""));
          break;
      }
    }

    return new Date(Date.now() + milliseconds);
  }

  public static ReverseExpiration(date: Date | string): string {
    const parts: string[] = [];
    const offset = new Date(date).getTime() - Date.now();

    if (offset <= 0) {
      return "";
    }

    let seconds = Math.floor(offset / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(", ");
  }

  public static ReadableTypeId(typeId: string): string {
    const base = typeId.split(":")[1];

    if (!base) {
      Logger.Error("Invalid type ID!");
      return typeId;
    }

    return base
      .split("_")
      .map((word) => word[0]!.toUpperCase() + word.slice(1))
      .join(" ");
  }
}
