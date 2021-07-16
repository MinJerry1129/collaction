import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import { Platform, View, Share, Image } from 'react-native';
import { useSelector, ReactReduxContext } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Feed } from '../../components';
import FeedManager from '../../Core/socialgraph/feed/FeedManager';
import FriendshipTracker from '../../Core/socialgraph/friendships/firebase/tracker';
import { friendshipUtils } from '../../Core/socialgraph/friendships';
import { firebaseStorage } from '../../Core/firebase/storage';
import {
  firebasePost,
  firebaseStory,
  firebaseComment,
} from '../../Core/socialgraph/feed/firebase';
import { groupBy } from '../../Core/helpers/collections';
import { compressVideo } from '../../Core/helpers/cacheManager';
import AppStyles from '../../AppStyles';
import styles from './styles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { TNTouchableIcon } from '../../Core/truly-native';
import { reportingManager } from '../../Core/user-reporting';
import { Appearance } from 'react-native-appearance';
import Logo from '../../../assets/images/app-logo.png'

const FeedScreen = (props) => {
  const currentUser = useSelector((state) => state.auth.user);
  const friends = useSelector((state) => state.friends.friends);
  const friendships = useSelector((state) => state.friends.friendships);
  const mainFeedPosts = useSelector((state) => state.feed.mainFeedPosts);
  const mainStories = useSelector((state) => state.feed.mainStories);

  const { store } = useContext(ReactReduxContext);
  const followTracker = new FriendshipTracker(
    store,
    currentUser.id || currentUser.userID,
    true,
    true,
    true,
  );
  const feedManager = new FeedManager(store, currentUser.id);

  const [myRecentStory, setMyRecentStory] = useState(null);
  const [groupedStories, setGroupedStories] = useState(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isMediaComposerVisible, setIsMediaComposerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFeedItems, setSelectedFeedItems] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [isStoryUpdating, setIsStoryUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [willBlur, setWillBlur] = useState(false);
  const [shouldEmptyStories, setShouldEmptyStories] = useState(false);
  const [feed, setFeed] = useState(null);

  const navMenuRef = useRef();

  const feedBatchLimit = 7;

  useEffect(() => {
    followTracker.subscribeIfNeeded();
    props.navigation.setParams({
      toggleCamera: toggleCamera,
      openDrawer: openDrawer,
      openCamera: openCamera,
      openVideoRecorder: openVideoRecorder,
      openMediaPicker: openMediaPicker,
      toggleMediaComposer: toggleMediaComposer,
      navMenuRef: navMenuRef,
    });
  }, []);

  useEffect(() => {
    feedManager.subscribeIfNeeded();
  }, [friends]);

  useEffect(() => {
    setIsStoryUpdating(false);
  }, [groupedStories, myRecentStory]);

  useEffect(() => {
    if (mainFeedPosts) {
      setFeed(mainFeedPosts);
      setLoading(false);
      setIsFetching(false);
    }
    if (mainStories) {
      const freshStories = filterStaleStories(mainStories);
      groupAndDisplayStories(freshStories);
    }
  }, [mainFeedPosts, mainStories]);

  const filterStaleStories = (stories) => {
    const oneDay = 60 * 60 * 24 * 1000;
    const now = +new Date();

    return stories.filter((story) => {
      if (!story.createdAt) {
        return false;
      }
      let createdAt;

      if (story.createdAt.seconds) {
        createdAt = +new Date(story.createdAt.seconds * 1000);
      } else {
        createdAt = +new Date(story.createdAt * 1000);
      }

      if (now - createdAt < oneDay) {
        return story;
      }
    });
  };

  const groupAndDisplayStories = (stories) => {
    setIsStoryUpdating(true);
    const formattedStories = [];
    var myStory = null;
    const groupedByAuthorID = groupBy('authorID');
    const groupedStories = groupedByAuthorID(stories);

    for (var key of Object.keys(groupedStories)) {
      const rawStory = groupedStories[key];
      const firstStoryInGroup = rawStory[0];
      const author = firstStoryInGroup.author;
      if (!author) {
        continue;
      }
      const formattedStory = {
        authorID: firstStoryInGroup.authorID,
        id: firstStoryInGroup.id,
        idx: 0,
        profilePictureURL: author.profilePictureURL,
        firstName: author.firstName || author.fullname,
        items: rawStory.map((item) => {
          return {
            id: item.id,
            src: item.storyMediaURL,
            type: item.storyType,
            createdAt: item.createdAt,
          };
        }),
      };
      if (formattedStory.authorID === currentUser.id) {
        myStory = formattedStory;
      } else {
        formattedStories.push(formattedStory);
      }
    }
    setGroupedStories(formattedStories);
    if (myStory) {
      setMyRecentStory(myStory);
    }
  };

  const onCommentPress = (item) => {
    props.navigation.navigate('FeedDetailPost', {
      item: item,
      lastScreenTitle: 'Feed',
    });
  };

  const toggleCamera = () => {
    if (Platform.OS === 'ios') {
      setIsCameraOpen(!isCameraOpen);
    } else {
      if (navMenuRef.current) {
        navMenuRef.current.open();
      }
    }
  };

  const openVideoRecorder = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    }).then((image) => {
      if (image.path) {
        compressVideo(image.path, (newSource) => {
          onPostStory({ uri: newSource, mime: image.mime });
        });
      }
    });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
    }).then((image) => {
      if (image.path) {
        onPostStory({ uri: image.path, mime: image.mime });
      }
    });
  };

  const openMediaPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    }).then((image) => {
      if (image.path) {
        const includesVideo = image.mime?.includes('video');
        if (includesVideo) {
          compressVideo(image.path, (newSource) => {
            onPostStory({ uri: newSource, mime: image.mime });
          });
        } else {
          onPostStory({ uri: image.path, mime: image.mime });
        }
      }
    });
  };

  const openDrawer = () => {
    props.navigation.openDrawer();
  };

  const toggleMediaComposer = () => {
    if (Platform.OS === 'ios') {
      setIsMediaComposerVisible(!isMediaComposerVisible);
    } else {
      props.navigation.navigate('CreatePost');
    }
  };

  const findHashtags = (post) => {
    const regexp = /(\s|^)\#\w\w+\b/gm;
    let result = post.match(regexp);
    if (result) {
      result = result.map((text) => text.trim());
      return result;
    } else {
      return [];
    }
  };

  const onShareMediaPost = async ({ postText, location, postMedia }) => {
    const newPost = {
      postText,
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
      location,
      postMedia,
      authorID: currentUser.id,
    };

    const isEmptyPost = newPost.postText.trim() === '';

    if (newPost.postMedia.length === 0 && isEmptyPost) {
      Alert.alert(
        IMLocalized('Post not completed.'),
        IMLocalized(
          "I'm sorry, you may not upload an empty post. Kindly try again.",
        ),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
      return;
    }

    newPost.hashtags = findHashtags(postText);

    if (newPost.postMedia.length === 0) {
      await firebasePost.addPost(
        newPost,
        friendshipUtils.followerIDs(friendships, friends, true),
        currentUser,
      );
      toggleMediaComposer();
    } else {
      startPostUpload(newPost);
    }
  };

  const startPostUpload = async (post) => {
    const uploadPromises = [];
    const mediaSources = [];
    post.postMedia.forEach((media) => {
      const { uri, mime } = media;
      uploadPromises.push(
        new Promise((resolve, reject) => {
          firebaseStorage.uploadImage(uri).then((response) => {
            if (!response.error) {
              mediaSources.push({ url: response.downloadURL, mime });
            } else {
              alert(
                IMLocalized(
                  'Oops! An error occured while uploading your post. Please try again.',
                ),
              );
            }
            resolve();
          });
        }),
      );
    });
    Promise.all(uploadPromises).then(async () => {
      const postToUpload = { ...post, postMedia: [...mediaSources] };
      firebasePost.addPost(
        postToUpload,
        friendshipUtils.followerIDs(friendships, friends, true),
        currentUser,
      );
    });
    toggleMediaComposer();
  };

  const onCameraClose = () => {
    setIsCameraOpen(false);
  };

  const onUserItemPress = (shouldOpenCamera) => {
    if (shouldOpenCamera) {
      toggleCamera();
    }
  };

  const onFeedUserItemPress = async (item) => {
    if (item.id === currentUser.id) {
      props.navigation.navigate('FeedProfile', {
        stackKeyTitle: 'FeedProfile',
        lastScreenTitle: 'Feed',
      });
    } else {
      props.navigation.navigate('FeedProfile', {
        user: item,
        stackKeyTitle: 'FeedProfile',
        lastScreenTitle: 'Feed',
      });
    }
  };

  const onMediaClose = () => {
    setIsMediaViewerOpen(false);
  };

  const onMediaPress = (media, mediaIndex) => {
    setSelectedFeedItems(media);
    setSelectedMediaIndex(mediaIndex);
    setIsMediaViewerOpen(true);
  };

  const onPostStory = async (source) => {
    const story = {
      authorID: currentUser.id,
      storyMediaURL: '',
      storyType: source.mime,
    };
    firebaseStorage.uploadImage(source.uri).then((response) => {
      if (!response.error) {
        story.storyMediaURL = response.downloadURL;
        firebaseStory.addStory(
          story,
          friendshipUtils.followerIDs(friendships, friends, true),
          currentUser,
        );
      }
    });
  };

  const onReaction = async (reaction, item) => {
    feedManager.applyReaction(reaction, item);
    await firebaseComment.handleReaction(reaction, currentUser, item, true);
  };

  const onSharePost = async (item) => {
    let url = '';
    if (item.postMedia?.length > 0) {
      url = item.postMedia[0]?.url || item.postMedia[0];
    }
    try {
      const result = await Share.share(
        {
          title: 'Share SocialNetwork post.',
          message: item.postText,
          url,
        },
        {
          dialogTitle: 'Share SocialNetwork post.',
        },
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const onDeletePost = async (item) => {
    const res = await firebasePost.deletePost(item, true);
    if (res.error) {
      alert(res.error);
    }
  };

  const onUserReport = async (item, type) => {
    reportingManager.markAbuse(currentUser.id, item.authorID, type);
  };

  const handleOnEndReached = (distanceFromEnd) => {
    if (isFetching) {
      return;
    }
  };

  const onFeedScroll = () => {};

  const onEmptyStatePress = () => {
    props.navigation.navigate('Friends');
  };

  useLayoutEffect(() => {
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = AppStyles.navThemeConstants[COLOR_SCHEME];

    const { params } = props.route;

    const androidNavIconOptions = [
      {
        key: 'camera',
        onSelect: openCamera,
        iconSource: AppStyles.iconSet.camera,
      },
      {
        key: 'video',
        onSelect: openVideoRecorder,
        iconSource: AppStyles.iconSet.videoCamera,
      },
      {
        key: 'picker',
        onSelect: openMediaPicker,
        iconSource: AppStyles.iconSet.libraryLandscape,
      },
    ];
    props.navigation.setOptions({
      headerTitle: () => (
          <Image
            source={require('../../../assets/images/logo.png')}
            style={{
              height: 30,
              //width: 120,      //iOS version
	            width: '100%', //android version
              resizeMode: 'contain'}}
          />
      ),
      headerLeft: () => (
        Platform.OS === 'ios' ? 
        <TNTouchableIcon
          imageStyle={{ tintColor: currentTheme.fontColor }}
          iconSource={
            Platform.OS === 'ios'
              ? AppStyles.iconSet.camera
              : AppStyles.iconSet.camera
          }
          onPress={toggleCamera}
          appStyles={AppStyles}
        /> : <Menu ref={navMenuRef}>
        <MenuTrigger>
          <Image
            style={[
              {
                tintColor: currentTheme.fontColor,
                marginRight: -5,
              },
              styles.navIcon,
            ]}
            source={AppStyles.iconSet.camera}
          />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: {
              ...styles.navIconMenuOptions,
              backgroundColor: currentTheme.backgroundColor,
            },
          }}>
          {androidNavIconOptions.map((option) => (
            <MenuOption onSelect={option.onSelect}>
              <Image
                style={[
                  {
                    tintColor: currentTheme.fontColor,
                  },
                  styles.navIcon,
                ]}
                source={option.iconSource}
              />
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>

      ),
      headerRight: () => (
        <View style={styles.doubleNavIcon}>
          <TNTouchableIcon
            imageStyle={{ tintColor: currentTheme.fontColor }}
            iconSource={AppStyles.iconSet.inscription}
            onPress={toggleMediaComposer}
            // onPress={() => navigation.navigate('CreatePost')}
            appStyles={AppStyles}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
        fontFamily: 'LeituraNews-Roman 1',
      },
      headerTintColor: currentTheme.fontColor,
    });
  });

  return (
    <View style={styles.container}>
      <Feed
        loading={loading}
        feed={feed}
        displayStories={true}
        onCommentPress={onCommentPress}
        user={currentUser}
        isCameraOpen={isCameraOpen}
        onCameraClose={onCameraClose}
        onUserItemPress={onUserItemPress}
        onFeedUserItemPress={onFeedUserItemPress}
        isMediaViewerOpen={isMediaViewerOpen}
        feedItems={selectedFeedItems}
        onMediaClose={onMediaClose}
        onMediaPress={onMediaPress}
        selectedMediaIndex={selectedMediaIndex}
        stories={groupedStories || []}
        userStories={myRecentStory}
        onPostStory={onPostStory}
        onReaction={onReaction}
        handleOnEndReached={handleOnEndReached}
        isFetching={isFetching}
        shouldEmptyStories={shouldEmptyStories}
        isStoryUpdating={isStoryUpdating}
        onSharePost={onSharePost}
        onDeletePost={onDeletePost}
        onUserReport={onUserReport}
        onFeedScroll={onFeedScroll}
        shouldReSizeMedia={true}
        willBlur={willBlur}
        onEmptyStatePress={onEmptyStatePress}
        isMediaComposerVisible={isMediaComposerVisible}
        onMediaComposerDismiss={toggleMediaComposer}
        onShareMediaPost={onShareMediaPost}
        navigation={props.navigation}
      />
    </View>
  );
};

export default FeedScreen;
