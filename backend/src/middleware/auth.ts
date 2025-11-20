import { CognitoJwtVerifier } from "aws-jwt-verify";

import { NextFunction, Request, Response } from "express";

import config from "../config";
import logger from "../utils/logger";

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.cognitoUserPoolId,
  tokenUse: "access",
  clientId: config.cognitoClientId,
});

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn({ reqId: req.id }, "Missing or invalid authorization header");
      res.status(401).send({ message: "Missing or invalid authorization token" });
      return;
    }

    const token = authHeader.substring(7);

    const payload = await verifier.verify(token);

    req.userId = payload.sub;
    logger.info({ reqId: req.id, userId: req.userId }, "User authenticated successfully");
    next();
  } catch (error) {
    logger.warn({ reqId: req.id, error }, "Token verification failed");
    res.status(403).send({ message: "Invalid or expired token" });
  }
};
