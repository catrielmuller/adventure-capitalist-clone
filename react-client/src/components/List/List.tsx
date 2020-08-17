import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { BusinessConfig, PlayerState } from '../../types/adventure-capitalist';
import { Item } from '../Item';
import * as Colyseus from 'colyseus.js';

interface ListProps {
  player: PlayerState;
  businessConfig?: Record<string, BusinessConfig>;
  room: React.MutableRefObject<Colyseus.Room<any> | null>;
}

const ListWrapper = styled.div``;

const ListContent = styled.div`
  color: ${Colors.Title};
  font-size: 2rem;
  padding: 10px;
`;

export const List = (props: ListProps) => {
  const { player, businessConfig, room } = props;
  const { business } = player;

  if (!businessConfig) return null;

  return (
    <ListWrapper>
      <ListContent>
        {Object.keys(businessConfig).map((id) => (
          <Item
            key={id}
            player={player}
            businessConfig={businessConfig[id]}
            business={business[id]}
            room={room}
          />
        ))}
      </ListContent>
    </ListWrapper>
  );
};
