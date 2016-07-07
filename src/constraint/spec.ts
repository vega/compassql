import {SUM_OPS} from 'vega-lite/src/aggregate';
import {Channel, NONSPATIAL_CHANNELS, supportMark} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {ScaleType} from 'vega-lite/src/scale';
import {Type} from 'vega-lite/src/type';

import {AbstractConstraint, AbstractConstraintModel} from './base';

import {QueryConfig} from '../config';
import {SpecQueryModel, EnumSpecIndexTuple} from '../model';
import {Property} from '../property';
import {Schema} from '../schema';
import {ScaleQuery, EncodingQuery, isEnumSpec, isMeasure} from '../query';
import {contains, every, some} from '../util';


export interface SpecConstraintChecker {
  (specM: SpecQueryModel, schema: Schema, opt: QueryConfig): boolean;
}

export class SpecConstraintModel extends AbstractConstraintModel {
  constructor(specConstraint: SpecConstraint) {
    super(specConstraint);
  }

  public satisfy(specM: SpecQueryModel, schema: Schema, opt: QueryConfig) {
    // TODO: Re-order logic to optimize the "requireAllProperties" check

    if (this.constraint.requireAllProperties) {
      // TODO: extract as a method and do unit test
      const hasRequiredPropertyAsEnumSpec = some(this.constraint.properties,
        (prop) => {
          switch(prop) {
            // Mark
            case Property.MARK:
              return isEnumSpec(specM.getMark());

            // TODO: transform

            // Encoding properties
            case Property.CHANNEL:
            case Property.AGGREGATE:
            case Property.AUTOCOUNT:
            case Property.BIN:
            case Property.SCALE:
            case Property.TIMEUNIT:
            case Property.FIELD:
            case Property.TYPE:
              // If there is property that is enumSpec, we return true as
              // we cannot check the constraint yet!
              return some(specM.getEncodings(), (encQ) => {
                return isEnumSpec(encQ[prop]);
              });
            default:
              /* istanbul ignore next */
              throw new Error('Unimplemented');
          }
        }
      );
      // If one of the required property is still an enum spec, do not check the constraint yet.
      if (hasRequiredPropertyAsEnumSpec) {
        return true; // Return true since the query still satisfy the constraint.
      }
    }
    return (this.constraint as SpecConstraint).satisfy(specM, schema, opt);
  }
}

export interface SpecConstraint extends AbstractConstraint {
  /** Method for checking if the spec query satisfies this constraint. */
  satisfy: SpecConstraintChecker;
}

