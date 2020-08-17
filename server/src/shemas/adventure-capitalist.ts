import { Schema, MapSchema, type } from '@colyseus/schema';

export class AdventureCapitalistStateBusiness extends Schema {
  @type('string')
  id: string;

  @type('number')
  amount: number;

  @type('boolean')
  auto: boolean;

  @type('number')
  trigger: number | null;
}

export class AdventureCapitalistState extends Schema {
  @type('number')
  money: number;

  @type({ map: AdventureCapitalistStateBusiness })
  business = new MapSchema<AdventureCapitalistStateBusiness>();
}
