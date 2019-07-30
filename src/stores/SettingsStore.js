import {observable} from 'mobx';
import {php} from '.';
import {sessionStore} from '..';

export class SettingsStore {

  @observable settings = {

  };

  toggle = setting => {
    this.settings = {...this.settings, [setting]: !this.settings[setting]};
  }
}

export default SettingsStore;
