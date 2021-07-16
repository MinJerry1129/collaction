import React, { Component } from 'react';
import { Platform, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { Profile } from '../../components';
import { firebaseUser } from '../../Core/firebase';
import { firebasePost } from '../../Core/socialgraph/feed/firebase';
import * as firebaseFriendship from '../../Core/socialgraph/friendships/firebase/friendship';
import { firebaseStorage } from '../../Core/firebase/storage';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { setUserData } from '../../Core/onboarding/redux/auth';
import { TNTouchableIcon } from '../../Core/truly-native';
import CollactionConfig from '../../CollactionConfig';
import { FriendshipConstants } from '../../Core/socialgraph/friendships/constants';
import { Appearance } from 'react-native-appearance';

// const defaultAvatar ='https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';
  const defaultAvatar ='https://uploaddeimagens.com.br/images/003/055/164/original/user.png?1611795073';
  
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = AppStyles.navThemeConstants[COLOR_SCHEME];
    this.otherUser = this.props.route.params?.user;

    this.props.navigation.setOptions({
      headerTitle: IMLocalized('Profile'),
      headerRight: () =>
        !this.otherUser && (
          <TNTouchableIcon
            imageStyle={{ tintColor: currentTheme.activeTintColor }}
            iconSource={AppStyles.iconSet.bell}
            onPress={this.navigateNotifi}
            appStyles={AppStyles}
          />
        ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });

    const lastScreenTitle = this.props.route.params?.lastScreenTitle;
    if (!lastScreenTitle && Platform.OS === 'android') {
      props.navigation.setOptions({
        headerLeft: () => {}
      });
    }
    const shouldAddFriend = this.otherUser
      ? !this.props.friendships.find(
          (friendship) =>
            friendship.user.id == this.otherUser.id &&
            friendship.type != FriendshipConstants.FriendshipType.inbound,
        )
      : false;
    this.state = {
      profilePosts: null,
      isCameraOpen: false,
      isMediaViewerOpen: false,
      selectedFeedItems: [],
      loading: true,
      userFeed: [],
      uploadProgress: 0,
      shouldAddFriend: shouldAddFriend,
      isFetching: false,
      selectedMediaIndex: null,
    };

    this.isFetching = false;
    this.didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) => {
        this.willBlur = false;
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        );
      },
    );

    this.willBlur = false;
    this.lastVisibleFeed = null;
    this.feedBatchLimit = 15;
    this.fetchCallCount = 0;
    this.stackKeyTitle = 'Profile';
    const keyTitle = this.props.route.params?.stackKeyTitle;
    if (keyTitle) {
      this.stackKeyTitle = keyTitle;
    }
    this.ProfileSettingsTitle = 'ProfileProfileSettings';
    this.lastScreenTitle = this.props.route.params?.lastScreenTitle;
    if (this.lastScreenTitle) {
      this.ProfileSettingsTitle = this.lastScreenTitle + 'ProfileSettings';
    } else {
      this.lastScreenTitle = 'Profile';
    }
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'beforeRemove',
      (payload) => {
        this.willBlur = true;
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        );
      },
    );

    if (this.otherUser && this.otherUser.id != this.props.user.id) {
      let profileUserID = this.otherUser.id;
      this.currentProfileFeedUnsubscribe = firebasePost.subscribeToProfileFeedPosts(
        profileUserID,
        this.onProfileFeedUpdate,
      );
      this.currentUserUnsubscribe = firebaseUser.subscribeCurrentUser(
        profileUserID,
        this.onCurrentUserUpdate,
      );
      this.setState({
        inboundFriendsCount: this.otherUser.inboundFriendsCount || 0,
        outboundFriendsCount: this.otherUser.outboundFriendsCount || 0,
      });
    } else {
      this.currentProfileFeedUnsubscribe = firebasePost.subscribeToProfileFeedPosts(
        this.props.user.id,
        this.onProfileFeedUpdate,
      );
      this.currentUserUnsubscribe = firebaseUser.subscribeCurrentUser(
        this.props.user.id,
        this.onCurrentUserUpdate,
      );
      this.setState({
        profilePosts: this.props.currentUserFeedPosts,
        inboundFriendsCount: this.props.user.inboundFriendsCount || 0,
        outboundFriendsCount: this.props.user.outboundFriendsCount || 0,
        loading: false,
      });
    }
  }

  componentWillUnmount() {
    this.willBlur = true;
    this.didFocusSubscription && this.didFocusSubscription();
    this.willBlurSubscription && this.willBlurSubscription();
    this.currentProfileFeedUnsubscribe && this.currentProfileFeedUnsubscribe();
    this.currentUserUnsubscribe && this.currentUserUnsubscribe();
  }

  onCurrentUserUpdate = (user) => {
    this.setState({
      inboundFriendsCount: user.inboundFriendsCount || 0,
      outboundFriendsCount: user.outboundFriendsCount || 0,
    });
  };

  onProfileFeedUpdate = (profilePosts) => {
    this.setState({
      profilePosts,
      loading: false,
    });
  };

  navigateNotifi = () => {
    this.props.navigation.navigate(this.lastScreenTitle + 'Notification', {
      lastScreenTitle: this.lastScreenTitle,
      appStyles: AppStyles,
    });
  };

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  onMainButtonPress = () => {
    if (this.state.shouldAddFriend) {
      this.onAddFriend();
      return;
    }
    if (this.otherUser) {
      this.onMessage();
      return;
    }
    this.props.navigation.navigate(this.ProfileSettingsTitle, {
      lastScreenTitle: this.lastScreenTitle,
      appStyles: AppStyles,
      appConfig: CollactionConfig,
    });
  };

  onMessage = () => {
    const viewer = this.props.user;
    const otherUser = this.otherUser;
    const viewerID = viewer.id || viewer.userID;
    const friendID = otherUser.id || otherUser.userID;
    let channel = {
      id: viewerID < friendID ? viewerID + friendID : friendID + viewerID,
      participants: [otherUser],
    };
    this.props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: AppStyles,
    });
  };

  onFollowersButtonPress = () => {
    this.props.navigation.push(this.lastScreenTitle + 'AllFriends', {
      lastScreenTitle: this.lastScreenTitle,
      title: IMLocalized('Followers'),
      stackKeyTitle: this.stackKeyTitle,
      otherUser: this.otherUser,
      includeInbound: true,
      appStyles: AppStyles,
      followEnabled: true,
    });
  };

  onFollowingButtonPress = () => {
    this.props.navigation.push(this.lastScreenTitle + 'AllFriends', {
      channels: this.props.channels,
      lastScreenTitle: this.lastScreenTitle,
      title: 'Following',
      stackKeyTitle: this.stackKeyTitle,
      otherUser: this.otherUser,
      includeOutbound: true,
      appStyles: AppStyles,
      followEnabled: true,
    });
  };

  onMediaClose = () => {
    this.setState({ isMediaViewerOpen: false });
  };

  startUpload = async (source) => {
    const self = this;
    self.props.setUserData({
      user: { ...self.props.user, profilePictureURL: source },
    });

    const filename =
      new Date() + '-' + source.substring(source.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? source.replace('file://', '') : source;

    firebaseStorage.uploadFileWithProgressTracking(
      filename,
      uploadUri,
      async (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        self.setState({ uploadProgress });
      },
      async (url) => {
        const data = {
          profilePictureURL: url,
        };
        self.props.setUserData({
          user: { ...self.props.user, profilePictureURL: url },
        });

        firebaseUser.updateUserData(self.props.user.id, data);
        self.setState({ uploadProgress: 0 });
      },
      (error) => {
        self.setState({ uploadProgress: 0 });
        alert(
          IMLocalized(
            'Oops! An error occured while trying to update your profile picture. Please try again.',
          ),
        );
        console.log(error);
      },
    );
  };

  removePhoto = async () => {
    const self = this;
    const res = await firebaseUser.updateUserData(this.props.user.id, {
      profilePictureURL: defaultAvatar,
    });
    if (res.success) {
      self.props.setUserData({
        user: { ...self.props.user, profilePictureURL: defaultAvatar },
      });
    } else {
      alert(
        'Oops! An error occured while trying to remove your profile picture. Please try again.',
      );
    }
  };

  onAddFriend = () => {
    this.setState({ shouldAddFriend: false });
    firebaseFriendship.addFriendRequest(
      this.props.user,
      this.otherUser,
      true,
      true,
      true,
      ({ success, error }) => {
        if (error) {
          alert(error);
          this.setState({ shouldAddFriend: true });
        } else {
          // const newFriendId = this.otherUser.id || this.otherUser.userID;
          // const friendships = this.props.friendships;
          // const detectedFriendship = friendships.find(friendship => friendship.user.id == newFriendId && friendship.type == FriendshipConstants.FriendshipType.inbound);
          // if (detectedFriendship) {
          //   firebaseFriendship.updateFeedsForNewFriends(this.props.user.id, newFriendId);
          // }
        }
      },
    );
  };

  onPostPress = ({ item, index }) => {
    this.props.navigation.navigate('FeedProfilePostDetails', {
      item: item,
      lastScreenTitle: this.lastScreenTitle,
    });
  };

  onEmptyStatePress = () => {
    this.props.navigation.navigate('CreatePost');
  };

  handleOnEndReached = (distanceFromEnd) => {
    if (this.state.isFetching || this.isFetching) {
      return;
    }
    if (this.fetchCallCount > 1) {
      return;
    }
  };

  render() {
    let currentProfile = this.otherUser || this.props.user;
    let postsCount = currentProfile.postsCount || 0;
    let mainButtonTitle = IMLocalized('Profile Settings');

    if (this.otherUser) {
      mainButtonTitle = IMLocalized('Send Direct Message');
      if (this.state.shouldAddFriend) {
        mainButtonTitle = IMLocalized('Follow');
      }
    }

    return (
      <Profile
        loading={this.state.loading}
        uploadProgress={this.state.uploadProgress}
        user={this.otherUser ? this.otherUser : this.props.user}
        mainButtonTitle={mainButtonTitle}
        followingCount={this.state.outboundFriendsCount}
        followersCount={this.state.inboundFriendsCount}
        postCount={postsCount}
        recentUserFeeds={this.state.profilePosts}
        onMainButtonPress={this.onMainButtonPress}
        selectedMediaIndex={this.state.selectedMediaIndex}
        onPostPress={this.onPostPress}
        isMediaViewerOpen={this.state.isMediaViewerOpen}
        feedItems={this.state.selectedFeedItems}
        onMediaClose={this.onMediaClose}
        removePhoto={this.removePhoto}
        startUpload={this.startUpload}
        handleOnEndReached={this.handleOnEndReached}
        isFetching={this.state.isFetching}
        isOtherUser={this.otherUser}
        onFollowersButtonPress={this.onFollowersButtonPress}
        onFollowingButtonPress={this.onFollowingButtonPress}
        onEmptyStatePress={this.onEmptyStatePress}
        navigation={this.props.navigation}
      />
    );
  }
}

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    currentUserFeedPosts: feed.currentUserFeedPosts,
    user: auth.user,
    friends: friends.friends,
    friendships: friends.friendships,
  };
};

export default connect(mapStateToProps, { setUserData })(ProfileScreen);
