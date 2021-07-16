import React, { useState, useEffect, useRef } from 'react';
import { Image, View, TouchableOpacity, ScrollView } from 'react-native';
import Video from 'react-native-video';
import styles from './styles';

export default function MediaView(props) {
  const {
    uri,
    type,
    filename,
    shouldFormatVideoUri,
    videoPaused,
    selectedMedia,
    isFilterEnable,
    onMultiSelectItemPress,
    filterIndex,
  } = props;

  const [isVideoPause, setIsVideoPause] = useState(videoPaused);
  const [selectedIndex, setSelectedIndex] = useState(filterIndex);

  useEffect(() => {
    setIsVideoPause(videoPaused);
    setSelectedIndex(filterIndex);
  }, [videoPaused, filterIndex]);

  const getDerivedUri = (source, mediaFilename) => {
    if (shouldFormatVideoUri) {
      const appleId = source.substring(5, 41);
      const ext = mediaFilename.split('.')[1];
      return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;
    }
    return source;
  };

  const onVideoPress = () => {
    setIsVideoPause((videoPaused) => !videoPaused);
  };

  const renderMedia = (media, mediaStyle, index) => {
    if (media.type === 'image' || media.mime === 'image') {
      return (
        <TouchableOpacity
          onPress={() => {
            setSelectedIndex(index);
            onMultiSelectItemPress(media);
          }}
          style={styles.mediaContainer}
          activeOpacity={1}>
          <Image style={mediaStyle} source={{ uri: media.uri }} />
        </TouchableOpacity>
      );
    } else {
      const newUri = getDerivedUri(media.uri, media.filename);
      return (
        <TouchableOpacity
          onPress={onVideoPress}
          activeOpacity={1}
          style={styles.mediaContainer}>
          <Video
            source={{ uri: newUri }}
            resizeMode={'strech'}
            style={mediaStyle}
            paused={isVideoPause}
            style={mediaStyle}
          />
          {isVideoPause && (
            <View style={styles.playIconContainer}>
              <Image
                style={styles.playIcon}
                source={require('../../assets/icons/play.png')}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    }
  };

  const renderMultiSelectMedia = (media, index) => {
    return (
      <View key={index + ' '} style={styles.multiselectContainer}>
        {renderMedia(media, styles.mediaView, index)}
        {isFilterEnable && index === selectedIndex && (
          <View style={styles.filterIconContainer}>
            <Image
              style={styles.filterIcon}
              source={require('../../assets/icons/coloring-tool.png')}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {isFilterEnable && selectedMedia.length > 1 ? (
        <ScrollView
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          {selectedMedia.map((media, index) =>
            renderMultiSelectMedia(media, index),
          )}
        </ScrollView>
      ) : (
        renderMedia({ type, uri, filename }, styles.mediaView)
      )}
    </>
  );
}
