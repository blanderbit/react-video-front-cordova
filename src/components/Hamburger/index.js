import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Hamburger extends Component {

    stopProp = e => e.stopPropagation()

    render() {
      const {active, onClose, children} = this.props;
      return (
        <div className={classNames(styles.container, active && styles.active)} onClick={onClose}>
          <div className={classNames(styles.menu, active && styles.active)} onClick={this.stopProp}>
            {children}
          </div>
        </div>
      );
    }
}
