import React from 'react';
import Navigation from './src/navigation/Navigation';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { SocketContextProvider } from './src/context/SocketContext';
import { MessageProvider } from './src/context/MessageContext';

export default function App() {
  return (
    <AuthProvider>
      <SocketContextProvider>
        <MessageProvider>
          <Navigation />
          <Toast position="top" topOffset={100} />
        </MessageProvider>
      </SocketContextProvider>
    </AuthProvider>
  );
}
