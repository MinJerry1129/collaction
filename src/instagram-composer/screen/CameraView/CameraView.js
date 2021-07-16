import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useColorScheme } from 'react-native-appearance';
import MediaView from '../../components/MediaView/MediaView';
import Filters from '../../components/Filters/Filters';
import Control from '../../components/Control/Control';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import dynamicStyles from './styles';

const { width } = Dimensions.get('window');

export default function CameraView(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const {
    onScrollIndexChange,
    tabIndex,
    isFilterEnable,
    onImageFilter,
    isPreviewPaused,
    onCameraCapture,
    setCameraPreview,
    videoPaused,
    onCancel,
  } = props;
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [filterableSource, setFilterableSource] = useState({});
  const [selectedMedia, setSelectedMedia] = useState({ uri: '', mime: '' });
  const scrollRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    if (tabIndex > 0) {
      scrollRef.current.scrollTo({
        x: Math.floor(width * (tabIndex - 1)),
        y: 0,
        animated: true,
      });
    }
  }, [tabIndex]);

  useEffect(() => {
    if (isFilterEnable && selectedMedia.mime === 'image') {
      onImageFilter([selectedMedia]);
    }
  }, [selectedMedia]);

  const onScroll = (event) => {
    const contentOffsetX = Math.floor(event.nativeEvent.contentOffset.x);
    const scrollIndex = contentOffsetX / Math.floor(width);
    const isScrollIndexInteger = Number.isInteger(scrollIndex);
    if (isScrollIndexInteger) {
      scrollIndexDidChange(scrollIndex);
    }
  };

  const scrollIndexDidChange = (index) => {
    onScrollIndexChange(index + 1);
  };

  const onCameraSwitch = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, pauseAfterCapture: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      console.log('takePicture', source);
      if (source) {
        const uri =
          Platform.OS === 'ios' ? source.replace('file://', '/private') : source;
        // {uri, mime: 'image'}
        setCameraPreview(true);
        setSelectedMedia({ uri, mime: 'image' });
        setFilterableSource({ uri });
        onCameraCapture([{ uri, mime: 'image' }]);
      }
    }
  };

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();

        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            const uri =
              Platform.OS === 'ios' ? source.replace('file://', '') : source;
            // {uri, mime: 'image'}
            setCameraPreview(true);
            onCameraCapture([{ uri, mime: 'video' }]);
            setSelectedMedia({ uri, mime: 'video' });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const stopVideoRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const onFliterImage = ({ uri }) => {
    setSelectedMedia({ uri, mime: 'image' });
  };

  const onMultiSelectItemPress = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.mediaViewContainer}>
        <Camera
          ref={cameraRef}
          style={[
            styles.cameraPreview,
            { display: !isFilterEnable ? 'flex' : 'none' },
          ]}
          type={cameraType}
          pausePreview={isPreviewPaused}
          flashMode={Camera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        {isFilterEnable && (
          <MediaView
            videoPaused={videoPaused}
            uri={selectedMedia.uri}
            type={selectedMedia.mime}
            onMultiSelectItemPress={onMultiSelectItemPress}
          />
        )}
        {!isFilterEnable && (
          <TouchableOpacity
            onPress={onCameraSwitch}
            style={styles.switchContainer}>
            <Image
              style={styles.switch}
              source={require('../../assets/icons/switch-camera.png')}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.controlContainer}>
        <ScrollView
          style={[
            styles.cameraPreview,
            { display: !isFilterEnable ? 'flex' : 'none' },
          ]}
          ref={scrollRef}
          scrollEventThrottle={16}
          onScroll={onScroll}
          snapToInterval={width}
          decelerationRate="fast"
          bounces={false}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}>
          <Control onShutterPress={takePicture} />
          <Control
            didLongPress={recordVideo}
            didStopLongPress={stopVideoRecording}
            allowLongPress={true}
          />
        </ScrollView>
        {isFilterEnable && selectedMedia.mime === 'image' && (
          <Filters
            source={filterableSource}
            originalSources={[selectedMedia]}
            onFliterImage={onFliterImage}
          />
        )}
        {isFilterEnable && selectedMedia.mime?.includes('video') && (
          <DeleteButton title={'Delete'} onPress={onCancel} />
        )}
      </View>
    </View>
  );
}
