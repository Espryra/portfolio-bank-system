import { BankAccountDatabase } from "../../assets/constants";
import Cache from "../../utils/cache/main";
import Form from "../../utils/form/main";
import Formatter from "../../utils/formatter/main";
import Validate from "../../utils/Validate/main";
import type Member from "../../utils/wrappers/member/main";
import World from "../../utils/wrappers/world/main";
import BankCreator from "./creator";
import type { BankAccount } from "./types";

export default class BankSession {
  private account: BankAccount | undefined;

  public constructor(
    public readonly member: Member,
    public readonly sessionID: string
  ) {}

  public async MainPage(): Promise<void> {
    this.UpdateAccount();

    if (!this.account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    const form = await Form.ActionForm({
      title: "Main Page",
      member: this.member,
      body: `Hello, ${this.account.username}!\n\nBank Balance: $${
        this.account.format_type === "short"
          ? Formatter.ToShort(this.account.balance)
          : Formatter.ToComma(this.account.balance)
      }\n\nPlease select an option down below.`,
      buttons: [
        {
          text: "Deposit",
          subtext: "Click to Open",
          icon: "textures/ui/download_backup",
        },
        {
          text: "Withdraw",
          subtext: "Click to Open",
          icon: "textures/ui/upload_glyph",
        },
        {
          text: "Settings",
          subtext: "Click to Open",
          icon: "textures/ui/settings_glyph_color_2x",
        },
        {
          text: "Logout",
          subtext: "Click to Logout",
          icon: "textures/ui/icon_import",
        },
        {
          text: "Terminate Account",
          subtext: "Click to Open",
          icon: "textures/blocks/tnt_side",
        },
      ],
    });

    switch (form.selection) {
      case 0:
        this.DepositPage();
        break;
      case 1:
        this.WithdrawPage();
        break;
      case 2:
        this.SettingsPage();
        break;
      case 3:
        this.Logout();
        break;
      case 4:
        this.TerminatePage();
        break;
    }
  }

  public async DepositPage(): Promise<void> {
    this.UpdateAccount();

    if (!this.account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    const form = await Form.ModalForm({
      title: "Deposit Page",
      member: this.member,
      options: [
        {
          type: "textfield",
          label: `Hello, ${this.account.username}!\n\nPersonal Balance: $${
            this.account.format_type === "short"
              ? Formatter.ToShort(World.GetMoney(this.member))
              : Formatter.ToComma(World.GetMoney(this.member))
          }\n\nHow much would you like to deposit into your bank?\n`,
          ghost: "Amount...",
        },
      ],
    });

    if (!form.formValues) {
      return;
    }

    const amount = Number(form.formValues[0]);
    const money = World.GetMoney(this.member);

    if (!Validate.Balance(amount)) {
      this.member.SendError("Please enter a valid number!");
      return;
    }
    if (money < amount) {
      this.member.SendError("You do not have enough for this deposit!");
      return;
    }

    const account = BankAccountDatabase.Get(this.account.id);

    if (!account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    account.balance += amount;

    World.SetMoney(this.member, money - amount);
    BankAccountDatabase.Set(account.id, account);

    this.member.SendSuccess(
      `Successfully deposited $${
        account.format_type === "short"
          ? Formatter.ToShort(amount)
          : Formatter.ToComma(amount)
      } into your bank!`
    );
  }
  public async WithdrawPage(): Promise<void> {
    this.UpdateAccount();

    if (!this.account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    const form = await Form.ModalForm({
      title: "Withdraw Page",
      member: this.member,
      options: [
        {
          type: "textfield",
          label: `Hello, ${this.account.username}!\n\nBank Balance: $${
            this.account.format_type === "short"
              ? Formatter.ToShort(this.account.balance)
              : Formatter.ToComma(this.account.balance)
          }\n\nHow much would you like to withdraw into your bank?\n`,
          ghost: "Amount...",
        },
      ],
    });

    if (!form.formValues) {
      return;
    }

    const amount = Number(form.formValues[0]);
    const money = World.GetMoney(this.member);

    if (!Validate.Balance(amount)) {
      this.member.SendError("Please enter a valid number!");
      return;
    }

    const account = BankAccountDatabase.Get(this.account.id);

    if (!account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }
    if (account.balance < amount) {
      this.member.SendError("You do not have enough for this deposit!");
      return;
    }

    account.balance -= amount;

    World.SetMoney(this.member, money + amount);
    BankAccountDatabase.Set(account.id, account);

    this.member.SendSuccess(
      `Successfully withdrawled $${
        account.format_type === "short"
          ? Formatter.ToShort(amount)
          : Formatter.ToComma(amount)
      } from your bank!`
    );
  }
  private async TerminatePage(): Promise<void> {
    this.UpdateAccount();

    if (!this.account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    const form = await Form.ActionForm({
      title: "Terminate Page",
      member: this.member,
      body: `Woah, ${this.account.username}...\n\nAre you sure you would like to delete your bank account? This would include your bank balance!`,
      buttons: [
        {
          text: "Cancel Termination",
          subtext: "Click to Close",
          icon: "textures/ui/cancel",
        },
        {
          text: "Continue Termination",
          subtext: "Click to Terminate",
          icon: "textures/ui/confirm",
        },
      ],
    });

    switch (form.selection) {
      case 0:
        break;
      case 1:
        BankAccountDatabase.Set(this.sessionID);

        this.member.SendSuccess("Successfully deleted your bank account.");

        this.Logout();
    }
  }

  public async SettingsPage(): Promise<void> {
    this.UpdateAccount();

    if (!this.account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    const form = await Form.ActionForm({
      title: "Settings Page",
      member: this.member,
      body: `Hello, ${this.account.username}!\n\nWhat would you like to do?\n`,
      buttons: [
        {
          text: "Change Login",
          subtext: "Click to Open",
          icon: "textures/items/book_writable",
        },
        {
          text: "Change Format Type",
          subtext: "Click to Open",
          icon: "textures/items/book_writable",
        },
      ],
    });

    switch (form.selection) {
      case 0:
        this.ChangeLogin();
        break;
      case 1:
        this.FormatType();
        break;
    }
  }
  public async FormatType(): Promise<void> {
    this.UpdateAccount();

    if (!this.account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    const form = await Form.ModalForm({
      title: "Change Format Type",
      member: this.member,
      options: [
        {
          type: "dropdown",
          label: `Hello, ${this.account.username}!\n\nPlease select which format type you want to display.`,
          options: ["Comma", "Short"],
          tooltip: `Comma: 100,000.00\nShort: 100.00k`,
          default: this.account.format_type === "short" ? 1 : 0,
        },
      ],
    });

    if (!form.formValues) {
      return;
    }

    const choice = form.formValues[0] === 0 ? "comma" : "short";
    const account = BankAccountDatabase.Get(this.account.id);

    if (!account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    account.format_type = choice;

    BankAccountDatabase.Set(account.id, account);

    this.member.SendSuccess("Successfully updated your format type!");
  }
  public async ChangeLogin(): Promise<void> {
    this.UpdateAccount();

    if (!this.account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    const form = await Form.ModalForm({
      title: "Change Login Information",
      member: this.member,
      options: [
        {
          type: "textfield",
          label: `Hello, ${this.account.username}!\n\nWhat would you like your new username to be?\n`,
          ghost: "Username...",
          tooltip: "This will log you out of your account after changing.",
          default: this.account.username,
        },
        {
          type: "textfield",
          label: `What would you like your new password to be?\n`,
          ghost: "Password...",
          tooltip: "This will log you out of your account after changing.",
          default: this.account.password,
        },
      ],
    });

    if (!form.formValues) {
      return;
    }

    const username = form.formValues[0] as string;
    const password = form.formValues[1] as string;

    if (
      username === this.account.username &&
      password === this.account.password
    ) {
      return;
    }

    const check = BankCreator.CheckCredentials(username, password);

    if (check) {
      this.member.SendError(check);
      return;
    }

    const account = BankAccountDatabase.Get(this.account.id);

    if (!account) {
      this.member.SendError(
        "It seems your account is not found, please try logging again."
      );

      delete Cache.BankSessions[this.member.EntityID()];

      return;
    }

    account.username = username;
    account.password = password;

    BankAccountDatabase.Set(account.id, account);

    this.member.SendSuccess(
      "Successfully updated your login, please sign in again!"
    );

    this.Logout();
  }

  public UpdateAccount(): void {
    this.account = BankAccountDatabase.Get(this.sessionID);
  }
  public Logout(): void {
    delete Cache.BankSessions[this.member.EntityID()];

    this.member.SendWarning("You have been logged out of your bank account!");
  }
}
