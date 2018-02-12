import React, { Component } from 'react';
import './Display.css';
import Model from './model';

class Display extends Component {
  render() {
    if (this.props.fieldTypes.length === 0) {
      return null;
    }

    const model = new Model(this.props.data, this.props.schema, this.props.fieldTypes);
    const query = model.generate();
    delete query.spec['data'];

    return (
      <div className="display">
        {JSON.stringify(query)}
      </div>
    );
  }
}

export default Display;