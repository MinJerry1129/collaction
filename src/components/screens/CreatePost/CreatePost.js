import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { Video } from 'expo-av';
import { useColorScheme } from 'react-native-appearance';
import { TNStoryItem, TNTouchableIcon } from '../../../Core/truly-native';
import IMLocationSelectorModal from '../../../Core/location/IMLocationSelectorModal/IMLocationSelectorModal';
import dynamicStyles from './styles';
import AppStyles from '../../../AppStyles';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import { extractSourceFromFile } from '../../../Core/helpers/retrieveSource';
import { compressVideo } from '../../../Core/helpers/cacheManager';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';

const Image = createImageProgress(FastImage);

function CreatePost(props) {
  const {
    onPostDidChange,
    onSetMedia,
    onLocationDidChange,
    user,
    inputRef,
    blurInput,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const [address, setAddress] = useState('');
  const [locationSelectorVisible, setLocationSelectorVisible] = useState(false);
  const [media, setMedia] = useState([]);
  const [mediaSources, setMediaSources] = useState([]);
  const [value, setValue] = useState('');
  const [isCameralContainer, setIsCameralContainer] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const photoUploadDialogRef = useRef();
  const removePhotoDialogRef = useRef();

  const androidAddPhotoOptions = [
    IMLocalized('Import from Library'),
    IMLocalized('Take Photo'),
    IMLocalized('Record Video'),
    IMLocalized('Cancel'),
  ];

  const iosAddPhotoOptions = [
    IMLocalized('Import from Library'),
    IMLocalized('Open Camera'),
    IMLocalized('Cancel'),
  ];

  const addPhotoCancelButtonIndex = {
    ios: 2,
    android: 3,
  };

  const addPhotoOptions =
    Platform.OS === 'android' ? androidAddPhotoOptions : iosAddPhotoOptions;

  const onLocationSelectorPress = () => {
    setLocationSelectorVisible(!locationSelectorVisible);
  };

  const onLocationSelectorDone = (address) => {
    setLocationSelectorVisible(!locationSelectorVisible);
    setAddress(address);
  };

  const onChangeLocation = (address) => {
    setAddress(address);
    onLocationDidChange(address);
  };

  const onChangeText = (value) => {
    const Post = {
      postText: value,
      commentCount: 0,
      reactionsCount: 0,
      reactions: {
        surprised: 0,
        angry: 0,
        sad: 0,
        laugh: 0,
        like: 0,
        cry: 0,
        love: 0,
      },
    };

    setValue(value);
    onPostDidChange(Post);
  };

  const onCameraIconPress = () => {
    photoUploadDialogRef.current.show();
  };

  const onPhotoUploadDialogDoneIOS = (index) => {
    if (index == 1) {
      onLaunchCamera();
    }

    if (index == 0) {
      onOpenPhotos();
    }
  };

  const onPhotoUploadDialogDoneAndroid = (index) => {
    if (index == 2) {
      onLaunchVideoCamera();
    }

    if (index == 1) {
      onLaunchCamera();
    }

    if (index == 0) {
      onOpenPhotos();
    }
  };

  const onPhotoUploadDialogDone = (index) => {
    const onPhotoUploadDialogDoneSetter = {
      ios: () => onPhotoUploadDialogDoneIOS(index),
      android: () => onPhotoUploadDialogDoneAndroid(index),
    };

    onPhotoUploadDialogDoneSetter[Platform.OS]();
  };

  const onLaunchCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      const { source, mime, filename, uploadUri } = extractSourceFromFile(
        image,
      );

      handleMediaSource({ mime, source, filename, uploadUri });
    });
  };

  const onLaunchVideoCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
      mediaType: 'video',
    }).then((image) => {
      const { source, mime, filename, uploadUri } = extractSourceFromFile(
        image,
      );

      handleMediaSource({ mime, source, filename, uploadUri });
    });
  };

  const onOpenPhotos = () => {
    ImagePicker.openPicker({
      cropping: false,
      multiple: false,
    }).then((image) => {
      const { source, mime, filename, uploadUri } = extractSourceFromFile(
        image,
      );

      handleMediaSource({ mime, source, filename, uploadUri });
    });
  };

  const handleMediaSource = ({ mime, source, filename, uploadUri }) => {
    const includesVideo = mime?.includes('video');

    if (includesVideo) {
      compressVideo(source, (newSource) => {
        setMedia([...media, { source: newSource, mime }]);
        setMediaSources([
          ...mediaSources,
          { filename, uploadUri: newSource, mime },
        ]);
        onSetMedia([...mediaSources, { filename, uploadUri: newSource, mime }]);
      });
    } else {
      setMedia([...media, { source, mime }]);
      setMediaSources([...mediaSources, { filename, uploadUri, mime }]);
      onSetMedia([...mediaSources, { filename, uploadUri, mime }]);
    }
  };

  const onRemovePhotoDialogDone = (index) => {
    if (index === 0) {
      removePhoto();
    } else {
      setSelectedIndex(null);
    }
  };

  const onMediaPress = async (index) => {
    await setSelectedIndex(index);
    removePhotoDialogRef.current.show();
  };

  const removePhoto = async () => {
    const slicedMedia = [...media];
    const slicedMediaSources = [...mediaSources];
    await slicedMedia.splice(selectedIndex, 1);
    await slicedMediaSources.splice(selectedIndex, 1);
    setMedia([...slicedMedia]);
    setMediaSources([...slicedMediaSources]);
    onSetMedia([...slicedMediaSources]);
  };

  const onTextFocus = () => {
    // setIsCameralContainer(false);
  };

  const onToggleImagesContainer = () => {
    blurInput();
    toggleImagesContainer();
  };

  const toggleImagesContainer = () => {
    setIsCameralContainer(!isCameralContainer);
  };

  const onStoryItemPress = (item) => {
    console.log('');
  };

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      enabled={false}
      style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          <TNStoryItem
            onPress={onStoryItemPress}
            item={user}
            appStyles={AppStyles}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{user.firstName}</Text>
            <Text style={styles.subtitle}>{address}</Text>
          </View>
        </View>
        <View style={styles.postInputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.postInput}
            onChangeText={onChangeText}
            value={value}
            multiline={true}
            onFocus={onTextFocus}
          />
        </View>
      </View>
      <View style={[styles.bottomContainer]}>
        <View style={styles.postImageAndLocationContainer}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={[
              styles.imagesContainer,
              isCameralContainer ? { display: 'flex' } : { display: 'none' },
            ]}>
            {media.map((singleMedia, index) => {
              const { source, mime } = singleMedia;

              if (mime.startsWith('image')) {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onMediaPress(index)}
                    style={styles.imageItemcontainer}>
                    <Image style={styles.imageItem} source={{ uri: source }} />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onMediaPress(index)}
                    style={styles.imageItemcontainer}>
                    <Video
                      source={{
                        uri: source,
                      }}
                      resizeMode={'strech'}
                      shouldPlay={false}
                      isMuted={true}
                      style={styles.imageItem}
                    />
                  </TouchableOpacity>
                );
              }
            })}
            <TouchableOpacity
              onPress={onCameraIconPress}
              style={[styles.imageItemcontainer, styles.imageBackground]}>
              <Image
                style={styles.addImageIcon}
                source={AppStyles.iconSet.cameraFilled}
              />
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.addTitleAndlocationIconContainer}>
            <View style={styles.addTitleContainer}>
              <Text style={styles.addTitle}>
                {!isCameralContainer
                  ? IMLocalized('Add to your post')
                  : IMLocalized('Add photos to your post')}
              </Text>
            </View>
            <View style={styles.iconsContainer}>
              <TNTouchableIcon
                onPress={onToggleImagesContainer}
                containerStyle={styles.iconContainer}
                imageStyle={[
                  styles.icon,
                  isCameralContainer
                    ? styles.cameraFocusTintColor
                    : styles.cameraUnfocusTintColor,
                ]}
                iconSource={AppStyles.iconSet.cameraFilled}
                appStyles={AppStyles}
              />
              <TNTouchableIcon
                containerStyle={styles.iconContainer}
                imageStyle={[styles.icon, styles.pinpointTintColor]}
                iconSource={AppStyles.iconSet.pinpoint}
                onPress={onLocationSelectorPress}
                appStyles={AppStyles}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.blankBottom} />

      <IMLocationSelectorModal
        isVisible={locationSelectorVisible}
        onCancel={onLocationSelectorPress}
        onDone={onLocationSelectorDone}
        onChangeLocation={onChangeLocation}
        appStyles={AppStyles}
      />
      <ActionSheet
        ref={photoUploadDialogRef}
        title={IMLocalized('Add photo')}
        options={addPhotoOptions}
        cancelButtonIndex={addPhotoCancelButtonIndex[Platform.OS]}
        onPress={onPhotoUploadDialogDone}
      />
      <ActionSheet
        ref={removePhotoDialogRef}
        title={IMLocalized('Remove photo')}
        options={[IMLocalized('Remove'), IMLocalized('Cancel')]}
        destructiveButtonIndex={0}
        cancelButtonIndex={1}
        onPress={onRemovePhotoDialogDone}
      />
    </KeyboardAvoidingView>
  );
}

CreatePost.propTypes = {
  user: PropTypes.object,
  onPostDidChange: PropTypes.func,
  onSetMedia: PropTypes.func,
  onLocationDidChange: PropTypes.func,
  blurInput: PropTypes.func,
  inputRef: PropTypes.any,
};

export default CreatePost;
