import { Request, Response } from "express";

import { CreateThingDto, Thing } from "../types/Thing";
import {
  createThing,
  getThingById,
  listThings,
  removeThing,
  updateThing,
} from "../services/thingService";

export const getThings = async (req: Request, res: Response) => {
  const things = await listThings();
  res.status(200).json(things);
};

export const getThing = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const thing = await getThingById(id);
  if (thing) {
    res.status(200).json(thing);
  } else {
    res.status(404).json({ message: `Thing with ID ${id} not found` });
  }
};

export const postThing = async (req: Request, res: Response) => {
  const newThing = req.body as CreateThingDto;
  const thingWithId = await createThing(newThing);
  res.status(201).json(thingWithId);
};

export const putThing = async (req: Request, res: Response) => {
  const newThing = req.body as Thing;
  const updatedThing = await updateThing(newThing);
  res.status(200).json(updatedThing);
};

export const deleteThing = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await removeThing(id);
  res.status(204).send();
};
