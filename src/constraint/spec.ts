import {Channel, NONSPATIAL_CHANNELS, supportMark} from 'vega-lite/src/channel';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';

import {AbstractConstraint, AbstractConstraintModel} from './base';

import {SpecQueryModel, EnumSpecIndexTuple} from '../model';
import {Property} from '../property';
import {Schema} from '../schema';
import {Stats} from '../stats';
import {EncodingQuery, QueryConfig, isEnumSpec, isMeasure} from '../query';
import {contains, every, isin, some} from '../util';


export interface SpecConstraintChecker {
  (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig): boolean;
}

export class SpecConstraintModel extends AbstractConstraintModel {
  constructor(specConstraint: SpecConstraint) {
    super(specConstraint);
  }

  public satisfy(specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) {
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
            case Property.TIMEUNIT:
            case Property.FIELD:
            case Property.TYPE:
              // If there is property that is enumSpec, we return true as
              // we cannot check the constraint yet!
              return some(specM.getEncodings(), (encQ) => {
                return isEnumSpec(encQ[prop]);
              });
            default:
              throw new Error('Unimplemnted');
          }
        }
      );
      // If one of the required property is still an enum spec, do not check the constraint yet.
      if (hasRequiredPropertyAsEnumSpec) {
        return true; // Return true since the query still satisfy the constraint.
      }
    }
    return (this.constraint as SpecConstraint).satisfy(specM, schema, stats, opt);
  }
}

export interface SpecConstraint extends AbstractConstraint {
  /** Method for checking if the spec query satisfies this constraint. */
  satisfy: SpecConstraintChecker;
}

/**
 * Factory function for satisfy preferred type constraints.
 */
function satisfyPreferredType(theType: Type, configName: string) {
  return (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
    const xEncQ = specM.getEncodingQueryByChannel(Channel.X);
    const yEncQ = specM.getEncodingQueryByChannel(Channel.Y);
    const xIsTheType = xEncQ && xEncQ.type === theType;
    const yIsTheType = yEncQ && yEncQ.type === theType;

    return !yEncQ || !xEncQ ||      // have one axis
      (xIsTheType && yIsTheType) || // Both X & Y are the type
      (!xIsTheType && !yIsTheType) || // None of them are the type
      // x is the only axis of the type and is the preferred one.
      (xIsTheType && opt[configName] === Channel.X) ||
      // y is the only axis of the type and is the preferred one.
      (yIsTheType && opt[configName] === Channel.Y);
  };
}

export const SPEC_CONSTRAINTS: SpecConstraintModel[] = [
  {
    name: 'noRepeatedChannel',
    description: 'Each encoding channel should only be used once.',
    properties: [Property.CHANNEL],
    requireAllProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    description: 'Automatically adding count only for plots with only ordinal, binned quantitative, or temporal with timeunti fields.',
    properties: [Property.BIN, Property.TIMEUNIT, Property.TYPE, Property.AUTOCOUNT],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
      throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
    }
  },
  {
    name: 'omitBarTickWithSize',
    description: 'Do not map field to size channel with bar and tick mark',
    properties: [Property.CHANNEL, Property.MARK],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
      return specM.channelUsed(Channel.ROW) || specM.channelUsed(Channel.COLUMN) ?
        // if non-positional channels are used, then both x and y must be used.
        specM.channelUsed(Channel.X) && specM.channelUsed(Channel.Y) :
        true;
    }
  },
  // TODO: omitLengthForLogScale (Bar/Area)
  {
    name: 'omitMultipleNonPositionalChannels',
    description: 'Do not use multiple non-positional encoding channel to avoid over-encoding.',
    properties: [Property.CHANNEL],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
      return some(NONSPATIAL_CHANNELS, (channel) => specM.channelUsed(channel)) ?
        // if non-positional channels are used, then both x and y must be used.
        specM.channelUsed(Channel.X) && specM.channelUsed(Channel.Y) :
        true;
    }
  },
  {
    // TODO: we can be smarter and check if bar has occlusion
    name: 'omitRawBarLineArea',
    description: 'Don\'t use bar, line or area to visualize raw plot as they often lead to occlusion.',
    properties: [Property.MARK, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
      if (isin(specM.getMark(), [Mark.BAR, Mark.LINE, Mark.AREA])) {
        return specM.isAggregate();
      }
      return true;
    }
  },
  {
    name: 'omitRawContinuousFieldForAggregatePlot',
    description: 'Aggregate plot should not use raw continuous field as group by values. ' +
      '(Quantitative should be binned. Temporal should have time unit.)',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN, Property.TYPE],
    requireAllProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    name: 'omitRepeatedField',
    description: 'Each field should be mapped to only one channel',
    properties: [Property.FIELD],
    requireAllProperties: false,
    strict: false, // over-encoding is sometimes good, but let's turn it off by default
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
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
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
      const mark = specM.getMark();

      switch (mark) {
        case Mark.AREA:
        case Mark.LINE:
          if (specM.isAggregate()) {
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
      throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
    }
  },
  {
    name: 'omitRawTable',
    description: 'Raw Plots with x and y are both dimensions should be omitted as they often lead to occlusion.',
    properties: [Property.CHANNEL, Property.TYPE, Property.TIMEUNIT, Property.BIN, Property.AGGREGATE, Property.AUTOCOUNT],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
      if (specM.isDimension(Channel.X) && specM.isDimension(Channel.Y) && !specM.isAggregate()) {
        return false;
      }
      return true;
    }
  },
  {
    name: 'preferredBinAxis',
    description: 'Always use preferred axis for a binned field.',
    properties: [Property.CHANNEL, Property.BIN],
    requireAllProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, schema: Schema, stats: Stats, opt: QueryConfig) => {
      const xEncQ = specM.getEncodingQueryByChannel(Channel.X);
      const yEncQ = specM.getEncodingQueryByChannel(Channel.Y);
      const xBin = xEncQ && !!xEncQ.bin;
      const yBin = yEncQ && !!yEncQ.bin;

      return (xBin && yBin) || // Both X & Y are binned
        (!xBin && !yBin) || // None of them are binned
        // x is the only binned axis and is the preferred one.
        (xBin && opt.preferredBinAxis === Channel.X) ||
        // y is the only binned axis and is the preferred one.
        (yBin && opt.preferredBinAxis === Channel.Y);
    }
  },
  {
    name: 'preferredTemporalAxis',
    description: 'Always use preferred axis for a time field.',
    properties: [Property.CHANNEL, Property.TYPE],
    requireAllProperties: true,
    strict: false,
    satisfy: satisfyPreferredType(Type.TEMPORAL, 'preferredTemporalAxis')
  },
  {
    name: 'preferredOrdinalAxis',
    description: 'Always use preferred axis for an ordinal field.',
    properties: [Property.CHANNEL, Property.TYPE],
    requireAllProperties: true,
    strict: false,
    satisfy: satisfyPreferredType(Type.ORDINAL, 'preferredOrdinalAxis')
  },
  {
    name: 'preferredNominalAxis',
    description: 'Always use preferred axis for a nominal field.',
    properties: [Property.CHANNEL, Property.TYPE],
    requireAllProperties: true,
    strict: false,
    satisfy: satisfyPreferredType(Type.NOMINAL, 'preferredNominalAxis')
  },
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
