import React, {Component} from 'react';
import styles from './styles.scss';
import {Modal, Trimmer} from '..';
import {isEmpty, isNumber, pick, isEqual} from 'lodash-es';
import {Toggle, Icon, VerticalSlider} from '../../atoms';
import {StylePicker} from '../';
import classNames from 'classnames';
import {php} from '../../stores';
import {inject, observer} from 'mobx-react';

const getLowerThird = ({video, text, logo, side, style, emphasize}) => php.post('/lowerthird', {
  type: 'lowerthird',
  video_id: video.video_id,
  text,
  logo,
  placement: side,
  style,
  emphasize
});

@inject('session')
@observer
class LowerThird extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lowerThird: props.lowerThird || undefined
    };
  }

  componentWillMount() {
    this.props.text && this.updateLowerThird();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.text, this.props.text)) {
      return;
    }
    (prevProps.logo !== this.props.logo
      || prevProps.emphasize !== this.props.emphasize
      || !isEqual(prevProps.style, this.props.style)
    ) && this.updateLowerThird();
  }

  componentWillUnmount() {
    this.props.onExit(this.state.lowerThird);
  }

  updateLowerThird = () => getLowerThird(pick(this.props, ['video', 'text', 'logo', 'side', 'style', 'emphasize']))
  .then(res => this.setState({lowerThird: `${res.srcbase64}`}));

  onChange = changes => this.props.onChange(changes);

  setText = e => this.props.onChange({text: e.target.value})

  setStyle = style => this.onChange({style})

  toggleSide = () => this.onChange({side: this.props.side === 'left' ? 'right' : 'left'})

  toggleEmphasize = () => this.onChange({emphasize: !this.props.emphasize})

  toggleLogo = () => this.onChange({logo: !this.props.logo})

  toggleAnimation = () => this.onChange({animation: this.props.animation === 'fade' ? 'slide' : 'fade'})

  renderRadio = (label, condition, func) => (
    <div
      className={classNames(styles.radioButton, condition && styles.active)}
      onClick={func}
    >
      {label}
    </div>
  )

  render() {
    const {side, animation, text, style, emphasize, logo, thumb} = this.props;
    const {userType} = this.props.session;
    const {lowerThird} = this.state;
    return (
      <div className={styles.lowerThird}>
        <div className={styles.lowerThirdBox}>
          {thumb}
          <img
            className={styles.lowerThirdOverlay}
            style={{[side]: 0}}
            src={lowerThird}
          />
        </div>
        <div className={styles.label}>Text</div>
        <textarea className={styles.textarea} value={text} onChange={this.setText} onBlur={this.updateLowerThird} />
        <div className={styles.label}>Style</div>
        <StylePicker
          className={styles.stylePicker}
          onSelect={this.setStyle}
          selected={style}
        />
        <Toggle className={styles.toggle} label="Emphasize first line" value={emphasize} onChange={this.toggleEmphasize} />
        {userType !== 'regularUser' && <Toggle className={styles.toggle} label="Use Logo" value={logo} onChange={this.toggleLogo} />}
        <div>Lower Third side</div>
        <div className={styles.radioRow}>
          {this.renderRadio('left', side === 'left', this.toggleSide)}
          {this.renderRadio('right', side === 'right', this.toggleSide)}
        </div>
        <div>Animation</div>
        <div className={styles.radioRow}>
          {this.renderRadio('fade', animation === 'fade', this.toggleAnimation)}
          {this.renderRadio('slide', animation === 'slide', this.toggleAnimation)}
        </div>
      </div>
    );
  }
}

