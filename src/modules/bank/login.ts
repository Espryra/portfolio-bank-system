import { BankAccountDatabase } from "../../assets/constants";
import Cache from "../../utils/cache/main";
import Form from "../../utils/form/main";
import type Member from "../../utils/wrappers/member/main";
import BankSession from "./session";

export default class BankLogin {
  public constructor(private readonly member: Member) {
    this.Login();
  }

  private async Login(): Promise<void> {
    const form = await Form.ModalForm({
      title: "Bank Login",
      member: this.member,
      options: [
        {
          type: "textfield",
          label: `Hello, ${this.member.Username()}!\n\nPlease enter your account username.`,
          ghost: "Username...",
        },
        {
          type: "textfield",
          label: "Account password.",
          ghost: "Password...",
        },
      ],
    });

    if (!form.formValues) {
      return;
    }

    const username = form.formValues[0] as string;
    const password = form.formValues[1] as string;
    const account = Object.values(BankAccountDatabase.Entries()).find(
      (entry) => entry.password === password && entry.username === username
    );
    const session = Object.values(Cache.BankSessions).find((session) => {
      session.sessionID === account?.id;
    });

    if (!account) {
      this.member.SendError(
        "Could not find an account with the provided information."
      );
      return;
    }
    if (session) {
      this.member.SendError(
        `${session.member.Username()} is already logged into this account! If this is not someone you trust or allow, please contact a staff member.`
      );
      return;
    }

    Cache.BankSessions[this.member.EntityID()] = new BankSession(
      this.member,
      account.id
    );

    this.member.SendSuccess(`Successfully logged in as ${account.username}!`);
  }
}
