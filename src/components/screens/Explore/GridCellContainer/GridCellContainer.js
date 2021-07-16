import React, { useRef } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import PropTypes from 'prop-types';
import FeedMedia from '../../../FeedItem/FeedMedia';
import dynamicStyles from './styles';

function GridCellContainer(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const topRowData = useRef();
  const leftColumnData = useRef();
  const rightColumnData = useRef();
  const largeRightCellData = useRef();
  const largeLeftCellData = useRef();

  const renderSmallCell = ({ item }, { isLastItem, isLeft }) => {
    return (
      <FeedMedia
        key={item.id + ''}
        index={item.index}
        onMediaPress={props.onPress}
        media={item.postMedia && item.postMedia[0]}
        item={item}
        mediaCellcontainerStyle={[
          styles.mediaContainer,
          isLeft && { marginBottom: 1 },
          isLastItem && { marginRight: 0, marginBottom: 0 },
        ]}
        mediaContainerStyle={styles.mediaFieldLayoutContainer}
        mediaStyle={styles.media}
        dynamicStyles={styles}
        videoResizeMode={props.videoResizeMode}
      />
    );
  };

  const leftLargeCell = () => {
    return (
      <View style={styles.columnCells}>
        {largeLeftCellData.current && (
          <FeedMedia
            key={props.index + ''}
            index={largeLeftCellData.current.index}
            onMediaPress={props.onPress}
            media={
              largeLeftCellData.current.item.postMedia &&
              largeLeftCellData.current.item.postMedia[0]
            }
            item={largeLeftCellData.current.item}
            mediaCellcontainerStyle={styles.largeCell}
            mediaContainerStyle={[
              styles.fieldLayoutContainer,
              { marginRight: 1 },
            ]}
            mediaStyle={styles.media}
            dynamicStyles={styles}
            videoResizeMode={props.videoResizeMode}
          />
        )}

        <View style={styles.smallCellColumnContainer}>
          {rightColumnData.current.map(({ item }, index) => {
            return renderSmallCell(
              { item, index },
              {
                isLastItem: rightColumnData.current.length - 1 === index,
                isLeft: true,
              },
            );
          })}
        </View>
      </View>
    );
  };

  const rightLargeCell = () => {
    return (
      <View style={styles.columnCells}>
        <View style={styles.smallCellColumnContainer}>
          {leftColumnData.current.map(({ item }, index) => {
            return renderSmallCell(
              { item, index },
              {
                isLastItem: leftColumnData.current.length - 1 === index,
                isLeft: true,
              },
            );
          })}
        </View>
        {largeRightCellData.current && (
          <FeedMedia
            key={props.index + ''}
            index={largeRightCellData.current.index}
            onMediaPress={props.onPress}
            media={
              largeRightCellData.current.item.postMedia &&
              largeRightCellData.current.item.postMedia[0]
            }
            item={largeRightCellData.current.item}
            mediaCellcontainerStyle={[styles.largeCell, { marginRight: 2 }]}
            mediaContainerStyle={[
              styles.fieldLayoutContainer,
              { marginLeft: 1 },
            ]}
            mediaStyle={styles.media}
            dynamicStyles={styles}
            videoResizeMode={props.videoResizeMode}
          />
        )}
      </View>
    );
  };

  const structureData = ({ data, isRight }) => {
    topRowData.current = [];
    leftColumnData.current = [];
    rightColumnData.current = [];

    data.map((item, index) => {
      if (index < 3) {
        topRowData.current.push(item);
      }

      if (isRight) {
        if (index === 3 || index === 5) {
          leftColumnData.current.push(item);
        }
        if (index === 4) {
          largeRightCellData.current = item;
        }
      }
      if (!isRight) {
        if (index === 3) {
          largeLeftCellData.current = item;
        }
        if (index === 4 || index === 5) {
          rightColumnData.current.push(item);
        }
      }
    });
  };

  structureData(props.item);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {topRowData.current.map(({ item }, index) => {
          return renderSmallCell(
            { item, index },
            {
              isLastItem: null,
              isLeft: null,
            },
          );
        })}
      </View>
      {props.item.isRight === false && leftLargeCell()}
      {props.item.isRight === true && rightLargeCell()}
    </View>
  );
}

GridCellContainer.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};

export default GridCellContainer;
