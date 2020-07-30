import { Router, Request, Response } from 'express';
import { logData } from '../logger';

type Wrapper = (router: Router) => void;
type TaskWrapper = () => void;

interface Route {
    method: string;
    route: string;
    controller: any;
    action: string;
}

interface Task {
    start: TaskWrapper;
    name: string;
}

export const startTasks = async (tasks: Task[]) => {
    for (const t of tasks) {
        logData(`Starting ${t.name}`);
        await t.start();
    }
};

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};

export const applyRoutes = (routes: Route[], router: Router) => {
    routes.forEach((route) => {
        const { method, controller, action } = route;
        (router as any)[method](route.route, (req: Request, res: Response, next: () => void) => {
            const result = new (controller as any)()[action](req, res, next);
            if (result instanceof Promise) {
                result.then((innerResult) =>
                    innerResult !== null && innerResult !== undefined ? res.send(innerResult) : undefined
                );
            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
};
