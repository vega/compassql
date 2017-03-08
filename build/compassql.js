(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cql = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var channel_1 = require("vega-lite/build/src/channel");
var property_1 = require("./property");
var wildcard_1 = require("./wildcard");
exports.DEFAULT_QUERY_CONFIG = {
    verbose: false,
    defaultSpecConfig: {
        overlay: { line: true },
        scale: { useUnaggregatedDomain: true }
    },
    propertyPrecedence: property_1.DEFAULT_PROP_PRECEDENCE.map(property_1.toKey),
    enum: wildcard_1.DEFAULT_ENUM_INDEX,
    numberNominalProportion: 0.05,
    numberNominalLimit: 40,
    // CONSTRAINTS
    constraintManuallySpecifiedValue: false,
    // Spec Constraints -- See description inside src/constraints/spec.ts
    autoAddCount: false,
    hasAppropriateGraphicTypeForMark: true,
    omitAggregate: false,
    omitAggregatePlotWithDimensionOnlyOnFacet: true,
    omitAggregatePlotWithoutDimension: false,
    omitBarLineAreaWithOcclusion: true,
    omitBarTickWithSize: true,
    omitMultipleNonPositionalChannels: true,
    omitNonSumStack: true,
    omitRaw: false,
    omitRawContinuousFieldForAggregatePlot: true,
    omitRepeatedField: true,
    omitNonPositionalOrFacetOverPositionalChannels: true,
    omitTableWithOcclusionIfAutoAddCount: true,
    omitVerticalDotPlot: false,
    preferredBinAxis: channel_1.Channel.X,
    preferredTemporalAxis: channel_1.Channel.X,
    preferredOrdinalAxis: channel_1.Channel.Y,
    preferredNominalAxis: channel_1.Channel.Y,
    preferredFacet: channel_1.Channel.ROW,
    // Encoding Constraints -- See description inside src/constraints/encoding.ts
    maxCardinalityForCategoricalColor: 20,
    maxCardinalityForFacet: 20,
    maxCardinalityForShape: 6,
    timeUnitShouldHaveVariation: true,
    typeMatchesSchemaType: true,
    // STYLIZE
    stylize: true,
    smallRangeStepForHighCardinalityOrFacet: { maxCardinality: 10, rangeStep: 12 },
    nominalColorScaleForHighCardinality: { maxCardinality: 10, palette: 'category20' },
    xAxisOnTopForHighYCardinalityWithoutColumn: { maxCardinality: 30 },
    // RANKING PREFERENCE
    maxGoodCardinalityForFacet: 5,
    maxGoodCardinalityForColor: 7,
};
function extendConfig(opt) {
    return __assign({}, exports.DEFAULT_QUERY_CONFIG, opt, { enum: extendEnumIndex(opt.enum) });
}
exports.extendConfig = extendConfig;
function extendEnumIndex(enumIndex) {
    var enumOpt = __assign({}, wildcard_1.DEFAULT_ENUM_INDEX, enumIndex, { binProps: extendNestedEnumIndex(enumIndex, 'bin'), scaleProps: extendNestedEnumIndex(enumIndex, 'scale'), axisProps: extendNestedEnumIndex(enumIndex, 'axis'), legendProps: extendNestedEnumIndex(enumIndex, 'legend') });
    return enumOpt;
}
function extendNestedEnumIndex(enumIndex, prop) {
    return __assign({}, wildcard_1.DEFAULT_ENUM_INDEX[prop + 'Props'], enumIndex[prop + 'Props']);
}

},{"./property":11,"./wildcard":36,"vega-lite/build/src/channel":53}],2:[function(require,module,exports){
"use strict";
/**
 * Abstract model for a constraint.
 */
var AbstractConstraintModel = (function () {
    function AbstractConstraintModel(constraint) {
        this.constraint = constraint;
    }
    AbstractConstraintModel.prototype.name = function () {
        return this.constraint.name;
    };
    AbstractConstraintModel.prototype.description = function () {
        return this.constraint.description;
    };
    AbstractConstraintModel.prototype.properties = function () {
        return this.constraint.properties;
    };
    AbstractConstraintModel.prototype.strict = function () {
        return this.constraint.strict;
    };
    return AbstractConstraintModel;
}());
exports.AbstractConstraintModel = AbstractConstraintModel;

},{}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var channel_1 = require("vega-lite/build/src/channel");
var fielddef_1 = require("vega-lite/build/src/fielddef");
var scale_1 = require("vega-lite/build/src/scale");
var type_1 = require("vega-lite/build/src/type");
var base_1 = require("./base");
var property_1 = require("../property");
var propindex_1 = require("../propindex");
var wildcard_1 = require("../wildcard");
var schema_1 = require("../schema");
var util_1 = require("../util");
var encoding_1 = require("../query/encoding");
var EncodingConstraintModel = (function (_super) {
    __extends(EncodingConstraintModel, _super);
    function EncodingConstraintModel(constraint) {
        return _super.call(this, constraint) || this;
    }
    EncodingConstraintModel.prototype.hasAllRequiredPropertiesSpecific = function (encQ) {
        return util_1.every(this.constraint.properties, function (prop) {
            if (property_1.isEncodingNestedProp(prop)) {
                var parent_1 = prop.parent;
                var child = prop.child;
                if (!encQ[parent_1]) {
                    return true;
                }
                return !wildcard_1.isWildcard(encQ[parent_1][child]);
            }
            if (!encQ[prop]) {
                return true;
            }
            return !wildcard_1.isWildcard(encQ[prop]);
        });
    };
    EncodingConstraintModel.prototype.satisfy = function (encQ, schema, encWildcardIndex, opt) {
        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
        if (!this.constraint.allowWildcardForProperties) {
            // TODO: extract as a method and do unit test
            if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
                return true;
            }
        }
        return this.constraint.satisfy(encQ, schema, encWildcardIndex, opt);
    };
    return EncodingConstraintModel;
}(base_1.AbstractConstraintModel));
exports.EncodingConstraintModel = EncodingConstraintModel;
exports.FIELD_CONSTRAINTS = [
    {
        name: 'aggregateOpSupportedByType',
        description: 'Aggregate function should be supported by data type.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ.aggregate) {
                return fieldQ.type !== type_1.Type.ORDINAL && fieldQ.type !== type_1.Type.NOMINAL;
            }
            // TODO: some aggregate function are actually supported by ordinal
            return true; // no aggregate is okay with any type.
        }
    }, {
        name: 'asteriskFieldWithCountOnly',
        description: 'Field="*" should be disallowed except aggregate="count"',
        properties: [property_1.Property.FIELD, property_1.Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            return (fieldQ.field === '*') === (fieldQ.aggregate === 'count');
        }
    }, {
        name: 'binAppliedForQuantitative',
        description: 'bin should be applied to quantitative field only.',
        properties: [property_1.Property.TYPE, property_1.Property.BIN],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ.bin) {
                // If binned, the type must be quantitative
                return fieldQ.type === type_1.Type.QUANTITATIVE;
            }
            return true;
        }
    }, {
        name: 'channelFieldCompatible',
        description: "encoding channel's range type be compatible with channel type.",
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, _, encWildcardIndex, opt) {
            var fieldDef = __assign({ field: 'f' }, encoding_1.toFieldDef(fieldQ, ['bin', 'timeUnit', 'type']));
            return fielddef_1.channelCompatibility(fieldDef, fieldQ.channel).compatible;
        }
    }, {
        name: 'hasFn',
        description: 'A field with as hasFn flag should have one of aggregate, timeUnit, or bin.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowWildcardForProperties: true,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ.hasFn) {
                return !!fieldQ.aggregate || !!fieldQ.bin || !!fieldQ.timeUnit;
            }
            return true;
        }
    }, {
        name: 'omitScaleZeroWithBinnedField',
        description: 'Do not use scale zero with binned field',
        properties: [property_1.Property.SCALE, property_1.getEncodingNestedProp('scale', 'zero'), property_1.Property.BIN],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ.bin && fieldQ.scale) {
                if (fieldQ.scale.zero === true) {
                    return false;
                }
            }
            return true;
        }
    }, {
        name: 'onlyOneTypeOfFunction',
        description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN],
        allowWildcardForProperties: true,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            var numFn = (!wildcard_1.isWildcard(fieldQ.aggregate) && !!fieldQ.aggregate ? 1 : 0) +
                (!wildcard_1.isWildcard(fieldQ.autoCount) && !!fieldQ.autoCount ? 1 : 0) +
                (!wildcard_1.isWildcard(fieldQ.bin) && !!fieldQ.bin ? 1 : 0) +
                (!wildcard_1.isWildcard(fieldQ.timeUnit) && !!fieldQ.timeUnit ? 1 : 0);
            return numFn <= 1;
        }
    }, {
        name: 'timeUnitAppliedForTemporal',
        description: 'Time unit should be applied to temporal field only.',
        properties: [property_1.Property.TYPE, property_1.Property.TIMEUNIT],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ.timeUnit && fieldQ.type !== type_1.Type.TEMPORAL) {
                return false;
            }
            return true;
        }
    }, {
        name: 'timeUnitShouldHaveVariation',
        description: 'A particular time unit should be applied only if they produce unique values.',
        properties: [property_1.Property.TIMEUNIT, property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (fieldQ, schema, encWildcardIndex, opt) {
            if (fieldQ.timeUnit && fieldQ.type === type_1.Type.TEMPORAL) {
                if (!encWildcardIndex.has('timeUnit') && !opt.constraintManuallySpecifiedValue) {
                    // Do not have to check this as this is manually specified by users.
                    return true;
                }
                return schema.timeUnitHasVariation(fieldQ);
            }
            return true;
        }
    }, {
        name: 'scalePropertiesSupportedByScaleType',
        description: 'Scale properties must be supported by correct scale type',
        properties: [].concat(property_1.SCALE_PROPS, [property_1.Property.SCALE, property_1.Property.TYPE]),
        allowWildcardForProperties: true,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ.scale) {
                var scale = fieldQ.scale;
                //  If fieldQ.type is an Wildcard and scale.type is undefined, it is equivalent
                //  to scale type is Wildcard. If scale type is an Wildcard, we do not yet know
                //  what the scale type is, and thus can ignore the constraint.
                var sType = encoding_1.scaleType(fieldQ);
                if (sType === undefined || sType === null) {
                    // If still ambiguous, doesn't check the constraint
                    return true;
                }
                for (var scaleProp in scale) {
                    if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
                        // ignore type and properties of wildcards
                        continue;
                    }
                    var sProp = scaleProp;
                    if (sType === 'point') {
                        // HACK: our current implementation of scaleType() can return point
                        // when the scaleType is a band since we didn't pass all parameter to Vega-Lite's scale type method.
                        if (!scale_1.scaleTypeSupportProperty('point', sProp) && !scale_1.scaleTypeSupportProperty('band', sProp)) {
                            return false;
                        }
                    }
                    else if (!scale_1.scaleTypeSupportProperty(sType, sProp)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }, {
        name: 'scalePropertiesSupportedByChannel',
        description: 'Not all scale properties are supported by all encoding channels',
        properties: [].concat(property_1.SCALE_PROPS, [property_1.Property.SCALE, property_1.Property.CHANNEL]),
        allowWildcardForProperties: true,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ) {
                var channel = fieldQ.channel;
                var scale = fieldQ.scale;
                if (channel && !wildcard_1.isWildcard(channel) && scale) {
                    for (var scaleProp in scale) {
                        if (!scale.hasOwnProperty(scaleProp))
                            continue;
                        if (scaleProp === 'type' || scaleProp === 'name' || scaleProp === 'enum') {
                            // ignore type and properties of wildcards
                            continue;
                        }
                        var isSupported = scale_1.channelScalePropertyIncompatability(channel, scaleProp) === undefined;
                        if (!isSupported) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    }, {
        name: 'typeMatchesPrimitiveType',
        description: 'Data type should be supported by field\'s primitive type.',
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, schema, encWildcardIndex, opt) {
            if (fieldQ.field === '*') {
                return true;
            }
            var primitiveType = schema.primitiveType(fieldQ.field);
            var type = fieldQ.type;
            if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            switch (primitiveType) {
                case schema_1.PrimitiveType.BOOLEAN:
                case schema_1.PrimitiveType.STRING:
                    return type !== type_1.Type.QUANTITATIVE && type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.NUMBER:
                case schema_1.PrimitiveType.INTEGER:
                    return type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.DATE:
                    // TODO: add NOMINAL, ORDINAL support after we support this in Vega-Lite
                    return type === type_1.Type.TEMPORAL;
                case null:
                    // field does not exist in the schema
                    return false;
            }
            throw new Error('Not implemented');
        }
    },
    {
        name: 'typeMatchesSchemaType',
        description: 'Enumerated data type of a field should match the field\'s type in the schema.',
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (fieldQ, schema, encWildcardIndex, opt) {
            if (!encWildcardIndex.has('field') && !encWildcardIndex.has('type') && !opt.constraintManuallySpecifiedValue) {
                // Do not have to check this as this is manually specified by users.
                return true;
            }
            if (fieldQ.field === '*') {
                return fieldQ.type === type_1.Type.QUANTITATIVE;
            }
            return schema.type(fieldQ.field) === fieldQ.type;
        }
    }, {
        name: 'maxCardinalityForCategoricalColor',
        description: 'Categorical channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (fieldQ, schema, _, opt) {
            // TODO: missing case where ordinal / temporal use categorical color
            // (once we do so, need to add Property.BIN, Property.TIMEUNIT)
            if (fieldQ.channel === channel_1.Channel.COLOR && fieldQ.type === type_1.Type.NOMINAL) {
                return schema.cardinality(fieldQ) <= opt.maxCardinalityForCategoricalColor;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'maxCardinalityForFacet',
        description: 'Row/column channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (fieldQ, schema, _, opt) {
            if (fieldQ.channel === channel_1.Channel.ROW || fieldQ.channel === channel_1.Channel.COLUMN) {
                return schema.cardinality(fieldQ) <= opt.maxCardinalityForFacet;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'maxCardinalityForShape',
        description: 'Shape channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        allowWildcardForProperties: false,
        strict: false,
        satisfy: function (fieldQ, schema, _, opt) {
            if (fieldQ.channel === channel_1.Channel.SHAPE) {
                return schema.cardinality(fieldQ) <= opt.maxCardinalityForShape;
            }
            return true; // other channel is irrelevant to this constraint
        }
    }, {
        name: 'dataTypeAndFunctionMatchScaleType',
        description: 'Scale type must match data type',
        properties: [property_1.Property.TYPE, property_1.Property.SCALE, property_1.getEncodingNestedProp('scale', 'type'), property_1.Property.TIMEUNIT, property_1.Property.BIN],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (fieldQ, _, __, ___) {
            if (fieldQ.scale) {
                var type = fieldQ.type;
                var sType = encoding_1.scaleType(fieldQ);
                if (util_1.contains([type_1.Type.ORDINAL, type_1.Type.NOMINAL], type)) {
                    return sType === undefined || scale_1.hasDiscreteDomain(sType);
                }
                else if (type === type_1.Type.TEMPORAL) {
                    if (!fieldQ.timeUnit) {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType);
                    }
                    else {
                        return util_1.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC, undefined], sType) || scale_1.hasDiscreteDomain(sType);
                    }
                }
                else if (type === type_1.Type.QUANTITATIVE) {
                    if (fieldQ.bin) {
                        return util_1.contains([scale_1.ScaleType.LINEAR, undefined], sType);
                    }
                    else {
                        return util_1.contains([scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT, scale_1.ScaleType.QUANTILE, scale_1.ScaleType.QUANTIZE, scale_1.ScaleType.LINEAR, undefined], sType);
                    }
                }
            }
            return true;
        }
    }
].map(function (ec) { return new EncodingConstraintModel(ec); });
exports.FIELD_CONSTRAINT_INDEX = exports.FIELD_CONSTRAINTS.reduce(function (m, ec) {
    m[ec.name()] = ec;
    return m;
}, {});
var FIELD_CONSTRAINTS_BY_PROPERTY = exports.FIELD_CONSTRAINTS.reduce(function (index, c) {
    for (var _i = 0, _a = c.properties(); _i < _a.length; _i++) {
        var prop = _a[_i];
        // Initialize array and use it
        index.set(prop, index.get(prop) || []);
        index.get(prop).push(c);
    }
    return index;
}, new propindex_1.PropIndex());
exports.VALUE_CONSTRAINTS = [
    {
        name: 'doesNotSupportConstantValue',
        description: 'row, column, x, y, and detail should not work with constant values.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        allowWildcardForProperties: false,
        strict: true,
        satisfy: function (valueQ, _, __, ___) {
            return !(util_1.contains(['row', 'column', 'x', 'y', 'detail'], valueQ.channel));
        }
    }
].map(function (ec) { return new EncodingConstraintModel(ec); });
exports.VALUE_CONSTRAINT_INDEX = exports.VALUE_CONSTRAINTS.reduce(function (m, ec) {
    m[ec.name()] = ec;
    return m;
}, {});
var VALUE_CONSTRAINTS_BY_PROPERTY = exports.FIELD_CONSTRAINTS.reduce(function (index, c) {
    for (var _i = 0, _a = c.properties(); _i < _a.length; _i++) {
        var prop = _a[_i];
        index.set(prop, index.get(prop) || []);
        index.get(prop).push(c);
    }
    return index;
}, new propindex_1.PropIndex());
/**
 * Check all encoding constraints for a particular property and index tuple
 */
function checkEncoding(prop, wildcard, index, specM, schema, opt) {
    // Check encoding constraint
    var encodingConstraints = FIELD_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
    var encQ = specM.getEncodingQueryByIndex(index);
    for (var _i = 0, encodingConstraints_1 = encodingConstraints; _i < encodingConstraints_1.length; _i++) {
        var c = encodingConstraints_1[_i];
        // Check if the constraint is enabled
        if (c.strict() || !!opt[c.name()]) {
            // For strict constraint, or enabled non-strict, check the constraints
            var satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
            if (!satisfy) {
                var violatedConstraint = '(enc) ' + c.name();
                /* istanbul ignore if */
                if (opt.verbose) {
                    console.log(violatedConstraint + ' failed with ' + specM.toShorthand() + ' for ' + wildcard.name);
                }
                return violatedConstraint;
            }
        }
    }
    var valueContraints = VALUE_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
    for (var _a = 0, valueContraints_1 = valueContraints; _a < valueContraints_1.length; _a++) {
        var c = valueContraints_1[_a];
        // Check if the constraint is enabled
        if ((c.strict() || !!opt[c.name()]) && encoding_1.isValueQuery(encQ)) {
            // For strict constraint, or enabled non-strict, check the constraints
            var satisfy = c.satisfy(encQ, schema, specM.wildcardIndex.encodings[index], opt);
            if (!satisfy) {
                var violatedConstraint = '(enc) ' + c.name();
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
exports.checkEncoding = checkEncoding;

},{"../property":11,"../propindex":12,"../query/encoding":13,"../schema":33,"../util":35,"../wildcard":36,"./base":2,"vega-lite/build/src/channel":53,"vega-lite/build/src/fielddef":56,"vega-lite/build/src/scale":60,"vega-lite/build/src/type":62}],4:[function(require,module,exports){
"use strict";
var encoding = require("./encoding");
exports.encoding = encoding;
var spec = require("./spec");
exports.spec = spec;

},{"./encoding":3,"./spec":5}],5:[function(require,module,exports){
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

},{"../property":11,"../propindex":12,"../query/encoding":13,"../util":35,"../wildcard":36,"./base":2,"vega-lite/build/src/aggregate":50,"vega-lite/build/src/channel":53,"vega-lite/build/src/mark":59,"vega-lite/build/src/scale":60,"vega-lite/build/src/type":62}],6:[function(require,module,exports){
"use strict";
exports.version = '0.11.0';
exports.config = require("./config");
exports.constraint = require("./constraint");
exports.enumerate = require("./enumerator");
exports.wildcard = require("./wildcard");
var generate_1 = require("./generate");
exports.generate = generate_1.generate;
exports.model = require("./model");
exports.nest = require("./nest");
exports.property = require("./property");
exports.query = require("./query");
exports.ranking = require("./ranking/ranking");
var recommend_1 = require("./recommend");
exports.recommend = recommend_1.recommend;
exports.schema = require("./schema");
exports.util = require("./util");

},{"./config":1,"./constraint":4,"./enumerator":7,"./generate":8,"./model":9,"./nest":10,"./property":11,"./query":15,"./ranking/ranking":31,"./recommend":32,"./schema":33,"./util":35,"./wildcard":36}],7:[function(require,module,exports){
"use strict";
var encoding_1 = require("./constraint/encoding");
var spec_1 = require("./constraint/spec");
var property_1 = require("./property");
var propindex_1 = require("./propindex");
var encoding_2 = require("./query/encoding");
var ENUMERATOR_INDEX = new propindex_1.PropIndex();
function getEnumerator(prop) {
    return ENUMERATOR_INDEX.get(prop);
}
exports.getEnumerator = getEnumerator;
ENUMERATOR_INDEX.set('mark', function (wildcardIndex, schema, opt) {
    return function (answerSet, specM) {
        var markWildcard = specM.getMark();
        // enumerate the value
        markWildcard.enum.forEach(function (mark) {
            specM.setMark(mark);
            // Check spec constraint
            var violatedSpecConstraint = spec_1.checkSpec('mark', wildcardIndex.mark, specM, schema, opt);
            if (!violatedSpecConstraint) {
                // emit
                answerSet.push(specM.duplicate());
            }
        });
        // Reset to avoid side effect
        specM.resetMark();
        return answerSet;
    };
});
property_1.ENCODING_TOPLEVEL_PROPS.forEach(function (prop) {
    ENUMERATOR_INDEX.set(prop, EncodingPropertyGeneratorFactory(prop));
});
property_1.ENCODING_NESTED_PROPS.forEach(function (nestedProp) {
    ENUMERATOR_INDEX.set(nestedProp, EncodingPropertyGeneratorFactory(nestedProp));
});
/**
 * @param prop property type.
 * @return an answer set reducer factory for the given prop.
 */
function EncodingPropertyGeneratorFactory(prop) {
    /**
     * @return as reducer that takes a specQueryModel as input and output an answer set array.
     */
    return function (wildcardIndex, schema, opt) {
        return function (answerSet, specM) {
            // index of encoding mappings that require enumeration
            var indices = wildcardIndex.encodingIndicesByProperty.get(prop);
            function enumerate(jobIndex) {
                if (jobIndex === indices.length) {
                    // emit and terminate
                    answerSet.push(specM.duplicate());
                    return;
                }
                var index = indices[jobIndex];
                var wildcard = wildcardIndex.encodings[index].get(prop);
                var encQ = specM.getEncodingQueryByIndex(index);
                var propWildcard = specM.getEncodingProperty(index, prop);
                if (encoding_2.isValueQuery(encQ) || (
                // TODO: encQ.exclude
                // If this encoding query is an excluded autoCount, there is no point enumerating other properties
                // for this encoding query because they will be excluded anyway.
                // Thus, we can just move on to the next encoding to enumerate.
                encQ.autoCount === false ||
                    // nested encoding property might have its parent set to false
                    // therefore, we no longer have to enumerate them
                    !propWildcard)) {
                    enumerate(jobIndex + 1);
                }
                else {
                    wildcard.enum.forEach(function (propVal) {
                        if (propVal === null) {
                            // our duplicate() method use JSON.stringify, parse and thus can accidentally
                            // convert undefined in an array into null
                            propVal = undefined;
                        }
                        specM.setEncodingProperty(index, prop, propVal, wildcard);
                        // Check encoding constraint
                        var violatedEncodingConstraint = encoding_1.checkEncoding(prop, wildcard, index, specM, schema, opt);
                        if (violatedEncodingConstraint) {
                            return; // do not keep searching
                        }
                        // Check spec constraint
                        var violatedSpecConstraint = spec_1.checkSpec(prop, wildcard, specM, schema, opt);
                        if (violatedSpecConstraint) {
                            return; // do not keep searching
                        }
                        // If qualify all of the constraints, keep enumerating
                        enumerate(jobIndex + 1);
                    });
                    // Reset to avoid side effect
                    specM.resetEncodingProperty(index, prop, wildcard);
                }
            }
            // start enumerating from 0
            enumerate(0);
            return answerSet;
        };
    };
}
exports.EncodingPropertyGeneratorFactory = EncodingPropertyGeneratorFactory;

},{"./constraint/encoding":3,"./constraint/spec":5,"./property":11,"./propindex":12,"./query/encoding":13}],8:[function(require,module,exports){
"use strict";
var config_1 = require("./config");
var enumerator_1 = require("./enumerator");
var model_1 = require("./model");
var property_1 = require("./property");
var stylize_1 = require("./stylize");
function generate(specQ, schema, opt) {
    if (opt === void 0) { opt = config_1.DEFAULT_QUERY_CONFIG; }
    // 1. Build a SpecQueryModel, which also contains wildcardIndex
    var specM = model_1.SpecQueryModel.build(specQ, schema, opt);
    var wildcardIndex = specM.wildcardIndex;
    // 2. Enumerate each of the properties based on propPrecedence.
    var answerSet = [specM]; // Initialize Answer Set with only the input spec query.
    opt.propertyPrecedence.forEach(function (propKey) {
        var prop = property_1.fromKey(propKey);
        // If the original specQuery contains wildcard for this prop
        if (wildcardIndex.hasProperty(prop)) {
            // update answerset
            var enumerator = enumerator_1.getEnumerator(prop);
            var reducer = enumerator(wildcardIndex, schema, opt);
            answerSet = answerSet.reduce(reducer, []);
        }
    });
    if (opt.stylize) {
        if ((opt.nominalColorScaleForHighCardinality !== null) ||
            (opt.smallRangeStepForHighCardinalityOrFacet !== null) ||
            (opt.xAxisOnTopForHighYCardinalityWithoutColumn !== null)) {
            return stylize_1.stylize(answerSet, schema, opt);
        }
    }
    return answerSet;
}
exports.generate = generate;

},{"./config":1,"./enumerator":7,"./model":9,"./property":11,"./stylize":34}],9:[function(require,module,exports){
"use strict";
var type_1 = require("vega-lite/build/src/type");
var property_1 = require("./property");
var wildcard_1 = require("./wildcard");
var wildcardindex_1 = require("./wildcardindex");
var spec_1 = require("./query/spec");
var encoding_1 = require("./query/encoding");
var groupby_1 = require("./query/groupby");
var shorthand_1 = require("./query/shorthand");
var util_1 = require("./util");
/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
var SpecQueryModel = (function () {
    function SpecQueryModel(spec, wildcardIndex, schema, opt, wildcardAssignment) {
        this._rankingScore = {};
        this._spec = spec;
        this._channelFieldCount = spec.encodings.reduce(function (m, encQ) {
            // TODO(akshatsh): add a test case
            if (encoding_1.isFieldQuery(encQ) && !wildcard_1.isWildcard(encQ.channel) && encQ.autoCount !== false) {
                m[encQ.channel + ''] = 1;
            }
            return m;
        }, {});
        this._wildcardIndex = wildcardIndex;
        this._assignedWildcardIndex = wildcardAssignment;
        this._opt = opt;
        this._schema = schema;
    }
    /**
     * Build an WildcardIndex by detecting enumeration specifiers
     * in the input specQuery and replace short wildcards with
     * full ones that includes both names and enumValues.
     *
     * @return a SpecQueryModel that wraps the specQuery and the WildcardIndex.
     */
    SpecQueryModel.build = function (specQ, schema, opt) {
        var wildcardIndex = new wildcardindex_1.WildcardIndex();
        // mark
        if (wildcard_1.isWildcard(specQ.mark)) {
            var name_1 = wildcard_1.getDefaultName(property_1.Property.MARK);
            specQ.mark = wildcard_1.initWildcard(specQ.mark, name_1, opt.enum.mark);
            wildcardIndex.setMark(specQ.mark);
        }
        // TODO: transform
        // encodings
        specQ.encodings.forEach(function (encQ, index) {
            if (encoding_1.isFieldQuery(encQ) && encQ.autoCount !== undefined) {
                // This is only for testing purpose
                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
                encQ.type = type_1.Type.QUANTITATIVE; // autoCount is always quantitative
            }
            if (encoding_1.isFieldQuery(encQ) && encQ.type === undefined) {
                // type is optional -- we automatically augment wildcard if not specified
                encQ.type = wildcard_1.SHORT_WILDCARD;
            }
            // For each property of the encodingQuery, enumerate
            property_1.ENCODING_TOPLEVEL_PROPS.forEach(function (prop) {
                if (wildcard_1.isWildcard(encQ[prop])) {
                    // Assign default wildcard name and enum values.
                    var defaultWildcardName = wildcard_1.getDefaultName(prop) + index;
                    var defaultEnumValues = wildcard_1.getDefaultEnumValues(prop, schema, opt);
                    var wildcard = encQ[prop] = wildcard_1.initWildcard(encQ[prop], defaultWildcardName, defaultEnumValues);
                    // Add index of the encoding mapping to the property's wildcard index.
                    wildcardIndex.setEncodingProperty(index, prop, wildcard);
                }
            });
            // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
            property_1.ENCODING_NESTED_PROPS.forEach(function (prop) {
                var propObj = encQ[prop.parent]; // the property object e.g., encQ.bin
                if (propObj) {
                    var child = prop.child;
                    if (wildcard_1.isWildcard(propObj[child])) {
                        // Assign default wildcard name and enum values.
                        var defaultWildcardName = wildcard_1.getDefaultName(prop) + index;
                        var defaultEnumValues = wildcard_1.getDefaultEnumValues(prop, schema, opt);
                        var wildcard = propObj[child] = wildcard_1.initWildcard(propObj[child], defaultWildcardName, defaultEnumValues);
                        // Add index of the encoding mapping to the property's wildcard index.
                        wildcardIndex.setEncodingProperty(index, prop, wildcard);
                    }
                }
            });
        });
        // AUTO COUNT
        // Add Auto Count Field
        if (opt.autoAddCount) {
            var countEncQ = {
                channel: {
                    name: wildcard_1.getDefaultName(property_1.Property.CHANNEL) + specQ.encodings.length,
                    enum: wildcard_1.getDefaultEnumValues(property_1.Property.CHANNEL, schema, opt)
                },
                autoCount: {
                    name: wildcard_1.getDefaultName(property_1.Property.AUTOCOUNT) + specQ.encodings.length,
                    enum: [false, true]
                },
                type: type_1.Type.QUANTITATIVE
            };
            specQ.encodings.push(countEncQ);
            var index = specQ.encodings.length - 1;
            // Add index of the encoding mapping to the property's wildcard index.
            wildcardIndex.setEncodingProperty(index, property_1.Property.CHANNEL, countEncQ.channel);
            wildcardIndex.setEncodingProperty(index, property_1.Property.AUTOCOUNT, countEncQ.autoCount);
        }
        return new SpecQueryModel(specQ, wildcardIndex, schema, opt, {});
    };
    Object.defineProperty(SpecQueryModel.prototype, "wildcardIndex", {
        get: function () {
            return this._wildcardIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModel.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModel.prototype, "specQuery", {
        get: function () {
            return this._spec;
        },
        enumerable: true,
        configurable: true
    });
    SpecQueryModel.prototype.duplicate = function () {
        return new SpecQueryModel(util_1.duplicate(this._spec), this._wildcardIndex, this._schema, this._opt, util_1.duplicate(this._assignedWildcardIndex));
    };
    SpecQueryModel.prototype.setMark = function (mark) {
        var name = this._spec.mark.name;
        this._assignedWildcardIndex[name] = this._spec.mark = mark;
    };
    SpecQueryModel.prototype.resetMark = function () {
        var wildcard = this._spec.mark = this._wildcardIndex.mark;
        delete this._assignedWildcardIndex[wildcard.name];
    };
    SpecQueryModel.prototype.getMark = function () {
        return this._spec.mark;
    };
    SpecQueryModel.prototype.getEncodingProperty = function (index, prop) {
        var encQ = this._spec.encodings[index];
        if (property_1.isEncodingNestedProp(prop)) {
            return encQ[prop.parent][prop.child];
        }
        return encQ[prop]; // encoding property (non-nested)
    };
    SpecQueryModel.prototype.setEncodingProperty = function (index, prop, value, wildcard) {
        var encQ = this._spec.encodings[index];
        if (prop === property_1.Property.CHANNEL && encQ.channel && !wildcard_1.isWildcard(encQ.channel)) {
            // If there is an old channel
            this._channelFieldCount[encQ.channel]--;
        }
        if (property_1.isEncodingNestedProp(prop)) {
            encQ[prop.parent][prop.child] = value;
        }
        else if (property_1.hasNestedProperty(prop) && value === true) {
            encQ[prop] = util_1.extend({}, encQ[prop], // copy all existing properties
            { enum: undefined, name: undefined } // except name and values to it no longer an wildcard
            );
        }
        else {
            encQ[prop] = value;
        }
        this._assignedWildcardIndex[wildcard.name] = value;
        if (prop === property_1.Property.CHANNEL) {
            // If there is a new channel, make sure it exists and add it to the count.
            this._channelFieldCount[value] = (this._channelFieldCount[value] || 0) + 1;
        }
    };
    SpecQueryModel.prototype.resetEncodingProperty = function (index, prop, wildcard) {
        var encQ = this._spec.encodings[index];
        if (prop === property_1.Property.CHANNEL) {
            this._channelFieldCount[encQ.channel]--;
        }
        // reset it to wildcard
        if (property_1.isEncodingNestedProp(prop)) {
            encQ[prop.parent][prop.child] = wildcard;
        }
        else {
            encQ[prop] = wildcard;
        }
        // add remove value that is reset from the assignment map
        delete this._assignedWildcardIndex[wildcard.name];
    };
    SpecQueryModel.prototype.channelUsed = function (channel) {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._channelFieldCount[channel] > 0;
    };
    SpecQueryModel.prototype.stack = function () {
        return spec_1.stack(this._spec);
    };
    SpecQueryModel.prototype.getEncodings = function () {
        // do not include encoding that has autoCount = false because it is not a part of the output spec.
        return this._spec.encodings.filter(function (encQ) { return (encoding_1.isValueQuery(encQ) || encQ.autoCount !== false); });
    };
    SpecQueryModel.prototype.getEncodingQueryByChannel = function (channel) {
        for (var _i = 0, _a = this._spec.encodings; _i < _a.length; _i++) {
            var specEncoding = _a[_i];
            if (specEncoding.channel === channel) {
                return specEncoding;
            }
        }
        return undefined;
    };
    SpecQueryModel.prototype.getEncodingQueryByIndex = function (i) {
        return this._spec.encodings[i];
    };
    SpecQueryModel.prototype.isAggregate = function () {
        return spec_1.isAggregate(this._spec);
    };
    SpecQueryModel.prototype.toShorthand = function (groupBy) {
        if (groupBy) {
            var parsedGroupBy = groupby_1.parseGroupBy(groupBy);
            return shorthand_1.spec(this._spec, parsedGroupBy.include, parsedGroupBy.replacer);
        }
        return shorthand_1.spec(this._spec);
    };
    SpecQueryModel.prototype._encoding = function () {
        var encoding = {};
        for (var _i = 0, _a = this._spec.encodings; _i < _a.length; _i++) {
            var encQ = _a[_i];
            var fieldDef = {};
            // For count field that is automatically added, convert to correct vega-lite fieldDef
            if (encoding_1.isFieldQuery(encQ) && encQ.autoCount === true) {
                fieldDef.aggregate = 'count';
                fieldDef.field = '*';
                fieldDef.type = type_1.Type.QUANTITATIVE;
            }
            else if (encoding_1.isValueQuery(encQ) || encQ.autoCount === false) {
                continue; // Do not include this in the output.
            }
            // if channel is a wildcard, return null
            if (wildcard_1.isWildcard(encQ.channel))
                return null;
            // assemble other property into a field def.
            var PROPERTIES = [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.FIELD, property_1.Property.TYPE, property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND];
            // TODO(#226):
            // write toSpec() and toShorthand() in a way that prevents outputting inapplicable scale, sort, axis / legend
            for (var _b = 0, PROPERTIES_1 = PROPERTIES; _b < PROPERTIES_1.length; _b++) {
                var prop = PROPERTIES_1[_b];
                // if the property is a wildcard, return null
                if (wildcard_1.isWildcard(encQ[prop]))
                    return null;
                // otherwise, assign the proper to the field def
                if (encQ[prop] !== undefined) {
                    if (!shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop] ||
                        shorthand_1.PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel]) {
                        fieldDef[prop] = encQ[prop];
                    }
                }
            }
            if (fieldDef.bin === false) {
                // exclude bin false
                delete fieldDef.bin;
            }
            encoding[encQ.channel] = fieldDef;
        }
        return encoding;
    };
    /**
     * Convert a query to a Vega-Lite spec if it is completed.
     * @return a Vega-Lite spec if completed, null otherwise.
     */
    SpecQueryModel.prototype.toSpec = function (data) {
        if (wildcard_1.isWildcard(this._spec.mark))
            return null;
        var spec = {};
        data = data || this._spec.data;
        if (data) {
            spec.data = data;
        }
        if (this._spec.transform) {
            spec.transform = this._spec.transform;
        }
        spec.mark = this._spec.mark;
        spec.encoding = this._encoding();
        if (spec.encoding === null) {
            return null;
        }
        if (this._spec.config || this._opt.defaultSpecConfig)
            spec.config = util_1.extend({}, this._opt.defaultSpecConfig, this._spec.config);
        return spec;
    };
    SpecQueryModel.prototype.getRankingScore = function (rankingName) {
        return this._rankingScore[rankingName];
    };
    SpecQueryModel.prototype.setRankingScore = function (rankingName, score) {
        this._rankingScore[rankingName] = score;
    };
    return SpecQueryModel;
}());
exports.SpecQueryModel = SpecQueryModel;
var SpecQueryModelGroup = (function () {
    function SpecQueryModelGroup(name, path, items, groupBy, orderGroupBy) {
        if (name === void 0) { name = ''; }
        if (path === void 0) { path = ''; }
        if (items === void 0) { items = []; }
        if (groupBy === void 0) { groupBy = undefined; }
        if (orderGroupBy === void 0) { orderGroupBy = undefined; }
        this._name = name;
        this._path = path;
        this._items = items;
        this._groupBy = groupBy;
        this._orderGroupBy = orderGroupBy;
    }
    SpecQueryModelGroup.prototype.getTopSpecQueryModel = function () {
        var topItem = this._items[0];
        if (topItem instanceof SpecQueryModelGroup) {
            return topItem.getTopSpecQueryModel();
        }
        else {
            return topItem;
        }
    };
    Object.defineProperty(SpecQueryModelGroup.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "groupBy", {
        get: function () {
            return this._groupBy;
        },
        set: function (groupBy) {
            this._groupBy = groupBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecQueryModelGroup.prototype, "orderGroupBy", {
        get: function () {
            return this._orderGroupBy;
        },
        set: function (orderGroupBy) {
            this._orderGroupBy = orderGroupBy;
        },
        enumerable: true,
        configurable: true
    });
    return SpecQueryModelGroup;
}());
exports.SpecQueryModelGroup = SpecQueryModelGroup;

},{"./property":11,"./query/encoding":13,"./query/groupby":14,"./query/shorthand":17,"./query/spec":18,"./util":35,"./wildcard":36,"./wildcardindex":37,"vega-lite/build/src/type":62}],10:[function(require,module,exports){
"use strict";
var channel_1 = require("vega-lite/build/src/channel");
var util_1 = require("datalib/src/util");
var model_1 = require("./model");
var property_1 = require("./property");
var propindex_1 = require("./propindex");
var groupby_1 = require("./query/groupby");
var shorthand_1 = require("./query/shorthand");
var spec_1 = require("./query/spec");
/**
 * Registry for all possible grouping key functions.
 */
var groupRegistry = {};
/**
 * Add a grouping function to the registry.
 */
function registerKeyFn(name, keyFn) {
    groupRegistry[name] = keyFn;
}
exports.registerKeyFn = registerKeyFn;
exports.FIELD = 'field';
exports.FIELD_TRANSFORM = 'fieldTransform';
exports.ENCODING = 'encoding';
exports.TRANSPOSE = 'transpose';
exports.SPEC = 'spec';
/**
 * Group the input spec query model by a key function registered in the group registry
 * @return
 */
function nest(specModels, queryNest) {
    if (queryNest) {
        var rootGroup_1 = new model_1.SpecQueryModelGroup();
        var groupIndex_1 = {};
        // global `includes` and `replaces` will get augmented by each level's groupBy.
        // Upper level's `groupBy` will get cascaded to lower-level groupBy.
        // `replace` can be overriden in a lower-level to support different grouping.
        var includes_1 = [];
        var replaces = [];
        var replacers_1 = [];
        for (var l = 0; l < queryNest.length; l++) {
            includes_1.push(l > 0 ? includes_1[l - 1].duplicate() : new propindex_1.PropIndex());
            replaces.push(l > 0 ? replaces[l - 1].duplicate() : new propindex_1.PropIndex());
            var groupBy = queryNest[l].groupBy;
            if (util_1.isArray(groupBy)) {
                // If group is array, it's an array of extended group by that need to be parsed
                var parsedGroupBy = groupby_1.parseGroupBy(groupBy, includes_1[l], replaces[l]);
                replacers_1.push(parsedGroupBy.replacer);
            }
        }
        // With includes and replacers, now we can construct the nesting tree
        specModels.forEach(function (specM) {
            var path = '';
            var group = rootGroup_1;
            for (var l = 0; l < queryNest.length; l++) {
                var groupBy = group.groupBy = queryNest[l].groupBy;
                group.orderGroupBy = queryNest[l].orderGroupBy;
                var key = util_1.isArray(groupBy) ?
                    shorthand_1.spec(specM.specQuery, includes_1[l], replacers_1[l]) :
                    groupRegistry[groupBy](specM);
                path += '/' + key;
                if (!groupIndex_1[path]) {
                    groupIndex_1[path] = new model_1.SpecQueryModelGroup(key, path, []);
                    group.items.push(groupIndex_1[path]);
                }
                group = groupIndex_1[path];
            }
            group.items.push(specM);
        });
        return rootGroup_1;
    }
    else {
        // no nesting, just return a flat group
        return new model_1.SpecQueryModelGroup('', '', specModels);
    }
}
exports.nest = nest;
// TODO: move this to groupBy, rename properly, and export
var GROUP_BY_FIELD = [property_1.Property.FIELD];
var PARSED_GROUP_BY_FIELD = groupby_1.parseGroupBy(GROUP_BY_FIELD);
registerKeyFn(exports.FIELD, function (specM) {
    return shorthand_1.spec(specM.specQuery, PARSED_GROUP_BY_FIELD.include, PARSED_GROUP_BY_FIELD.replacer);
});
exports.PARSED_GROUP_BY_FIELD_TRANSFORM = groupby_1.parseGroupBy(groupby_1.GROUP_BY_FIELD_TRANSFORM);
registerKeyFn(exports.FIELD_TRANSFORM, function (specM) {
    return shorthand_1.spec(specM.specQuery, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.include, exports.PARSED_GROUP_BY_FIELD_TRANSFORM.replacer);
});
exports.PARSED_GROUP_BY_ENCODING = groupby_1.parseGroupBy(groupby_1.GROUP_BY_ENCODING);
registerKeyFn(exports.ENCODING, function (specM) {
    return shorthand_1.spec(specM.specQuery, exports.PARSED_GROUP_BY_ENCODING.include, exports.PARSED_GROUP_BY_ENCODING.replacer);
});
function stringifyStack(specM) {
    var _stack = spec_1.stack(specM.specQuery);
    return (!!_stack ? 'stack=' + _stack.offset + '|' : '');
}
// TODO: rename, provide similar format
registerKeyFn(exports.TRANSPOSE, function (specM) {
    return specM.getMark() + '|' +
        stringifyStack(specM) +
        specM.getEncodings().map(function (encQ) {
            var fieldDef = shorthand_1.fieldDef(encQ);
            var channel = (encQ.channel === channel_1.Channel.X || encQ.channel === channel_1.Channel.Y) ? 'xy' :
                (encQ.channel === channel_1.Channel.ROW || encQ.channel === channel_1.Channel.COLUMN) ? 'facet' :
                    encQ.channel;
            return channel + ':' + fieldDef;
        })
            .sort()
            .join('|');
});
registerKeyFn(exports.SPEC, function (specM) { return JSON.stringify(specM.specQuery); });

},{"./model":9,"./property":11,"./propindex":12,"./query/groupby":14,"./query/shorthand":17,"./query/spec":18,"datalib/src/util":45,"vega-lite/build/src/channel":53}],11:[function(require,module,exports){
"use strict";
var axis_1 = require("vega-lite/build/src/axis");
var scale_1 = require("vega-lite/build/src/scale");
var legend_1 = require("vega-lite/build/src/legend");
var util_1 = require("./util");
function isEncodingNestedProp(p) {
    return !!p['parent'];
}
exports.isEncodingNestedProp = isEncodingNestedProp;
exports.ENCODING_TOPLEVEL_PROPS = [
    // channel
    'channel',
    // fn
    'aggregate', 'autoCount', 'bin', 'timeUnit', 'hasFn',
    // sort
    'sort',
    // field / type
    'field', 'type',
    // scale / axis / legend
    'scale', 'axis', 'legend'
];
var ENCODING_TOPLEVEL_PROPERTY_INDEX = util_1.toMap(exports.ENCODING_TOPLEVEL_PROPS);
function isEncodingTopLevelProperty(p) {
    return p in ENCODING_TOPLEVEL_PROPERTY_INDEX;
}
exports.isEncodingTopLevelProperty = isEncodingTopLevelProperty;
var ENCODING_NESTED_PROP_PARENTS = [
    'bin', 'scale', 'sort', 'axis', 'legend'
];
var ENCODING_NESTED_PROP_PARENT_INDEX = util_1.toMap(ENCODING_NESTED_PROP_PARENTS);
function hasNestedProperty(prop) {
    return ENCODING_NESTED_PROP_PARENT_INDEX[prop];
}
exports.hasNestedProperty = hasNestedProperty;
exports.BIN_CHILD_PROPS = ['maxbins', 'divide', 'extent', 'base', 'step', 'steps', 'minstep'];
exports.SORT_CHILD_PROPS = ['field', 'op', 'order'];
exports.SCALE_CHILD_PROPS = ['clamp', 'domain', 'exponent', 'nice', 'range', 'rangeStep', 'round', 'type', 'zero'];
var BIN_PROPS = exports.BIN_CHILD_PROPS.map(function (c) {
    return { parent: 'bin', child: c };
});
exports.SORT_PROPS = exports.SORT_CHILD_PROPS.map(function (c) {
    return { parent: 'sort', child: c };
});
exports.SCALE_PROPS = scale_1.SCALE_PROPERTIES.map(function (c) {
    return { parent: 'scale', child: c };
});
var AXIS_PROPS = axis_1.AXIS_PROPERTIES.map(function (c) {
    return { parent: 'axis', child: c };
});
var LEGEND_PROPS = legend_1.LEGEND_PROPERTIES.map(function (c) {
    return { parent: 'legend', child: c };
});
exports.ENCODING_NESTED_PROPS = [].concat(BIN_PROPS, exports.SORT_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS);
var PROP_KEY_DELIMITER = '.';
function toKey(p) {
    if (isEncodingNestedProp(p)) {
        return p.parent + PROP_KEY_DELIMITER + p.child;
    }
    return p;
}
exports.toKey = toKey;
function fromKey(k) {
    var split = k.split(PROP_KEY_DELIMITER);
    /* istanbul ignore else */
    if (split.length === 1) {
        return k;
    }
    else if (split.length === 2) {
        return {
            parent: split[0],
            child: split[1]
        };
    }
    else {
        throw 'Invalid property key with ' + split.length + ' dots: ' + k;
    }
}
exports.fromKey = fromKey;
var ENCODING_NESTED_PROP_INDEX = exports.ENCODING_NESTED_PROPS.reduce(function (i, prop) {
    i[prop.parent] = i[prop.parent] || [];
    i[prop.parent][prop.child] = prop;
    return i;
}, {});
// FIXME consider using a more general method
function getEncodingNestedProp(parent, child) {
    return (ENCODING_NESTED_PROP_INDEX[parent] || {})[child];
}
exports.getEncodingNestedProp = getEncodingNestedProp;
function isEncodingProperty(prop) {
    return isEncodingTopLevelProperty(prop) || isEncodingNestedProp(prop);
}
exports.isEncodingProperty = isEncodingProperty;
exports.ALL_ENCODING_PROPS = [].concat(exports.ENCODING_TOPLEVEL_PROPS, exports.ENCODING_NESTED_PROPS);
exports.DEFAULT_PROP_PRECEDENCE = [
    'type',
    'field',
    // Field Transform
    'bin', 'timeUnit', 'aggregate', 'autoCount',
    // Encoding
    'channel',
    // Mark
    'mark',
    'scale', 'sort',
    'axis', 'legend'
].concat(BIN_PROPS, exports.SCALE_PROPS, AXIS_PROPS, LEGEND_PROPS, exports.SORT_PROPS);
var Property;
(function (Property) {
    Property.MARK = 'mark';
    Property.FILTER = 'filter';
    // TODO: Sub-properties for filter
    Property.CALCULATE = 'calculate';
    // TODO: Sub-properties for calculate
    Property.FILTERINVALID = 'filterInvalid';
    // Layout
    Property.STACK = 'stack';
    // TODO: sub parts of stack
    // Encoding Properties
    Property.CHANNEL = 'channel';
    Property.AGGREGATE = 'aggregate';
    Property.AUTOCOUNT = 'autoCount';
    Property.BIN = 'bin';
    Property.HAS_FN = 'hasFn';
    Property.TIMEUNIT = 'timeUnit';
    Property.FIELD = 'field';
    Property.TYPE = 'type';
    Property.SORT = 'sort';
    Property.SCALE = 'scale';
    Property.AXIS = 'axis';
    Property.LEGEND = 'legend';
})(Property = exports.Property || (exports.Property = {}));

},{"./util":35,"vega-lite/build/src/axis":51,"vega-lite/build/src/legend":57,"vega-lite/build/src/scale":60}],12:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var util_1 = require("./util");
var property_1 = require("./property");
/**
 * Dictionary that takes property as a key.
 */
var PropIndex = (function () {
    function PropIndex(i) {
        if (i === void 0) { i = null; }
        this.index = i ? __assign({}, i) : {};
    }
    PropIndex.prototype.has = function (p) {
        return property_1.toKey(p) in this.index;
    };
    PropIndex.prototype.get = function (p) {
        return this.index[property_1.toKey(p)];
    };
    PropIndex.prototype.set = function (p, value) {
        this.index[property_1.toKey(p)] = value;
        return this;
    };
    PropIndex.prototype.setByKey = function (key, value) {
        this.index[key] = value;
    };
    PropIndex.prototype.map = function (f) {
        var i = new PropIndex();
        for (var k in this.index) {
            i.index[k] = f(this.index[k]);
        }
        return i;
    };
    PropIndex.prototype.size = function () {
        return util_1.keys(this.index).length;
    };
    PropIndex.prototype.duplicate = function () {
        return new PropIndex(this.index);
    };
    return PropIndex;
}());
exports.PropIndex = PropIndex;

},{"./property":11,"./util":35}],13:[function(require,module,exports){
"use strict";
var vlFieldDef = require("vega-lite/build/src/fielddef");
var type_1 = require("vega-lite/build/src/compile/scale/type");
var wildcard_1 = require("../wildcard");
function isValueQuery(encQ) {
    return encQ !== null && encQ !== undefined && encQ['value'];
}
exports.isValueQuery = isValueQuery;
function isFieldQuery(encQ) {
    return encQ !== null && encQ !== undefined && (encQ['field'] || 'autoCount' in encQ);
}
exports.isFieldQuery = isFieldQuery;
function toFieldDef(fieldQ, props) {
    if (props === void 0) { props = ['aggregate', 'autoCount', 'bin', 'timeUnit', 'field', 'type']; }
    return props.reduce(function (fieldDef, prop) {
        if (wildcard_1.isWildcard(fieldQ[prop])) {
            throw new Error("Cannot convert " + JSON.stringify(fieldQ) + " to fielddef: " + prop + " is wildcard");
        }
        else if (fieldQ[prop] !== undefined) {
            if (prop === 'autoCount') {
                if (fieldQ[prop]) {
                    fieldDef.aggregate = 'count';
                }
                else {
                    throw new Error("Cannot convert {autoCount: false} into a field def");
                }
            }
            else {
                fieldDef[prop] = fieldQ[prop];
            }
        }
        return fieldDef;
    }, {});
}
exports.toFieldDef = toFieldDef;
/**
 * Is a field query continuous field?
 * This method is applicable only for fieldQuery without wildcard
 */
function isContinuous(fieldQ) {
    return vlFieldDef.isContinuous(toFieldDef(fieldQ, ['bin', 'timeUnit', 'field', 'type']));
}
exports.isContinuous = isContinuous;
/**
 * Is a field query discrete field?
 * This method is applicable only for fieldQuery without wildcard
 */
function isDiscrete(fieldQ) {
    return vlFieldDef.isDiscrete(toFieldDef(fieldQ, ['bin', 'timeUnit', 'field', 'type']));
}
exports.isDiscrete = isDiscrete;
/**
 *  Returns the true scale type of an encoding.
 *  @returns {ScaleType} If the scale type was not specified, it is inferred from the encoding's Type.
 *  @returns {undefined} If the scale type was not specified and Type (or TimeUnit if applicable) is a Wildcard, there is no clear scale type
 */
function scaleType(fieldQ) {
    var scale = fieldQ.scale === true || fieldQ.scale === wildcard_1.SHORT_WILDCARD ? {} : fieldQ.scale || {};
    var type = fieldQ.type, channel = fieldQ.channel, timeUnit = fieldQ.timeUnit, bin = fieldQ.bin;
    // HACK: All of markType, hasTopLevelSize, and scaleConfig only affect
    // sub-type of ordinal to quantitative scales (point or band)
    // Currently, most of scaleType usage in CompassQL doesn't care about this subtle difference.
    // Thus, instead of making this method requiring the global mark and topLevelSize,
    // we will just call it with mark = undefined and hasTopLevelSize = false.
    // Thus, currently, we will always get a point scale unless a CompassQuery specifies band.
    var markType = undefined;
    var hasTopLevelSize = false;
    var scaleConfig = {};
    if (wildcard_1.isWildcard(scale.type) || wildcard_1.isWildcard(type) || wildcard_1.isWildcard(channel) || wildcard_1.isWildcard(bin)) {
        return undefined;
    }
    var rangeStep = undefined;
    // Note: Range step currently does not matter as we don't pass mark into compileScaleType anyway.
    // However, if we pass mark, we could use a rule like the following.
    // I also have few test cases listed in encoding.test.ts
    // if (channel === 'x' || channel === 'y') {
    //   if (isWildcard(scale.rangeStep)) {
    //     if (isShortWildcard(scale.rangeStep)) {
    //       return undefined;
    //     } else if (scale.rangeStep.enum) {
    //       const e = scale.rangeStep.enum;
    //       // if enumerated value contains enum then we can't be sure
    //       if (contains(e, undefined) || contains(e, null)) {
    //         return undefined;
    //       }
    //       rangeStep = e[0];
    //     }
    //   }
    // }
    // if type is fixed and it's not temporal, we can ignore time unit.
    if (type === 'temporal' && wildcard_1.isWildcard(timeUnit)) {
        return undefined;
    }
    // if type is fixed and it's not quantitative, we can ignore bin
    if (type === 'quantitative' && wildcard_1.isWildcard(bin)) {
        return undefined;
    }
    return type_1.default(scale.type, channel, { type: type, timeUnit: timeUnit, bin: bin }, markType, hasTopLevelSize, rangeStep, scaleConfig);
}
exports.scaleType = scaleType;

},{"../wildcard":36,"vega-lite/build/src/compile/scale/type":54,"vega-lite/build/src/fielddef":56}],14:[function(require,module,exports){
"use strict";
var util_1 = require("datalib/src/util");
var shorthand_1 = require("./shorthand");
var property_1 = require("../property");
var propindex_1 = require("../propindex");
var util_2 = require("../util");
exports.REPLACE_BLANK_FIELDS = { '*': '' };
exports.REPLACE_XY_CHANNELS = { x: 'xy', y: 'xy' };
exports.REPLACE_FACET_CHANNELS = { row: 'facet', column: 'facet' };
exports.REPLACE_MARK_STYLE_CHANNELS = { color: 'style', opacity: 'style', shape: 'style', size: 'style' };
function isExtendedGroupBy(g) {
    return util_1.isObject(g) && !!g['property'];
}
exports.isExtendedGroupBy = isExtendedGroupBy;
function parseGroupBy(groupBy, include, replaceIndex) {
    include = include || new propindex_1.PropIndex();
    replaceIndex = replaceIndex || new propindex_1.PropIndex();
    groupBy.forEach(function (grpBy) {
        if (isExtendedGroupBy(grpBy)) {
            include.setByKey(grpBy.property, true);
            replaceIndex.setByKey(grpBy.property, grpBy.replace);
        }
        else {
            include.setByKey(grpBy, true);
        }
    });
    return {
        include: include,
        replaceIndex: replaceIndex,
        replacer: shorthand_1.getReplacerIndex(replaceIndex)
    };
}
exports.parseGroupBy = parseGroupBy;
function toString(groupBy) {
    if (util_1.isArray(groupBy)) {
        return groupBy.map(function (g) {
            if (isExtendedGroupBy(g)) {
                if (g.replace) {
                    var replaceIndex_1 = util_2.keys(g.replace).reduce(function (index, valFrom) {
                        var valTo = g.replace[valFrom];
                        (index[valTo] = index[valTo] || []).push(valFrom);
                        return index;
                    }, {});
                    return g.property + '[' + util_2.keys(replaceIndex_1).map(function (valTo) {
                        var valsFrom = replaceIndex_1[valTo].sort();
                        return valsFrom.join(',') + '=>' + valTo;
                    }).join(';') + ']';
                }
                return g.property;
            }
            return g;
        }).join(',');
    }
    else {
        return groupBy;
    }
}
exports.toString = toString;
exports.GROUP_BY_FIELD_TRANSFORM = [
    property_1.Property.FIELD, property_1.Property.TYPE,
    property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.STACK
];
exports.GROUP_BY_ENCODING = exports.GROUP_BY_FIELD_TRANSFORM.concat([
    {
        property: property_1.Property.CHANNEL,
        replace: {
            'x': 'xy', 'y': 'xy',
            'color': 'style', 'size': 'style', 'shape': 'style', 'opacity': 'style',
            'row': 'facet', 'column': 'facet'
        }
    }
]);

},{"../property":11,"../propindex":12,"../util":35,"./shorthand":17,"datalib/src/util":45}],15:[function(require,module,exports){
"use strict";
exports.encoding = require("./encoding");
var normalize_1 = require("./normalize");
exports.normalize = normalize_1.normalize;
exports.groupBy = require("./groupby");
exports.shorthand = require("./shorthand");
exports.spec = require("./spec");
exports.transform = require("./transform");

},{"./encoding":13,"./groupby":14,"./normalize":16,"./shorthand":17,"./spec":18,"./transform":19}],16:[function(require,module,exports){
"use strict";
var util_1 = require("../util");
/**
 * Normalize the non-nested version of the query to a standardize nested
 */
function normalize(q) {
    if (q.groupBy) {
        var nest = {
            groupBy: q.groupBy
        };
        if (q.orderBy) {
            nest.orderGroupBy = q.orderBy;
        }
        var normalizedQ = {
            spec: util_1.duplicate(q.spec),
            nest: [nest],
        };
        if (q.chooseBy) {
            normalizedQ.chooseBy = q.chooseBy;
        }
        if (q.config) {
            normalizedQ.config = q.config;
        }
        return normalizedQ;
    }
    return util_1.duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
}
exports.normalize = normalize;

},{"../util":35}],17:[function(require,module,exports){
"use strict";
var aggregate_1 = require("vega-lite/build/src/aggregate");
var channel_1 = require("vega-lite/build/src/channel");
var timeunit_1 = require("vega-lite/build/src/timeunit");
var type_1 = require("vega-lite/build/src/type");
var util_1 = require("datalib/src/util");
var encoding_1 = require("./encoding");
var spec_1 = require("./spec");
var wildcard_1 = require("../wildcard");
var property_1 = require("../property");
var propindex_1 = require("../propindex");
var util_2 = require("../util");
function getReplacerIndex(replaceIndex) {
    return replaceIndex.map(function (r) { return getReplacer(r); });
}
exports.getReplacerIndex = getReplacerIndex;
function getReplacer(replace) {
    return function (s) {
        if (replace[s] !== undefined) {
            return replace[s];
        }
        return s;
    };
}
exports.getReplacer = getReplacer;
function value(v, replacer) {
    if (wildcard_1.isWildcard(v)) {
        // Return the enum array if it's a full wildcard, or just return SHORT_WILDCARD for short ones.
        if (!wildcard_1.isShortWildcard(v) && v.enum) {
            return wildcard_1.SHORT_WILDCARD + JSON.stringify(v.enum);
        }
        else {
            return wildcard_1.SHORT_WILDCARD;
        }
    }
    if (replacer) {
        return replacer(v);
    }
    return v;
}
exports.value = value;
function replace(v, replacer) {
    if (replacer) {
        return replacer(v);
    }
    return v;
}
exports.replace = replace;
exports.REPLACE_NONE = new propindex_1.PropIndex();
exports.INCLUDE_ALL = 
// FIXME: remove manual STACK, FILTER, CALCULATE concat once we really support enumerating it.
property_1.DEFAULT_PROP_PRECEDENCE
    .concat(property_1.SORT_PROPS, [property_1.Property.CALCULATE, property_1.Property.FILTER, property_1.Property.FILTERINVALID, property_1.Property.STACK])
    .reduce(function (pi, prop) { return pi.set(prop, true); }, new propindex_1.PropIndex());
function vlSpec(vlspec, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = exports.REPLACE_NONE; }
    var specQ = spec_1.fromSpec(vlspec);
    return spec(specQ, include, replace);
}
exports.vlSpec = vlSpec;
exports.PROPERTY_SUPPORTED_CHANNELS = {
    axis: { x: true, y: true, row: true, column: true },
    legend: { color: true, opacity: true, size: true, shape: true },
    scale: { x: true, y: true, color: true, opacity: true, row: true, column: true, size: true, shape: true },
    sort: { x: true, y: true, path: true, order: true }
};
/**
 * Returns a shorthand for a spec query
 * @param specQ a spec query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function spec(specQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = exports.REPLACE_NONE; }
    var parts = [];
    if (include.get(property_1.Property.MARK)) {
        parts.push(value(specQ.mark, replace.get(property_1.Property.MARK)));
    }
    if (specQ.transform) {
        if (include.get(property_1.Property.CALCULATE)) {
            if (specQ.transform.calculate !== undefined) {
                parts.push('calculate:' + calculate(specQ.transform.calculate));
            }
        }
        if (include.get(property_1.Property.FILTER)) {
            if (specQ.transform.filter !== undefined) {
                parts.push('filter:' + JSON.stringify(specQ.transform.filter));
            }
        }
        if (include.get(property_1.Property.FILTERINVALID)) {
            if (specQ.transform.filterInvalid !== undefined) {
                parts.push('filterInvalid:' + specQ.transform.filterInvalid);
            }
        }
    }
    // TODO: extract this to its own stack method
    if (include.get(property_1.Property.STACK)) {
        var _stack = spec_1.stack(specQ);
        if (_stack) {
            // TODO: Refactor this once we have child stack property.
            // Exclude type since we don't care about type in stack
            var includeExceptType = include.duplicate().set('type', false);
            var field = fieldDef(_stack.fieldEncQ, includeExceptType, replace);
            var groupby = fieldDef(_stack.groupByEncQ, includeExceptType, replace);
            parts.push('stack={field:' + field + ',' +
                (groupby ? 'by:' + groupby + ',' : '') +
                'offset:' + _stack.offset + '}');
        }
    }
    if (specQ.encodings) {
        var encodings = specQ.encodings.reduce(function (encQs, encQ) {
            // Exclude encoding mapping with autoCount=false as they are basically disabled.
            if (encoding_1.isFieldQuery(encQ) && encQ.autoCount !== false) {
                var str = encoding(encQ, include, replace);
                if (str) {
                    encQs.push(str);
                }
            }
            return encQs;
        }, [])
            .sort() // sort at the end to ignore order
            .join('|');
        if (encodings) {
            parts.push(encodings);
        }
    }
    return parts.join('|');
}
exports.spec = spec;
function calculate(formulaArr) {
    return JSON.stringify(formulaArr.reduce(function (m, calculateItem) {
        m[calculateItem.as] = calculateItem.expr;
        return m;
    }, {}));
}
exports.calculate = calculate;
/**
 * Returns a shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function encoding(encQ, include, replace) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replace === void 0) { replace = exports.REPLACE_NONE; }
    var parts = [];
    if (include.get(property_1.Property.CHANNEL)) {
        parts.push(value(encQ.channel, replace.get(property_1.Property.CHANNEL)));
    }
    if (encoding_1.isFieldQuery(encQ)) {
        var fieldDefStr = fieldDef(encQ, include, replace);
        if (fieldDefStr) {
            parts.push(fieldDefStr);
        }
    }
    else if (encoding_1.isValueQuery(encQ)) {
        parts.push(encQ.value);
    }
    return parts.join(':');
}
exports.encoding = encoding;
/**
 * Returns a field definition shorthand for an encoding query
 * @param encQ an encoding query
 * @param include Dict Set listing property types (key) to be included in the shorthand
 * @param replace Dictionary of replace function for values of a particular property type (key)
 */
function fieldDef(fieldQ, include, replacer) {
    if (include === void 0) { include = exports.INCLUDE_ALL; }
    if (replacer === void 0) { replacer = exports.REPLACE_NONE; }
    if (include.get(property_1.Property.AGGREGATE) && fieldQ.autoCount === false) {
        return '-';
    }
    var fn = func(fieldQ, include, replacer);
    var props = fieldDefProps(fieldQ, include, replacer);
    // field
    var fieldAndParams = include.get('field') ? value(fieldQ.field || '*', replacer.get('field')) : '...';
    // type
    if (include.get(property_1.Property.TYPE)) {
        if (wildcard_1.isWildcard(fieldQ.type)) {
            fieldAndParams += ',' + value(fieldQ.type, replacer.get(property_1.Property.TYPE));
        }
        else {
            var typeShort = ((fieldQ.type || type_1.Type.QUANTITATIVE) + '').substr(0, 1);
            fieldAndParams += ',' + value(typeShort, replacer.get(property_1.Property.TYPE));
        }
    }
    // encoding properties
    fieldAndParams += props.map(function (p) {
        var val = p.value instanceof Array ? '[' + p.value + ']' : p.value;
        return ',' + p.key + '=' + val;
    }).join('');
    if (fn) {
        var fnPrefix = util_1.isString(fn) ? fn : wildcard_1.SHORT_WILDCARD +
            (util_2.keys(fn).length > 0 ? JSON.stringify(fn) : '');
        return fnPrefix + '(' + fieldAndParams + ')';
    }
    return fieldAndParams;
}
exports.fieldDef = fieldDef;
/**
 * Return function part of
 */
function func(fieldQ, include, replacer) {
    if (include.get(property_1.Property.AGGREGATE) && fieldQ.aggregate && !wildcard_1.isWildcard(fieldQ.aggregate)) {
        return replace(fieldQ.aggregate, replacer.get(property_1.Property.AGGREGATE));
    }
    else if (include.get(property_1.Property.AGGREGATE) && fieldQ.autoCount && !wildcard_1.isWildcard(fieldQ.autoCount)) {
        // autoCount is considered a part of aggregate
        return replace('count', replacer.get(property_1.Property.AGGREGATE));
        ;
    }
    else if (include.get(property_1.Property.TIMEUNIT) && fieldQ.timeUnit && !wildcard_1.isWildcard(fieldQ.timeUnit)) {
        return replace(fieldQ.timeUnit, replacer.get(property_1.Property.TIMEUNIT));
    }
    else if (include.get(property_1.Property.BIN) && fieldQ.bin && !wildcard_1.isWildcard(fieldQ.bin)) {
        return 'bin';
    }
    else {
        var fn = null;
        for (var _i = 0, _a = [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN]; _i < _a.length; _i++) {
            var prop = _a[_i];
            var val = fieldQ[prop];
            if (include.get(prop) && fieldQ[prop] && wildcard_1.isWildcard(val)) {
                // assign fnEnumIndex[prop] = array of enum values or just "?" if it is SHORT_WILDCARD
                fn = fn || {};
                fn[prop] = wildcard_1.isShortWildcard(val) ? val : val.enum;
            }
        }
        if (fn && fieldQ.hasFn) {
            fn.hasFn = true;
        }
        return fn;
    }
}
/**
 * Return key-value of parameters of field defs
 */
function fieldDefProps(fieldQ, include, replacer) {
    /** Encoding properties e.g., Scale, Axis, Legend */
    var props = [];
    // Parameters of function such as bin will be just top-level properties
    if (!util_2.isBoolean(fieldQ.bin) && !wildcard_1.isShortWildcard(fieldQ.bin)) {
        var bin = fieldQ.bin;
        for (var child in bin) {
            var prop = property_1.getEncodingNestedProp('bin', child);
            if (prop && include.get(prop) && bin[child] !== undefined) {
                props.push({
                    key: child,
                    value: value(bin[child], replacer.get(prop))
                });
            }
        }
        // Sort to make sure that parameter are ordered consistently
        props.sort(function (a, b) { return a.key.localeCompare(b.key); });
    }
    for (var _i = 0, _a = [property_1.Property.SCALE, property_1.Property.SORT, property_1.Property.AXIS, property_1.Property.LEGEND]; _i < _a.length; _i++) {
        var parent_1 = _a[_i];
        if (!wildcard_1.isWildcard(fieldQ.channel) && !exports.PROPERTY_SUPPORTED_CHANNELS[parent_1][fieldQ.channel]) {
            continue;
        }
        if (include.get(parent_1) && fieldQ[parent_1] !== undefined) {
            var parentValue = fieldQ[parent_1];
            if (util_2.isBoolean(parentValue) || parentValue === null) {
                // `scale`, `axis`, `legend` can be false/null.
                props.push({
                    key: parent_1 + '',
                    value: parentValue || false // return true or false (false if null)
                });
            }
            else if (util_1.isString(parentValue)) {
                // `sort` can be a string (ascending/descending).
                props.push({
                    key: parent_1 + '',
                    value: replace(JSON.stringify(parentValue), replacer.get(parent_1))
                });
            }
            else {
                var nestedPropChildren = [];
                for (var child in parentValue) {
                    var nestedProp = property_1.getEncodingNestedProp(parent_1, child);
                    if (nestedProp && include.get(nestedProp) && parentValue[child] !== undefined) {
                        nestedPropChildren.push({
                            key: child,
                            value: value(parentValue[child], replacer.get(nestedProp))
                        });
                    }
                }
                if (nestedPropChildren.length > 0) {
                    var nestedPropObject = nestedPropChildren.sort(function (a, b) { return a.key.localeCompare(b.key); })
                        .reduce(function (o, item) {
                        o[item.key] = item.value;
                        return o;
                    }, {});
                    // Sort to make sure that parameter are ordered consistently
                    props.push({
                        key: parent_1 + '',
                        value: JSON.stringify(nestedPropObject)
                    });
                }
            }
        }
    }
    return props;
}
var CHANNEL_INDEX = util_1.toMap(channel_1.CHANNELS);
var AGGREGATE_OP_INDEX = util_1.toMap(aggregate_1.AGGREGATE_OPS);
var SINGLE_TIMEUNIT_INDEX = util_1.toMap(timeunit_1.SINGLE_TIMEUNITS);
var MULTI_TIMEUNIT_INDEX = util_1.toMap(timeunit_1.MULTI_TIMEUNITS);
function parse(shorthand) {
    // TODO(https://github.com/uwdata/compassql/issues/259):
    // Do not split directly, but use an upgraded version of `getClosingBraceIndex()`
    var splitShorthand = shorthand.split('|');
    var specQ = { mark: splitShorthand[0], encodings: [] };
    for (var i = 1; i < splitShorthand.length; i++) {
        var part = splitShorthand[i];
        var splitPart = splitWithTail(part, ':', 1);
        var splitPartKey = splitPart[0];
        var splitPartValue = splitPart[1];
        if (CHANNEL_INDEX[splitPartKey] || splitPartKey === '?') {
            var encQ = shorthandParser.encoding(splitPartKey, splitPartValue);
            specQ.encodings.push(encQ);
            continue;
        }
        if (splitPartKey === 'calculate') {
            specQ.transform = specQ.transform || {};
            var calculate_1 = [];
            var fieldExprMapping = JSON.parse(splitPartValue);
            for (var field in fieldExprMapping) {
                calculate_1.push({ expr: fieldExprMapping[field], as: field });
            }
            specQ.transform.calculate = calculate_1;
            continue;
        }
        if (splitPartKey === 'filter') {
            specQ.transform = specQ.transform || {};
            specQ.transform.filter = JSON.parse(splitPartValue);
            continue;
        }
        if (splitPartKey === 'filterInvalid') {
            specQ.transform = specQ.transform || {};
            specQ.transform.filterInvalid = JSON.parse(splitPartValue);
            continue;
        }
    }
    return specQ;
}
exports.parse = parse;
/**
 * Split a string n times into substrings with the specified delimiter and return them as an array.
 * @param str The string to be split
 * @param delim The delimiter string used to separate the string
 * @param number The value used to determine how many times the string is split
 */
function splitWithTail(str, delim, count) {
    var result = [];
    var lastIndex = 0;
    for (var i = 0; i < count; i++) {
        var indexOfDelim = str.indexOf(delim, lastIndex);
        if (indexOfDelim !== -1) {
            result.push(str.substring(lastIndex, indexOfDelim));
            lastIndex = indexOfDelim + 1;
        }
        else {
            break;
        }
    }
    result.push(str.substr(lastIndex));
    // If the specified count is greater than the number of delimiters that exist in the string,
    // an empty string will be pushed count minus number of delimiter occurence times.
    if (result.length !== count + 1) {
        while (result.length !== count + 1) {
            result.push('');
        }
    }
    return result;
}
exports.splitWithTail = splitWithTail;
var shorthandParser;
(function (shorthandParser) {
    function encoding(channel, fieldDefShorthand) {
        var encQ = { channel: channel };
        if (fieldDefShorthand.indexOf('(') !== -1) {
            encQ = fn(encQ, fieldDefShorthand);
        }
        else {
            encQ = rawFieldDef(encQ, splitWithTail(fieldDefShorthand, ',', 2));
        }
        return encQ;
    }
    shorthandParser.encoding = encoding;
    function rawFieldDef(fieldQ, fieldDefPart) {
        fieldQ.field = fieldDefPart[0];
        fieldQ.type = type_1.getFullName(fieldDefPart[1].toUpperCase()) || '?';
        var partParams = fieldDefPart[2];
        var closingBraceIndex = 0;
        var i = 0;
        while (i < partParams.length) {
            var propEqualSignIndex = partParams.indexOf('=', i);
            var parsedValue = void 0;
            if (propEqualSignIndex !== -1) {
                var prop = partParams.substring(i, propEqualSignIndex);
                if (partParams[i + prop.length + 1] === '{') {
                    var openingBraceIndex = i + prop.length + 1;
                    closingBraceIndex = getClosingIndex(openingBraceIndex, partParams, '}');
                    var value_1 = partParams.substring(openingBraceIndex, closingBraceIndex + 1);
                    parsedValue = JSON.parse(value_1);
                    // index after next comma
                    i = closingBraceIndex + 2;
                }
                else if (partParams[i + prop.length + 1] === '[') {
                    // find closing square bracket
                    var openingBracketIndex = i + prop.length + 1;
                    var closingBracketIndex = getClosingIndex(openingBracketIndex, partParams, ']');
                    var value_2 = partParams.substring(openingBracketIndex, closingBracketIndex + 1);
                    parsedValue = JSON.parse(value_2);
                    // index after next comma
                    i = closingBracketIndex + 2;
                }
                else {
                    var propIndex = i;
                    // Substring until the next comma (or end of the string)
                    var nextCommaIndex = partParams.indexOf(',', i + prop.length);
                    if (nextCommaIndex === -1) {
                        nextCommaIndex = partParams.length;
                    }
                    // index after next comma
                    i = nextCommaIndex + 1;
                    parsedValue = JSON.parse(partParams.substring(propIndex + prop.length + 1, nextCommaIndex));
                }
                if (property_1.hasNestedProperty(prop)) {
                    fieldQ[prop] = parsedValue;
                }
                else {
                    // prop is a property of the aggregation function such as bin
                    fieldQ.bin[prop] = parsedValue;
                }
            }
            else {
                // something is wrong with the format of the partParams
                // exits loop if don't have then infintie loop
                break;
            }
        }
        return fieldQ;
    }
    shorthandParser.rawFieldDef = rawFieldDef;
    function getClosingIndex(openingBraceIndex, str, closingChar) {
        for (var i = openingBraceIndex; i < str.length; i++) {
            if (str[i] === closingChar) {
                return i;
            }
        }
    }
    shorthandParser.getClosingIndex = getClosingIndex;
    function fn(fieldQ, fieldDefShorthand) {
        // Aggregate, Bin, TimeUnit as wildcard case
        if (fieldDefShorthand[0] === '?') {
            var closingBraceIndex = getClosingIndex(1, fieldDefShorthand, '}');
            var fnEnumIndex = JSON.parse(fieldDefShorthand.substring(1, closingBraceIndex + 1));
            for (var encodingProperty in fnEnumIndex) {
                if (util_2.isArray(fnEnumIndex[encodingProperty])) {
                    fieldQ[encodingProperty] = { enum: fnEnumIndex[encodingProperty] };
                }
                else {
                    fieldQ[encodingProperty] = fnEnumIndex[encodingProperty];
                }
            }
            return rawFieldDef(fieldQ, splitWithTail(fieldDefShorthand.substring(closingBraceIndex + 2, fieldDefShorthand.length - 1), ',', 2));
        }
        else {
            var func_1 = fieldDefShorthand.substring(0, fieldDefShorthand.indexOf('('));
            var insideFn = fieldDefShorthand.substring(func_1.length + 1, fieldDefShorthand.length - 1);
            var insideFnParts = splitWithTail(insideFn, ',', 2);
            if (AGGREGATE_OP_INDEX[func_1]) {
                fieldQ.aggregate = func_1;
                return rawFieldDef(fieldQ, insideFnParts);
            }
            else if (MULTI_TIMEUNIT_INDEX[func_1] || SINGLE_TIMEUNIT_INDEX[func_1]) {
                fieldQ.timeUnit = func_1;
                return rawFieldDef(fieldQ, insideFnParts);
            }
            else if (func_1 === 'bin') {
                fieldQ.bin = {};
                return rawFieldDef(fieldQ, insideFnParts);
            }
        }
    }
    shorthandParser.fn = fn;
})(shorthandParser = exports.shorthandParser || (exports.shorthandParser = {}));

},{"../property":11,"../propindex":12,"../util":35,"../wildcard":36,"./encoding":13,"./spec":18,"datalib/src/util":45,"vega-lite/build/src/aggregate":50,"vega-lite/build/src/channel":53,"vega-lite/build/src/timeunit":61,"vega-lite/build/src/type":62}],18:[function(require,module,exports){
"use strict";
var channel_1 = require("vega-lite/build/src/channel");
var wildcard_1 = require("../wildcard");
var property_1 = require("../property");
var util_1 = require("../util");
var encoding_1 = require("./encoding");
/**
 * Convert a Vega-Lite's ExtendedUnitSpec into a CompassQL's SpecQuery
 * @param {ExtendedUnitSpec} spec
 * @returns
 */
function fromSpec(spec) {
    return util_1.extend(spec.data ? { data: spec.data } : {}, spec.transform ? { transform: spec.transform } : {}, {
        mark: spec.mark,
        encodings: util_1.keys(spec.encoding).map(function (channel) {
            var encQ = { channel: channel };
            var channelDef = spec.encoding[channel];
            for (var prop in channelDef) {
                if (property_1.isEncodingTopLevelProperty(prop) && channelDef[prop] !== undefined) {
                    // Currently bin, scale, axis, legend only support boolean, but not null.
                    // Therefore convert null to false.
                    if (util_1.contains(['bin', 'scale', 'axis', 'legend'], prop) && channelDef[prop] === null) {
                        encQ[prop] = false;
                    }
                    else {
                        encQ[prop] = channelDef[prop];
                    }
                }
            }
            return encQ;
        })
    }, spec.config ? { config: spec.config } : {});
}
exports.fromSpec = fromSpec;
function isAggregate(specQ) {
    return util_1.some(specQ.encodings, function (encQ) {
        return encoding_1.isFieldQuery(encQ) && ((!wildcard_1.isWildcard(encQ.aggregate) && !!encQ.aggregate) || encQ.autoCount === true);
    });
}
exports.isAggregate = isAggregate;
/**
 * @return the stack offset type for the specQuery
 */
function stack(specQ) {
    var config = specQ.config;
    var stacked = config ? config.stack : undefined;
    // Should not have stack explicitly disabled
    if (util_1.contains(['none', null, false], stacked)) {
        return null;
    }
    // Should have stackable mark
    if (!util_1.contains(['bar', 'area'], specQ.mark)) {
        return null;
    }
    // Should be aggregate plot
    if (!isAggregate(specQ)) {
        return null;
    }
    var stackBy = specQ.encodings.reduce(function (sc, encQ) {
        if (util_1.contains(channel_1.STACK_GROUP_CHANNELS, encQ.channel) && (encoding_1.isValueQuery(encQ) || !encQ.aggregate)) {
            sc.push({
                channel: encQ.channel,
                fieldDef: encQ
            });
        }
        return sc;
    }, []);
    if (stackBy.length === 0) {
        return null;
    }
    // Has only one aggregate axis
    var xEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.X ? encQ : null);
    }, null);
    var yEncQ = specQ.encodings.reduce(function (f, encQ) {
        return f || (encQ.channel === channel_1.Channel.Y ? encQ : null);
    }, null);
    var xIsAggregate = encoding_1.isFieldQuery(xEncQ) && (!!xEncQ.aggregate || !!xEncQ.autoCount);
    var yIsAggregate = encoding_1.isFieldQuery(yEncQ) && (!!yEncQ.aggregate || !!yEncQ.autoCount);
    if (xIsAggregate !== yIsAggregate) {
        return {
            groupbyChannel: xIsAggregate ? (!!yEncQ ? channel_1.Y : null) : (!!xEncQ ? channel_1.X : null),
            groupByEncQ: xIsAggregate ? yEncQ : xEncQ,
            fieldChannel: xIsAggregate ? channel_1.X : channel_1.Y,
            fieldEncQ: xIsAggregate ? xEncQ : yEncQ,
            stackBy: stackBy,
            offset: stacked || 'zero'
        };
    }
    return null;
}
exports.stack = stack;

},{"../property":11,"../util":35,"../wildcard":36,"./encoding":13,"vega-lite/build/src/channel":53}],19:[function(require,module,exports){
"use strict";

},{}],20:[function(require,module,exports){
"use strict";
var type_1 = require("vega-lite/build/src/type");
var util_1 = require("../util");
var encoding_1 = require("../query/encoding");
exports.name = 'aggregationQuality';
function score(specM, schema, opt) {
    var feature = aggregationQualityFeature(specM, schema, opt);
    return {
        score: feature.score,
        features: [feature]
    };
}
exports.score = score;
function isDimension(encQ) {
    return encoding_1.isDiscrete(encQ) || !!encQ.timeUnit;
}
function aggregationQualityFeature(specM, _, __) {
    var encodings = specM.getEncodings();
    if (specM.isAggregate()) {
        var isRawContinuous = function (encQ) {
            return encoding_1.isFieldQuery(encQ) && ((encQ.type === type_1.Type.QUANTITATIVE && !encQ.bin && !encQ.aggregate && !encQ.autoCount) ||
                (encQ.type === type_1.Type.TEMPORAL && !encQ.timeUnit));
        };
        if (util_1.some(encodings, isRawContinuous)) {
            // These are plots that pollute continuous fields as dimension.
            // They are often intermediate visualizations rather than what users actually want.
            return {
                type: exports.name,
                score: 0.1,
                feature: 'Aggregate with raw continuous'
            };
        }
        if (util_1.some(encodings, function (encQ) { return encoding_1.isFieldQuery(encQ) && isDimension(encQ); })) {
            var hasCount = util_1.some(encodings, function (encQ) {
                return encoding_1.isFieldQuery(encQ) && (encQ.aggregate === 'count' || encQ.autoCount === true);
            });
            var hasBin = util_1.some(encodings, function (encQ) {
                return encoding_1.isFieldQuery(encQ) && !!encQ.bin;
            });
            if (hasCount) {
                // If there is count, we might add additional count field, making it a little less simple
                // then when we just apply aggregate to Q field
                return {
                    type: exports.name,
                    score: 0.8,
                    feature: 'Aggregate with count'
                };
            }
            else if (hasBin) {
                // This is not as good as binning all the Q and show heatmap
                return {
                    type: exports.name,
                    score: 0.7,
                    feature: 'Aggregate with bin but without count'
                };
            }
            else {
                return {
                    type: exports.name,
                    score: 0.9,
                    feature: 'Aggregate without count and without bin'
                };
            }
        }
        // no dimension -- often not very useful
        return {
            type: exports.name,
            score: 0.3,
            feature: 'Aggregate without dimension'
        };
    }
    else {
        if (util_1.some(encodings, function (encQ) { return encoding_1.isFieldQuery(encQ) && !isDimension(encQ); })) {
            // raw plots with measure -- simplest of all!
            return {
                type: exports.name,
                score: 1,
                feature: 'Raw with measure'
            };
        }
        // raw plots with no measure -- often a lot of occlusion
        return {
            type: exports.name,
            score: 0.2,
            feature: 'Raw without measure'
        };
    }
}

},{"../query/encoding":13,"../util":35,"vega-lite/build/src/type":62}],21:[function(require,module,exports){
/**
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var channel_1 = require("vega-lite/build/src/channel");
var config_1 = require("../../config");
var type_1 = require("./type");
var base_1 = require("./base");
/**
 * Effectiveness Score for preferred axis.
 */
var AxisScorer = (function (_super) {
    __extends(AxisScorer, _super);
    function AxisScorer() {
        return _super.call(this, 'Axis') || this;
    }
    AxisScorer.prototype.initScore = function (opt) {
        if (opt === void 0) { opt = {}; }
        opt = __assign({}, config_1.DEFAULT_QUERY_CONFIG, opt);
        var score = {};
        var preferredAxes = [{
                feature: type_1.BIN_Q,
                opt: 'preferredBinAxis'
            }, {
                feature: type_1.T,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.TIMEUNIT_T,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.TIMEUNIT_O,
                opt: 'preferredTemporalAxis'
            }, {
                feature: type_1.O,
                opt: 'preferredOrdinalAxis'
            }, {
                feature: type_1.N,
                opt: 'preferredNominalAxis'
            }];
        preferredAxes.forEach(function (pAxis) {
            if (opt[pAxis.opt] === channel_1.Channel.X) {
                // penalize the other axis
                score[pAxis.feature + '_' + channel_1.Channel.Y] = -0.01;
            }
            else if (opt[pAxis.opt] === channel_1.Channel.Y) {
                // penalize the other axis
                score[pAxis.feature + '_' + channel_1.Channel.X] = -0.01;
            }
        });
        return score;
    };
    AxisScorer.prototype.featurize = function (type, channel) {
        return type + '_' + channel;
    };
    AxisScorer.prototype.getScore = function (specM, _, __) {
        var _this = this;
        return specM.getEncodings().reduce(function (features, encQ) {
            var type = type_1.getExtendedType(encQ);
            var feature = _this.featurize(type, encQ.channel);
            var featureScore = _this.getFeatureScore(feature);
            if (featureScore) {
                features.push(featureScore);
            }
            return features;
        }, []);
    };
    return AxisScorer;
}(base_1.Scorer));
exports.AxisScorer = AxisScorer;

},{"../../config":1,"./base":22,"./type":28,"vega-lite/build/src/channel":53}],22:[function(require,module,exports){
"use strict";
var Scorer = (function () {
    function Scorer(type) {
        this.type = type;
        this.scoreIndex = this.initScore();
    }
    Scorer.prototype.getFeatureScore = function (feature) {
        var type = this.type;
        var score = this.scoreIndex[feature];
        if (score !== undefined) {
            return { type: type, feature: feature, score: score };
        }
        return undefined;
    };
    return Scorer;
}());
exports.Scorer = Scorer;

},{}],23:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require("./base");
var encoding_1 = require("../../query/encoding");
/**
 * Penalize if facet channels are the only dimensions
 */
