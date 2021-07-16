import { Dimensions, StyleSheet } from 'react-native';

import composerStyle from '../../styles';
const { width } = Dimensions.get('window');

const avatarSize = 80;

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        composerStyle.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    centerContainer: {
      alignSelf: 'center',
      width: '90%',
    },
    captionAvatarContainer: {
      flexDirection: 'row',
      paddingVertical: 20,
    },
    avatarContainer: {
      flex: 2,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
    },
    captionContainer: {
      flex: 6,
    },
    textInput: {
      color: composerStyle.colorSet[colorScheme].mainTextColor,
      fontSize: 18,
      paddingTop: 10,
      textAlignVertical: 'top',
      height: avatarSize * 1.1,
    },

    locationContainer: {
      paddingVertical: 9,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: composerStyle.colorSet[colorScheme].hairlineColor,
    },
    addLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addLocationContainerTitle: {
      flex: 6,
    },
    addLocationTitle: {
      fontSize: 17,
      paddingVertical: 8,
      color: composerStyle.colorSet[colorScheme].mainTextColor,
    },
    locationTitle: {
      color: composerStyle.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      paddingVertical: 3,
    },
    locationDetail: {
      color: composerStyle.colorSet[colorScheme].subTextColor,
      fontSize: 17,
    },
    suggestedLoationTitle: {
      color: composerStyle.colorSet[colorScheme].mainTextColor,
    },
    addLocationIconContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    addLocationIcon: {
      width: 16,
      height: 16,
    },
    cancelIcon: {
      width: 9,
      height: 9,
    },

    suggestedLocationConatainer: {
      marginTop: 19,
      paddingLeft: 20,
    },
    suggestedLoationItemContainer: {
      backgroundColor: composerStyle.colorSet[colorScheme].borderColor,
      borderRadius: 7,
      padding: 8,
      marginRight: 10,
    },
    buttonText: {
      fontSize: 17,
      paddingHorizontal: 18,
      color: composerStyle.colorSet[colorScheme].mainTextColor,
      fontWeight: '400',
    },
    blueText: {
      color: '#3d8fe1',
    },
  });
};

export default dynamicStyles;
