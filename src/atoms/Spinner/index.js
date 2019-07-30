import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import styles from './styles.scss';

export default class Spinner extends Component {

  render() {
    return (
      <div className={styles.container}>
        <FontAwesome className={styles.spinner} name="spinner"/>
      </div>
    );
  }
}
