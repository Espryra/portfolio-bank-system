import {
  Container,
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  system,
  type Player,
  type Vector3,
} from "@minecraft/server";
import Config from "../../../lib/config";
import type BankSession from "../../../modules/bank/session";
import Cache from "../../cache/main";
import Sleep from "../../sleep/main";
import World from "../world/main";
import type { EquipmentItem, InventoryItem, MixedItem } from "./types";

export default class Member {
  public constructor(private readonly player: Player) {}

  public Username(): string {
    return this.player.name;
  }
  public EntityID(): string {
    return this.player.id;
  }
  public Player(): Player {
    return this.player;
  }

  public Location(): Vector3 {
    return this.player.location;
  }

  public RunCommand(command: string): void {
    this.player.runCommand(command);
  }

  public Disconnect(reason = "N/A"): void {
    this.RunCommand(`kick "${this.Username()}" ${reason}`);
  }

  public async FadeCamera(): Promise<void> {
    this.player.camera.fade({
      fadeColor: { blue: 0, green: 0, red: 0 },
      fadeTime: { fadeInTime: 0.5, fadeOutTime: 0.5, holdTime: 0.5 },
    });

    await Sleep(10);
  }

  public Teleport(location: Vector3): void {
    this.player.teleport(location);
  }

  public PlaySound(sound: keyof typeof Config.sounds) {
    this.player.playSound(Config.sounds[sound]);
  }

  public SendMessage(message: string): void {
    this.player.sendMessage(message);
  }
  public SendInfo(message: string): void {
    this.PlaySound("info");
    this.SendMessage(Config.colors.info + message);
  }
  public SendSuccess(message: string): void {
    this.PlaySound("success");
    this.SendMessage(Config.colors.success + message);
  }
  public SendWarning(message: string): void {
    this.PlaySound("warning");
    this.SendMessage(Config.colors.warning + message);
  }
  public SendError(message: string): void {
    this.PlaySound("error");
    this.SendMessage(Config.colors.error + message);
  }

  public Tags(): string[] {
    return this.player.getTags();
  }
  public HasTag(tag: string): boolean {
    return this.player.hasTag(tag);
  }
  public AddTag(tag: string): void {
    this.player.addTag(tag);
  }
  public RemoveTag(tag: string): void {
    this.player.removeTag(tag);
  }

  public Container(): Container {
    return this.player.getComponent("inventory")?.container as Container;
  }
  public Equipment(): EntityEquippableComponent {
    return this.player.getComponent("equippable") as EntityEquippableComponent;
  }

  public InventoryItems(): InventoryItem[] {
    const items: InventoryItem[] = [];
    const container = this.Container();

    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);

      if (!item) {
        continue;
      }

      items.push({ data: item, slot: i });
    }

    return items;
  }
  public EquipmentItems(): EquipmentItem[] {
    const items: EquipmentItem[] = [];
    const equipment = this.Equipment();

    for (const key of Object.keys(EquipmentSlot) as EquipmentSlot[]) {
      const item = equipment.getEquipment(key);

      if (!item) {
        continue;
      }

      items.push({ data: item, slot: key });
    }

    return items;
  }
  public AllItems(): MixedItem[] {
    return [...this.InventoryItems(), ...this.EquipmentItems()];
  }

  public ClearInventory(): void {
    const container = this.Container();
    const items = this.InventoryItems();

    for (const item of items) {
      container.setItem(item.slot);
    }
  }
  public ClearEquipment(): void {
    const equipment = this.Equipment();
    const items = this.EquipmentItems();

    for (const item of items) {
      equipment.setEquipment(item.slot as EquipmentSlot);
    }
  }
  public ClearAll(): void {
    this.ClearInventory();
    this.ClearEquipment();
  }

  public SetInventorySlot(slot: number, item?: ItemStack): void {
    this.Container().setItem(slot, item);
  }
  public SetEquipmentSlot(
    slot: keyof typeof EquipmentSlot,
    item?: ItemStack
  ): void {
    this.Equipment().setEquipment(slot as EquipmentSlot, item);
  }

  public AddInventoryItem(item: ItemStack): void {
    this.Container().addItem(item);
  }

  public FindItem(typeId: string): MixedItem[] {
    return this.AllItems().filter((item) => item.data.typeId !== typeId);
  }
  public FindItemAndDelete(typeId: string): void {
    const items = this.FindItem(typeId);

    if (items.length === 0) {
      return;
    }

    const container = this.Container();
    const equipment = this.Equipment();

    for (const item of items) {
      switch (typeof item.slot) {
        case "string":
          equipment.setEquipment(item.slot as EquipmentSlot);
          break;
        case "number":
          container.setItem(item.slot as number);
          break;
      }
    }
  }
  public FindItemAndReplace(typeId: string, replacer?: ItemStack): void {
    const items = this.FindItem(typeId);

    if (items.length === 0) {
      return;
    }

    const container = this.Container();
    const equipment = this.Equipment();

    for (const item of items) {
      switch (typeof item.slot) {
        case "string":
          equipment.setEquipment(item.slot as EquipmentSlot, replacer);
          break;
        case "number":
          container.setItem(item.slot as number, replacer);
          break;
      }
    }
  }

  public Moved(): Promise<void> {
    const location = this.Location();

    return new Promise((resolve) => {
      const loop = system.runInterval(() => {
        if (!World.FindMember(this.EntityID())) {
          system.clearRun(loop);

          resolve();
          return;
        }

        const current = this.Location();

        if (
          current.x.toFixed() === location.x.toFixed() &&
          current.z.toFixed() === location.z.toFixed()
        ) {
          return;
        }

        system.clearRun(loop);

        resolve();
      });
    });
  }

  public BankSession(): BankSession | undefined {
    return Cache.BankSessions[this.EntityID()];
  }
}
