import {
  ActionFormData,
  ModalFormData,
  ModalFormResponse,
  type ActionFormResponse,
} from "@minecraft/server-ui";
import type { ActionForm, ModalForm } from "./types";

export default class Form {
  public static async ActionForm(
    data: ActionForm,
  ): Promise<ActionFormResponse> {
    const { member, buttons, body, title } = data;
    const form = new ActionFormData();

    if (title) form.title(title);
    if (body) form.body(body);

    for (const button of buttons) {
      const { text, icon, subtext } = button;

      form.button(text + (subtext ? `\n§7[ ${subtext}§r §7]` : ""), icon);
    }

    //@ts-ignore This is here because the types are very strict on the ::show method.
    return await form.show(member.Player());
  }
  public static async ModalForm(data: ModalForm): Promise<ModalFormResponse> {
    const { member, options, title } = data;
    const form = new ModalFormData();

    if (title) form.title(title);

    for (const option of options) {
      const { type } = option;

      switch (type) {
        case "label":
          form.label(option.label);
          break;
        case "header":
          form.header(option.header);
          break;
        case "toggle":
          form.toggle(option.label, {
            defaultValue: option.default,
            tooltip: option.tooltip,
          });
          break;
        case "textfield":
          form.textField(option.label, option.ghost, {
            tooltip: option.tooltip,
            defaultValue: option.default,
          });
          break;
        case "dropdown":
          form.dropdown(option.label, option.options, {
            tooltip: option.tooltip,
            defaultValueIndex: option.default,
          });
          break;
        case "slider":
          form.slider(option.label, option.min, option.max, {
            tooltip: option.tooltip,
            defaultValue: option.default,
            valueStep: option.step,
          });
      }
    }

    //@ts-ignore This is here because the types are very strict on the ::show method.
    return await form.show(member.Player());
  }
}
