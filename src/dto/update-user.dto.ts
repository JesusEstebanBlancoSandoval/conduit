export class updateUserDto{
    readonly username?: string;  //readonly para que no se pueda modificar el valor una vez asignado, ! indica que el valor no puede ser nulo ni indefinidos
    readonly email?: string;
    //readonly password?: string;  no implementado metodo de cambio de password
    readonly bio?: string;
    readonly image?: string;
}