var DimensionScorer = (function (_super) {
    __extends(DimensionScorer, _super);
    function DimensionScorer() {
        return _super.call(this, 'Dimension') || this;
    }
    DimensionScorer.prototype.initScore = function () {
        return {
            row: -2,
            column: -2,
            color: 0,
            opacity: 0,
            size: 0,
            shape: 0
        };
    };
    DimensionScorer.prototype.getScore = function (specM, _, __) {
        var _this = this;
        if (specM.isAggregate()) {
            specM.getEncodings().reduce(function (maxFScore, encQ) {
                if (encoding_1.isFieldQuery(encQ) && !encQ.aggregate && !encQ.autoCount) {
                    var featureScore = _this.getFeatureScore(encQ.channel + '');
                    if (featureScore && featureScore.score > maxFScore.score) {
                        return featureScore;
                    }
                }
                return maxFScore;
            }, { type: 'Dimension', feature: 'No Dimension', score: -5 });
        }
        return [];
    };
    return DimensionScorer;
}(base_1.Scorer));
exports.DimensionScorer = DimensionScorer;

},{"../../query/encoding":13,"./base":22}],24:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var base_1 = require("./base");
var config_1 = require("../../config");
var channel_1 = require("vega-lite/build/src/channel");
/**
 * Effective Score for preferred facet
 */
