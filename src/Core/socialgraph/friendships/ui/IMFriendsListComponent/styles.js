import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    emptyViewContainer: {
      marginTop: height / 5,
    },
  });
};

export default dynamicStyles;
