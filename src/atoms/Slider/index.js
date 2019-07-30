import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import Swipeable from 'react-swipeable';
import styles from './styles.scss';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      width: 1,
    };
  }

  componentDidMount() {
    const {min, max} = this.props;
    this.setState({width: this.ref.current.offsetWidth}, () =>
      this.setState({
        deltaPerPixel: (max - min) / this.state.width,
        pixelsPerUnit: this.state.width / (max - min)
      })
    );
  }

  onSwiping = (e, deltaX) => {
    const {value, min, max} = this.props;
    const {deltaPerPixel} = this.state;
    const newOffset = -deltaX * deltaPerPixel;
    const newValue = newOffset + value;

    if (newValue > max || newValue < min) {
      return;
    }

    this.props.onSwiping(newOffset);
  }

  onSwiped = () => this.props.onSwiped()

  render() {
    const {value, offset, min, max} = this.props;
    const {pixelsPerUnit} = this.state;
    const transform = pixelsPerUnit * (value + offset) - (min * pixelsPerUnit);
    return (
      <div ref={this.ref} className={styles.container}>
        <div className={styles.timestamps}>
          <div className={styles.timestamp}>{min.toFixed(2)}s</div>
          <div className={styles.timestamp}>{max.toFixed(2)}s</div>
        </div>
        <div className={styles.wrapper}>
          <Swipeable
            trackMouse
            className={styles.ball}
            onSwiping={this.onSwiping}
            onSwiped={this.onSwiped}
            style={{transform: `translateX(${transform - 22}px)`}}
          >
          </Swipeable>
        </div>
      </div>
    );
  }
}
