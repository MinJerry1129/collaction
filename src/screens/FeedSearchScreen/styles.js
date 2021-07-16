import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    searchBarContainer: {
      width: '100%',
      paddingVertical: 5,
      ...ifIphoneX(
        {
          marginTop: 45,
        },
        {
          marginTop: 12,
        },
      ),
      borderBottomWidth: 0.5,
      borderBottomColor: appStyles.colorSet[colorScheme].hairlineColor,
    },
  });
};

export default dynamicStyles;
