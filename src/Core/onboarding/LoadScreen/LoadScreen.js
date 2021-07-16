import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import deviceStorage from '../utils/AuthDeviceStorage';

const LoadScreen = (props) => {
  const { navigation, route } = props;

  const appStyles = route.params.appStyles;
  const appConfig = route.params.appConfig;
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) => {
      setAppState();
    }),
  );

  useEffect(() => {
    setAppState();
    return () => {
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  const setAppState = async () => {
    const shouldShowOnboardingFlow = await deviceStorage.getShouldShowOnboardingFlow();
    if (!shouldShowOnboardingFlow) {
      navigation.navigate('LoginStack', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    } else {
      navigation.navigate('Walkthrough', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    }
  };

  return <View />;
};

LoadScreen.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
};

LoadScreen.navigationOptions = {
  header: null,
};

export default LoadScreen;
