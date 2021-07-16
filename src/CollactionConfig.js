import AppStyles from './AppStyles';
import { IMLocalized, setI18nConfig } from './Core/localization/IMLocalization';

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;

const CollactionConfig = {
  isSMSAuthEnabled: false,
  appIdentifier: 'rn-instagram-android',
  facebookIdentifier: '164604491722220',
  onboardingConfig: {
    welcomeTitle: IMLocalized('Welcome to Collaction'),
    welcomeCaption: IMLocalized('Enter your detail below'),
    walkthroughScreens: [
      {
        icon: require('../assets/images/welcome1.png'),
        title: IMLocalized('Monetize your content'),
        description: IMLocalized('Welcome1'),
      },
      {
        icon: require('../assets/images/welcome2.png'),
        title: IMLocalized('Easy-to-use'),
        description: IMLocalized('Welcome2'),
      },
      {
        icon: require('../assets/images/welcome3.png'),
        title: IMLocalized('Earn with Collaction Ads'),
        description: IMLocalized('Welcome3'),
      },
    ],
  },
  tabIcons: {
    Feed: {
      focus: AppStyles.iconSet.homefilled,
      unFocus: AppStyles.iconSet.homeUnfilled,
    },
    Discover: {
      focus: AppStyles.iconSet.search,
      unFocus: AppStyles.iconSet.search,
    },
    Chat: {
      focus: AppStyles.iconSet.commentFilled,
      unFocus: AppStyles.iconSet.commentUnfilled,
    },
    Friends: {
      focus: AppStyles.iconSet.friendsFilled,
      unFocus: AppStyles.iconSet.friendsUnfilled,
    },
    Profile: {
      focus: AppStyles.iconSet.profileFilled,
      unFocus: AppStyles.iconSet.profileUnfilled,
    },
  },
  tosLink: 'https://collactionapp.com/beta/privacy-and-policy',
  editProfileFields: {
    sections: [
      {
        title: IMLocalized('PUBLIC PROFILE'),
        fields: [
          {
            displayName: IMLocalized('First Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'Your first name',
          },
          {
            displayName: IMLocalized('Last Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: IMLocalized('Your last name'),
          },
        ],
      },
      {
        title: IMLocalized('PRIVATE DETAILS'),
        fields: [
          {
            displayName: IMLocalized('E-mail Address'),
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: IMLocalized('Your email address'),
          },
          {
            displayName: IMLocalized('Phone Number'),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: IMLocalized('Your phone number'),
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('GENERAL'),
        fields: [
          {
            displayName: IMLocalized('Allow Push Notifications'),
            type: 'switch',
            editable: true,
            key: 'push_notifications_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Enable Face ID / Touch ID'),
            type: 'switch',
            editable: true,
            key: 'face_id_enabled',
            value: false,
          },
        ],
      },
      {
        title: IMLocalized('Feed'),
        fields: [
          {
            displayName: IMLocalized('Autoplay Videos'),
            type: 'switch',
            editable: true,
            key: 'autoplay_video_enabled',
            value: true,
          },
          {
            displayName: IMLocalized('Always Mute Videos'),
            type: 'switch',
            editable: true,
            key: 'mute_video_enabled',
            value: true,
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Save'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized('CONTACT'),
        fields: [
          {
            displayName: IMLocalized('Address'),
            type: 'text',
            editable: false,
            key: 'push_notifications_enabled',
            value: '527 W 7th St, Los Angeles, California - USA',
          },
          {
            displayName: IMLocalized('E-mail us'),
            value: 'hello@collactionapp.com',
            type: 'text',
            editable: true,
            key: 'email',
            placeholder: IMLocalized('Your email address'),
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Call Us'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
};

export default CollactionConfig;
