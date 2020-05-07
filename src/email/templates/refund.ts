import getBlockchainConfig from '../../blockchain/config';

import { divDecimals } from '../../utils/math';

export default (swap) => {
    const blockchainConfig = getBlockchainConfig();
    const { network, inputAmount, id, hashLock, transactionHash } = swap;

    const amount = divDecimals(inputAmount, blockchainConfig[network].decimals).toString();
    const tx = blockchainConfig[network].explorer + transactionHash;

    const json = { tx, id, hashLock, network, amount };

    const html = getContent(json);

    return { json, html };
};

const getContent = (refund) => {
    return `<html>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email</title>


<div>
    <a href="https://jelly.market/">
        <center>
            <img width="300" height="auto" alt="butler image" src="https://jelly.market//static/jelly-butler-a5ad152c15ed211c462cbfea5457cddb.svg">
        </center>
    </a>
</div>

<table align="center" width="100%"
    style="font-family:Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif; font-size:14px; line-height:1.5; font-weight:normal; margin:0; text-color:black">
    <tbody>
        <tr class="content-row" style="border-color:transparent">
            <td class="content-cell" width="540"
                style="border-collapse:collapse; border-color:transparent; vertical-align:top" valign="top">
                <center>
                    <h4
                        style="font-weight:normal; line-height:1.2; margin:0 0 10px; font-size:20px; font-family:Arial, &quot;Helvetica Neue&quot;, Helvetica, sans-serif">
                        Refund Info
                    </h4>
                    <div>
                        <p>&#128270; <strong> TX
                            </strong><a
                                href="${refund.tx}"
                                style="text-decoration:none; color:#853285">
                                ${refund.tx}</a>
                        </p>
                        <p>&#10145; <strong> AMOUNT
                            </strong>${refund.amount}
                            <strong>${refund.network}</strong></p>
                        <p>&#127380; <strong> ID
                            </strong>${refund.id}
                        </p>
                        <p>&#128274; <strong> HASHLOCK
                            </strong>${refund.hashLock}
                        </p>
                    </div>
                </center>
            </td>
        </tr>
    </tbody>
</table>

</html>`;
};
