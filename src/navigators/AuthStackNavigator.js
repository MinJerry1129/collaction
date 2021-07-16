import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  WelcomeScreen,
  LoginScreen,
  SignupScreen,
  SmsAuthenticationScreen,
} from '../Core/onboarding';
import AppStyles from '../AppStyles';
import CollactionConfig from '../CollactionConfig';
import { StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName="Welcome"
      screenOptions={{
        headerBackTitleVisible: false,
        cardShadowEnabled: false,
      }}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Welcome"
        initialParams={{
          appStyles: AppStyles,
          appConfig: CollactionConfig,
        }}
        component={WelcomeScreen}
      />
      <Stack.Screen
        options={{
          headerStyle: styles.headerStyle,
        }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{
          headerStyle: styles.headerStyle,
        }}
        name="Signup"
        component={SignupScreen}
      />
      <Stack.Screen
        options={{
          headerStyle: styles.headerStyle,
        }}
        name="Sms"
        component={SmsAuthenticationScreen}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    borderBottomWidth: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0, // remove shadow on Android
  },
});

export default AuthStackNavigator;
