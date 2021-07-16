import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const shutterCircleSize = Math.floor(width * 0.2);
const shutterSize = Math.floor(shutterCircleSize * 0.7);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    justifyContent: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: '11%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  infoContainer: {
    position: 'absolute',
    top: '16%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#edf2f7',
    padding: 7,
    borderRadius: 7,
  },
  info: {
    fontSize: 16,
    color: '#737373',
  },

  indicator: {
    backgroundColor: '#fb171b',
    width: 4,
    height: 4,
    borderRadius: 4 / 2,
    marginRight: 4,
  },
  timer: {},
  controlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    // marginTop: 50,
  },
  shutterCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#aeafae',
    width: shutterCircleSize,
    height: shutterCircleSize,
    borderRadius: shutterCircleSize / 2,
  },
  shutterContainer: {
    backgroundColor: '#dadada',
    width: shutterSize,
    height: shutterSize,
    borderRadius: shutterSize / 2,
  },
});

export default styles;
