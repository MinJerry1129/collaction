import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BackHandler, Share } from 'react-native';
import { DetailPost } from '../../components';
import {
  firebaseComment,
  firebasePost,
} from '../../Core/socialgraph/feed/firebase';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { reportingManager } from '../../Core/user-reporting';
import { Appearance } from 'react-native-appearance';

class DetailScreen extends Component {
  constructor(props) {
    super(props);
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = AppStyles.navThemeConstants[COLOR_SCHEME];
    this.props.navigation.setOptions({
      headerTitle: IMLocalized('Post'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.item = this.props.route.params.item;
    this.state = {
      comments: [],
      feedItem: this.item,
      selectedMediaIndex: null,
      selectedFeedItems: [],
      commentsLoading: true,
      isMediaViewerOpen: false,
      shouldUpdate: false,
    };

    this.didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );

    this.scrollViewRef = React.createRef();
    this.lastScreenTitle = this.props.route.params.lastScreenTitle;
    this.ProfileScreenTitle = this.lastScreenTitle + 'Profile';
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'beforeRemove',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.unsubscribeSinglePost = firebasePost.subscribeToSinglePost(
      this.item.id,
      this.onFeedItemUpdate,
    );
    this.unsubscribeComments = firebaseComment.subscribeComments(
      this.item.id,
      this.onCommentsUpdate,
    );
    this.setState({ shouldUpdate: true });
  }

  componentWillUnmount() {
    this.unsubscribeComments && this.unsubscribeComments();
    this.didFocusSubscription && this.didFocusSubscription();
    this.willBlurSubscription && this.willBlurSubscription();
    this.unsubscribeSinglePost && this.unsubscribeSinglePost();
  }

  onFeedItemUpdate = (feedItem) => {
    const myReaction = this.props.myReactions.find(
      (reaction) => reaction.postID == feedItem.id,
    );
    if (myReaction) {
      const finalFeedItem = { ...feedItem, myReaction: myReaction };
      this.setState({ feedItem: finalFeedItem });
    } else {
      this.setState({ feedItem, myReaction: null });
    }
  };

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onCommentsUpdate = (comments) => {
    this.postCommentLength = comments.length;
    this.setState({
      comments,
      commentsLoading: false,
    });
  };

  onCommentSend = async (value) => {
    const commentObject = {
      postID: this.state.feedItem.id,
      commentText: value,
      authorID: this.props.user.id,
    };
    firebaseComment.addComment(
      commentObject,
      this.props.user,
      this.state.feedItem,
      true,
    );
  };

  onReaction = async (reaction, item) => {
    await firebaseComment.handleReaction(reaction, this.props.user, item, true);
  };

  onMediaPress = (media, mediaIndex) => {
    this.setState({
      selectedMediaIndex: mediaIndex,
      selectedFeedItems: media,
      isMediaViewerOpen: true,
    });
  };

  onMediaClose = () => {
    this.setState({ isMediaViewerOpen: false });
  };

  onFeedUserItemPress = async (item) => {
    if (item.id === this.props.user.id) {
      this.props.navigation.navigate(this.ProfileScreenTitle, {
        stackKeyTitle: this.ProfileScreenTitle,
        lastScreenTitle: this.lastScreenTitle,
      });
    } else {
      this.props.navigation.navigate(this.ProfileScreenTitle, {
        user: item,
        stackKeyTitle: this.ProfileScreenTitle,
        lastScreenTitle: this.lastScreenTitle,
      });
    }
  };

  onSharePost = async (item) => {
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

  onDeletePost = async (item) => {
    const res = await firebasePost.deletePost(item, true);
    if (res.error) {
      alert(res.error);
    } else {
      this.props.navigation.goBack();
    }
  };

  onUserReport = async (item, type) => {
    await reportingManager.markAbuse(this.props.user.id, item.authorID, type);
    this.props.navigation.goBack();
  };

  render() {
    return (
      <DetailPost
        scrollViewRef={this.scrollViewRef}
        feedItem={this.state.feedItem}
        commentItems={this.state.comments}
        onCommentSend={this.onCommentSend}
        onFeedUserItemPress={this.onFeedUserItemPress}
        onMediaPress={this.onMediaPress}
        feedItems={this.state.selectedFeedItems}
        onMediaClose={this.onMediaClose}
        isMediaViewerOpen={this.state.isMediaViewerOpen}
        selectedMediaIndex={this.state.selectedMediaIndex}
        onReaction={this.onReaction}
        shouldUpdate={this.state.shouldUpdate}
        onSharePost={this.onSharePost}
        onDeletePost={this.onDeletePost}
        onUserReport={this.onUserReport}
        user={this.props.user}
        commentsLoading={this.state.commentsLoading}
        navigation={this.props.navigation}
      />
    );
  }
}

const mapStateToProps = ({ feed, auth, friends }) => {
  return {
    comments: feed.comments,
    myReactions: feed.feedPostReactions,
    user: auth.user,
    friends: friends.friends,
  };
};

export default connect(mapStateToProps)(DetailScreen);
