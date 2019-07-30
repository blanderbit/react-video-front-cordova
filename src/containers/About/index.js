import React, {Component} from 'react';
import styles from './styles.scss';

export default class About extends Component {

  render() {
    return (
      <div className={styles.container}>
        <div>
      VlogAhead is an app and service to optimize and professionalize self shot videos (or vlogs).
      You record the video. Our app makes sure it looks nice and professional.
      And, if you want, a professional editor (from our partner company) makes a professional video for you!
        </div>
        <a className={styles.link} href="https://www.vlogahead.com/privacy.html">Privacy Policy</a>
        <a className={styles.link} href="https://www.vlogahead.com/applegal.html">Legal Info</a>
      </div>
    );
  }
}
