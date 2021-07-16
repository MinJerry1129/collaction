import { Platform, StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    searchBarContainer: {
      height: 70,
      paddingVertical: 5,
      ...ifIphoneX(
        {
          marginTop: 45,
        },
        {
          marginTop: 12,
        },
      ),
      ...Platform.select({
        ios: {
          borderBottomWidth: 0.5,
          borderBottomColor: appStyles.colorSet[colorScheme].hairlineColor,
        },
        android: {
          marginHorizontal: 12,
        },
        default: {},
      }),
    },
  });
};

export default dynamicStyles;
