import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const filterIconContainerSize = 42;
const playIconContainerSize = 88;
const transparentBackground = 'rgba(255, 255, 255, 0.4)';
const selectContainerMargin = 17;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: selectContainerMargin,
  },
  mediaView: {
    width: '100%',
    height: '100%',
  },
  mediaContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiselectContainer: {
    width: Math.floor(width * 0.8),
    height: '80%',
    marginHorizontal: selectContainerMargin,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowOpacity: 0.55,
    shadowRadius: 14.78,

    elevation: 22,
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    height: playIconContainerSize,
    width: playIconContainerSize,
    borderRadius: Math.floor(playIconContainerSize / 2),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: transparentBackground,
    height: filterIconContainerSize,
    width: filterIconContainerSize,
    borderRadius: Math.floor(filterIconContainerSize / 2),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: Math.floor(filterIconContainerSize * 0.6),
    height: Math.floor(filterIconContainerSize * 0.6),
    tintColor: '#020e17',
  },
  playIcon: {
    width: Math.floor(playIconContainerSize * 0.6),
    height: Math.floor(playIconContainerSize * 0.6),
  },
});

export default styles;
