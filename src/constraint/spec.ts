import {SUM_OPS} from 'vega-lite/build/src/aggregate';
import * as CHANNEL from 'vega-lite/build/src/channel';
import {NONPOSITION_CHANNELS, supportMark} from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import {Mark} from 'vega-lite/build/src/mark';
import {ScaleType} from 'vega-lite/build/src/scale';
import * as TYPE from 'vega-lite/build/src/type';
import {QueryConfig} from '../config';
import {SpecQueryModel} from '../model';
import {getEncodingNestedProp, isEncodingNestedProp, isEncodingProperty, Property} from '../property';
import {PropIndex} from '../propindex';
import {
  EncodingQuery,
  FieldQuery,
  isAutoCountQuery,
  isDimension,
  isDisabledAutoCountQuery,
  isEnabledAutoCountQuery,
  isFieldQuery,
  isMeasure,
  isValueQuery,
  ScaleQuery,
  scaleType
} from '../query/encoding';
import {ExpandedType} from '../query/expandedtype';
import {Schema} from '../schema';
import {contains, every, some} from '../util';
import {isWildcard, Wildcard} from '../wildcard';
import {AbstractConstraint, AbstractConstraintModel} from './base';

const NONPOSITION_CHANNELS_INDEX = NONPOSITION_CHANNELS.reduce((m, channel) => {
  m[channel] = true;
  return m;
}, {});

export interface SpecConstraintChecker {
  (specM: SpecQueryModel, schema: Schema, opt: QueryConfig): boolean;
}

export class SpecConstraintModel extends AbstractConstraintModel {
  constructor(specConstraint: SpecConstraint) {
    super(specConstraint);
  }

  public hasAllRequiredPropertiesSpecific(specM: SpecQueryModel): boolean {
    return every(this.constraint.properties, prop => {
      if (prop === Property.MARK) {
        return !isWildcard(specM.getMark());
      }

      // TODO: transform

      if (isEncodingNestedProp(prop)) {
        let parent = prop.parent;
        let child = prop.child;

        return every(specM.getEncodings(), encQ => {
          if (!encQ[parent]) {
            return true;
          }

          return !isWildcard(encQ[parent][child]);
        });
      }

      if (!isEncodingProperty(prop)) {
        throw new Error('UNIMPLEMENTED');
      }

      return every(specM.getEncodings(), encQ => {
        if (!encQ[prop]) {
          return true;
        }
        return !isWildcard(encQ[prop]);
      });
    });
  }

