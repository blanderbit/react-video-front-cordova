import React, {Component} from 'react';
import styles from './styles.scss';

export default class Contact extends Component {

  render() {
    return (
      <div className={styles.container}>
        <div>
          For inquiries, please use the following contact information. For help with our app, please mail to &nbsp;
          <a href="mailto:help@vlogahead.com">help@vlogahead.com</a>
        </div>

        <div>
          <div>Address</div>
          <div>VlogAhead</div>
          <div>Achterhaven 154</div>
          <div>3024RC Rotterdam</div>
          <div>The Netherlands</div>
        </div>

        <div>
          <div>+31 10 8408478</div>
          <a href="mailto:info@vlogahead.com">info@vlogahead.com</a>
        </div>
      </div>
    );
  }
}
