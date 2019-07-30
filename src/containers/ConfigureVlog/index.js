import React, {Component} from 'react';
import classNames from 'classnames';
import {Input, Toggle, Segment, Carousel, RadioButton, Icon, Spinner} from '../../atoms';
import {Preview, ConfirmationPrompt, ConfirmProfessional} from '../../components';
import {head, noop} from 'lodash-es';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import FontAwesome from 'react-fontawesome';
import {withRouter} from 'react-router';
import placeholder from '../../../assets/placeholder.png';

@withRouter
@inject('overlay')
@inject('vlogEditor')
@inject('project')
@inject('session')
@observer
export default class ConfigureVlog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pending: true,
      orientation: 'landscape',
      rendering: false,
      renderUrl: null
    };
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    this.props.project.setProject(id)
    .then(() => this.setState({pending: false}));
  }

  goHome = () => this.props.history.push('/home')

  download = () => this.props.project.download()

  orientationOptions = [
    {
      icon: 'landscape',
      option: 'Landscape Mode',
      desc: 'Landscape',
      value: 'landscape'
    },
    {
      icon: 'portrait',
      option: 'Portrait Mode',
      desc: 'Portrait',
      value: 'portrait'
    },
    {
      icon: 'square',
      option: 'Square Mode',
      desc: 'Square',
      value: 'square'
    }
  ].map(({icon, option, desc, value}) => ({
    render: (
      <div className={styles.option}>
        <Icon className={styles.icon} name={icon} />
        <div className={styles.optionBody}>
          <div className={styles.optionName}>{option}</div>
          <div className={styles.optionDesc}>{desc}</div>
        </div>
      </div>
    ),
    value
  })
  );

  setOrientation = orientation => () => this.setState({orientation})

  grabThumb = () => {
    const video = head(this.props.vlogEditor.media
    .filter(mediaObj => mediaObj.mediatype === 'video'));
    return video ? video.thumb : placeholder;
  }

  filters = [
    {
      name: 'sepia',
      style: {
        filter: 'sepia(1)'
      }
    },
    {
      name: 'grayscale',
      style: {
        filter: 'grayscale(1)'
      }
    },
    {
      name: 'film',
      style: {
        filter: 'grayscale(6%) contrast(130%)',
        mixBlendMode: 'hard-light'
      }
    },
    {
      name: 'noon',
      style: {
        filter: 'grayscale(30%) contrast(140%) hue-rotate(-5deg)',
        mixBlendMode: 'hard-light'
      }
    },
    {
      name: 'desaturate',
      style: {
        filter: 'contrast(1.2) saturate(0.5)'
      }
    }
  ]

  renderVlog = () => {
    this.setState({rendering: true, renderUrl: null});
    this.props.project.saveProject()
    .then(() => this.props.project.renderProject(this.state.orientation))
    .then(res => this.setState({rendering: false, renderUrl: res.videourl}));
  }

  renderFilter = ({name, style}) => (
    <div
      key={name}
      className={classNames(styles.filter,
        this.props.project.options.filter === name && styles.active)}
    >
      <img
        className={styles.filterPreview}
        style={style}
        onClick={this.props.project.setOption('filter', name)}
        src={this.grabThumb()}
      />
      <div className={styles.filterName}>{name}</div>
    </div>
  )

  renderOptionsSegment = () => {
    const {toggleOption, setProperty, access} = this.props.project;
    const {custom_subs, custom_edit} = this.props.project.options;
    const {openOverlay} = this.props.overlay;
    const {userType} = this.props.session;
    return (
      <Segment title="Options">
        <Toggle
          label="Custom Subtitles"
          desc="Our team will add subtitles to your video (in dutch or english only)"
          value={custom_subs}
          onChange={custom_subs
            ? toggleOption('custom_subs')
            : openOverlay(ConfirmationPrompt)({
              onSelect: toggleOption('custom_subs'),
              body: 'Are you sure you want to request custom subtitles? Additional charges apply.'
            })}
        />
        <Toggle
          label="Custom Edit"
          desc="A professional editor will edit your vlog!"
          value={custom_edit}
          onChange={custom_edit
            ? toggleOption('custom_edit')
            : openOverlay(ConfirmProfessional)({onSelect: toggleOption('custom_edit')})}
        />
        {userType !== 'regularUser'
          && <Toggle
            label="Share with Team"
            desc="This vlog will be accessible to members in your team"
            value={access === 'team'}
            onChange={() => setProperty('access', access === 'team' ? 'personal' : 'team')}
          />}
      </Segment>
    );

  }

  render() {
    const {title, description, setProperty, toggleOption, setOption, saveProject} = this.props.project;
    const {userType} = this.props.session;
    const {logo_overlay, filter} = this.props.project.options;
    const {orientation, renderUrl, rendering, pending} = this.state;
    return pending ? <Spinner /> : (
      <div className={styles.container}>
        <Segment title="Info">
          <Input
            field
            name="Title"
            value={title}
            onChange={e => setProperty('title', e.target.value)}
          />
          <Input
            field
            name="Description"
            value={description}
            onChange={e => setProperty('description', e.target.value)}
          />
        </Segment>
        <Segment title="Styling">
          <Carousel
            className={classNames(styles.carousel, filter && styles.active)}
            noRender={!filter}
            title="Filters"
            items={this.filters}
            renderFunction={this.renderFilter}
            active={filter}
          />
          <Toggle
            label="Use Filter"
            value={filter}
            onChange={filter ? toggleOption('filter') : setOption('filter', head(this.filters).name)}
          />
          {userType !== 'regularUser' && <Toggle
            label="Logo Overlay"
            value={logo_overlay}
            onChange={toggleOption('logo_overlay')}
          />}
        </Segment>
        <Segment title="Orientation">
          {this.orientationOptions.map(({render, value}) =>
            <RadioButton
              key={value}
              render={render}
              active={value === orientation}
              onChange={this.setOrientation(value)}
            />)}
        </Segment>
        {this.renderOptionsSegment()}
        <Segment
          className={classNames(styles.preview, renderUrl && styles.active)}
          title={renderUrl ? 'Preview' : ''}
        >
          {renderUrl && <Preview src={`${renderUrl}?${Math.random()}`} />}
        </Segment>
        <Segment title="Finalize">
          <div className={styles.finalize}>
            <div className={styles.button} onClick={this.goHome}>Home</div>
            <div
              className={classNames(styles.button,
                !renderUrl && styles.disabled)}
              onClick={this.download}
            >
              Download
            </div>
            <div
              className={classNames(styles.button,
                (rendering || renderUrl) && styles.disabled)}
              onClick={this.renderVlog}
            >
              <div>{rendering
                ? <FontAwesome className={styles.spinner} name="spinner" />
                : 'Render'}</div>
            </div>
          </div>
        </Segment>
      </div>
    );
  }
}
