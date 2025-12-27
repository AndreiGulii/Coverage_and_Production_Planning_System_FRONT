export type ItemType = "product" | "semiproduct";

export interface ProductionSlot {
  id: string;

  machineId: string;
  machineName?: string;

  pressformId: string;
  pressformName?: string;

  itemId: string;
  itemType: ItemType;
  itemName?: string;

  quantity: number;

  startTime: string; // ISO
  endTime: string;   // ISO

  setupTimeMinutes: number;
  productionTimeMinutes: number;
}