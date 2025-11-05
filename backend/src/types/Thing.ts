export interface Thing {
  id: string;
  address: string;
  country: string;
  description: string;
  price: number;
  photo?: string;
}

export type CreateThingDto = Omit<Thing, "id">;
