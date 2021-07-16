import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    paddingHorizontal: 18,
    color: '#000',
    fontWeight: '400',
  },
  disableButtonText: {
    color: '#8c8c8c',
  },
  disableButtonContainer: {
    display: 'none',
  },
  blueText: {
    color: '#3d8fe1',
  },
});

export default styles;
