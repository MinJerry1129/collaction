import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  InnerFeedNavigator,
  InnerChatSearchNavigator,
  InnerFriendsSearchNavigator,
  InnerDiscoverNavigator,
  InnerProfileNavigator,
} from './InnerStackNavigators';
import { TabBarBuilder } from '../Core/ui';
import CollactionConfig from '../CollactionConfig';
import AppStyles from '../AppStyles';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      tabBar={({ state, route, navigation }) => (
        <TabBarBuilder
          tabIcons={CollactionConfig.tabIcons}
          appStyles={AppStyles}
          route={route}
          state={state}
          navigation={navigation}
        />
      )}
      initialRouteName="Feed">
      <BottomTab.Screen name="Feed" component={InnerFeedNavigator} />
      <BottomTab.Screen name="Discover" component={InnerDiscoverNavigator} />
      <BottomTab.Screen name="Chat" component={InnerChatSearchNavigator} />
      <BottomTab.Screen
        name="Friends"
        component={InnerFriendsSearchNavigator}
      />
      <BottomTab.Screen name="Profile" component={InnerProfileNavigator} />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
