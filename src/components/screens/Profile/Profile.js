import React, { useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'expo-image-picker';
import { TNStoryItem } from '../../../Core/truly-native';
import FeedMedia from '../../FeedItem/FeedMedia';
import ProfileButton from './ProfileButton';
import TNMediaViewerModal from '../../../Core/truly-native/TNMediaViewerModal';
import dynamicStyles from './styles';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import { TNEmptyStateView } from '../../../Core/truly-native';
import AppStyles from '../../../AppStyles';

function Profile(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const {
    onMainButtonPress,
    recentUserFeeds,
    user,
    mainButtonTitle,
    isMediaViewerOpen,
    feedItems,
    onMediaClose,
    selectedMediaIndex,
    removePhoto,
    startUpload,
    uploadProgress,
    loading,
    handleOnEndReached,
    isFetching,
    isOtherUser,
    onFollowingButtonPress,
    onFollowersButtonPress,
    onPostPress,
    followingCount,
    followersCount,
    postCount,
    onEmptyStatePress,
  } = props;

  const updatePhotoDialogActionSheet = useRef();
  const photoUploadDialogActionSheet = useRef();

  const onProfilePicturePress = () => {
    if (isOtherUser) {
      return;
    }
    updatePhotoDialogActionSheet.current.show();
  };

  const onUpdatePhotoDialogDone = (index) => {
    if (index === 0) {
      photoUploadDialogActionSheet.current.show();
    }

    if (index === 1) {
      removePhoto();
    }
  };

  const onPhotoUploadDialogDone = (index) => {
    if (index === 0) {
      onLaunchCamera();
    }

    if (index === 1) {
      onOpenPhotos();
    }
  };

  const onLaunchCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      return;
    }

    let { uri } = await ImagePicker.launchCameraAsync();

    if (uri) {
      startUpload(uri);
    }
  };

  const onOpenPhotos = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      return;
    }

    let { uri } = await ImagePicker.launchImageLibraryAsync();

    if (uri) {
      startUpload(uri);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <FeedMedia
        key={index + ''}
        index={index}
        onMediaPress={onPostPress}
        media={item.postMedia && item.postMedia[0]}
        item={item}
        mediaStyle={styles.gridItemImage}
        mediaContainerStyle={styles.gridItemContainer}
        dynamicStyles={styles}
      />
    );
  };

  renderListFooter = () => {
    if (loading) {
      return null;
    }
    if (isFetching) {
      return <ActivityIndicator style={{ marginVertical: 7 }} size="small" />;
    }
    return null;
  };

  const renderListHeader = () => {
    return (
      <View style={styles.subContainer}>
        <View style={styles.userCardContainer}>
          <TNStoryItem
            item={user}
            imageStyle={styles.userImage}
            imageContainerStyle={styles.userImageContainer}
            containerStyle={styles.userImageMainContainer}
            activeOpacity={1}
            title={true}
            onPress={onProfilePicturePress}
            textStyle={styles.userName}
            appStyles={AppStyles}
          />
          <View style={styles.countItemsContainer}>
            <TouchableOpacity activeOpacity={1} style={styles.countContainer}>
              <Text style={styles.count}>{postCount}</Text>
              <Text style={styles.countTitle}>
                {postCount != 1 ? IMLocalized('Posts') : IMLocalized('Post')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={onFollowersButtonPress}
              style={styles.countContainer}>
              <Text style={styles.count}>{followersCount}</Text>
              <Text style={styles.countTitle}>
                {followersCount != 1
                  ? IMLocalized('Followers')
                  : IMLocalized('Follower')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={onFollowingButtonPress}
              style={styles.countContainer}>
              <Text style={styles.count}>{followingCount}</Text>
              <Text style={styles.countTitle}>{IMLocalized('Following')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProfileButton
          title={mainButtonTitle}
          containerStyle={{ marginVertical: 40 }}
          onPress={onMainButtonPress}
        />
        {loading ? (
          <View style={styles.container}>
            <ActivityIndicator
              style={{ marginTop: 15, alignSelf: 'center' }}
              size="small"
            />
          </View>
        ) : (
          <View style={styles.FriendsContainer}></View>
        )}
      </View>
    );
  };

  const renderEmptyComponent = () => {
    var emptyStateConfig = {
      title: IMLocalized('No Posts'),
      description: IMLocalized(
        'There are currently no posts on this profile. All the posts will show up here.',
      ),
    };
    if (!isOtherUser) {
      emptyStateConfig = {
        ...emptyStateConfig,
        buttonName: IMLocalized('Add Your First Post'),
        onPress: onEmptyStatePress,
      };
    }
    return (
      <TNEmptyStateView
        emptyStateConfig={emptyStateConfig}
        appStyles={AppStyles}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
      {recentUserFeeds && (
        <FlatList
          data={recentUserFeeds}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.5}
          numColumns={3}
          horizontal={false}
          onEndReached={handleOnEndReached}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmptyComponent}
          style={{ width: '97%' }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TNMediaViewerModal
        mediaItems={feedItems}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
      <ActionSheet
        ref={updatePhotoDialogActionSheet}
        title={IMLocalized('Profile Picture')}
        options={[
          IMLocalized('Change Photo'),
          IMLocalized('Remove'),
          IMLocalized('Cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={onUpdatePhotoDialogDone}
      />
      <ActionSheet
        ref={photoUploadDialogActionSheet}
        title={IMLocalized('Select Photo')}
        options={[
          IMLocalized('Camera'),
          IMLocalized('Library'),
          IMLocalized('Cancel'),
        ]}
        cancelButtonIndex={2}
        onPress={onPhotoUploadDialogDone}
      />
    </View>
  );
}

Profile.propTypes = {
  onCommentPress: PropTypes.func,
  startUpload: PropTypes.func,
  removePhoto: PropTypes.func,
  onMainButtonPress: PropTypes.func,
  onSubButtonTitlePress: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  onFeedUserItemPress: PropTypes.func,
  user: PropTypes.object,
  friends: PropTypes.array,
  mainButtonTitle: PropTypes.string,
  subButtonTitle: PropTypes.string,
  feedItems: PropTypes.array,
  onMediaClose: PropTypes.func,
  isMediaViewerOpen: PropTypes.bool,
  onMediaPress: PropTypes.func,
  displaySubButton: PropTypes.bool,
  selectedMediaIndex: PropTypes.number,
  uploadProgress: PropTypes.number,
};

export default Profile;