var FacetScorer = (function (_super) {
    __extends(FacetScorer, _super);
    function FacetScorer() {
        return _super.call(this, 'Facet') || this;
    }
    FacetScorer.prototype.initScore = function (opt) {
        opt = __assign({}, config_1.DEFAULT_QUERY_CONFIG, opt);
        var score = {};
        if (opt.preferredFacet === channel_1.Channel.ROW) {
            // penalize the other axis
            score[channel_1.Channel.COLUMN] = -0.01;
        }
        else if (opt.preferredFacet === channel_1.Channel.COLUMN) {
            // penalize the other axis
            score[channel_1.Channel.ROW] = -0.01;
        }
        return score;
    };
    FacetScorer.prototype.getScore = function (specM, _, __) {
        var _this = this;
        return specM.getEncodings().reduce(function (features, encQ) {
            var featureScore = _this.getFeatureScore(encQ.channel);
            if (featureScore) {
                features.push(featureScore);
            }
            return features;
        }, []);
    };
    return FacetScorer;
}(base_1.Scorer));
exports.FacetScorer = FacetScorer;
;

},{"../../config":1,"./base":22,"vega-lite/build/src/channel":53}],25:[function(require,module,exports){
"use strict";
var axis_1 = require("./axis");
var dimension_1 = require("./dimension");
var facet_1 = require("./facet");
var sizechannel_1 = require("./sizechannel");
var typechannel_1 = require("./typechannel");
var mark_1 = require("./mark");
var SCORERS = [
    new axis_1.AxisScorer(),
    new dimension_1.DimensionScorer(),
    new facet_1.FacetScorer(),
    new mark_1.MarkScorer(),
    new sizechannel_1.SizeChannelScorer(),
    new typechannel_1.TypeChannelScorer()
];
// TODO: x/y, row/column preference
// TODO: stacking
// TODO: Channel, Cardinality
// TODO: Penalize over encoding
function effectiveness(specM, schema, opt) {
    var features = SCORERS.reduce(function (f, scorer) {
        var scores = scorer.getScore(specM, schema, opt);
        return f.concat(scores);
    }, []);
    return {
        score: features.reduce(function (s, f) {
            return s + f.score;
        }, 0),
        features: features
    };
}
exports.effectiveness = effectiveness;

},{"./axis":21,"./dimension":23,"./facet":24,"./mark":26,"./sizechannel":27,"./typechannel":29}],26:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var channel_1 = require("vega-lite/build/src/channel");
var mark_1 = require("vega-lite/build/src/mark");
var util_1 = require("../../util");
var type_1 = require("./type");
var base_1 = require("./base");
var MarkScorer = (function (_super) {
    __extends(MarkScorer, _super);
    function MarkScorer() {
        return _super.call(this, 'Mark') || this;
    }
    MarkScorer.prototype.initScore = function () {
        return init();
    };
    MarkScorer.prototype.getScore = function (specM, _, __) {
        var mark = specM.getMark();
        if (mark === mark_1.Mark.CIRCLE || mark === mark_1.Mark.SQUARE) {
            mark = mark_1.Mark.POINT;
        }
        var xEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.X);
        var xType = xEncQ ? type_1.getExtendedType(xEncQ) : type_1.NONE;
        var yEncQ = specM.getEncodingQueryByChannel(channel_1.Channel.Y);
        var yType = yEncQ ? type_1.getExtendedType(yEncQ) : type_1.NONE;
        var isOccluded = !specM.isAggregate(); // FIXME
        var feature = xType + '_' + yType + '_' + isOccluded + '_' + mark;
        var featureScore = this.getFeatureScore(feature);
        return [featureScore];
    };
    return MarkScorer;
}(base_1.Scorer));
exports.MarkScorer = MarkScorer;
function featurize(xType, yType, hasOcclusion, mark) {
    return xType + '_' + yType + '_' + hasOcclusion + '_' + mark;
}
exports.featurize = featurize;
function init() {
    var MEASURES = [type_1.Q, type_1.T];
    var DISCRETE = [type_1.BIN_Q, type_1.TIMEUNIT_O, type_1.O, type_1.N];
    var DISCRETE_OR_NONE = DISCRETE.concat([type_1.NONE]);
    var SCORE = {};
    // QxQ
    MEASURES.forEach(function (xType) {
        MEASURES.forEach(function (yType) {
            // has occlusion
            var occludedQQMark = {
                point: 0,
                text: -0.2,
                tick: -0.5,
                rect: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(occludedQQMark, function (score, mark) {
                var feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            // no occlusion
            // TODO: possible to use connected scatter plot
            var noOccludedQQMark = {
                point: 0,
                text: -0.2,
                tick: -0.5,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(noOccludedQQMark, function (score, mark) {
                var feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
        });
    });
    // DxQ, QxD
    MEASURES.forEach(function (xType) {
        // HAS OCCLUSION
        DISCRETE_OR_NONE.forEach(function (yType) {
            var occludedDimensionMeasureMark = {
                tick: 0,
                point: -0.2,
                text: -0.5,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(occludedDimensionMeasureMark, function (score, mark) {
                var feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
                // also do the inverse
                var feature2 = featurize(yType, xType, true, mark);
                SCORE[feature2] = score;
            });
        });
        [type_1.TIMEUNIT_T].forEach(function (yType) {
            var occludedDimensionMeasureMark = {
                // For Time Dimension with time scale, tick is not good
                point: 0,
                text: -0.5,
                tick: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            util_1.forEach(occludedDimensionMeasureMark, function (score, mark) {
                var feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
                // also do the inverse
                var feature2 = featurize(yType, xType, true, mark);
                SCORE[feature2] = score;
            });
        });
        // NO OCCLUSION
        [type_1.NONE, type_1.N, type_1.O].forEach(function (yType) {
            var noOccludedQxN = {
                bar: 0,
                point: -0.2,
                tick: -0.25,
                text: -0.3,
                // Line / Area can mislead trend for N
                line: -2,
                area: -2,
                // Non-sense to use rule here
                rule: -2.5
            };
            util_1.forEach(noOccludedQxN, function (score, mark) {
                var feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
                // also do the inverse
                var feature2 = featurize(yType, xType, false, mark);
                SCORE[feature2] = score;
            });
        });
        [type_1.BIN_Q].forEach(function (yType) {
            var noOccludedQxBinQ = {
                bar: 0,
                point: -0.2,
                tick: -0.25,
                text: -0.3,
                // Line / Area isn't the best fit for bin
                line: -0.5,
                area: -0.5,
                // Non-sense to use rule here
                rule: -2.5
            };
            util_1.forEach(noOccludedQxBinQ, function (score, mark) {
                var feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
                // also do the inverse
                var feature2 = featurize(yType, xType, false, mark);
                SCORE[feature2] = score;
            });
        });
        [type_1.TIMEUNIT_T, type_1.TIMEUNIT_O].forEach(function (yType) {
            // For aggregate / surely no occlusion plot, Temporal with time or ordinal
            // are not that different.
            var noOccludedQxBinQ = {
                line: 0,
                area: -0.1,
                bar: -0.2,
                point: -0.3,
                tick: -0.35,
                text: -0.4,
                // Non-sense to use rule here
                rule: -2.5
            };
            util_1.forEach(noOccludedQxBinQ, function (score, mark) {
                var feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
                // also do the inverse
                var feature2 = featurize(yType, xType, false, mark);
                SCORE[feature2] = score;
            });
        });
    });
    [type_1.TIMEUNIT_T].forEach(function (xType) {
        [type_1.TIMEUNIT_T].forEach(function (yType) {
            // has occlusion
            var ttMark = {
                point: 0,
                rect: -0.1,
                text: -0.5,
                tick: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            // No difference between has occlusion and no occlusion
            // as most of the time, it will be the occluded case.
            util_1.forEach(ttMark, function (score, mark) {
                var feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(ttMark, function (score, mark) {
                var feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
        });
        DISCRETE_OR_NONE.forEach(function (yType) {
            // has occlusion
            var tdMark = {
                tick: 0,
                point: -0.2,
                text: -0.5,
                rect: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            // No difference between has occlusion and no occlusion
            // as most of the time, it will be the occluded case.
            util_1.forEach(tdMark, function (score, mark) {
                var feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(tdMark, function (score, mark) {
                var feature = featurize(yType, xType, true, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(tdMark, function (score, mark) {
                var feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(tdMark, function (score, mark) {
                var feature = featurize(yType, xType, false, mark);
                SCORE[feature] = score;
            });
        });
    });
    // DxD
    DISCRETE_OR_NONE.forEach(function (xType) {
        DISCRETE_OR_NONE.forEach(function (yType) {
            // has occlusion
            var ddMark = {
                point: 0,
                rect: 0,
                text: -0.1,
                tick: -1,
                bar: -2,
                line: -2,
                area: -2,
                rule: -2.5
            };
            // No difference between has occlusion and no occlusion
            util_1.forEach(ddMark, function (score, mark) {
                var feature = featurize(xType, yType, true, mark);
                SCORE[feature] = score;
            });
            util_1.forEach(ddMark, function (score, mark) {
                var feature = featurize(xType, yType, false, mark);
                SCORE[feature] = score;
            });
        });
    });
    return SCORE;
}

},{"../../util":35,"./base":22,"./type":28,"vega-lite/build/src/channel":53,"vega-lite/build/src/mark":59}],27:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_1 = require("./base");
/**
 * Effectivenss score that penalize size for bar and tick
 */
var SizeChannelScorer = (function (_super) {
    __extends(SizeChannelScorer, _super);
    function SizeChannelScorer() {
        return _super.call(this, 'SizeChannel') || this;
    }
    SizeChannelScorer.prototype.initScore = function () {
        return {
            bar_size: -2,
            tick_size: -2
        };
    };
    SizeChannelScorer.prototype.getScore = function (specM, _, __) {
        var _this = this;
        var mark = specM.getMark();
        return specM.getEncodings().reduce(function (featureScores, encQ) {
            var feature = mark + '_' + encQ.channel;
            var featureScore = _this.getFeatureScore(feature);
            if (featureScore) {
                featureScores.push(featureScore);
            }
            return featureScores;
        }, []);
    };
    return SizeChannelScorer;
}(base_1.Scorer));
exports.SizeChannelScorer = SizeChannelScorer;

},{"./base":22}],28:[function(require,module,exports){
"use strict";
var scale_1 = require("vega-lite/build/src/scale");
var type_1 = require("vega-lite/build/src/type");
var encoding_1 = require("../../query/encoding");
/**
 * Finer grained data types that takes binning and timeUnit into account.
 */
var ExtendedType;
(function (ExtendedType) {
    ExtendedType[ExtendedType["Q"] = type_1.Type.QUANTITATIVE] = "Q";
    ExtendedType[ExtendedType["BIN_Q"] = 'bin_' + type_1.Type.QUANTITATIVE] = "BIN_Q";
    ExtendedType[ExtendedType["T"] = type_1.Type.TEMPORAL] = "T";
    /**
     * Time Unit Temporal Field with time scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_T"] = 'timeUnit_time'] = "TIMEUNIT_T";
    /**
     * Time Unit Temporal Field with ordinal scale.
     */
    ExtendedType[ExtendedType["TIMEUNIT_O"] = 'timeUnit_' + type_1.Type.ORDINAL] = "TIMEUNIT_O";
    ExtendedType[ExtendedType["O"] = type_1.Type.ORDINAL] = "O";
    ExtendedType[ExtendedType["N"] = type_1.Type.NOMINAL] = "N";
    ExtendedType[ExtendedType["NONE"] = '-'] = "NONE";
})(ExtendedType = exports.ExtendedType || (exports.ExtendedType = {}));
exports.Q = ExtendedType.Q;
exports.BIN_Q = ExtendedType.BIN_Q;
exports.T = ExtendedType.T;
exports.TIMEUNIT_T = ExtendedType.TIMEUNIT_T;
exports.TIMEUNIT_O = ExtendedType.TIMEUNIT_O;
exports.O = ExtendedType.O;
exports.N = ExtendedType.N;
exports.NONE = ExtendedType.NONE;
function getExtendedType(fieldQ) {
    if (fieldQ.bin) {
        return ExtendedType.BIN_Q;
    }
    else if (fieldQ.timeUnit) {
        var sType = encoding_1.scaleType(fieldQ);
        return scale_1.hasDiscreteDomain(sType) ? ExtendedType.TIMEUNIT_O : ExtendedType.TIMEUNIT_T;
    }
    return fieldQ.type;
}
exports.getExtendedType = getExtendedType;

},{"../../query/encoding":13,"vega-lite/build/src/scale":60,"vega-lite/build/src/type":62}],29:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var shorthand_1 = require("../../query/shorthand");
var util_1 = require("../../util");
var type_1 = require("./type");
var base_1 = require("./base");
exports.TERRIBLE = -10;
/**
 * Effectiveness score for relationship between
 * Field Type (with Bin and TimeUnit) and Channel Score (Cleveland / Mackinlay based)
 */
var TypeChannelScorer = (function (_super) {
    __extends(TypeChannelScorer, _super);
    function TypeChannelScorer() {
        return _super.call(this, 'TypeChannel') || this;
    }
    TypeChannelScorer.prototype.initScore = function () {
        var _this = this;
        var SCORE = {};
        // Continuous Quantitative / Temporal Fields
        var CONTINUOUS_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            size: -0.575,
            color: -0.725,
            text: -2,
            opacity: -3,
            shape: exports.TERRIBLE,
            row: exports.TERRIBLE,
            column: exports.TERRIBLE,
            detail: 2 * exports.TERRIBLE
        };
        [type_1.Q, type_1.T, type_1.TIMEUNIT_T].forEach(function (type) {
            util_1.keys(CONTINUOUS_TYPE_CHANNEL_SCORE).forEach(function (channel) {
                SCORE[_this.featurize(type, channel)] = CONTINUOUS_TYPE_CHANNEL_SCORE[channel];
            });
        });
        // Discretized Quantitative / Temporal Fields / Ordinal
        var ORDERED_TYPE_CHANNEL_SCORE = util_1.extend({}, CONTINUOUS_TYPE_CHANNEL_SCORE, {
            row: -0.75,
            column: -0.75,
            shape: -3.1,
            text: -3.2,
            detail: -4
        });
        [type_1.BIN_Q, type_1.TIMEUNIT_O, type_1.O].forEach(function (type) {
            util_1.keys(ORDERED_TYPE_CHANNEL_SCORE).forEach(function (channel) {
                SCORE[_this.featurize(type, channel)] = ORDERED_TYPE_CHANNEL_SCORE[channel];
            });
        });
        var NOMINAL_TYPE_CHANNEL_SCORE = {
            x: 0,
            y: 0,
            color: -0.6,
            shape: -0.65,
            row: -0.7,
            column: -0.7,
            text: -0.8,
            detail: -2,
            size: -3,
            opacity: -3.1,
        };
        util_1.keys(NOMINAL_TYPE_CHANNEL_SCORE).forEach(function (channel) {
            SCORE[_this.featurize(type_1.N, channel)] = NOMINAL_TYPE_CHANNEL_SCORE[channel];
        });
        return SCORE;
    };
    TypeChannelScorer.prototype.featurize = function (type, channel) {
        return type + '_' + channel;
    };
    TypeChannelScorer.prototype.getScore = function (specM, schema, opt) {
        var _this = this;
        var encodingQueryByField = specM.getEncodings().reduce(function (m, encQ) {
            var fieldKey = shorthand_1.fieldDef(encQ);
            (m[fieldKey] = m[fieldKey] || []).push(encQ);
            return m;
        }, {});
        var features = [];
        util_1.forEach(encodingQueryByField, function (encQs) {
            var bestFieldFeature = encQs.reduce(function (best, encQ) {
                var type = type_1.getExtendedType(encQ);
                var feature = _this.featurize(type, encQ.channel);
                var featureScore = _this.getFeatureScore(feature);
                if (best === null || featureScore.score > best.score) {
                    return featureScore;
                }
                return best;
            }, null);
            features.push(bestFieldFeature);
            // TODO: add plus for over-encoding of one field
        });
        return features;
    };
    return TypeChannelScorer;
}(base_1.Scorer));
exports.TypeChannelScorer = TypeChannelScorer;

},{"../../query/shorthand":17,"../../util":35,"./base":22,"./type":28}],30:[function(require,module,exports){
"use strict";
var encoding_1 = require("../query/encoding");
exports.name = 'fieldOrder';
/**
 * Return ranking score based on indices of encoded fields in the schema.
 * If there are multiple fields, prioritize field on the lower indices of encodings.
 *
 * For example, to compare two specs with two encodings each,
 * first we compare the field on the 0-th index
 * and only compare the field on the 1-th index only if the fields on the 0-th index are the same.
 */
function score(specM, schema, _) {
    var fieldWildcardIndices = specM.wildcardIndex.encodingIndicesByProperty.get('field');
    if (!fieldWildcardIndices) {
        return {
            score: 0,
            features: []
        };
    }
    var encodings = specM.specQuery.encodings;
    var numFields = schema.fieldSchemas.length;
    var features = [];
    var totalScore = 0, base = 1;
    for (var i = fieldWildcardIndices.length - 1; i >= 0; i--) {
        var index = fieldWildcardIndices[i];
        var encoding = encodings[index];
        // Skip ValueQuery as we only care about order of fields.
        if (encoding_1.isValueQuery(encoding))
            continue;
        var field = encoding.field;
        var fieldWildcard = specM.wildcardIndex.encodings[index].get('field');
        var fieldIndex = schema.fieldSchema(field).index;
        // reverse order field with lower index should get higher score and come first
        var score_1 = -fieldIndex * base;
        totalScore += score_1;
        features.push({
            score: score_1,
            type: 'fieldOrder',
            feature: "field " + fieldWildcard.name + " is " + field + " (#" + fieldIndex + " in the schema)"
        });
        base *= numFields;
    }
    return {
        score: totalScore,
        features: features
    };
}
exports.score = score;

},{"../query/encoding":13}],31:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var effectiveness_1 = require("./effectiveness");
__export(require("./effectiveness"));
exports.aggregation = require("./aggregation");
exports.fieldOrder = require("./fieldorder");
/**
 * Registry for all encoding ranking functions
 */
var rankingRegistry = {};
/**
 * Add an ordering function to the registry.
 */
function register(name, keyFn) {
    rankingRegistry[name] = keyFn;
}
exports.register = register;
function get(name) {
    return rankingRegistry[name];
}
exports.get = get;
function rank(group, query, schema, level) {
    if (!query.nest || level === query.nest.length) {
        if (query.orderBy || query.chooseBy) {
            group.items.sort(comparatorFactory(query.orderBy || query.chooseBy, schema, query.config));
            if (query.chooseBy) {
                if (group.items.length > 0) {
                    // for chooseBy -- only keep the top-item
                    group.items.splice(1);
                }
            }
        }
    }
    else {
        // sort lower-level nodes first because our ranking takes top-item in the subgroup
        group.items.forEach(function (subgroup) {
            rank(subgroup, query, schema, level + 1);
        });
        if (query.nest[level].orderGroupBy) {
            group.items.sort(groupComparatorFactory(query.nest[level].orderGroupBy, schema, query.config));
        }
    }
    return group;
}
exports.rank = rank;
function comparatorFactory(name, schema, opt) {
    return function (m1, m2) {
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
exports.comparatorFactory = comparatorFactory;
function groupComparatorFactory(name, schema, opt) {
    return function (g1, g2) {
        var m1 = g1.getTopSpecQueryModel();
        var m2 = g2.getTopSpecQueryModel();
        if (name instanceof Array) {
            return getScoreDifference(name, m1, m2, schema, opt);
        }
        else {
            return getScoreDifference([name], m1, m2, schema, opt);
        }
    };
}
exports.groupComparatorFactory = groupComparatorFactory;
function getScoreDifference(name, m1, m2, schema, opt) {
    for (var _i = 0, name_1 = name; _i < name_1.length; _i++) {
        var rankingName = name_1[_i];
        var scoreDifference = getScore(m2, rankingName, schema, opt).score - getScore(m1, rankingName, schema, opt).score;
        if (scoreDifference !== 0) {
            return scoreDifference;
        }
    }
    return 0;
}
function getScore(model, rankingName, schema, opt) {
    if (model.getRankingScore(rankingName) !== undefined) {
        return model.getRankingScore(rankingName);
    }
    var fn = get(rankingName);
    var score = fn(model, schema, opt);
    model.setRankingScore(rankingName, score);
    return score;
}
exports.getScore = getScore;
exports.EFFECTIVENESS = 'effectiveness';
register(exports.EFFECTIVENESS, effectiveness_1.effectiveness);
register(exports.aggregation.name, exports.aggregation.score);
register(exports.fieldOrder.name, exports.fieldOrder.score);

},{"./aggregation":20,"./effectiveness":25,"./fieldorder":30}],32:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var config_1 = require("./config");
var generate_1 = require("./generate");
var nest_1 = require("./nest");
var normalize_1 = require("./query/normalize");
var ranking_1 = require("./ranking/ranking");
function recommend(q, schema, config) {
    // 1. Normalize non-nested `groupBy` to always have `groupBy` inside `nest`
    //    and merge config with the following precedence
    //    query.config > config > DEFAULT_QUERY_CONFIG
    q = __assign({}, normalize_1.normalize(q), { config: __assign({}, config_1.DEFAULT_QUERY_CONFIG, config, q.config) });
    // 2. Generate
    var answerSet = generate_1.generate(q.spec, schema, q.config);
    var nestedAnswerSet = nest_1.nest(answerSet, q.nest);
    var result = ranking_1.rank(nestedAnswerSet, q, schema, 0);
    return {
        query: q,
        result: result
    };
}
exports.recommend = recommend;

},{"./config":1,"./generate":8,"./nest":10,"./query/normalize":16,"./ranking/ranking":31}],33:[function(require,module,exports){
"use strict";
var type_1 = require("vega-lite/build/src/type");
var bin_1 = require("vega-lite/build/src/bin");
var timeunit_1 = require("vega-lite/build/src/timeunit");
var stats_1 = require("datalib/src/stats");
var type_2 = require("datalib/src/import/type");
var dlBin = require("datalib/src/bins/bins");
var config_1 = require("./config");
var util_1 = require("./util");
/**
 * Build a Schema object.
 *
 * @param data - a set of raw data in the same format that Vega-Lite / Vega takes
 * Basically, it's an array in the form of:
 *
 * [
 *   {a: 1, b:2},
 *   {a: 2, b:3},
 *   ...
 * ]
 *
 * @return a Schema object
 */
function build(data, opt) {
    if (opt === void 0) { opt = {}; }
    opt = util_1.extend({}, config_1.DEFAULT_QUERY_CONFIG, opt);
    // create profiles for each variable
    var summaries = stats_1.summary(data);
    var types = type_2.inferAll(data); // inferAll does stronger type inference than summary
    var fieldSchemas = summaries.map(function (fieldProfile) {
        var field = fieldProfile.field;
        var primitiveType = types[field];
        var distinct = fieldProfile.distinct;
        var type;
        if (primitiveType === PrimitiveType.NUMBER) {
            type = type_1.Type.QUANTITATIVE;
        }
        else if (primitiveType === PrimitiveType.INTEGER) {
            // use ordinal or nominal when cardinality of integer type is relatively low and the distinct values are less than an amount specified in options
            if ((distinct < opt.numberNominalLimit) && (distinct / fieldProfile.count < opt.numberNominalProportion)) {
                type = type_1.Type.NOMINAL;
            }
            else {
                type = type_1.Type.QUANTITATIVE;
            }
        }
        else if (primitiveType === PrimitiveType.DATE) {
            type = type_1.Type.TEMPORAL;
            // need to get correct min/max of date data because datalib's summary method does not
            // calculate this correctly for date types.
            fieldProfile.min = new Date(data[0][field]);
            fieldProfile.max = new Date(data[0][field]);
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var dataEntry = data_1[_i];
                var time = new Date(dataEntry[field]).getTime();
                if (time < fieldProfile.min.getTime()) {
                    fieldProfile.min = new Date(time);
                }
                if (time > fieldProfile.max.getTime()) {
                    fieldProfile.max = new Date(time);
                }
            }
        }
        else {
            type = type_1.Type.NOMINAL;
        }
        return {
            field: field,
            type: type,
            primitiveType: primitiveType,
            stats: fieldProfile,
            timeStats: {},
            binStats: {}
        };
    });
    // order the fieldSchemas (sort them)
    var order = {
        'nominal': 0,
        'ordinal': 1,
        'temporal': 2,
        'quantitative': 3
    };
    fieldSchemas.sort(function (a, b) {
        // first order by type: nominal < temporal < quantitative < ordinal
        if (order[a.type] < order[b.type]) {
            return -1;
        }
        else if (order[a.type] > order[b.type]) {
            return 1;
        }
        else {
            // then order by field (alphabetically)
            return a.field.localeCompare(b.field);
        }
    });
    // Add index for sorting
    fieldSchemas.forEach(function (fieldSchema, index) { return fieldSchema.index = index; });
    // calculate preset bins for quantitative and temporal data
    for (var _i = 0, fieldSchemas_1 = fieldSchemas; _i < fieldSchemas_1.length; _i++) {
        var fieldSchema = fieldSchemas_1[_i];
        if (fieldSchema.type === type_1.Type.QUANTITATIVE) {
            for (var _a = 0, _b = opt.enum.binProps.maxbins; _a < _b.length; _a++) {
                var maxbins = _b[_a];
                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
            }
        }
        else if (fieldSchema.type === type_1.Type.TEMPORAL) {
            for (var _c = 0, _d = opt.enum.timeUnit; _c < _d.length; _c++) {
                var unit = _d[_c];
                if (unit !== undefined) {
                    fieldSchema.timeStats[unit] = timeSummary(unit, fieldSchema.stats);
                }
            }
        }
    }
    return new Schema(fieldSchemas);
}
exports.build = build;
var Schema = (function () {
    function Schema(fieldSchemas) {
        this._fieldSchemas = fieldSchemas;
        this._fieldSchemaIndex = fieldSchemas.reduce(function (m, fieldSchema) {
            m[fieldSchema.field] = fieldSchema;
            return m;
        }, {});
    }
    /** @return a list of the field names (for enumerating). */
    Schema.prototype.fields = function () {
        return this._fieldSchemas.map(function (fieldSchema) { return fieldSchema.field; });
    };
    Object.defineProperty(Schema.prototype, "fieldSchemas", {
        /** @return a list of FieldSchemas */
        get: function () {
            return this._fieldSchemas;
        },
        enumerable: true,
        configurable: true
    });
    Schema.prototype.fieldSchema = function (field) {
        return this._fieldSchemaIndex[field];
    };
    /**
     * @return primitive type of the field if exist, otherwise return null
     */
    Schema.prototype.primitiveType = function (field) {
        return this._fieldSchemaIndex[field] ? this._fieldSchemaIndex[field].primitiveType : null;
    };
    /**
     * @return type of measturement of the field if exist, otherwise return null
     */
    Schema.prototype.type = function (field) {
        return this._fieldSchemaIndex[field] ? this._fieldSchemaIndex[field].type : null;
    };
    /** @return cardinality of the field associated with encQ, null if it doesn't exist.
     *  @param augmentTimeUnitDomain - TimeUnit field domains will not be augmented if explicitly set to false.
     */
    Schema.prototype.cardinality = function (fieldQ, augmentTimeUnitDomain, excludeInvalid) {
        if (augmentTimeUnitDomain === void 0) { augmentTimeUnitDomain = true; }
        if (excludeInvalid === void 0) { excludeInvalid = false; }
        var fieldSchema = this._fieldSchemaIndex[fieldQ.field];
        if (fieldQ.aggregate || fieldQ.autoCount) {
            return 1;
        }
        else if (fieldQ.bin) {
            // encQ.bin will either be a boolean or a BinQuery
            var bin = void 0;
            if (typeof fieldQ.bin === 'boolean') {
                // autoMaxBins defaults to 10 if channel is Wildcard
                bin = {
                    maxbins: bin_1.autoMaxBins(fieldQ.channel)
                };
            }
            else {
                bin = fieldQ.bin;
            }
            var maxbins = bin.maxbins;
            if (!fieldSchema.binStats[maxbins]) {
                // need to calculate
                fieldSchema.binStats[maxbins] = binSummary(maxbins, fieldSchema.stats);
            }
            // don't need to worry about excludeInvalid here because invalid values don't affect linearly binned field's cardinality
            return fieldSchema.binStats[maxbins].distinct;
        }
        else if (fieldQ.timeUnit) {
            if (augmentTimeUnitDomain) {
                switch (fieldQ.timeUnit) {
                    // TODO: this should not always be the case once Vega-Lite supports turning off domain augmenting (VL issue #1385)
                    case timeunit_1.TimeUnit.SECONDS: return 60;
                    case timeunit_1.TimeUnit.MINUTES: return 60;
                    case timeunit_1.TimeUnit.HOURS: return 24;
                    case timeunit_1.TimeUnit.DAY: return 7;
                    case timeunit_1.TimeUnit.DATE: return 31;
                    case timeunit_1.TimeUnit.MONTH: return 12;
                    case timeunit_1.TimeUnit.QUARTER: return 4;
                    case timeunit_1.TimeUnit.MILLISECONDS: return 1000;
                }
            }
            var unit = fieldQ.timeUnit;
            var timeStats = fieldSchema.timeStats;
            // if the cardinality for the timeUnit is not cached, calculate it
            if (!timeStats[unit]) {
                timeStats[unit] = timeSummary(fieldQ.timeUnit, fieldSchema.stats);
            }
            if (excludeInvalid) {
                return timeStats[unit].distinct - invalidCount(timeStats[unit].unique, ['Invalid Date', null]);
            }
            else {
                return timeStats[unit].distinct;
            }
        }
        else {
            if (fieldSchema) {
                if (excludeInvalid) {
                    return fieldSchema.stats.distinct - invalidCount(fieldSchema.stats.unique, [NaN, null]);
                }
                else {
                    return fieldSchema.stats.distinct;
                }
            }
            else {
                return null;
            }
        }
    };
    /**
     * Given an EncodingQuery with a timeUnit, returns true if the date field
     * has multiple distinct values for all parts of the timeUnit. Returns undefined
     * if the timeUnit is undefined.
     * i.e.
     * ('yearmonth', [Jan 1 2000, Feb 2 2000] returns false)
     * ('yearmonth', [Jan 1 2000, Feb 2 2001] returns true)
     */
    Schema.prototype.timeUnitHasVariation = function (fieldQ) {
        if (!fieldQ.timeUnit) {
            return;
        }
        // if there is no variation in `date`, there should not be variation in `day`
        if (fieldQ.timeUnit === timeunit_1.TimeUnit.DAY) {
            var dateEncQ = util_1.extend({}, fieldQ, { timeUnit: timeunit_1.TimeUnit.DATE });
            if (this.cardinality(dateEncQ, false, true) <= 1) {
                return false;
            }
        }
        var fullTimeUnit = fieldQ.timeUnit;
        for (var _i = 0, SINGLE_TIMEUNITS_1 = timeunit_1.SINGLE_TIMEUNITS; _i < SINGLE_TIMEUNITS_1.length; _i++) {
            var singleUnit = SINGLE_TIMEUNITS_1[_i];
            if (timeunit_1.containsTimeUnit(fullTimeUnit, singleUnit)) {
                // Create a clone of encQ, but with singleTimeUnit
                var singleUnitEncQ = util_1.extend({}, fieldQ, { timeUnit: singleUnit });
                if (this.cardinality(singleUnitEncQ, false, true) <= 1) {
                    return false;
                }
            }
        }
        return true;
    };
    Schema.prototype.domain = function (fieldQ) {
        // TODO: differentiate for field with bin / timeUnit
        var fieldSchema = this._fieldSchemaIndex[fieldQ.field];
        var domain = util_1.keys(fieldSchema.stats.unique);
        if (fieldSchema.type === type_1.Type.QUANTITATIVE) {
            // return [min, max], coerced into number types
            return [+fieldSchema.stats.min, +fieldSchema.stats.max];
        }
        else if (fieldSchema.primitiveType === PrimitiveType.DATE) {
            // return [min, max] dates
            return [fieldSchema.stats.min, fieldSchema.stats.max];
        }
        else if (fieldSchema.primitiveType === PrimitiveType.INTEGER ||
            fieldSchema.primitiveType === PrimitiveType.NUMBER) {
            // coerce non-quantitative numerical data into number type
            domain = domain.map(function (x) { return +x; });
            return domain.sort(util_1.cmp);
        }
        return domain.map(function (x) {
            // Convert 'null' to null as it is encoded similarly in datalib.
            // This is wrong when it is a string 'null' but that rarely happens.
            return x === 'null' ? null : x;
        }).sort(util_1.cmp);
    };
    /**
     * @return a Summary corresponding to the field of the given EncodingQuery
     */
    Schema.prototype.stats = function (fieldQ) {
        // TODO: differentiate for field with bin / timeUnit vs without
        var fieldSchema = this._fieldSchemaIndex[fieldQ.field];
        return fieldSchema ? fieldSchema.stats : null;
    };
    return Schema;
}());
exports.Schema = Schema;
/**
 * @return a summary of the binning scheme determined from the given max number of bins
 */
function binSummary(maxbins, summary) {
    var bin = dlBin({
        min: summary.min,
        max: summary.max,
        maxbins: maxbins
    });
    // start with summary, pre-binning
    var result = util_1.extend({}, summary);
    result.unique = binUnique(bin, summary.unique);
    result.distinct = (bin.stop - bin.start) / bin.step;
    result.min = bin.start;
    result.max = bin.stop;
    return result;
}
/** @return a modified version of the passed summary with unique and distinct set according to the timeunit.
 *  Maps 'null' (string) keys to the null value and invalid dates to 'Invalid Date' in the unique dictionary.
 */
function timeSummary(timeunit, summary) {
    var result = util_1.extend({}, summary);
    var unique = {};
    util_1.keys(summary.unique).forEach(function (dateString) {
        // don't convert null value because the Date constructor will actually convert it to a date
        var date = (dateString === 'null') ? null : new Date(dateString);
        // at this point, `date` is either the null value, a valid Date object, or "Invalid Date" which is a Date
        var key;
        if (date === null) {
            key = null;
        }
        else if (isNaN(date.getTime())) {
            key = 'Invalid Date';
        }
        else {
            key = ((timeunit === timeunit_1.TimeUnit.DAY) ? date.getDay() : timeunit_1.convert(timeunit, date)).toString();
        }
        unique[key] = (unique[key] || 0) + summary.unique[dateString];
    });
    result.unique = unique;
    result.distinct = util_1.keys(unique).length;
    return result;
}
/**
 * @return a new unique object based off of the old unique count and a binning scheme
 */
function binUnique(bin, oldUnique) {
    var newUnique = {};
    for (var value in oldUnique) {
        var bucket = void 0;
        if (value === null) {
            bucket = null;
        }
        else if (isNaN(Number(value))) {
            bucket = NaN;
        }
        else {
            bucket = bin.value(Number(value));
        }
        newUnique[bucket] = (newUnique[bucket] || 0) + oldUnique[value];
    }
    return newUnique;
}
/** @return the number of items in list that occur as keys of unique */
function invalidCount(unique, list) {
    return list.reduce(function (prev, cur) {
        return unique[cur] ? prev + 1 : prev;
    }, 0);
}
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["STRING"] = 'string'] = "STRING";
    PrimitiveType[PrimitiveType["NUMBER"] = 'number'] = "NUMBER";
    PrimitiveType[PrimitiveType["INTEGER"] = 'integer'] = "INTEGER";
    PrimitiveType[PrimitiveType["BOOLEAN"] = 'boolean'] = "BOOLEAN";
    PrimitiveType[PrimitiveType["DATE"] = 'date'] = "DATE";
})(PrimitiveType = exports.PrimitiveType || (exports.PrimitiveType = {}));

},{"./config":1,"./util":35,"datalib/src/bins/bins":40,"datalib/src/import/type":42,"datalib/src/stats":43,"vega-lite/build/src/bin":52,"vega-lite/build/src/timeunit":61,"vega-lite/build/src/type":62}],34:[function(require,module,exports){
"use strict";
var channel_1 = require("vega-lite/build/src/channel");
var scale_1 = require("vega-lite/build/src/scale");
var type_1 = require("vega-lite/build/src/type");
var encoding_1 = require("./query/encoding");
function stylize(answerSet, schema, opt) {
    var encQIndex = {};
    answerSet = answerSet.map(function (specM) {
        if (opt.smallRangeStepForHighCardinalityOrFacet) {
            specM = smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt);
        }
        if (opt.nominalColorScaleForHighCardinality) {
            specM = nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt);
        }
        if (opt.xAxisOnTopForHighYCardinalityWithoutColumn) {
            specM = xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt);
        }
        return specM;
    });
    return answerSet;
}
exports.stylize = stylize;
function smallRangeStepForHighCardinalityOrFacet(specM, schema, encQIndex, opt) {
    [channel_1.Channel.ROW, channel_1.Channel.Y, channel_1.Channel.COLUMN, channel_1.Channel.X].forEach(function (channel) {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    var yEncQ = encQIndex[channel_1.Channel.Y];
    if (yEncQ !== undefined && encoding_1.isFieldQuery(yEncQ)) {
        if (encQIndex[channel_1.Channel.ROW] ||
            schema.cardinality(yEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
            // We check for undefined rather than
            // yEncQ.scale = yEncQ.scale || {} to cover the case where
            // yEncQ.scale has been set to false/null.
            // This prevents us from incorrectly overriding scale and
            // assigning a rangeStep when scale is set to false.
            if (yEncQ.scale === undefined) {
                yEncQ.scale = {};
            }
            // We do not want to assign a rangeStep if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            var yScaleType = encoding_1.scaleType(yEncQ);
            if (yEncQ.scale && (yScaleType === undefined || scale_1.hasDiscreteDomain(yScaleType))) {
                if (!yEncQ.scale.rangeStep) {
                    yEncQ.scale.rangeStep = 12;
                }
            }
        }
    }
    var xEncQ = encQIndex[channel_1.Channel.X];
    if (encoding_1.isFieldQuery(xEncQ)) {
        if (encQIndex[channel_1.Channel.COLUMN] ||
            schema.cardinality(xEncQ) > opt.smallRangeStepForHighCardinalityOrFacet.maxCardinality) {
            // Just like y, we don't want to do this if scale is null/false
            if (xEncQ.scale === undefined) {
                xEncQ.scale = {};
            }
            // We do not want to assign a rangeStep if scale is set to false
            // and we only apply this if the scale is (or can be) an ordinal scale.
            var xScaleType = encoding_1.scaleType(xEncQ);
            if (xEncQ.scale && (xScaleType === undefined || scale_1.hasDiscreteDomain(xScaleType))) {
                if (!xEncQ.scale.rangeStep) {
                    xEncQ.scale.rangeStep = 12;
                }
            }
        }
    }
    return specM;
}
exports.smallRangeStepForHighCardinalityOrFacet = smallRangeStepForHighCardinalityOrFacet;
function nominalColorScaleForHighCardinality(specM, schema, encQIndex, opt) {
    encQIndex[channel_1.Channel.COLOR] = specM.getEncodingQueryByChannel(channel_1.Channel.COLOR);
    var colorEncQ = encQIndex[channel_1.Channel.COLOR];
    if (encoding_1.isFieldQuery(colorEncQ) && (colorEncQ !== undefined) && (colorEncQ.type === type_1.Type.NOMINAL) &&
        (schema.cardinality(colorEncQ) > opt.nominalColorScaleForHighCardinality.maxCardinality)) {
        if (colorEncQ.scale === undefined) {
            colorEncQ.scale = {};
        }
        if (colorEncQ.scale) {
            if (!colorEncQ.scale.range) {
                colorEncQ.scale.range = opt.nominalColorScaleForHighCardinality.palette;
            }
        }
    }
    return specM;
}
exports.nominalColorScaleForHighCardinality = nominalColorScaleForHighCardinality;
function xAxisOnTopForHighYCardinalityWithoutColumn(specM, schema, encQIndex, opt) {
    [channel_1.Channel.COLUMN, channel_1.Channel.X, channel_1.Channel.Y].forEach(function (channel) {
        encQIndex[channel] = specM.getEncodingQueryByChannel(channel);
    });
    if (encQIndex[channel_1.Channel.COLUMN] === undefined) {
        var xEncQ = encQIndex[channel_1.Channel.X];
        var yEncQ = encQIndex[channel_1.Channel.Y];
        if (encoding_1.isFieldQuery(xEncQ) && encoding_1.isFieldQuery(yEncQ) && yEncQ !== undefined && yEncQ.field && scale_1.hasDiscreteDomain(encoding_1.scaleType(yEncQ))) {
            if (xEncQ !== undefined) {
                if (schema.cardinality(yEncQ) > opt.xAxisOnTopForHighYCardinalityWithoutColumn.maxCardinality) {
                    if (xEncQ.axis === undefined) {
                        xEncQ.axis = {};
                    }
                    if (xEncQ.axis && !xEncQ.axis.orient) {
                        xEncQ.axis.orient = 'top';
                    }
                }
            }
        }
    }
    return specM;
}
exports.xAxisOnTopForHighYCardinalityWithoutColumn = xAxisOnTopForHighYCardinalityWithoutColumn;

},{"./query/encoding":13,"vega-lite/build/src/channel":53,"vega-lite/build/src/scale":60,"vega-lite/build/src/type":62}],35:[function(require,module,exports){
"use strict";
var util_1 = require("datalib/src/util");
var util_2 = require("datalib/src/util");
exports.cmp = util_2.cmp;
exports.keys = util_2.keys;
exports.duplicate = util_2.duplicate;
exports.extend = util_2.extend;
exports.isObject = util_2.isObject;
exports.isArray = util_2.isArray;
exports.isBoolean = util_2.isBoolean;
exports.toMap = util_2.toMap;
function contains(array, item) {
    return array.indexOf(item) !== -1;
}
exports.contains = contains;
;
function every(arr, f) {
    for (var i = 0; i < arr.length; i++) {
        if (!f(arr[i], i)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            f.call(thisArg, obj[k], k, obj);
        }
    }
}
exports.forEach = forEach;
;
function some(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
;
function nestedMap(array, f) {
    return array.map(function (a) {
        if (util_1.isArray(a)) {
            return nestedMap(a, f);
        }
        return f(a);
    });
}
exports.nestedMap = nestedMap;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) {
        return !contains(excludedItems, item);
    });
}
exports.without = without;

},{"datalib/src/util":45}],36:[function(require,module,exports){
"use strict";
var property_1 = require("./property");
var util_1 = require("./util");
var axis_1 = require("vega-lite/build/src/axis");
var channel_1 = require("vega-lite/build/src/channel");
var mark_1 = require("vega-lite/build/src/mark");
var scale_1 = require("vega-lite/build/src/scale");
var legend_1 = require("vega-lite/build/src/legend");
var timeunit_1 = require("vega-lite/build/src/timeunit");
var type_1 = require("vega-lite/build/src/type");
exports.SHORT_WILDCARD = '?';
function isWildcard(prop) {
    return isShortWildcard(prop) || isWildcardDef(prop);
}
exports.isWildcard = isWildcard;
function isShortWildcard(prop) {
    return prop === exports.SHORT_WILDCARD;
}
exports.isShortWildcard = isShortWildcard;
function isWildcardDef(prop) {
    return prop !== undefined && (!!prop.enum || !!prop.name) && !util_1.isArray(prop);
}
exports.isWildcardDef = isWildcardDef;
function initWildcard(prop, defaultName, defaultEnumValues) {
    return util_1.extend({}, {
        name: defaultName,
        enum: defaultEnumValues
    }, prop === exports.SHORT_WILDCARD ? {} : prop);
}
exports.initWildcard = initWildcard;
/**
 * Initial short names from list of full camelCaseNames.
 * For each camelCaseNames, return unique short names based on initial (e.g., `ccn`)
 */
function initNestedPropName(fullNames) {
    var index = {};
    var has = {};
    var _loop_1 = function (fullName) {
        var initialIndices = [0];
        for (var i = 0; i < fullName.length; i++) {
            if (fullName.charAt(i).toUpperCase() === fullName.charAt(i)) {
                initialIndices.push(i);
            }
        }
        var shortName = initialIndices.map(function (i) { return fullName.charAt(i); }).join('').toLowerCase();
        if (!has[shortName]) {
            index[fullName] = shortName;
            has[shortName] = true;
            return "continue";
        }
        // If duplicate, add last character and try again!
        if (initialIndices[initialIndices.length - 1] !== fullName.length - 1) {
            shortName = initialIndices.concat([fullName.length - 1]).map(function (i) { return fullName.charAt(i); }).join('').toLowerCase();
            if (!has[shortName]) {
                index[fullName] = shortName;
                has[shortName] = true;
                return "continue";
            }
        }
        for (var i = 1; !index[fullName]; i++) {
            var shortNameWithNo = shortName + '_' + i;
            if (!has[shortNameWithNo]) {
                index[fullName] = shortNameWithNo;
                has[shortNameWithNo] = true;
                break;
            }
        }
    };
    for (var _i = 0, fullNames_1 = fullNames; _i < fullNames_1.length; _i++) {
        var fullName = fullNames_1[_i];
        _loop_1(fullName);
    }
    return index;
}
exports.DEFAULT_NAME = {
    mark: 'm',
    channel: 'c',
    aggregate: 'a',
    autoCount: '#',
    hasFn: 'h',
    bin: 'b',
    sort: 'so',
    scale: 's',
    axis: 'ax',
    legend: 'l',
    timeUnit: 'tu',
    field: 'f',
    type: 't',
    binProps: {
        maxbins: 'mb',
        min: 'mi',
        max: 'ma',
        base: 'b',
        step: 's',
        steps: 'ss',
        minstep: 'ms',
        divide: 'd'
    },
    sortProps: {
        field: 'f',
        op: 'o',
        order: 'or'
    },
    scaleProps: initNestedPropName(scale_1.SCALE_PROPERTIES),
    axisProps: initNestedPropName(axis_1.AXIS_PROPERTIES),
    legendProps: initNestedPropName(legend_1.LEGEND_PROPERTIES)
};
function getDefaultName(prop) {
    if (property_1.isEncodingNestedProp(prop)) {
        return exports.DEFAULT_NAME[prop.parent] + '-' + exports.DEFAULT_NAME[prop.parent + 'Props'][prop.child];
    }
    if (exports.DEFAULT_NAME[prop]) {
        return exports.DEFAULT_NAME[prop];
    }
    /* istanbul ignore next */
    throw new Error('Default name undefined for ' + prop);
}
exports.getDefaultName = getDefaultName;
var DEFAULT_BOOLEAN_ENUM = [false, true];
var DEFAULT_BIN_PROPS_ENUM = {
    maxbins: [5, 10, 20],
    extent: [undefined],
    base: [10],
    step: [undefined],
    steps: [undefined],
    minstep: [undefined],
    divide: [[5, 2]]
};
var DEFAULT_SORT_PROPS = {
    field: [undefined],
    op: ['min', 'mean'],
    order: ['ascending', 'descending']
};
var DEFAULT_SCALE_PROPS_ENUM = {
    type: [undefined, scale_1.ScaleType.LOG],
    domain: [undefined],
    exponent: [1, 2],
    clamp: DEFAULT_BOOLEAN_ENUM,
    nice: DEFAULT_BOOLEAN_ENUM,
    round: DEFAULT_BOOLEAN_ENUM,
    zero: DEFAULT_BOOLEAN_ENUM,
    padding: [undefined],
    paddingInner: [undefined],
    paddingOuter: [undefined],
    interpolate: [undefined],
    range: [undefined],
    rangeStep: [17, 21],
    scheme: [undefined],
};
var DEFAULT_AXIS_PROPS_ENUM = {
    zindex: [1, 0],
    offset: [undefined],
    orient: [undefined],
    values: [undefined],
    domain: DEFAULT_BOOLEAN_ENUM,
    grid: DEFAULT_BOOLEAN_ENUM,
    format: [undefined],
    labels: DEFAULT_BOOLEAN_ENUM,
    labelAngle: [undefined],
    labelMaxLength: [undefined],
    labelPadding: [undefined],
    maxExtent: [undefined],
    minExtent: [undefined],
    position: [undefined],
    ticks: DEFAULT_BOOLEAN_ENUM,
    tickCount: [undefined],
    tickSize: [undefined],
    title: [undefined],
    titleMaxLength: [undefined],
    titlePadding: [undefined]
};
var DEFAULT_LEGEND_PROPS_ENUM = {
    entryPadding: [undefined],
    orient: ['left', 'right'],
    offset: [undefined],
    format: [undefined],
    values: [undefined],
    tickCount: [undefined],
    title: [undefined],
    type: [undefined],
    zindex: [undefined]
};
// Use FullEnumIndex to make sure we have all properties specified here!
exports.DEFAULT_ENUM_INDEX = {
    mark: [mark_1.Mark.POINT, mark_1.Mark.BAR, mark_1.Mark.LINE, mark_1.Mark.AREA, mark_1.Mark.TICK],
    channel: [channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN, channel_1.SIZE, channel_1.COLOR],
    aggregate: [undefined, 'mean'],
    autoCount: DEFAULT_BOOLEAN_ENUM,
    bin: DEFAULT_BOOLEAN_ENUM,
    hasFn: DEFAULT_BOOLEAN_ENUM,
    timeUnit: [undefined, timeunit_1.TimeUnit.YEAR, timeunit_1.TimeUnit.MONTH, timeunit_1.TimeUnit.MINUTES, timeunit_1.TimeUnit.SECONDS],
    field: [undefined],
    type: [type_1.Type.NOMINAL, type_1.Type.ORDINAL, type_1.Type.QUANTITATIVE, type_1.Type.TEMPORAL],
    sort: ['ascending', 'descending'],
    scale: [true],
    axis: DEFAULT_BOOLEAN_ENUM,
    legend: DEFAULT_BOOLEAN_ENUM,
    binProps: DEFAULT_BIN_PROPS_ENUM,
    sortProps: DEFAULT_SORT_PROPS,
    scaleProps: DEFAULT_SCALE_PROPS_ENUM,
    axisProps: DEFAULT_AXIS_PROPS_ENUM,
    legendProps: DEFAULT_LEGEND_PROPS_ENUM
};
// TODO: rename this to getDefaultEnum
function getDefaultEnumValues(prop, schema, opt) {
    if (prop === 'field' || (property_1.isEncodingNestedProp(prop) && prop.parent === 'sort' && prop.child === 'field')) {
        // For field, by default enumerate all fields
        return schema.fields();
    }
    var val;
    if (property_1.isEncodingNestedProp(prop)) {
        val = opt.enum[prop.parent + 'Props'][prop.child];
    }
    else {
        val = opt.enum[prop];
    }
    if (val !== undefined) {
        return val;
    }
    /* istanbul ignore next */
    throw new Error('No default enumValues for ' + JSON.stringify(prop));
}
exports.getDefaultEnumValues = getDefaultEnumValues;

},{"./property":11,"./util":35,"vega-lite/build/src/axis":51,"vega-lite/build/src/channel":53,"vega-lite/build/src/legend":57,"vega-lite/build/src/mark":59,"vega-lite/build/src/scale":60,"vega-lite/build/src/timeunit":61,"vega-lite/build/src/type":62}],37:[function(require,module,exports){
"use strict";
var property_1 = require("./property");
var propindex_1 = require("./propindex");
var WildcardIndex = (function () {
    function WildcardIndex() {
        this._mark = undefined;
        this._encodings = {};
        this._encodingIndicesByProperty = new propindex_1.PropIndex();
    }
    WildcardIndex.prototype.setEncodingProperty = function (index, prop, wildcard) {
        var encodingsIndex = this._encodings;
        // Init encoding index and set prop
        var encIndex = encodingsIndex[index] = encodingsIndex[index] || new propindex_1.PropIndex();
        encIndex.set(prop, wildcard);
        // Initialize indicesByProperty[prop] and add index
        var indicesByProp = this._encodingIndicesByProperty;
        indicesByProp.set(prop, (indicesByProp.get(prop) || []));
        indicesByProp.get(prop).push(index);
        return this;
    };
    WildcardIndex.prototype.hasEncodingProperty = function (index, prop) {
        return !!this._encodings[index] && this._encodings[index].has(prop);
    };
    WildcardIndex.prototype.hasProperty = function (prop) {
        if (property_1.isEncodingProperty(prop)) {
            return this.encodingIndicesByProperty.has(prop);
        }
        if (prop === 'mark') {
            return !!this.mark;
        }
        /* istanbul ignore next */
        throw new Error('Unimplemented for property ' + prop);
    };
    WildcardIndex.prototype.isEmpty = function () {
        return !this.mark && this.encodingIndicesByProperty.size() === 0;
    };
    WildcardIndex.prototype.setMark = function (mark) {
        this._mark = mark;
        return this;
    };
    Object.defineProperty(WildcardIndex.prototype, "mark", {
        get: function () {
            return this._mark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WildcardIndex.prototype, "encodings", {
        get: function () {
            return this._encodings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WildcardIndex.prototype, "encodingIndicesByProperty", {
        get: function () {
            return this._encodingIndicesByProperty;
        },
        enumerable: true,
        configurable: true
    });
    return WildcardIndex;
}());
exports.WildcardIndex = WildcardIndex;

},{"./property":11,"./propindex":12}],38:[function(require,module,exports){

},{}],39:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('d3-time', ['exports'], factory) :
  factory((global.d3_time = {}));
}(this, function (exports) { 'use strict';

  var t0 = new Date;
  var t1 = new Date;
  function newInterval(floori, offseti, count, field) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.round = function(date) {
      var d0 = new Date(+date),
          d1 = new Date(date - 1);
      floori(d0), floori(d1), offseti(d1, 1);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), date;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = new Date(start - 1);
      stop = new Date(+stop);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      offseti(start, 1), floori(start);
      if (start < stop) range.push(new Date(+start));
      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) {
      interval.count = function(start, end) {
        t0.setTime(+start), t1.setTime(+end);
        floori(t0), floori(t1);
        return Math.floor(count(t0, t1));
      };

      interval.every = function(step) {
        step = Math.floor(step);
        return !isFinite(step) || !(step > 0) ? null
            : !(step > 1) ? interval
            : interval.filter(field
                ? function(d) { return field(d) % step === 0; }
                : function(d) { return interval.count(0, d) % step === 0; });
      };
    }

    return interval;
  };

  var millisecond = newInterval(function() {
    // noop
  }, function(date, step) {
    date.setTime(+date + step);
  }, function(start, end) {
    return end - start;
  });

  // An optimized implementation for this simple case.
  millisecond.every = function(k) {
    k = Math.floor(k);
    if (!isFinite(k) || !(k > 0)) return null;
    if (!(k > 1)) return millisecond;
    return newInterval(function(date) {
      date.setTime(Math.floor(date / k) * k);
    }, function(date, step) {
      date.setTime(+date + step * k);
    }, function(start, end) {
      return (end - start) / k;
    });
  };

  var second = newInterval(function(date) {
    date.setMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  }, function(date) {
    return date.getSeconds();
  });

  var minute = newInterval(function(date) {
    date.setSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  }, function(date) {
    return date.getMinutes();
  });

  var hour = newInterval(function(date) {
    date.setMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  }, function(date) {
    return date.getHours();
  });

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  }, function(date) {
    return date.getDate() - 1;
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var month = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function(date) {
    return date.getMonth();
  });

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  }, function(date) {
    return date.getFullYear();
  });

  var utcSecond = newInterval(function(date) {
    date.setUTCMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  }, function(date) {
    return date.getUTCSeconds();
  });

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  }, function(date) {
    return date.getUTCMinutes();
  });

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  }, function(date) {
    return date.getUTCHours();
  });

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / 864e5;
  }, function(date) {
    return date.getUTCDate() - 1;
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcMonth = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(1);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function(date) {
    return date.getUTCMonth();
  });

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  }, function(date) {
    return date.getUTCFullYear();
  });

  var milliseconds = millisecond.range;
  var seconds = second.range;
  var minutes = minute.range;
  var hours = hour.range;
  var days = day.range;
  var sundays = sunday.range;
  var mondays = monday.range;
  var tuesdays = tuesday.range;
  var wednesdays = wednesday.range;
  var thursdays = thursday.range;
  var fridays = friday.range;
  var saturdays = saturday.range;
  var weeks = sunday.range;
  var months = month.range;
  var years = year.range;

  var utcMillisecond = millisecond;
  var utcMilliseconds = milliseconds;
  var utcSeconds = utcSecond.range;
  var utcMinutes = utcMinute.range;
  var utcHours = utcHour.range;
  var utcDays = utcDay.range;
  var utcSundays = utcSunday.range;
  var utcMondays = utcMonday.range;
  var utcTuesdays = utcTuesday.range;
  var utcWednesdays = utcWednesday.range;
  var utcThursdays = utcThursday.range;
  var utcFridays = utcFriday.range;
  var utcSaturdays = utcSaturday.range;
  var utcWeeks = utcSunday.range;
  var utcMonths = utcMonth.range;
  var utcYears = utcYear.range;

  var version = "0.1.1";

  exports.version = version;
  exports.milliseconds = milliseconds;
  exports.seconds = seconds;
  exports.minutes = minutes;
  exports.hours = hours;
  exports.days = days;
  exports.sundays = sundays;
  exports.mondays = mondays;
  exports.tuesdays = tuesdays;
  exports.wednesdays = wednesdays;
  exports.thursdays = thursdays;
  exports.fridays = fridays;
  exports.saturdays = saturdays;
  exports.weeks = weeks;
  exports.months = months;
  exports.years = years;
  exports.utcMillisecond = utcMillisecond;
  exports.utcMilliseconds = utcMilliseconds;
  exports.utcSeconds = utcSeconds;
  exports.utcMinutes = utcMinutes;
  exports.utcHours = utcHours;
  exports.utcDays = utcDays;
  exports.utcSundays = utcSundays;
  exports.utcMondays = utcMondays;
  exports.utcTuesdays = utcTuesdays;
  exports.utcWednesdays = utcWednesdays;
  exports.utcThursdays = utcThursdays;
  exports.utcFridays = utcFridays;
  exports.utcSaturdays = utcSaturdays;
  exports.utcWeeks = utcWeeks;
  exports.utcMonths = utcMonths;
  exports.utcYears = utcYears;
  exports.millisecond = millisecond;
  exports.second = second;
  exports.minute = minute;
  exports.hour = hour;
  exports.day = day;
  exports.sunday = sunday;
  exports.monday = monday;
  exports.tuesday = tuesday;
  exports.wednesday = wednesday;
  exports.thursday = thursday;
  exports.friday = friday;
  exports.saturday = saturday;
  exports.week = sunday;
  exports.month = month;
  exports.year = year;
  exports.utcSecond = utcSecond;
  exports.utcMinute = utcMinute;
  exports.utcHour = utcHour;
  exports.utcDay = utcDay;
  exports.utcSunday = utcSunday;
  exports.utcMonday = utcMonday;
  exports.utcTuesday = utcTuesday;
  exports.utcWednesday = utcWednesday;
  exports.utcThursday = utcThursday;
  exports.utcFriday = utcFriday;
  exports.utcSaturday = utcSaturday;
  exports.utcWeek = utcSunday;
  exports.utcMonth = utcMonth;
  exports.utcYear = utcYear;
  exports.interval = newInterval;

}));
},{}],40:[function(require,module,exports){
var util = require('../util'),
    time = require('../time'),
    EPSILON = 1e-15;

function bins(opt) {
  if (!opt) { throw Error("Missing binning options."); }

  // determine range
  var maxb = opt.maxbins || 15,
      base = opt.base || 10,
      logb = Math.log(base),
      div = opt.div || [5, 2],
      min = opt.min,
      max = opt.max,
      span = max - min,
      step, level, minstep, precision, v, i, eps;

  if (opt.step) {
    // if step size is explicitly given, use that
    step = opt.step;
  } else if (opt.steps) {
    // if provided, limit choice to acceptable step sizes
    step = opt.steps[Math.min(
      opt.steps.length - 1,
      bisect(opt.steps, span/maxb, 0, opt.steps.length)
    )];
  } else {
    // else use span to determine step size
    level = Math.ceil(Math.log(maxb) / logb);
    minstep = opt.minstep || 0;
    step = Math.max(
      minstep,
      Math.pow(base, Math.round(Math.log(span) / logb) - level)
    );

    // increase step size if too many bins
    while (Math.ceil(span/step) > maxb) { step *= base; }

    // decrease step size if allowed
    for (i=0; i<div.length; ++i) {
      v = step / div[i];
      if (v >= minstep && span / v <= maxb) step = v;
    }
  }

  // update precision, min and max
  v = Math.log(step);
  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  eps = Math.pow(base, -precision - 1);
  min = Math.min(min, Math.floor(min / step + eps) * step);
  max = Math.ceil(max / step) * step;

  return {
    start: min,
    stop:  max,
    step:  step,
    unit:  {precision: precision},
    value: value,
    index: index
  };
}

function bisect(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
    else { hi = mid; }
  }
  return lo;
}

function value(v) {
  return this.step * Math.floor(v / this.step + EPSILON);
}

function index(v) {
  return Math.floor((v - this.start) / this.step + EPSILON);
}

function date_value(v) {
  return this.unit.date(value.call(this, v));
}

function date_index(v) {
  return index.call(this, this.unit.unit(v));
}

bins.date = function(opt) {
  if (!opt) { throw Error("Missing date binning options."); }

  // find time step, then bin
  var units = opt.utc ? time.utc : time,
      dmin = opt.min,
      dmax = opt.max,
      maxb = opt.maxbins || 20,
      minb = opt.minbins || 4,
      span = (+dmax) - (+dmin),
      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
      spec = bins({
        min:     unit.min != null ? unit.min : unit.unit(dmin),
        max:     unit.max != null ? unit.max : unit.unit(dmax),
        maxbins: maxb,
        minstep: unit.minstep,
        steps:   unit.step
      });

  spec.unit = unit;
  spec.index = date_index;
  if (!opt.raw) spec.value = date_value;
  return spec;
};

module.exports = bins;

},{"../time":44,"../util":45}],41:[function(require,module,exports){
var util = require('./util'),
    gen = module.exports;

gen.repeat = function(val, n) {
  var a = Array(n), i;
  for (i=0; i<n; ++i) a[i] = val;
  return a;
};

gen.zeros = function(n) {
  return gen.repeat(0, n);
};

gen.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error('Infinite range');
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
};

gen.random = {};

gen.random.uniform = function(min, max) {
  if (max === undefined) {
    max = min === undefined ? 1 : min;
    min = 0;
  }
  var d = max - min;
  var f = function() {
    return min + d * Math.random();
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    return (x >= min && x <= max) ? 1/d : 0;
  };
  f.cdf = function(x) {
    return x < min ? 0 : x > max ? 1 : (x - min) / d;
  };
  f.icdf = function(p) {
    return (p >= 0 && p <= 1) ? min + p*d : NaN;
  };
  return f;
};

gen.random.integer = function(a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }
  var d = b - a;
  var f = function() {
    return a + Math.floor(d * Math.random());
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    return (x === Math.floor(x) && x >= a && x < b) ? 1/d : 0;
  };
  f.cdf = function(x) {
    var v = Math.floor(x);
    return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
  };
  f.icdf = function(p) {
    return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p*d) : NaN;
  };
  return f;
};

