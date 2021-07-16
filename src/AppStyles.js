import { Platform, Dimensions, I18nManager } from 'react-native';
import TNColor from './Core/truly-native/TNColor';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const lightColorSet = {
  mainThemeBackgroundColor: '#ffffff',
  mainThemeForegroundColor: '#7C37A6',
  primaryTextColor: '#7C37A6',
  secondaryTextColor: '#000000',
  mainBtnColor: '#7C37A6',
  mainTextColor: '#151723',
  mainSubtextColor: '#7e7e7e',
  hairlineColor: '#e0e0e0',
  grey0: '#eaeaea',
  grey3: '#e6e6f2',
  grey6: '#d6d6d6',
  grey9: '#939393',
  subHairlineColor: '#f2f2f3',
  tint: '#1A1A1A',
  facebook: '#4267b2',
  grey: 'grey',
  whiteSmoke: '#f5f5f5',
  headerStyleColor: '#ffffff',
  headerTintColor: '#7C37A6',
  bottomStyleColor: '#ffffff',
  bottomTintColor: 'grey',
  mainButtonColor: '#e8f1fd',
  subButtonColor: '#eaecf0',
  tabColor: '#ffffff',
};

const darkColorSet = {
  mainThemeBackgroundColor: '#121212',
  primaryTextColor: '#7C37A6',
  secondaryTextColor: '#ffffff',
  mainTextColor: '#ffffff',
  mainSubtextColor: '#f5f5f5',
  hairlineColor: '#222222',
  grey0: TNColor('#eaeaea'),
  grey3: TNColor('#e6e6f2'),
  grey6: TNColor('#d6d6d6'),
  grey9: TNColor('#939393'),
  tint: '#1A1A1A',
  facebook: '#4267b2',
  grey: 'grey',
  whiteSmoke: '#222222',
  bottomTintColor: 'lightgrey',
  mainButtonColor: '#062246',
  subButtonColor: '#20242d',
  mainThemeForegroundColor: '#FFFFFF',
  grey0: TNColor('#eaeaea'),
  grey3: TNColor('#e6e6f2'),
  grey6: TNColor('#d6d6d6'),
  grey9: TNColor('#939393'),
  subHairlineColor: TNColor('#f2f2f3'),
  grey: 'grey',
  headerStyleColor: TNColor('#ffffff'),
  headerTintColor: TNColor('#7C37A6'),
  bottomStyleColor: TNColor('#ffffff'),
  tabColor: TNColor('#ffffff'),
};

const colorSet = {
  light: lightColorSet,
  dark: darkColorSet,
  'no-preference': lightColorSet,
};

const navLight = {
  backgroundColor: '#fff',
  fontColor: '#000',
  secondaryFontColor: '#7e7e7e',
  activeTintColor: '#1A1A1A',
  inactiveTintColor: '#ccc',
  hairlineColor: '#e0e0e0',
};

const navDark = {
  backgroundColor: '#121212',
  fontColor: '#fff',
  secondaryFontColor: '#fff',
  activeTintColor: '#1A1A1A',
  inactiveTintColor: '#888',
  hairlineColor: '#222222',
};

const navThemeConstants = {
  light: navLight,
  dark: navDark,
  main: '#1A1A1A',
  'no-preference': navLight,
};

const imageSet = {
  boederImgSend: require('../assets/images/borderImg1.png'),
  boederImgReceive: require('../assets/images/borderImg2.png'),
  textBoederImgSend: require('../assets/images/textBorderImg1.png'),
  textBoederImgReceive: require('../assets/images/textBorderImg2.png'),
  chat: require('../assets/images/chat.png'),
  file: require('../assets/images/file.png'),
  like: require('../assets/images/like.png'),
  notification: require('../assets/images/notification.png'),
  photo: require('../assets/images/photo.png'),
  pin: require('../assets/images/pin.png'),
};

