import { BankAccountDatabase } from "../../assets/constants";
import Config from "../../lib/config";
import Cache from "../../utils/cache/main";
import Form from "../../utils/form/main";
import UUID from "../../utils/uuid/main";
import type Member from "../../utils/wrappers/member/main";
import BankSession from "./session";

export default class BankCreator {
  public constructor(private readonly member: Member) {
    this.Create();
  }

  private async Create(): Promise<void> {
    const accounts = Object.values(BankAccountDatabase.Entries()).filter(
      (entry) => entry.owner === this.member.EntityID()
    );

    if (accounts.length >= Config.BankMaxAccounts) {
      this.member.SendError(
        "You have reached the max amount of bank accounts!"
      );
      return;
    }

    const passwordLimit = Config.BankPasswordLimit;
    const usernameLimit = Config.BankUsernameLimit;
    const form = await Form.ModalForm({
      title: "Account Creator",
      member: this.member,
      options: [
        {
          type: "textfield",
          label: `Hello, ${this.member.Username()}!\n\nPlease enter the username you would like for your new account.`,
          ghost: "Username...",
          tooltip: `The username must be between ${usernameLimit[0]}-${
            usernameLimit[1]
          } characters, and no invalid characters: ${Config.BankInvalidCharacters.join(
            " "
          )}`,
        },
        {
          type: "textfield",
          label: "Enter the password for your new account.",
          ghost: "Password...",
          tooltip: `The password must be between ${passwordLimit[0]}-${
            passwordLimit[1]
          } characters, and must contain no invalid characters: ${Config.BankInvalidCharacters.join(
            " "
          )}`,
        },
      ],
    });

    if (!form.formValues) {
      return;
    }

    const username = form.formValues[0] as string;
    const password = form.formValues[1] as string;
    const check = BankCreator.CheckCredentials(username, password);

    if (check) {
      this.member.SendError(check);
      return;
    }

    const id = UUID.V4();

    BankAccountDatabase.Set(id, {
      id,
      owner: this.member.EntityID(),
      username,
      password,
      balance: Config.BankDefaultBalance,
      disabled: false,
      format_type: "comma",
      created_at: new Date(),
      last_logged_in: new Date(),
    });
    Cache.BankSessions[this.member.EntityID()] = new BankSession(
      this.member,
      id
    );

    this.member.SendSuccess(
      `Successfully created account and logged into ${username}!`
    );
  }

  public static CheckCredentials(
    username: string,
    password: string
  ): string | undefined {
    const usernameLimit = Config.BankUsernameLimit;
    const passwordLimit = Config.BankUsernameLimit;
    const usernameTaken = Object.values(BankAccountDatabase.Entries()).some(
      (entry) => entry.username === username
    );

    switch (true) {
      // Username
      case usernameLimit[0] > username.length:
        return "Username is too short.";
      case usernameLimit[1] < username.length:
        return "Username is too long.";
      case Config.BankInvalidCharacters.some((character) =>
        username.includes(character)
      ):
        return "Username includes invalid character.";
      case usernameTaken:
        return "Username is already taken.";
      // Password
      case passwordLimit[0] > password.length:
        return "Password is too short.";
      case passwordLimit[1] < password.length:
        return "Password is too long.";
      case Config.BankInvalidCharacters.some((character) =>
        password.includes(character)
      ):
        return "Password includes invalid character.";
    }
  }
}
