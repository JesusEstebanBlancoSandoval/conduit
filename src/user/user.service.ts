import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { EntityManager } from "@mikro-orm/sqlite";
import { UserRepository } from "./user.Repository";
import { loginUserDto } from "src/dto";
//importar manual bcrypt
import { hash } from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        private readonly repository: UserRepository,
        private readonly em: EntityManager  //cambiarlo a que use de la libreria sqlite (ver articulo.service.ts
    ){}

    async findAll(): Promise<User[]> {
        return this.repository.findAll();

    }

    async findOne(credentials:loginUserDto): Promise<User | null> {
        const bashedPassword = await hash()
    }
}
