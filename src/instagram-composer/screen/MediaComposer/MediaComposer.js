import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions, Modal } from 'react-native';
import AlbumView from '../AlbumView/AlbumView';
import CameraView from '../CameraView/CameraView';
import NewPost from '../NewPost/NewPost';
import BottomTabBar from '../../components/BottomTabBar/BottomTabBar';
import NavBar from '../../components/NavBar/NavBar';
import styles from './styles';

const { width } = Dimensions.get('window');

export default function MediaComposer(props) {
  const { navigation, visible, onDismiss, onSharePost } = props;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isFilterEnable, setIsFilterEnable] = useState(false);
  const [isAlbumFilterEnable, setIsAlbumFilterEnable] = useState(false);
  const [isCameraFilterEnable, setIsCameraFilterEnable] = useState(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [isPreviewPaused, setIsPreviewPaused] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [displayNewPostModal, setDisplayNewPostModal] = useState(false);
  const hasFiltered = useRef(false);
  const media = useRef({});
  const didFocusSubscription = useRef({});
  const scrollRef = useRef();

  useEffect(() => {
    if (focusedIndex > 0 && !isCameraFilterEnable) {
      setNextDisabled(true);
    }
  }, [isCameraFilterEnable]);

  const onScroll = (event) => {
    const contentOffsetX = Math.floor(event.nativeEvent.contentOffset.x);
    const scrollIndex = contentOffsetX / Math.floor(width);
    const isScrollIndexInteger = Number.isInteger(scrollIndex);
    if (isScrollIndexInteger) {
      scrollIndexDidChange(scrollIndex);
    }
  };

  const scrollIndexDidChange = (index) => {
    if (index > 0) {
      setNextDisabled(true);
      setVideoPaused(true);
    } else {
      setNextDisabled(false);
      setVideoPaused(false);
    }

    if (focusedIndex !== 2 || index === 0) {
      setFocusedIndex(index);
    }
  };

  const onScrollIndexChange = (index) => {
    setFocusedIndex(index);
    scrollIndexDidChange(index);
  };

  const onImageFilter = (source) => {
    hasFiltered.current = true;
    media.current = source;
  };

  const onAlbumVideo = (source) => {
    media.current = source;
    hasFiltered.current = true;
  };

  const onNext = () => {
    if (hasFiltered.current) {
      setVideoPaused(true);
      setDisplayNewPostModal(true);
    } else {
      setIsFilterEnable(true);
      setIsAlbumFilterEnable(true);
    }
  };

  const onCancel = () => {
    if (hasFiltered.current) {
      setIsFilterEnable(false);
      setIsAlbumFilterEnable(false);
      setIsCameraFilterEnable(false);
      setCameraPreview(false);
      hasFiltered.current = false;
    } else {
      onDismiss();
    }
  };

  useEffect(() => {
    didFocusSubscription.current = navigation.addListener(
      'focus',
      (payload) => {
        setVideoPaused(false);
      },
    );

    navigation.setParams({
      onNext: onNext,
      onCancel: onCancel,
    });

    return () => {
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  const setCameraPreview = (value) => {
    setIsPreviewPaused(value);
  };

  const onCameraCapture = (source) => {
    setNextDisabled(false);
    media.current = source;
    setIsCameraFilterEnable(true);
    setIsFilterEnable(true);
    hasFiltered.current = true;
  };

  const onBottomTabPress = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: Math.floor(width * index),
        y: 0,
        animated: true,
      });

      setFocusedIndex(index);
    }
  };

  const onDismissNewPost = () => {
    setDisplayNewPostModal(false);
  };

  return (
    <Modal animationType={'none'} visible={visible} transparent={true}>
      <View style={styles.container}>
        <NavBar
          nextTitle={'Next'}
          prevTitle={'Cancel'}
          disabled={nextDisabled}
          onNext={onNext}
          onPrev={onCancel}
        />
        <ScrollView
          ref={scrollRef}
          scrollEnabled={!isFilterEnable}
          scrollEventThrottle={16}
          onScroll={onScroll}
          bounces={false}
          horizontal={true}
          pagingEnabled={true}
          snapToInterval={width}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}>
          <AlbumView
            videoPaused={videoPaused}
            onImageFilter={onImageFilter}
            isFilterEnable={isAlbumFilterEnable}
            onAlbumVideo={onAlbumVideo}
            onCancel={onCancel}
          />
          <CameraView
            videoPaused={videoPaused}
            onCancel={onCancel}
            tabIndex={focusedIndex}
            onScrollIndexChange={onScrollIndexChange}
            onImageFilter={onImageFilter}
            isFilterEnable={isCameraFilterEnable}
            isPreviewPaused={isPreviewPaused}
            onCameraCapture={onCameraCapture}
            setCameraPreview={setCameraPreview}
          />
        </ScrollView>
        {!isFilterEnable && (
          <BottomTabBar
            visible={isFilterEnable}
            onPress={onBottomTabPress}
            focusedIndex={focusedIndex}
          />
        )}
        {displayNewPostModal && (
          <NewPost
            onDismiss={onDismissNewPost}
            media={media.current}
            onSharePost={onSharePost}
          />
        )}
      </View>
    </Modal>
  );
}
