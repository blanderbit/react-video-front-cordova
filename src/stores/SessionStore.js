import {observable} from 'mobx';
import {php, userDB} from '.';
import {history} from '../constants/routes';
import Cookies from 'js-cookie';

export class SessionStore {
  @observable error = null
  @observable token = null
  @observable user = null
  @observable userType = null

  showError = text => {
    this.error = text;
    setTimeout(() => this.error = null, 5000);
  }

  getUser = () => userDB.get('/auth/user/')
  .then(user => {
    this.userType = this.convertUserType(user.user_type);
    this.user = user;
  })

  initialize = () => {
    try {
      this.token = localStorage.getItem('token');
    } catch (error) {
      this.token = Cookies.get('token');
    }
    if (this.token) {
      php.interceptors.request.use(
        config => ({...config, headers: {Authorization: `Token ${this.token}`}})
      );
      userDB.interceptors.request.use(
        config => ({...config, headers: {Authorization: `Token ${this.token}`}})
      );
      history.location.pathname === '/' && history.push('/home');
      this.getUser().catch(() => {
        this.clearToken();
        history.replace('/');
      });
    }
  }

  login = (email, password) => php.post('/login', {
    email, password, saveLogin: false
  }).then(res => {
    const {access_token} = res;
    this.token = access_token;
    try {
      localStorage.setItem('token', access_token);
    } catch (e) {
      Cookies.set('token', access_token);
    }
    this.initialize();
  })

  logout = () => php.get('/logout')
  .then(() => {
    this.clearToken();
    history.replace('/');
  })

  clearToken = () => {
    this.token = null;
    try {
      localStorage.removeItem('token', null);
    } catch (e) {
      Cookies.remove('token');
    }
  }

  convertUserType = typeNumber => {
    switch (typeNumber) {
      case 1: return 'regularUser';
      case 2: return 'teamManager';
      case 3: return 'teamMember';
      default: throw new Error();
    }
  }
}
