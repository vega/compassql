"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aggregate_1 = require("vega-lite/build/src/aggregate");
var channel_1 = require("vega-lite/build/src/channel");
var mark_1 = require("vega-lite/build/src/mark");
var scale_1 = require("vega-lite/build/src/scale");
var type_1 = require("vega-lite/build/src/type");
var base_1 = require("./base");
var wildcard_1 = require("../wildcard");
var property_1 = require("../property");
var propindex_1 = require("../propindex");
var util_1 = require("../util");
var encoding_1 = require("../query/encoding");
var NONSPATIAL_CHANNELS_INDEX = channel_1.NONSPATIAL_CHANNELS.reduce(function (m, channel) {
    m[channel] = true;
    return m;
}, {});
var SpecConstraintModel = (function (_super) {
    __extends(SpecConstraintModel, _super);
    function SpecConstraintModel(specConstraint) {
        return _super.call(this, specConstraint) || this;
    }
    SpecConstraintModel.prototype.hasAllRequiredPropertiesSpecific = function (specM) {
        return util_1.every(this.constraint.properties, function (prop) {
            if (prop === property_1.Property.MARK) {
                return !wildcard_1.isWildcard(specM.getMark());
            }
            // TODO: transform
            if (property_1.isEncodingNestedProp(prop)) {
                var parent_1 = prop.parent;
                var child_1 = prop.child;
                return util_1.every(specM.getEncodings(), function (encQ) {
                    if (!encQ[parent_1]) {
                        return true;
                    }
                    return !wildcard_1.isWildcard(encQ[parent_1][child_1]);
                });
            }
            if (!property_1.isEncodingProperty(prop)) {
                throw new Error('UNIMPLEMENTED');
            }
            return util_1.every(specM.getEncodings(), function (encQ) {
                if (!encQ[prop]) {
                    return true;
                }
                return !wildcard_1.isWildcard(encQ[prop]);
            });
        });
    };
    SpecConstraintModel.prototype.satisfy = function (specM, schema, opt) {
        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
        if (!this.constraint.allowWildcardForProperties) {
            if (!this.hasAllRequiredPropertiesSpecific(specM)) {
                return true;
            }
        }
        return this.constraint.satisfy(specM, schema, opt);
    };
    return SpecConstraintModel;
}(base_1.AbstractConstraintModel));
exports.SpecConstraintModel = SpecConstraintModel;
exports.SPEC_CONSTRAINTS = [
    {
        name: 'noRepeatedChannel',
        description: 'Each encoding channel should only be used once.',
        properties: [property_1.Property.CHANNEL],
        allowWildcardForProperties: true,
        strict: true,
        satisfy: function (specM, _, __) {
            var usedChannel = {};
            // channel for all encodings should be valid
            return util_1.every(specM.getEncodings(), function (encQ) {
                if (!wildcard_1.isWildcard(encQ.channel)) {
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
        properties: [property_1.Property.MARK, property_1.Property.SCALE, property_1.getEncodingNestedProp('scale', 'zero'), property_1.Property.CHANNEL, property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (specM, _, __) {
            var mark = specM.getMark();
            var encodings = specM.getEncodings();
            if (mark === mark_1.Mark.BAR) {
                for (var _i = 0, encodings_1 = encodings; _i < encodings_1.length; _i++) {
                    var encQ = encodings_1[_i];
                    if (encoding_1.isFieldQuery(encQ) &&
                        (encQ.channel === channel_1.Channel.X || encQ.channel === channel_1.Channel.Y) &&
                        (encQ.type === type_1.Type.QUANTITATIVE) &&
                        (encQ.scale && encQ.scale.zero === false)) {
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
        description: 'Automatically adding count only for plots with only ordinal, binned quantitative, or temporal with timeunit fields.',
        properties: [property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.TYPE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: function (specM, _, __) {
            var hasAutoCount = util_1.some(specM.getEncodings(), function (encQ) { return encoding_1.isFieldQuery(encQ) && encQ.autoCount === true; });
            if (hasAutoCount) {
                // Auto count should only be applied if all fields are nominal, ordinal, temporal with timeUnit, binned quantitative, or autoCount
                return util_1.every(specM.getEncodings(), function (encQ) {
                    // TODO(akshatsh): should value query return false?
                    if (encoding_1.isValueQuery(encQ)) {
                        return false;
                    }
                    if (encQ.autoCount !== undefined) {
                        return true;
                    }
                    switch (encQ.type) {
                        case type_1.Type.QUANTITATIVE:
                            return !!encQ.bin;
                        case type_1.Type.TEMPORAL:
                            return !!encQ.timeUnit;
                        case type_1.Type.ORDINAL:
                        case type_1.Type.NOMINAL:
                            return true;
                    }
                    /* istanbul ignore next */
                    throw new Error('Unsupported Type');
                });
            }
            else {
                var autoCountEncIndex = specM.wildcardIndex.encodingIndicesByProperty.get('autoCount') || [];
                var neverHaveAutoCount = util_1.every(autoCountEncIndex, function (index) {
                    var encQ = specM.getEncodingQueryByIndex(index);
                    return encoding_1.isFieldQuery(encQ) && !wildcard_1.isWildcard(encQ.autoCount);
                });
                if (neverHaveAutoCount) {
                    // If the query surely does not have autoCount
                    // then one of the field should be
                    // (1) unbinned quantitative
                    // (2) temporal without time unit
                    // (3) nominal or ordinal field
                    // or at least have potential to be (still ambiguous).
                    return util_1.some(specM.getEncodings(), function (encQ) {
                        if (encoding_1.isFieldQuery(encQ) && encQ.type === type_1.Type.QUANTITATIVE) {
                            if (encQ.autoCount === false) {
                                return false;
                            }
                            else {
                                return !encQ.bin || wildcard_1.isWildcard(encQ.bin);
                            }
                        }
                        else if (encoding_1.isFieldQuery(encQ) && encQ.type === type_1.Type.TEMPORAL) {
                            return !encQ.timeUnit || wildcard_1.isWildcard(encQ.timeUnit);
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
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowWildcardForProperties: true,
        strict: true,
        satisfy: function (specM, _, __) {
            var mark = specM.getMark();
            // if mark is unspecified, no need to check
            if (wildcard_1.isWildcard(mark))
                return true;
            // TODO: can optimize this to detect only what's the changed property if needed.
            return util_1.every(specM.getEncodings(), function (encQ) {
                // channel unspecified, no need to check
                if (wildcard_1.isWildcard(encQ.channel))
                    return true;
                return channel_1.supportMark(encQ.channel, mark);
            });
        }
    },
    {
        name: 'hasAllRequiredChannelsForMark',
        description: 'All required channels for the specified mark should be specified',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (specM, _, __) {
            var mark = specM.getMark();
            switch (mark) {
                case mark_1.Mark.AREA:
                case mark_1.Mark.LINE:
                    return specM.channelUsed(channel_1.Channel.X) && specM.channelUsed(channel_1.Channel.Y);
                case mark_1.Mark.TEXT:
                    return specM.channelUsed(channel_1.Channel.TEXT);
                case mark_1.Mark.BAR:
                case mark_1.Mark.CIRCLE:
                case mark_1.Mark.SQUARE:
                case mark_1.Mark.TICK:
                case mark_1.Mark.RULE:
                    return specM.channelUsed(channel_1.Channel.X) || specM.channelUsed(channel_1.Channel.Y);
                case mark_1.Mark.POINT:
                    // This allows generating a point plot if channel was not a wildcard.
                    return !specM.wildcardIndex.hasProperty(property_1.Property.CHANNEL) ||
                        specM.channelUsed(channel_1.Channel.X) || specM.channelUsed(channel_1.Channel.Y);
            }
            /* istanbul ignore next */
            throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + JSON.stringify(mark));
        }
    },
    {
        name: 'omitAggregate',
        description: 'Omit aggregate plots.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: function (specM, _, __) {
            if (specM.isAggregate()) {
                return false;
            }
            return true;
        }
    },
    {
        name: 'omitAggregatePlotWithDimensionOnlyOnFacet',
        description: 'All required channels for the specified mark should be specified',
        properties: [property_1.Property.CHANNEL, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, opt) {
            if (specM.isAggregate()) {
                var hasNonFacetDim_1 = false, hasDim_1 = false, hasEnumeratedFacetDim_1 = false;
                specM.specQuery.encodings.forEach(function (encQ, index) {
                    if (encoding_1.isValueQuery(encQ) || encQ.autoCount === false)
                        return; // skip unused field
                    if (!encQ.aggregate && !encQ.autoCount) {
                        hasDim_1 = true;
                        if (util_1.contains([channel_1.Channel.ROW, channel_1.Channel.COLUMN], encQ.channel)) {
                            if (specM.wildcardIndex.hasEncodingProperty(index, property_1.Property.CHANNEL)) {
                                hasEnumeratedFacetDim_1 = true;
                            }
                        }
                        else {
                            hasNonFacetDim_1 = true;
                        }
                    }
                });
                if (hasDim_1 && !hasNonFacetDim_1) {
                    if (hasEnumeratedFacetDim_1 || opt.constraintManuallySpecifiedValue) {
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
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, __) {
            if (specM.isAggregate()) {
                // TODO relax
                return util_1.some(specM.getEncodings(), function (encQ) {
                    if (encoding_1.isDiscrete(encQ)) {
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
        description: 'Don\'t use bar, line or area to visualize raw plot as they often lead to occlusion.',
        properties: [property_1.Property.MARK, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, __) {
            if (util_1.contains([mark_1.Mark.BAR, mark_1.Mark.LINE, mark_1.Mark.AREA], specM.getMark())) {
                return specM.isAggregate();
            }
            return true;
        }
    },
    {
        name: 'omitBarTickWithSize',
        description: 'Do not map field to size channel with bar and tick mark',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: function (specM, _, opt) {
            var mark = specM.getMark();
            if (util_1.contains([mark_1.Mark.TICK, mark_1.Mark.BAR], mark)) {
                if (specM.channelUsed(channel_1.Channel.SIZE)) {
                    if (opt.constraintManuallySpecifiedValue) {
                        // If size is used and we constraintManuallySpecifiedValue,
                        // then the spec violates this constraint.
                        return false;
                    }
                    else {
                        // Otherwise have to search for the size channel and check if it is enumerated
                        var encodings = specM.specQuery.encodings;
                        for (var i = 0; i < encodings.length; i++) {
                            var encQ = encodings[i];
                            if (encQ.channel === channel_1.Channel.SIZE) {
                                if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
                                    // If enumerated, then this is bad
                                    return false;
                                }
                                else {
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
        description: 'Do not use bar and area mark for x and y\'s log scale',
        properties: [property_1.Property.MARK, property_1.Property.CHANNEL, property_1.Property.SCALE, property_1.getEncodingNestedProp('scale', 'type'), property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (specM, _, __) {
            var mark = specM.getMark();
            var encodings = specM.getEncodings();
            // TODO: mark or scale type should be enumerated
            if (mark === mark_1.Mark.AREA || mark === mark_1.Mark.BAR) {
                for (var _i = 0, encodings_2 = encodings; _i < encodings_2.length; _i++) {
                    var encQ = encodings_2[_i];
                    if (encoding_1.isFieldQuery(encQ) && ((encQ.channel === channel_1.Channel.X || encQ.channel === channel_1.Channel.Y) && encQ.scale)) {
                        var sType = encoding_1.scaleType(encQ);
                        if (sType === scale_1.ScaleType.LOG) {
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
        description: 'Unless manually specified, do not use multiple non-positional encoding channel to avoid over-encoding.',
        properties: [property_1.Property.CHANNEL],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: function (specM, _, opt) {
            // have to use specM.specQuery.encodings insetad of specM.getEncodings()
            // since specM.getEncodings() remove encQ with autoCount===false from the array
            // and thus might shift the index
            var encodings = specM.specQuery.encodings;
            var nonPositionChannelCount = 0;
            var hasEnumeratedNonPositionChannel = false;
            for (var i = 0; i < encodings.length; i++) {
                var encQ = encodings[i];
                if (encoding_1.isValueQuery(encQ) || encQ.autoCount === false)
                    continue; // ignore skipped encoding
                var channel = encQ.channel;
                if (!wildcard_1.isWildcard(channel)) {
                    if (NONSPATIAL_CHANNELS_INDEX[channel + '']) {
                        nonPositionChannelCount += 1;
                        if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
                            hasEnumeratedNonPositionChannel = true;
                        }
                        if (nonPositionChannelCount > 1 &&
                            (hasEnumeratedNonPositionChannel || opt.constraintManuallySpecifiedValue)) {
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
        properties: [property_1.Property.CHANNEL],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, opt) {
            var encodings = specM.specQuery.encodings;
            var hasNonPositionalChannelOrFacet = false;
            var hasEnumeratedNonPositionOrFacetChannel = false;
            var hasX = false, hasY = false;
            for (var i = 0; i < encodings.length; i++) {
                var encQ = encodings[i];
                if (encoding_1.isValueQuery(encQ) || encQ.autoCount === false)
                    continue; // ignore skipped encoding
                var channel = encQ.channel;
                if (channel === channel_1.Channel.X) {
                    hasX = true;
                }
                else if (channel === channel_1.Channel.Y) {
                    hasY = true;
                }
                else if (!wildcard_1.isWildcard(channel)) {
                    // All non positional channel / Facet
                    hasNonPositionalChannelOrFacet = true;
                    if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.CHANNEL)) {
                        hasEnumeratedNonPositionOrFacetChannel = true;
                    }
                }
            }
            if (hasEnumeratedNonPositionOrFacetChannel ||
                (opt.constraintManuallySpecifiedValue && hasNonPositionalChannelOrFacet)) {
                return hasX && hasY;
            }
            return true;
        }
    },
    {
        name: 'omitRaw',
        description: 'Omit raw plots.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, __) {
            if (!specM.isAggregate()) {
                return false;
            }
            return true;
        }
    },
    {
        name: 'omitRawContinuousFieldForAggregatePlot',
        description: 'Aggregate plot should not use raw continuous field as group by values. ' +
            '(Quantitative should be binned. Temporal should have time unit.)',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.TYPE],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: function (specM, _, opt) {
            if (specM.isAggregate()) {
                var encodings = specM.specQuery.encodings;
                for (var i = 0; i < encodings.length; i++) {
                    var encQ = encodings[i];
                    if (encoding_1.isValueQuery(encQ) || encQ.autoCount === false)
                        continue; // skip unused encoding
                    // TODO: aggregate for ordinal and temporal
                    if (encQ.type === type_1.Type.TEMPORAL) {
                        // Temporal fields should have timeUnit or is still a wildcard
                        if (!encQ.timeUnit && (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.TIMEUNIT) ||
                            opt.constraintManuallySpecifiedValue)) {
                            return false;
                        }
                    }
                    if (encQ.type === type_1.Type.QUANTITATIVE) {
                        if (!encQ.bin && !encQ.aggregate && !encQ.autoCount) {
                            // If Raw Q
                            if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.BIN) ||
                                specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.AGGREGATE) ||
                                specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.AUTOCOUNT)) {
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
        properties: [property_1.Property.CHANNEL, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (specM, _, opt) {
            if (specM.isAggregate()) {
                return true;
            }
            return util_1.every(specM.specQuery.encodings, function (encQ, index) {
                if (encoding_1.isValueQuery(encQ) || encQ.autoCount === false)
                    return true; // ignore autoCount field
                if (encQ.channel === channel_1.Channel.DETAIL) {
                    // Detail channel for raw plot is not good, except when its enumerated
                    // or when it's manually specified but we constraintManuallySpecifiedValue.
                    if (specM.wildcardIndex.hasEncodingProperty(index, property_1.Property.CHANNEL) ||
                        opt.constraintManuallySpecifiedValue) {
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
        properties: [property_1.Property.FIELD],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: function (specM, _, opt) {
            var fieldUsed = {};
            var fieldEnumerated = {};
            var encodings = specM.specQuery.encodings;
            for (var i = 0; i < encodings.length; i++) {
                var encQ = encodings[i];
                if (encoding_1.isValueQuery(encQ))
                    continue;
                if (encQ.field && !wildcard_1.isWildcard(encQ.field)) {
                    var field = encQ.field;
                    if (specM.wildcardIndex.hasEncodingProperty(i, property_1.Property.FIELD)) {
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
        properties: [property_1.Property.CHANNEL],
        allowWildcardForProperties: true,
        strict: false,
        satisfy: function (specM, _, __) {
            var encodings = specM.getEncodings();
            if (encodings.length === 1 && encodings[0].channel === channel_1.Channel.Y) {
                return false;
            }
            return true;
        }
    },
    // EXPENSIVE CONSTRAINTS -- check them later!
    {
        name: 'hasAppropriateGraphicTypeForMark',
        description: 'Has appropriate graphic type for mark',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK, property_1.Property.TYPE, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, __) {
            var mark = specM.getMark();
            switch (mark) {
                case mark_1.Mark.AREA:
                case mark_1.Mark.LINE:
                    if (specM.isAggregate()) {
                        var xEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.X);
                        var yEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.Y);
                        var xIsMeasure = xEncQ && encoding_1.isContinuous(xEncQ);
                        var yIsMeasure = yEncQ && encoding_1.isContinuous(yEncQ);
                        // for aggregate line / area, we need at least one group-by axis and one measure axis.
                        return xEncQ && yEncQ && (xIsMeasure !== yIsMeasure) &&
                            // and the dimension axis should not be nominal
                            // TODO: make this clause optional
                            !(encoding_1.isFieldQuery(xEncQ) && !xIsMeasure && xEncQ.type === type_1.Type.NOMINAL) &&
                            !(encoding_1.isFieldQuery(yEncQ) && !yIsMeasure && yEncQ.type === type_1.Type.NOMINAL);
                    }
                    return true;
                case mark_1.Mark.TEXT:
                    // FIXME correctly when we add text
                    return true;
                case mark_1.Mark.BAR:
                case mark_1.Mark.TICK:
                    // Bar and tick should not use size.
                    if (specM.channelUsed(channel_1.Channel.SIZE)) {
                        return false;
                    }
                    else {
                        // Tick and Bar should have one and only one continuous axis
                        var xEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.X);
                        var yEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.Y);
                        var xIsContinuous = xEncQ && encoding_1.isContinuous(xEncQ);
                        var yIsContinuous = yEncQ && encoding_1.isContinuous(yEncQ);
                        if (xIsContinuous !== yIsContinuous) {
                            // TODO: Bar and tick's dimension should not be continuous (quant/time) scale
                            return true;
                        }
                        return false;
                    }
                case mark_1.Mark.CIRCLE:
                case mark_1.Mark.POINT:
                case mark_1.Mark.SQUARE:
                case mark_1.Mark.RULE:
                    return true;
            }
            /* istanbul ignore next */
            throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
        }
    },
    {
        name: 'omitNonLinearScaleTypeWithStack',
        description: 'Stacked plot should only use linear scale',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.SCALE, property_1.getEncodingNestedProp('scale', 'type'), property_1.Property.TYPE],
        // TODO: Property.STACK
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (specM, _, __) {
            var stack = specM.stack();
            if (stack) {
                for (var _i = 0, _a = specM.getEncodings(); _i < _a.length; _i++) {
                    var encQ = _a[_i];
                    if (encoding_1.isValueQuery(encQ))
                        continue;
                    if ((!!encQ.aggregate || encQ.autoCount === true) &&
                        encQ.type === type_1.Type.QUANTITATIVE &&
                        util_1.contains([channel_1.Channel.X, channel_1.Channel.Y], encQ.channel)) {
                        if (encoding_1.scaleType(encQ) !== scale_1.ScaleType.LINEAR) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    },
    {
        name: 'omitNonSumStack',
        description: 'Stacked plot should use summative aggregation such as sum, count, or distinct',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, __) {
            var stack = specM.stack();
            if (stack) {
                var measureEncQ = specM.getEncodingQueryByChannel(stack.fieldChannel);
                return encoding_1.isFieldQuery(measureEncQ) && (util_1.contains(aggregate_1.SUM_OPS, measureEncQ.aggregate) || !!measureEncQ.autoCount);
            }
            return true;
        }
    },
    {
        name: 'omitTableWithOcclusionIfAutoAddCount',
        description: 'Plots without aggregation or autocount where x and y are both discrete should be omitted if autoAddCount is enabled as they often lead to occlusion',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (specM, _, opt) {
            if (opt.autoAddCount) {
                var xEncQ = specM.getEncodingQueryByChannel('x');
                var yEncQ = specM.getEncodingQueryByChannel('y');
                // TODO(#186): take mark properties channel into account
                if (encoding_1.isDiscrete(xEncQ) &&
                    encoding_1.isDiscrete(yEncQ) &&
                    !specM.isAggregate() // TODO: refactor based on statistics
                ) {
                    return false;
                }
            }
            return true;
        }
    }
].map(function (sc) { return new SpecConstraintModel(sc); });
// For testing
exports.SPEC_CONSTRAINT_INDEX = exports.SPEC_CONSTRAINTS.reduce(function (m, c) {
    m[c.name()] = c;
    return m;
}, {});
var SPEC_CONSTRAINTS_BY_PROPERTY = exports.SPEC_CONSTRAINTS.reduce(function (index, c) {
    for (var _i = 0, _a = c.properties(); _i < _a.length; _i++) {
        var prop = _a[_i];
        // Initialize array and use it
        index.set(prop, index.get(prop) || []);
        index.get(prop).push(c);
    }
    return index;
}, new propindex_1.PropIndex());
/**
 * Check all encoding constraints for a particular property and index tuple
 */
function checkSpec(prop, wildcard, specM, schema, opt) {
    // Check encoding constraint
    var specConstraints = SPEC_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
    for (var _i = 0, specConstraints_1 = specConstraints; _i < specConstraints_1.length; _i++) {
        var c = specConstraints_1[_i];
        // Check if the constraint is enabled
        if (c.strict() || !!opt[c.name()]) {
            // For strict constraint, or enabled non-strict, check the constraints
            var satisfy = c.satisfy(specM, schema, opt);
            if (!satisfy) {
                var violatedConstraint = '(spec) ' + c.name();
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
exports.checkSpec = checkSpec;
//# sourceMappingURL=spec.js.map