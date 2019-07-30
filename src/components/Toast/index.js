import React, {Component} from 'react';
import styles from './styles.scss';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import {observer, inject} from 'mobx-react';

@inject('overlay')
@observer
export default class Toast extends Component {

  render() {
    const active = this.props.overlay.toastActive;
    const onClose = this.props.overlay.hideToast;
    const children = this.props.overlay.toastContent;
    return (
      <div className={classNames(styles.container, active && styles.active)}>
        <div className={styles.content}>
          {children}
        </div>
        <FontAwesome className={styles.close} name="times" onClick={onClose} />
      </div>
    );
  }
}
