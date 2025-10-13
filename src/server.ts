import { Connection } from 'mongoose'
import app from './app'
import config from './config/config'
import { DURATION, initRateLimiter, POINTS } from './libs/util/rateLimiter'
import mongoDbConnection from './libs/database/mongoDB/mongoDbConnection'
import logger from './libs/util/helper/logger'

const server = app.listen(config.PORT)
let connection: Connection | null = null

const shutdown = async (exitCode = 0) => {
    logger.warn('SHUTTING DOWN SERVER...')

    try {
        if (connection) {
            await connection.close()
            logger.info('MongoDB connection closed.')
        }
    } catch (err) {
        logger.error('Error closing connections', { meta: err })
    }

    // ensure server.close is awaited so shutdown completes before process.exit
    try {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    logger.error('Error closing HTTP server', { meta: error })
                    return reject(error)
                }
                logger.info('HTTP server closed.')
                resolve()
            })
        })
    } catch {
        // already logged above
    } finally {
        process.exit(exitCode)
    }
}

// invoke async startup and explicitly mark the returned promise as intentionally not awaited
void (async () => {
    try {
        // Database Connection
        connection = await mongoDbConnection.connect()
        logger.info(`DATABASE_CONNECTION`, {
            meta: {
                CONNECTION_NAME: connection.name
            }
        })

        initRateLimiter(connection)
        logger.info('RATE_LIMITER_INITIALIZED', {
            meta: {
                duration: DURATION,
                points: POINTS
            }
        })

        logger.info(`APPLICATION_STARTED`, {
            meta: {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL
            }
        })
    } catch (err) {
        logger.error(`APPLICATION_ERROR`, { meta: err })

        // on startup failure, perform graceful shutdown and exit with code 1
        try {
            await shutdown(1)
        } catch (shutdownErr) {
            logger.error('Shutdown failed', { meta: shutdownErr })
            process.exit(1)
        }
    }
})()

// Handle Ctrl+C (SIGINT) and process termination (SIGTERM)
process.on('SIGINT', () => void shutdown(0)) // Ctrl+C
process.on('SIGTERM', () => void shutdown(0)) // For Docker/Kubernetes graceful stop
