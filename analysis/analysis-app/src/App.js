import React, { Component } from 'react';
import './App.css';

import Dimension from './Dimension';
import Display from './Display';
import Schema from './schema';

const carsSchema = require('./cars.schema.json');
const carsData = require('./cars.json');

const DEFAULT_DIMENSION_CONFIG = {
  fieldType: null,
  fieldTransformation: null,
  fieldTypeLocked: false,
  fieldTransformationLocked: false,
};

const FIELD_TYPES = ['Quantitative', 'Temporal', 'Ordinal', 'Nominal']
const FIELD_TRANSFORMATIONS = {
  'Quantitative': ['None', 'Bin', 'Mean', 'Sum'],
  'Temporal': ['None', 'Bin'],
  'Ordinal': ['None'],
  'Nominal': ['None']
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: []
    }

    this.schema = new Schema(carsSchema);
    this.data = carsData;
  }

  render() {
    const dimensionComponents = [];
    for (let i = 0; i < this.state.dimensions.length; i++) {
      const dimensionState = this.state.dimensions[i];

      dimensionComponents.push(
        <Dimension key={i}
          id={i}
          fieldType={dimensionState.fieldType}
          fieldTransformation={dimensionState.fieldTransformation}
          fieldTypeLocked={dimensionState.fieldTypeLocked}
          fieldTransformationLocked={dimensionState.fieldTransformationLocked}
          setFieldType={this.setFieldType.bind(this)}
          setFieldTypeLock={this.setFieldTypeLock.bind(this)}
          setFieldTransformation={this.setFieldTransformation.bind(this)}
          setFieldTransformationLock={this.setFieldTransformationLock.bind(this)}
          removeDimension={this.removeDimension.bind(this)}
          fieldTypes={FIELD_TYPES}
          fieldTransformations={FIELD_TRANSFORMATIONS}
        />
      )
    }

    const dimensions = (
      <ul className="dimension-list">
        {dimensionComponents}
      </ul>
    );

    const fieldTypes = [];
    for (const dimension of this.state.dimensions) {
      if (dimension.fieldType !== null) {
        fieldTypes.push(dimension.fieldType.toLowerCase());
      }
    }

    const display = (
      <Display
        schema={this.schema}
        data={this.data}
        fieldTypes={fieldTypes}
      />
    );

    return (
      <div className="App">
        <div className="dashboard">
          {dimensions}
          <div className="add-dimension-button-container">
            <div className="add-dimension-button" onClick={this.addDimension.bind(this)}>
              Add a Dimension
            </div>
          </div>
        </div>
        <div className="display">
          {display}
        </div>
      </div>
    );
  }

  addDimension() {
    const dimensions = this.state.dimensions.slice(0);
    dimensions.push(Object.assign({}, DEFAULT_DIMENSION_CONFIG));
    this.setState({
      dimensions: dimensions,
    });
  }

  setFieldType(id, fieldType) {
    const dimension = this.state.dimensions[id];
    if (fieldType !== dimension.fieldType) {
      this.setFieldTransformation(id, null);
      this.setFieldTransformationLock(id, false);
    }

    dimension.fieldType = fieldType;

    if (FIELD_TRANSFORMATIONS[fieldType].length === 1) {
      this.setFieldTransformation(id, 'None');
      this.setFieldTransformationLock(id, true);
    }
    this.forceUpdate();
  }

  setFieldTransformation(id, fieldTransformation) {
    const dimension = this.state.dimensions[id];
    dimension.fieldTransformation = fieldTransformation;
    this.forceUpdate();
  }

  setFieldTypeLock(id, lock) {
    const dimension = this.state.dimensions[id];
    dimension.fieldTypeLocked = lock;
    this.forceUpdate();
  }

  setFieldTransformationLock(id, lock) {
    const dimension = this.state.dimensions[id];
    dimension.fieldTransformationLocked = lock;
    this.forceUpdate();
  }

  removeDimension(id) {
    this.state.dimensions.splice(id, 1);
    this.forceUpdate();
  }
}

export default App;
