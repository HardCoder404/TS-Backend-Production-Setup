import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
} from 'class-validator'

@ValidatorConstraint({ name: 'UsernameOrEmail', async: false })
class UsernameOrEmailConstraint implements ValidatorConstraintInterface {
    validate(_: unknown, args: ValidationArguments) {
        const obj = args.object as UserLoginDTO
        return !!(obj.email || obj.username) // valid if either exists
    }

    defaultMessage(_: ValidationArguments) {
        return 'Please enter your username or email'
    }
}

export class UserLoginDTO {
    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string

    @IsOptional()
    @IsString({ message: 'Username must be a string' })
    username?: string

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    password!: string

    @IsOptional()
    @IsString({ message: 'isRememberMe must be a string' })
    isRememberMe?: string

    @Validate(UsernameOrEmailConstraint)
    checkUsernameOrEmail?: string
}
