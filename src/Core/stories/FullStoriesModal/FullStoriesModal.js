import React from 'react';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import FullStories from '../FullStories/FullStories';
import styles from './styles';

export default class FullStoriesModal extends React.Component {
  render() {
    const { isModalOpen, onClosed } = this.props;

    return (
      <Modal
        style={styles.container}
        isOpen={isModalOpen}
        onClosed={onClosed}
        position="center"
        swipeToClose
        swipeArea={250}
        coverScreen={true}
        useNativeDriver={Platform.OS === 'android' ? true : false}
        animationDuration={500}>
        <FullStories />
      </Modal>
    );
  }
}

FullStoriesModal.propTypes = {
  isModalOpen: PropTypes.bool,
  onClosed: PropTypes.func,
};
