import { PriceController } from './controller';

export default [
    {
        method: 'get',
        route: '/api/v1/price',
        controller: PriceController,
        action: 'getPrice',
    },
];
