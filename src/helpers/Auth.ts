import { Request, Response, NextFunction } from "express";
import envVars from "./EnvConfig";
import { ErrorResponse } from "./Response";
import { decode } from "jsonwebtoken";
import { User } from "../constants/entities";
declare global {
    namespace Express {
      interface Request {
        allow?: String[];
        user?: User
      }
    }
  }
async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    try {
        const { headers } = request;
        const token = headers['authorization']?.split(" ")[1]
        if (!token) {
            throw new ErrorResponse(401, "Unauthorized request!", []) 
        }
        const jwt = decode(token as string, { complete : true})
        request.user = jwt?.payload as User;
        if (request.allow?.includes(request.user.roleCode)) {
            next()
            return;
        }
        throw new ErrorResponse(401, "Unauthorized request!", []) 
    } catch (error) {
        next(error)
    }
    
}

export function bindApiToRole (roles: String[]) {
    return function (request: Request,response: Response, next: NextFunction) {
        request.allow = roles;
        next()
    }
}
export default authMiddleware;