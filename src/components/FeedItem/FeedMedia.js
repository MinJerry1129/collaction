import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Video } from 'expo-av';
import Image from 'react-native-image-progress';
import CircleSnail from 'react-native-progress/CircleSnail';
import { TNTouchableIcon } from '../../Core/truly-native';
import { loadCachedItem } from '../../Core/helpers/cacheManager';
import AppStyles from '../../AppStyles';

const maxMediaWidth = AppStyles.WINDOW_WIDTH;

const { width } = Dimensions.get('window');
const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 25 };

export default function FeedMedia({
  media,
  index,
  item,
  isLastItem,
  onMediaPress,
  dynamicStyles,
  postMediaIndex,
  inViewPort,
  willBlur,
  onMediaResize,
  mediaCellcontainerStyle,
  mediaContainerStyle,
  mediaStyle,
  videoResizeMode,
}) {
  const currentUser = useSelector((state) => state.auth.user);

  const isValidUrl = media && media.url && media.url.startsWith('http');
  const isValidLegacyUrl = media && !media.url && media.startsWith('http');
  const uri = isValidUrl || isValidLegacyUrl ? media.url || media : '';

  const [videoLoading, setVideoLoading] = useState(true);
  const [calcMediaWidth, setCalcMediaWidth] = useState('100%');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [playEnabledFromSettings, setPlayEnabledFromSettings] = useState(false);
  const [cachedImage, setCachedImage] = useState(uri);
  const [cachedVideo, setCachedVideo] = useState(null);
  const videoRef = useRef();

  const isImage = media && media.mime && media.mime.startsWith('image');
  const isVideo = media && media.mime && media.mime.startsWith('video');
  const noTypeStated = media && !media.mime;

  // autoplay_video_enabled
  // mute_video_enabled

  const settingsHandler = {
    autoplay_video_enabled: (playValue) =>
      setPlayEnabledFromSettings(playValue),
    mute_video_enabled: (muteValue) => setIsVideoMuted(muteValue),
  };

  useEffect(() => {
    const appSettings = currentUser.settings;
    if (appSettings) {
      const settingsKeys = Object.keys(appSettings);
      if (settingsKeys.length > 0) {
        settingsKeys.forEach(
          (key) =>
            settingsHandler[key] && settingsHandler[key](appSettings[key]),
        );
      }
    }
  }, [currentUser]);

  useEffect(() => {
    setPlayEnabledFromSettings(playEnabledFromSettings);
  }, [playEnabledFromSettings]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(isVideoMuted);
    }
  }, [isVideoMuted]);

  useEffect(() => {
    const loadImage = async () => {
      if (noTypeStated && (isValidUrl || isValidLegacyUrl)) {
        const image = await loadCachedItem({ uri });
        setCachedImage(image);
      }

      if (isImage && (isValidUrl || isValidLegacyUrl)) {
        const image = await loadCachedItem({ uri });
        setCachedImage(image);
      }
      if (isVideo && (isValidUrl || isValidLegacyUrl)) {
        const video = await loadCachedItem({ uri });

        setCachedVideo(video);
      }
    };

    loadImage();
  }, []);

  useEffect(() => {
    (async () => {
      if (postMediaIndex === index && inViewPort && playEnabledFromSettings) {
        if (videoRef.current) {
          await videoRef.current.replayAsync();
        }
      } else {
        if (videoRef.current) {
          await videoRef.current.pauseAsync(true);
        }
      }
    })();
  }, [postMediaIndex]);

  useEffect(() => {
    if ((postMediaIndex === index && inViewPort) || isLastItem) {
      setShouldRender(true);
    }

    handleInViewPort();
  }, [inViewPort]);

  useEffect(() => {
    handleInViewPort();
  }, [shouldRender]);

  useEffect(() => {
    (async () => {
      if (videoRef.current) {
        const videoStatus = await videoRef.current.getStatusAsync();
        if (videoStatus.isPlaying) {
          videoRef.current.pauseAsync(true);
        }
      }
    })();
  }, [willBlur]);

  const handleInViewPort = async () => {
    const postMedia = item.postMedia;
    if (
      postMediaIndex < postMedia.length &&
      postMedia[postMediaIndex] &&
      postMedia[postMediaIndex].mime &&
      postMedia[postMediaIndex].mime.startsWith('video') &&
      playEnabledFromSettings
    ) {
      if (inViewPort) {
        if (videoRef.current) {
          await videoRef.current.setPositionAsync(0);
          await videoRef.current.playAsync(true);
        }
      } else {
        if (videoRef.current) {
          await videoRef.current.pauseAsync(true);
        }
      }
    }
  };

  const onVideoLoadStart = () => {
    setVideoLoading(true);
  };

  const onVideoLoad = (payload) => {
    setVideoLoading(false);
  };

  const onSoundPress = () => {
    setIsVideoMuted((prevIsVideoMuted) => !prevIsVideoMuted);
  };

  const onVideoMediaPress = (url) => {
    onMediaPress({ index, item });
  };

  const onImageMediaPress = () => {
    onMediaPress({ index, item });
  };

  // if (!shouldRender) {
  //   return <ActivityIndicator style={dynamicStyles.bodyImage} />;
  // }

  if (isImage) {
    return (
      <View style={[mediaContainerStyle, mediaCellcontainerStyle]}>
        <TouchableOpacity
          style={[mediaContainerStyle]}
          activeOpacity={0.9}
          onPress={onImageMediaPress}>
          <Image
            source={{ uri: cachedImage }}
            style={[dynamicStyles.bodyImage, mediaStyle]}
            indicator={CircleSnail}
            indicatorProps={circleSnailProps}
            onLoad={(evt) => {
              if (onMediaResize) {
                onMediaResize({
                  height:
                    (evt.nativeEvent.height / evt.nativeEvent.width) * width,
                });
              }
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
  if (isVideo) {
    return (
      <View style={[mediaContainerStyle, mediaCellcontainerStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onVideoMediaPress(media && media.url)}
          style={[dynamicStyles.centerItem, mediaContainerStyle]}>
          {videoLoading && (
            <View
              style={[
                dynamicStyles.mediaVideoLoader,
                dynamicStyles.centerItem,
              ]}>
              <CircleSnail {...circleSnailProps} />
            </View>
          )}
          <Video
            ref={videoRef}
            source={{ uri: cachedVideo }}
            onLoad={onVideoLoad}
            resizeMode={videoResizeMode ? videoResizeMode : 'strech'}
            onLoadStart={onVideoLoadStart}
            style={[
              dynamicStyles.bodyImage,
              {
                display: videoLoading ? 'none' : 'flex',
              },
              mediaStyle,
            ]}
          />
          <TNTouchableIcon
            onPress={onSoundPress}
            imageStyle={dynamicStyles.soundIcon}
            containerStyle={dynamicStyles.soundIconContainer}
            iconSource={
              isVideoMuted
                ? AppStyles.iconSet.soundMute
                : AppStyles.iconSet.sound
            }
            appStyles={AppStyles}
          />
        </TouchableOpacity>
      </View>
    );
  }
  // To handle old format of an array of url stings. Before video feature
  return (
    <View style={[mediaContainerStyle, mediaCellcontainerStyle]}>
      <TouchableOpacity
        style={[mediaContainerStyle]}
        activeOpacity={0.9}
        onPress={onImageMediaPress}>
        <Image
          source={{ uri: cachedImage }}
          style={[dynamicStyles.bodyImage, mediaStyle]}
          indicator={CircleSnail}
          indicatorProps={circleSnailProps}
          onLoad={(evt) => {
            if (onMediaResize) {
              onMediaResize({
                height:
                  (evt.nativeEvent.height / evt.nativeEvent.width) * width,
              });
            }
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
