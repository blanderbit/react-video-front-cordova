import React, {Component} from 'react';
import {isEmpty, noop} from 'lodash-es';
import styles from './styles.scss';
import {Segment} from '../../atoms';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {Overlay, Preview, Modal} from '../../components';
import {withRouter} from 'react-router';
import FontAwesome from 'react-fontawesome';
import profile from '../../../assets/profile.png';
import placeholder from '../../../assets/placeholder.png';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from 'react-instagram-login';
import axios from 'axios';

@withRouter
@inject('profile')
@inject('session')
@observer
export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeAsset: null
    };
  }

  componentWillMount() {
    this.props.profile.loadProfile().then(() => {
      if (this.props.profile.user.team) {
        this.props.profile.getTeam();
      }
    });
  }

  goTo = path => () => this.props.history.push(path)

  renderField = (left, right, func) => (
    <div className={styles.field} onClick={func || noop}>
      <div className={styles.fieldLeft}>{left}</div>
      <div className={styles.fieldRight}>{right}</div>
    </div>
  )

  renderPersona = () => {
    const {first_name, last_name, team} = this.props.profile.user;
    const {avatar, logo, uploadAvatar, uploadIcon} = this.props.profile;
    const {userType} = this.props.session;
    return (
      <div className={styles.persona}>
        <div className={styles.avatar} style={{backgroundImage: `url(${avatar || profile})`}}>
          <input className={styles.imageUpload} type="file" accept="image/*" onChange={uploadAvatar} />
          {userType !== 'regularUser' && <div className={styles.logoWrapper}>
            {userType === 'teamManager' && <input className={styles.imageUpload} type="file" accept="image/*" onChange={uploadIcon} />}
            <img className={styles.logo} src={logo || placeholder} />
          </div>}
        </div>
        <div className={styles.fullName}>{`${first_name} ${last_name}`}</div>
        <div className={styles.companyName}>{team}</div>
      </div>
    );
  }

  prettyUserType = userType => ({
    regularUser: 'Regular User',
    teamManager: 'Team Manager',
    teamMember: 'Team Member'
  })[userType]

  renderFields = () => {
    const {email} = this.props.profile.user;
    const {userType} = this.props.session;
    return (
      <Segment>
        {this.renderField('E-mail', email)}
        {this.renderField('Account Type', this.prettyUserType(userType))}
        {this.renderField('Customize', <FontAwesome className={styles.icon} name="chevron-right" />, this.goTo('/customize'))}
        {['teamManager', 'regularUser'].includes(userType) && this.renderField('Manage Templates', <FontAwesome className={styles.icon} name="chevron-right" />, this.goTo('/template-manager'))}
      </Segment>
    );
  }

  links = {
    google: (
      <GoogleLogin
        className={styles.linkButton}
        clientId="814043436795-k11mvtqeal0rmj7dob63c092lmlit08l.apps.googleusercontent.com"
        scope="https://www.googleapis.com/auth/youtube"
        accessType="offline"
        responseType="code"
        onSuccess={this.props.profile.link('google')}
        buttonText="Google"
      />
    ),
    linkedIn: (
      <div
        className={styles.linkButton}
        onClick={() => window.open(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86gdun5hcweh46&redirect_uri=https%3A%2F%2Fintranet.sonicvoyage.nl`)}>
        LinkedIn
      </div>
    )
  }

  renderLink = platform => (
    <div key={platform} className={styles.link}>
      {this.links[platform]}
      {this.props.profile.links[platform] && <FontAwesome className={styles.check} name="check" />}
    </div>
  )

  renderLinks = () => (
    <Segment title="Links">
      {Object.keys(this.links).map(this.renderLink)}
    </Segment>
  )

  render() {
    const {user} = this.props.profile;
    const {className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        {user && this.renderPersona()}
        {user && this.renderFields()}
        {user && this.renderLinks()}
      </div>
    );
  }
}
