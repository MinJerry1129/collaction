import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect, ReactReduxContext } from 'react-redux';
import FriendshipManager from '../../firebase/friendshipManager';
import FriendshipTracker from '../../firebase/tracker';
import { IMFriendsListComponent, FriendshipConstants } from '../..';
import { IMLocalized } from '../../../../localization/IMLocalization';
import { Appearance } from 'react-native-appearance';

class IMAllFriendsScreen extends Component {
  static contextType = ReactReduxContext;

  constructor(props) {
    super(props);
    this.appStyles = this.props.route.params.appStyles;
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = this.appStyles.navThemeConstants[COLOR_SCHEME];
    this.props.navigation.setOptions({
      headerTitle: this.props.route.params.title,
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) => {
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        );
      },
    );
    this.title = this.props.route.params.title;
    this.otherUser = this.props.route.params.otherUser;
    this.followEnabled = this.props.route.params.followEnabled;
    this.includeInbound = this.props.route.params.includeInbound;
    this.includeOutbound = this.props.route.params.includeOutbound;
    this.includeReciprocal = this.props.route.params.includeReciprocal;
    this.stackKeyTitle = 'Profile';
    const keyTitle = this.props.route.params.stackKeyTitle;
    if (keyTitle) {
      this.stackKeyTitle = keyTitle;
    }
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.friendshipTracker = new FriendshipTracker(
      this.context.store,
      this.props.user.id,
      true,
      this.followEnabled,
      true,
    );

    const vieweeID = this.otherUser ? this.otherUser.id : this.props.user.id;
    this.friendshipManager = new FriendshipManager(
      this.followEnabled,
      this.onFriendshipsRetrieved,
    );
    this.friendshipManager.fetchFriendships(vieweeID);

    this.willBlurSubscription = this.props.navigation.addListener(
      'beforeRemove',
      (payload) => {
        this.isBlur = true;
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        );
      },
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription();
    this.willBlurSubscription && this.willBlurSubscription();
    this.friendshipManager && this.friendshipManager.unsubscribe();
  }

  onFriendshipsRetrieved = (
    reciprocalFriendships,
    inboundFriendships,
    outboundFriendships,
  ) => {
    var finalFriendships = [];
    if (this.includeReciprocal) {
      finalFriendships = finalFriendships.concat(reciprocalFriendships);
    }
    if (this.includeInbound) {
      finalFriendships = finalFriendships.concat(inboundFriendships);
    }
    if (this.includeOutbound) {
      finalFriendships = finalFriendships.concat(outboundFriendships);
    }

    this.setState({
      friendships: this.hydrateFriendshipStatusesForCurrentUser(
        finalFriendships,
      ),
      loggedInUserFriendships: this.props.friendships,
      isLoading: false,
    });
  };

  hydrateFriendshipStatusesForCurrentUser = (otherFriendships) => {
    const myFriendships = this.props.friendships;
    return otherFriendships.map((otherFriendship) => {
      const friendship = myFriendships.find(
        (friendship) => friendship.user.id == otherFriendship.user.id,
      );
      const type = friendship ? friendship.type : 'none';
      return {
        user: otherFriendship.user,
        type,
      };
    });
  };

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onFriendAction = (item, index) => {
    if (this.state.isLoading) {
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
    this.setState({ isLoading: true });
    this.friendshipTracker.addFriendRequest(
      this.props.user,
      item.user,
      (response) => {
        this.setState({ isLoading: false });
      },
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

  onFriendItemPress = (item) => {
    const user = item.user || item;
    if (user.id === this.props.user.id) {
      // my own profile
      this.props.navigation.push(this.stackKeyTitle, {
        stackKeyTitle: this.stackKeyTitle,
      });
    } else {
      this.props.navigation.push(this.stackKeyTitle, {
        user,
        stackKeyTitle: this.stackKeyTitle,
      });
    }
  };

  render() {
    const emptyStateConfig = {
      title: IMLocalized('No ') + this.title,
      description: IMLocalized("There's nothing to see here yet."),
    };
    if (
      this.state.friendships &&
      this.state.loggedInUserFriendships &&
      this.state.loggedInUserFriendships != this.props.friendships
    ) {
      // If the current user follows changed since the last rerender (e.g. followed someone)
      this.setState({
        isLoading: false,
        loggedInUserFriendships: this.props.friendships,
        friendships: this.hydrateFriendshipStatusesForCurrentUser(
          this.state.friendships,
        ),
      });
    }

    return (
      <IMFriendsListComponent
        viewer={this.props.user}
        friendsData={this.state.friendships}
        searchBar={false}
        onFriendItemPress={this.onFriendItemPress}
        onFriendAction={this.onFriendAction}
        appStyles={this.appStyles}
        isLoading={this.state.isLoading}
        followEnabled={this.followEnabled}
        displayActions={true}
        emptyStateConfig={emptyStateConfig}
      />
    );
  }
}

const mapStateToProps = ({ friends, auth }) => {
  return {
    friends: friends.friends,
    friendships: friends.friendships,
    user: auth.user,
  };
};

export default connect(mapStateToProps)(IMAllFriendsScreen);
