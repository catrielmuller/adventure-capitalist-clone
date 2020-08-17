import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../styles/colors';
import { ReactComponent as CoinSvg } from '../../assets/coin.svg';
import { Btn } from '../Btn';

interface IntroProps {
  onPlayClick: () => void;
}

const IntroWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IntroContent = styled.div`
  width: 400px;
  height: 400px;
  text-align: center;
`;

const IntroCoin = styled(CoinSvg)`
  width: 200px;
`;

const IntroTitle = styled.h1`
  color: ${Colors.Title};
  margin: 20px 0;
`;

export const Intro = (props: IntroProps) => {
  const { onPlayClick } = props;

  return (
    <IntroWrapper>
      <IntroContent>
        <IntroCoin />
        <IntroTitle>AdVenture Capitalist</IntroTitle>
        <Btn onClick={() => onPlayClick()}>Play</Btn>
      </IntroContent>
    </IntroWrapper>
  );
};