  public satisfy(specM: SpecQueryModel, schema: Schema, opt: QueryConfig) {
    // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
    if (!this.constraint.allowWildcardForProperties) {
      if (!this.hasAllRequiredPropertiesSpecific(specM)) {
        return true;
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
    allowWildcardForProperties: true,
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      let usedChannel = {};

      // channel for all encodings should be valid
      return every(specM.getEncodings(), encQ => {
        if (!isWildcard(encQ.channel)) {
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
    name: 'alwaysIncludeZeroInScaleWithBarMark',
    description: 'Do not recommend bar mark if scale does not start at zero',
    properties: [
      Property.MARK,
      Property.SCALE,
      getEncodingNestedProp('scale', 'zero'),
      Property.CHANNEL,
      Property.TYPE
    ],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const mark = specM.getMark();
      const encodings = specM.getEncodings();

      if (mark === MARK.BAR) {
        for (let encQ of encodings) {
          if (
            isFieldQuery(encQ) &&
            (encQ.channel === CHANNEL.X || encQ.channel === CHANNEL.Y) &&
            encQ.type === TYPE.QUANTITATIVE &&
            (encQ.scale && (encQ.scale as ScaleQuery).zero === false)
          ) {
            // TODO: zero shouldn't be manually specified
            return false;
          }
        }
      }

      return true;
    }
  },
  {
    name: 'autoAddCount',
    description:
      'Automatically adding count only for plots with only ordinal, binned quantitative, or temporal with timeunit fields.',
    properties: [Property.BIN, Property.TIMEUNIT, Property.TYPE, Property.AUTOCOUNT],
    allowWildcardForProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const hasAutoCount = some(specM.getEncodings(), (encQ: EncodingQuery) => isEnabledAutoCountQuery(encQ));

      if (hasAutoCount) {
        // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
        return every(specM.getEncodings(), (encQ: EncodingQuery) => {
          if (isValueQuery(encQ)) {
            return true;
          }

          if (isAutoCountQuery(encQ)) {
            return true;
          }

          switch (encQ.type) {
            case TYPE.QUANTITATIVE:
              return !!encQ.bin;
            case TYPE.TEMPORAL:
              return !!encQ.timeUnit;
            case TYPE.ORDINAL:
            case ExpandedType.KEY:
            case TYPE.NOMINAL:
              return true;
          }
          /* istanbul ignore next */
          throw new Error('Unsupported Type');
        });
      } else {
        const autoCountEncIndex = specM.wildcardIndex.encodingIndicesByProperty.get('autoCount') || [];
        const neverHaveAutoCount = every(autoCountEncIndex, (index: number) => {
          let encQ = specM.getEncodingQueryByIndex(index);
          return isAutoCountQuery(encQ) && !isWildcard(encQ.autoCount);
        });
        if (neverHaveAutoCount) {
          // If the query surely does not have autoCount
          // then one of the field should be
          // (1) unbinned quantitative
          // (2) temporal without time unit
          // (3) nominal or ordinal field
          // or at least have potential to be (still ambiguous).
          return some(specM.getEncodings(), (encQ: EncodingQuery) => {
            if ((isFieldQuery(encQ) || isAutoCountQuery(encQ)) && encQ.type === TYPE.QUANTITATIVE) {
              if (isDisabledAutoCountQuery(encQ)) {
                return false;
              } else {
                return isFieldQuery(encQ) && (!encQ.bin || isWildcard(encQ.bin));
              }
            } else if (isFieldQuery(encQ) && encQ.type === TYPE.TEMPORAL) {
              return !encQ.timeUnit || isWildcard(encQ.timeUnit);
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
    allowWildcardForProperties: true, // only require mark
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const mark = specM.getMark();

      // if mark is unspecified, no need to check
      if (isWildcard(mark)) return true;

      // TODO: can optimize this to detect only what's the changed property if needed.
      return every(specM.getEncodings(), encQ => {
        // channel unspecified, no need to check
        if (isWildcard(encQ.channel)) return true;

        return !!supportMark(encQ.channel, mark as Mark);
      });
    }
  },
  {
    name: 'hasAllRequiredChannelsForMark',
    description: 'All required channels for the specified mark should be specified',
    properties: [Property.CHANNEL, Property.MARK],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const mark = specM.getMark();

      switch (mark) {
        case MARK.AREA:
        case MARK.LINE:
          return specM.channelUsed(CHANNEL.X) && specM.channelUsed(CHANNEL.Y);
        case MARK.TEXT:
          return specM.channelUsed(CHANNEL.TEXT);
        case MARK.BAR:
        case MARK.CIRCLE:
        case MARK.SQUARE:
        case MARK.TICK:
        case MARK.RULE:
        case MARK.RECT:
          return specM.channelUsed(CHANNEL.X) || specM.channelUsed(CHANNEL.Y);
        case MARK.POINT:
          // This allows generating a point plot if channel was not a wildcard.
          return (
            !specM.wildcardIndex.hasProperty(Property.CHANNEL) ||
            specM.channelUsed(CHANNEL.X) ||
            specM.channelUsed(CHANNEL.Y)
          );
      }
      /* istanbul ignore next */
      throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + JSON.stringify(mark));
    }
  },
  {
    name: 'omitAggregate',
    description: 'Omit aggregate plots.',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT],
    allowWildcardForProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      if (specM.isAggregate()) {
        return false;
      }
      return true;
    }
  },
  {
    name: 'omitAggregatePlotWithDimensionOnlyOnFacet',
    description: 'Omit aggregate plots with dimensions only on facets as that leads to inefficient use of space.',
    properties: [Property.CHANNEL, Property.AGGREGATE, Property.AUTOCOUNT],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      if (specM.isAggregate()) {
        let hasNonFacetDim = false,
          hasDim = false,
          hasEnumeratedFacetDim = false;
        specM.specQuery.encodings.forEach((encQ, index) => {
          if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ)) return; // skip unused field

          // FieldQuery & !encQ.aggregate
          if (isFieldQuery(encQ) && !encQ.aggregate) {
            // isDimension
            hasDim = true;
            if (contains([CHANNEL.ROW, CHANNEL.COLUMN], encQ.channel)) {
              if (specM.wildcardIndex.hasEncodingProperty(index, Property.CHANNEL)) {
                hasEnumeratedFacetDim = true;
              }
            } else {
              hasNonFacetDim = true;
            }
          }
        });
        if (hasDim && !hasNonFacetDim) {
          if (hasEnumeratedFacetDim || opt.constraintManuallySpecifiedValue) {
            return false;
          }
        }
      }
      return true;
    }
  },
  {
    name: 'omitAggregatePlotWithoutDimension',
    description: 'Aggregate plots without dimension should be omitted',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.BIN, Property.TIMEUNIT, Property.TYPE],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      if (specM.isAggregate()) {
        // TODO relax
        return some(specM.getEncodings(), (encQ: EncodingQuery) => {
          if (isDimension(encQ) || (isFieldQuery(encQ) && encQ.type === 'temporal')) {
            return true;
          }
          return false;
        });
      }
      return true;
    }
  },
  {
    // TODO: we can be smarter and check if bar has occlusion based on profiling statistics
    name: 'omitBarLineAreaWithOcclusion',
    description: "Don't use bar, line or area to visualize raw plot as they often lead to occlusion.",
    properties: [Property.MARK, Property.AGGREGATE, Property.AUTOCOUNT],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      if (contains([MARK.BAR, MARK.LINE, MARK.AREA], specM.getMark())) {
        return specM.isAggregate();
      }
      return true;
    }
  },
  {
    name: 'omitBarTickWithSize',
    description: 'Do not map field to size channel with bar and tick mark',
    properties: [Property.CHANNEL, Property.MARK],
    allowWildcardForProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      const mark = specM.getMark();
      if (contains([MARK.TICK, MARK.BAR], mark)) {
        if (specM.channelEncodingField(CHANNEL.SIZE)) {
          if (opt.constraintManuallySpecifiedValue) {
            // If size is used and we constraintManuallySpecifiedValue,
            // then the spec violates this constraint.
            return false;
          } else {
            // Otherwise have to search for the size channel and check if it is enumerated
            const encodings = specM.specQuery.encodings;
            for (let i = 0; i < encodings.length; i++) {
              const encQ = encodings[i];
              if (encQ.channel === CHANNEL.SIZE) {
                if (specM.wildcardIndex.hasEncodingProperty(i, Property.CHANNEL)) {
                  // If enumerated, then this is bad
                  return false;
                } else {
                  // If it's manually specified, no need to continue searching, just return.
                  return true;
                }
              }
            }
          }
        }
      }
      return true; // skip
    }
  },
  {
    name: 'omitBarAreaForLogScale',
    description: "Do not use bar and area mark for x and y's log scale",
    properties: [
      Property.MARK,
      Property.CHANNEL,
      Property.SCALE,
      getEncodingNestedProp('scale', 'type'),
      Property.TYPE
    ],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const mark = specM.getMark();
      const encodings = specM.getEncodings();

      // TODO: mark or scale type should be enumerated
      if (mark === MARK.AREA || mark === MARK.BAR) {
        for (let encQ of encodings) {
          if (isFieldQuery(encQ) && ((encQ.channel === CHANNEL.X || encQ.channel === CHANNEL.Y) && encQ.scale)) {
            let sType = scaleType(encQ);

            if (sType === ScaleType.LOG) {
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
    description:
      'Unless manually specified, do not use multiple non-positional encoding channel to avoid over-encoding.',
    properties: [Property.CHANNEL],
    allowWildcardForProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      // have to use specM.specQuery.encodings insetad of specM.getEncodings()
      // since specM.getEncodings() remove encQ with autoCount===false from the array
      // and thus might shift the index
      const encodings = specM.specQuery.encodings;
      let nonPositionChannelCount = 0;
      let hasEnumeratedNonPositionChannel = false;

      for (let i = 0; i < encodings.length; i++) {
        const encQ = encodings[i];
        if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ)) {
          continue; // ignore skipped encoding
        }

        const channel = encQ.channel;
        if (!isWildcard(channel)) {
          if (NONPOSITION_CHANNELS_INDEX[channel + '']) {
            nonPositionChannelCount += 1;
            if (specM.wildcardIndex.hasEncodingProperty(i, Property.CHANNEL)) {
              hasEnumeratedNonPositionChannel = true;
            }
            if (
              nonPositionChannelCount > 1 &&
              (hasEnumeratedNonPositionChannel || opt.constraintManuallySpecifiedValue)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    }
  },
  {
    name: 'omitNonPositionalOrFacetOverPositionalChannels',
    description: 'Do not use non-positional channels unless all positional channels are used',
    properties: [Property.CHANNEL],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      const encodings = specM.specQuery.encodings;
      let hasNonPositionalChannelOrFacet = false;
      let hasEnumeratedNonPositionOrFacetChannel = false;
      let hasX = false,
        hasY = false;
      for (let i = 0; i < encodings.length; i++) {
        const encQ = encodings[i];
        if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ)) {
          continue; // ignore skipped encoding
        }

        const channel = encQ.channel;
        if (channel === CHANNEL.X) {
          hasX = true;
        } else if (channel === CHANNEL.Y) {
          hasY = true;
        } else if (!isWildcard(channel)) {
          // All non positional channel / Facet
          hasNonPositionalChannelOrFacet = true;
          if (specM.wildcardIndex.hasEncodingProperty(i, Property.CHANNEL)) {
            hasEnumeratedNonPositionOrFacetChannel = true;
          }
        }
      }

      if (
        hasEnumeratedNonPositionOrFacetChannel ||
        (opt.constraintManuallySpecifiedValue && hasNonPositionalChannelOrFacet)
      ) {
        return hasX && hasY;
      }
      return true;
    }
  },
  {
    name: 'omitRaw',
    description: 'Omit raw plots.',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      if (!specM.isAggregate()) {
        return false;
      }
      return true;
    }
  },
  {
    name: 'omitRawContinuousFieldForAggregatePlot',
    description:
      'Aggregate plot should not use raw continuous field as group by values. ' +
      '(Quantitative should be binned. Temporal should have time unit.)',
    properties: [Property.AGGREGATE, Property.AUTOCOUNT, Property.TIMEUNIT, Property.BIN, Property.TYPE],
    allowWildcardForProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      if (specM.isAggregate()) {
        const encodings = specM.specQuery.encodings;
        for (let i = 0; i < encodings.length; i++) {
          const encQ = encodings[i];
          if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ)) continue; // skip unused encoding

          // TODO: aggregate for ordinal and temporal

          if (isFieldQuery(encQ) && encQ.type === TYPE.TEMPORAL) {
            // Temporal fields should have timeUnit or is still a wildcard
            if (
              !encQ.timeUnit &&
              (specM.wildcardIndex.hasEncodingProperty(i, Property.TIMEUNIT) || opt.constraintManuallySpecifiedValue)
            ) {
              return false;
            }
          }
          if (encQ.type === TYPE.QUANTITATIVE) {
            if (isFieldQuery(encQ) && !encQ.bin && !encQ.aggregate) {
              // If Raw Q
              if (
                specM.wildcardIndex.hasEncodingProperty(i, Property.BIN) ||
                specM.wildcardIndex.hasEncodingProperty(i, Property.AGGREGATE) ||
                specM.wildcardIndex.hasEncodingProperty(i, Property.AUTOCOUNT)
              ) {
                // and it's raw from enumeration
                return false;
              }
              if (opt.constraintManuallySpecifiedValue) {
                // or if we constraintManuallySpecifiedValue
                return false;
              }
            }
          }
        }
      }
      return true;
    }
  },
  {
    name: 'omitRawDetail',
    description: 'Do not use detail channel with raw plot.',
    properties: [Property.CHANNEL, Property.AGGREGATE, Property.AUTOCOUNT],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      if (specM.isAggregate()) {
        return true;
      }
      return every(specM.specQuery.encodings, (encQ, index) => {
        if (isValueQuery(encQ) || isDisabledAutoCountQuery(encQ)) return true; // ignore autoCount field

        if (encQ.channel === CHANNEL.DETAIL) {
          // Detail channel for raw plot is not good, except when its enumerated
          // or when it's manually specified but we constraintManuallySpecifiedValue.
          if (
            specM.wildcardIndex.hasEncodingProperty(index, Property.CHANNEL) ||
            opt.constraintManuallySpecifiedValue
          ) {
            return false;
          }
        }
        return true;
      });
    }
  },
  {
    name: 'omitRepeatedField',
    description: 'Each field should be mapped to only one channel',
    properties: [Property.FIELD],
    allowWildcardForProperties: true,
    strict: false, // over-encoding is sometimes good, but let's turn it off by default
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      let fieldUsed = {};
      let fieldEnumerated = {};

      const encodings = specM.specQuery.encodings;
      for (let i = 0; i < encodings.length; i++) {
        const encQ = encodings[i];

        if (isValueQuery(encQ) || isAutoCountQuery(encQ)) continue;

        let field;
        if (encQ.field && !isWildcard(encQ.field)) {
          field = encQ.field as string;
        }
        if (isAutoCountQuery(encQ) && !isWildcard(encQ.autoCount)) {
          field = 'count_*';
        }

        if (field) {
          if (specM.wildcardIndex.hasEncodingProperty(i, Property.FIELD)) {
            fieldEnumerated[field] = true;
          }
          // When the field is specified previously,
          // if it is enumerated (either previously or in this encQ)
          // or if the opt.constraintManuallySpecifiedValue is true,
          // then it violates the constraint.

          if (fieldUsed[field]) {
            if (fieldEnumerated[field] || opt.constraintManuallySpecifiedValue) {
              return false;
            }
          }

          fieldUsed[field] = true;
        }
      }
      return true;
    }
  },
  // TODO: omitShapeWithBin
  {
    name: 'omitVerticalDotPlot',
    description: 'Do not output vertical dot plot.',
    properties: [Property.CHANNEL],
    allowWildcardForProperties: true,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const encodings = specM.getEncodings();
      if (encodings.length === 1 && encodings[0].channel === CHANNEL.Y) {
        return false;
      }
      return true;
    }
  },
  // EXPENSIVE CONSTRAINTS -- check them later!
  {
    name: 'hasAppropriateGraphicTypeForMark',
    description: 'Has appropriate graphic type for mark',
    properties: [
      Property.CHANNEL,
      Property.MARK,
      Property.TYPE,
      Property.TIMEUNIT,
      Property.BIN,
      Property.AGGREGATE,
      Property.AUTOCOUNT
    ],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const mark = specM.getMark();

      switch (mark) {
        case MARK.AREA:
        case MARK.LINE:
          if (specM.isAggregate()) {
            // TODO: refactor based on profiling statistics
            const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
            const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
            const xIsMeasure = isMeasure(xEncQ);
            const yIsMeasure = isMeasure(yEncQ);

            // for aggregate line / area, we need at least one group-by axis and one measure axis.
            return (
              xEncQ &&
              yEncQ &&
              xIsMeasure !== yIsMeasure &&
              // and the dimension axis should not be nominal
              // TODO: make this clause optional

              !(isFieldQuery(xEncQ) && !xIsMeasure && contains(['nominal', 'key'], xEncQ.type)) &&
              !(isFieldQuery(yEncQ) && !yIsMeasure && contains(['nominal', 'key'], yEncQ.type))
            );
            // TODO: allow connected scatterplot
          }
          return true;
        case MARK.TEXT:
          // FIXME correctly when we add text
          return true;
        case MARK.BAR:
        case MARK.TICK:
          // Bar and tick should not use size.
          if (specM.channelEncodingField(CHANNEL.SIZE)) {
            return false;
          } else {
            // Tick and Bar should have one and only one measure
            const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
            const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
            const xIsMeasure = isMeasure(xEncQ);
            const yIsMeasure = isMeasure(yEncQ);
            if (xIsMeasure !== yIsMeasure) {
              return true;
            }
            return false;
          }
        case MARK.RECT:
          // Until CompassQL supports layering, it only makes sense for
          // rect to encode DxD or 1xD (otherwise just use bar).
          // Furthermore, color should only be used in a 'heatmap' fashion
          // (with a measure field).
          const xEncQ = specM.getEncodingQueryByChannel(CHANNEL.X);
          const yEncQ = specM.getEncodingQueryByChannel(CHANNEL.Y);
          const xIsDimension = isDimension(xEncQ);
          const yIsDimension = isDimension(yEncQ);

          const colorEncQ = specM.getEncodingQueryByChannel(CHANNEL.COLOR);
          const colorIsQuantitative = isMeasure(colorEncQ);
          const colorIsOrdinal = isFieldQuery(colorEncQ) ? colorEncQ.type === TYPE.ORDINAL : false;

          const correctChannels =
            (xIsDimension && yIsDimension) ||
            (xIsDimension && !specM.channelUsed(CHANNEL.Y)) ||
            (yIsDimension && !specM.channelUsed(CHANNEL.X));

          const correctColor = !colorEncQ || (colorEncQ && (colorIsQuantitative || colorIsOrdinal));

          return correctChannels && correctColor;
        case MARK.CIRCLE:
        case MARK.POINT:
        case MARK.SQUARE:
        case MARK.RULE:
          return true;
      }
      /* istanbul ignore next */
      throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
    }
  },
  {
    name: 'omitInvalidStackSpec',
    description: 'If stack is specified, must follow Vega-Lite stack rules',
    properties: [
      Property.STACK,
      Property.FIELD,
      Property.CHANNEL,
      Property.MARK,
      Property.AGGREGATE,
      Property.AUTOCOUNT,
      Property.SCALE,
      getEncodingNestedProp('scale', 'type'),
      Property.TYPE
    ],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      if (!specM.wildcardIndex.hasProperty(Property.STACK)) {
        return true;
      }

      const stackProps = specM.getVlStack();
      if (stackProps === null && specM.getStackOffset() !== null) {
        return false;
      }

      if (stackProps.fieldChannel !== specM.getStackChannel()) {
        return false;
      }

      return true;
    }
  },
  {
    name: 'omitNonSumStack',
    description: 'Stack specifications that use non-summative aggregates should be omitted (even implicit ones)',
    properties: [
      Property.CHANNEL,
      Property.MARK,
      Property.AGGREGATE,
      Property.AUTOCOUNT,
      Property.SCALE,
      getEncodingNestedProp('scale', 'type'),
      Property.TYPE
    ],
    allowWildcardForProperties: false,
    strict: true,
    satisfy: (specM: SpecQueryModel, _: Schema, __: QueryConfig) => {
      const specStack = specM.getVlStack();
      if (specStack != null) {
        const stackParentEncQ = specM.getEncodingQueryByChannel(specStack.fieldChannel) as FieldQuery;
        if (!contains(SUM_OPS, stackParentEncQ.aggregate)) {
          return false;
        }
      }
      return true;
    }
  },
  {
    name: 'omitTableWithOcclusionIfAutoAddCount',
    description:
      'Plots without aggregation or autocount where x and y are both discrete should be omitted if autoAddCount is enabled as they often lead to occlusion',
    properties: [
      Property.CHANNEL,
      Property.TYPE,
      Property.TIMEUNIT,
      Property.BIN,
      Property.AGGREGATE,
      Property.AUTOCOUNT
    ],
    allowWildcardForProperties: false,
    strict: false,
    satisfy: (specM: SpecQueryModel, _: Schema, opt: QueryConfig) => {
      if (opt.autoAddCount) {
        const xEncQ = specM.getEncodingQueryByChannel('x');
        const yEncQ = specM.getEncodingQueryByChannel('y');

        if ((!isFieldQuery(xEncQ) || isDimension(xEncQ)) && (!isFieldQuery(yEncQ) || isDimension(yEncQ))) {
          if (!specM.isAggregate()) {
            return false;
          } else {
            return every(specM.getEncodings(), encQ => {
              let channel = encQ.channel;

              if (
                channel !== CHANNEL.X &&
                channel !== CHANNEL.Y &&
                channel !== CHANNEL.ROW &&
                channel !== CHANNEL.COLUMN
              ) {
                // Non-position fields should not be unaggreated fields
                if (isFieldQuery(encQ) && !encQ.aggregate) {
                  return false;
                }
              }
              return true;
            });
          }
        }
      }
      return true;
    }
  }
].map(sc => new SpecConstraintModel(sc));

