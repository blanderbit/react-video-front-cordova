import React, {Component} from 'react';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';

@inject('session')
@observer
export default class Logout extends Component {

  componentDidMount() {
    this.props.session.logout();
  }

  render() {
    return (
      <div className={styles.container}>

      </div>
    );
  }
}
