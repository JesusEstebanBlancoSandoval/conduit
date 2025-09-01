import { Body, Controller, Delete, Get, Post, Put, UsePipes,Param, HttpStatus, HttpException } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { User } from "./user.decorator";
import { UserService } from "./user.service";
import { UserResponse } from "./user.interface";
import { CreateUserDTO, loginUserDto, updateUserDto } from "./dto";
import { ValidationPipe } from "./shared/pipes/validation.pipe";

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
    constructor(private readonly service: UserService) { }

    @Get('user')
    async findByEmail(@User('email') email: string): Promise<UserResponse> {
        return this.service.findByEmail(email);
    }

    @Put('user')
    async update(@User('id') userId: number, @Body('user') userData: updateUserDto): Promise<UserResponse> {
        return this.service.update(userId, userData);
    }

    @Post('users')
    @UsePipes(new ValidationPipe())
    async create(@Body('user') userData: CreateUserDTO) {
        return this.service.create(userData);
    }

    @Delete('user/:email')
    async delete(@Param() email: string) {
        this.service.delete(email);
    }

    @UsePipes(new ValidationPipe())
    @Post('users/login')
    async login(@Body ('user')loginDto: loginUserDto): Promise<UserResponse> {
        const foundUser = await this.service.findOne(loginDto);

        if(!foundUser){
            throw new HttpException({ message: 'Invalid credentials', errors: { 'email or password': 'is invalid' } }, HttpStatus.UNAUTHORIZED);
        }

        const token = this.service.generateJWT(foundUser);
        const {email,username,bio,image}=foundUser;
        const user = {email,username,bio,image,token};
        return {user}
    }
}


