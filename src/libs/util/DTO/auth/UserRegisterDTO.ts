import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator'
import { passwordRegex } from '../../constant/regex'

export class UserRegisterDTO {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email!: string

    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    username!: string

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @Matches(passwordRegex, {
        message:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character ( !, @, #, $, _ )'
    })
    password!: string

    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'First name must be a string' })
    firstName!: string

    @IsNotEmpty({ message: 'Last name is required' })
    @IsString({ message: 'Last name must be a string' })
    lastName!: string
}
