import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleOpen = e => {
    e.stopPropagation();
    this.setState({isOpen: !this.state.isOpen});
  }

  render() {
    const {isOpen} = this.state;
    const {selected, children, className} = this.props;
    return (
      <div className={classNames(styles.container, className)} onClick={this.toggleOpen}>
        {selected}
        <div className={classNames(styles.options, !isOpen && styles.closed)}>
          {isOpen && children}
        </div>
      </div>
    );
  }
}
