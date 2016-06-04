import {FieldSchema, PrimitiveType} from '../src/schema';
import {Query} from '../src/query';

declare var d3: any;
declare var vg: any;
declare var vl: any;
declare var cql: any;

const data = vg.util.json('node_modules/vega-datasets/data/cars.json');
const types = vg.util.type.inferAll(data);
const fieldSchemas: FieldSchema[] = vg.util.keys(types).map(function(field) {
  const primitiveType = types[field];
  const type = primitiveType === 'number' || primitiveType === 'integer' ? 'quantitative' :
    primitiveType === 'date' ? 'temporal' : 'nominal';
  console.log('schema', field, type, primitiveType);
  return {
    field: field,
    type: type,
    primitiveType: types[field] as PrimitiveType
  };
});
const schema = new cql.schema.Schema(fieldSchemas);
const summary = vg.util.summary(data);
const stats = new cql.stats.Stats(summary);

function generate(query: Query) {
  const config = cql.util.extend({verbose: true}, query.config);
  const answerSet = cql.generate(query.spec, schema, stats, config);

  const sel = d3.select('#list').selectAll('div.vis')
    .data(answerSet);
  sel.enter()
    .append('div')
    .attr('class', 'vis')
    .text((model) => model.toShorthand())
    .append('div')
    .attr('id', (_, index) => 'vis-' + index);

  sel.each((model, index) => {
      const spec = model.toSpec({
        url: 'node_modules/vega-datasets/data/cars.json'
      });
      const vgSpec = vl.compile(spec).spec;
      vg.parse.spec(vgSpec, function(chart) {
        chart({el: '#vis-' + index}).update();
      });
    });

  sel.exit().remove();
}

d3.select('#query').text(JSON.stringify({
  spec: {
    mark: '?',
    encodings: [
      {channel: '?', field: {enumValues: ['Cylinders', 'Origin']}, type: '?'},
      // {channel: '*', field: '*', type:'*'},
      // {channel: '*', field: '*', type:'*'}
    ]
  },
  config: {}
}, null, '  '));

d3.select('#parse')
  .on('click', function() {
    const query = JSON.parse(d3.select('#query').node().value);
    generate(query);
  });
