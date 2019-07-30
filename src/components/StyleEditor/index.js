import React, {Component} from 'react';
import {Modal} from '../';
import styles from './styles.scss';
import {Dropdown, Input} from '../../atoms';
import {ColorPicker} from '../../components';
import {pick, head} from 'lodash-es';

const fonts = [
  'Roboto',
  'Anton',
  'Indie Flower',
  'Tinos',
  'Cousine',
];

export default class StyleEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'New style',
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
      font: head(fonts)
    };
  }

  setName = e => this.setState({name: e.target.value})

  setTextColor = color => this.setState({textColor: color})

  setBackgroundColor = color => this.setState({backgroundColor: color})

  setFont = font => () => this.setState({font})

  save = () => {
    this.props.onSave({
      name: this.state.name,
      textcolor: this.state.textColor,
      backgroundcolor: this.state.backgroundColor,
      font: this.state.font
    }).then(this.props.onClose);
  }

    modalActions = [
      {
        label: 'Cancel',
        func: this.props.onClose
      },
      {
        label: 'Save',
        func: this.save
      }
    ]

    renderSelected = font => (
      <div className={styles.font} style={{fontFamily: font}}>
        {font}
      </div>
    )

    renderFont = font => (
      <div key={font} className={styles.font} style={{fontFamily: font}} onClick={this.setFont(font)}>
        {font}
      </div>
    )

    render() {
      const {name, textColor, backgroundColor, font} = this.state;
      return (
        <Modal actions={this.modalActions}>
          <div
            className={styles.preview}
            style={{color: textColor, background: backgroundColor, fontFamily: font}}
          >
          This is some text.
          </div>
          <Input modal name="Style Name" value={name} onChange={this.setName}/>
          <div className={styles.label}>Font</div>
          <Dropdown
            selected={this.state.font && this.renderSelected(this.state.font)}
          >
            {fonts.map(this.renderFont)}
          </Dropdown>
          <ColorPicker className={styles.colorPicker} name="Text Color" value={textColor} onChange={this.setTextColor}/>
          <ColorPicker className={styles.colorPicker} name="Background Color" value={backgroundColor} onChange={this.setBackgroundColor}/>
        </Modal>
      );
    }

}
