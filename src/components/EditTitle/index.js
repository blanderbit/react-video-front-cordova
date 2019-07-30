import React, {Component} from 'react';
import styles from './styles.scss';
import {StylePicker, Modal, SelectAsset} from '../';
import {Toggle, Input, DurationPicker} from '../../atoms';
import {clamp, isNumber} from 'lodash-es';
import {observer, inject} from 'mobx-react';

@inject('overlay')
@observer
export default class EditTitle extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.title
      ? {...this.props.title}
      : {
        text: '',
        style: null,
        duration: 'auto',
        asset: null
      };
  }

  save = () => {
    this.props.onSave({
      mediatype: 'title',
      text: this.state.text,
      style: this.state.style,
      duration: this.state.duration,
      asset: this.state.asset
    });
    this.props.onClose();
  }

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: this.props.title ? 'Save' : 'Place',
      func: this.save
    }
  ]

  setText = e => this.setState({text: e.target.value})

  setStyle = style => this.setState({style})

  setDuration = duration => this.setState({duration})

  selectAsset = asset => this.setState({asset})

  clearAsset = () => this.setState({asset: null})

  generateExampleStyle = ({textcolor, backgroundcolor, font}) => ({
    color: textcolor,
    backgroundImage: this.state.asset ? `url(${this.state.asset.thumb})` : backgroundcolor,
    fontFamily: font
  })

  renderExample = () => {
    const {text, style} = this.state;
    return (
      <div className={styles.example} style={style ? this.generateExampleStyle(style) : {}}>
        {text}
      </div>
    );
  }

  renderAsset = asset => (
    <div className={styles.asset}>
      <img className={styles.thumb} src={asset.thumb} />
      <div className={styles.meta}>
        <div>{asset.file}</div>
        <div>{asset.type}</div>
      </div>
    </div>
  )

  render() {
    const {text, asset, duration} = this.state;
    const {openOverlay} = this.props.overlay;
    return (
      <Modal className={styles.modal} actions={this.modalActions}>
        {this.renderExample()}
        <div className={styles.label}>Text</div>
        <textarea className={styles.textarea} value={text} onChange={this.setText} placeholder="Enter your text here!" />
        <div className={styles.label}>Style</div>
        <StylePicker
          className={styles.stylePicker}
          onSelect={this.setStyle}
          selected={this.state.style}
        />
        <Toggle
          className={styles.toggle}
          label="Asset Background"
          value={asset}
          onChange={asset
            ? this.clearAsset
            : openOverlay(SelectAsset)({onSave: this.selectAsset, noDuration: true})}
        />
        {asset && this.renderAsset(asset)}
        <DurationPicker value={duration} onChange={this.setDuration}/>
      </Modal>
    );
  }
}
