import { EntityRepository } from "@mikro-orm/core";
import { User } from "./user.entity";

export class UserRepository extends EntityRepository<User> {
    // Aquí puedes agregar métodos específicos para manejar usuarios
    
}