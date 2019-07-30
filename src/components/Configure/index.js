import React, {Component} from 'react';
import {Modal, AddOverlay, EditSound} from '../';
import {pick} from 'lodash-es';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('overlay')
@observer
export default class Configure extends Component {

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Done',
      func: this.props.onClose
    }
  ]

  options = [
    {
      name: 'Overlay',
      desc: '',
      func: this.props.overlay.openOverlay(AddOverlay)({...this.props, onClose: this.props.overlay.destroyOverlay})
    },
    {
      name: 'Sound',
      desc: '',
      func: this.props.overlay.openOverlay(EditSound)({...this.props, onClose: this.props.overlay.destroyOverlay})
    },
  ]

  renderOption = ({name, desc, func}) => (
    <div key={name} className={styles.option} onClick={func}>
      <div className={styles.name}>{name}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  )

  render() {
    return (
      <Modal actions={this.modalActions}>
        <div className={styles.options}>
          {this.options.map(this.renderOption)}
        </div>
      </Modal>
    );
  }
}
