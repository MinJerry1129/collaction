import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Platform } from 'react-native';
import FilterItem from './FilterItem';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
// import {FILTERS} from './constant';

export default function Filters(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const { source, onFliterImage, originalSources } = props;
  const [filtersComponent, setFiltersComponent] = useState([]);
  const [normalSources] = useState(originalSources);

  useEffect(() => {
    onFliterImage(source);
  }, []);

  useEffect(() => {
      const { FILTERS } = require('./constant');
      setFiltersComponent([]);
      setTimeout(() => {
        setFiltersComponent(FILTERS);
      }, 1500);
  }, [source.uri]);

  const onFilterSelect = (uri) => {
    onFliterImage({ uri, filename: source.filename });
  };

  const renderItem = ({ item, index }) => {
    return (
      <FilterItem
        key={index + ''}
        index={index}
        item={item}
        FilterComponent={item.filterComponent}
        source={source}
        onFilterSelect={onFilterSelect}
        originalSource={normalSources}
      />
    );
  };

  return (
    <View style={styles.filtersContainer}>
      {filtersComponent.length > 0 ? (
        <FlatList
          data={filtersComponent}
          extraData={source}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterItemsContainer}
        />
      ) : (
        <ActivityIndicator style={styles.filtersContainer} />
      )}
    </View>
  );
}
