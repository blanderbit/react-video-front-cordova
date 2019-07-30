import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Toggle extends Component {

    toggle = () => {
      this.props.onChange(!this.props.value);
    }

    render() {
      const {label, desc, value, className} = this.props;
      return (
        <div className={classNames(styles.container, className)} onClick={this.toggle}>
          <div>
            <div className={styles.label}>{label}</div>
            {desc && <div className={styles.desc}>{desc}</div>}
          </div>
          <div className={classNames(styles.slider, value && styles.active)}>
            <div className={classNames(styles.ball, value && styles.active)}/>
          </div>
        </div>
      );
    }
}
