import React, {Component} from 'react';
import {isNumber, noop} from 'lodash-es';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Preview extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    if(this.props.video) {
      this.videoRef.current.currentTime = this.props.video.inpoint;
    } else if (this.props.start) {
      this.videoRef.current.currentTime = this.props.start;
    }
  }

  limitVideo = () => {
    const videoElem = this.videoRef.current;
    const {video} = this.props;
    if (videoElem.currentTime >= video.outpoint) {
      videoElem.currentTime = video.inpoint;
    }
  }

  limitSrc = () => {
    const videoElem = this.videoRef.current;
    const {start, stop} = this.props;
    if (videoElem.current >= stop) {
      videoElem.currentTime = start;
    }
  }

  render() {
    const {image, video, src, start, stop, className} = this.props;
    return image
      ? (
        <img
          className={classNames(styles.image, className)}
          src={src}
        />
      )
      : (
        <video
          ref={this.videoRef}
          className={classNames(styles.video, className)}
          src={video ? video.src : src}
          autoPlay
          loop
          controls
          playsInline
          onTimeUpdate={video ? this.limitVideo : (isNumber(start) && isNumber(stop)) ? this.limitSrc : noop}
        />
      );
  }
}
