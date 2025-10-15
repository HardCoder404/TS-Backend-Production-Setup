import config from '../../../config/config'
import { SendEmailCommand } from '@aws-sdk/client-ses'
import { SendSingleEmailDTO } from '../../util/DTO/email/sendSingleEmailsDTO'
import { functionResponse } from '../../util/types/application'
import SES from './sesService'
import responseMessage from '../../util/constant/responseMessage'
import { ApiError } from '../../util/helper/apiError'

export const sendEmailToSingleUser = async (input: SendSingleEmailDTO): Promise<functionResponse> => {
    const { subject, sourceEmail, body, to, replyTo, sourceName } = input
    try {
        const params = {
            Source: `"${sourceName}" <${sourceEmail}@${config.DOMAIN}>`,
            Destination: { ToAddresses: [to] },
            replyToAddresses: replyTo ? [replyTo + `@${config.DOMAIN}`] : undefined,
            subject: subject,
            Message: {
                Subject: { Data: subject },
                Body: {
                    Html: { Data: body }
                }
            }
        }

        const command = new SendEmailCommand(params)
        await SES.send(command)

        return {
            success: true,
            statusCode: 200,
            message: 'Email sent successfully'
        }
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : responseMessage.INTERNAL_SERVER_ERROR
        const statusCode = error instanceof ApiError ? error.status : 500
        return {
            success: false,
            statusCode,
            message: errMessage,
            error: error as Error
        }
    }
}
