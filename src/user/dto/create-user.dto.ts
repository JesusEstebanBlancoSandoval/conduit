import { IsNotEmpty } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty()
    readonly username!: string;  //readonly para que no se pueda modificar el valor una vez asignado, ! indica que el valor no puede ser nulo ni indefinidos
    @IsNotEmpty()
    readonly email!: string;
    @IsNotEmpty()
    readonly password!: string;
}