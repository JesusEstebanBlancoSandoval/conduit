import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "./user.service";
import { NextFunction, Request, Response } from "express";
import { UserData } from "./user.interface";
import jwt from 'jsonwebtoken';
import { SECRET } from "src/config";


/*
 Imagine you go to a restaurant, hence you're a customer. You read the menu and choose what you'd like to eat. The waiter comes and you tell him your order. The waiter let's the kitchen staff know what to prepare. Once your food is ready, they hand it out to the waiter brings and serves you the food.

The customer represents the application, for example your frontend.

Selecting an option from the menu represents your request.

The waiter represents the API. It's purpose is to deliver your request to the kitchen.

The kitchen represents your backend. It could be a database or another application.

The kitchen handles your request, hence prepares your data.

The waiter aka API takes the data and brings it to you / your table / the frontend.

Now, the waiter isn't fully dumb. If you request food that is not on the menu, they will decline your request. If you request wine, they will expect you to prove your age. If you request spaghetti, they will bring you a fork and a spoon without needing the kitchen staff. If you give them a note to pass to the cute cook, they may decide themselves if it's appropriate or not. To follow the restaurant rules, the waiter will make use of certain clothes or certain tools, such as pencil and paper. 
*/

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly service: UserService) {}

  // Importar Request de express
  async use(req: Request & { user?: UserData & { id?: number }}, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization

    const token = (authHeaders as string).split(' ')[1]

    if (authHeaders && token !== undefined) {
      const decoded: any = jwt.verify(token, SECRET)
      const user = await this.service.findById(decoded.id)

      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)
      }

      req.user = user.user
      req.user.id = decoded.id
      next()
    } else {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED)
    }
  }
}
