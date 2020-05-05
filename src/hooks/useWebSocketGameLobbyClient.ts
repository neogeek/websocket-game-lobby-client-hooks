import { useEffect, useState } from 'react';

import { useLocalStorage } from '@neogeek/common-react-hooks';

import { WebSocketGameLobbyClient } from 'websocket-game-lobby';

export const useWebSocketGameLobbyClient = ({
    port = process.env.NODE_ENV === 'development' ? 5000 : null,
}: {
    port?: number | null;
} = {}) => {
    const [gameLobby, setGameLobby] = useState();

    const [data, setData] = useState({});

    const [playerId, setPlayerId] = useLocalStorage('playerId');
    const [gameCode, setGameCode] = useLocalStorage('gameCode');

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setGameLobby(
            new WebSocketGameLobbyClient({
                port,
                gameCode,
                playerId,
            })
        );
    }, []);

    useEffect(() => {
        gameLobby?.addEventListener('open', handleConnect);
        gameLobby?.addEventListener('message', handleMessage);
        gameLobby?.addEventListener('close', handleDisconnect);

        return () => {
            gameLobby?.removeEventListener('open', handleConnect);
            gameLobby?.removeEventListener('message', handleMessage);
            gameLobby?.removeEventListener('close', handleDisconnect);
        };
    }, [gameLobby]);

    useEffect(() => {
        setGameCode(data.game?.gameCode);
        setPlayerId(data.player?.playerId);
    }, [data]);

    const handleConnect = () => setConnected(true);
    const handleMessage = (message: any) => setData(JSON.parse(message.data));
    const handleDisconnect = () => setConnected(false);

    const send = (type: string, options = {}) =>
        gameLobby.send(type, {
            gameCode,
            playerId,
            ...options,
        });

    return { data, connected, send };
};
