import React, {Component} from 'react';
import styles from './styles.scss';
import {Segment, Carousel, SwipeItem, Icon, ProgressBar} from '../../atoms';
import {Preview, StyleEditor, ConfirmationPrompt} from '../../components';
import {inject, observer} from 'mobx-react';
import classNames from 'classnames';
import {isEmpty, noop} from 'lodash-es';
import FontAwesome from 'react-fontawesome';
import trash from '../../../assets/trash.png';

@inject('overlay')
@inject('assets')
@inject('session')
@observer
export default class Customize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamOpen: false,
      personalOpen: false,
      deleteMode: false,
      assetsToDelete: [],
      reveal: {
        personal: {},
        team: {}
      }
    };
  }

  componentWillMount() {
    this.props.assets.loadAssets();
    this.props.assets.loadStyles();
  }

  componentDidMount() {
    this.props.assets.initResumables(this.props.session.userType === 'teamManager');
  }

  deleteAsset = id => this.props.assets.deleteAsset(id)

  deleteAssets = () => {
    this.toggleDeleteMode();
    return Promise.all(this.state.assetsToDelete.map(id => this.deleteAsset(id)))
    .then(() => {
      this.props.assets.loadAssets();
      this.setState({assetsToDelete: []});
      this.props.overlay.closeOverlay();
    });
  }

  cancelDelete = () => {
    this.toggleDeleteMode();
    this.props.overlay.closeOverlay();
    this.setState({assetsToDelete: []});
  }

  handleDelete = () => {
    isEmpty(this.state.assetsToDelete)
      ? this.toggleDeleteMode()
      : this.props.overlay.openOverlay(ConfirmationPrompt)({
        onSelect: this.deleteAssets,
        onClose: this.cancelDelete,
        body: `Are you sure you want to delete ${this.state.assetsToDelete.length} assets? This can not be undone.`
      })();
  }

  uploadStyle = group => style => this.props.assets.uploadStyle(group, style)
  .then(this.props.assets.loadStyles)

  openStyleEditor = group => this.props.overlay.openOverlay(StyleEditor)({onSave: this.uploadStyle(group)});

  toggleSegment = type => () => this.setState({[`${type}Open`]: !this.state[`${type}Open`]})

  openPreview = (type, src) => () => {
    const content = (type => {
      switch (type) {
        case 'image': return props => <img className={styles.imagePreview} src={props.src} />;
        case 'video': return Preview;
        default: throw new Error();
      }
    })(type);
    this.props.overlay.openOverlay(content)({src})();
  }

  scheduleAssetDeletion = id => () => this.setState({
    assetsToDelete: this.state.assetsToDelete.includes(id)
      ? this.state.assetsToDelete.filter(x => x !== id)
      : [...this.state.assetsToDelete, id]
  });

  renderThumb = ({id, thumb, type, src}) => (
    <div key={id} className={styles.asset}>
      <img className={styles.thumb} src={thumb} onClick={this.state.deleteMode ? this.scheduleAssetDeletion(id) : this.openPreview(type, src)} />
      <div className={classNames(styles.check, this.state.assetsToDelete.includes(id) && styles.active)}>
        <FontAwesome className={styles.icon} name="check" />
      </div>
    </div>
  )

  renderAsset = asset => {
    switch (asset.type) {
      case 'image': return this.renderThumb({...asset, thumb: asset.src});
      case 'video': return this.renderThumb(asset);
      // case 'audio': return this.renderThumb()
      default: throw new Error();
    }
  }

  renderPersonalHeader = () => (
    <div className={styles.header} onClick={this.toggleSegment('personal')}>
      <div>
        <div className={styles.collapser}>
          <FontAwesome className={styles.icon} name={this.state.personalOpen ? 'minus' : 'plus'} />
        </div>
        Personal Assets
      </div>
      <div className={styles.upload} id="personalupload">Upload +</div>
    </div>
  )

  renderTeamHeader = () => (
    <div className={styles.header} onClick={this.toggleSegment('team')}>
      <div>
        <div className={styles.collapser}>
          <FontAwesome className={styles.icon} name={this.state.teamOpen ? 'minus' : 'plus'} />
        </div>
        Team Assets
      </div>
      {this.props.session.userType === 'teamManager' && <div className={styles.upload} id="teamupload">Upload +</div>}
    </div>
  )

  reveal = (group, i) => side => () => this.setState({
    reveal: {
      ...this.state.reveal,
      [group]: {index: i, side}
    }
  })

  resetReveal = () => this.setState({
    reveal: {
      personal: {},
      team: {}
    }
  })

  deleteStyle = id => () => this.props.assets.deleteStyle(id)
  .then(this.props.assets.loadStyles)
  .then(this.resetReveal)

  toggleDeleteMode = () => this.setState({deleteMode: !this.state.deleteMode})

  getSwipeActions = id => ({
    left: [
      // {
      //   label: (
      //     <div className={styles.actionLabel}>
      //       <Icon className={styles.icon} name="trim" />
      //       <div>Edit</div>
      //     </div>
      //   ),
      //   func: () => null
      // }
    ],
    right: [
      {
        label: (
          <div className={styles.actionLabel}>
            <Icon className={styles.icon} name="trash" />
            <div>Delete</div>
          </div>
        ),
        func: this.deleteStyle(id)
      }
    ]
  })

  renderStyle = group => ({backgroundcolor, font, name, textcolor, id}, i) => (
    <SwipeItem
      key={`${name}-${i}`}
      className={styles.style}
      onSwipe={this.reveal(group, i)}
      reveal={this.state.reveal[group].index === i && this.state.reveal[group].side}
      actions={this.getSwipeActions(id)}
    >
      <div className={styles.styleGroup}>
        <div>{name}</div>
        <div style={{fontFamily: font}}>{font}</div>
      </div>
      <div className={styles.styleGroup}>
        <div className={styles.color} style={{background: textcolor}} />
        <div className={styles.color} style={{background: backgroundcolor}} />
      </div>
    </SwipeItem>
  )

  renderStyles = (styleList, group) => (
    <div className={styles.styleList}>
      <div className={styles.subHeader}>
        <div className={styles.header}>{`${group} Styles`}</div>
        <div className={styles.upload} onClick={this.openStyleEditor(group)}>Add +</div>
      </div>
      {!isEmpty(styleList) && <div className={styles.style}>
        <div className={classNames(styles.styleGroup, styles.header)}>
          <div>NAME</div>
          <div>FONT</div>
        </div>
        <div className={classNames(styles.styleGroup, styles.header)}>
          <div>TEXT</div>
          <div>BACK</div>
        </div>
      </div>}
      {styleList.map(this.renderStyle(group))}
    </div>
  );

  render() {
    const {assetList, styleList, uploading, progress, cancelUpload} = this.props.assets;
    const {userType} = this.props.session;
    const {teamOpen, personalOpen} = this.state;
    const {className} = this.props;

    const personalAssets = assetList.filter(asset => asset.access === 'personal');
    const personalVideos = personalAssets.filter(asset => asset.type === 'video');
    const personalImages = personalAssets.filter(asset => asset.type === 'image');
    const personalAudio = personalAssets.filter(asset => asset.type === 'audio');
    const personalStyles = styleList.filter(style => style.access === 'personal');

    const teamAssets = assetList.filter(asset => asset.access === 'team');
    const teamVideos = teamAssets.filter(asset => asset.type === 'video');
    const teamImages = teamAssets.filter(asset => asset.type === 'image');
    const teamAudio = teamAssets.filter(asset => asset.type === 'audio');
    const teamStyles = styleList.filter(style => style.access === 'team');

    return (
      <div className={classNames(styles.container, className)}>
        <ProgressBar className={classNames(styles.progressBar, uploading && styles.active)} progress={progress} onCancel={cancelUpload} />
        <Segment
          title={this.renderPersonalHeader()}
          hideChildren={!personalOpen}
        >
          <Carousel
            title="Personal Videos"
            items={personalVideos}
            renderFunction={this.renderAsset}
            noRender={isEmpty(personalVideos)}
          />
          <Carousel
            title="Personal Images"
            items={personalImages}
            renderFunction={this.renderAsset}
            noRender={isEmpty(personalImages)}
          />
          <Carousel
            title="Personal Audio"
            items={personalAudio}
            renderFunction={this.renderAsset}
            noRender={isEmpty(personalAudio)}
          />
          {this.renderStyles(personalStyles, 'personal')}
        </Segment>
        <Segment
          title={this.renderTeamHeader()}
          hideChildren={!teamOpen}
          condition={userType === 'teamManager'}
        >
          <Carousel
            title="Team Videos"
            items={teamVideos}
            renderFunction={this.renderAsset}
            noRender={isEmpty(teamVideos)}
          />
          <Carousel
            title="Team Images"
            items={teamImages}
            renderFunction={this.renderAsset}
            noRender={isEmpty(teamImages)}
          />
          <Carousel
            title="Team Audio"
            items={teamAudio}
            renderFunction={this.renderAsset}
            noRender={isEmpty(teamAudio)}
          />
          {this.renderStyles(teamStyles, 'team')}
        </Segment>
        <img
          className={classNames(styles.trash, this.state.deleteMode && styles.active)}
          onClick={this.state.deleteMode
            ? this.handleDelete
            : this.toggleDeleteMode}
          src={trash}
        />
      </div>
    );
  }
}
