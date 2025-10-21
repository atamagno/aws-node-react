import { Request, Response } from "express";
import { CreateHouseDto } from "../types/House";
import { v4 as uuidv4 } from "uuid";
import houses from "../data/houses";

export const getHouses = (req: Request, res: Response) => {
  res.status(200).json(houses);
};

export const addHouse = (req: Request, res: Response) => {
  const newHouse = req.body as CreateHouseDto;
  const houseWithId = { id: uuidv4(), ...newHouse };
  houses.push(houseWithId);
  res.status(201).json(houseWithId);
};
