import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class UserLoginDTO {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email!: string

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password!: string

    @IsOptional()
    @IsString({ message: 'Language must be a string' })
    isRememberMe?: string
}
