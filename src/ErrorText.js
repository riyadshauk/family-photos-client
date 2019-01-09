// @flow
import React from 'react';
import errorStyles from './ErrorText.css';
type Props = {
  text: string
};
const ErrorText = (props: Props) => {
  return (
    <p className={errorStyles.color}>
      { props.text }
    </p>
  );
};
export default ErrorText;