export const SPEC_CONSTRAINTS: SpecConstraintModel[] = [
  {
    name: 'noRepeatedChannel',
    description: 'Each encoding channel should only be used once.',
    properties: [Property.CHANNEL],
    requireAllProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      let usedChannel = {};

      // channel for all encodings should be valid
      return every(specM.getEncodings(), (encQ) => {
        if (!isEnumSpec(encQ.channel)) {
          // If channel is specified, it should no be used already
          if (usedChannel[encQ.channel]) {
            return false;
          }
          usedChannel[encQ.channel] = true;
          return true;
        }
        return true; // unspecified channel is valid
      });
    }
  },
  {
    name: 'autoAddCount',
    description: 'Automatically adding count only for plots with only ordinal, binned quantitative, or temporal with timeunit fields.',
    properties: [Property.BIN, Property.TIMEUNIT, Property.TYPE, Property.AUTOCOUNT],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const hasAutoCount =  some(specM.getEncodings(), (encQ: EncodingQuery) => encQ.autoCount === true);

      if (hasAutoCount) {
        // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
        return every(specM.getEncodings(), (encQ: EncodingQuery) => {
          if (encQ.autoCount !== undefined) {
            return true;
          }
          switch (encQ.type) {
            case Type.QUANTITATIVE:
              return !!encQ.bin;
            case Type.TEMPORAL:
              return !!encQ.timeUnit;
            case Type.ORDINAL:
            case Type.NOMINAL:
              return true;
          }
          /* istanbul ignore next */
          throw new Error('Unsupported Type');
        });
      } else {
        const neverHaveAutoCount = every(specM.enumSpecIndex.autoCount, (indexTuple: EnumSpecIndexTuple<boolean>) => {
          return !isEnumSpec(specM.getEncodingQueryByIndex(indexTuple.index).autoCount);
        });
        if (neverHaveAutoCount) {
          // If the query surely does not have autoCount
          // then one of the field should be
          // (1) unbinned quantitative
          // (2) temporal without time unit
          // (3) nominal or ordinal field
          // or at least have potential to be (still ambiguous).
          return some(specM.getEncodings(), (encQ: EncodingQuery) => {
            if (encQ.type === Type.QUANTITATIVE) {
              if (encQ.autoCount === false) {
                return false;
              } else {
                return !encQ.bin || isEnumSpec(encQ.bin);
              }
            } else if (encQ.type === Type.TEMPORAL) {
              return !encQ.timeUnit || isEnumSpec(encQ.timeUnit);
            }
            return false; // nominal or ordinal
          });
        }
      }

      return true; // no auto count, no constraint
    }
  },
  {
    name: 'channelPermittedByMarkType',
    description: 'Each encoding channel should be supported by the mark type',
    properties: [Property.CHANNEL, Property.MARK],
    requireAllProperties: false, // only require mark
    strict: true,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const mark = specM.getMark();

      // if mark is unspecified, no need to check
      if (isEnumSpec(mark)) return true;

      // TODO: can optimize this to detect only what's the changed property if needed.
      return every(specM.getEncodings(), (encQ) => {
        // channel unspecified, no need to check
        if (isEnumSpec(encQ.channel)) return true;

        return supportMark(encQ.channel, mark as Mark);
      });
    }
  },
  {
    name: 'hasAllRequiredChannelsForMark',
    description: 'All required channels for the specified mark should be specified',
    properties: [Property.CHANNEL, Property.MARK],
    requireAllProperties: true,
    strict: true,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const mark = specM.getMark();

      switch (mark) {
        case Mark.AREA:
        case Mark.LINE:
          return specM.channelUsed(Channel.X) && specM.channelUsed(Channel.Y);
        case Mark.TEXT:
          return specM.channelUsed(Channel.TEXT);
        case Mark.BAR:
        case Mark.CIRCLE:
        case Mark.POINT:
        case Mark.SQUARE:
        case Mark.TICK:
        case Mark.RULE:
          return specM.channelUsed(Channel.X) || specM.channelUsed(Channel.Y);
      }
      /* istanbul ignore next */
      throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
    }
  },
  {
    name: 'omitAggregatePlotWithDimensionOnlyOnFacet',
    description: 'All required channels for the specified mark should be specified',
    properties: [Property.CHANNEL, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      if (specM.isAggregate()) {
        let hasNonFacetDim = false, hasDim = false;
        specM.getEncodings().forEach((encQ) => {
          if (!encQ.aggregate && !encQ.autoCount) { // isDimension
            hasDim = true;
            if (!contains([Channel.ROW, Channel.COLUMN], encQ.channel)) {
              hasNonFacetDim = true;
            }
          }
        });
        return !hasDim || hasNonFacetDim;
      }
      return true;
    }
  },
  {
    // TODO: we can be smarter and check if bar has occlusion based on profiling statistics
    name: 'omitBarLineAreaWithOcclusion',
    description: 'Don\'t use bar, line or area to visualize raw plot as they often lead to occlusion.',
    properties: [Property.MARK, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      if (contains([Mark.BAR, Mark.LINE, Mark.AREA], specM.getMark())) {
        return specM.isAggregate();
      }
      return true;
    }
  },
  {
    name: 'omitBarTickWithSize',
    description: 'Do not map field to size channel with bar and tick mark',
    properties: [Property.CHANNEL, Property.MARK],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const mark = specM.getMark();
      if (contains([Mark.TICK, Mark.BAR], mark)) {
        return !specM.channelUsed(Channel.SIZE);
      }
      return true; // skip
    }
  },
  {
    name: 'omitFacetOverPositionalChannels',
    description: 'Do not use non-positional channels unless all positional channels are used',
    properties: [Property.CHANNEL],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      return specM.channelUsed(Channel.ROW) || specM.channelUsed(Channel.COLUMN) ?
        // if non-positional channels are used, then both x and y must be used.
        specM.channelUsed(Channel.X) && specM.channelUsed(Channel.Y) :
        true;
    }
  },
  {
    name: 'omitBarAreaForLogScale',
    description: 'Do not use bar and area mark for x and y\'s log scale',
    properties: [Property.MARK, Property.CHANNEL, Property.SCALE],
    requireAllProperties: true,
    strict: true,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const mark = specM.getMark();
      const encodings = specM.getEncodings();

    if (mark === Mark.AREA || mark === Mark.BAR) {
      for (let encQ of encodings) {
        if((encQ.channel === Channel.X || encQ.channel === Channel.Y) && encQ.scale) {
          if (((encQ.scale as ScaleQuery).type as ScaleType) === ScaleType.LOG) {
            return false;
          }
        }
      }
    }
    return true;
    }
  },
  {
    name: 'omitMultipleNonPositionalChannels',
    description: 'Do not use multiple non-positional encoding channel to avoid over-encoding.',
    properties: [Property.CHANNEL],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const encodings = specM.getEncodings();
      let nonPositionChannelCount = 0;
      for (let i = 0; i < encodings.length; i++) {
        const channel = encodings[i].channel;
        if (!isEnumSpec(channel)) {
          if (channel === Channel.COLOR || channel === Channel.SHAPE || channel === Channel.SIZE) {
            nonPositionChannelCount += 1;
            if (nonPositionChannelCount > 1) {
              return false;
            }
          }
        }
      }
      return true;
    }
  },
  {
    name: 'omitNonPositionalOverPositionalChannels',
    description: 'Do not use non-positional channels unless all positional channels are used',
    properties: [Property.CHANNEL],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      return some(NONSPATIAL_CHANNELS, (channel) => specM.channelUsed(channel)) ?
        // if non-positional channels are used, then both x and y must be used.
        specM.channelUsed(Channel.X) && specM.channelUsed(Channel.Y) :
        true;
    }
  },
  {
    name: 'omitRawContinuousFieldForAggregatePlot',
    description: 'Aggregate plot should not use raw continuous field as group by values. ' +
      '(Quantitative should be binned. Temporal should have time unit.)',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN, Property.TYPE],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
       if (specM.isAggregate()) {
         return every(specM.getEncodings(), (encQ: EncodingQuery) => {
           if (encQ.type === Type.TEMPORAL) {
             // Temporal fields should have timeUnit or is still an enumSpec
             return !!encQ.timeUnit;
           }
           if (encQ.type === Type.QUANTITATIVE) {
             return !!encQ.bin || !!encQ.aggregate || !!encQ.autoCount;
           }
           return true;
         });
       }
       return true;
    }
  },
  {
    name: 'omitRawDetail',
    description: 'Do not use detail channel with raw plot.',
    properties: [Property.CHANNEL, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: true,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      if (specM.isAggregate()) {
        return true;
      }
      return every(specM.getEncodings(), (encQ) => {
        return encQ.channel !== Channel.DETAIL;
      });
    }
  },
  {
    name: 'omitRepeatedField',
    description: 'Each field should be mapped to only one channel',
    properties: [Property.FIELD],
    requireAllProperties: false,
    strict: false, // over-encoding is sometimes good, but let's turn it off by default
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      let usedField = {};

      // the same field should not be encoded twice
      return every(specM.getEncodings(), (encQ) => {
        if (encQ.field && !isEnumSpec(encQ.field)) {
          // If field is specified, it should not be used already
          if (usedField[encQ.field]) {
            return false;
          }
          usedField[encQ.field] = true;
          return true;
        }
        return true; // unspecified field is valid
      });
    }
  },
  // TODO: omitShapeWithBin
  {
    name: 'omitVerticalDotPlot',
    description: 'Do not output vertical dot plot.',
    properties: [Property.CHANNEL],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const encodings = specM.getEncodings();
      if (encodings.length === 1 && encodings[0].channel === Channel.Y) {
        return false;
      }
      return true;
    }
  },
  // EXPENSIVE CONSTRAINTS -- check them later!
  {
    name: 'hasAppropriateGraphicTypeForMark',
    description: 'Has appropriate graphic type for mark',
    properties: [Property.CHANNEL, Property.MARK, Property.TYPE, Property.TIMEUNIT, Property.BIN, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const mark = specM.getMark();

      switch (mark) {
        case Mark.AREA:
        case Mark.LINE:
          if (specM.isAggregate()) { // TODO: refactor based on profiling statistics
            const xEncQ = specM.getEncodingQueryByChannel(Channel.X);
            const yEncQ = specM.getEncodingQueryByChannel(Channel.Y);
            const xIsMeasure = xEncQ && isMeasure(xEncQ);
            const yIsMeasure = yEncQ && isMeasure(yEncQ);

            // for aggregate line / area, we need at least one group-by axis and one measure axis.
            return xEncQ && yEncQ && (xIsMeasure !== yIsMeasure) &&
              // and the dimension axis should not be nominal
              // TODO: make this clause optional
              !(!xIsMeasure && xEncQ.type === Type.NOMINAL) &&
              !(!yIsMeasure && yEncQ.type === Type.NOMINAL)
            ;
            // TODO: allow connected scatterplot
          }
          return true;
        case Mark.TEXT:
          // FIXME correctly when we add text
          return true;
        case Mark.BAR:
        case Mark.TICK:
          // Bar and tick should not use size.
          if (specM.channelUsed(Channel.SIZE)) {
            return false;
          }

          // Tick and Bar should have one and only one measure
          if (specM.isMeasure(Channel.X) !== specM.isMeasure(Channel.Y)) {
            // TODO: Bar and tick's dimension should not be continuous (quant/time) scale

            return true;
          }
          return false;
        case Mark.CIRCLE:
        case Mark.POINT:
        case Mark.SQUARE:
        case Mark.RULE:
          return true;
      }
      /* istanbul ignore next */
      throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
    }
  },
  {
    name: 'omitNonSumStack',
    description: 'Stacked plot should use summative aggregation such as sum, count, or distinct',
    properties: [Property.CHANNEL, Property.MARK, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      const stack = specM.stack();
      if (stack) {
        const measureEncQ = specM.getEncodingQueryByChannel(stack.fieldChannel);
        return contains(SUM_OPS, measureEncQ.aggregate) || !!measureEncQ.autoCount;
      }
      return true;
    }
  },
  {
    name: 'omitTableWithOcclusion',
    description: 'Raw Plots with x and y are both dimensions should be omitted as they often lead to occlusion.',
    properties: [Property.CHANNEL, Property.TYPE, Property.TIMEUNIT, Property.BIN, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, opt: QueryConfig) => {
      if (specM.isDimension(Channel.X) &&
          specM.isDimension(Channel.Y) &&
          !specM.isAggregate() // TODO: refactor based on statistics
        ) {
        return false;
      }
      return true;
    }
  }
].map((sc) => new SpecConstraintModel(sc));

