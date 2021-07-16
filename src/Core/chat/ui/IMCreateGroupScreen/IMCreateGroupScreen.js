import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import TextButton from 'react-native-button';
import { connect } from 'react-redux';
import { IMCreateGroupComponent } from '../..';
import { channelManager } from '../../firebase';
import { IMLocalized } from '../../../localization/IMLocalization';
import { Appearance } from 'react-native-appearance';

class IMCreateGroupScreen extends Component {
  constructor(props) {
    super(props);
    let appStyles = this.props.route.params.appStyles;
    let theme = Appearance.getColorScheme();
    let currentTheme = appStyles.navThemeConstants[theme];
    this.props.navigation.setOptions({
      headerTitle: IMLocalized('Choose People'),
      headerRight:
        this.props.friends.length > 1 != null
          ? () => (
              <TextButton
                style={{ marginHorizontal: 7 }}
                onPress={this.onCreate}>
                {IMLocalized('Create')}
              </TextButton>
            )
          : () => <View />,
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.appStyles = this.props.route.params.appStyles;
    this.state = {
      friends: this.props.friends,
      isNameDialogVisible: false,
      groupName: '',
    };
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

  onCreate = () => {
    const checkedFriends = this.state.friends.filter(
      (friend) => friend.checked,
    );
    if (checkedFriends.length === 0) {
      alert('Please choose at least two friends.');
    } else {
      this.setState({ isNameDialogVisible: true });
    }
  };

  onCheck = (friend) => {
    friend.checked = !friend.checked;
    const newFriends = this.state.friends.map((item) => {
      if (item.id == friend.id) {
        return friend;
      }
      return item;
    });
    this.setState({ friends: newFriends });
  };

  onCancel = () => {
    this.setState({
      groupName: '',
      isNameDialogVisible: false,
      friends: this.props.friends,
    });
  };

  onSubmitName = (name) => {
    const self = this;
    const { friends } = this.state;
    const participants = friends.filter((friend) => friend.checked);
    if (participants.length < 2) {
      alert(IMLocalized('Choose at least 2 friends to create a group.'));
      return;
    }
    channelManager
      .createChannel(self.props.user, participants, name)
      .then((response) => {
        if (response.success == true) {
          self.onCancel();
          self.props.navigation.goBack();
        }
      });
  };

  onEmptyStatePress = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <IMCreateGroupComponent
        onCancel={this.onCancel}
        isNameDialogVisible={this.state.isNameDialogVisible}
        friends={this.state.friends}
        onSubmitName={this.onSubmitName}
        onCheck={this.onCheck}
        appStyles={this.appStyles}
        onEmptyStatePress={this.onEmptyStatePress}
      />
    );
  }
}

IMCreateGroupScreen.propTypes = {
  friends: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = ({ friends, auth }) => {
  return {
    friends: friends.friends,
    user: auth.user,
  };
};

export default connect(mapStateToProps)(IMCreateGroupScreen);
