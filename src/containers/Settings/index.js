import React, {Component} from 'react';
import {Toggle, Segment} from '../../atoms';
import settings from '../../constants/settings';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router';
import classNames from 'classnames';

@withRouter
@inject('settings')
@observer
export default class Settings extends Component {

  goTo = path => () => this.props.history.push(path)

  toggle = key => () => this.props.settings.toggle(key)

  renderSetting = setting =>
    <div key={setting.storeKey} className={styles.setting}>
      <Toggle
        label={setting.name}
        desc={setting.desc}
        value={this.props.settings.settings[setting.storeKey]}
        onChange={this.toggle(setting.storeKey)}
      />
    </div>

  renderBottom = () => (
    <div className={styles.bottom}>
      <div onClick={() => location.href = 'https://www.vlogahead.com/faq.html'}>FAQ</div>
      <div onClick={this.goTo('/about')}>About Us</div>
      <div onClick={this.goTo('/contact')}>Contact</div>
    </div>
  )

  render() {
    const {className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        {settings.map(group => (
          <Segment key={group.title} title={group.title}>
            {group.settings.map(this.renderSetting)}
          </Segment>
        ))}
        {this.renderBottom()}
      </div>
    );
  }
}
