import { v4 as uuidv4 } from "uuid";

import {
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";

import config from "../config";
import docClient from "../lib/dynamodb/client";
import { Bid, CreateBidDto } from "../types/Bid";

const listBids = async (houseId: string): Promise<Bid[]> => {
  try {
    // TODO: change to query with GSI
    const params: ScanCommandInput = {
      TableName: config.bidsTableName,
      FilterExpression: "houseId = :houseId",
      ExpressionAttributeValues: {
        ":houseId": houseId,
      },
    };
    const bids = await docClient.send(new ScanCommand(params));
    return bids.Items as Bid[];
  } catch (error) {
    console.error("Error fetching bids from DynamoDB:", error);
    return [];
  }
};

const writeBid = async (newBid: CreateBidDto): Promise<Bid> => {
  try {
    const bidWithId = { id: uuidv4(), ...newBid };
    const params: PutCommandInput = {
      TableName: config.bidsTableName,
      Item: bidWithId,
    };
    await docClient.send(new PutCommand(params));
    return bidWithId;
  } catch (error) {
    console.error("Error writing bid to DynamoDB:", error);
    throw error;
  }
};

export { listBids, writeBid };
