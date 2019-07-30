import React, {Component} from 'react';
import {Modal} from '../';
import {inject, observer} from 'mobx-react';
import styles from './styles.scss';

@inject('project')
@observer
export default class ConfirmProfessional extends Component {

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
      label: 'Confirm',
      func: this.onSelect
    }
  ]

  render() {
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        Are you sure you want to create a
        <div className={styles.prof}>Professional Vlog?</div>
        Additional charges apply.
      </Modal>
    );
  }
}
