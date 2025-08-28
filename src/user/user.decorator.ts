import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { SECRET } from "src/config";

export const User = createParamDecorator((data, ctx:ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();

    if(!!req.user) {
        return !! data ? req.user[data] : req.user

    }

    const token = req.headers.authorization?.split(' ')[1];
    if(!token?.[1]){
        const decoded: any = jwt.verify(token[1], SECRET);
        return !!data ? decoded[data] : decoded.user
    }


});