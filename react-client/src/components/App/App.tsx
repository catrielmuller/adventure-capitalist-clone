import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import * as Colyseus from 'colyseus.js';

// Styles
import { Colors } from '../../styles/colors';

// Components
import { Intro } from '../Intro';
import { BusinessConfig, PlayerState } from '../../types/adventure-capitalist';
import { Header } from '../Header';
import { List } from '../List';

const LOCAL_STORAGE_UUID = 'acrc-uuid';
const LOCAL_STORAGE_ROOM_ID = 'acrc-room-id';

const AppWrapper = styled.div`
  background: ${Colors.Background};
  width: 100vw;
  height: 100vh;
`;

const generateUUID = (): string => {
  /* TODO: This should be change for a registration of the User using a external Auth method like GooglePlay or Facebook Connect */
  if (!localStorage.getItem(LOCAL_STORAGE_UUID)) {
    const uuid = uuidv4();
    localStorage.setItem(LOCAL_STORAGE_UUID, uuid);
  }
  return localStorage.getItem(LOCAL_STORAGE_UUID) || '';
};

export const App = () => {
  const [isShowingIntro, setIsShowingIntro] = useState<boolean>(true);
  const [timeStamp, setTimeStamp] = useState<number>(new Date().getTime());
  const [uuid] = useState<string>(generateUUID());
  const server = useRef<Colyseus.Client | null>(null);
  const room = useRef<Colyseus.Room | null>(null);
  const [player, setPlayer] = useState<PlayerState>();
  const [businessConfig, setBusinessConfig] = useState<Record<string, BusinessConfig>>();
  const animationRef = useRef<number>();

  const loop = () => {
    setTimeStamp(new Date().getTime());
    animationRef.current = requestAnimationFrame(loop);
  };

  const registerMsgHandler = () => {
    if (room.current === null) return;
    room.current.onMessage('config-business-list', setBusinessConfig);
    room.current.onStateChange((newState: PlayerState) => {
      setPlayer(newState);
      setTimeStamp(new Date().getTime());
    });
  };

  const connect = async () => {
    // Detect Server Location
    const { location } = window;
    let endpoint = location.protocol.replace('http', 'ws') + '//' + location.hostname;
    if (location.port && location.port !== '80') {
      endpoint += ':2567';
    }

    // Connect and Joint to the Room
    server.current = new Colyseus.Client(endpoint);
    const roomId = localStorage.getItem(LOCAL_STORAGE_ROOM_ID);
    if (roomId === null) {
      room.current = await server.current.create('adventure-capitalist', {
        uuid,
      });
      localStorage.setItem(LOCAL_STORAGE_ROOM_ID, room.current.id);
    } else {
      try {
        room.current = await server.current.joinById(roomId, {
          uuid,
        });
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_ROOM_ID);
        return false;
      }
    }
    registerMsgHandler();
    return true;
  };

  const onPlayClick = async () => {
    const connected = await connect();
    if (connected) {
      loop();
      setIsShowingIntro(false);
    }
  };

  return (
    <AppWrapper data-timestamp={timeStamp}>
      {isShowingIntro && <Intro onPlayClick={onPlayClick} />}
      {!isShowingIntro && player && (
        <>
          <Header player={player} />
          <List player={player} businessConfig={businessConfig} room={room} />
        </>
      )}
    </AppWrapper>
  );
};
