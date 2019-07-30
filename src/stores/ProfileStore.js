import {observable} from 'mobx';
import {head} from 'lodash-es';
import {userDB, php} from '.';
import {history} from '../constants/routes';

export class ProfileStore {

  @observable user = null
  @observable teamId = null
  @observable avatar = null
  @observable logo = null
  @observable links = {}

  changeFirstName = e => this.firstName = e.target.value
  changelastName = e => this.lastName = e.target.value

  loadPersona = () => php.get('/user/me')
  .then(res => {
    this.avatar = res.avatar;
    this.logo = res.logo;
    this.links = res.links;
  })

  loadProfile = () => userDB.get('/auth/user/')
  .then(res => {
    this.user = res;
    this.teamId = this.user.team_id;
  })
  .then(this.loadPersona)

  getTeam = () => userDB.post('/team/', {
    id: this.teamId
  })

  uploadAvatar = e => {
    if(e.target.files) {
      const avatar = head(e.target.files);
      php.post('/user/avatar', {avatar})
      .then(this.loadPersona);
    }
  }

  uploadIcon = e => {
    if(e.target.files) {
      const logo = head(e.target.files);
      php.post('/team/icon', {logo})
      .then(this.loadPersona);
    }
  }

  getAvatar = userId => php.get(`/user/avatar/${userId}`).then(res => res.avatar)

  link = platform => response => {
    if(platform === 'google') {
      php.post('/links/google', {code: response.code});
    }

    if(platform === 'facebook') {
      php.post('/links/facebook', {token: response.accessToken})
      .then(() => history.replace('/profile'));
    }
  }

}

export default ProfileStore;