// For testing
export const SPEC_CONSTRAINT_INDEX: {[name: string]: SpecConstraintModel} = SPEC_CONSTRAINTS.reduce(
  (m: any, c: SpecConstraintModel) => {
    m[c.name()] = c;
    return m;
  },
  {}
);

const SPEC_CONSTRAINTS_BY_PROPERTY = SPEC_CONSTRAINTS.reduce((index, c) => {
  for (const prop of c.properties()) {
    // Initialize array and use it
    index.set(prop, index.get(prop) || []);
    index.get(prop).push(c);
  }
  return index;
}, new PropIndex<SpecConstraintModel[]>());

/**
 * Check all encoding constraints for a particular property and index tuple
 */
export function checkSpec(
  prop: Property,
  wildcard: Wildcard<any>,
  specM: SpecQueryModel,
  schema: Schema,
  opt: QueryConfig
): string {
  // Check encoding constraint
  const specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY.get(prop) || [];

  for (const c of specConstraints) {
    // Check if the constraint is enabled
    if (c.strict() || !!opt[c.name()]) {
      // For strict constraint, or enabled non-strict, check the constraints

      const satisfy = c.satisfy(specM, schema, opt);
      if (!satisfy) {
        let violatedConstraint = '(spec) ' + c.name();
        /* istanbul ignore if */
        if (opt.verbose) {
          console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
        }
        return violatedConstraint;
      }
    }
  }
  return null;
}
