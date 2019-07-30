import React, {Component} from 'react';
import {Modal, Trimmer, Splitter} from '..';
import classNames from 'classnames';
import styles from './styles.scss';

export default class TrimmerSplitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'trim',
      trimStart: null,
      trimEnd: null,
      splitPoint: null
    };
  }

  onTrim = () => {
    this.props.onTrim({
      ...this.props.video,
      inpoint: this.state.trimStart,
      outpoint: this.state.trimEnd,
      trimmed: this.state.trimStart !== this.props.video.inpoint || this.state.trimEnd !== this.props.video.outpoint
    });
    this.props.onClose();
  }

  onSplit = () => {
    this.props.onSplit(this.state.splitPoint);
    this.props.onClose();
  }

  toggleMode = () => this.setState({mode: this.state.mode === 'trim' ? 'split' : 'trim'})

  setTrim = (trimStart, trimEnd) => this.setState({trimStart, trimEnd})

  setSplit = splitPoint => this.setState({splitPoint})

  getModalActions = () => [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: this.state.mode === 'trim' ? 'Trim' : 'Split',
      func: this.state.mode === 'trim' ? this.onTrim : this.onSplit
    }
  ]

  render() {
    const {mode} = this.state;
    const {video} = this.props;
    const trimming = mode === 'trim';
    return (
      <Modal className={styles.modal} contentClassName={styles.content} actions={this.getModalActions()}>
        <div className={styles.modeSelector} onClick={this.toggleMode}>
          <div className={classNames(styles.trimMode, trimming && styles.active)}>Trim</div>
          <div className={classNames(styles.splitMode, !trimming && styles.active)}>Split</div>
        </div>
        {mode === 'trim'
          ? <Trimmer video={video} onChange={this.setTrim}/>
          : <Splitter video={video} onChange={this.setSplit}/>
        }
      </Modal>
    );
  }
}
