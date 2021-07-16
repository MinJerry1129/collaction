import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import {
  FeedScreen,
  DetailPostScreen,
  CreatePostScreen,
  ExploreScreen,
  ProfileScreen,
  ConversationsScreen,
} from '../screens';
import { IMCreateGroupScreen } from '../Core/chat';
import {
  IMFriendsScreen,
  IMAllFriendsScreen,
  IMUserSearchModal,
} from '../Core/socialgraph/friendships';
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
  IMProfileSettingsScreen,
} from '../Core/profile';
import { IMNotificationScreen } from '../Core/notifications';
import AppStyles from '../AppStyles';
import CollactionConfig from '../CollactionConfig';
import { IMLocalized } from '../Core/localization/IMLocalization';

const Stack = createStackNavigator();

const InnerFeedNavigator = () => {
  return (
    <Stack.Navigator headerMode="float" initialRouteName="Feed">
      <Stack.Screen
        options={{ title: 'collaction' }}
        name="Feed"
        component={FeedScreen}
      />
      <Stack.Screen name="FeedDetailPost" component={DetailPostScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="FeedProfile" component={ProfileScreen} />
      <Stack.Screen name="FeedNotification" component={IMNotificationScreen} />
      <Stack.Screen
        name="FeedProfileSettings"
        component={IMProfileSettingsScreen}
      />
      <Stack.Screen name="FeedEditProfile" component={IMEditProfileScreen} />
      <Stack.Screen name="FeedAppSettings" component={IMUserSettingsScreen} />
      <Stack.Screen name="FeedContactUs" component={IMContactUsScreen} />
      <Stack.Screen name="FeedAllFriends" component={IMAllFriendsScreen} />
      <Stack.Screen
        name="FeedProfilePostDetails"
        component={DetailPostScreen}
      />
    </Stack.Navigator>
  );
};

const ChatSearch = createStackNavigator();
const InnerChatSearchNavigator = () => {
  return (
    <ChatSearch.Navigator
      mode="modal"
      initialRouteName="Main"
      headerMode="float">
      <ChatSearch.Screen
        name="Main"
        component={InnerChatNavigator}
        options={{ headerShown: false }}
      />
      <ChatSearch.Screen
        name="UserSearchScreen"
        component={IMUserSearchModal}
        options={{ headerShown: false }}
      />
    </ChatSearch.Navigator>
  );
};

const InnerChatNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Chat" headerMode="float">
      <Stack.Screen name="Chat" component={ConversationsScreen} />
      <Stack.Screen name="CreateGroup" component={IMCreateGroupScreen} />
    </Stack.Navigator>
  );
};

const FriendsSearch = createStackNavigator();
const InnerFriendsSearchNavigator = () => {
  return (
    <FriendsSearch.Navigator
      mode="modal"
      initialRouteName="Main"
      headerMode="float">
      <FriendsSearch.Screen
        name="Main"
        component={InnerFriendsNavigator}
        options={{ headerShown: false }}
      />
      <FriendsSearch.Screen
        name="UserSearchScreen"
        component={IMUserSearchModal}
        options={{ headerShown: false }}
      />
    </FriendsSearch.Navigator>
  );
};

const InnerFriendsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Friends" headerMode="float">
      <Stack.Screen
        initialParams={{
          appStyles: AppStyles,
          appConfig: CollactionConfig,
          followEnabled: true,
          friendsScreenTitle: IMLocalized('People'),
          showDrawerMenuButton: Platform.OS == 'android',
        }}
        name="Friends"
        component={IMFriendsScreen}
      />
      <Stack.Screen name="FriendsProfile" component={ProfileScreen} />
      <Stack.Screen name="FriendsAllFriends" component={IMAllFriendsScreen} />
    </Stack.Navigator>
  );
};

const InnerDiscoverNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Discover" headerMode="float">
      <Stack.Screen name="Discover" component={ExploreScreen} />
      <Stack.Screen name="DiscoverDetailPost" component={DetailPostScreen} />
      <Stack.Screen name="DiscoverProfile" component={ProfileScreen} />
      <Stack.Screen
        name="DiscoverNotification"
        component={IMNotificationScreen}
      />
      <Stack.Screen
        name="DiscoverProfileSettings"
        component={IMProfileSettingsScreen}
      />
      <Stack.Screen
        name="DiscoverEditProfile"
        component={IMEditProfileScreen}
      />
      <Stack.Screen
        name="DiscoverAppSettings"
        component={IMUserSettingsScreen}
      />
      <Stack.Screen name="DiscoverContactUs" component={IMContactUsScreen} />
      <Stack.Screen name="DiscoverAllFriends" component={IMAllFriendsScreen} />
      <Stack.Screen
        name="DiscoverProfilePostDetails"
        component={DetailPostScreen}
      />
    </Stack.Navigator>
  );
};

//working
const InnerProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="float">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="ProfileNotification"
        component={IMNotificationScreen}
      />
      <Stack.Screen
        name="ProfileProfileSettings"
        component={IMProfileSettingsScreen}
      />
      <Stack.Screen name="ProfileEditProfile" component={IMEditProfileScreen} />
      <Stack.Screen
        name="ProfileAppSettings"
        component={IMUserSettingsScreen}
      />
      <Stack.Screen name="ProfileContactUs" component={IMContactUsScreen} />
      <Stack.Screen name="ProfileAllFriends" component={IMAllFriendsScreen} />
      <Stack.Screen name="ProfilePostDetails" component={DetailPostScreen} />
      <Stack.Screen name="ProfileDetailPostProfile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export {
  InnerFeedNavigator,
  InnerChatSearchNavigator,
  InnerFriendsSearchNavigator,
  InnerDiscoverNavigator,
  InnerProfileNavigator,
};
