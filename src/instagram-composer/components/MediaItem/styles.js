import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const multiSelectIndicatorSize = 22;

const styles = StyleSheet.create({
  mediaItemContainer: {
    width: width / 4,
    height: width / 4,
    padding: 1,
  },
  mediaItem: {
    width: '100%',
    height: '100%',
  },
  multiSelectIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    height: multiSelectIndicatorSize,
    width: multiSelectIndicatorSize,
    borderRadius: Math.floor(multiSelectIndicatorSize / 2),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  multiCount: {
    fontSize: Math.floor(multiSelectIndicatorSize * 0.7),
    fontWeight: '500',
    color: '#fff',
  },
});

export default styles;