gen.random.normal = function(mean, stdev) {
  mean = mean || 0;
  stdev = stdev || 1;
  var next;
  var f = function() {
    var x = 0, y = 0, rds, c;
    if (next !== undefined) {
      x = next;
      next = undefined;
      return x;
    }
    do {
      x = Math.random()*2-1;
      y = Math.random()*2-1;
      rds = x*x + y*y;
    } while (rds === 0 || rds > 1);
    c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
    next = mean + y*c*stdev;
    return mean + x*c*stdev;
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  f.pdf = function(x) {
    var exp = Math.exp(Math.pow(x-mean, 2) / (-2 * Math.pow(stdev, 2)));
    return (1 / (stdev * Math.sqrt(2*Math.PI))) * exp;
  };
  f.cdf = function(x) {
    // Approximation from West (2009)
    // Better Approximations to Cumulative Normal Functions
    var cd,
        z = (x - mean) / stdev,
        Z = Math.abs(z);
    if (Z > 37) {
      cd = 0;
    } else {
      var sum, exp = Math.exp(-Z*Z/2);
      if (Z < 7.07106781186547) {
        sum = 3.52624965998911e-02 * Z + 0.700383064443688;
        sum = sum * Z + 6.37396220353165;
        sum = sum * Z + 33.912866078383;
        sum = sum * Z + 112.079291497871;
        sum = sum * Z + 221.213596169931;
        sum = sum * Z + 220.206867912376;
        cd = exp * sum;
        sum = 8.83883476483184e-02 * Z + 1.75566716318264;
        sum = sum * Z + 16.064177579207;
        sum = sum * Z + 86.7807322029461;
        sum = sum * Z + 296.564248779674;
        sum = sum * Z + 637.333633378831;
        sum = sum * Z + 793.826512519948;
        sum = sum * Z + 440.413735824752;
        cd = cd / sum;
      } else {
        sum = Z + 0.65;
        sum = Z + 4 / sum;
        sum = Z + 3 / sum;
        sum = Z + 2 / sum;
        sum = Z + 1 / sum;
        cd = exp / sum / 2.506628274631;
      }
    }
    return z > 0 ? 1 - cd : cd;
  };
  f.icdf = function(p) {
    // Approximation of Probit function using inverse error function.
    if (p <= 0 || p >= 1) return NaN;
    var x = 2*p - 1,
        v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
        a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
        b = Math.log(1 - (x*x)) / v,
        s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
    return mean + stdev * Math.SQRT2 * s;
  };
  return f;
};

gen.random.bootstrap = function(domain, smooth) {
  // Generates a bootstrap sample from a set of observations.
  // Smooth bootstrapping adds random zero-centered noise to the samples.
  var val = domain.filter(util.isValid),
      len = val.length,
      err = smooth ? gen.random.normal(0, smooth) : null;
  var f = function() {
    return val[~~(Math.random()*len)] + (err ? err() : 0);
  };
  f.samples = function(n) {
    return gen.zeros(n).map(f);
  };
  return f;
};
},{"./util":45}],42:[function(require,module,exports){
var util = require('../util');

var TYPES = '__types__';

var PARSERS = {
  boolean: util.boolean,
  integer: util.number,
  number:  util.number,
  date:    util.date,
  string:  function(x) { return x == null || x === '' ? null : x + ''; }
};

var TESTS = {
  boolean: function(x) { return x==='true' || x==='false' || util.isBoolean(x); },
  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
  number: function(x) { return !isNaN(+x) && !util.isDate(x); },
  date: function(x) { return !isNaN(Date.parse(x)); }
};

function annotation(data, types) {
  if (!types) return data && data[TYPES] || null;
  data[TYPES] = types;
}

function fieldNames(datum) {
  return util.keys(datum);
}

function bracket(fieldName) {
  return '[' + fieldName + ']';
}

function type(values, f) {
  values = util.array(values);
  f = util.$(f);
  var v, i, n;

  // if data array has type annotations, use them
  if (values[TYPES]) {
    v = f(values[TYPES]);
    if (util.isString(v)) return v;
  }

  for (i=0, n=values.length; !util.isValid(v) && i<n; ++i) {
    v = f ? f(values[i]) : values[i];
  }

  return util.isDate(v) ? 'date' :
    util.isNumber(v)    ? 'number' :
    util.isBoolean(v)   ? 'boolean' :
    util.isString(v)    ? 'string' : null;
}

function typeAll(data, fields) {
  if (!data.length) return;
  var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
  return fields.reduce(function(types, f) {
    return (types[f] = type(data, get(f)), types);
  }, {});
}

function infer(values, f) {
  values = util.array(values);
  f = util.$(f);
  var i, j, v;

  // types to test for, in precedence order
  var types = ['boolean', 'integer', 'number', 'date'];

  for (i=0; i<values.length; ++i) {
    // get next value to test
    v = f ? f(values[i]) : values[i];
    // test value against remaining types
    for (j=0; j<types.length; ++j) {
      if (util.isValid(v) && !TESTS[types[j]](v)) {
        types.splice(j, 1);
        j -= 1;
      }
    }
    // if no types left, return 'string'
    if (types.length === 0) return 'string';
  }

  return types[0];
}

function inferAll(data, fields) {
  var get = fields ? util.identity : (fields = fieldNames(data[0]), bracket);
  return fields.reduce(function(types, f) {
    types[f] = infer(data, get(f));
    return types;
  }, {});
}

type.annotation = annotation;
type.all = typeAll;
type.infer = infer;
type.inferAll = inferAll;
type.parsers = PARSERS;
module.exports = type;

},{"../util":45}],43:[function(require,module,exports){
var util = require('./util');
var type = require('./import/type');
var gen = require('./generate');

var stats = module.exports;

// Collect unique values.
// Output: an array of unique values, in first-observed order
stats.unique = function(values, f, results) {
  f = util.$(f);
  results = results || [];
  var u = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    results.push(v);
  }
  return results;
};

// Return the length of the input array.
stats.count = function(values) {
  return values && values.length || 0;
};

// Count the number of non-null, non-undefined, non-NaN values.
stats.count.valid = function(values, f) {
  f = util.$(f);
  var v, i, n, valid = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) valid += 1;
  }
  return valid;
};

