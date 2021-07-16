import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    friendItemContainer: {
      padding: 10,
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    chatIconContainer: {
      flex: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    photo: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    name: {
      padding: 10,
      alignSelf: 'center',
      fontSize: 14,
      fontWeight: '500',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    addFlexContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      width: 82,
      height: 26,
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
      marginRight: 25,
    },
    addFlexContainerFollow: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    followButton: {
      width: 115,
      height: 30,
      justifyContent: 'center',
      borderRadius: 6,
      backgroundColor: appStyles.colorSet[colorScheme].mainBtnColor,
      marginRight: 18,
      color: appStyles.colorSet[colorScheme].whiteSmoke,
    },
    followActionTitle: {
      padding: 0,
      alignSelf: 'center',
      fontSize: 14,
      fontWeight: '500',
      color: appStyles.colorSet[colorScheme].whiteSmoke,
    },
    divider: {
      bottom: 0,
      left: 80,
      right: 10,
      position: 'absolute',
      height: 0.5,
      backgroundColor: appStyles.colorSet[colorScheme].hairlineColor,
    },
  });
};

export default dynamicStyles;
