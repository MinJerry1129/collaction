import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContainer } from '../components';
import {
  InnerFeedNavigator,
  InnerChatSearchNavigator,
  InnerFriendsSearchNavigator,
  InnerDiscoverNavigator,
  InnerProfileNavigator,
} from './InnerStackNavigators';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      drawerContent={({ navigation, state }) => (
        <DrawerContainer navigation={navigation} />
      )}
      drawerStyle={{ width: 250 }}
      initialRouteName="Feed">
      <Drawer.Screen name="Feed" component={InnerFeedNavigator} />
      <Drawer.Screen name="Discover" component={InnerDiscoverNavigator} />
      <Drawer.Screen name="Chat" component={InnerChatSearchNavigator} />
      <Drawer.Screen name="Friends" component={InnerFriendsSearchNavigator} />
      <Drawer.Screen name="Profile" component={InnerProfileNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
