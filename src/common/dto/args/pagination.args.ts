import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { nullable: true })
    @IsInt()
    @Min(0)
    @IsOptional()
    offset: number = 0;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @Min(1)
    @IsOptional()
    limit: number = 10;

    /*@Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    term: string = '';*/
}