// Count the number of null or undefined values.
stats.count.missing = function(values, f) {
  f = util.$(f);
  var v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v == null) count += 1;
  }
  return count;
};

// Count the number of distinct values.
// Null, undefined and NaN are each considered distinct values.
stats.count.distinct = function(values, f) {
  f = util.$(f);
  var u = {}, v, i, n, count = 0;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (v in u) continue;
    u[v] = 1;
    count += 1;
  }
  return count;
};

// Construct a map from distinct values to occurrence counts.
stats.count.map = function(values, f) {
  f = util.$(f);
  var map = {}, v, i, n;
  for (i=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    map[v] = (v in map) ? map[v] + 1 : 1;
  }
  return map;
};

// Compute the median of an array of numbers.
stats.median = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  return stats.quantile(values, 0.5);
};

// Computes the quartile boundaries of an array of numbers.
stats.quartile = function(values, f) {
  if (f) values = values.map(util.$(f));
  values = values.filter(util.isValid).sort(util.cmp);
  var q = stats.quantile;
  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
};

// Compute the quantile of a sorted array of numbers.
// Adapted from the D3.js implementation.
stats.quantile = function(values, f, p) {
  if (p === undefined) { p = f; f = util.identity; }
  f = util.$(f);
  var H = (values.length - 1) * p + 1,
      h = Math.floor(H),
      v = +f(values[h - 1]),
      e = H - h;
  return e ? v + e * (f(values[h]) - v) : v;
};

