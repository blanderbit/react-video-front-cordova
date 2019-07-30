import React from 'react';
import {observable, action} from 'mobx';

export class OverlayStore {
  @observable overlayContent = []

  @action closeOverlay = () => this.overlayContent.pop();

  @action destroyOverlay = () => this.overlayContent = [];

  @action openOverlay = Content => props => () => {
    this.overlayContent.push(<Content onClose={this.closeOverlay} {...props} />);
  }

  @observable toastActive = false;
  @observable toastContent = null;

  @action hideToast = () => {
    this.toastContent = null;
    this.toastActive = false;
  }

  @action showToast = content => () => {
    this.toastContent = content;
    this.toastActive = true;
    setTimeout(this.hideToast, 5000);
  }

}

export default OverlayStore;
