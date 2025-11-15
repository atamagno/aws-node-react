export interface Thing {
  id: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export type CreateThingDto = Omit<Thing, "id" | "createdAt" | "updatedAt">;
