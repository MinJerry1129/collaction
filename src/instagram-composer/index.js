// export {default as MediaComposer} from './screen/MediaComposer/MediaComposer';
import React from 'react';
import MediaComposer from './screen/MediaComposer/MediaComposer';

export default function (props) {
  const { visible } = props;

  return visible && <MediaComposer {...props} />;
}
