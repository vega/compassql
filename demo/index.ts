import {FieldSchema, PrimitiveType} from '../src/schema';
import {SpecQuery} from '../src/query';

declare var d3: any;
declare var vg: any;
declare var cql: any;

var query: SpecQuery = {
  mark: '*',
  encodings: [
    {channel: '*', field: {enumValues: ['Name', 'Origin']}, type:'*'},
    // {channel: '*', field: '*', type:'*'},
    // {channel: '*', field: '*', type:'*'}
  ]
};

d3.json('node_modules/vega-datasets/data/cars.json', function(data) {
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

  const answerSet = cql.generate(query, schema).map((answer) => answer.toSpec());
  console.log(answerSet.map((spec) => JSON.stringify(spec)));
  d3.select('#list').selectAll('div.vis')
    .data(answerSet)
    .enter()
    .append('div')
    .attr('class', 'vis')
    .text((spec) => JSON.stringify(spec));

});