import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Video } from 'expo-av';
import PropTypes from 'prop-types';
import CircleSnail from 'react-native-progress/CircleSnail';
import styles from './styles';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';

const Image = createImageProgress(FastImage);

const circleSnailProps = { thickness: 1, color: '#ddd', size: 80 };

function IMPostCamera(props) {
  const { onCancel, imageSource, onPost, onVideoLoadStart } = props;

  const renderMedia = () => {
    if (imageSource.mime.startsWith('image')) {
      return (
        <Image
          source={{ uri: imageSource.uri }}
          style={styles.image}
          indicator={CircleSnail}
          indicatorProps={circleSnailProps}
        />
      );
    } else {
      return (
        <Video
          source={{ uri: imageSource.uri }}
          onLoadStart={onVideoLoadStart}
          shouldPlay={true}
          resizeMode={'contain'}
          style={styles.image}
        />
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#7C37A6' }]}>
      <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
        <View
          style={[styles.closeCross, { transform: [{ rotate: '45deg' }] }]}
        />
        <View
          style={[styles.closeCross, { transform: [{ rotate: '-45deg' }] }]}
        />
      </TouchableOpacity>
      {renderMedia()}
      <TouchableOpacity onPress={onPost} style={styles.postContainer}>
        <Text>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

IMPostCamera.propTypes = {
  onCancel: PropTypes.func,
  imageSource: PropTypes.any,
  onPost: PropTypes.func,
};

export default IMPostCamera;
