import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
import AppStyles from '../../AppStyles';

const tabIcons = {
  Feed: {
    focus: AppStyles.iconSet.homefilled,
    unFocus: AppStyles.iconSet.homeUnfilled,
  },
  Discover: {
    focus: AppStyles.iconSet.search,
    unFocus: AppStyles.iconSet.search,
  },
  Feed: {
    focus: AppStyles.iconSet.homefilled,
    unFocus: AppStyles.iconSet.homeUnfilled,
  },
  Chat: {
    focus: AppStyles.iconSet.commentFilled,
    unFocus: AppStyles.iconSet.commentUnfilled,
  },
  Friends: {
    focus: AppStyles.iconSet.friendsFilled,
    unFocus: AppStyles.iconSet.friendsUnfilled,
  },
  Profile: {
    focus: AppStyles.iconSet.profileFilled,
    unFocus: AppStyles.iconSet.profileUnfilled,
  },
};

function Tab({ route, onPress, focus }) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  return (
    <TouchableOpacity style={styles.tabContainer} onPress={onPress}>
      <Image
        source={
          focus
            ? tabIcons[route.routeName].focus
            : tabIcons[route.routeName].unFocus
        }
        style={[
          styles.tabIcon,
          focus ? styles.focusTintColor : styles.unFocusTintColor,
        ]}
      />
    </TouchableOpacity>
  );
}

export default Tab;
