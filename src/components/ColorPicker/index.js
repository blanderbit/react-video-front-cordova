import React, {Component} from 'react';
import classNames from 'classnames';
import {chunk, startsWith} from 'lodash-es';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

const colors = [
  '#000000',
  '#888888',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
];

export default class ColorPicker extends Component {

  constructor(props) {
    super(props);
    this.hexRef = React.createRef();
    this.state = {
      isOpen: false,
      hexFocus: false,
    };
  }

  toggleOpen = () => this.setState({isOpen: !this.state.isOpen})

  close = () => {
    this.setState({isOpen: false});
    this.hexRef.current.blur();
  }

  focusHex = () => this.setState({hexFocus: true});

  blurHex = () => this.setState({hexFocus: false, isOpen: false});

  handleHex = e => {
    const withHekkie = startsWith(e.target.value, '#') ? e.target.value : '#';
    const limited = withHekkie.substring(0, 7);
    this.props.onChange(limited);
  }

  handleEnter = e => e.keyCode === 13 && this.close()

  setColor = color => () => {
    this.props.onChange(color);
    this.close();
  }

  renderColor = color =>
    <div key={color}
      className={classNames(styles.color, this.props.value === color && styles.active)}
      onClick={this.setColor(color)}
      style={{background: color}}
    />

  renderColorRow = (colors, i) =>
    <div key={`colorgroup-${i}`} className={styles.colorRow}>
      {colors.map(this.renderColor)}
    </div>

  render() {
    const {name, value, className} = this.props;
    const {isOpen, hexFocus} = this.state;
    const colorGroups = chunk(colors, 3);
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.header} onClick={this.toggleOpen}>
          <div>
            <div className={styles.collapser} style={{background: value}}>
              <FontAwesome className={styles.icon} name={isOpen ? 'minus' : 'plus'}/>
            </div>
            <div>{name || 'Color'}</div>
          </div>
          <input ref={this.hexRef} className={classNames(styles.hex, hexFocus && styles.active)} value={value} onChange={this.handleHex} onKeyUp={this.handleEnter} placeholder="HEX..." onFocus={this.focusHex} onBlur={this.blurHex}/>
        </div>
        <div className={classNames(styles.content, isOpen && styles.active)}>
          {colorGroups.map(this.renderColorRow)}
        </div>
      </div>
    );
  }
}
