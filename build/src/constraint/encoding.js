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
//# sourceMappingURL=encoding.js.map