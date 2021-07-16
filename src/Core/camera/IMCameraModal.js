import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Modal from 'react-native-modalbox';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import IMPreCamera from './IMPreCamera';
import IMPostCamera from './IMPostCamera';
import styles from './styles';

class IMCameraModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: Camera.Constants.Type.back,
      isCameraPlay: true,
      imageSource: '',
    };
    this.cameraRef = React.createRef();
  }

  takePicture = async () => {
    if (this.cameraRef.current) {
      const options = { quality: 0.5, base64: true, pauseAfterCapture: true };
      const data = await this.cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      console.log('takePicture', source);
      if (source) {
        const uri =
          Platform.OS === 'ios' ? source.replace('file://', '') : source;
        this.setState({ imageSource: { uri, mime: 'image' } }, () => {
          this.toggleCameraPlay();
        });
      }
    }
  };

  recordVideo = async () => {
    if (this.cameraRef.current) {
      try {
        const videoRecordPromise = this.cameraRef.current.recordAsync();

        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            const uri =
              Platform.OS === 'ios' ? source.replace('file://', '') : source;
            this.setState({ imageSource: { uri, mime: 'video' } }, () => {
              this.toggleCameraPlay();
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  stopVideoRecording = () => {
    if (this.cameraRef.current) {
      this.cameraRef.current.stopRecording();
    }
  };

  onOpenPhotos = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      return;
    }

    let { uri, type } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    if (uri) {
      this.setState({ imageSource: { uri, mime: type } });
      this.toggleCameraPlay();
    }
  };

  onCameraSwitch = () => {
    this.setState({
      cameraType:
        this.state.cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
    });
  };

  toggleCameraPlay = () => {
    this.setState((prevState) => ({
      isCameraPlay: !prevState.isCameraPlay,
    }));
  };

  onCancelPostCamera = () => {
    this.cameraRef.current.resumePreview();
    this.toggleCameraPlay();
    this.setState({ imageSource: '' });
  };

  onPost = () => {
    this.props.onImagePost(this.state.imageSource);
    this.toggleCameraPlay();
    this.props.onCameraClose();
  };

  onVideoLoadStart = () => {};

  render() {
    const { isCameraOpen, onCameraClose } = this.props;
    return (
      <Modal
        style={styles.container}
        isOpen={isCameraOpen}
        onClosed={onCameraClose}
        position="center"
        swipeToClose
        swipeArea={250}
        coverScreen={true}
        useNativeDriver={false}
        animationDuration={500}>
        <Camera
          ref={this.cameraRef}
          style={styles.preview}
          type={this.state.cameraType}
          flashMode={Camera.Constants.FlashMode.on}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />

        {this.state.isCameraPlay ? (
          <IMPreCamera
            onCameraClose={onCameraClose}
            onCameraSwitch={this.onCameraSwitch}
            takePicture={this.takePicture}
            onOpenPhotos={this.onOpenPhotos}
            record={this.recordVideo}
            stopRecording={this.stopVideoRecording}
          />
        ) : (
          <IMPostCamera
            onCancel={this.onCancelPostCamera}
            imageSource={this.state.imageSource}
            onPost={this.onPost}
            onVideoLoadStart={this.onVideoLoadStart}
          />
        )}
      </Modal>
    );
  }
}

IMCameraModal.propTypes = {
  isCameraOpen: PropTypes.bool,
  onCameraClose: PropTypes.func,
  onImagePost: PropTypes.func,
};

export default IMCameraModal;
