import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { AuthMiddleware } from './auth.middleware';

@Module({
    controllers: [UserController],
    exports: [UserService],
    imports: [MikroOrmModule.forFeature({ entities: [User] })],
    providers:[UserService]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                {path: 'user', method: RequestMethod.GET} ,
                {path: 'user', method: RequestMethod.PUT}   
            )
    }
}
