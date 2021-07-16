import { StyleSheet, Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: WIDTH / 1.31 + 100,
  },
  mediaView: {
    flex: 1,
  },
  adTriggerView: {
    flex: 1,
  },
  adIconViewContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    overflow: 'hidden',
  },
  adIconView: {
    width: 60,
    height: 60,
  },
  headerContainer: {
    paddingLeft: 15,
    paddingBottom: 0,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    padding: 15,
  },
});

export default styles;
