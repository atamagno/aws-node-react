import { Request, Response } from "express";
import { CreateBidDto } from "../types/Bid";
import { v4 as uuidv4 } from "uuid";
import bids from "../data/bids";

export const getBids = (req: Request, res: Response) => {
  const { houseId } = req.params;
  const houseBids = bids.filter(bid => bid.houseId === houseId);
  res.status(200).json(houseBids);
};

export const addBid = (req: Request, res: Response) => {
  const newBid = req.body as CreateBidDto;
  const bidWithId = { id: uuidv4(), ...newBid };
  bids.push(bidWithId);
  res.status(201).json(bidWithId);
}