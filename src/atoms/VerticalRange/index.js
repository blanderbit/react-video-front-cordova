import React, {Component} from 'react';
import {isNumber} from 'lodash-es';
import Swipeable from 'react-swipeable';
import classNames from 'classnames';
import styles from './styles.scss';

export default class VerticalRange extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      height: 1,
      startOffset: 0,
      stopOffset: 0
    };
  }

  componentDidMount() {
    this.setState({height: this.ref.current.offsetHeight});
  }

  clearOffsets = () => this.setState({startOffset: 0, stopOffset: 0})

  swiping = index => (e, _, deltaY) => {
    index === 0
      ? this.setState({startOffset: deltaY})
      : this.setState({stopOffset: deltaY});
  }

  onChange = index => (e, _, deltaY) => {
    const {value: [start, stop], limits: [min, max]} = this.props;
    const {height} = this.state;
    const adjustedDeltaY = deltaY / height * max;

    if (index === 0 && start - adjustedDeltaY < min) {
      this.props.onChange([min, stop]);
    } else if (index === 1 && stop - adjustedDeltaY > max) {
      this.props.onChange([start, max]);
    } else if (index === 0) {
      this.props.onChange([start - adjustedDeltaY, stop]);
    } else if (index === 1) {
      this.props.onChange([start, stop - adjustedDeltaY]);
    }

    this.clearOffsets();

  }

  render() {
    const {value: [start, stop], limits: [min, max]} = this.props;
    const {height, startOffset, stopOffset} = this.state;
    return (
      <div ref={this.ref} className={styles.container}>
        <div
          className={styles.selection}
          style={{
            height: `${(stop - start) / max * height}px`,
            transform: `translateY(${start / max * height}px)`
          }}
        />
        <Swipeable
          trackMouse
          className={classNames(styles.ball, styles.top)}
          onSwiping={this.swiping(0)}
          onSwiped={this.onChange(0)}
          style={{transform: `translateY(${(start / max * height) - startOffset}px)`}}

        />
        <Swipeable
          trackMouse
          className={classNames(styles.ball, styles.bottom)}
          onSwiping={this.swiping(1)}
          onSwiped={this.onChange(1)}
          style={{transform: `translateY(${(stop / max * height) - stopOffset}px)`}}

        />
      </div>
    );
  }
}
