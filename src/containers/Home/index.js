import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Carousel, Icon, Input, Spinner} from '../../atoms';
import {isEmpty, uniq} from 'lodash-es';
import {observer, inject} from 'mobx-react';
import styles from './styles.scss';
import placeholder from '../../../assets/placeholder.png';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import {php} from '../../stores';

@withRouter
@inject('project')
@inject('vlogEditor')
@inject('profile')
@inject('session')
@observer
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    this.state = {
      vlogs: [],
      pending: true,
      searchActive: false,
      searchValue: ''
    };
  }

  loadVlogs = () => php.get('/vlogs')
  .then(
    ({vlogs}) => this.setState({vlogs}),
    () => this.props.session.logout()
  )

  componentDidMount() {
    this.loadVlogs().then(() => {
      this.setState({pending: false});
      const ids = this.state.vlogs
      .filter(vlog => vlog.status === 'shared')
      .map(vlog => vlog.owner_id)
      .filter(id => Boolean(id));
      const uniqueIds = uniq(ids);
      !isEmpty(uniqueIds) && php.get(`/avatars?ids=${JSON.stringify(uniqueIds)}`)
      .then(avatarsObj => Object.entries(avatarsObj).forEach(([key, value]) =>
        this.setState({[`avatar-${key}`]: value}))
      );
    });
    this.props.session.getUser();
  }

  viewDetails = vlog => this.props.history.push(`/vlog-details/${vlog.id}`);

  enableSearch = () => {
    this.searchRef.current.focus();
    this.setState({searchActive: true, searchValue: ''});
  }

  disableSearch = () => {
    this.setState({searchActive: false, searchValue: ''});
  }

  setSearch = e => this.setState({searchValue: e.target.value})

  renderHighlight = () => {
    const video = this.props.vlogEditor.media.filter(media => media.mediatype === 'video')[0];
    return (
      <div className={styles.center}>
        <div className={styles.highlight} onClick={() => this.props.history.push('/edit-vlog')}>
          <img
            className={styles.thumb}
            src={video.thumb}
            onError={e => e.target.src = placeholder}
          />
          <div className={styles.title}>{video.title || 'Untitled'}</div>
          <div className={styles.duration}>{video.duration}</div>
        </div>
      </div>
    );
  }

  renderItem = (item, i) => (
    <div key={`${item.thumb}-${i}`} className={styles.item} onClick={() => this.viewDetails(item)}>
      <img
        className={styles.thumb}
        src={item.thumb}
        onError={e => e.target.src = placeholder}
      />
      <div className={styles.gradient} />
      <div className={styles.title}>{item.title || 'Untitled'}</div>
      <div className={styles.duration}>{item.duration}</div>
    </div>
  )
  renderSharedItem = (item, i) => (
    <div key={`${item.thumb}-${i}`} className={styles.item} onClick={() => this.viewDetails(item)}>
      <img
        className={styles.thumb}
        src={item.thumb}
        onError={e => e.target.src = placeholder}
      />
      <div className={styles.gradient} />
      <div className={styles.title}>{item.title || 'Untitled'}</div>
      <div className={styles.duration}>{item.duration}</div>
      <img className={styles.owner} src={this.state[`avatar-${item.owner_id}`] || placeholder} />
    </div>
  )
  renderHint = () => (
    <div className={styles.hint}>
      <div>Start creating your first vlog here!</div>
      <Icon className={styles.arrow} name="arrowDown" />
    </div>
  )

  render() {
    const {searchActive, searchValue, pending} = this.state;
    const vlogs = this.state.searchValue
      ? this.state.vlogs.filter(vlog => vlog.title.toLowerCase().includes(this.state.searchValue.toLowerCase()))
      : this.state.vlogs;
    const {user} = this.props.session;
    const {className} = this.props;
    return pending ? <Spinner/> : (
      <div className={classNames(styles.container, className)}>
        <div className={classNames(styles.carousels, isEmpty(vlogs) && styles.noRender)}>
          <Carousel
            title="Saved Vlogs"
            items={vlogs.filter(vlog => ['new', 'saved'].includes(vlog.status))}
            renderFunction={this.renderItem}
            scrollStep={310}
            onClick={this.viewDetails}
            className={styles.carousel}
          />
          <Carousel
            title="Rendered Vlogs"
            items={vlogs.filter(vlog => vlog.status === 'exported')}
            renderFunction={this.renderItem}
            scrollStep={310}
            onClick={this.viewDetails}
            className={styles.carousel}
          />
          <Carousel
            title="Shared with You"
            items={vlogs.filter(vlog => vlog.access === 'team').filter(vlog => user ? user.id != vlog.owner_id : true)}
            renderFunction={this.renderSharedItem}
            scrollStep={310}
            onClick={this.viewDetails}
            className={styles.carousel}
          />
        </div>
        {isEmpty(vlogs) && searchActive && <div className={styles.empty}>No vlogs found matching your search.</div>}
        {isEmpty(this.state.vlogs) && !this.state.pending && this.renderHint()}
        <FontAwesome className={styles.searchButton} name="search" onClick={this.enableSearch} />
        <Input
          className={classNames(styles.search, searchActive && styles.active)}
          inputRef={this.searchRef}
          field
          value={searchValue}
          onChange={this.setSearch}
          onBlur={this.disableSearch}
        />
      </div>
    );
  }
}
