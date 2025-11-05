export interface House {
  id: string;
  address: string;
  country: string;
  description: string;
  price: number;
  photo?: string;
}

export type CreateHouseDto = Omit<House, "id">;
