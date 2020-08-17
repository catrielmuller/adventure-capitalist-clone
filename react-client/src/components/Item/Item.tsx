import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { BusinessConfig, BusinessState, PlayerState } from '../../types/adventure-capitalist';
import { abbreviateNumber } from '../../utils/abbreviate-number';
import { Btn } from '../Btn';
import * as Colyseus from 'colyseus.js';

interface ItemProps {
  player: PlayerState;
  business: BusinessState;
  businessConfig: BusinessConfig;
  room: React.MutableRefObject<Colyseus.Room<any> | null>;
}

const ItemWrapper = styled.div``;

const ItemContent = styled.div`
  color: ${Colors.Title};
  font-size: 2rem;
  padding: 10px;
  display: flex;
`;

const ItemAmount = styled.div`
  border: 4px solid ${Colors.Title};
  text-align: center;
  width: 120px;
  height: 90px;
  line-height: 90px;
  margin-right: 20px;
`;

const ItemDescription = styled.div`
  flex: 1 1 auto;
  width: auto;
`;

const ItemActions = styled.div`
  text-align: right;

  & > button {
    margin-left: 10px;
  }
`;

export const Item = (props: ItemProps) => {
  const { player, business, businessConfig, room } = props;
  const { money } = player;

  const earnAmount = (business.amount || 1) * businessConfig.baseEarn;
  const nextBuyCost =
    businessConfig.baseValue * Math.pow(businessConfig.increaseRatio, business.amount);

  const currentTime = new Date().getTime();
  const initTime = business.trigger || currentTime;

  const currentProgress = ((currentTime - initTime) * 100) / businessConfig.delay;

  const onBuyClick = () => {
    if (!room.current) return;
    room.current.send('buy', {
      id: business.id,
    });
  };

  const onProduceClick = () => {
    if (!room.current) return;
    room.current.send('trigger', {
      id: business.id,
    });
  };

  const onManagerClick = () => {
    if (!room.current) return;
    room.current.send('manager', {
      id: business.id,
    });
  };

  return (
    <ItemWrapper>
      <ItemContent>
        <ItemAmount>{business.amount}</ItemAmount>
        <ItemDescription>
          <div>{businessConfig.name}</div>
          <div>
            <div>${abbreviateNumber(earnAmount)}</div>
            <progress value={currentProgress} max={100}></progress>
          </div>
        </ItemDescription>
        <ItemActions>
          <Btn disabled={nextBuyCost > money} onClick={onBuyClick}>
            Buy ${abbreviateNumber(nextBuyCost)}
          </Btn>
          {business.amount >= 1 && !business.auto && <Btn onClick={onProduceClick}>Produce</Btn>}
          {money >= businessConfig.managerCost && !business.auto && (
            <Btn onClick={onManagerClick}>
              Buy Manager ${abbreviateNumber(businessConfig.managerCost)}
            </Btn>
          )}
        </ItemActions>
      </ItemContent>
    </ItemWrapper>
  );
};
