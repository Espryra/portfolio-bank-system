const Config = {
  debug: true,

  // General
  sounds: {
    info: "note.hat",
    success: "note.pling",
    warning: "note.harp",
    error: "note.bass",
  },
  colors: {
    info: "",
    success: "§a",
    warning: "§e",
    error: "§c",
  },
  MoneyObjective: "money",

  CommandNamespace: "espryra:",

  BankInvalidCharacters: ['"', "'", "`", "\\", "{", "}"],
  BankPasswordLimit: [4, 16] as [number, number], // [min, max]
  BankUsernameLimit: [4, 16] as [number, number], // [min, max]
  BankMaxAccounts: 1,
  BankDefaultBalance: 0,
};

export default Config;
