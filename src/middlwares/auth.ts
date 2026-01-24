import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from '../lib/auth';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// ✅ Proper global declaration (syntax fixed)
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

// ✅ Auth middleware
const auth =
  (...roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get user session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: 'Email not verified, please verify your email to proceed',
        });
      }

      // attach user to request
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      // role check
      if (!roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You don't have enough permissions to access this resource",
        });
      }

      // ✅ VERY IMPORTANT
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  export default auth;