// Compute the sum of an array of numbers.
stats.sum = function(values, f) {
  f = util.$(f);
  for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) sum += v;
  }
  return sum;
};

// Compute the mean (average) of an array of numbers.
stats.mean = function(values, f) {
  f = util.$(f);
  var mean = 0, delta, i, n, c, v;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
    }
  }
  return mean;
};

// Compute the geometric mean of an array of numbers.
stats.mean.geometric = function(values, f) {
  f = util.$(f);
  var mean = 1, c, n, v, i;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v <= 0) {
        throw Error("Geometric mean only defined for positive values.");
      }
      mean *= v;
      ++c;
    }
  }
  mean = c > 0 ? Math.pow(mean, 1/c) : 0;
  return mean;
};

// Compute the harmonic mean of an array of numbers.
stats.mean.harmonic = function(values, f) {
  f = util.$(f);
  var mean = 0, c, n, v, i;
  for (i=0, c=0, n=values.length; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      mean += 1/v;
      ++c;
    }
  }
  return c / mean;
};

// Compute the sample variance of an array of numbers.
stats.variance = function(values, f) {
  f = util.$(f);
  if (!util.isArray(values) || values.length < 2) return 0;
  var mean = 0, M2 = 0, delta, i, c, v;
  for (i=0, c=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      delta = v - mean;
      mean = mean + delta / (++c);
      M2 = M2 + delta * (v - mean);
    }
  }
  M2 = M2 / (c - 1);
  return M2;
};

// Compute the sample standard deviation of an array of numbers.
stats.stdev = function(values, f) {
  return Math.sqrt(stats.variance(values, f));
};

// Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
stats.modeskew = function(values, f) {
  var avg = stats.mean(values, f),
      med = stats.median(values, f),
      std = stats.stdev(values, f);
  return std === 0 ? 0 : (avg - med) / std;
};

// Find the minimum value in an array.
stats.min = function(values, f) {
  return stats.extent(values, f)[0];
};

// Find the maximum value in an array.
stats.max = function(values, f) {
  return stats.extent(values, f)[1];
};

// Find the minimum and maximum of an array of values.
stats.extent = function(values, f) {
  f = util.$(f);
  var a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) a = v;
      if (v > b) b = v;
    }
  }
  return [a, b];
};

// Find the integer indices of the minimum and maximum values.
stats.extent.index = function(values, f) {
  f = util.$(f);
  var x = -1, y = -1, a, b, v, i, n = values.length;
  for (i=0; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) { a = b = v; x = y = i; break; }
  }
  for (; i<n; ++i) {
    v = f ? f(values[i]) : values[i];
    if (util.isValid(v)) {
      if (v < a) { a = v; x = i; }
      if (v > b) { b = v; y = i; }
    }
  }
  return [x, y];
};

// Compute the dot product of two arrays of numbers.
stats.dot = function(values, a, b) {
  var sum = 0, i, v;
  if (!b) {
    if (values.length !== a.length) {
      throw Error('Array lengths must match.');
    }
    for (i=0; i<values.length; ++i) {
      v = values[i] * a[i];
      if (v === v) sum += v;
    }
  } else {
    a = util.$(a);
    b = util.$(b);
    for (i=0; i<values.length; ++i) {
      v = a(values[i]) * b(values[i]);
      if (v === v) sum += v;
    }
  }
  return sum;
};

// Compute the vector distance between two arrays of numbers.
// Default is Euclidean (exp=2) distance, configurable via exp argument.
stats.dist = function(values, a, b, exp) {
  var f = util.isFunction(b) || util.isString(b),
      X = values,
      Y = f ? values : a,
      e = f ? exp : b,
      L2 = e === 2 || e == null,
      n = values.length, s = 0, d, i;
  if (f) {
    a = util.$(a);
    b = util.$(b);
  }
  for (i=0; i<n; ++i) {
    d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
    s += L2 ? d*d : Math.pow(Math.abs(d), e);
  }
  return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
};

// Compute the Cohen's d effect size between two arrays of numbers.
stats.cohensd = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      x1 = stats.mean(X),
      x2 = stats.mean(Y),
      n1 = stats.count.valid(X),
      n2 = stats.count.valid(Y);

  if ((n1+n2-2) <= 0) {
    // if both arrays are size 1, or one is empty, there's no effect size
    return 0;
  }
  // pool standard deviation
  var s1 = stats.variance(X),
      s2 = stats.variance(Y),
      s = Math.sqrt((((n1-1)*s1) + ((n2-1)*s2)) / (n1+n2-2));
  // if there is no variance, there's no effect size
  return s===0 ? 0 : (x1 - x2) / s;
};

// Computes the covariance between two arrays of numbers
stats.covariance = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n = X.length,
      xm = stats.mean(X),
      ym = stats.mean(Y),
      sum = 0, c = 0, i, x, y, vx, vy;

  if (n !== Y.length) {
    throw Error('Input lengths must match.');
  }

  for (i=0; i<n; ++i) {
    x = X[i]; vx = util.isValid(x);
    y = Y[i]; vy = util.isValid(y);
    if (vx && vy) {
      sum += (x-xm) * (y-ym);
      ++c;
    } else if (vx || vy) {
      throw Error('Valid values must align.');
    }
  }
  return sum / (c-1);
};

// Compute ascending rank scores for an array of values.
// Ties are assigned their collective mean rank.
stats.rank = function(values, f) {
  f = util.$(f) || util.identity;
  var a = values.map(function(v, i) {
      return {idx: i, val: f(v)};
    })
    .sort(util.comparator('val'));

  var n = values.length,
      r = Array(n),
      tie = -1, p = {}, i, v, mu;

  for (i=0; i<n; ++i) {
    v = a[i].val;
    if (tie < 0 && p === v) {
      tie = i - 1;
    } else if (tie > -1 && p !== v) {
      mu = 1 + (i-1 + tie) / 2;
      for (; tie<i; ++tie) r[a[tie].idx] = mu;
      tie = -1;
    }
    r[a[i].idx] = i + 1;
    p = v;
  }

  if (tie > -1) {
    mu = 1 + (n-1 + tie) / 2;
    for (; tie<n; ++tie) r[a[tie].idx] = mu;
  }

  return r;
};

// Compute the sample Pearson product-moment correlation of two arrays of numbers.
stats.cor = function(values, a, b) {
  var fn = b;
  b = fn ? values.map(util.$(b)) : a;
  a = fn ? values.map(util.$(a)) : values;

  var dot = stats.dot(a, b),
      mua = stats.mean(a),
      mub = stats.mean(b),
      sda = stats.stdev(a),
      sdb = stats.stdev(b),
      n = values.length;

  return (dot - n*mua*mub) / ((n-1) * sda * sdb);
};

// Compute the Spearman rank correlation of two arrays of values.
stats.cor.rank = function(values, a, b) {
  var ra = b ? stats.rank(values, a) : stats.rank(values),
      rb = b ? stats.rank(values, b) : stats.rank(a),
      n = values.length, i, s, d;

  for (i=0, s=0; i<n; ++i) {
    d = ra[i] - rb[i];
    s += d * d;
  }

  return 1 - 6*s / (n * (n*n-1));
};

// Compute the distance correlation of two arrays of numbers.
// http://en.wikipedia.org/wiki/Distance_correlation
stats.cor.dist = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a;

  var A = stats.dist.mat(X),
      B = stats.dist.mat(Y),
      n = A.length,
      i, aa, bb, ab;

  for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
    aa += A[i]*A[i];
    bb += B[i]*B[i];
    ab += A[i]*B[i];
  }

  return Math.sqrt(ab / Math.sqrt(aa*bb));
};

// Simple linear regression.
// Returns a "fit" object with slope (m), intercept (b),
// r value (R), and sum-squared residual error (rss).
stats.linearRegression = function(values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n = X.length,
      xy = stats.covariance(X, Y), // will throw err if valid vals don't align
      sx = stats.stdev(X),
      sy = stats.stdev(Y),
      slope = xy / (sx*sx),
      icept = stats.mean(Y) - slope * stats.mean(X),
      fit = {slope: slope, intercept: icept, R: xy / (sx*sy), rss: 0},
      res, i;

  for (i=0; i<n; ++i) {
    if (util.isValid(X[i]) && util.isValid(Y[i])) {
      res = (slope*X[i] + icept) - Y[i];
      fit.rss += res * res;
    }
  }

  return fit;
};

// Namespace for bootstrap
stats.bootstrap = {};

// Construct a bootstrapped confidence interval at a given percentile level
// Arguments are an array, an optional n (defaults to 1000),
//  an optional alpha (defaults to 0.05), and an optional smoothing parameter
stats.bootstrap.ci = function(values, a, b, c, d) {
  var X, N, alpha, smooth, bs, means, i;
  if (util.isFunction(a) || util.isString(a)) {
    X = values.map(util.$(a));
    N = b;
    alpha = c;
    smooth = d;
  } else {
    X = values;
    N = a;
    alpha = b;
    smooth = c;
  }
  N = N ? +N : 1000;
  alpha = alpha || 0.05;

  bs = gen.random.bootstrap(X, smooth);
  for (i=0, means = Array(N); i<N; ++i) {
    means[i] = stats.mean(bs.samples(X.length));
  }
  means.sort(util.numcmp);
  return [
    stats.quantile(means, alpha/2),
    stats.quantile(means, 1-(alpha/2))
  ];
};

// Namespace for z-tests
stats.z = {};

// Construct a z-confidence interval at a given significance level
// Arguments are an array and an optional alpha (defaults to 0.05).
stats.z.ci = function(values, a, b) {
  var X = values, alpha = a;
  if (util.isFunction(a) || util.isString(a)) {
    X = values.map(util.$(a));
    alpha = b;
  }
  alpha = alpha || 0.05;

  var z = alpha===0.05 ? 1.96 : gen.random.normal(0, 1).icdf(1-(alpha/2)),
      mu = stats.mean(X),
      SE = stats.stdev(X) / Math.sqrt(stats.count.valid(X));
  return [mu - (z*SE), mu + (z*SE)];
};

// Perform a z-test of means. Returns the p-value.
// If a single array is provided, performs a one-sample location test.
// If two arrays or a table and two accessors are provided, performs
// a two-sample location test. A paired test is performed if specified
// by the options hash.
// The options hash format is: {paired: boolean, nullh: number}.
// http://en.wikipedia.org/wiki/Z-test
// http://en.wikipedia.org/wiki/Paired_difference_test
stats.z.test = function(values, a, b, opt) {
  if (util.isFunction(b) || util.isString(b)) { // table and accessors
    return (opt && opt.paired ? ztestP : ztest2)(opt, values, a, b);
  } else if (util.isArray(a)) { // two arrays
    return (b && b.paired ? ztestP : ztest2)(b, values, a);
  } else if (util.isFunction(a) || util.isString(a)) {
    return ztest1(b, values, a); // table and accessor
  } else {
    return ztest1(a, values); // one array
  }
};

// Perform a z-test of means. Returns the p-value.
// Assuming we have a list of values, and a null hypothesis. If no null
// hypothesis, assume our null hypothesis is mu=0.
function ztest1(opt, X, f) {
  var nullH = opt && opt.nullh || 0,
      gaussian = gen.random.normal(0, 1),
      mu = stats.mean(X,f),
      SE = stats.stdev(X,f) / Math.sqrt(stats.count.valid(X,f));

  if (SE===0) {
    // Test not well defined when standard error is 0.
    return (mu - nullH) === 0 ? 1 : 0;
  }
  // Two-sided, so twice the one-sided cdf.
  var z = (mu - nullH) / SE;
  return 2 * gaussian.cdf(-Math.abs(z));
}

// Perform a two sample paired z-test of means. Returns the p-value.
function ztestP(opt, values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n1 = stats.count(X),
      n2 = stats.count(Y),
      diffs = Array(), i;

  if (n1 !== n2) {
    throw Error('Array lengths must match.');
  }
  for (i=0; i<n1; ++i) {
    // Only valid differences should contribute to the test statistic
    if (util.isValid(X[i]) && util.isValid(Y[i])) {
      diffs.push(X[i] - Y[i]);
    }
  }
  return stats.z.test(diffs, opt && opt.nullh || 0);
}

// Perform a two sample z-test of means. Returns the p-value.
function ztest2(opt, values, a, b) {
  var X = b ? values.map(util.$(a)) : values,
      Y = b ? values.map(util.$(b)) : a,
      n1 = stats.count.valid(X),
      n2 = stats.count.valid(Y),
      gaussian = gen.random.normal(0, 1),
      meanDiff = stats.mean(X) - stats.mean(Y) - (opt && opt.nullh || 0),
      SE = Math.sqrt(stats.variance(X)/n1 + stats.variance(Y)/n2);

  if (SE===0) {
    // Not well defined when pooled standard error is 0.
    return meanDiff===0 ? 1 : 0;
  }
  // Two-tailed, so twice the one-sided cdf.
  var z = meanDiff / SE;
  return 2 * gaussian.cdf(-Math.abs(z));
}

// Construct a mean-centered distance matrix for an array of numbers.
stats.dist.mat = function(X) {
  var n = X.length,
      m = n*n,
      A = Array(m),
      R = gen.zeros(n),
      M = 0, v, i, j;

  for (i=0; i<n; ++i) {
    A[i*n+i] = 0;
    for (j=i+1; j<n; ++j) {
      A[i*n+j] = (v = Math.abs(X[i] - X[j]));
      A[j*n+i] = v;
      R[i] += v;
      R[j] += v;
    }
  }

  for (i=0; i<n; ++i) {
    M += R[i];
    R[i] /= n;
  }
  M /= m;

  for (i=0; i<n; ++i) {
    for (j=i; j<n; ++j) {
      A[i*n+j] += M - R[i] - R[j];
      A[j*n+i] = A[i*n+j];
    }
  }

  return A;
};

// Compute the Shannon entropy (log base 2) of an array of counts.
stats.entropy = function(counts, f) {
  f = util.$(f);
  var i, p, s = 0, H = 0, n = counts.length;
  for (i=0; i<n; ++i) {
    s += (f ? f(counts[i]) : counts[i]);
  }
  if (s === 0) return 0;
  for (i=0; i<n; ++i) {
    p = (f ? f(counts[i]) : counts[i]) / s;
    if (p) H += p * Math.log(p);
  }
  return -H / Math.LN2;
};

// Compute the mutual information between two discrete variables.
// Returns an array of the form [MI, MI_distance]
// MI_distance is defined as 1 - I(a,b) / H(a,b).
// http://en.wikipedia.org/wiki/Mutual_information
stats.mutual = function(values, a, b, counts) {
  var x = counts ? values.map(util.$(a)) : values,
      y = counts ? values.map(util.$(b)) : a,
      z = counts ? values.map(util.$(counts)) : b;

  var px = {},
      py = {},
      n = z.length,
      s = 0, I = 0, H = 0, p, t, i;

  for (i=0; i<n; ++i) {
    px[x[i]] = 0;
    py[y[i]] = 0;
  }

  for (i=0; i<n; ++i) {
    px[x[i]] += z[i];
    py[y[i]] += z[i];
    s += z[i];
  }

  t = 1 / (s * Math.LN2);
  for (i=0; i<n; ++i) {
    if (z[i] === 0) continue;
    p = (s * z[i]) / (px[x[i]] * py[y[i]]);
    I += z[i] * t * Math.log(p);
    H += z[i] * t * Math.log(z[i]/s);
  }

  return [I, 1 + I/H];
};

// Compute the mutual information between two discrete variables.
stats.mutual.info = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[0];
};

// Compute the mutual information distance between two discrete variables.
// MI_distance is defined as 1 - I(a,b) / H(a,b).
stats.mutual.dist = function(values, a, b, counts) {
  return stats.mutual(values, a, b, counts)[1];
};

// Compute a profile of summary statistics for a variable.
stats.profile = function(values, f) {
  var mean = 0,
      valid = 0,
      missing = 0,
      distinct = 0,
      min = null,
      max = null,
      M2 = 0,
      vals = [],
      u = {}, delta, sd, i, v, x;

  // compute summary stats
  for (i=0; i<values.length; ++i) {
    v = f ? f(values[i]) : values[i];

    // update unique values
    u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);

    if (v == null) {
      ++missing;
    } else if (util.isValid(v)) {
      // update stats
      x = (typeof v === 'string') ? v.length : v;
      if (min===null || x < min) min = x;
      if (max===null || x > max) max = x;
      delta = x - mean;
      mean = mean + delta / (++valid);
      M2 = M2 + delta * (x - mean);
      vals.push(x);
    }
  }
  M2 = M2 / (valid - 1);
  sd = Math.sqrt(M2);

  // sort values for median and iqr
  vals.sort(util.cmp);

  return {
    type:     type(values, f),
    unique:   u,
    count:    values.length,
    valid:    valid,
    missing:  missing,
    distinct: distinct,
    min:      min,
    max:      max,
    mean:     mean,
    stdev:    sd,
    median:   (v = stats.quantile(vals, 0.5)),
    q1:       stats.quantile(vals, 0.25),
    q3:       stats.quantile(vals, 0.75),
    modeskew: sd === 0 ? 0 : (mean - v) / sd
  };
};

