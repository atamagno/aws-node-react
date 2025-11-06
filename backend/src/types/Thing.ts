export interface Thing {
  id: string;
  description: string;
}

export type CreateThingDto = Omit<Thing, "id">;
