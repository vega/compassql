import React, { Component } from 'react';
import './Dimension.css';
import removeSvg from './ic_remove.svg';

const classnames = require('classnames');

class Dimension extends Component {
  render() {
    const id = (
      <div className="id">
        {this.props.id}
      </div>
    );

    const remove = (
      <div className="remove" onClick={() => {
        this.props.removeDimension(this.props.id);
      }}>
        <img className="remove-icon" src={removeSvg} alt="remove icon"/>
      </div>
    );

    const fieldTypes = [];
    if (this.props.fieldTypeLocked) {
      fieldTypes.push(
        <li className="field-item selected" key={0} onClick={() => {
          // allow for rechoosing
          this.props.setFieldTypeLock(this.props.id, false);
        }}>
          {this.props.fieldType}
        </li>
      );
    } else {
      for (const fieldType of this.props.fieldTypes) {
        const fieldTypeClasses = classnames({
          'field-item': true,
          'selected': fieldType === this.props.fieldType,
        });

        fieldTypes.push(
          <li className={fieldTypeClasses}
              key={fieldTypes.length}
              onClick={() => {
                // lock in selection
                this.props.setFieldType(this.props.id, fieldType);
                this.props.setFieldTypeLock(this.props.id, true);
              }}>
            {fieldType}
          </li>
        );
      }
    }

    const fieldTransformations = [];
    if (this.props.fieldType !== null) {
      if (this.props.fieldTransformationLocked) {
        fieldTransformations.push(
          <li className="option-item selected"
            key={0}
            onClick={() => {
              this.props.setFieldTransformationLock(this.props.id, false);
            }}
          >
            {this.props.fieldTransformation}
          </li>
        );
      } else {
        for (const transformation of this.props.fieldTransformations[this.props.fieldType]) {
          const classes = classnames({
            'option-item': true,
            'selected': transformation === this.props.fieldTransformation
          });
          fieldTransformations.push(
            <li className={classes}
                key={fieldTransformations.length}
                onClick={() => {
                  this.props.setFieldTransformation(this.props.id, transformation);
                  this.props.setFieldTransformationLock(this.props.id, true);
                }}>
              {transformation}
            </li>
          )
        }
      }
    }

    return (
      <div className="Dimension">
        {id}
        <ul className="field-list">
          {fieldTypes}
        </ul>
        <ul className="transformation-list">
          {fieldTransformations}
        </ul>
        {remove}
      </div>
    );
  }
}

export default Dimension;
