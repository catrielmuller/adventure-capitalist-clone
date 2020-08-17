import { Room, Client } from 'colyseus';
import {
  businessConfigList,
  INITIAL_MONEY,
  MAX_TIME_TO_RECONNECT,
} from '../config/adventure-capitalist';
import {
  AdventureCapitalistState,
  AdventureCapitalistStateBusiness,
} from '../shemas/adventure-capitalist';

interface OnCreateOptions {
  uuid: string;
}

interface OnJoinOptions {
  uuid: string;
}

interface OnBuyMsg {
  id: string;
}

interface OnTriggerMsg {
  id: string;
}

interface OnManagerMsg {
  id: string;
}

export class AdventureCapitalistRoom extends Room<AdventureCapitalistState> {
  autoDispose: false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreate(options: OnCreateOptions): void {
    // Todo: Check if the user have a frozen state on the DB and Load it using the uuid
    this.setState(new AdventureCapitalistState());
    this.state.money = INITIAL_MONEY;
    Object.keys(businessConfigList).forEach((key) => {
      this.state.business[key] = new AdventureCapitalistStateBusiness();
      this.state.business[key].id = key;
      this.state.business[key].amount = 0;
      this.state.business[key].auto = false;
      this.state.business[key].trigger = 0;
    });

    this.setSimulationInterval(() => {
      this.update();
    });

    this.onMessage('buy', (client, msg: OnBuyMsg) => {
      if (!this.state.business[msg.id] || !businessConfigList[msg.id]) return;
      const cost =
        businessConfigList[msg.id].baseValue *
        Math.pow(businessConfigList[msg.id].increaseRatio, this.state.business[msg.id].amount);
      if (cost > this.state.money) return;
      this.state.money -= cost;
      this.state.business[msg.id].amount += 1;
    });

    this.onMessage('trigger', (client, msg: OnTriggerMsg) => {
      if (!this.state.business[msg.id] || !businessConfigList[msg.id]) return;
      if (this.state.business[msg.id].trigger !== 0) return;
      this.state.business[msg.id].trigger = new Date().getTime();
    });

    this.onMessage('manager', (client, msg: OnManagerMsg) => {
      if (!this.state.business[msg.id] || !businessConfigList[msg.id]) return;
      if (this.state.business[msg.id].auto) return;
      if (businessConfigList[msg.id].managerCost > this.state.money) return;
      this.state.money -= businessConfigList[msg.id].managerCost;
      this.state.business[msg.id].auto = true;
    });

    return;
  }

  update(): void {
    const timestamp = new Date().getTime();
    Object.keys(this.state.business).forEach((key) => {
      if (this.state.business[key].amount <= 0) return;
      if (this.state.business[key].trigger === 0) {
        if (!this.state.business[key].auto) return;
        this.state.business[key].trigger = new Date().getTime();
      } else {
        const end = this.state.business[key].trigger + businessConfigList[key].delay;
        if (end <= timestamp) {
          this.state.business[key].trigger = 0;
          this.state.money += businessConfigList[key].baseEarn * this.state.business[key].amount;
        }
      }
    });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onJoin(client: Client, options: OnJoinOptions): void {
    client.send('config-business-list', businessConfigList);
    return;
  }

  async onLeave(client: Client): Promise<void> {
    try {
      await this.allowReconnection(client, MAX_TIME_TO_RECONNECT);
    } catch (e) {
      // The user not connected in one Day
      // Todo: Freeze the state on a DB
      console.warn(e);
    }
    return;
  }

  onDispose(): void {
    console.log('onDispose');
    return;
  }
}
