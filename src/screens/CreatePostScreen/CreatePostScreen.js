import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackHandler, ActivityIndicator, Alert } from 'react-native';
import TextButton from 'react-native-button';
import { connect } from 'react-redux';
import { CreatePost } from '../../components';
import { firebasePost } from '../../Core/socialgraph/feed/firebase';
import { firebaseStorage } from '../../Core/firebase/storage';
import AppStyles from '../../AppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { friendshipUtils } from '../../Core/socialgraph/friendships';
import { Appearance } from 'react-native-appearance';

const defaultPost = {
  postText: '',
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

class CreatePostScreen extends Component {
  constructor(props) {
    super(props);
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = AppStyles.navThemeConstants[COLOR_SCHEME];
    this.props.navigation.setOptions({
      headerTitle: 'Create Post',
      headerRight: () =>
        this.state.isPosting ? (
          <ActivityIndicator style={{ margin: 10 }} size="small" />
        ) : (
          <TextButton style={{ marginRight: 12 }} onPress={this.onPost}>
            Post
          </TextButton>
        ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.state = {
      post: defaultPost,
      postMedia: [],
      location: '',
      isPosting: false,
    };
    this.inputRef = React.createRef();
    this.didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentDidMount() {
    this.inputRef.current.focus();
    this.willBlurSubscription = this.props.navigation.addListener(
      'beforeRemove',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription();
    this.willBlurSubscription && this.willBlurSubscription();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onPostDidChange = (post) => {
    this.setState({ post });
  };

  onSetMedia = (photos) => {
    this.setState({ postMedia: [...photos] });
  };

  onLocationDidChange = (location) => {
    this.setState({ location });
  };

  findHashtags = (post) => {
    const regexp = /(\s|^)\#\w\w+\b/gm;
    let result = post.match(regexp);
    if (result) {
      result = result.map(function (text) {
        return text.trim();
      });
      return result;
    } else {
      return [];
    }
  };

  onPost = async () => {
    const self = this;
    const isEmptyPost = self.state.post.postText.trim() === '';

    if (self.state.postMedia.length === 0 && isEmptyPost) {
      Alert.alert(
        IMLocalized('Post not completed'),
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

    const hashtags = this.findHashtags(self.state.post.postText);

    self.setState(
      {
        isPosting: true,
        post: {
          ...self.state.post,
          // createdAt: new Date(),
          authorID: self.props.user.id,
          location: self.state.location,
          postMedia: self.state.postMedia,
          hashtags,
        },
      },
      async () => {
        if (
          self.state.post &&
          self.state.post.postMedia &&
          self.state.post.postMedia.length === 0
        ) {
          await firebasePost.addPost(
            self.state.post,
            friendshipUtils.followerIDs(
              this.props.friendships,
              this.props.friends,
              true,
            ),
            self.props.user,
          );
          self.props.navigation.goBack();
        } else {
          self.startPostUpload();
        }
      },
    );
  };

  startPostUpload = async () => {
    const self = this;
    const uploadPromises = [];
    const mediaSources = [];
    this.state.post.postMedia.forEach((media) => {
      const { uploadUri, mime } = media;
      uploadPromises.push(
        new Promise((resolve, reject) => {
          firebaseStorage.uploadImage(uploadUri).then((response) => {
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
      const postToUpload = { ...self.state.post, postMedia: [...mediaSources] };
      firebasePost.addPost(
        postToUpload,
        friendshipUtils.followerIDs(
          this.props.friendships,
          this.props.friends,
          true,
        ),
        self.props.user,
      );
    });
    self.props.navigation.goBack();
  };

  blurInput = () => {
    this.inputRef.current.blur();
  };

  render() {
    return (
      <CreatePost
        inputRef={this.inputRef}
        user={this.props.user}
        onPostDidChange={this.onPostDidChange}
        onSetMedia={this.onSetMedia}
        onLocationDidChange={this.onLocationDidChange}
        blurInput={this.blurInput}
      />
    );
  }
}

CreatePostScreen.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = ({ auth, friends }) => {
  return {
    user: auth.user,
    friends: friends.friends,
    friendships: friends.friendships,
  };
};

export default connect(mapStateToProps)(CreatePostScreen);
