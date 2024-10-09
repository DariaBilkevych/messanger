import { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY } from '../utils/constants';
import { getUserData } from '../services/userService';

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

      if (token) {
        const userData = await getUserData();
        const userId = userData._id;

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
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