class Preview extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.thumbRef = React.createRef();
    this.state = {
      thumbWidth: null,
      thumbHeight: null
    };
  }

  generateOverlay = () => {
    const {selectedType, vertical, emphasize, text, lowerThird, side} = this.props.upperState;
    const {video} = this.props;
    const {thumbWidth, thumbHeight} = this.state;
    const textLines = text.split(/\r?\n/);
    switch (selectedType) {
      case 'lowerThird':
        return <img
          ref={this.thumbRef}
          className={styles.lowerThirdOverlay}
          style={{
            [side]: 0,
            ...(thumbWidth || thumbHeight) ? {width: `${thumbWidth}px`, height: `${thumbHeight}px`} : {}
          }}
          src={lowerThird}
        />;

      case 'text':
        return (
          <div className={styles.textPreview} style={{bottom: `${vertical}%`}}>
            {textLines.map((line, i) =>
              <div key={line} className={classNames(styles.textLine,
                (emphasize && i === 0) && styles.bold)}>
                {line}
              </div>)}
          </div>
        );

      case 'custom':
        break;

      default: throw new Error('Blaarb');

    }
  }

  getInnerSize = () => {
    const videoRef = this.videoRef.current;
    const thumbRef = this.thumbRef.current;
    if (videoRef && thumbRef) {
      const factor = videoRef.clientHeight / this.props.video.height;
      this.setState({
        thumbWidth: thumbRef.clientWidth * factor,
        thumbHeight: thumbRef.clientHeight * factor
      });
    }
  }

  render() {
    const {handleTrimmer} = this.props;
    const {editing} = this.props.upperState;
    return (
      <div className={styles.preview}>
        <Trimmer
          videoRef={this.videoRef}
          onVideoLoaded={this.getInnerSize}
          video={isNumber(editing)
            ? {
              ...this.props.video,
              inpoint: this.props.video.overlay[editing].inpoint,
              outpoint: this.props.video.overlay[editing].outpoint
            }
            : this.props.video}
          onChange={handleTrimmer}
          overlay={this.generateOverlay()}
        />
      </div>
    );
  }
}

