import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Segment extends Component {

  static defaultProps = {
    condition: true
  }

  renderElement = child => {
    if (!child || (child.props && child.props.noRender) || this.props.hideChildren) {
      return null;
    }
    return (
      <div className={classNames(styles.element, this.props.elementClassName)}>
        {child}
      </div>
    );
  }

  render() {
    const {title, hideChildren, children, condition, className} = this.props;
    return condition
      ? (
        <div className={classNames(styles.container, className)}>
          <div className={styles.title}>{title}</div>
          <div className={classNames(styles.content, hideChildren && styles.hidden)}>
            {React.Children.map(children, this.renderElement)}
          </div>
        </div>
      )
      : null;
  }
}
