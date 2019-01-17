// @flow
import React, { Component, Fragment } from 'react';
import { errorLogger, fetchEXIFData, getOrientationDegrees } from '../helpers';
type Props = {
  src: string,
  className: string,
};
type State = {
  orientation: number,
  date: string
};
/**
 * @see https://medium.com/walmartlabs/lazy-loading-images-intersectionobserver-8c5bff730920
 */
class LazyImage extends Component<Props, State> {
  observer: ?IntersectionObserver;
  element: HTMLImageElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      orientation: 0,
      date: ''
    };
  }
  componentDidMount() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        const { isIntersecting } = entry;
        if (isIntersecting) {
          try {
            const imageURL = this.props.src;
            const exifData = await fetchEXIFData(imageURL + `&q=exif`);
            if (exifData.image && exifData.exif) {
              const orientation = getOrientationDegrees(exifData.image.Orientation);
              const date = exifData.exif.DateTimeOriginal;
              this.setState({ orientation, date });
            }
          } catch (err) {
            errorLogger(err.stack);
          }
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
    const { className } = this.props;
    const transformRotationValue = `rotate(${360 - this.state.orientation}deg)`;
    const styles = {
      '-webkit-transform': transformRotationValue,
      '-moz-transform':    transformRotationValue,
      '-ms-transform':     transformRotationValue,
      '-o-transform':      transformRotationValue,
      transform:           transformRotationValue,
      height:              '500px',
    }
    return (
      <Fragment>
        <p>
          Date: {this.state.date}
        </p>
        <img alt={this.state.date} className={className} style={styles} ref={el => this.element = el} />
      </Fragment>
    );
  }
}
export default LazyImage;