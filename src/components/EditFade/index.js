import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';
import classNames from 'classnames';
import {Input} from '../../atoms';

const fades = [
  {
    name: 'Fade-In',
    desc: 'Smoothly fade in your media.',
    type: 'fadein'
  },
  {
    name: 'Fade-Out',
    desc: 'Smoothly fade out your media.',
    type: 'fadeout'
  },
  {
    name: 'Fade-Out / Fade-In',
    desc: 'Slowly transition between media by fading out, then in.',
    type: 'fadeoutin'
  },
  {
    name: 'Crossfade',
    desc: 'Fade out media while other media fades in.',
    type: 'crossfade'
  }
];

const defState = {
  type: 'crossfade',
  duration: 2,
  color: 'black'
};

export default class EditFade extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.fade
      ? {
        type: this.props.fade.mediatype,
        duration: this.props.fade.duration,
        color: this.props.fade.color
      }
      : defState;
  }

  save = () => {
    this.props.onSave({
      mediatype: this.state.type,
      duration: this.state.duration,
      color: this.state.color
    });
    this.props.onClose();
  }

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: this.props.fade ? 'Save' : 'Place',
      func: this.save
    }
  ]

  setType = type => () => this.setState({type})

  setDuration = e => this.setState({duration: e.target.value})

  toggleColor = () => this.setState({color: this.state.color === 'white' ? 'black' : 'white'})

  renderFade = ({name, desc, type}) => (
    <div
      key={name}
      className={classNames(styles.fade, this.state.type === type && styles.active)}
      onClick={this.setType(type)}
    >
      <div className={styles.name}>{name}</div>
      <div className={styles.desc}>{desc}</div>
    </div>
  )

  render() {
    const {color, duration} = this.state;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        <div className={styles.option}>Fade Type</div>
        <div className={styles.fades}>
          {fades.map(this.renderFade)}
        </div>
        <div className={styles.option}>Fade Color</div>
        <div className={styles.colorPicker}>
          <div
            className={classNames(styles.color, styles.black, color === 'black' && styles.active)}
            onClick={this.toggleColor}
          >
            Black
          </div>
          <div
            className={classNames(styles.color, styles.white, color === 'white' && styles.active)}
            onClick={this.toggleColor}
          >
            White
          </div>
        </div>
        <div className={styles.duration}>
          <div>Duration:</div>
          <Input className={styles.input} modal value={duration} onChange={this.setDuration} type="number" min={1} max={5} step={0.1}/>
          <div>seconds</div>
        </div>
      </Modal>
    );
  }
}
