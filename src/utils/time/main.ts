import { TIMESTARTED } from "../../assets/constants";

export default class Time {
  public static Now(): string {
    return new Date().toLocaleString();
  }

  public static Elapsed(start?: Date): string {
    let milliseconds = Date.now() - (start || TIMESTARTED).getTime();
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    milliseconds = milliseconds % 1000;
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    switch (true) {
      case days > 0:
        return `${days}d, ${hours}h`;
      case hours > 0:
        return `${hours}h, ${minutes}m`;
      case minutes > 0:
        return `${minutes}m, ${seconds}s`;
      case seconds > 0:
        return `${seconds}s, ${milliseconds}ms`;

      default:
        return `${milliseconds}ms`;
    }
  }
}
