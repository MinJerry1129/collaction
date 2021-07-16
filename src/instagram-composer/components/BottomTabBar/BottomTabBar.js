import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';

const titles = ['Library', 'Photo', 'Video'];

export default function BottomTabBar(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const { focusedIndex, onPress } = props;

  const renderTabTitle = (title, index) => {
    const isFocused = focusedIndex === index;
    return (
      <TouchableOpacity
        onPress={() => onPress(index)}
        key={index + ''}
        activeOpacity={1}
        style={styles.titleContainer}>
        <Text style={[styles.title, isFocused && styles.titleFocused]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {titles.map((title, index) => renderTabTitle(title, index))}
    </View>
  );
}
