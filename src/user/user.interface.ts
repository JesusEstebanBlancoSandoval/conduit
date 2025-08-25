export interface UserData{
    email: string;
    token: string;
    username: string;
    bio?: string | null; //el ? indica que es opcional
    image?: string | null;
}

export interface UserResponse{
    user:UserData;
}