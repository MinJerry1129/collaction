import React, { useEffect, useState } from 'react';
import { View, Image, FlatList } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import CameraRoll from '@react-native-community/cameraroll';
import MediaItem from '../../components/MediaItem/MediaItem';
import Filters from '../../components/Filters/Filters';
import dynamicStyles from './styles';

export default function MediaFilterView(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const { isFilterEnable, onImageFilter } = props;
  const [photos, setPhotos] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState('');
  const [filterableImage, setFilterableImage] = useState('');

  useEffect(() => {
    CameraRoll.getPhotos({
      first: 100,
      assetType: 'All',
    })
      .then((r) => {
        setPhotos(r.edges);
        setSelectedMedia(r.edges[0].node.image.uri);
        setFilterableImage(r.edges[0].node.image.uri);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onMediaItemPress = ({ item }) => {
    setSelectedMedia(item.node.image.uri);
    setFilterableImage(item.node.image.uri);
  };

  const renderItem = ({ item, index }) => (
    <MediaItem onPress={onMediaItemPress} item={item} index={index} />
  );

  const onFliterImage = (uri) => {
    setSelectedMedia(uri);
    onImageFilter(uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaViewContainer}>
        <Image style={styles.mediaView} source={{ uri: selectedMedia }} />
      </View>
      <View style={styles.mediaContainer}>
        <Filters image={filterableImage} onFliterImage={onFliterImage} />
      </View>
    </View>
  );
}
