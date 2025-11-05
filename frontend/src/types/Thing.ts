export interface Thing {
  id: number;
  address: string;
  country: string;
  description: string;
  price: number;
  photo?: string;
}

export type CreateThingDto = Omit<Thing, "id">;
