import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Explore } from '../../components';
import { TNTouchableIcon } from '../../Core/truly-native';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { FriendshipConstants } from '../../Core/socialgraph/friendships/constants';
import { Appearance } from 'react-native-appearance';

class ExploreScreen extends Component {
  constructor(props) {
    super(props);
    const { route } = props;
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = AppStyles.navThemeConstants[COLOR_SCHEME];
    const { params = {} } = route;
    props.navigation.setOptions({
      headerTitle: IMLocalized('Explore'),
      headerLeft: () => {},
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.state = {
      isCameraOpen: false,
      isMediaViewerOpen: false,
      selectedFeedItems: [],
      selectedMediaIndex: null,
      isFetching: false,
      willBlur: false,
    };

    this.fetchCallCount = 0;
    this.isFetching = false;
    this.flatlistReady = false;

    this.didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) => {
        this.setState({ willBlur: false });
      },
    );
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'beforeRemove',
      (payload) => {
        this.setState({ willBlur: true });
      },
    );

    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
    });
  }

  componentWillUnmount() {
    this.willBlurSubscription && this.willBlurSubscription();
    this.didFocusSubscription && this.didFocusSubscription();
  }

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  filterNonMediaPosts = (posts) => {
    return posts.filter((post) => {
      return post && post.postMedia && post.postMedia.length > 0;
    });
  };

  handleOnEndReached = (distanceFromEnd) => {
    if (!this.flatlistReady) {
      return;
    }

    if (this.state.isFetching || this.isFetching) {
      return;
    }
    if (this.fetchCallCount > 1) {
      return;
    }
  };

  onFeedScroll = () => {
    this.flatlistReady = true;
  };

  onMediaPress = ({ item, index }) => {
    const copyItem = { ...item };
    this.props.navigation.navigate('DiscoverDetailPost', {
      item: { ...copyItem },
      lastScreenTitle: 'Discover',
    });
  };

  filterOutRelatedPosts = (posts) => {
    // we filter out posts with no media from self & followers
    if (!posts) {
      return posts;
    }
    // const defaultAvatar ='https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';
    const defaultAvatar ='https://uploaddeimagens.com.br/images/003/055/164/original/user.png?1611795073';

    return posts.filter((post) => {
      return (
        post &&
        post.author &&
        post.author.profilePictureURL &&
        post.author.profilePictureURL != defaultAvatar &&
        post.postMedia &&
        post.postMedia.length > 0 &&
        post.authorID != this.props.user.id &&
        !this.props.friendships.find(
          (friendship) =>
            friendship.user.id == post.authorID &&
            friendship.type != FriendshipConstants.FriendshipType.inbound,
        )
      );
    });
  };

  render() {
    return (
      <Explore
        feed={this.filterOutRelatedPosts(this.props.discoverFeedPosts)}
        loading={this.props.discoverFeedPosts == null}
        handleOnEndReached={this.handleOnEndReached}
        isFetching={this.state.isFetching}
        willBlur={this.state.willBlur}
        onFeedScroll={this.onFeedScroll}
        onMediaPress={this.onMediaPress}
        videoResizeMode={'strech'}
      />
    );
  }
}

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    discoverFeedPosts: feed.discoverFeedPosts,
    user: auth.user,
    friendships: friends.friendships,
  };
};

export default connect(mapStateToProps)(ExploreScreen);
