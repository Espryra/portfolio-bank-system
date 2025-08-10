export type BankAccount = {
  id: string;
  owner: string;
  username: string;
  password: string;
  balance: number;
  disabled: boolean;
  format_type: "comma" | "short";
  last_logged_in: Date;
  created_at: Date;
};

("");
