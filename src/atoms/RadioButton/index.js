import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';

export default class RadioButton extends Component {

  render() {
    const {onChange, active, render} = this.props;
    return (
      <div className={styles.container} onClick={onChange}>
        {render}
        <FontAwesome className={classNames(styles.check, active && styles.active)} name="check"/>
      </div>
    );
  }
}
