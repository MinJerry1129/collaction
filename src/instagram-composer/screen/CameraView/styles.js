import { Dimensions, StyleSheet } from 'react-native';

import composerStyle from '../../styles';
const { width } = Dimensions.get('window');

const dynamicStyles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      width,
      backgroundColor:
        composerStyle.colorSet[colorScheme].mainThemeBackgroundColor,
      zIndex: 999,
    },
    mediaView: {
      width: '100%',
      height: '100%',
    },
    mediaViewContainer: {
      flex: 6,
      overflow: 'hidden',
    },
    cameraPreview: {
      width: '100%',
      height: '100%',
    },
    switchContainer: {
      position: 'absolute',
      left: 15,
      bottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    switch: {
      width: 28,
      height: 28,
    },
    controlContainer: {
      flex: 4,
      zIndex: 2,
    },
    cancelContainer: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      bottom: 70,
      alignSelf: 'center',
    },
    cancelTitle: {
      fontSize: 16,
      color: '#ff4d4d',
      paddingLeft: 4,
      fontWeight: '500',
    },
    cancelIcon: {
      width: 14,
      height: 14,
    },
  });
};

export default dynamicStyles;
