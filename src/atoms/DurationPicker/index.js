import React, {Component} from 'react';
import {Input} from '../';
import FontAwesome from 'react-fontawesome';
import {isNumber} from 'lodash-es';
import classNames from 'classnames';
import styles from './styles.scss';

export default class DurationPicker extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      inputHeight: 0
    };
  }

  componentDidMount() {
    this.setState({inputHeight: this.inputRef.current.offsetHeight});
  }

    onChange = e => {
      e.stopPropagation();
      this.props.onChange(parseFloat(e.target.value));
    }

    onKeyDown = e => e.keyCode === 8 && this.props.onChange('auto');

    increment = () => this.props.value + 0.1 <= 10 && this.props.onChange(this.props.value + 0.1)

    decrement = () => this.props.value - 0.1 >= 0.2 && this.props.onChange(this.props.value - 0.1)

    render() {
      const {className, value} = this.props;
      const {inputHeight} = this.state;
      return (
        <div className={styles.container}>
          <Input
            modal
            inputRef={this.inputRef}
            className={classNames(styles.input, className)}
            value={isNumber(value) ? value.toFixed(1) : ''}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            name="Duration (seconds)"
            placeholder="(Leave blank for auto)"
          />
          <div className={styles.controls} style={{height: `${inputHeight}px`}}>
            <FontAwesome name="chevron-up" onClick={this.increment}/>
            <FontAwesome name="chevron-down" onClick={this.decrement}/>
          </div>
        </div>
      );
    }
}
