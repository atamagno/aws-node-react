import { Request, Response } from "express";

import logger from "../utils/logger";
import { ConfirmSignUpDto, SignInDto, SignUpDto, confirmSignUp, signIn, signUpUser } from "../services/authService";

export const postSignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const signUpDto: SignUpDto = req.body;

    const result = await signUpUser(signUpDto);

    logger.info({ reqId: req.id, userSub: result.userSub }, "User signed up successfully");

    res.status(201).send({
      message: result.userConfirmed ? "User signed up successfully" : "User signed up. Please verify your email.",
      userSub: result.userSub,
      userConfirmed: result.userConfirmed,
    });
  } catch (error: unknown) {
    logger.error({ reqId: req.id, error }, "Sign up failed");

    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    const message = (error as { message?: string }).message || "Sign up failed";

    res.status(statusCode).send({ message });
  }
};

export const postConfirmSignUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const confirmDto: ConfirmSignUpDto = req.body;

    await confirmSignUp(confirmDto);

    logger.info({ reqId: req.id, email: confirmDto.email }, "User confirmed successfully");

    res.status(200).send({
      message: "User confirmed successfully. You can now sign in.",
    });
  } catch (error: unknown) {
    logger.error({ reqId: req.id, error }, "Confirm sign up failed");

    const statusCode = (error as { statusCode?: number }).statusCode || 500;
    const message = (error as { message?: string }).message || "Confirm sign up failed";

    res.status(statusCode).send({ message });
  }
};

export const postSignIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const signInDto: SignInDto = req.body;

    const result = await signIn(signInDto);

    logger.info({ reqId: req.id, email: signInDto.email }, "User signed in successfully");

    res.status(200).send({
      message: "Sign in successful",
      accessToken: result.accessToken,
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    });
  } catch (error: unknown) {
    logger.error({ reqId: req.id, error }, "Sign in failed");

    const statusCode = (error as { statusCode?: number }).statusCode || 401;
    const message = (error as { message?: string }).message || "Sign in failed";

    res.status(statusCode).send({ message });
  }
};
