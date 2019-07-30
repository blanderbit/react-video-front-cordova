import React, {Component} from 'react';
import styles from './styles.scss';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

export default class Checkbox extends Component {

  onChange = () => this.props.onChange()

  render() {
    const {value, className, ...props} = this.props;
    return (
      <div className={classNames(styles.container, value && styles.active, className)} onClick={this.onChange} {...props}>
        <FontAwesome className={classNames(styles.check, value && styles.active)} name="check"/>
      </div>
    );
  }
}
