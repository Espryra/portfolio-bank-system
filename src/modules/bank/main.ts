import {
  CommandPermissionLevel,
  Player,
  StartupEvent,
  system,
} from "@minecraft/server";
import Config from "../../lib/config";
import Form from "../../utils/form/main";
import Member from "../../utils/wrappers/member/main";
import BankCreator from "./creator";
import BankLogin from "./login";

export default class Bank {
  public static OnStartup(event: StartupEvent): void {
    const { customCommandRegistry } = event;

    customCommandRegistry.registerCommand(
      {
        name: Config.CommandNamespace + "settings",
        description: "Open your settings for your bank account.",
        permissionLevel: CommandPermissionLevel.Any,
      },
      (origin) => {
        const { sourceEntity: player } = origin;

        if (!(player instanceof Player)) {
          return;
        }

        const member = new Member(player);
        const session = member.BankSession();

        system.run(() => {
          if (!session) {
            new BankLogin(member);
            return;
          }

          session.SettingsPage();
        });

        return undefined;
      }
    );
    customCommandRegistry.registerCommand(
      {
        name: Config.CommandNamespace + "login",
        description: "Login into a bank account.",
        permissionLevel: CommandPermissionLevel.Any,
      },
      (origin) => {
        const { sourceEntity: player } = origin;

        if (!(player instanceof Player)) {
          return;
        }

        const member = new Member(player);
        const session = member.BankSession();

        system.run(() => {
          if (session) {
            member.SendError(`You are logged into a account!`);
            return;
          }

          new BankLogin(member);
        });

        return undefined;
      }
    );
    customCommandRegistry.registerCommand(
      {
        name: Config.CommandNamespace + "logout",
        description: "Logout of your bank account.",
        permissionLevel: CommandPermissionLevel.Any,
      },
      (origin) => {
        const { sourceEntity: player } = origin;

        if (!(player instanceof Player)) {
          return;
        }

        const member = new Member(player);
        const session = member.BankSession();

        system.run(() => {
          if (!session) {
            member.SendError("You are not logged into a bank account!");
            return;
          }

          session.Logout();
        });

        return undefined;
      }
    );
    customCommandRegistry.registerCommand(
      {
        name: Config.CommandNamespace + "withdraw",
        description: "Withdraw money from your bank balance.",
        permissionLevel: CommandPermissionLevel.Any,
      },
      (origin) => {
        const { sourceEntity: player } = origin;

        if (!(player instanceof Player)) {
          return;
        }

        const member = new Member(player);
        const session = member.BankSession();

        system.run(() => {
          if (!session) {
            this.SessionHandler(member);
            return;
          }

          session.WithdrawPage();
        });

        return undefined;
      }
    );
    customCommandRegistry.registerCommand(
      {
        name: Config.CommandNamespace + "deposit",
        description: "Deposit money into your bank balance.",
        permissionLevel: CommandPermissionLevel.Any,
      },
      (origin) => {
        const { sourceEntity: player } = origin;

        if (!(player instanceof Player)) {
          return;
        }

        const member = new Member(player);
        const session = member.BankSession();

        system.run(() => {
          if (!session) {
            this.SessionHandler(member);
            return;
          }

          session.DepositPage();
        });

        return undefined;
      }
    );
    customCommandRegistry.registerCommand(
      {
        name: Config.CommandNamespace + "bank",
        description: "Open the bank page.",
        permissionLevel: CommandPermissionLevel.Any,
      },
      (origin) => {
        const { sourceEntity: player } = origin;

        if (!(player instanceof Player)) {
          return;
        }

        system.run(() => {
          this.Redirector(new Member(player));
        });

        return undefined;
      }
    );
  }

  private static async SessionHandler(member: Member): Promise<void> {
    const form = await Form.ActionForm({
      title: "Login or Create",
      member,
      body: `Hello, ${member.Username()}!\n\nWould you like to create a new bank account or login into a active account?\n`,
      buttons: [
        {
          text: "Login into Account",
          subtext: "Click to Open",
          icon: "textures/items/book_writable",
        },
        {
          text: "Create Account",
          subtext: "Click to Open",
          icon: "textures/ui/color_plus",
        },
      ],
    });

    switch (form.selection) {
      case 0:
        new BankLogin(member);
        break;
      case 1:
        new BankCreator(member);
        break;
    }
  }

  public static async Redirector(member: Member): Promise<void> {
    const session = member.BankSession();

    if (!session) {
      this.SessionHandler(member);
      return;
    }

    session.MainPage();
  }
}
