import * as React from 'react';
import { useParams } from 'react-router-dom';

function Play() {
  let { id } = useParams();

  return (
    <div
      style={{
        backgroundColor: '#fff',
      }}
    >
      <h3>Play: {id}</h3>
    </div>
  );
}

export default Play;