// Compute profiles for all variables in a data set.
stats.summary = function(data, fields) {
  fields = fields || util.keys(data[0]);
  var s = fields.map(function(f) {
    var p = stats.profile(data, util.$(f));
    return (p.field = f, p);
  });
  return (s.__summary__ = true, s);
};

},{"./generate":41,"./import/type":42,"./util":45}],44:[function(require,module,exports){
var d3_time = require('d3-time');

var tempDate = new Date(),
    baseDate = new Date(0, 0, 1).setFullYear(0), // Jan 1, 0 AD
    utcBaseDate = new Date(Date.UTC(0, 0, 1)).setUTCFullYear(0);

function date(d) {
  return (tempDate.setTime(+d), tempDate);
}

// create a time unit entry
function entry(type, date, unit, step, min, max) {
  var e = {
    type: type,
    date: date,
    unit: unit
  };
  if (step) {
    e.step = step;
  } else {
    e.minstep = 1;
  }
  if (min != null) e.min = min;
  if (max != null) e.max = max;
  return e;
}

function create(type, unit, base, step, min, max) {
  return entry(type,
    function(d) { return unit.offset(base, d); },
    function(d) { return unit.count(base, d); },
    step, min, max);
}

var locale = [
  create('second', d3_time.second, baseDate),
  create('minute', d3_time.minute, baseDate),
  create('hour',   d3_time.hour,   baseDate),
  create('day',    d3_time.day,    baseDate, [1, 7]),
  create('month',  d3_time.month,  baseDate, [1, 3, 6]),
  create('year',   d3_time.year,   baseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(1970, 0, 1, 0, 0, d); },
    function(d) { return date(d).getSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(1970, 0, 1, 0, d); },
    function(d) { return date(d).getMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(1970, 0, 1, d); },
    function(d) { return date(d).getHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(1970, 0, 4+d); },
    function(d) { return date(d).getDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(1970, 0, d); },
    function(d) { return date(d).getDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(1970, d % 12, 1); },
    function(d) { return date(d).getMonth(); },
    [1], 0, 11
  )
];

var utc = [
  create('second', d3_time.utcSecond, utcBaseDate),
  create('minute', d3_time.utcMinute, utcBaseDate),
  create('hour',   d3_time.utcHour,   utcBaseDate),
  create('day',    d3_time.utcDay,    utcBaseDate, [1, 7]),
  create('month',  d3_time.utcMonth,  utcBaseDate, [1, 3, 6]),
  create('year',   d3_time.utcYear,   utcBaseDate),

  // periodic units
  entry('seconds',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
    function(d) { return date(d).getUTCSeconds(); },
    null, 0, 59
  ),
  entry('minutes',
    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
    function(d) { return date(d).getUTCMinutes(); },
    null, 0, 59
  ),
  entry('hours',
    function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
    function(d) { return date(d).getUTCHours(); },
    null, 0, 23
  ),
  entry('weekdays',
    function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
    function(d) { return date(d).getUTCDay(); },
    [1], 0, 6
  ),
  entry('dates',
    function(d) { return new Date(Date.UTC(1970, 0, d)); },
    function(d) { return date(d).getUTCDate(); },
    [1], 1, 31
  ),
  entry('months',
    function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
    function(d) { return date(d).getUTCMonth(); },
    [1], 0, 11
  )
];

var STEPS = [
  [31536e6, 5],  // 1-year
  [7776e6, 4],   // 3-month
  [2592e6, 4],   // 1-month
  [12096e5, 3],  // 2-week
  [6048e5, 3],   // 1-week
  [1728e5, 3],   // 2-day
  [864e5, 3],    // 1-day
  [432e5, 2],    // 12-hour
  [216e5, 2],    // 6-hour
  [108e5, 2],    // 3-hour
  [36e5, 2],     // 1-hour
  [18e5, 1],     // 30-minute
  [9e5, 1],      // 15-minute
  [3e5, 1],      // 5-minute
  [6e4, 1],      // 1-minute
  [3e4, 0],      // 30-second
  [15e3, 0],     // 15-second
  [5e3, 0],      // 5-second
  [1e3, 0]       // 1-second
];

function find(units, span, minb, maxb) {
  var step = STEPS[0], i, n, bins;

  for (i=1, n=STEPS.length; i<n; ++i) {
    step = STEPS[i];
    if (span > step[0]) {
      bins = span / step[0];
      if (bins > maxb) {
        return units[STEPS[i-1][1]];
      }
      if (bins >= minb) {
        return units[step[1]];
      }
    }
  }
  return units[STEPS[n-1][1]];
}

function toUnitMap(units) {
  var map = {}, i, n;
  for (i=0, n=units.length; i<n; ++i) {
    map[units[i].type] = units[i];
  }
  map.find = function(span, minb, maxb) {
    return find(units, span, minb, maxb);
  };
  return map;
}

module.exports = toUnitMap(locale);
module.exports.utc = toUnitMap(utc);
},{"d3-time":39}],45:[function(require,module,exports){
(function (Buffer){
var u = module.exports;

// utility functions

var FNAME = '__name__';

u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };

u.name = function(f) { return f==null ? null : f[FNAME]; };

u.identity = function(x) { return x; };

u.true = u.namedfunc('true', function() { return true; });

u.false = u.namedfunc('false', function() { return false; });

u.duplicate = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

u.equal = function(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

u.extend = function(obj) {
  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (name in x) { obj[name] = x[name]; }
  }
  return obj;
};

u.length = function(x) {
  return x != null && x.length != null ? x.length : null;
};

u.keys = function(x) {
  var keys = [], k;
  for (k in x) keys.push(k);
  return keys;
};

u.vals = function(x) {
  var vals = [], k;
  for (k in x) vals.push(x[k]);
  return vals;
};

u.toMap = function(list, f) {
  return (f = u.$(f)) ?
    list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
    list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
};

u.keystr = function(values) {
  // use to ensure consistent key generation across modules
  var n = values.length;
  if (!n) return '';
  for (var s=String(values[0]), i=1; i<n; ++i) {
    s += '|' + String(values[i]);
  }
  return s;
};

// type checking functions

var toString = Object.prototype.toString;

u.isObject = function(obj) {
  return obj === Object(obj);
};

u.isFunction = function(obj) {
  return toString.call(obj) === '[object Function]';
};

u.isString = function(obj) {
  return typeof value === 'string' || toString.call(obj) === '[object String]';
};

u.isArray = Array.isArray || function(obj) {
  return toString.call(obj) === '[object Array]';
};

u.isNumber = function(obj) {
  return typeof obj === 'number' || toString.call(obj) === '[object Number]';
};

u.isBoolean = function(obj) {
  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
};

u.isDate = function(obj) {
  return toString.call(obj) === '[object Date]';
};

u.isValid = function(obj) {
  return obj != null && obj === obj;
};

u.isBuffer = (typeof Buffer === 'function' && Buffer.isBuffer) || u.false;

// type coercion functions

u.number = function(s) {
  return s == null || s === '' ? null : +s;
};

u.boolean = function(s) {
  return s == null || s === '' ? null : s==='false' ? false : !!s;
};

// parse a date with optional d3.time-format format
u.date = function(s, format) {
  var d = format ? format : Date;
  return s == null || s === '' ? null : d.parse(s);
};

u.array = function(x) {
  return x != null ? (u.isArray(x) ? x : [x]) : [];
};

u.str = function(x) {
  return u.isArray(x) ? '[' + x.map(u.str) + ']'
    : u.isObject(x) || u.isString(x) ?
      // Output valid JSON and JS source strings.
      // See http://timelessrepo.com/json-isnt-a-javascript-subset
      JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
    : x;
};

// data access functions

var field_re = /\[(.*?)\]|[^.\[]+/g;

u.field = function(f) {
  return String(f).match(field_re).map(function(d) {
    return d[0] !== '[' ? d :
      d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
      d.slice(2, -2).replace(/\\(["'])/g, '$1');
  });
};

u.accessor = function(f) {
  /* jshint evil: true */
  return f==null || u.isFunction(f) ? f :
    u.namedfunc(f, Function('x', 'return x[' + u.field(f).map(u.str).join('][') + '];'));
};

// short-cut for accessor
u.$ = u.accessor;

u.mutator = function(f) {
  var s;
  return u.isString(f) && (s=u.field(f)).length > 1 ?
    function(x, v) {
      for (var i=0; i<s.length-1; ++i) x = x[s[i]];
      x[s[i]] = v;
    } :
    function(x, v) { x[f] = v; };
};


u.$func = function(name, op) {
  return function(f) {
    f = u.$(f) || u.identity;
    var n = name + (u.name(f) ? '_'+u.name(f) : '');
    return u.namedfunc(n, function(d) { return op(f(d)); });
  };
};

u.$valid  = u.$func('valid', u.isValid);
u.$length = u.$func('length', u.length);

u.$in = function(f, values) {
  f = u.$(f);
  var map = u.isArray(values) ? u.toMap(values) : values;
  return function(d) { return !!map[f(d)]; };
};

// comparison / sorting functions

u.comparator = function(sort) {
  var sign = [];
  if (sort === undefined) sort = [];
  sort = u.array(sort).map(function(f) {
    var s = 1;
    if      (f[0] === '-') { s = -1; f = f.slice(1); }
    else if (f[0] === '+') { s = +1; f = f.slice(1); }
    sign.push(s);
    return u.accessor(f);
  });
  return function(a, b) {
    var i, n, f, c;
    for (i=0, n=sort.length; i<n; ++i) {
      f = sort[i];
      c = u.cmp(f(a), f(b));
      if (c) return c * sign[i];
    }
    return 0;
  };
};

u.cmp = function(a, b) {
  return (a < b || a == null) && b != null ? -1 :
    (a > b || b == null) && a != null ? 1 :
    ((b = b instanceof Date ? +b : b),
     (a = a instanceof Date ? +a : a)) !== a && b === b ? -1 :
    b !== b && a === a ? 1 : 0;
};

u.numcmp = function(a, b) { return a - b; };

u.stablesort = function(array, sortBy, keyFn) {
  var indices = array.reduce(function(idx, v, i) {
    return (idx[keyFn(v)] = i, idx);
  }, {});

  array.sort(function(a, b) {
    var sa = sortBy(a),
        sb = sortBy(b);
    return sa < sb ? -1 : sa > sb ? 1
         : (indices[keyFn(a)] - indices[keyFn(b)]);
  });

  return array;
};

// permutes an array using a Knuth shuffle
u.permute = function(a) {
  var m = a.length,
      swap,
      i;

  while (m) {
    i = Math.floor(Math.random() * m--);
    swap = a[m];
    a[m] = a[i];
    a[i] = swap;
  }
};

// string functions

u.pad = function(s, length, pos, padchar) {
  padchar = padchar || " ";
  var d = length - s.length;
  if (d <= 0) return s;
  switch (pos) {
    case 'left':
      return strrep(d, padchar) + s;
    case 'middle':
    case 'center':
      return strrep(Math.floor(d/2), padchar) +
         s + strrep(Math.ceil(d/2), padchar);
    default:
      return s + strrep(d, padchar);
  }
};

function strrep(n, str) {
  var s = "", i;
  for (i=0; i<n; ++i) s += str;
  return s;
}

u.truncate = function(s, length, pos, word, ellipsis) {
  var len = s.length;
  if (len <= length) return s;
  ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
  var l = Math.max(0, length - ellipsis.length);

  switch (pos) {
    case 'left':
      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
    case 'middle':
    case 'center':
      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
        ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
    default:
      return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
  }
};

function truncateOnWord(s, len, rev) {
  var cnt = 0, tok = s.split(truncate_word_re);
  if (rev) {
    s = (tok = tok.reverse())
      .filter(function(w) { cnt += w.length; return cnt <= len; })
      .reverse();
  } else {
    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
  }
  return s.length ? s.join('').trim() : tok[0].slice(0, len);
}

var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;

}).call(this,require("buffer").Buffer)

},{"buffer":38}],46:[function(require,module,exports){
var json = typeof JSON !== 'undefined' ? JSON : require('jsonify');

module.exports = function (obj, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var space = opts.space || '';
    if (typeof space === 'number') space = Array(space+1).join(' ');
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
    var replacer = opts.replacer || function(key, value) { return value; };

    var cmp = opts.cmp && (function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    })(opts.cmp);

    var seen = [];
    return (function stringify (parent, key, node, level) {
        var indent = space ? ('\n' + new Array(level + 1).join(space)) : '';
        var colonSeparator = space ? ': ' : ':';

        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        node = replacer.call(parent, key, node);

        if (node === undefined) {
            return;
        }
        if (typeof node !== 'object' || node === null) {
            return json.stringify(node);
        }
        if (isArray(node)) {
            var out = [];
            for (var i = 0; i < node.length; i++) {
                var item = stringify(node, i, node[i], level+1) || json.stringify(null);
                out.push(indent + space + item);
            }
            return '[' + out.join(',') + indent + ']';
        }
        else {
            if (seen.indexOf(node) !== -1) {
                if (cycles) return json.stringify('__cycle__');
                throw new TypeError('Converting circular structure to JSON');
            }
            else seen.push(node);

            var keys = objectKeys(node).sort(cmp && cmp(node));
            var out = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = stringify(node, key, node[key], level+1);

                if(!value) continue;

                var keyValue = json.stringify(key)
                    + colonSeparator
                    + value;
                ;
                out.push(indent + space + keyValue);
            }
            seen.splice(seen.indexOf(node), 1);
            return '{' + out.join(',') + indent + '}';
        }
    })({ '': obj }, '', obj, 0);
};

var isArray = Array.isArray || function (x) {
    return {}.toString.call(x) === '[object Array]';
};

var objectKeys = Object.keys || function (obj) {
    var has = Object.prototype.hasOwnProperty || function () { return true };
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

},{"jsonify":47}],47:[function(require,module,exports){
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

},{"./lib/parse":48,"./lib/stringify":49}],48:[function(require,module,exports){
var at, // The index of the current character
    ch, // The current character
    escapee = {
        '"':  '"',
        '\\': '\\',
        '/':  '/',
        b:    '\b',
        f:    '\f',
        n:    '\n',
        r:    '\r',
        t:    '\t'
    },
    text,

    error = function (m) {
        // Call error when something is wrong.
        throw {
            name:    'SyntaxError',
            message: m,
            at:      at,
            text:    text
        };
    },
    
    next = function (c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }
        
        // Get the next character. When there are no more characters,
        // return the empty string.
        
        ch = text.charAt(at);
        at += 1;
        return ch;
    },
    
    number = function () {
        // Parse a number value.
        var number,
            string = '';
        
        if (ch === '-') {
            string = '-';
            next('-');
        }
        while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
        }
        if (ch === '.') {
            string += '.';
            while (next() && ch >= '0' && ch <= '9') {
                string += ch;
            }
        }
        if (ch === 'e' || ch === 'E') {
            string += ch;
            next();
            if (ch === '-' || ch === '+') {
                string += ch;
                next();
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
        }
        number = +string;
        if (!isFinite(number)) {
            error("Bad number");
        } else {
            return number;
        }
    },
    
    string = function () {
        // Parse a string value.
        var hex,
            i,
            string = '',
            uffff;
        
        // When parsing for string values, we must look for " and \ characters.
        if (ch === '"') {
            while (next()) {
                if (ch === '"') {
                    next();
                    return string;
                } else if (ch === '\\') {
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    string += ch;
                }
            }
        }
        error("Bad string");
    },

    white = function () {

// Skip whitespace.

        while (ch && ch <= ' ') {
            next();
        }
    },

    word = function () {

// true, false, or null.

        switch (ch) {
        case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        error("Unexpected '" + ch + "'");
    },

    value,  // Place holder for the value function.

    array = function () {

// Parse an array value.

        var array = [];

        if (ch === '[') {
            next('[');
            white();
            if (ch === ']') {
                next(']');
                return array;   // empty array
            }
            while (ch) {
                array.push(value());
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error("Bad array");
    },

    object = function () {

// Parse an object value.

        var key,
            object = {};

        if (ch === '{') {
            next('{');
            white();
            if (ch === '}') {
                next('}');
                return object;   // empty object
            }
            while (ch) {
                key = string();
                white();
                next(':');
                if (Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"');
                }
                object[key] = value();
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error("Bad object");
    };

value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

    white();
    switch (ch) {
    case '{':
        return object();
    case '[':
        return array();
    case '"':
        return string();
    case '-':
        return number();
    default:
        return ch >= '0' && ch <= '9' ? number() : word();
    }
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

module.exports = function (source, reviver) {
    var result;
    
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.

    return typeof reviver === 'function' ? (function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                }
            }
        }
        return reviver.call(holder, key, value);
    }({'': result}, '')) : result;
};

},{}],49:[function(require,module,exports){
var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
}

function str(key, holder) {
    // Produce a string from holder[key].
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }
    
    // What happens next depends on the value's type.
    switch (typeof value) {
        case 'string':
            return quote(value);
        
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite(value) ? String(value) : 'null';
        
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String(value);
            
        case 'object':
            if (!value) return 'null';
            gap += indent;
            partial = [];
            
            // Array.isArray
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                
                // Join all of the elements together, separated with commas, and
                // wrap them in brackets.
                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            
            // If the replacer is an array, use it to select the members to be
            // stringified.
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            else {
                // Otherwise, iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            
        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0 ? '{}' : gap ?
            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
            '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

module.exports = function (value, replacer, space) {
    var i;
    gap = '';
    indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }
    }
    // If the space parameter is a string, it will be used as the indent string.
    else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    rep = replacer;
    if (replacer && typeof replacer !== 'function'
    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str('', {'': value});
};

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGGREGATE_OPS = [
    'values',
    'count',
    'valid',
    'missing',
    'distinct',
    'sum',
    'mean',
    'average',
    'variance',
    'variancep',
    'stdev',
    'stdevp',
    'median',
    'q1',
    'q3',
    'modeskew',
    'min',
    'max',
    'argmin',
    'argmax',
];
/** Additive-based aggregation operations.  These can be applied to stack. */
exports.SUM_OPS = [
    'count',
    'sum',
    'distinct',
    'valid',
    'missing'
];
/**
 * Aggregation operators that always produce values within the range [domainMin, domainMax].
 */
exports.SHARED_DOMAIN_OPS = [
    'mean',
    'average',
    'median',
    'q1',
    'q3',
    'min',
    'max',
];

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAxisConfig = {
    labelMaxLength: 25,
};
exports.AXIS_PROPERTIES = [
    'domain', 'format', 'grid', 'labelPadding', 'labels', 'maxExtent', 'minExtent', 'offset', 'orient', 'position', 'tickCount', 'ticks', 'tickSize', 'title', 'titlePadding', 'values', 'zindex'
];
exports.VL_ONLY_AXIS_PROPERTIES = ['labelMaxLength'];

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
function autoMaxBins(channel) {
    switch (channel) {
        case channel_1.ROW:
        case channel_1.COLUMN:
        case channel_1.SIZE:
        // Facets and Size shouldn't have too many bins
        // We choose 6 like shape to simplify the rule
        case channel_1.SHAPE:
            return 6; // Vega's "shape" has 6 distinct values
        default:
            return 10;
    }
}
exports.autoMaxBins = autoMaxBins;

},{"./channel":53}],53:[function(require,module,exports){
/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("./scale");
var util_1 = require("./util");
var Channel;
(function (Channel) {
    // Facet
    Channel.ROW = 'row';
    Channel.COLUMN = 'column';
    // Position
    Channel.X = 'x';
    Channel.Y = 'y';
    Channel.X2 = 'x2';
    Channel.Y2 = 'y2';
    // Mark property with scale
    Channel.COLOR = 'color';
    Channel.SHAPE = 'shape';
    Channel.SIZE = 'size';
    Channel.OPACITY = 'opacity';
    // Non-scale channel
    Channel.TEXT = 'text';
    Channel.ORDER = 'order';
    Channel.DETAIL = 'detail';
})(Channel = exports.Channel || (exports.Channel = {}));
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.X2 = Channel.X2;
exports.Y2 = Channel.Y2;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.ORDER = Channel.ORDER;
exports.OPACITY = Channel.OPACITY;
exports.CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// CHANNELS without COLUMN, ROW
exports.UNIT_CHANNELS = [exports.X, exports.Y, exports.X2, exports.Y2, exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT
exports.UNIT_SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
// UNIT_SCALE_CHANNELS with ROW, COLUMN
exports.SCALE_CHANNELS = [exports.X, exports.Y, exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY, exports.ROW, exports.COLUMN];
// UNIT_CHANNELS without X, Y, X2, Y2;
exports.NONSPATIAL_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL];
// UNIT_SCALE_CHANNELS without X, Y;
exports.NONSPATIAL_SCALE_CHANNELS = [exports.SIZE, exports.SHAPE, exports.COLOR, exports.OPACITY];
/** Channels that can serve as groupings for stacked charts. */
exports.STACK_GROUP_CHANNELS = [exports.COLOR, exports.DETAIL, exports.ORDER, exports.OPACITY, exports.SIZE];
;
/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param mark the mark type
 * @return whether the mark supports the channel
 */
function supportMark(channel, mark) {
    return mark in getSupportedMark(channel);
}
exports.supportMark = supportMark;
/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
function getSupportedMark(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.DETAIL:
        case exports.ORDER: // TODO: revise (order might not support rect, which is not stackable?)
        case exports.OPACITY:
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, rect: true, line: true, area: true, text: true
            };
        case exports.X2:
        case exports.Y2:
            return {
                rule: true, bar: true, rect: true, area: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, text: true, line: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
function hasScale(channel) {
    return !util_1.contains([exports.DETAIL, exports.TEXT, exports.ORDER], channel);
}
exports.hasScale = hasScale;
// Position does not work with ordinal (lookup) scale and sequential (which is only for color)
var POSITION_SCALE_TYPE_INDEX = util_1.toSet(util_1.without(scale_1.SCALE_TYPES, ['ordinal', 'sequential']));
function supportScaleType(channel, scaleType) {
    switch (channel) {
        case exports.ROW:
        case exports.COLUMN:
            return scaleType === 'band'; // row / column currently supports band only
        case exports.X:
        case exports.Y:
        case exports.SIZE: // TODO: size and opacity can support ordinal with more modification
        case exports.OPACITY:
            // Although it generally doesn't make sense to use band with size and opacity,
            // it can also work since we use band: 0.5 to get midpoint.
            return scaleType in POSITION_SCALE_TYPE_INDEX;
        case exports.COLOR:
            return scaleType !== 'band'; // band does not make sense with color
        case exports.SHAPE:
            return scaleType === 'ordinal'; // shape = lookup only
    }
    /* istanbul ignore next: it should never reach here */
    return false;
}
exports.supportScaleType = supportScaleType;
function rangeType(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.SIZE:
        case exports.OPACITY:
            return 'continuous';
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
            return 'discrete';
        // Color can be either continuous or discrete, depending on scale type.
        case exports.COLOR:
            return 'flexible';
        // No scale, no range type.
        case exports.X2:
        case exports.Y2:
        case exports.DETAIL:
        case exports.TEXT:
        case exports.ORDER:
            return undefined;
    }
    /* istanbul ignore next: should never reach here. */
    throw new Error('getSupportedRole not implemented for ' + channel);
}
exports.rangeType = rangeType;

},{"./scale":60,"./util":63}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var channel_1 = require("../../channel");
var timeunit_1 = require("../../timeunit");
var util = require("../../util");
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
function type(specifiedType, channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    var defaultScaleType = defaultType(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
    if (!channel_1.hasScale(channel)) {
        // There is no scale for these channels
        return null;
    }
    if (specifiedType !== undefined) {
        // for binned fields we don't allow overriding the default scale
        if (fieldDef.bin) {
            // TODO: generalize this as a method in fieldDef that determines scale type support for a fieldDef (looking at functions and type)
            log.warn(log.message.cannotOverrideBinScaleType(channel, defaultScaleType));
            return defaultScaleType;
        }
        // Check if explicitly specified scale type is supported by the channel
        if (channel_1.supportScaleType(channel, specifiedType)) {
            return specifiedType;
        }
        else {
            log.warn(log.message.scaleTypeNotWorkWithChannel(channel, specifiedType, defaultScaleType));
            return defaultScaleType;
        }
    }
    return defaultScaleType;
}
exports.default = type;
/**
 * Determine appropriate default scale type.
 */
function defaultType(channel, fieldDef, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['row', 'column'], channel)) {
        return 'band';
    }
    switch (fieldDef.type) {
        case 'nominal':
            if (channel === 'color' || channel_1.rangeType(channel) === 'discrete') {
                return 'ordinal';
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'ordinal':
            if (channel === 'color') {
                return 'ordinal';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                return 'ordinal';
            }
            return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
        case 'temporal':
            if (channel === 'color') {
                // Always use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            if (timeunit_1.isDiscreteByDefault(fieldDef.timeUnit)) {
                return discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig);
            }
            return 'time';
        case 'quantitative':
            if (channel === 'color') {
                if (fieldDef.bin) {
                    return 'bin-ordinal';
                }
                // Use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (channel_1.rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            if (fieldDef.bin) {
                return 'bin-linear';
            }
            return 'linear';
    }
    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
/**
 * Determines default scale type for nominal/ordinal field.
 * @returns BAND or POINT scale based on channel, mark, and rangeStep
 */
function discreteToContinuousType(channel, mark, hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (util.contains(['x', 'y'], channel)) {
        if (mark === 'rect') {
            // The rect mark should fit into a band.
            return 'band';
        }
        if (mark === 'bar') {
            // For bar, use band only if there is no rangeStep since we need to use band for fit mode.
            // However, for non-fit mode, point scale provides better center position.
            if (haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig)) {
                return 'point';
            }
            return 'band';
        }
    }
    // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
    return 'point';
}
function haveRangeStep(hasTopLevelSize, specifiedRangeStep, scaleConfig) {
    if (hasTopLevelSize) {
        // if topLevelSize is provided, rangeStep will be dropped.
        return false;
    }
    if (specifiedRangeStep !== undefined) {
        return specifiedRangeStep !== null;
    }
    return !!scaleConfig.rangeStep;
}

},{"../../channel":53,"../../log":58,"../../timeunit":61,"../../util":63}],55:[function(require,module,exports){
// DateTime definition object
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var log = require("./log");
/*
 * A designated year that starts on Sunday.
 */
var SUNDAY_YEAR = 2006;
function isDateTime(o) {
    return !!o && (!!o.year || !!o.quarter || !!o.month || !!o.date || !!o.day ||
        !!o.hours || !!o.minutes || !!o.seconds || !!o.milliseconds);
}
exports.isDateTime = isDateTime;
exports.MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
exports.SHORT_MONTHS = exports.MONTHS.map(function (m) { return m.substr(0, 3); });
exports.DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
exports.SHORT_DAYS = exports.DAYS.map(function (d) { return d.substr(0, 3); });
function normalizeQuarter(q) {
    if (util_1.isNumber(q)) {
        if (q > 4) {
            log.warn(log.message.invalidTimeUnit('quarter', q));
        }
        // We accept 1-based quarter, so need to readjust to 0-based quarter
        return (q - 1) + '';
    }
    else {
        // Invalid quarter
        throw new Error(log.message.invalidTimeUnit('quarter', q));
    }
}
function normalizeMonth(m) {
    if (util_1.isNumber(m)) {
        // We accept 1-based month, so need to readjust to 0-based month
        return (m - 1) + '';
    }
    else {
        var lowerM = m.toLowerCase();
        var monthIndex = exports.MONTHS.indexOf(lowerM);
        if (monthIndex !== -1) {
            return monthIndex + ''; // 0 for january, ...
        }
        var shortM = lowerM.substr(0, 3);
        var shortMonthIndex = exports.SHORT_MONTHS.indexOf(shortM);
        if (shortMonthIndex !== -1) {
            return shortMonthIndex + '';
        }
        // Invalid month
        throw new Error(log.message.invalidTimeUnit('month', m));
    }
}
function normalizeDay(d) {
    if (util_1.isNumber(d)) {
        // mod so that this can be both 0-based where 0 = sunday
        // and 1-based where 7=sunday
        return (d % 7) + '';
    }
    else {
        var lowerD = d.toLowerCase();
        var dayIndex = exports.DAYS.indexOf(lowerD);
        if (dayIndex !== -1) {
            return dayIndex + ''; // 0 for january, ...
        }
        var shortD = lowerD.substr(0, 3);
        var shortDayIndex = exports.SHORT_DAYS.indexOf(shortD);
        if (shortDayIndex !== -1) {
            return shortDayIndex + '';
        }
        // Invalid day
        throw new Error(log.message.invalidTimeUnit('day', d));
    }
}
function timestamp(d, normalize) {
    var date = new Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date
    // FIXME support UTC
    if (d.day !== undefined) {
        if (util_1.keys(d).length > 1) {
            log.warn(log.message.droppedDay(d));
            d = util_1.duplicate(d);
            delete d.day;
        }
        else {
            // Use a year that has 1/1 as Sunday so we can setDate below
            date.setFullYear(SUNDAY_YEAR);
            var day = normalize ? normalizeDay(d.day) : d.day;
            date.setDate(+day + 1); // +1 since date start at 1 in JS
        }
    }
    if (d.year !== undefined) {
        date.setFullYear(d.year);
    }
    if (d.quarter !== undefined) {
        var quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
        date.setMonth(+quarter * 3);
    }
    if (d.month !== undefined) {
        var month = normalize ? normalizeMonth(d.month) : d.month;
        date.setMonth(+month);
    }
    if (d.date !== undefined) {
        date.setDate(d.date);
    }
    if (d.hours !== undefined) {
        date.setHours(d.hours);
    }
    if (d.minutes !== undefined) {
        date.setMinutes(d.minutes);
    }
    if (d.seconds !== undefined) {
        date.setSeconds(d.seconds);
    }
    if (d.milliseconds !== undefined) {
        date.setMilliseconds(d.milliseconds);
    }
    return date.getTime();
}
exports.timestamp = timestamp;
/**
 * Return Vega Expression for a particular date time.
 * @param d
 * @param normalize whether to normalize quarter, month, day.
 */
function dateTimeExpr(d, normalize) {
    if (normalize === void 0) { normalize = false; }
    var units = [];
    if (normalize && d.day !== undefined) {
        if (util_1.keys(d).length > 1) {
            log.warn(log.message.droppedDay(d));
            d = util_1.duplicate(d);
            delete d.day;
        }
    }
    if (d.year !== undefined) {
        units.push(d.year);
    }
    else if (d.day !== undefined) {
        // Set year to 2006 for working with day since January 1 2006 is a Sunday
        units.push(SUNDAY_YEAR);
    }
    else {
        units.push(0);
    }
    if (d.month !== undefined) {
        var month = normalize ? normalizeMonth(d.month) : d.month;
        units.push(month);
    }
    else if (d.quarter !== undefined) {
        var quarter = normalize ? normalizeQuarter(d.quarter) : d.quarter;
        units.push(quarter + '*3');
    }
    else {
        units.push(0); // months start at zero in JS
    }
    if (d.date !== undefined) {
        units.push(d.date);
    }
    else if (d.day !== undefined) {
        // HACK: Day only works as a standalone unit
        // This is only correct because we always set year to 2006 for day
        var day = normalize ? normalizeDay(d.day) : d.day;
        units.push(day + '+1');
    }
    else {
        units.push(1); // Date starts at 1 in JS
    }
    // Note: can't use TimeUnit enum here as importing it will create
    // circular dependency problem!
    for (var _i = 0, _a = ['hours', 'minutes', 'seconds', 'milliseconds']; _i < _a.length; _i++) {
        var timeUnit = _a[_i];
        if (d[timeUnit] !== undefined) {
            units.push(d[timeUnit]);
        }
        else {
            units.push(0);
        }
    }
    return 'datetime(' + units.join(', ') + ')';
}
exports.dateTimeExpr = dateTimeExpr;

},{"./log":58,"./util":63}],56:[function(require,module,exports){
// utility for a field definition object
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("./channel");
var log = require("./log");
var timeunit_1 = require("./timeunit");
var type_1 = require("./type");
;
function isFieldDef(channelDef) {
    return channelDef && (!!channelDef['field'] || channelDef['aggregate'] === 'count');
}
exports.isFieldDef = isFieldDef;
function isValueDef(channelDef) {
    return channelDef && 'value' in channelDef && channelDef['value'] !== undefined;
}
exports.isValueDef = isValueDef;
function field(fieldDef, opt) {
    if (opt === void 0) { opt = {}; }
    var field = fieldDef.field;
    var prefix = opt.prefix;
    var suffix = opt.suffix;
    if (isCount(fieldDef)) {
        field = 'count_*';
    }
    else {
        var fn = undefined;
        if (!opt.nofn) {
            if (fieldDef.bin) {
                fn = 'bin';
                suffix = opt.binSuffix;
            }
            else if (fieldDef.aggregate) {
                fn = String(opt.aggregate || fieldDef.aggregate);
            }
            else if (fieldDef.timeUnit) {
                fn = String(fieldDef.timeUnit);
            }
        }
        if (!!fn) {
            field = fn + "_" + field;
        }
    }
    if (!!suffix) {
        field = field + "_" + suffix;
    }
    if (!!prefix) {
        field = prefix + "_" + field;
    }
    if (opt.datum) {
        field = "datum[\"" + field + "\"]";
    }
    return field;
}
exports.field = field;
function isDiscrete(fieldDef) {
    switch (fieldDef.type) {
        case 'nominal':
        case 'ordinal':
            return true;
        case 'quantitative':
            return !!fieldDef.bin;
        case 'temporal':
            // TODO: deal with custom scale type case.
            return timeunit_1.isDiscreteByDefault(fieldDef.timeUnit);
    }
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
exports.isDiscrete = isDiscrete;
function isContinuous(fieldDef) {
    return !isDiscrete(fieldDef);
}
exports.isContinuous = isContinuous;
function isCount(fieldDef) {
    return fieldDef.aggregate === 'count';
}
exports.isCount = isCount;
function title(fieldDef, config) {
    if (fieldDef.title != null) {
        return fieldDef.title;
    }
    if (isCount(fieldDef)) {
        return config.countTitle;
    }
    var fn = fieldDef.aggregate || fieldDef.timeUnit || (fieldDef.bin && 'bin');
    if (fn) {
        return fn.toString().toUpperCase() + '(' + fieldDef.field + ')';
    }
    else {
        return fieldDef.field;
    }
}
exports.title = title;
function defaultType(fieldDef, channel) {
    if (!!fieldDef.timeUnit) {
        return 'temporal';
    }
    if (!!fieldDef.bin) {
        return 'quantitative';
    }
    switch (channel_1.rangeType(channel)) {
        case 'continuous':
            return 'quantitative';
        case 'discrete':
            return 'nominal';
        case 'flexible':
            return 'nominal';
        default:
            return 'quantitative';
    }
}
exports.defaultType = defaultType;
/**
 * Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
 */
function normalize(fieldDef, channel) {
    // If a fieldDef contains a field, we need type.
    if (isFieldDef(fieldDef)) {
        // convert short type to full type
        var fullType = type_1.getFullName(fieldDef.type);
        if (fullType) {
            fieldDef.type = fullType;
        }
        else {
            // If type is empty / invalid, then augment with default type
            var newType = defaultType(fieldDef, channel);
            log.warn(log.message.emptyOrInvalidFieldType(fieldDef.type, channel, newType));
            fieldDef.type = newType;
        }
        var _a = channelCompatibility(fieldDef, channel), compatible = _a.compatible, warning = _a.warning;
        if (!compatible) {
            log.warn(warning);
        }
    }
    return fieldDef;
}
exports.normalize = normalize;
var COMPATIBLE = { compatible: true };
function channelCompatibility(fieldDef, channel) {
    switch (channel) {
        case 'row':
        case 'column':
            if (isContinuous(fieldDef) && !fieldDef.timeUnit) {
                // TODO:(https://github.com/vega/vega-lite/issues/2011):
                // with timeUnit it's not always strictly continuous
                return {
                    compatible: false,
                    warning: log.message.facetChannelShouldBeDiscrete(channel)
                };
            }
            return COMPATIBLE;
        case 'x':
        case 'y':
        case 'color':
        case 'text':
        case 'detail':
            return COMPATIBLE;
        case 'opacity':
        case 'size':
        case 'x2':
        case 'y2':
            if (isDiscrete(fieldDef) && !fieldDef.bin) {
                return {
                    compatible: false,
                    warning: "Channel " + channel + " should not be used with discrete field."
                };
            }
            return COMPATIBLE;
        case 'shape':
            if (fieldDef.type !== 'nominal') {
                return {
                    compatible: false,
                    warning: 'Shape channel should be used with nominal data only'
                };
            }
            else {
                return COMPATIBLE;
            }
        case 'order':
            if (fieldDef.type === 'nominal') {
                return {
                    compatible: false,
                    warning: "Channel order is inappropriate for nominal field, which has no inherent order."
                };
            }
            return COMPATIBLE;
    }
    throw new Error('channelCompatability not implemented for channel ' + channel);
}
exports.channelCompatibility = channelCompatibility;

},{"./channel":53,"./log":58,"./timeunit":61,"./type":62}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLegendConfig = {
    orient: undefined,
};
exports.LEGEND_PROPERTIES = ['entryPadding', 'format', 'offset', 'orient', 'tickCount', 'title', 'type', 'values', 'zindex'];

},{}],58:[function(require,module,exports){
///<reference path="../typings/vega-util.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Vega-Lite's singleton logger utility.
 */
var vega_util_1 = require("vega-util");
/**
 * Main (default) Vega Logger instance for Vega-Lite
 */
var main = vega_util_1.logger(vega_util_1.Warn);
var current = main;
/**
 * Logger tool for checking if the code throws correct warning
 */
var LocalLogger = (function () {
    function LocalLogger() {
        this.warns = [];
        this.infos = [];
        this.debugs = [];
    }
    LocalLogger.prototype.level = function () {
        return this;
    };
    LocalLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.warns).push.apply(_a, args);
        return this;
        var _a;
    };
    LocalLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.infos).push.apply(_a, args);
        return this;
        var _a;
    };
    LocalLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.debugs).push.apply(_a, args);
        return this;
        var _a;
    };
    return LocalLogger;
}());
exports.LocalLogger = LocalLogger;
function runLocalLogger(f) {
    var localLogger = current = new LocalLogger();
    f(localLogger);
    reset();
}
exports.runLocalLogger = runLocalLogger;
function wrap(f) {
    return function () {
        var logger = current = new LocalLogger();
        f(logger);
        reset();
    };
}
exports.wrap = wrap;
/**
 * Set the singleton logger to be a custom logger
 */
function set(logger) {
    current = logger;
    return current;
}
exports.set = set;
/**
 * Reset the main logger to use the default Vega Logger
 */
function reset() {
    current = main;
    return current;
}
exports.reset = reset;
function warn() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.warn.apply(current, arguments);
}
exports.warn = warn;
function info() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.info.apply(current, arguments);
}
exports.info = info;
function debug() {
    var _ = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _[_i] = arguments[_i];
    }
    current.debug.apply(current, arguments);
}
exports.debug = debug;
/**
 * Collection of all Vega-Lite Error Messages
 */
var message;
(function (message) {
    message.INVALID_SPEC = 'Invalid spec';
    // DATA
    message.DEPRECATED_FILTER_NULL = 'filterNull is deprecated. Please use filterInvalid instead.';
    // ENCODING & FACET
    function invalidFieldType(type) {
        return "Invalid field type \"" + type + "\"";
    }
    message.invalidFieldType = invalidFieldType;
    function emptyOrInvalidFieldType(type, channel, newType) {
        return "Invalid field type (" + type + ") for channel " + channel + ", using " + newType + " instead.";
    }
    message.emptyOrInvalidFieldType = emptyOrInvalidFieldType;
    function emptyFieldDef(fieldDef, channel) {
        return "Dropping " + JSON.stringify(fieldDef) + " from channel " + channel + " since it does not contain data field or value.";
    }
    message.emptyFieldDef = emptyFieldDef;
    function incompatibleChannel(channel, markOrFacet, when) {
        return channel + " dropped as it is incompatible with " + markOrFacet +
            when ? "when " + when : '';
    }
    message.incompatibleChannel = incompatibleChannel;
    function facetChannelShouldBeDiscrete(channel) {
        return channel + " encoding should be discrete (ordinal / nominal / binned).";
    }
    message.facetChannelShouldBeDiscrete = facetChannelShouldBeDiscrete;
    function discreteChannelCannotEncode(channel, type) {
        return "Using discrete channel " + channel + " to encode " + type + " field can be misleading as it does not encode " + (type === 'ordinal' ? 'order' : 'magnitude') + ".";
    }
    message.discreteChannelCannotEncode = discreteChannelCannotEncode;
    // Mark
    message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL = 'Bar mark should not be used with point scale when rangeStep is null. Please use band scale instead.';
    function unclearOrientContinuous(mark) {
        return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode continous fields. In this case, we use vertical by default';
    }
    message.unclearOrientContinuous = unclearOrientContinuous;
    function unclearOrientDiscreteOrEmpty(mark) {
        return 'Cannot clearly determine orientation for ' + mark + ' since both x and y channel encode discrete or empty fields.';
    }
    message.unclearOrientDiscreteOrEmpty = unclearOrientDiscreteOrEmpty;
    function orientOverridden(original, actual) {
        return "Specified orient " + original + " overridden with " + actual;
    }
    message.orientOverridden = orientOverridden;
    // SCALE
    message.CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = 'custom domain scale cannot be unioned with default field-based domain';
    function cannotUseScalePropertyWithNonColor(prop) {
        return "Cannot use " + prop + " with non-color channel.";
    }
    message.cannotUseScalePropertyWithNonColor = cannotUseScalePropertyWithNonColor;
    function unaggregateDomainHasNoEffectForRawField(fieldDef) {
        return "Using unaggregated domain with raw field has no effect (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregateDomainHasNoEffectForRawField = unaggregateDomainHasNoEffectForRawField;
    function unaggregateDomainWithNonSharedDomainOp(aggregate) {
        return "Unaggregated domain not applicable for " + aggregate + " since it produces values outside the origin domain of the source data.";
    }
    message.unaggregateDomainWithNonSharedDomainOp = unaggregateDomainWithNonSharedDomainOp;
    function unaggregatedDomainWithLogScale(fieldDef) {
        return "Unaggregated domain is currently unsupported for log scale (" + JSON.stringify(fieldDef) + ").";
    }
    message.unaggregatedDomainWithLogScale = unaggregatedDomainWithLogScale;
    message.CANNOT_USE_RANGE_WITH_POSITION = 'Cannot use custom range with x or y channel.  Please customize width, height, padding, or rangeStep instead.';
    message.CANNOT_USE_PADDING_WITH_FACET = 'Cannot use padding with facet\'s scale.  Please use spacing instead.';
    function cannotUseRangePropertyWithFacet(propName) {
        return "Cannot use custom " + propName + " with row or column channel. Please use width, height, or spacing instead.";
    }
    message.cannotUseRangePropertyWithFacet = cannotUseRangePropertyWithFacet;
    function rangeStepDropped(channel) {
        return "rangeStep for " + channel + " is dropped as top-level " + (channel === 'x' ? 'width' : 'height') + " is provided.";
    }
    message.rangeStepDropped = rangeStepDropped;
    function cannotOverrideBinScaleType(channel, defaultScaleType) {
        return "Cannot override scale type for binned channel " + channel + ". We are using " + defaultScaleType + " scale instead.";
    }
    message.cannotOverrideBinScaleType = cannotOverrideBinScaleType;
    function scaleTypeNotWorkWithChannel(channel, scaleType, defaultScaleType) {
        return "Channel " + channel + " does not work with " + scaleType + " scale. We are using " + defaultScaleType + " scale instead.";
    }
    message.scaleTypeNotWorkWithChannel = scaleTypeNotWorkWithChannel;
    function scalePropertyNotWorkWithScaleType(scaleType, propName, channel) {
        return channel + "-scale's \"" + propName + "\" is dropped as it does not work with " + scaleType + " scale.";
    }
    message.scalePropertyNotWorkWithScaleType = scalePropertyNotWorkWithScaleType;
    function scaleTypeNotWorkWithMark(mark, scaleType) {
        return "Scale type \"" + scaleType + "\" does not work with mark " + mark + ".";
    }
    message.scaleTypeNotWorkWithMark = scaleTypeNotWorkWithMark;
    message.INVAID_DOMAIN = 'Invalid scale domain';
    message.UNABLE_TO_MERGE_DOMAINS = 'Unable to merge domains';
    // AXIS
    message.INVALID_CHANNEL_FOR_AXIS = 'Invalid channel for axis.';
    // STACK
    function cannotStackRangedMark(channel) {
        return "Cannot stack " + channel + " if there is already " + channel + "2";
    }
    message.cannotStackRangedMark = cannotStackRangedMark;
    function cannotStackNonLinearScale(scaleType) {
        return "Cannot stack non-linear scale (" + scaleType + ")";
    }
    message.cannotStackNonLinearScale = cannotStackNonLinearScale;
    function cannotStackNonSummativeAggregate(aggregate) {
        return "Cannot stack when the aggregate function is non-summative (" + aggregate + ")";
    }
    message.cannotStackNonSummativeAggregate = cannotStackNonSummativeAggregate;
    // TIMEUNIT
    function invalidTimeUnit(unitName, value) {
        return "Invalid " + unitName + ": " + value;
    }
    message.invalidTimeUnit = invalidTimeUnit;
    function dayReplacedWithDate(fullTimeUnit) {
        return "Time unit \"" + fullTimeUnit + "\" is not supported. We are replacing it with " +
            (fullTimeUnit + '').replace('day', 'date') + '.';
    }
    message.dayReplacedWithDate = dayReplacedWithDate;
    function droppedDay(d) {
        return 'Dropping day from datetime ' + JSON.stringify(d) +
            ' as day cannot be combined with other units.';
    }
    message.droppedDay = droppedDay;
})(message = exports.message || (exports.message = {}));

},{"vega-util":64}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var Mark;
(function (Mark) {
    Mark.AREA = 'area';
    Mark.BAR = 'bar';
    Mark.LINE = 'line';
    Mark.POINT = 'point';
    Mark.RECT = 'rect';
    Mark.RULE = 'rule';
    Mark.TEXT = 'text';
    Mark.TICK = 'tick';
    Mark.CIRCLE = 'circle';
    Mark.SQUARE = 'square';
})(Mark = exports.Mark || (exports.Mark = {}));
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.TICK = Mark.TICK;
exports.RECT = Mark.RECT;
exports.RULE = Mark.RULE;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;
exports.PRIMITIVE_MARKS = [exports.AREA, exports.BAR, exports.LINE, exports.POINT, exports.TEXT, exports.TICK, exports.RECT, exports.RULE, exports.CIRCLE, exports.SQUARE];
function isMarkDef(mark) {
    return mark['type'];
}
exports.isMarkDef = isMarkDef;
var PRIMITIVE_MARK_INDEX = util_1.toSet(exports.PRIMITIVE_MARKS);
function isPrimitiveMark(mark) {
    var markType = isMarkDef(mark) ? mark.type : mark;
    return markType in PRIMITIVE_MARK_INDEX;
}
exports.isPrimitiveMark = isPrimitiveMark;
exports.STROKE_CONFIG = ['stroke', 'strokeWidth',
    'strokeDash', 'strokeDashOffset', 'strokeOpacity'];
