import { Request, Response } from "express";

import { CreateThingDto } from "../types/Thing";
import { listThings, writeThing } from "../services/thingService";

export const getThings = async (req: Request, res: Response) => {
  const things = await listThings();
  res.status(200).json(things);
};

export const addThing = async (req: Request, res: Response) => {
  const newThing = req.body as CreateThingDto;
  const thingWithId = await writeThing(newThing);
  res.status(201).json(thingWithId);
};
