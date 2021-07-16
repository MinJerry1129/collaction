import React from 'react';
import { SafeAreaView } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
import Tab from './Tab';

function TabBar(props) {
  const { navigation } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  return (
    <SafeAreaView style={styles.tabBarContainer}>
      {navigation.state.routes.map((route, index) => {
        return (
          <Tab
            key={index + ''}
            route={route}
            focus={navigation.state.index === index}
            onPress={() => navigation.navigate(route.routeName)}
          />
        );
      })}
    </SafeAreaView>
  );
}

export default TabBar;
