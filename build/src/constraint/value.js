import { Property } from '../property';
import { PropIndex } from '../propindex';
import { contains } from '../util';
import { EncodingConstraintModel } from './base';
export const VALUE_CONSTRAINTS = [
    {
        name: 'doesNotSupportConstantValue',
        description: 'row, column, x, y, order, and detail should not work with constant values.',
        properties: [Property.TYPE, Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: (valueQ, _, __, ___) => {
            return !(contains(['row', 'column', 'x', 'y', 'detail', 'order'], valueQ.channel));
        }
    }
].map((ec) => new EncodingConstraintModel(ec));
export const VALUE_CONSTRAINT_INDEX = VALUE_CONSTRAINTS.reduce((m, ec) => {
    m[ec.name()] = ec;
    return m;
}, {});
export const VALUE_CONSTRAINTS_BY_PROPERTY = VALUE_CONSTRAINTS.reduce((index, c) => {
    for (const prop of c.properties()) {
        index.set(prop, index.get(prop) || []);
        index.get(prop).push(c);
    }
    return index;
}, new PropIndex());
//# sourceMappingURL=value.js.map