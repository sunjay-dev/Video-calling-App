import { createContext, useContext, useMemo } from "react";
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {
    const socket = useMemo (() => io(import.meta.env.VITE_BACKEND_URL), []) ;
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}