exports.FILL_CONFIG = ['fill', 'fillOpacity'];
exports.FILL_STROKE_CONFIG = [].concat(exports.STROKE_CONFIG, exports.FILL_CONFIG);
exports.defaultMarkConfig = {
    color: '#4c78a8',
};
exports.defaultBarConfig = {
    binSpacing: 1,
    continuousBandSize: 2
};
exports.defaultTextConfig = {
    baseline: 'middle',
};
exports.defaultTickConfig = {
    thickness: 1
};

},{"./util":63}],60:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
var util_1 = require("./util");
var ScaleType;
(function (ScaleType) {
    // Continuous - Quantitative
    ScaleType.LINEAR = 'linear';
    ScaleType.BIN_LINEAR = 'bin-linear';
    ScaleType.LOG = 'log';
    ScaleType.POW = 'pow';
    ScaleType.SQRT = 'sqrt';
    // Continuous - Time
    ScaleType.TIME = 'time';
    ScaleType.UTC = 'utc';
    // sequential
    ScaleType.SEQUENTIAL = 'sequential';
    // Quantile, Quantize, threshold
    ScaleType.QUANTILE = 'quantile';
    ScaleType.QUANTIZE = 'quantize';
    ScaleType.THRESHOLD = 'threshold';
    ScaleType.ORDINAL = 'ordinal';
    ScaleType.BIN_ORDINAL = 'bin-ordinal';
    ScaleType.POINT = 'point';
    ScaleType.BAND = 'band';
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
exports.SCALE_TYPES = [
    // Continuous - Quantitative
    'linear', 'bin-linear', 'log', 'pow', 'sqrt',
    // Continuous - Time
    'time', 'utc',
    // Sequential
    'sequential',
    // Discrete
    'ordinal', 'bin-ordinal', 'point', 'band',
];
exports.CONTINUOUS_TO_CONTINUOUS_SCALES = ['linear', 'bin-linear', 'log', 'pow', 'sqrt', 'time', 'utc'];
var CONTINUOUS_TO_CONTINUOUS_INDEX = util_1.toSet(exports.CONTINUOUS_TO_CONTINUOUS_SCALES);
exports.CONTINUOUS_DOMAIN_SCALES = exports.CONTINUOUS_TO_CONTINUOUS_SCALES.concat(['sequential' /* TODO add 'quantile', 'quantize', 'threshold'*/]);
var CONTINUOUS_DOMAIN_INDEX = util_1.toSet(exports.CONTINUOUS_DOMAIN_SCALES);
exports.DISCRETE_DOMAIN_SCALES = ['ordinal', 'bin-ordinal', 'point', 'band'];
var DISCRETE_DOMAIN_INDEX = util_1.toSet(exports.DISCRETE_DOMAIN_SCALES);
var BIN_SCALES_INDEX = util_1.toSet(['bin-linear', 'bin-ordinal']);
exports.TIME_SCALE_TYPES = ['time', 'utc'];
function hasDiscreteDomain(type) {
    return type in DISCRETE_DOMAIN_INDEX;
}
exports.hasDiscreteDomain = hasDiscreteDomain;
function isBinScale(type) {
    return type in BIN_SCALES_INDEX;
}
exports.isBinScale = isBinScale;
function hasContinuousDomain(type) {
    return type in CONTINUOUS_DOMAIN_INDEX;
}
exports.hasContinuousDomain = hasContinuousDomain;
function isContinuousToContinuous(type) {
    return type in CONTINUOUS_TO_CONTINUOUS_INDEX;
}
exports.isContinuousToContinuous = isContinuousToContinuous;
exports.defaultScaleConfig = {
    round: true,
    textXRangeStep: 90,
    rangeStep: 21,
    pointPadding: 0.5,
    bandPaddingInner: 0.1,
    facetSpacing: 16,
    minFontSize: 8,
    maxFontSize: 40,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    // FIXME: revise if these *can* become ratios of rangeStep
    minSize: 9,
    minStrokeWidth: 1,
    maxStrokeWidth: 4,
    shapes: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down']
};
function isExtendedScheme(scheme) {
    return scheme && !!scheme['name'];
}
exports.isExtendedScheme = isExtendedScheme;
exports.SCALE_PROPERTIES = [
    'type', 'domain', 'range', 'round', 'rangeStep', 'scheme', 'padding', 'paddingInner', 'paddingOuter', 'clamp', 'nice',
    'exponent', 'zero', 'interpolate'
];
function scaleTypeSupportProperty(scaleType, propName) {
    switch (propName) {
        case 'type':
        case 'domain':
        case 'range':
        case 'scheme':
            return true;
        case 'interpolate':
            return scaleType === 'linear' || scaleType === 'bin-linear';
        case 'round':
            return isContinuousToContinuous(scaleType) || scaleType === 'band' || scaleType === 'point';
        case 'rangeStep':
        case 'padding':
        case 'paddingOuter':
            return util_1.contains(['point', 'band'], scaleType);
        case 'paddingInner':
            return scaleType === 'band';
        case 'clamp':
            return isContinuousToContinuous(scaleType) || scaleType === 'sequential';
        case 'nice':
            return isContinuousToContinuous(scaleType) || scaleType === 'sequential' || scaleType === 'quantize';
        case 'exponent':
            return scaleType === 'pow' || scaleType === 'log';
        case 'zero':
            // TODO: what about quantize, threshold?
            return scaleType === 'bin-ordinal' || (!hasDiscreteDomain(scaleType) && !util_1.contains(['log', 'time', 'utc'], scaleType));
    }
    /* istanbul ignore next: should never reach here*/
    throw new Error("Invalid scale property " + propName + ".");
}
exports.scaleTypeSupportProperty = scaleTypeSupportProperty;
/**
 * Returns undefined if the input channel supports the input scale property name
 */
function channelScalePropertyIncompatability(channel, propName) {
    switch (propName) {
        case 'range':
            // User should not customize range for position and facet channel directly.
            if (channel === 'x' || channel === 'y') {
                return log.message.CANNOT_USE_RANGE_WITH_POSITION;
            }
            if (channel === 'row' || channel === 'column') {
                return log.message.cannotUseRangePropertyWithFacet('range');
            }
            return undefined; // GOOD!
        // band / point
        case 'rangeStep':
            if (channel === 'row' || channel === 'column') {
                return log.message.cannotUseRangePropertyWithFacet('rangeStep');
            }
            return undefined; // GOOD!
        case 'padding':
        case 'paddingInner':
        case 'paddingOuter':
            if (channel === 'row' || channel === 'column') {
                /*
                 * We do not use d3 scale's padding for row/column because padding there
                 * is a ratio ([0, 1]) and it causes the padding to be decimals.
                 * Therefore, we manually calculate "spacing" in the layout by ourselves.
                 */
                return log.message.CANNOT_USE_PADDING_WITH_FACET;
            }
            return undefined; // GOOD!
        case 'interpolate':
        case 'scheme':
            if (channel !== 'color') {
                return log.message.cannotUseScalePropertyWithNonColor(channel);
            }
            return undefined;
        case 'type':
        case 'domain':
        case 'round':
        case 'clamp':
        case 'exponent':
        case 'nice':
        case 'zero':
            // These channel do not have strict requirement
            return undefined; // GOOD!
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error('Invalid scale property "${propName}".');
}
exports.channelScalePropertyIncompatability = channelScalePropertyIncompatability;

},{"./log":58,"./util":63}],61:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datetime_1 = require("./datetime");
var util_1 = require("./util");
var log = require("./log");
var TimeUnit;
(function (TimeUnit) {
    TimeUnit.YEAR = 'year';
    TimeUnit.MONTH = 'month';
    TimeUnit.DAY = 'day';
    TimeUnit.DATE = 'date';
    TimeUnit.HOURS = 'hours';
    TimeUnit.MINUTES = 'minutes';
    TimeUnit.SECONDS = 'seconds';
    TimeUnit.MILLISECONDS = 'milliseconds';
    TimeUnit.YEARMONTH = 'yearmonth';
    TimeUnit.YEARMONTHDATE = 'yearmonthdate';
    TimeUnit.YEARMONTHDATEHOURS = 'yearmonthdatehours';
    TimeUnit.YEARMONTHDATEHOURSMINUTES = 'yearmonthdatehoursminutes';
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS = 'yearmonthdatehoursminutesseconds';
    // MONTHDATE always include 29 February since we use year 0th (which is a leap year);
    TimeUnit.MONTHDATE = 'monthdate';
    TimeUnit.HOURSMINUTES = 'hoursminutes';
    TimeUnit.HOURSMINUTESSECONDS = 'hoursminutesseconds';
    TimeUnit.MINUTESSECONDS = 'minutesseconds';
    TimeUnit.SECONDSMILLISECONDS = 'secondsmilliseconds';
    TimeUnit.QUARTER = 'quarter';
    TimeUnit.YEARQUARTER = 'yearquarter';
    TimeUnit.QUARTERMONTH = 'quartermonth';
    TimeUnit.YEARQUARTERMONTH = 'yearquartermonth';
})(TimeUnit = exports.TimeUnit || (exports.TimeUnit = {}));
/** Time Unit that only corresponds to only one part of Date objects. */
exports.SINGLE_TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.QUARTER,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
];
var SINGLE_TIMEUNIT_INDEX = exports.SINGLE_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isSingleTimeUnit(timeUnit) {
    return !!SINGLE_TIMEUNIT_INDEX[timeUnit];
}
exports.isSingleTimeUnit = isSingleTimeUnit;
/**
 * Converts a date to only have the measurements relevant to the specified unit
 * i.e. ('yearmonth', '2000-12-04 07:58:14') -> '2000-12-01 00:00:00'
 * Note: the base date is Jan 01 1900 00:00:00
 */
function convert(unit, date) {
    var result = new Date(0, 0, 1, 0, 0, 0, 0); // start with uniform date
    exports.SINGLE_TIMEUNITS.forEach(function (singleUnit) {
        if (containsTimeUnit(unit, singleUnit)) {
            switch (singleUnit) {
                case TimeUnit.DAY:
                    throw new Error('Cannot convert to TimeUnits containing \'day\'');
                case TimeUnit.YEAR:
                    result.setFullYear(date.getFullYear());
                    break;
                case TimeUnit.QUARTER:
                    // indicate quarter by setting month to be the first of the quarter i.e. may (4) -> april (3)
                    result.setMonth((Math.floor(date.getMonth() / 3)) * 3);
                    break;
                case TimeUnit.MONTH:
                    result.setMonth(date.getMonth());
                    break;
                case TimeUnit.DATE:
                    result.setDate(date.getDate());
                    break;
                case TimeUnit.HOURS:
                    result.setHours(date.getHours());
                    break;
                case TimeUnit.MINUTES:
                    result.setMinutes(date.getMinutes());
                    break;
                case TimeUnit.SECONDS:
                    result.setSeconds(date.getSeconds());
                    break;
                case TimeUnit.MILLISECONDS:
                    result.setMilliseconds(date.getMilliseconds());
                    break;
            }
        }
    });
    return result;
}
exports.convert = convert;
exports.MULTI_TIMEUNITS = [
    TimeUnit.YEARQUARTER,
    TimeUnit.YEARQUARTERMONTH,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARMONTHDATEHOURS,
    TimeUnit.YEARMONTHDATEHOURSMINUTES,
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
    TimeUnit.QUARTERMONTH,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS,
];
var MULTI_TIMEUNIT_INDEX = exports.MULTI_TIMEUNITS.reduce(function (d, timeUnit) {
    d[timeUnit] = true;
    return d;
}, {});
function isMultiTimeUnit(timeUnit) {
    return !!MULTI_TIMEUNIT_INDEX[timeUnit];
}
exports.isMultiTimeUnit = isMultiTimeUnit;
exports.TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.QUARTER,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
    TimeUnit.YEARQUARTER,
    TimeUnit.YEARQUARTERMONTH,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARMONTHDATEHOURS,
    TimeUnit.YEARMONTHDATEHOURSMINUTES,
    TimeUnit.YEARMONTHDATEHOURSMINUTESSECONDS,
    TimeUnit.QUARTERMONTH,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS
];
/** Returns true if fullTimeUnit contains the timeUnit, false otherwise. */
function containsTimeUnit(fullTimeUnit, timeUnit) {
    var fullTimeUnitStr = fullTimeUnit.toString();
    var timeUnitStr = timeUnit.toString();
    var index = fullTimeUnitStr.indexOf(timeUnitStr);
    return index > -1 &&
        (timeUnit !== TimeUnit.SECONDS ||
            index === 0 ||
            fullTimeUnitStr.charAt(index - 1) !== 'i' // exclude milliseconds
        );
}
exports.containsTimeUnit = containsTimeUnit;
/**
 * Returns Vega expresssion for a given timeUnit and fieldRef
 */
function fieldExpr(fullTimeUnit, field) {
    var fieldRef = "datum[\"" + field + "\"]";
    function func(timeUnit) {
        if (timeUnit === TimeUnit.QUARTER) {
            // quarter starting at 0 (0,3,6,9).
            return "(quarter(" + fieldRef + ")-1)";
        }
        else {
            return timeUnit + "(" + fieldRef + ")";
        }
    }
    var d = exports.SINGLE_TIMEUNITS.reduce(function (_d, tu) {
        if (containsTimeUnit(fullTimeUnit, tu)) {
            _d[tu] = func(tu);
        }
        return _d;
    }, {});
    if (d.day && util_1.keys(d).length > 1) {
        log.warn(log.message.dayReplacedWithDate(fullTimeUnit));
        delete d.day;
        d.date = func(TimeUnit.DATE);
    }
    return datetime_1.dateTimeExpr(d);
}
exports.fieldExpr = fieldExpr;
/** returns the smallest nice unit for scale.nice */
function smallestUnit(timeUnit) {
    if (!timeUnit) {
        return undefined;
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        return 'second';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        return 'minute';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        return 'hour';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY) ||
        containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        return 'day';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        return 'month';
    }
    if (containsTimeUnit(timeUnit, TimeUnit.YEAR)) {
        return 'year';
    }
    return undefined;
}
exports.smallestUnit = smallestUnit;
/** returns the signal expression used for axis labels for a time unit */
function formatExpression(timeUnit, field, shortTimeLabels) {
    if (!timeUnit) {
        return undefined;
    }
    var dateComponents = [];
    var expression = '';
    var hasYear = containsTimeUnit(timeUnit, TimeUnit.YEAR);
    if (containsTimeUnit(timeUnit, TimeUnit.QUARTER)) {
        // special expression for quarter as prefix
        expression = "'Q' + quarter(" + field + ")";
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MONTH)) {
        // By default use short month name
        dateComponents.push(shortTimeLabels !== false ? '%b' : '%B');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.DAY)) {
        dateComponents.push(shortTimeLabels ? '%a' : '%A');
    }
    else if (containsTimeUnit(timeUnit, TimeUnit.DATE)) {
        dateComponents.push('%d' + (hasYear ? ',' : '')); // add comma if there is year
    }
    if (hasYear) {
        dateComponents.push(shortTimeLabels ? '%y' : '%Y');
    }
    var timeComponents = [];
    if (containsTimeUnit(timeUnit, TimeUnit.HOURS)) {
        timeComponents.push('%H');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MINUTES)) {
        timeComponents.push('%M');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.SECONDS)) {
        timeComponents.push('%S');
    }
    if (containsTimeUnit(timeUnit, TimeUnit.MILLISECONDS)) {
        timeComponents.push('%L');
    }
    var dateTimeComponents = [];
    if (dateComponents.length > 0) {
        dateTimeComponents.push(dateComponents.join(' '));
    }
    if (timeComponents.length > 0) {
        dateTimeComponents.push(timeComponents.join(':'));
    }
    if (dateTimeComponents.length > 0) {
        if (expression) {
            // Add space between quarter and main time format
            expression += " + ' ' + ";
        }
        expression += "timeFormat(" + field + ", '" + dateTimeComponents.join(' ') + "')";
    }
    // If expression is still an empty string, return undefined instead.
    return expression || undefined;
}
exports.formatExpression = formatExpression;
function isDiscreteByDefault(timeUnit) {
    switch (timeUnit) {
        // These time unit use discrete scale by default
        case 'hours':
        case 'day':
        case 'month':
        case 'quarter':
            return true;
    }
    return false;
}
exports.isDiscreteByDefault = isDiscreteByDefault;

},{"./datetime":55,"./log":58,"./util":63}],62:[function(require,module,exports){
/** Constants and utilities for data type */
/** Data type based on level of measurement */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type.QUANTITATIVE = 'quantitative';
    Type.ORDINAL = 'ordinal';
    Type.TEMPORAL = 'temporal';
    Type.NOMINAL = 'nominal';
})(Type = exports.Type || (exports.Type = {}));
exports.QUANTITATIVE = Type.QUANTITATIVE;
exports.ORDINAL = Type.ORDINAL;
exports.TEMPORAL = Type.TEMPORAL;
exports.NOMINAL = Type.NOMINAL;
/**
 * Get full, lowercase type name for a given type.
 * @param  type
 * @return Full type name.
 */
function getFullName(type) {
    if (type) {
        type = type.toLowerCase();
        switch (type) {
            case 'q':
            case exports.QUANTITATIVE:
                return 'quantitative';
            case 't':
            case exports.TEMPORAL:
                return 'temporal';
            case 'o':
            case exports.ORDINAL:
                return 'ordinal';
            case 'n':
            case exports.NOMINAL:
                return 'nominal';
        }
    }
    // If we get invalid input, return undefined type.
    return undefined;
}
exports.getFullName = getFullName;

},{}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringify = require("json-stable-stringify");
var vega_util_1 = require("vega-util");
exports.extend = vega_util_1.extend;
exports.isArray = vega_util_1.isArray;
exports.isObject = vega_util_1.isObject;
exports.isNumber = vega_util_1.isNumber;
exports.isString = vega_util_1.isString;
exports.truncate = vega_util_1.truncate;
exports.toSet = vega_util_1.toSet;
exports.stringValue = vega_util_1.stringValue;
var vega_util_2 = require("vega-util");
/**
 * Creates an object composed of the picked object properties.
 *
 * Example:  (from lodash)
 *
 * var object = {'a': 1, 'b': '2', 'c': 3};
 * pick(object, ['a', 'c']);
 * // → {'a': 1, 'c': 3}
 *
 */
function pick(obj, props) {
    var copy = {};
    props.forEach(function (prop) {
        if (obj.hasOwnProperty(prop)) {
            copy[prop] = obj[prop];
        }
    });
    return copy;
}
exports.pick = pick;
/**
 * The opposite of _.pick; this method creates an object composed of the own
 * and inherited enumerable string keyed properties of object that are not omitted.
 */
function omit(obj, props) {
    var copy = duplicate(obj);
    props.forEach(function (prop) {
        delete copy[prop];
    });
    return copy;
}
exports.omit = omit;
function hash(a) {
    if (vega_util_2.isString(a) || vega_util_2.isNumber(a) || isBoolean(a)) {
        return String(a);
    }
    return stringify(a);
}
exports.hash = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
/** Returns the array without the elements in item */
function without(array, excludedItems) {
    return array.filter(function (item) { return !contains(excludedItems, item); });
}
exports.without = without;
function union(array, other) {
    return array.concat(without(other, array));
}
exports.union = union;
function reduce(obj, f, init, thisArg) {
    if (obj.reduce) {
        return obj.reduce.call(thisArg, f, init);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                init = f.call(thisArg, init, obj[k], k, obj);
            }
        }
        return init;
    }
}
exports.reduce = reduce;
/**
 * Returns true if any item returns true.
 */
function some(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
/**
 * Returns true if all items return true.
 */
function every(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
exports.flatten = flatten;
/**
 * recursively merges src into dest
 */
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
        var s = src_1[_a];
        dest = deepMerge_(dest, s);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
;
// recursively merges src into dest
function deepMerge_(dest, src) {
    if (typeof src !== 'object' || src === null) {
        return dest;
    }
    for (var p in src) {
        if (!src.hasOwnProperty(p)) {
            continue;
        }
        if (src[p] === undefined) {
            continue;
        }
        if (typeof src[p] !== 'object' || vega_util_2.isArray(src[p]) || src[p] === null) {
            dest[p] = src[p];
        }
        else if (typeof dest[p] !== 'object' || dest[p] === null) {
            dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
        }
        else {
            mergeDeep(dest[p], src[p]);
        }
    }
    return dest;
}
function unique(values, f) {
    var results = [];
    var u = {};
    var v;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        v = f(val);
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(val);
    }
    return results;
}
exports.unique = unique;
;
/**
 * Returns true if the two dictionaries disagree. Applies only to defined values.
 */
function differ(dict, other) {
    for (var key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (other[key] && dict[key] && other[key] !== dict[key]) {
                return true;
            }
        }
    }
    return false;
}
exports.differ = differ;
exports.keys = Object.keys;
function vals(x) {
    var _vals = [];
    for (var k in x) {
        if (x.hasOwnProperty(k)) {
            _vals.push(x[k]);
        }
    }
    return _vals;
}
exports.vals = vals;
;
function duplicate(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.duplicate = duplicate;
;
function isBoolean(b) {
    return b === true || b === false;
}
exports.isBoolean = isBoolean;

},{"json-stable-stringify":46,"vega-util":64}],64:[function(require,module,exports){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vega = global.vega || {})));
}(this, (function (exports) { 'use strict';

var accessor = function(fn, fields, name) {
  return (
    fn.fields = fields || [],
    fn.fname = name,
    fn
  );
}

function accessorName(fn) {
  return fn == null ? null : fn.fname;
}

function accessorFields(fn) {
  return fn == null ? null : fn.fields;
}

var error = function(message) {
  throw Error(message);
}

var splitAccessPath = function(p) {
  var path = [],
      q = null,
      b = 0,
      n = p.length,
      s = '',
      i, j, c;

  p = p + '';

  function push() {
    path.push(s + p.substring(i, j));
    s = '';
    i = j + 1;
  }

  for (i=j=0; j<n; ++j) {
    c = p[j];
    if (c === '\\') s += p.substring(i, j), i = ++j;
    else if (c === q) push(), q = null, b = -1;
    else if (q) continue;
    else if (i === b && c === '"') i = j + 1, q = c;
    else if (i === b && c === "'") i = j + 1, q = c;
    else if (c === '.' && !b) (j > i) ? push() : (i = j + 1);
    else if (c === '[') {
      if (j > i) push();
      b = i = j + 1;
    }
    else if (c === ']') {
      if (!b) error('Access path missing open bracket: ' + p);
      if (b > 0) push();
      b = 0;
      i = j + 1;
    }
  }

  if (b) error('Access path missing closing bracket: ' + p);
  if (q) error('Access path missing closing quote: ' + p);
  if (j > i) ++j, push();
  return path;
}

var isArray = Array.isArray;

var isObject = function(_) {
  return _ === Object(_);
}

var isString = function(_) {
  return typeof _ === 'string';
}

function $(x) {
  return isArray(x) ? '[' + x.map($) + ']'
    : isObject(x) || isString(x) ?
      // Output valid JSON and JS source strings.
      // See http://timelessrepo.com/json-isnt-a-javascript-subset
      JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
    : x;
}

var field = function(field, name) {
  var path = splitAccessPath(field),
      code = 'return _[' + path.map($).join('][') + '];';

  return accessor(
    Function('_', code),
    [(field = path.length===1 ? path[0] : field)],
    name || field
  );
}

var empty = [];

var id = field('id');

var identity = accessor(function(_) { return _; }, empty, 'identity');

var zero = accessor(function() { return 0; }, empty, 'zero');

var one = accessor(function() { return 1; }, empty, 'one');

var truthy = accessor(function() { return true; }, empty, 'true');

var falsy = accessor(function() { return false; }, empty, 'false');

function log(method, level, input) {
  var args = [level].concat([].slice.call(input));
  console[method].apply(console, args); // eslint-disable-line no-console
}

var None  = 0;
var Warn  = 1;
var Info  = 2;
var Debug = 3;

var logger = function(_) {
  var level = _ || None;
  return {
    level: function(_) {
      return arguments.length ? (level = +_, this) : level;
    },
    warn: function() {
      if (level >= Warn) log('warn', 'WARN', arguments);
      return this;
    },
    info: function() {
      if (level >= Info) log('log', 'INFO', arguments);
      return this;
    },
    debug: function() {
      if (level >= Debug) log('log', 'DEBUG', arguments);
      return this;
    }
  }
}

var array = function(_) {
  return _ != null ? (isArray(_) ? _ : [_]) : [];
}

var compare = function(fields, orders) {
  var idx = [],
      cmp = (fields = array(fields)).map(function(f, i) {
        return f == null ? null
          : (idx.push(i), splitAccessPath(f).map($).join(']['));
      }),
      n = idx.length - 1,
      ord = array(orders),
      code = 'var u,v;return ',
      i, j, f, u, v, d, lt, gt;

  if (n < 0) return null;

  for (j=0; j<=n; ++j) {
    i = idx[j];
    f = cmp[i];
    u = '(u=a['+f+'])';
    v = '(v=b['+f+'])';
    d = '((v=v instanceof Date?+v:v),(u=u instanceof Date?+u:u))';
    lt = ord[i] !== 'descending' ? (gt=1, -1) : (gt=-1, 1);
    code += '(' + u+'<'+v+'||u==null)&&v!=null?' + lt
      + ':(u>v||v==null)&&u!=null?' + gt
      + ':'+d+'!==u&&v===v?' + lt
      + ':v!==v&&u===u?' + gt
      + (i < n ? ':' : ':0');
  }

  return accessor(
    Function('a', 'b', code + ';'),
    fields.filter(function(_) { return _ != null; })
  );
}

var isFunction = function(_) {
  return typeof _ === 'function';
}

var constant = function(_) {
  return isFunction(_) ? _ : function() { return _; };
}

var extend = function(_) {
  for (var x, k, i=1, len=arguments.length; i<len; ++i) {
    x = arguments[i];
    for (k in x) { _[k] = x[k]; }
  }
  return _;
}

var extentIndex = function(array, f) {
  var i = -1,
      n = array.length,
      a, b, c, u, v;

  if (f == null) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
    u = v = i;
    while (++i < n) if ((b = array[i]) != null) {
      if (a > b) a = b, u = i;
      if (c < b) c = b, v = i;
    }
  } else {
    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
    u = v = i;
    while (++i < n) if ((b = f(array[i], i, array)) != null) {
      if (a > b) a = b, u = i;
      if (c < b) c = b, v = i;
    }
  }

  return [u, v];
}

var NULL = {};

var fastmap = function(input) {
  var obj = {},
      map,
      test;

  function has(key) {
    return obj.hasOwnProperty(key) && obj[key] !== NULL;
  }

  map = {
    size: 0,
    empty: 0,
    object: obj,
    has: has,
    get: function(key) {
      return has(key) ? obj[key] : undefined;
    },
    set: function(key, value) {
      if (!has(key)) {
        ++map.size;
        if (obj[key] === NULL) --map.empty;
      }
      obj[key] = value;
      return this;
    },
    delete: function(key) {
      if (has(key)) {
        --map.size;
        ++map.empty;
        obj[key] = NULL;
      }
      return this;
    },
    clear: function() {
      map.size = map.empty = 0;
      map.object = obj = {};
    },
    test: function(_) {
      return arguments.length ? (test = _, map) : test;
    },
    clean: function() {
      var next = {},
          size = 0,
          key, value;
      for (key in obj) {
        value = obj[key];
        if (value !== NULL && (!test || !test(value))) {
          next[key] = value;
          ++size;
        }
      }
      map.size = size;
      map.empty = 0;
      map.object = (obj = next);
    }
  };

  if (input) Object.keys(input).forEach(function(key) {
    map.set(key, input[key]);
  });

  return map;
}

var inherits = function(child, parent) {
  var proto = (child.prototype = Object.create(parent.prototype));
  proto.constructor = child;
  return proto;
}

var isNumber = function(_) {
  return typeof _ === 'number';
}

var key = function(fields) {
  fields = fields ? array(fields) : fields;
  var fn = !(fields && fields.length)
    ? function() { return ''; }
    : Function('_', 'return \'\'+' +
        fields.map(function(f) {
          return '_[' + splitAccessPath(f).map($).join('][') + ']';
        }).join('+\'|\'+') + ';');
  return accessor(fn, fields, 'key');
}

var merge = function(compare, array0, array1, output) {
  var n0 = array0.length,
      n1 = array1.length;

  if (!n1) return array0;
  if (!n0) return array1;

  var merged = output || new array0.constructor(n0 + n1),
      i0 = 0, i1 = 0, i = 0;

  for (; i0<n0 && i1<n1; ++i) {
    merged[i] = compare(array0[i0], array1[i1]) > 0
       ? array1[i1++]
       : array0[i0++];
  }

  for (; i0<n0; ++i0, ++i) {
    merged[i] = array0[i0];
  }

  for (; i1<n1; ++i1, ++i) {
    merged[i] = array1[i1];
  }

  return merged;
}

var repeat = function(str, reps) {
  var s = '';
  while (--reps >= 0) s += str;
  return s;
}

var pad = function(str, length, padchar, align) {
  var c = padchar || ' ',
      s = str + '',
      n = length - s.length;

  return n <= 0 ? s
    : align === 'left' ? repeat(c, n) + s
    : align === 'center' ? repeat(c, ~~(n/2)) + s + repeat(c, Math.ceil(n/2))
    : s + repeat(c, n);
}

var peek = function(array) {
  return array[array.length - 1];
}

var toSet = function(_) {
  for (var s={}, i=0, n=_.length; i<n; ++i) s[_[i]] = 1;
  return s;
}

var truncate = function(str, length, align, ellipsis) {
  var e = ellipsis != null ? ellipsis : '\u2026',
      s = str + '',
      n = s.length,
      l = Math.max(0, length - e.length);

  return n <= length ? s
    : align === 'left' ? e + s.slice(n - l)
    : align === 'center' ? s.slice(0, Math.ceil(l/2)) + e + s.slice(n - ~~(l/2))
    : s.slice(0, l) + e;
}

var visitArray = function(array, filter, visitor) {
  if (array) {
    var i = 0, n = array.length, t;
    if (filter) {
      for (; i<n; ++i) {
        if (t = filter(array[i])) visitor(t, i, array);
      }
    } else {
      array.forEach(visitor);
    }
  }
}

exports.accessor = accessor;
exports.accessorName = accessorName;
exports.accessorFields = accessorFields;
exports.id = id;
exports.identity = identity;
exports.zero = zero;
exports.one = one;
exports.truthy = truthy;
exports.falsy = falsy;
exports.logger = logger;
exports.None = None;
exports.Warn = Warn;
exports.Info = Info;
exports.Debug = Debug;
exports.array = array;
exports.compare = compare;
exports.constant = constant;
exports.error = error;
exports.extend = extend;
exports.extentIndex = extentIndex;
exports.fastmap = fastmap;
exports.field = field;
exports.inherits = inherits;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.key = key;
exports.merge = merge;
exports.pad = pad;
exports.peek = peek;
exports.repeat = repeat;
exports.splitAccessPath = splitAccessPath;
exports.stringValue = $;
exports.toSet = toSet;
exports.truncate = truncate;
exports.visitArray = visitArray;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}]},{},[6])(6)
});
//# sourceMappingURL=compassql.js.map
