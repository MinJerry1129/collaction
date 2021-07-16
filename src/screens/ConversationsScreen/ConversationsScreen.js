import React, { useEffect, useContext, useLayoutEffect } from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import ConversationsHomeComponent from './ConversationsHomeComponent';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import { Platform } from 'react-native';
import { TNTouchableIcon } from '../../Core/truly-native';
import { Appearance } from 'react-native-appearance';

const ConversationsScreen = (props) => {
  const currentUser = useSelector((state) => state.auth.user);
  const { store } = useContext(ReactReduxContext);
  const followTracker = new FriendshipTracker(
    store,
    currentUser.id || currentUser.userID,
    true,
    true,
    true,
  );

  useEffect(() => {
    followTracker.subscribeIfNeeded();
    return () => {
      followTracker.unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = AppStyles.navThemeConstants[COLOR_SCHEME];
    let { navigation } = props;
    props.navigation.setOptions({
      headerTitle: IMLocalized('Messages'),
      headerRight: () => (
        <TNTouchableIcon
          imageStyle={{ tintColor: currentTheme.fontColor }}
          iconSource={AppStyles.iconSet.inscription}
          onPress={() =>
            navigation.navigate('CreateGroup', { appStyles: AppStyles })
          }
          appStyles={AppStyles}
        />
      ),
      headerLeft: () => {},
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, [currentUser]);

  const onEmptyStatePress = () => {
    props.navigation.navigate('Friends');
  };

  openDrawer = () => {
    props.navigation.openDrawer();
  };

  const emptyStateConfig = {
    title: IMLocalized('No Conversations'),
    description: IMLocalized(
      'Start chatting with the people you follow. Your conversations will show up here.',
    ),
    buttonName: IMLocalized('Find friends'),
    onPress: onEmptyStatePress,
  };

  return (
    <ConversationsHomeComponent
      navigation={props.navigation}
      appStyles={AppStyles}
      emptyStateConfig={emptyStateConfig}
    />
  );
};

export default ConversationsScreen;
