import { CognitoIdentityProviderClient, ConfirmSignUpCommand, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

import config from "../config";
import logger from "../utils/logger";
import { ApiError } from "../types/Error";

const cognitoClient = new CognitoIdentityProviderClient({ region: config.awsRegion });

export interface SignUpDto {
  email: string;
  password: string;
  name?: string;
}

export interface SignUpResponse {
  userSub: string;
  userConfirmed: boolean;
}

export const signUpUser = async (signUpDto: SignUpDto): Promise<SignUpResponse> => {
  try {
    const userAttributes = [{ Name: "email", Value: signUpDto.email }];

    if (signUpDto.name) {
      userAttributes.push({ Name: "name", Value: signUpDto.name });
    }

    const command = new SignUpCommand({
      ClientId: config.cognitoClientId,
      Username: signUpDto.email,
      Password: signUpDto.password,
      UserAttributes: userAttributes,
    });

    const response = await cognitoClient.send(command);

    return {
      userSub: response.UserSub || "",
      userConfirmed: response.UserConfirmed || false,
    };
  } catch (error) {
    logger.error({ error }, "Cognito sign up failed");

    const apiError: ApiError = {
      name: "SignUpError",
      statusCode: 400,
      message: "Failed to sign up user",
      internalError: error instanceof Error ? error.message : "Unknown sign up error",
    };
    throw apiError;
  }
};

export interface ConfirmSignUpDto {
  email: string;
  confirmationCode: string;
}

export const confirmSignUp = async (confirmDto: ConfirmSignUpDto): Promise<void> => {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: config.cognitoClientId,
      Username: confirmDto.email,
      ConfirmationCode: confirmDto.confirmationCode,
    });

    await cognitoClient.send(command);
  } catch (error) {
    logger.error({ error }, "Cognito confirm sign up failed");

    const apiError: ApiError = {
      name: "ConfirmSignUpError",
      statusCode: 400,
      message: "Failed to confirm sign up",
      internalError: error instanceof Error ? error.message : "Unknown confirmation error",
    };
    throw apiError;
  }
};

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const signIn = async (signInDto: SignInDto): Promise<SignInResponse> => {
  try {
    const command = new InitiateAuthCommand({
      ClientId: config.cognitoClientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: signInDto.email,
        PASSWORD: signInDto.password,
      },
    });

    const response = await cognitoClient.send(command);

    if (!response.AuthenticationResult) {
      throw new Error("Authentication failed - no tokens returned");
    }

    return {
      accessToken: response.AuthenticationResult.AccessToken || "",
      idToken: response.AuthenticationResult.IdToken || "",
      refreshToken: response.AuthenticationResult.RefreshToken || "",
      expiresIn: response.AuthenticationResult.ExpiresIn || 3600,
    };
  } catch (error) {
    logger.error({ error }, "Cognito sign in failed");

    const apiError: ApiError = {
      name: "SignInError",
      statusCode: 401,
      message: "Failed to sign in",
      internalError: error instanceof Error ? error.message : "Unknown sign in error",
    };
    throw apiError;
  }
};
