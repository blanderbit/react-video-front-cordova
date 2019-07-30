import React, {Component} from 'react';
import {noop} from 'lodash-es';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Button extends Component {

  render() {
    const {onClick, text, highlight, disabled, className} = this.props;
    return (
      <div className={classNames(styles.container, highlight && styles.active, className)} onClick={disabled ? noop : onClick}>
        <div className={styles.text}>{text}</div>
      </div>
    );
  }
}
//hoi test dit is mijn eerste commit