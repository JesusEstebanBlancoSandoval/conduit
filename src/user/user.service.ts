import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { EntityManager, wrap } from "@mikro-orm/sqlite";
import { UserRepository } from "./user.Repository";
import { CreateUserDTO, loginUserDto, updateUserDto } from "src/dto";
//importar manual bcrypt
import { hash } from "bcrypt";
import { UserResponse } from "./user.interface";
import { validate } from "class-validator";
//imrpotar jwt
import jwt from 'jsonwebtoken';
import { SECRET } from "src/config";

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
        const bashedPassword = await hash(credentials.password, 10); //10 es el numero de rondas de salting

        return this.repository.findOne({
            email:credentials.email,
            password:bashedPassword
        })
    }

    async create({username,email,password}:CreateUserDTO): Promise<UserResponse>{
        const exists = await this.repository.count({$or:[{email},{username}]});

        if (exists>0){
            throw new HttpException({message:'Input data validation failed', errors:{email:'has already been taken', username:'has already been taken'}},HttpStatus.BAD_REQUEST);
        }//422 es el codigo de error para validacion fallida

        const user = new User(username,email,password);

        const errors = await validate(user);
        if(errors.length>0){
           throw new HttpException({message:'Input data validation failed',
            errors:{username:'Username is not valid', email:'Email is not valid', password:'Password is not valid'}},HttpStatus.UNPROCESSABLE_ENTITY);
        }else{
           await this.em.persistAndFlush(user);
           return this.buildUserResponse(user);
        }
    }

    async update(id:number,dto:updateUserDto){
        const user = await this.repository.findOneOrFail(id);
        wrap(user).assign(dto);

        await this.em.flush();
        return this.buildUserResponse(user);
    }

    async delete(email:string){
        return this.repository.nativeDelete({email});
    }


    private buildUserResponse(user:User):UserResponse{
        return{
            user:{
                bio:user.bio,
                email:user.email,
                image:user.image,
                token:this.generateJWT(user),
                username:user.username
            }
        }
    }

    generateJWT(user:User){
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate()+60); //el token expira en 60 dias
        //
        return jwt.sign({
            email:user.email,
            exp: exp.getTime()/1000, //el tiempo de expiracion en segundos
            id:user.id,
            username:user.username
        },SECRET)
    }
}
