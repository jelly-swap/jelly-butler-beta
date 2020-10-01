import PriceRoutes from '../components/price/routes';
import BalanceRoutes from '../components/balance/routes';
import InfoRoutes from '../components/info/routes';
import WithdrawRoutes from '../components/withdraw/routes';
import RefundRoutes from '../components/refund/routes';
import PendingRoutes from '../components/pending/routes';
import AppConfigRoutes from '../components/appConfig/routes';

export const Routes = [
    ...PriceRoutes,
    ...BalanceRoutes,
    ...InfoRoutes,
    ...WithdrawRoutes,
    ...RefundRoutes,
    ...PendingRoutes,
    ...AppConfigRoutes,
];
