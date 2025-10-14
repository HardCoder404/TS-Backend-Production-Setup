import { IsString, IsNotEmpty, Matches } from 'class-validator'
import { passwordRegex } from '../../constant/regex'

export class UserResetPasswordDTO {
    @IsString({ message: 'New password must be a string' })
    @IsNotEmpty({ message: 'New password is required' })
    @Matches(passwordRegex, {
        message:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character ( !, @, #, $, _ )'
    })
    newPassword!: string

    @IsString({ message: 'Confirm password must be a string' })
    @IsNotEmpty({ message: 'Confirm password is required' })
    confirmPassword!: string

    @IsString({ message: 'Token is required' })
    @IsNotEmpty({ message: 'Token is required' })
    token!: string
}
