import React, { useState, useEffect, useRef, useContext } from 'react';
import { Share, View } from 'react-native';
import { connect, ReactReduxContext } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import SearchBar from '../../Core/ui/SearchBar/SearchBar';
import { Feed } from '../../components';
import {
  firebasePost,
  firebaseComment,
} from '../../Core/socialgraph/feed/firebase';
import dynamicStyles from './styles';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import FeedManager from '../../Core/socialgraph/feed/FeedManager';

const emptyStateConfig = {
  title: IMLocalized('No Posts'),
  description: IMLocalized(''),
};

function FeedSearchScreen(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(AppStyles, colorScheme);
  const hashtag =
    props.navigation.state.params.hashtag ||
    props.navigation.getParam('hashtag');

  const { store } = useContext(ReactReduxContext);

  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [feed, setFeed] = useState(null);
  const [selectedFeedItems, setSelectedFeedItems] = useState([]);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [willBlur, setWillBlur] = useState(false);

  const feedManager = useRef(new FeedManager(store, props.user.id));
  const searchBarRef = useRef(null);
  const unsubscribeFeed = useRef(null);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('didFocus', (payload) => {
      setWillBlur(false);
    }),
  );

  useEffect(() => {
    setTimeout(() => {
      searchBarRef.current?.focus(hashtag);
    }, 1500);
    willBlurSubscription.current = props.navigation.addListener(
      'willBlur',
      (payload) => {
        setWillBlur(true);
      },
    );
    props.navigation.setParams({
      openDrawer: openDrawer,
    });
    feedManager.current.subscribeUserFeedRelatedActions();
    feedManager.current.subscribeHashtagFeedPosts(hashtag, (posts) => {
      setFeed(posts);
    });

    return () => {
      feedManager.current.unsubscribeHashtagFeedPosts();
      feedManager.current.unsubscribe();
      willBlurSubscription.current && willBlurSubscription.current.remove();
      didFocusSubscription.current && didFocusSubscription.current.remove();
    };
  }, []);

  const openDrawer = () => {
    props.navigation.openDrawer();
  };

  const onCommentPress = (item) => {
    let copyItem = { ...item };
    props.navigation.navigate('MainDetailPost', {
      item: { ...copyItem },
      lastScreenTitle: 'Main',
    });
  };

  const onFeedUserItemPress = async (author) => {
    if (author.id === props.user.id) {
      props.navigation.navigate('MainProfile', {
        stackKeyTitle: 'MainProfile',
        lastScreenTitle: 'MainProfile',
      });
    } else {
      props.navigation.navigate('MainProfile', {
        user: author,
        stackKeyTitle: 'MainProfile',
        lastScreenTitle: 'MainProfile',
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

  const onReaction = async (reaction, item) => {
    feedManager.applyReaction(reaction, item, false);
    firebaseComment.handleReaction(reaction, props.user, item, false);
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

  const onSearchTextChange = (text) => {};

  const onSearchBarCancel = () => {
    props.navigation.goBack();
  };

  const onSearch = (text) => {
    setFeed(null);
    feedManager.current.unsubscribeHashtagFeedPosts();
    feedManager.current.subscribeHashtagFeedPosts(text, (posts) => {
      setFeed(posts);
    });
  };

  const onSearchClear = () => {};

  const handleOnEndReached = (distanceFromEnd) => {
    // if (!flatlistReady) {
    //   return;
    // }
    // if (isFetching || isFetching) {
    //   return;
    // }
    // if (fetchCallCount > 1) {
    //   return;
    // }
  };

  const onFeedScroll = () => {
    // flatlistReady = true;
  };

  const filterOutRelatedPosts = (posts) => {
    // we filter out posts with no media from self & friends
    if (!posts) {
      return posts;
    }
    // const defaultAvatar ='https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';
    const defaultAvatar ='https://uploaddeimagens.com.br/images/003/055/164/original/user.png?1611795073';

    return posts.filter((post) => {
      return (
        post &&
        // post.authorID != props.user.id &&
        post.author &&
        post.author.profilePictureURL &&
        post.author.profilePictureURL != defaultAvatar &&
        post.postMedia &&
        post.postMedia.length > 0 &&
        (!props.friends ||
          !props.friends.find((friend) => friend.id == post.authorID))
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          onChangeText={onSearchTextChange}
          onSearchBarCancel={onSearchBarCancel}
          searchRef={searchBarRef}
          onSearchClear={onSearchClear}
          appStyles={AppStyles}
          defaultValue={hashtag}
          onSearch={onSearch}
        />
      </View>
      <Feed
        loading={feed === null}
        feed={feed}
        onFeedUserItemPress={onFeedUserItemPress}
        onCommentPress={onCommentPress}
        isMediaViewerOpen={isMediaViewerOpen}
        feedItems={selectedFeedItems}
        onMediaClose={onMediaClose}
        onMediaPress={onMediaPress}
        selectedMediaIndex={selectedMediaIndex}
        handleOnEndReached={handleOnEndReached}
        isFetching={isFetching}
        onReaction={onReaction}
        onSharePost={onSharePost}
        onDeletePost={onDeletePost}
        user={props.user}
        onFeedScroll={onFeedScroll}
        willBlur={willBlur}
        emptyStateConfig={emptyStateConfig}
        navigation={props.navigation}
      />
    </View>
  );
}

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    discoverFeedPosts: feed.discoverFeedPosts,
    user: auth.user,
    friends: friends.friends,
  };
};

export default connect(mapStateToProps)(FeedSearchScreen);
