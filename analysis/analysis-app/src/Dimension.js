import React, { Component } from 'react';
import './Dimension.css';
import removeSvg from './ic_remove.svg';

const classnames = require('classnames');

class Dimension extends Component {
  constructor(props) {
    super(props);
  }

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
        <img className="remove-icon" src={removeSvg}/>
      </div>
    );

    const fieldTypes = [];
    if (this.props.fieldTypeLocked) {
      fieldTypes.push(
        <li className="field-item selected" onClick={() => {
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
          <li className="option-item selected" onClick={() => {
            this.props.setFieldTransformationLock(this.props.id, false);
          }}>
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

  //   const choices = [];
  //   if (this.state.hasFieldSelected) {
  //     choices.push(
  //       <li className="field-item selected" onClick={() => {
  //         this.setState({hasOptionSelected: false});
  //         this.allowFieldSelection();
  //         this.allowTransformationSelection();
  //       }}>
  //         {this.props.fieldType}
  //       </li>
  //     );
  //   } else {
  //     for (const fieldType of this.state.displayFields) {
  //       const choiceClasses = classnames({
  //         'field-item': true,
  //         'selected': fieldType === this.props.fieldType,
  //       });
  //       const choice = (
  //         <li className={choiceClasses}
  //             key={choices.length}
  //             onClick={() => {this.lockInFieldType(fieldType);}}>
  //           {fieldType}
  //         </li>
  //       );
  //       choices.push(choice);
  //     }
  //   }

  //   const fieldTypes = <ul className="field-list">{choices}</ul>

  //   let fieldTransformations;
  //   const transformations = []
  //   if (this.props.fieldType !== null) {
  //     if (this.state.hasOptionSelected) {
  //       transformations.push(
  //         <li className="option-item selected" onClick={() => { this.allowTransformationSelection(); }}>
  //           {this.props.fieldTransformation}
  //         </li>
  //       );
  //     } else {
  //       console.log(this.props.fieldType);
  //       for (const transformation of FIELD_TRANSFORMATIONS[this.props.fieldType]) {
  //         if (FIELD_TRANSFORMATIONS[this.props.fieldType].length == 1) {
  //           // TODO: figure out what to do here
  //           // this.state.selectedTransformation = transformation;
  //           // this.state.hasOptionSelected = true;
  //         }
  //         const optionClass = classnames({
  //           'option-item': true,
  //           'selected': transformation === this.props.fieldTransformation
  //         });
  //         transformations.push(
  //           <li className={optionClass}
  //               key={options.length}
  //               onClick={() => { this.lockInTransformation(transformation); }}>
  //             {transformation}
  //           </li>
  //         )
  //       }
  //     }
  //   }

  //   fieldTransformations = (
  //     <ul className="field-options">
  //       {transformations}
  //     </ul>
  //   );

  //   return (
  //     <div className="Dimension">
  //       {id}
  //       {fieldTypes}
  //       {fieldTransformations}
  //       {remove}
  //     </div>
  //   );
  // }

  // lockInFieldType(fieldType) {
  //   if (this.state.selectedField !== fieldType) {
  //     this.setState({
  //       hasOptionSelected: false,
  //     });

  //     this.props.setFieldType(this.props.id, fieldType);
  //     this.props.setFieldTransformation(this.props.id, null);
  //   }
  //   this.setState({
  //     hasFieldSelected: true,
  //   });
  // }

  // allowFieldSelection() {
  //   this.setState({
  //     hasFieldSelected: false
  //   });
  // }

  // lockInTransformation(transformation) {
  //   this.props.setFieldTransformation(
  //     this.props.id, transformation
  //   );

  //   this.setState({
  //     hasOptionSelected: true,
  //     hasFieldSelected: true,
  //   });
  // }

  // allowTransformationSelection() {
  //   this.setState({
  //     hasOptionSelected: false
  //   });
  // }
}

export default Dimension;
