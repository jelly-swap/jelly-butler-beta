import PriceRoutes from '../components/price/routes';
import BalanceRoutes from '../components/balance/routes';
import InfoRoutes from '../components/info/routes';
import WithdrawRoutes from '../components/withdraw/routes';

export const Routes = [...PriceRoutes, ...BalanceRoutes, ...InfoRoutes, ...WithdrawRoutes];
