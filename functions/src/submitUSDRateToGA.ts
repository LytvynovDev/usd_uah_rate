import { FunctionBuilder, logger } from 'firebase-functions';
import { GA_MP_SECRET, GA_MEASUREMENT_ID } from './secrets';
import { getCurrencyData } from './getCurrencyRate';

export const submitUSDRateToGA = new FunctionBuilder({
  secrets: [GA_MP_SECRET, GA_MEASUREMENT_ID],
})
  .pubsub
  .schedule('0 * * * *')
  .timeZone('Europe/Kiev')
  .onRun(async () => {
    const { rate } = await getCurrencyData('USD');
    logger.log('Sending USD rate to GA start', { rate });

    const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID.value()}&api_secret=${GA_MP_SECRET.value()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        client_id: 'currency_rate',
        non_personalized_ads: true,
        events: [
          {
            name: 'USD_rate',
            params: {
              currency: 'UAH',
              value: +rate.toFixed(2),
            },
          },
        ],
      }),
    });

    if (response.ok) {
      logger.log('Sending USD rate to GA success');
    } else {
      logger.error(
        'Sending USD rate to GA failed',
        { status: response.status, statusText: response.statusText }
      );
    }
  });
