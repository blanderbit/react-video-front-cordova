import React, {Component} from 'react';
import {Toggle} from '../../atoms';
import {Modal} from '../';
import {inject, observer} from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';

@inject('project')
@observer
export default class EditSound extends Component {
  constructor(props) {
    super(props);
    this.state = props.video.sound
      ? {...props.video.sound}
      : {
        music: false,
        clipaudio: true,
        applyToAll: false
      };
  }

  save = () => {
    if (this.state.applyToAll) {
      this.props.onSaveAll({
        sound: {
          music: this.state.music,
          clipaudio: this.state.clipaudio
        }
      });
    } else {
      this.props.onSave({
        sound: {
          music: this.state.music,
          clipaudio: this.state.clipaudio
        }
      });
    }
    this.props.onClose();
  }
  getModalActions = () => [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Save',
      func: this.save,
      disable: this.state.music && !this.props.project.song
    }
  ]

  toggleMusic = () => this.setState({music: !this.state.music})

  toggleClipAudio = () => this.setState({clipaudio: !this.state.clipaudio})

  toggleApplyToAll = () => this.setState({applyToAll: !this.state.applyToAll})

  render() {
    const songSelected = Boolean(this.props.project.song);
    const {music, clipaudio, applyToAll} = this.state;
    return (
      <Modal className={styles.modal} actions={this.getModalActions()}>
        <div className={styles.row}>
          <FontAwesome className={classNames(styles.icon, music && styles.active, !songSelected && styles.disabled)} name="music" onClick={this.toggleMusic} />
          <FontAwesome className={classNames(styles.icon, clipaudio && styles.active)} name="microphone" onClick={this.toggleClipAudio} />
        </div>
        {!songSelected && <div className={styles.label}>Select a song in the vlog menu <FontAwesome className={styles.tinyIcon} name="bars" /> to enable the music setting.</div>}
        <Toggle label="Apply this configuration to all media in this vlog?" value={applyToAll} onChange={this.toggleApplyToAll} />
      </Modal>
    );
  }
}
