import React from 'react';
import Navigation from './src/navigation/Navigation';
import Toast from 'react-native-toast-message';
import { MessageProvider } from './src/context/MessageContext';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

export default function App() {
  return (
    <Provider store={store}>
      <MessageProvider>
        <Navigation />
        <Toast position="top" topOffset={100} />
      </MessageProvider>
    </Provider>
  );
}
