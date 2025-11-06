import { Request, Response } from "express";

import { CreateThingDto } from "../types/Thing";
import { createThing, listThings } from "../services/thingService";

export const getThings = async (req: Request, res: Response) => {
  const things = await listThings();
  res.status(200).json(things);
};

export const addThing = async (req: Request, res: Response) => {
  const newThing = req.body as CreateThingDto;
  const thingWithId = await createThing(newThing);
  res.status(201).json(thingWithId);
};
