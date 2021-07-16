import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import IMProfileSettings from '../components/IMProfileSettings/IMProfileSettings';
import { logout } from '../../../onboarding/redux/auth';
import { IMLocalized } from '../../../localization/IMLocalization';
import { Appearance } from 'react-native-appearance';

class IMProfileSettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.appStyles = props.route.params.appStyles;
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = this.appStyles.navThemeConstants[COLOR_SCHEME];
    this.props.navigation.setOptions({
      headerTitle: IMLocalized('Profile Settings'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.lastScreenTitle = this.props.route.params.lastScreenTitle;
    this.appConfig = this.props.route.params.appConfig;
    if (!this.lastScreenTitle) {
      this.lastScreenTitle = 'Profile';
    }
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

  onLogout = () => {
    this.props.logout();
  };

  render() {
    return (
      <IMProfileSettings
        navigation={this.props.navigation}
        onLogout={this.onLogout}
        lastScreenTitle={this.lastScreenTitle}
        user={this.props.user}
        appStyles={this.appStyles}
        appConfig={this.appConfig}
      />
    );
  }
}

IMProfileSettingsScreen.propTypes = {};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {
  logout,
})(IMProfileSettingsScreen);
