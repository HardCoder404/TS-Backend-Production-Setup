import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SendSingleEmailDTO {
    @IsEmail({}, { message: 'Recipient email must be a valid email address' })
    @IsNotEmpty({ message: 'Recipient email is required' })
    to!: string

    @IsEmail({}, { message: 'Source email must be a valid email address' })
    @IsNotEmpty({ message: 'Source email is required' })
    sourceEmail!: string

    @IsNotEmpty({ message: 'Subject is required' })
    @IsString({ message: 'Subject must be a string' })
    subject!: string

    @IsNotEmpty({ message: 'Body is required' })
    @IsString({ message: 'Body must be a string' })
    body!: string

    @IsString({ message: 'Reply-to email must be a string' })
    replyTo?: string

    @IsNotEmpty({ message: 'Source name is required' })
    @IsString({ message: 'Source name must be a string' })
    sourceName!: string
}
