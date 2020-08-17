import { BusinessConfig } from '../types/adventure-capitalist';

export const MAX_TIME_TO_RECONNECT = 60 * 60 * 24; // One Day
export const DEFAULT_INCREASE_PRICE = 1.15;
export const INITIAL_MONEY = 50;

export const businessConfigList: Record<string, BusinessConfig> = {
  lemon: {
    name: 'Lemon',
    baseValue: 4,
    baseEarn: 1,
    delay: 1000,
    increaseRatio: DEFAULT_INCREASE_PRICE,
    managerCost: 1000,
  },
  newspapper: {
    name: 'Newspaper Delivery',
    baseValue: 60,
    baseEarn: 60,
    delay: 3000,
    increaseRatio: DEFAULT_INCREASE_PRICE,
    managerCost: 5000,
  },
  carwash: {
    name: 'Car Wash',
    baseValue: 720,
    baseEarn: 540,
    delay: 6000,
    increaseRatio: DEFAULT_INCREASE_PRICE,
    managerCost: 50000,
  },
};
