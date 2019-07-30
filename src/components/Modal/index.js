import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Modal extends Component {

    renderAction = ({label, func, disable}) => (
      <div key={label} className={classNames(styles.action, disable && styles.disabled)} onClick={func}>
        {label}
      </div>
    )

    render() {
      const {className, contentClassName, children, actions} = this.props;
      return (
        <div className={classNames(styles.container, className)}>
          <div className={classNames(styles.children, contentClassName)}>
            {children}
          </div>
          <div className={styles.actions}>
            {actions.map(this.renderAction)}
          </div>
        </div>
      );
    }
}
