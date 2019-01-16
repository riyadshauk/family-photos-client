// @flow
import React, { Component } from 'react';
type Props = {
  src: string,
  className: string,
  onLoad: Function,
  onError: Function,
};
type State = {};
/**
 * @see https://medium.com/walmartlabs/lazy-loading-images-intersectionobserver-8c5bff730920
 */
class LazyImage extends Component<Props, State> {
  observer: ?IntersectionObserver;
  element: HTMLImageElement;
  componentDidMount() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          this.element.src = this.props.src;
          this.observer = this.observer.disconnect(); // sets this.observer to undefined
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px 200px 0px', // start loading before scrolling the image into the viewport
      threshold: 1.0,
    });

    this.observer.observe(this.element);
  }
  render() {
    const { className, onLoad, onError } = this.props;
    return (
      <div> {/* ensure each image is on new line so that they aren't all in the viewport at once (@todo more elegantly?) */}
        <img className={className} onLoad={onLoad} onError={onError} ref={el => this.element = el} />
      </div>
    );
  }
}
export default LazyImage;