import React, {Component} from 'react';
import {Icon} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import {SortableHandle} from 'react-sortable-hoc';
import classNames from 'classnames';
import styles from './styles.scss';
import {observer, inject} from 'mobx-react';
import {Preview, SelectAsset, EditTitle, EditFade} from '../';
import fallback from '../../../assets/placeholder.png';
import {isEmpty, isNumber} from 'lodash-es';

const formatTime = number => {
  const minutes = Math.floor(number / 60);
  const seconds = Math.floor(number % 60);
  if (minutes === 0 && seconds === 0 && number > 0) {
    return `< 0:01`;
  }
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const isFade = mediatype => ['fadein', 'fadeout', 'fadeoutin', 'crossfade'].includes(mediatype);

const DragHandle = SortableHandle(() =>
  <div className={styles.handle}>
    <FontAwesome name="bars" />
  </div>
);

const getOverlay = mediatype => ({
  video: Preview,
  asset: SelectAsset,
  title: EditTitle,
  fadein: EditFade,
  fadeout: EditFade,
  fadeoutin: EditFade,
  crossfade: EditFade
}[mediatype]);

@inject('overlay')
@observer
export default class MediaObject extends Component {

  getProps = mediaObj => ({
    onSave: this.props.onChange,
    ...{
      video: {video: mediaObj},
      asset: {asset: mediaObj},
      title: {title: mediaObj},
      fadein: {},
      fadeout: {},
      fadeoutin: {},
      crossfade: {}
    }[mediaObj.mediatype]
  });

  renderThumb = mediaObj => {
    const openOverlay = this.props.overlay.openOverlay(getOverlay(mediaObj.mediatype));
    const props = this.getProps(mediaObj);
    const onClick = openOverlay(props);

    if (['video', 'asset'].includes(mediaObj.mediatype)) {
      return <img className={styles.thumb} src={mediaObj.thumb} onError={e => e.target.src = fallback} onClick={onClick} />;
    }

    if (isFade(mediaObj.mediatype)) {
      return <Icon className={styles.icon} name="fade" onClick={onClick} />;
    }

    return <Icon className={styles.icon} name={mediaObj.mediatype} onClick={onClick} />;
  }

  renderVideoDesc = video => (
    <div className={styles.videoDesc}>
      <div className={styles.oldDuration}>{video.duration}</div>
      <div className={styles.newDuration}>
        <Icon className={styles.icon} name="trim" />
        <div>{formatTime(video.outpoint - video.inpoint)}</div>
      </div>
      {this.props.chronoIndex && <div className={styles.chronoIndex}>{this.props.chronoIndex}</div>}
    </div>
  )

  getDesc = mediaObj => {
    const {mediatype, inpoint, outpoint, seconds, overlay, sound} = mediaObj;
    const duration = isNumber(mediaObj.duration) ? formatTime(mediaObj.duration) : mediaObj.duration;
    const maybeMusic = (sound && sound.music) ? <FontAwesome className={styles.icon} name="music" /> : null;
    const maybeMicrophone = (sound && !sound.clipaudio) ? <FontAwesome className={styles.icon} name="microphone-slash" /> : null;

    return {
      video: <React.Fragment>
        {!isEmpty(overlay) && <Icon className={styles.icon} name="lowerThird" />}
        {maybeMusic}
        {maybeMicrophone}
        {seconds > outpoint - inpoint ? this.renderVideoDesc(mediaObj) : duration}
      </React.Fragment>,
      asset: <React.Fragment>
        {maybeMusic}
        {maybeMicrophone}
        {duration}
      </React.Fragment>,
      title: <React.Fragment>
        {maybeMusic}
        {maybeMicrophone}
        {duration}
      </React.Fragment>,
      fadein: duration,
      fadeout: duration,
      fadeoutin: duration,
      crossfade: duration,
    }[mediatype];
  }

  renderMeta = mediaObj => {
    const {mediatype, videoname, title, text} = mediaObj;
    const chosenIcon = {
      video: 'camcorder',
      asset: 'asset',
      title: 'title',
      fadein: 'fade',
      fadeout: 'fade',
      fadeoutin: 'fade',
      crossfade: 'fade'
    }[mediatype];

    const chosenTitle = {
      video: videoname,
      asset: title,
      title: text,
      fadein: 'Fade-In',
      fadeout: 'Fade-Out',
      fadeoutin: 'Fade-Out / Fade-In',
      crossfade: 'Crossfade'
    }[mediatype];

    const chosenDesc = this.getDesc(mediaObj);

    return (
      <div className={styles.meta}>
        <div className={styles.title}>
          <Icon className={classNames(styles.icon, styles.tiny)} name={chosenIcon} />
          <div>{chosenTitle}</div>
        </div>
        <div className={styles.desc}>{chosenDesc}</div>
      </div>
    );
  }

  render() {
    const {value, immutable, className} = this.props;
    return (
      <div className={classNames(styles.container, className)}>
        {this.renderThumb(value)}
        {this.renderMeta(value)}
        {!immutable && <DragHandle />}
      </div>
    );
  }
}