const iconSet = {
  logo: require('../assets/images/logo.png'),
  shield: require('../assets/icons/shield.png'),
  welcome: require('../assets/images/welcome4.png'),
  userAvatar: require('./CoreAssets/default-avatar.png'),
  backArrow: require('./CoreAssets/arrow-back-icon.png'),
  menuHamburger: require('../assets/icons/menu-hamburger.png'),
  homeUnfilled: require('../assets/icons/home-unfilled.png'),
  homefilled: require('../assets/icons/home-filled.png'),
  search: require('../assets/icons/search.png'),
  magnifier: require('../assets/icons/magnifier.png'),
  commentUnfilled: require('../assets/icons/comment-unfilled.png'),
  commentFilled: require('../assets/icons/comment-filled.png'),
  friendsUnfilled: require('../assets/icons/friends-unfilled.png'),
  friendsFilled: require('../assets/icons/friends-filled.png'),
  profileUnfilled: require('../assets/icons/profile-unfilled.png'),
  profileFilled: require('../assets/icons/profile-filled.png'),
  camera: require('../assets/icons/camera.png'),
  cameraFilled: require('../assets/icons/camera-filled.png'),
  inscription: require('../assets/icons/inscription.png'),
  more: require('../assets/icons/more.png'),
  send: require('../assets/icons/send.png'),
  pinpoint: require('../assets/icons/pinpoint.png'),
  checked: require('../assets/icons/checked.png'),
  bell: require('../assets/icons/bell.png'),
  surprised: require('../assets/icons/wow.png'),
  laugh: require('../assets/icons/crylaugh.png'),
  cry: require('../assets/icons/crying.png'),
  thumbsupUnfilled: require('../assets/icons/thumbsup-unfilled.png'),
  heartUnfilled: require('../assets/icons/heart-unfilled.png'),
  like: require('../assets/icons/blue-like.png'),
  love: require('../assets/icons/red-heart.png'),
  angry: require('../assets/icons/anger.png'),
  cameraRotate: require('../assets/icons/camera-rotate.png'),
  playButton: require('../assets/icons/play-button.png'),
  logout: require('../assets/icons/logout-drawer.png'),
  filledHeart: require('../assets/icons/filled-heart.png'),
  sound: require('../assets/icons/sound.png'),
  soundMute: require('../assets/icons/sound_mute.png'),
  videoCamera: require('../assets/icons/video-camera.png'),
  libraryLandscape: require('../assets/icons/library-landscape.png'),
};

const fontFamily = {
  boldFont: '',
  semiBoldFont: '',
  regularFont: '',
  mediumFont: '',
  lightFont: '',
  extraLightFont: '',
};

const fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 16,
  small: 13,
  xsmall: 11,
  title: 30,
  content: 20,
};

const loadingModal = {
  color: '#FFFFFF',
  size: 20,
  overlayColor: 'rgba(0,0,0,0.5)',
  closeOnTouch: false,
  loadingType: 'Spinner', // 'Bubbles', 'DoubleBounce', 'Bars', 'Pulse', 'Spinner'
};

const sizeSet = {
  buttonWidth: '70%',
  inputWidth: '80%',
  radius: 25,
};

const styleSet = {
  menuBtn: {
    container: {
      backgroundColor: colorSet.grayBgColor,
      borderRadius: 22.5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    icon: {
      tintColor: 'black',
      width: 15,
      height: 15,
    },
  },
  searchBar: {
    container: {
      marginLeft: Platform.OS === 'ios' ? 30 : 0,
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      flex: 1,
    },
    input: {
      backgroundColor: colorSet.inputBgColor,
      borderRadius: 10,
      color: 'black',
    },
  },
  rightNavButton: {
    marginRight: 10,
  },
  borderRadius: {
    main: 25,
    small: 5,
  },
  textInputWidth: {
    main: '80%',
  },
  backArrowStyle: {
    resizeMode: 'contain',
    tintColor: '#7C37A6',
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginLeft: 10,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
};

const StyleDict = {
  imageSet,
  iconSet,
  fontFamily,
  colorSet,
  navThemeConstants,
  fontSet,
  sizeSet,
  styleSet,
  loadingModal,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
};

export default StyleDict;
