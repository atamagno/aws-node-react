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
import logger from "../utils/logger";
import { ApiError } from "../types/Error";
import docClient from "../lib/dynamodb/client";
import { CreateThingDto, Thing } from "../types/Thing";

// helper function to handle DynamoDB errors consistently
const handleDbError = (operation: string, error: unknown): never => {
  // log the error using the structured logger
  logger.error({ dbOperation: operation, error: error }, `DynamoDB operation failed: ${operation}`);

  // create a type-safe API error object
  const apiError: ApiError = {
    name: "DatabaseError",
    statusCode: 500,
    message: `Failed to ${operation.toLowerCase()} entity`,
    internalError: error instanceof Error ? error.message : "Unknown DB error",
  };
  throw apiError;
};

const listThings = async (): Promise<Thing[] | undefined> => {
  try {
    const params: ScanCommandInput = {
      TableName: config.thingsTableName,
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items as Thing[];
  } catch (error) {
    handleDbError("Scan", error);
  }
};

const createThing = async (newThing: CreateThingDto): Promise<Thing | undefined> => {
  try {
    const thingWithId = {
      id: uuidv4(),
      createdAt: Date.now().toString(),
      ...newThing,
    };
    const params: PutCommandInput = {
      TableName: config.thingsTableName,
      Item: thingWithId,
    };
    await docClient.send(new PutCommand(params));
    return thingWithId;
  } catch (error) {
    handleDbError("Create", error);
  }
};

const getThingById = async (id: string): Promise<Thing | undefined> => {
  try {
    const params: GetCommandInput = {
      TableName: config.thingsTableName,
      Key: { id },
    };
    const result = await docClient.send(new GetCommand(params));
    return result.Item as Thing | undefined;
  } catch (error) {
    handleDbError("Get", error);
  }
};

const updateThing = async (updatedThing: Thing): Promise<Thing | undefined> => {
  try {
    updatedThing.updatedAt = Date.now().toString();
    const params: PutCommandInput = {
      TableName: config.thingsTableName,
      Item: updatedThing,
    };
    await docClient.send(new PutCommand(params));
    return updatedThing;
  } catch (error) {
    handleDbError("Update", error);
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
    handleDbError("Delete", error);
  }
};

export { listThings, getThingById, createThing, updateThing, removeThing };
