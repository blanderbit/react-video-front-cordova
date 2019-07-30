import React, {Component} from 'react';
import {php} from '../../stores';
import {Modal} from '../';
import {isEmpty, noop} from 'lodash-es';
import FontAwesome from 'react-fontawesome';
import classNames from 'classnames';
import styles from './styles.scss';

export default class Blurring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faces: [],
      selectedFaces: [],
      pending: false
    };
  }

  componentDidMount() {
    php.get(`/blurring/detectfaces/${this.props.video.id}`)
    .then(faces => this.setState({faces}));
    this.setState({
      faces: [
        {id: 1},
        {id: 2},
        {id: 3}
      ]
    });
  }

  modalActions = [
    {
      label: 'Cancel',
      func: this.props.onClose
    },
    {
      label: 'Save',
      func: noop
    }
  ]

  blurFaces = () => !isEmpty(this.state.selectedFaces)
    && php.post()

  toggleSelectFace = id => () => this.setState({
    selectedFaces: this.state.selectedFaces.includes(id)
      ? this.state.selectedFaces.filter(x => x !== id)
      : [...this.state.selectedFaces, id]
  })

  renderFace = ({id}) => {
    const selected = this.state.selectedFaces.includes(id);
    return (
      <div className={styles.face} onClick={this.toggleSelectFace(id)}>
        <FontAwesome
          className={classNames(styles.check, selected && styles.active)}
          name="check"
        />
      </div>
    );
  }

  renderFaces = () => {
    const {faces, selectedFaces, pending} = this.state;
    return (
      <div className={styles.faces}>
        {isEmpty(faces)
          ? 'Loading faces...'
          : faces.map(this.renderFace)
        }
        <div
          className={classNames(styles.button, !isEmpty(selectedFaces) && styles.active)}
          onClick={this.blurFaces}
        >
          {pending ? 'Blurring faces...' : 'Process'}
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal actions={this.modalActions}>
        {this.renderFaces()}
      </Modal>
    );
  }
}
