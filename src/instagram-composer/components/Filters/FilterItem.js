import React, { useRef } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';

export default function FilterItem(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const {
    item,
    source,
    FilterComponent,
    onFilterSelect,
    originalSource,
    index,
  } = props;
  const extractedUri = useRef();

  const onExtractImage = ({ nativeEvent }) => {
    extractedUri.current = nativeEvent.uri;
  };

  const getItemNormalFilter = (item) => {
    const gottenSource = originalSource.find((file) => {
      return file.filename === item.filename;
    });

    if (gottenSource) {
      return gottenSource;
    } else {
      return source;
    }
  };

  const normalSource = getItemNormalFilter(source);

  const onPress = () => {
    if (item.title === 'Normal') {
      onFilterSelect(normalSource.uri);
    } else {
      onFilterSelect(extractedUri.current);
    }
  };

  const image = (
    <Image style={styles.filterItemImage} source={{ uri: normalSource.uri }} />
  );

  return (
    <TouchableOpacity
      key={index + ''}
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.filterItemContainer}>
      <Text style={styles.filterItemTitle}>{item.title}</Text>
      <View style={styles.filterItemImageContainer}>
        {item.title === 'Normal' ? (
          image
        ) : (
          <FilterComponent
            extractImageEnabled={true}
            image={image}
            onExtractImage={onExtractImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}
