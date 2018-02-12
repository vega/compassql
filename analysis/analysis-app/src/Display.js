import React, { Component } from 'react';
import './Display.css';
import Model from './model';
import Recommender from './recommender';
import { vl2svg } from './util';

class Display extends Component {
  constructor(props) {
    super(props);
    this.recommender = new Recommender();
    this.state = {
      loaded: false,
      svg: null
    }
  }

  render() {
    if (this.props.fieldTypes.length === 0) {
      return null;
    }

    if (this.state.loaded) {
      this.state.loaded = false;
      return <span dangerouslySetInnerHTML={{__html: this.state.svg}} />;
    } else {
      this.state.loaded = false;

      const model = new Model(
        this.props.data,
        this.props.schema,
        this.props.fieldTypes,
        this.props.fieldAggregates,
        this.props.fieldBins
      );

      const query = model.generate();
      const result = this.recommender.generate(query);

      vl2svg(result[0], (svg) => {
        this.setState({
          loaded: true,
          svg: svg
        });
      });

      return null;
    }
  }
}

export default Display;