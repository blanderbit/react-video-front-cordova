import React, {Component} from 'react';
import Swipeable from 'react-swipeable';
import classNames from 'classnames';
import styles from './styles.scss';

export default class VerticalRange extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      height: 1,
      offset: 0,
    };
  }

  componentDidMount() {
    this.setState({height: this.ref.current.offsetHeight});
  }

  clearOffsets = () => this.setState({offset: 0})

  swiping = (e, _, deltaY) => {
    const {value, limits: [min, max]} = this.props;
    const {height} = this.state;
    const adjustedDeltaY = deltaY / height * max;

    if(value - adjustedDeltaY > max) {
      this.setState({offset: max});
    } else if(value - adjustedDeltaY < min) {
      this.setState({offset: min});
    } else {
      this.setState({offset: this.props.value - deltaY});
    }
  }

  onChange = (e, _, deltaY) => {
    e.preventDefault();
    const {value, limits: [min, max]} = this.props;
    const {height} = this.state;
    const adjustedDeltaY = deltaY / height * max;

    if (value - adjustedDeltaY < min) {
      this.props.onChange(min);
    } else if (value - adjustedDeltaY > max) {
      this.props.onChange(max);
    } else {
      this.props.onChange(value - adjustedDeltaY);
    }

    this.clearOffsets();
  }

  render() {
    const {value, limits: [min, max], className} = this.props;
    const {height, offset} = this.state;
    return (
      <div ref={this.ref} className={classNames(styles.container, className)}>
        <Swipeable
          trackMouse
          className={styles.ball}
          onSwiping={this.swiping}
          onSwiped={this.onChange}
          style={{transform: `translateY(${(value / max * height) + offset}px)`}}
        />
      </div>
    );
  }
}
