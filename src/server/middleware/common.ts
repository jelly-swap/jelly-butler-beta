import { Router } from 'express';
import * as cors from 'cors';
import * as parser from 'body-parser';
import * as compression from 'compression';

export const handleCors = (router: Router) => router.use(cors());

export const handleBodyRequestParsing = (router: Router) => {
    router.use(parser.urlencoded({ extended: true }));
    router.use(parser.json());
};

export const handleCompression = (router: Router) => {
    router.use(compression());
};
