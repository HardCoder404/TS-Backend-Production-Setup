import { ClassConstructor, plainToClass } from 'class-transformer'
import { validate, ValidationError as ClassValidatorError } from 'class-validator'

export interface ValidationError {
    key: string
    message: string
}

interface ValidationResult {
    success: boolean
    status: number
    errors: ValidationError[]
}

export const validateDTO = async (dto: ClassConstructor<object>, body: object): Promise<ValidationResult> => {
    const dtoInstance: object = plainToClass(dto, body)

    const errors = await validate(dtoInstance)
    if (errors.length > 0) {
        const formattedErrors = getErrorInRecursive(errors)
        return {
            success: false,
            status: 400,
            errors: formattedErrors
        }
    }

    return {
        success: true,
        status: 200,
        errors: []
    }
}

const getErrorInRecursive = (errors: ClassValidatorError[]): ValidationError[] => {
    const foundErrors: ValidationError[] = []
    if (errors.length === 0) {
        return foundErrors
    }
    for (const error of errors) {
        if (error?.constraints) {
            foundErrors.push({
                key: error.property,
                message: Object.values(error.constraints)[0]
            })
        }
        if (error?.children && error.children.length > 0) {
            const childErrors = getErrorInRecursive(error.children)
            foundErrors.push(...childErrors)
        }
    }
    return foundErrors
}