// For testing
export const SPEC_CONSTRAINT_INDEX: {[name: string]: SpecConstraintModel} =
  SPEC_CONSTRAINTS.reduce((m: any, c: SpecConstraintModel) => {
    m[c.name()] = c;
    return m;
  }, {});

//
export const SPEC_CONSTRAINTS_BY_PROPERTY: {[prop: string]: SpecConstraintModel[]} =
   SPEC_CONSTRAINTS.reduce((m, c: SpecConstraintModel) => {
    c.properties().forEach((prop) => {
      m[prop] = m[prop] || [];
      m[prop].push(c);
    });
    return m;
  }, {});


/**
 * Check all encoding constraints for a particular property and index tuple
 */
export function checkSpec(prop: Property, indexTuple: EnumSpecIndexTuple<any>,
  specM: SpecQueryModel, schema: Schema, opt: QueryConfig): string {

  // Check encoding constraint
  const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY[prop] || [];

  for (let i = 0; i < specConstraints.length; i++) {
    const c = specConstraints[i];
    // Check if the constraint is enabled
    if (c.strict() || !!opt[c.name()]) {
      // For strict constraint, or enabled non-strict, check the constraints

      const satisfy = c.satisfy(specM, schema, opt);
      if (!satisfy) {
        let violatedConstraint = '(spec) ' + c.name();
        /* istanbul ignore if */
        if (opt.verbose) {
          console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + indexTuple.enumSpec.name);
        }
        return violatedConstraint;
      }
    }
  }
  return null;
}
