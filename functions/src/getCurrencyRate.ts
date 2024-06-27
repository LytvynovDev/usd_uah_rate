import { logger } from 'firebase-functions';

interface CurrencyData {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export const getCurrencyData = async (
  currency: string
): Promise<CurrencyData> => {
  logger.log('Fetching currency data start', { currency });
  const response = await fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&json`);
  if (response.ok) {
    const [data]: [CurrencyData] = await response.json();
    logger.log('Fetching currency data success', data);
    return data;
  }

  const message = `Failed to fetch currency data: ${response.statusText}`;
  logger.error(message);
  throw new Error(message);
};
