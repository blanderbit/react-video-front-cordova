import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {noop} from 'lodash-es';
import styles from './styles.scss';
import classNames from 'classnames';

@withRouter
export default class Header extends Component {

  render() {
    const {routeObj, className} = this.props;
    if(!routeObj.header) {
      return null;
    }
    const {left, center, right} = routeObj.header;
    return (
      <div className={classNames(styles.container, className)}>
        <div className={styles.left} onClick={left ? left.props.onClick : noop}>{left}</div>
        <div className={styles.title} onClick={center ? center.props.onClick : noop}>{center || routeObj.name}</div>
        <div className={styles.right} onClick={right ? right.props.onClick : noop}>{right}</div>
      </div>
    );
  }
}
