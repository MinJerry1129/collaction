import { Dimensions, StyleSheet } from 'react-native';

import composerStyle from '../../styles';

const { width } = Dimensions.get('window');

const styles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      width,
      backgroundColor:
        composerStyle.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    mediaViewContainer: {
      flex: 6,
    },
    mediaView: {
      width: '100%',
      height: '100%',
    },
    mediaContainer: {
      flex: 4,
      // alignItems: 'center',
    },
  });
};

export default styles;
