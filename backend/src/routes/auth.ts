import { ZodError, z } from "zod";

import { NextFunction, Request, Response, Router } from "express";

import logger from "../utils/logger";
import { postConfirmSignUp, postSignIn, postSignUp } from "../controllers/authController";

const router = Router();

const SignUpSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  name: z.string().optional(),
});

const ConfirmSignUpSchema = z.object({
  email: z.email(),
  confirmationCode: z.string().min(1, "Confirmation code is required"),
});

const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

const validate = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn({ reqId: req.id, errors: error.issues }, "Request validation failed");
      const formattedErrors = error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
        code: e.code,
      }));
      return res.status(400).send({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};

router.post("/auth/signup", validate(SignUpSchema), postSignUp);
router.post("/auth/confirm-signup", validate(ConfirmSignUpSchema), postConfirmSignUp);
router.post("/auth/signin", validate(SignInSchema), postSignIn);

export default router;
