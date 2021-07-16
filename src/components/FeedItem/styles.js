import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles';

const reactionIconSize = Math.floor(AppStyles.WINDOW_WIDTH * 0.09);
const image_Height = Math.floor(AppStyles.WINDOW_WIDTH * 0.995);

const imageWidth = 34;

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      // width: Math.floor(AppStyles.WINDOW_WIDTH * 0.97),
      width: '100%',
      alignSelf: 'center',
      // marginVertical: 3,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    headerContainer: {
      flexDirection: 'row',
    },
    feedImage: {
      height: image_Height,
      width: '100%', 
      justifyContent: 'center', 
      alignItems: 'center',
      alignSelf: 'center'
    },
    bodyImageContainer: {
      height: AppStyles.WINDOW_HEIGHT * 0.5,
    },
    bodyImage: {
      height: '100%',
      width: '100%',
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
    userImage: {
      width: imageWidth,
      height: imageWidth,
      borderRadius: Math.floor(imageWidth / 2),
      borderWidth: 0,
      resizeMode: 'stretch',
    },
    userImageContainer: {
      width: imageWidth,
      height: imageWidth,
      borderWidth: 0,
      margin: 2,
    },
    userImageMainContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flex: 6,
      marginTop: 10,
      justifyContent: 'center',
    },
    mainSubtitleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    subtitleContainer: {
      flex: 1.3,
    },
    title: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 14,
      fontWeight: '600',
    },
    subtitle: {
      color: AppStyles.colorSet[colorScheme].mainSubtextColor,
      fontSize: 11,
    },
    body: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 12,
      lineHeight: 18,
      paddingBottom: 7,
      paddingHorizontal: 12,
    },
    moreText: {
      color: AppStyles.colorSet[colorScheme].mainBtnColor,
      fontSize: 9,
      lineHeight: 18,
      paddingBottom: 15,
      paddingHorizontal: 12,
    },
    moreIconContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    moreIcon: {
      height: 18,
      width: 18,
      tintColor: AppStyles.colorSet[colorScheme].mainSubtextColor,
      margin: 0,
    },
    bodyTitleContainer: {
      marginHorizontal: 8,
    },
    inactiveDot: {
      backgroundColor: 'rgba(255,255,255,.3)',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    activeDot: {
      backgroundColor: '#fff',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    reactionContainer: {
      flexDirection: 'row',
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      position: 'absolute',
      bottom: 2,
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.68),
      height: 48,
      borderRadius: Math.floor(AppStyles.WINDOW_WIDTH * 0.07),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 2,
    },
    reactionIconContainer: {
      margin: 3,
      padding: 0,
      backgroundColor: 'powderblue',
      width: reactionIconSize,
      height: reactionIconSize,
      borderRadius: reactionIconSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reactionIcon: {
      width: reactionIconSize,
      height: reactionIconSize,
      margin: 0,
    },
    footerContainer: {
      flexDirection: 'row',
      flex: 1
    },
    footerIconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    footerIcon: {
      margin: 3,
      height: 20,
      width: 20,
    },
    footerText: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 14,
      fontWeight: '600',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '4%',
    },
    footerSubText: {
      color: AppStyles.colorSet[colorScheme].mainSubtextColor,
      fontSize: 11,
      fontWeight: '600',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginTop: '5%',
    },
    mediaVideoLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    centerItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    soundIconContainer: {
      position: 'absolute',
      backgroundColor: 'transparent',
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    soundIcon: {
      tintColor: '#fff',
      width: 19,
      height: 19,
    },
    tintColor: { tintColor: AppStyles.colorSet[colorScheme].mainTextColor },
  });
};

export default dynamicStyles;
