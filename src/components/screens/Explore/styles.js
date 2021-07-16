import { StyleSheet } from 'react-native';
import AppStyles from '../../../AppStyles';

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      backgroundColor: AppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    feedContainer: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
  });
};

export default dynamicStyles;
