import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import ChatScreen from '../screens/ChatScreen';
import Loading from '../components/common/Loading';
import { navigationRef } from '../services/navigationService';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate, deauthenticate } from '../store/auth/authSlice';
import { connectSocket, disconnectSocket } from '../store/socket/socketSlice';
import { ACCESS_TOKEN_KEY } from '../utils/constants';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

      if (token) {
        dispatch(authenticate());
        setInitialRoute('Contacts');
      } else {
        dispatch(deauthenticate());
        setInitialRoute('Home');
      }
    };

    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(connectSocket());
    } else {
      dispatch(disconnectSocket());
    }
  }, [isAuthenticated]);

  if (initialRoute === null) {
    return <Loading />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRoute}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Sign Up"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
