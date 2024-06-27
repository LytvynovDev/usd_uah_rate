import { params } from 'firebase-functions';

export const GA_MP_SECRET = params.defineSecret('GA_MP_SECRET');

export const GA_MEASUREMENT_ID = params.defineSecret('GA_MEASUREMENT_ID');
