import { Request, Response } from "express";
import { CreateBidDto } from "../types/Bid";
import { listBids, writeBid } from "../services/bidService";

export const getBids = async (req: Request, res: Response) => {
  const { houseId } = req.params as { houseId: string };
  const houseBids = await listBids(houseId);
  res.status(200).json(houseBids);
};

export const addBid = async (req: Request, res: Response) => {
  const newBid = req.body as CreateBidDto;
  const bidWithId = await writeBid(newBid);
  res.status(201).json(bidWithId);
};
