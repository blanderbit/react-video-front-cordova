import React, {Component} from 'react';
import {Modal} from '..';
import {Input} from '../../atoms';
import styles from './styles.scss';

export default class SaveTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    };
  }

    onSave = () => {
      this.props.onSave({...this.state});
      this.props.onClose();
    }

    setProperty = property => e => {
      if (e) {
        this.setState({[property]: e.target.value});
      }
    }

    modalActions = [
      {
        label: 'Cancel',
        func: this.props.onClose
      },
      {
        label: 'Save',
        func: this.onSave
      }
    ]

    render() {
      const {title} = this.state;
      return (
        <Modal actions={this.modalActions}>
          <div>Template Title</div>
          <Input modal value={title} onChange={this.setProperty('title')} />
        </Modal>
      );
    }
}
