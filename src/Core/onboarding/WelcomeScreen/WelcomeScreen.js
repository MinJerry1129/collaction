import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-native-button';
import { AppState, Image, Keyboard, Platform, Text, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { updateUser } from '../../firebase/auth';

const WelcomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const appStyles = props.route.params.appStyles;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig = props.route.params.appConfig;
  const currentUser = useRef({});

  useEffect(() => {
    registerOnNotificationOpenedApp();
    tryToLoginFirst();
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    currentUser.current = props.user;
  }, [props.user]);

  const handleAppStateChange = async (nextAppState) => {
    const userID = currentUser.current?.id || currentUser.current?.userID;
    const intialNotification = await messaging().getInitialNotification();

    if (intialNotification && Platform.OS === 'android') {
      const {
        data: { channelID, type },
      } = intialNotification;

      if (type === 'chat_message') {
        handleChatMessageType(channelID);
      }
    }

    if (nextAppState === 'active' && userID && Platform.OS === 'ios') {
      updateUser(userID, { badgeCount: 0 });
    }
  };

  const tryToLoginFirst = async () => {
    authManager
      .retrievePersistedAuthUser(appConfig)
      .then((response) => {
        if (response?.user) {
          const user = response.user;
          props.setUserData({
            user: response.user,
          });
          Keyboard.dismiss();
          props.navigation.navigate('MainStack', { user: user });
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const registerOnNotificationOpenedApp = async () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      const {
        data: { channelID, type, name },
      } = remoteMessage;

      if (type === 'chat_message') {
        handleChatMessageType(channelID, name);
      }
    });
    messaging().onMessage((remoteMessage) => {
      if (remoteMessage && Platform.OS === 'ios') {
        const userID = currentUser.current?.id || currentUser.current?.userID;
        updateUser(userID, { badgeCount: 0 });
      }
    });
  };

  const handleChatMessageType = (channelID, name) => {
    const channel = {
      id: channelID,
      channelID,
      name,
    };

    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles,
      openedFromPushNotification: true,
    });
  };

  if (isLoading == true) {
    return <TNActivityIndicator appStyles={appStyles} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcome}>
        <Image style={styles.welcomeImage} source={appStyles.iconSet.welcome} />
      </View>
      <View style={styles.logo}>
        <Image style={styles.logoImage} source={appStyles.iconSet.logo} />
      </View>
      <Text style={styles.caption}>
        {appConfig.onboardingConfig.welcomeCaption}
      </Text>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('Sms', {
                isSigningUp: false,
                appStyles,
                appConfig,
              })
            : props.navigation.navigate('Login', { appStyles, appConfig });
        }}>
        {IMLocalized('Log In')}
      </Button>
      <Button
        containerStyle={styles.signupContainer}
        style={styles.signupText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('Sms', {
                isSigningUp: true,
                appStyles,
                appConfig,
              })
            : props.navigation.navigate('Signup', { appStyles, appConfig });
        }}>
        {IMLocalized('Sign Up')}
      </Button>
    </View>
  );
};

const mapStateToProps = ({ auth, chat }) => {
  return {
    user: auth.user,
    channels: chat.channels,
  };
};

export default connect(mapStateToProps, {
  setUserData,
})(WelcomeScreen);
