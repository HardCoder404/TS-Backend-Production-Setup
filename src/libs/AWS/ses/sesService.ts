import { SESClient } from '@aws-sdk/client-ses'
import config from '../../../config/config'

const region = config.ORIGIN as string
const accessKey = config.AWS_ACCESS_KEY as string
const secretAccessKey = config.AWS_SECRET_KEY as string

export const SES = new SESClient({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: region
})

export default SES
