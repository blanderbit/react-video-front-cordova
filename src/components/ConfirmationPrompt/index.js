import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';

export default class ConfirmationPrompt extends Component {

    onSelect = () => {
      this.props.onSelect();
      this.props.onClose();
    }

    modalActions = [
      {
        label: 'Cancel',
        func: this.props.onClose
      },
      {
        label: 'Proceed',
        func: this.onSelect
      }
    ]

    render() {
      return (
        <Modal className={styles.modal} actions={this.modalActions}>
          {this.props.body}
        </Modal>
      );
    }
}
