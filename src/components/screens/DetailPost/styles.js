import { StyleSheet } from 'react-native';
import AppStyles from '../../../AppStyles';

const commentItemHeight = 80;
const commentBodyPaddingLeft = 8;

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    detailPostContainer: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    commentItemContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
      marginVertical: 2,
    },
    commentItemImageContainer: {
      flex: 1,
      alignItems: 'center',
    },
    commentItemImage: {
      height: 36,
      width: 36,
      borderRadius: 18,
      marginVertical: 5,
      marginLeft: 5,
    },
    commentItemBodyContainer: {
      flex: 5,
    },
    commentItemBodyRadiusContainer: {
      width: Math.floor(AppStyles.WINDOW_WIDTH * 0.71),
      padding: 7,
      borderRadius: Math.floor(AppStyles.WINDOW_WIDTH * 0.03),
      margin: 5,
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
    commentItemBodyTitle: {
      fontSize: 12,
      fontWeight: '500',
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
      paddingLeft: commentBodyPaddingLeft,
      lineHeight: 12,
    },
    commentItemBodySubtitle: {
      fontSize: 12,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      paddingVertical: 3,
      paddingLeft: commentBodyPaddingLeft,
    },
    commentInputContainer: {
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
      flexDirection: 'row',
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    commentTextInputContainer: {
      flex: 6,
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
      height: '90%',
      width: '90%',
      marginLeft: 8,
      justifyContent: 'center',
    },
    commentTextInput: {
      padding: 8,
      color: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    commentInputIconContainer: {
      flex: 0.7,
      justifyContent: 'center',
      marginLeft: 8,
    },
    commentInputIcon: {
      height: 22,
      width: 22,
      tintColor: AppStyles.colorSet[colorScheme].mainTextColor,
    },
    placeholderTextColor: {
      color: AppStyles.colorSet[colorScheme].mainTextColor,
    },
  });
};

export default dynamicStyles;
