export interface BusinessConfig {
  name: string;
  baseValue: number;
  baseEarn: number;
  delay: number;
  increaseRatio: number;
  managerCost: number;
}

export interface PlayerState {
  money: number;
}

export interface BusinessState {
  id: string;
  amount: number;
  auto: boolean;
  trigger: number | null;
}
