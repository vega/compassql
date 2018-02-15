import React, { Component } from 'react';
import './Display.css';
import Model from './model';
import Recommender from './recommender';
import Visualization from './Visualization';

class Display extends Component {
  constructor(props) {
    super(props);
    this.recommender = new Recommender(this.props.schema.getCqlSchema());
  }

  render() {
    if (this.props.fieldTypes.length === 0) {
      return null;
    }

    const model = new Model(
      this.props.data,
      this.props.schema,
      this.props.fieldTypes,
      this.props.fieldAggregates,
      this.props.fieldBins
    );
    const query = model.generate();

    const results = this.recommender.generate(query);

    const visualizations = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      visualizations.push(
        <Visualization key={i} id={i} vlSpec={result.spec} score={result.score}/>
      );
    }

    return (
      <div className="Display">
        {visualizations}
      </div>
    );
  }
}

export default Display;