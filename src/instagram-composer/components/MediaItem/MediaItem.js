import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import styles from './styles';

export default function MediaItem(props) {
  const {
    item,
    index,
    onCountUpdated,
    onItemSelected,
    onItemRemoved,
    onLongPress,
    multiSelectCount,
    multiSelectModeActive,
  } = props;

  const [isSelected, setIsSelected] = useState(false);
  const [count, setCount] = useState(multiSelectCount);

  useEffect(() => {
    if (multiSelectModeActive && !isSelected) {
      setCount(multiSelectCount);
    }
  }, [multiSelectCount]);

  useEffect(() => {
    if (!multiSelectModeActive) {
      setCount(multiSelectCount);
    }
  }, [multiSelectModeActive]);

  useEffect(() => {
    if (multiSelectModeActive) {
      onCountUpdated(count);
    }
  }, [count]);

  useEffect(() => {
    if (isSelected) {
      onItemSelected({ item, index, multiSelectModeActive });
      setCount(count + 1);
    }
  }, [isSelected]);

  const onItemPress = () => {
    if (multiSelectModeActive) {
      setIsSelected(true);
    } else {
      onItemSelected({ item, index, multiSelectModeActive });
    }
  };

  const onItemLongPress = () => {
    if (!multiSelectModeActive) {
      setIsSelected((isSelected) => !isSelected);
      onLongPress({ item, index });
    }
  };

  return (
    <TouchableOpacity
      key={index + ''}
      activeOpacity={0.8}
      onLongPress={onItemLongPress}
      onPress={onItemPress}
      style={styles.mediaItemContainer}>
      <Image style={styles.mediaItem} source={{ uri: item.node.image.uri }} />
      {multiSelectModeActive && (
        <View
          style={[
            styles.multiSelectIndicator,
            isSelected && { backgroundColor: '#137dd3' },
          ]}>
          {isSelected && <Text style={styles.multiCount}>{count}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
}
