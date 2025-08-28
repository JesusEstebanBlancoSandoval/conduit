import { Dictionary } from "@mikro-orm/core";
import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import {plainToInstance} from 'class-transformer';
import { validate, ValidationError } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform<any>{
    async transform(value: unknown, metadata: ArgumentMetadata) {
        if(!value){
                throw new BadRequestException('no data submited')
        }

        const {metatype} = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            throw new HttpException({
                message:'input data validation failed',
                errors: this.buildError(errors),
            },HttpStatus.BAD_REQUEST);
        }
    }

    private buildError(errors: ValidationError[]){
        const result = {} as Dictionary;
        for (const error of errors){
            const prop = error.property
            Object.entries(error.constraints!).forEach((constraint)=>{
                  result[prop+constraint[0]]= `${constraint[1]}`
            })
        }
    }

    private toValidate(metatype:unknown):boolean{
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type)=> metatype===type)
    }
}