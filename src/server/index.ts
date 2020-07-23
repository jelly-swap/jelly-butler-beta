import express from 'express';
import http from 'http';

import { applyRoutes, applyMiddleware, startTasks } from './utils';
import Middleware from './middleware';
import { Routes } from './routes';
import { logInfo } from '../logger';

export default async (port = process.env.PORT || 8080) => {
    const router = express();

    applyMiddleware(Middleware, router);

    applyRoutes(Routes, router);

    const server = http.createServer(router) as any;

    server.listen(port, () => {
        logInfo(`Server started on port ${server.address().port}`);
    });
};
