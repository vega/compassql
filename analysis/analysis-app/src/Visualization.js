import React, { Component } from 'react';
import { vl2svg } from './util';

import './Visualization.css';

class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      svg: null,
    };
  }
  render() {
    if (this.state.loading) {
      vl2svg(this.props.vlSpec).then(
        (svg) => {
          this.setState({
            loading: false,
            svg: svg,
          });
        }
      );

      return null;
    } else {
      this.state.loading = true;
      return (
        <div className="Visualization">
          <div>
            <span dangerouslySetInnerHTML={{__html: this.state.svg}} />
          </div>
          <div className="score-box">
            score: {this.props.score}
          </div>
        </div>
      );
    }
  }
}

export default Visualization;