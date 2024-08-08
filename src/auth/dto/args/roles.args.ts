import { IsArray, IsOptional } from "class-validator";
import { ValidRoles }  from '../../enums/valid-roles.enum';
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ValidRolesArgs {

    @Field( () => [ValidRoles], { nullable: true } )
    @IsArray()
    @IsOptional()
    roles?: ValidRoles[] = [];
}