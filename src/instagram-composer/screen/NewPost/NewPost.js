import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Text,
  Modal,
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import LocationSelectorModal from '../../components/LocationSelectorModal/LocationSelectorModal';
import NavBar from '../../components/NavBar/NavBar';
import dynamicStyles from './styles';

export default function NewPost(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const { onSharePost, media, visible, onDismiss } = props;
  const textInputRef = useRef();

  const [locationSelectorVisible, setLocationSelectorVisible] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [location, setLocation] = useState({});
  const [locations, setLocations] = useState([]);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const inputValue = useRef('');
  const addressString = useRef('');

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const onShare = () => {
    onSharePost({
      postMedia: media,
      postText: inputValue.current,
      location: addressString.current,
    });
  };

  const onLocationSelectorPress = () => {
    setLocationSelectorVisible(!locationSelectorVisible);
  };

  const onLocationSelectorDone = (address, addresses) => {
    setIsLocationSelected(true);
    setLocationSelectorVisible(!locationSelectorVisible);
    setLocation(address);
    setLocations(addresses);
    addressString.current = getAddressString(location.address_components);
  };

  const onChangeLocation = (address, addresses) => {
    setLocation(address);
    setLocations(addresses);
  };

  const onCancelLocation = () => {
    addressString.current = ' ';
    setIsLocationSelected(false);
  };

  const onLocationSuggestionSelected = (address) => {
    setIsLocationSelected(true);
    setLocation(address);
    addressString.current = getAddressString(address.address_components);
  };

  const onChangeText = (text) => {
    setCaptionText(text);
    inputValue.current = text;
  };

  const getAddressString = (addresses) => {
    let addressString = '';
    if (addresses && addresses.length > 0) {
      addresses.forEach((address, index) => {
        if (index < 2) {
          addressString = addressString + ' ' + address.long_name;
        }
        if (index < 2 && index !== 1 && addresses.length !== 1) {
          addressString = addressString + ',';
        }
      });
    }

    return addressString;
  };

  const renderSuggestedLocationItem = (address, index) => {
    return (
      <TouchableOpacity
        key={index + ''}
        onPress={() => onLocationSuggestionSelected(address)}
        style={styles.suggestedLoationItemContainer}>
        <Text style={styles.suggestedLoationTitle}>
          {getAddressString(address.address_components)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSuggestedLocations = () => {
    return (
      <>
        <View style={[styles.addLocationContainer, styles.centerContainer]}>
          <TouchableOpacity
            onPress={onLocationSelectorPress}
            style={styles.addLocationContainerTitle}>
            <Text style={styles.addLocationTitle}>{'Add location'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onLocationSelectorPress}
            style={styles.addLocationIconContainer}>
            <Image
              style={styles.addLocationIcon}
              source={require('../../assets/icons/arrow-right.png')}
            />
          </TouchableOpacity>
        </View>
        {locations && locations.length > 0 && (
          <ScrollView
            style={styles.suggestedLocationConatainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {locations.map((address, index) =>
              renderSuggestedLocationItem(address, index),
            )}
          </ScrollView>
        )}
      </>
    );
  };

  const renderSelectedLocation = () => {
    return (
      <>
        <View style={[styles.addLocationContainer, styles.centerContainer]}>
          <View style={styles.addLocationContainerTitle}>
            <Text style={styles.locationTitle}>
              {getAddressString(location.address_components)}
            </Text>
            <Text style={styles.locationDetail}>
              {location.formatted_address}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onCancelLocation}
            style={styles.addLocationIconContainer}>
            <Image
              style={styles.cancelIcon}
              source={require('../../assets/icons/cancel.png')}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Modal animationType={'none'} visible={visible} transparent={true}>
      <View style={styles.container}>
        <NavBar
          nextTitle={'Share'}
          prevTitle={'Cancel'}
          mainTitle={'New post'}
          onNext={onShare}
          onPrev={onDismiss}
        />
        <View style={[styles.captionAvatarContainer, styles.centerContainer]}>
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: media[0].uri }} />
          </View>
          <View style={styles.captionContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              multiline={true}
              value={captionText}
              onChangeText={onChangeText}
              placeholder={'Write a caption...'}
            />
          </View>
        </View>
        <View style={styles.locationContainer}>
          {isLocationSelected
            ? renderSelectedLocation()
            : renderSuggestedLocations()}
        </View>
        <LocationSelectorModal
          isVisible={locationSelectorVisible}
          onCancel={onLocationSelectorPress}
          onDone={onLocationSelectorDone}
          onChangeLocation={onChangeLocation}
        />
      </View>
    </Modal>
  );
}
