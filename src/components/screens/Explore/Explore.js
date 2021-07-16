import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import GridCellContainer from './GridCellContainer/GridCellContainer';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';

function Explore(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const {
    feed,
    user,
    onMediaPress,
    loading,
    handleOnEndReached,
    isFetching,
    onFeedScroll,
    willBlur,
    videoResizeMode,
  } = props;

  const formatFeed = (array) => {
    let handlerArr = [];
    const formatedData = [];
    let isRight = true;
    array.forEach((item, index) => {
      if (handlerArr.length < 6) {
        handlerArr.push({ item, index });
      }

      if (handlerArr.length === 6 || index === array.length - 1) {
        formatedData.push({ data: handlerArr, isRight });
        handlerArr = [];
        isRight = !isRight;
      }
    });
    return formatedData;
  };

  const renderListFooter = () => {
    if (isFetching) {
      return <ActivityIndicator style={{ marginVertical: 7 }} size="small" />;
    }
    return null;
  };

  const itemToRender = ({ index, item }) => {
    return (
      <GridCellContainer
        key={index + ''}
        index={index}
        item={item}
        onPress={onMediaPress}
        videoResizeMode={videoResizeMode}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.feedContainer}>
        <ActivityIndicator style={{ marginTop: 15 }} size="small" />
      </View>
    );
  }

  const newFormatedData = formatFeed(feed);

  return (
    <View style={styles.container}>
      {/* Explore grid container */}
      <FlatList
        scrollEventThrottle={16}
        onScroll={onFeedScroll}
        data={newFormatedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={itemToRender}
        ListFooterComponent={renderListFooter}
        onEndReachedThreshold={0.5}
        onEndReached={handleOnEndReached}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

Explore.propTypes = {
  data: PropTypes.array,
  onPress: PropTypes.func,
};

export default Explore;
