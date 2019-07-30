import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import svgs from '../../../assets/icons';

export default class Icon extends Component {

  render() {
    const {name, style, className, onClick} = this.props;
    return (
      <div className={classNames(styles.container, className)} style={style}>
        <object data={svgs[name]}/>
        <div className={styles.clickable} onClick={onClick}/>
      </div>
    );
  }
}