import { Request, Response } from "express";
import { CreateHouseDto } from "../types/House";
import { listHouses, writeHouse } from "../services/houseService";

export const getHouses = async (req: Request, res: Response) => {
  const houses = await listHouses();
  res.status(200).json(houses);
};

export const addHouse = async (req: Request, res: Response) => {
  const newHouse = req.body as CreateHouseDto;
  const houseWithId = await writeHouse(newHouse);
  res.status(201).json(houseWithId);
};
