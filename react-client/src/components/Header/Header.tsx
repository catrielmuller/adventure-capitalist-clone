import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { PlayerState } from '../../types/adventure-capitalist';
import { abbreviateNumber } from '../../utils/abbreviate-number';

interface HeaderProps {
  player: PlayerState;
}

const HeaderWrapper = styled.div`
  background: ${Colors.BackgroundDark};
`;

const HeaderContent = styled.div`
  color: ${Colors.Title};
  font-size: 3rem;
  padding: 20px;
  text-align: right;
`;

export const Header = (props: HeaderProps) => {
  const { money } = props.player;

  return (
    <HeaderWrapper>
      <HeaderContent>${abbreviateNumber(money)}</HeaderContent>
    </HeaderWrapper>
  );
};
