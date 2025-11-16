export interface Thing {
  id: string;
  description: string;
  createdAt: number;
  updatedAt?: number;
}

export type CreateThingDto = Omit<Thing, "id" | "createdAt" | "updatedAt">;
