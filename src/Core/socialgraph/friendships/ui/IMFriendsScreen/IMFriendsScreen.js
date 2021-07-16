import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect, ReactReduxContext } from 'react-redux';
import { TNTouchableIcon } from '../../../../truly-native';
import { FriendshipConstants, IMFriendsListComponent } from '../..';
import { setFriendships, setFriends } from '../../redux';
import { IMLocalized } from '../../../../localization/IMLocalization';
import FriendshipTracker from '../../firebase/tracker';
import { Appearance } from 'react-native-appearance';

class IMFriendsScreen extends Component {
  static contextType = ReactReduxContext;

  constructor(props) {
    super(props);
    const { route } = this.props;
    this.appStyles = this.props.route.params.appStyles;
    let showDrawerMenuButton = route.params.showDrawerMenuButton;
    let headerTitle = route.params.friendsScreenTitle || IMLocalized('Friends');
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = this.appStyles.navThemeConstants[COLOR_SCHEME];
    const { params = {} } = route;
    this.props.navigation.setOptions({
      headerTitle: headerTitle,
      headerLeft: () => {},
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.followEnabled = this.props.route.params.followEnabled;

    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    const user = this.props.user;
    this.friendshipTracker = new FriendshipTracker(
      this.context.store,
      user.id || user.userID,
      this.followEnabled,
      this.followEnabled,
      this.followEnabled,
    );
    this.friendshipTracker.subscribeIfNeeded();

    this.props.navigation.setParams({
      toggleCamera: this.toggleCamera,
      openDrawer: this.openDrawer,
    });
  }

  componentWillUnmount() {
    this.friendshipTracker.unsubscribe();
  }

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  onSearchButtonPress = async () => {
    this.props.navigation.navigate('UserSearchScreen', {
      appStyles: this.appStyles,
      followEnabled: this.followEnabled,
    });
  };

  onFriendAction = (item, index) => {
    if (
      this.state.isLoading ||
      (item.user && item.user.id == this.props.user.id)
    ) {
      return;
    }
    switch (item.type) {
      case FriendshipConstants.FriendshipType.none:
        this.onAddFriend(item, index);
        break;
      case FriendshipConstants.FriendshipType.reciprocal:
        this.onUnfriend(item, index);
        break;
      case FriendshipConstants.FriendshipType.inbound:
        this.onAccept(item, index);
        break;
      case FriendshipConstants.FriendshipType.outbound:
        this.onCancel(item, index);
        break;
    }
  };

  onUnfriend = (item, index) => {
    this.setState({ isLoading: true });
    this.friendshipTracker.unfriend(this.props.user, item.user, (respone) => {
      this.setState({ isLoading: false });
    });
  };

  onAddFriend = (item, index) => {
    this.friendshipTracker.addFriendRequest(
      this.props.user,
      item.user,
      (response) => {},
    );
  };

  onCancel = (item, index) => {
    this.setState({ isLoading: true });
    this.friendshipTracker.cancelFriendRequest(
      this.props.user,
      item.user,
      (response) => {
        this.setState({ isLoading: false });
      },
    );
  };

  onAccept = (item, index) => {
    this.setState({ isLoading: true });
    this.friendshipTracker.addFriendRequest(
      this.props.user,
      item.user,
      (response) => {
        this.setState({ isLoading: false });
      },
    );
  };

  onFriendItemPress = (friendship) => {
    if (friendship.user && friendship.user.id == this.props.user.id) {
      return;
    }
    this.props.navigation.push('FriendsProfile', {
      user: friendship.user,
      lastScreenTitle: 'Friends',
    });
  };

  onEmptyStatePress = () => {
    this.onSearchButtonPress();
  };

  render() {
    const emptyStateConfig = {
      title: IMLocalized('No Friends'),
      description: IMLocalized(
        'Make some friend requests and have your friends accept them. All your friends will show up here.',
      ),
      buttonName: IMLocalized('Find friends'),
      onPress: this.onEmptyStatePress,
    };

    return (
      <IMFriendsListComponent
        friendsData={this.props.friendships}
        searchBar={true}
        onSearchBarPress={this.onSearchButtonPress}
        onFriendItemPress={this.onFriendItemPress}
        onFriendAction={this.onFriendAction}
        appStyles={this.appStyles}
        isLoading={this.state.isLoading}
        followEnabled={this.followEnabled}
        emptyStateConfig={emptyStateConfig}
      />
    );
  }
}

IMFriendsScreen.propTypes = {
  friends: PropTypes.array,
  friendships: PropTypes.array,
  searchFriends: PropTypes.func,
  setFriends: PropTypes.func,
};

const mapStateToProps = ({ friends, auth }) => {
  return {
    friendships: friends.friendships,
    friends: friends.friends,
    user: auth.user,
  };
};

export default connect(mapStateToProps, {
  setFriends,
  setFriendships,
})(IMFriendsScreen);
