import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { usePushNotifications } from '../hooks/usePushNotifications';

const HomeScreen = ({ navigation }) => {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, null, 2);

  console.log(`Token: ${expoPushToken?.data}. Data: ${data}`);

  return (
    <View className="flex-1 bg-white relative">
      <View className="absolute top-0 right-0 w-full">
        <Svg
          height="200"
          width="100%"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <Path
            d="M-50,100 C0,-50 300,250 400,100 C400,200 100,0 -50,100 Z"
            fill="#a855f7"
          />
        </Svg>
      </View>

      <View className="flex-1 items-center justify-center relative z-10">
        <Text className="text-3xl p-2 font-bold text-purple-600 mb-6 text-center">
          Welcome to the Messenger!
        </Text>

        <View className="bg-gray-100 p-4 rounded border border-gray-300 mb-4">
          <Text className="text-center text-lg text-purple-600">
            Expo Push Token: {expoPushToken?.data || 'Token is not defined'}
          </Text>
        </View>

        <View className="flex-row justify-center space-x-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('Sign Up')}
            className="border border-purple-600 px-6 py-3 rounded"
          >
            <Text className="text-purple-600 text-lg">Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="border border-purple-600 px-6 py-3 rounded"
          >
            <Text className="text-purple-600 text-lg">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 w-full">
        <Svg
          height="200"
          width="100%"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <Path
            d="M-50,100 C0,-50 300,250 400,100 C400,200 100,0 -50,100 Z"
            fill="#a855f7"
          />
        </Svg>
      </View>
      <StatusBar style="dark" />
    </View>
  );
};

export default HomeScreen;
