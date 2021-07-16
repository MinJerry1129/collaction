import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import composerStyle from '../../styles';

const styles = (colorScheme) => {
  return new StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        composerStyle.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    //
    navBarContainer: {
      flexDirection: 'row',
      position: 'absolute',
      justifyContent: 'center',
      ...ifIphoneX(
        {
          top: 50,
        },
        {
          top: 12,
        },
      ),
      paddingVertical: 10,
      // height: 25,
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor:
        composerStyle.colorSet[colorScheme].mainThemeBackgroundColor,
      zIndex: 1,
    },
    navBarTitleContainer: {
      flex: 5,
    },
    leftButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 14,
      color: composerStyle.colorSet[colorScheme].mainThemeForegroundColor,
      fontWeight: '600',
    },
    // GooglePlacesAutocomplete
    placesAutocompleteContainer: {
      ...ifIphoneX(
        {
          marginTop: 46,
        },
        {
          marginTop: 50,
        },
      ),
      height: '50%',
      backgroundColor: composerStyle.colorSet[colorScheme].whiteSmoke,
    },
    placesAutocompleteTextInputContainer: {
      width: '100%',
      backgroundColor: composerStyle.colorSet[colorScheme].hairlineColor,
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
    placesAutocompleteTextInput: {
      backgroundColor:
        composerStyle.colorSet[colorScheme].mainThemeBackgroundColor,
      color: composerStyle.colorSet[colorScheme].mainTextColor,
    },
    placesAutocompletedDescription: {
      fontWeight: '400',
      color: composerStyle.colorSet[colorScheme].mainSubtextColor,
    },
    predefinedPlacesDescription: {
      color: composerStyle.colorSet[colorScheme].mainSubtextColor,
    },
    predefinedPlacesPoweredContainer: {
      backgroundColor:
        composerStyle.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    mapContainer: {
      width: '100%',
      height: '39%',
      backgroundColor: composerStyle.colorSet[colorScheme].whiteSmoke,
    },
  });
};

export default styles;
