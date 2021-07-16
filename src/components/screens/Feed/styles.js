import { StyleSheet } from 'react-native';
import AppStyles from '../../../AppStyles';

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    feedContainer: {
      flex: 1,
      backgroundColor: AppStyles.colorSet[colorScheme].whiteSmoke,
    },
    emptyStateView: {
      marginTop: 80,
    },
  });
};

export default dynamicStyles;
