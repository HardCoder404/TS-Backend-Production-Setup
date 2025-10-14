import { Router, Request, Response, NextFunction } from 'express'
import httpResponse from '../../../libs/util/helper/httpResponse'
import httpError from '../../../libs/util/helper/httpError'
import { getHealth } from '../../../libs/util/helper/quicker'

const router = Router()

// Route: /api/v1/
// Method: GET
// Desc: Hello API
// Access: Protected
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = { docs: null }
        httpResponse(req, res, 200, 'Welcome to out website! 🚀 Your backend is up and running.', data)
    } catch (error) {
        httpError(next, error, req, 500)
    }
})

// Route: /api/v1/health
// Method: GET
// Desc: Get system health
// Access: Protected
router.get('/health', (req: Request, res: Response, next: NextFunction) => {
    try {
        const healthData = getHealth()
        if (!healthData.success) {
            return httpError(next, healthData.message, req, healthData.statusCode)
        }
        return httpResponse(req, res, healthData.statusCode, healthData.message, healthData.data)
    } catch (err) {
        return httpError(next, err, req, 500)
    }
})

export default router
