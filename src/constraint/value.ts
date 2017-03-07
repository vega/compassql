import {QueryConfig} from '../config';
import {Property} from '../property';
import {PropIndex} from '../propindex';
import {Wildcard} from '../wildcard';
import {Schema} from '../schema';
import {contains} from '../util';

import {ValueQuery} from '../query/encoding';
import {EncodingConstraintModel, EncodingConstraint} from './base';

export const VALUE_CONSTRAINTS: EncodingConstraintModel<ValueQuery>[] = [
  {
    name: 'doesNotSupportConstantValue',
    description: 'row, column, x, y, and detail should not work with constant values.',
    properties: [Property.TYPE, Property.AGGREGATE],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (valueQ: ValueQuery, _: Schema, __: PropIndex<Wildcard<any>>, ___: QueryConfig) => {

     return !(contains(['row', 'column', 'x', 'y', 'detail'], valueQ.channel));
    }
  }
].map((ec: EncodingConstraint<ValueQuery>) => new EncodingConstraintModel<ValueQuery>(ec));

export const VALUE_CONSTRAINT_INDEX: {[name: string]: EncodingConstraintModel<ValueQuery>} =
  VALUE_CONSTRAINTS.reduce((m, ec: EncodingConstraintModel<ValueQuery>) => {
    m[ec.name()] = ec;
    return m;
  }, {});

export const VALUE_CONSTRAINTS_BY_PROPERTY =
  VALUE_CONSTRAINTS.reduce((index, c) => {
    for (const prop of c.properties()) {
      index.set(prop, index.get(prop) || []);
      index.get(prop).push(c);
    }

    return index;
  }, new PropIndex<EncodingConstraintModel<ValueQuery>[]>());
