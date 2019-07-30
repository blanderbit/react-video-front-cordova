import React, {Component} from 'react';
import styles from './styles.scss';
import {Range} from '../../atoms';
import FontAwesome from 'react-fontawesome';
import {noop} from 'lodash-es';

export default class Trimmer extends Component {

  constructor(props) {
    super(props);
    this.videoRef = props.videoRef || React.createRef();
    this.state = {
      start: props.video.inpoint,
      stop: props.video.outpoint,
      lastChanged: null
    };
  }

  componentDidMount() {
    this.props.onChange(this.state.start, this.state.stop);
  }

  setTrim = ([start, stop]) => {
    const lastChanged = start === this.state.start ? 'stop' : 'start';
    this.videoRef.current.currentTime = lastChanged === 'start' ? start : stop;
    this.setState({
      start,
      stop,
      lastChanged
    }, this.props.onChange(start, stop));
  }

  pause = () => this.videoRef.current.pause()

  play = () => {
    this.videoRef.current.currentTime = this.state.start;
    this.videoRef.current.play();
  }

  limitVideo = e => e.target.currentTime >= this.state.stop && this.pause()

  increment = () => {
    const {start, stop, lastChanged} = this.state;
    const {video} = this.props;
    if(lastChanged) {
      lastChanged === 'start' && start + 0.1 < stop && this.setTrim([start + 0.1, stop]);
      lastChanged === 'stop' && stop + 0.1 < video.seconds && this.setTrim([start, stop + 0.1]);
    }
  }

  decrement = () => {
    const {start, stop, lastChanged} = this.state;
    const {video} = this.props;
    if(lastChanged) {
      lastChanged === 'start' && start - 0.1 > 0 && this.setTrim([start - 0.1, stop]);
      lastChanged === 'stop' && stop - 0.1 > start && this.setTrim([start, stop - 0.1]);
    }
  }

  render() {
    const {video, overlay, onVideoLoaded} = this.props;
    const {start, stop} = this.state;
    const max = video.seconds;
    return (
      <React.Fragment>
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            ref={this.videoRef}
            src={video.src}
            playsInline
            autoPlay
            onTimeUpdate={this.limitVideo}
            onCanPlayThrough={onVideoLoaded || noop}/>
          {overlay}
        </div>
        <div className={styles.controls}>
          <FontAwesome name="minus" onClick={this.decrement} />
          <FontAwesome name="pause" onClick={this.pause}/>
          <FontAwesome name="play" onClick={this.play}/>
          <FontAwesome name="plus" onClick={this.increment} />
        </div>
        <Range value={[start, stop]} limits={[0, max]} onChange={this.setTrim}/>
      </React.Fragment>
    );
  }
}
