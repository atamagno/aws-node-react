import { v4 as uuidv4 } from "uuid";

import {
  DeleteCommand,
  DeleteCommandInput,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";

import config from "../config";
import docClient from "../lib/dynamodb/client";
import { CreateThingDto, Thing } from "../types/Thing";

const listThings = async (): Promise<Thing[]> => {
  try {
    const params: ScanCommandInput = {
      TableName: config.thingsTableName,
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items as Thing[];
  } catch (error) {
    console.error("Error fetching things from DynamoDB:", error);
    return [];
  }
};

const createThing = async (newThing: CreateThingDto): Promise<Thing> => {
  try {
    const thingWithId = { id: uuidv4(), ...newThing };
    const params: PutCommandInput = {
      TableName: config.thingsTableName,
      Item: thingWithId,
    };
    await docClient.send(new PutCommand(params));
    return thingWithId;
  } catch (error) {
    console.error("Error writing thing to DynamoDB:", error);
    throw error;
  }
};

const getThingById = async (id: string): Promise<Thing | undefined> => {
  try {
    const params: GetCommandInput = {
      TableName: config.thingsTableName,
      Key: { id },
    };
    const result = await docClient.send(new GetCommand(params));
    console.log("Fetched thing:", result);
    return result.Item as Thing | undefined;
  } catch (error) {
    console.error("Error fetching thing from DynamoDB:", error);
    throw error;
  }
};

const updateThing = async (updatedThing: Thing): Promise<Thing> => {
  try {
    const params: PutCommandInput = {
      TableName: config.thingsTableName,
      Item: updatedThing,
    };
    await docClient.send(new PutCommand(params));
    return updatedThing;
  } catch (error) {
    console.error("Error writing thing to DynamoDB:", error);
    throw error;
  }
};

const removeThing = async (id: string): Promise<void> => {
  try {
    const params: DeleteCommandInput = {
      TableName: config.thingsTableName,
      Key: { id },
    };
    await docClient.send(new DeleteCommand(params));
  } catch (error) {
    console.error("Error deleting thing from DynamoDB:", error);
    throw error;
  }
};

export { listThings, getThingById, createThing, updateThing, removeThing };
