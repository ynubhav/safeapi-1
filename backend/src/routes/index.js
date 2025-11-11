import express from 'express';
import { authRouter } from './auth.route.js';
import { adminRouter } from './admin.route.js';
import { gatewayRouter } from './gateway.route.js';
import { projectRouter } from './projects.route.js';
import { apikeyRouter } from './keys.route.js';

const appRouter=express.Router();

appRouter.use('/auth',authRouter)
appRouter.use('/admin',adminRouter)
appRouter.use('/r',gatewayRouter)// gateway routes
appRouter.use('/project',projectRouter)
appRouter.use('/api_key',apikeyRouter)

export { appRouter };