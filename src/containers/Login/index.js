import React, {Component} from 'react';
import {Input, Button, Spinner} from '../../atoms';
import {withRouter} from 'react-router';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {first} from 'lodash-es';
import classNames from 'classnames';
import logo from '../../../assets/logo-transparent.png';

@withRouter
@inject('session')
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      pending: false
    };
  }

  //sorry
  componentDidMount() {
    document.body.style.setProperty('overscroll-behavior-y', 'auto');
  }

  //meer sorry
  componentWillUnmount() {
    document.body.style.setProperty('overscroll-behavior-y', 'contain');
  }

  submit = e => e.key === 'Enter' && this.login();

  setProperty = property => e => this.setState({[property]: e.target.value})

  login = () => {
    const {email, password} = this.state;
    this.setState({pending: true});
    this.props.session.login(email, password)
    .then(() => this.props.history.push('/home'))
    .catch(e => this.setState({error: e, pending: false}));
  }

  formatError = e => {
    const error = e.response ? e.response.data.error : ['Something went wrong.'];
    return first(Object.values(error));
  }

  render() {
    const {className} = this.props;
    const {email, password, error, pending} = this.state;
    return pending ? <Spinner/> : (
      <div className={classNames(styles.container, className)} onKeyPress={this.submit}>
        <img className={styles.logo} src={logo} />
        <div className={styles.content}>
          <Input auth modal type="email" name="Email" value={email} onChange={this.setProperty('email')} />
          <Input auth modal type="password" name="Password" value={password} onChange={this.setProperty('password')} />
          <Button className={styles.button} onClick={this.login} text="Login" />
          {error && <div className={styles.error}>{this.formatError(error)}</div>}
          <a href="https://userdb.vlogahead.cloud/accounts/password/reset/">Forgot password?</a>
        </div>
      </div>
    );
  }
}
