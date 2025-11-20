import { Request, Response } from "express";

import logger from "../utils/logger";
import { CreateThingDto, Thing } from "../types/Thing";
import { createThing, getThingById, listThings, removeThing, updateThing } from "../services/thingService";

export const getThings = async (req: Request, res: Response) => {
  logger.info({ reqId: req.id, userId: req.userId }, "Fetching all things");
  const things = await listThings();
  res.status(200).json(things);
};

export const getThing = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  logger.info({ reqId: req.id, userId: req.userId, thingId: id }, "Getting thing by ID");
  const thing = await getThingById(id);
  if (thing) {
    res.status(200).json(thing);
  } else {
    logger.info({ reqId: req.id, userId: req.userId, thingId: id }, "Thing not found");
    res.status(404).json({ message: `Thing with ID ${id} not found` });
  }
};

export const postThing = async (req: Request, res: Response) => {
  logger.info({ reqId: req.id, userId: req.userId }, "Creating new thing");
  const newThing = req.body as CreateThingDto;
  const thingWithId = await createThing(newThing);
  res.status(201).json(thingWithId);
};

export const putThing = async (req: Request, res: Response) => {
  const newThing = req.body as Thing;
  logger.info({ reqId: req.id, userId: req.userId, thingId: newThing.id }, "Updating thing");
  const updatedThing = await updateThing(newThing);
  res.status(200).json(updatedThing);
};

export const deleteThing = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  logger.info({ reqId: req.id, userId: req.userId, thingId: id }, "Deleting thing");
  await removeThing(id);
  res.status(204).send();
};
