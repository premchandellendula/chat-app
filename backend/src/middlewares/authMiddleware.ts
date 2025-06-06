import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({
            message: "Token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(decoded.userId){
            req.userId = decoded.userId;
            next()
        }else{
            res.status(401).json({
                message: "Invalid token payload"
            })
        }
    }catch(err){
        res.status(401).json({
            message: "Unauthorized",
            error: err instanceof Error ? err.message : "Unknown error"
        })
    }
}

export default authMiddleware