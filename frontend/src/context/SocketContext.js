import { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getUserData } from '../services/userService';

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectSocket = async () => {
      if (isLoggedIn) {
        const userData = await getUserData();
        const userId = userData.id;

        const socketInstance = io('http://192.168.0.104:5000', {
          query: { userId },
        });
        setSocket(socketInstance);

        return () => {
          socketInstance.close();
        };
      } else {
        if (socket) {
          socket.close();
          setSocket(null);
        }
      }
    };

    connectSocket();
  }, [isLoggedIn]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