export default class AddOverlay extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      step: 'overview',
      selectedType: null,
      editing: null,
      text: '',
      emphasize: false,
      logo: false,
      style: null,
      vertical: 50,
      horizontal: 50,
      side: 'right',
      animation: 'fade',
      lowerThird: null,
      inpoint: props.video.inpoint,
      outpoint: props.video.outpoint
    };
  }

  goToStep = step => () => this.setState({step});

  setSelectedType = type => () => this.setState({selectedType: type})

  loadExisting = (overlay, i) => () => {
    this.setState({
      ...overlay,
      editing: i,
      step: overlay.type,
      selectedType: overlay.type
    });
  }

  buildOverlay = () => {
    const {selectedType, text, emphasize, side, animation,
      logo, vertical, horizontal, inpoint, outpoint, style} = this.state;

    switch (selectedType) {
      case 'lowerThird':
        return {
          type: 'lowerThird',
          text,
          emphasize,
          placement: side,
          animation,
          logo,
          inpoint,
          outpoint,
          style
        };

      case 'text':
        return {
          type: 'text',
          text,
          emphasize,
          vertical,
          inpoint,
          outpoint,
          style
        };

      case 'custom':
        return {
          type: 'custom'
        };

      default: throw new Error('rggg');
    }
  }
  save = () => {
    if (isNumber(this.state.editing)) {
      this.props.onSave({overlay: this.props.video.overlay.map((x, i) => i === this.state.editing ? this.buildOverlay() : x)});
    } else {
      this.props.onSave({overlay: [...this.props.video.overlay, this.buildOverlay()]});
    }
    this.props.onClose();
  }

  getModalActions = step => {
    switch (step) {
      case 'overview':
        return [
          {label: 'Close', func: this.props.onClose},
          {label: 'Add new...', func: this.goToStep('chooseType')}
        ];

      case 'chooseType':
        return [
          {label: 'Back', func: this.goToStep('overview')},
          {label: 'Select', func: this.goToStep(this.state.selectedType)}
        ];

      case 'lowerThird':
      case 'text':
        return [
          {label: 'Back', func: isNumber(this.state.editing) ? this.goToStep('overview') : this.goToStep('chooseType')},
          {label: 'Next', func: this.goToStep('preview')}
        ];

      case 'custom':
        return [
          {label: 'Back', func: isNumber(this.state.editing) ? this.goToStep('overview') : this.goToStep('chooseType')},
          {label: '///', func: null}
        ];

      case 'preview':
        return [
          {label: 'Back', func: this.goToStep(this.state.selectedType)},
          {label: 'Save', func: this.save}
        ];

      default: throw new Error(`No modal actions found for step ${step}`);
    }
  }

  deleteOverlay = index => e => {
    e.stopPropagation();
    this.props.onSave({overlay: this.props.video.overlay.filter((x, i) => index !== i)});
    this.props.onClose();
  }

  renderItem = (item, i) => (
    <div key={item.text} className={styles.item} onClick={this.loadExisting(item, i)}>
      <div>{`${item.type} overlay`}</div>
      <Icon className={styles.icon} name="trash" onClick={this.deleteOverlay(i)} />
    </div>
  )

  generateStyles = () => this.state.style ? {
    color: this.state.style.textcolor,
    background: this.state.style.backgroundcolor,
    fontFamily: this.state.style.font
  } : {}

  toggleEmphasize = () => this.setState({emphasize: !this.state.emphasize})

  toggleLogo = () => this.setState({logo: !this.state.logo})

  setVertical = val => this.setState({vertical: val})

  setStyle = style => this.setState({style})

  setLowerThird = lowerThird => this.setState({lowerThird})

  handleTrimmer = (start, stop) => this.setState({inpoint: start, outpoint: stop})

  updateLowerThird = changes => this.setState(changes)

  generateContent = step => {
    const {video} = this.props;
    const {overlay} = video;
    const {selectedType, text, emphasize, logo, vertical, horizontal, style, editing} = this.state;
    const textarea = (props = {}) => <textarea className={styles.textarea} value={text} wrap="off" onChange={e => this.setState({text: e.target.value})} {...props} />;
    const thumb = <img className={styles.thumb} src={video.thumb} />;

    switch (step) {
      case 'overview':
        return <div className={styles.overview}>
          {!isEmpty(overlay) ? overlay.map(this.renderItem) : 'No overlays on this video. Press "Add New..." to add one!'}
        </div>;

      case 'chooseType':
        return <div className={styles.chooseType}>
          <div>What kind of overlay would you like to add?</div>
          <div>
            <div
              className={classNames(styles.type, selectedType === 'lowerThird' && styles.active)}
              onClick={this.setSelectedType('lowerThird')}
            >
              <div className={styles.typeName}>Lower Third</div>
              <div className={styles.typeDesc}>Introduce people in your vlog with a Lower Third.</div>
            </div>
            <div
              className={classNames(styles.type, selectedType === 'text' && styles.active)}
              onClick={this.setSelectedType('text')}
            >
              <div className={styles.typeName}>Text</div>
              <div className={styles.typeDesc}>Place some text over your video.</div>
            </div>
            {/* <div
              className={classNames(styles.type, selectedType === 'custom' && styles.active)}
              onClick={this.setSelectedType('custom')}
            >
              <div className={styles.typeName}>Custom</div>
              <div className={styles.typeDesc}>Configure an overlay exactly to your liking!</div>
            </div> */}
          </div>
        </div>;

      case 'lowerThird':
        return <LowerThird
          onChange={this.updateLowerThird}
          video={video}
          thumb={thumb}
          {...pick(this.state, ['side', 'animation', 'text', 'emphasize', 'logo', 'style', 'lowerThird'])}
          onExit={this.setLowerThird}
        />;

      case 'text':
        return <div className={styles.text}>
          <div className={styles.textAligner}>
            <div className={styles.textBox}>
              {thumb}
              <div className={styles.textBar} style={{...this.generateStyles(), bottom: `${vertical}%`}}>
                {text.split(/\r?\n/).map((line, i) => <div key={line} className={classNames(styles.textLine, (emphasize && i === 0) && styles.emphasizeFirst)}>{line}</div>)}
              </div>
              <VerticalSlider className={styles.textSlider} value={vertical} limits={[0, 100]} onChange={this.setVertical} />
            </div>
          </div>
          {textarea()}
          <StylePicker
            className={styles.stylePicker}
            onSelect={this.setStyle}
            selected={this.state.style}
          />
          <Toggle className={styles.toggle} label="Emphasize first line" value={emphasize} onChange={this.toggleEmphasize} />
        </div>;

      case 'custom':
        return <div className={styles.custom}>
          <div>Coming soon!</div>
        </div>;

      case 'preview':
        return <Preview video={this.props.video} handleTrimmer={this.handleTrimmer} upperState={this.state} />;

      default: throw new Error(`No content found for ${step}`);
    }
  }

  render() {
    const {step} = this.state;
    return (
      <Modal actions={this.getModalActions(step)}>
        {this.generateContent(step)}
      </Modal>
    );
  }
}
