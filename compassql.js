(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cql = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
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
var channel_1 = require('vega-lite/src/channel');
var type_1 = require('vega-lite/src/type');
var property_1 = require('../property');
var query_1 = require('../query');
var schema_1 = require('../schema');
var util_1 = require('../util');
var base_1 = require('./base');
var EncodingConstraintModel = (function (_super) {
    __extends(EncodingConstraintModel, _super);
    function EncodingConstraintModel(constraint) {
        _super.call(this, constraint);
    }
    EncodingConstraintModel.prototype.satisfy = function (encQ, schema, stats, opt) {
        if (this.constraint.requireAllProperties) {
            var hasRequiredPropertyAsEnumSpec = util_1.some(this.constraint.properties, function (prop) { return query_1.isEnumSpec(encQ[prop]); });
            if (hasRequiredPropertyAsEnumSpec) {
                return true;
            }
        }
        return this.constraint.satisfy(encQ, schema, stats, opt);
    };
    return EncodingConstraintModel;
}(base_1.AbstractConstraintModel));
exports.EncodingConstraintModel = EncodingConstraintModel;
exports.ENCODING_CONSTRAINTS = [
    {
        name: 'aggregateOpSupportedByType',
        description: 'Aggregate function should be supported by data type.',
        properties: [property_1.Property.TYPE, property_1.Property.AGGREGATE],
        requireAllProperties: true,
        strict: true,
        satisfy: function (encQ, schema, stats, opt) {
            if (encQ.aggregate) {
                return encQ.type !== type_1.Type.ORDINAL && encQ.type !== type_1.Type.NOMINAL;
            }
            return true;
        }
    }, {
        name: 'binAppliedForQuantitative',
        description: 'bin should be applied to quantitative field only.',
        properties: [property_1.Property.TYPE, property_1.Property.BIN],
        requireAllProperties: true,
        strict: true,
        satisfy: function (encQ, schema, stats, opt) {
            if (encQ.bin) {
                return encQ.type === type_1.Type.QUANTITATIVE;
            }
            return true;
        }
    }, {
        name: 'channelSupportsRole',
        description: 'encoding channel should support the role of the field',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        requireAllProperties: false,
        strict: true,
        satisfy: function (encQ, schema, opt) {
            if (query_1.isEnumSpec(encQ.channel))
                return true;
            var supportedRole = channel_1.getSupportedRole(encQ.channel);
            if (query_1.isDimension(encQ)) {
                return supportedRole.dimension;
            }
            else if (query_1.isMeasure(encQ)) {
                return supportedRole.measure;
            }
            return true;
        }
    }, {
        name: 'onlyOneTypeOfFunction',
        description: 'Only of of aggregate, autoCount, timeUnit, or bin should be applied at the same time.',
        properties: [property_1.Property.AGGREGATE, property_1.Property.AUTOCOUNT, property_1.Property.TIMEUNIT, property_1.Property.BIN],
        requireAllProperties: false,
        strict: true,
        satisfy: function (encQ, schema, stats, opt) {
            var numFn = (!query_1.isEnumSpec(encQ.aggregate) && !!encQ.aggregate ? 1 : 0) +
                (!query_1.isEnumSpec(encQ.autoCount) && !!encQ.autoCount ? 1 : 0) +
                (!query_1.isEnumSpec(encQ.bin) && !!encQ.bin ? 1 : 0) +
                (!query_1.isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit ? 1 : 0);
            return numFn <= 1;
        }
    }, {
        name: 'timeUnitAppliedForTemporal',
        description: 'Time unit should be applied to temporal field only.',
        properties: [property_1.Property.TYPE, property_1.Property.TIMEUNIT],
        requireAllProperties: true,
        strict: true,
        satisfy: function (encQ, schema, stats, opt) {
            if (encQ.timeUnit && encQ.type !== type_1.Type.TEMPORAL) {
                return false;
            }
            return true;
        }
    },
    {
        name: 'typeMatchesPrimitiveType',
        description: 'Data type should be supported by field\'s primitive type.',
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        requireAllProperties: true,
        strict: true,
        satisfy: function (encQ, schema, stats, opt) {
            var primitiveType = schema.primitiveType(encQ.field);
            var type = encQ.type;
            switch (primitiveType) {
                case schema_1.PrimitiveType.BOOLEAN:
                case schema_1.PrimitiveType.STRING:
                    return type !== type_1.Type.QUANTITATIVE && type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.NUMBER:
                case schema_1.PrimitiveType.INTEGER:
                    return type !== type_1.Type.TEMPORAL;
                case schema_1.PrimitiveType.DATE:
                    return type === type_1.Type.TEMPORAL;
                case null:
                    return false;
            }
            throw new Error('Not implemented');
        }
    },
    {
        name: 'typeMatchesSchemaType',
        description: 'Enumerated data type of a field should match the field\'s type in the schema.',
        properties: [property_1.Property.FIELD, property_1.Property.TYPE],
        requireAllProperties: true,
        strict: false,
        satisfy: function (encQ, schema, stats, opt) {
            return schema.type(encQ.field) === encQ.type;
        }
    }, {
        name: 'maxCardinalityForCategoricalColor',
        description: 'Categorical channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD],
        requireAllProperties: true,
        strict: false,
        satisfy: function (encQ, schema, stats, opt) {
            if (encQ.channel === channel_1.Channel.COLOR && encQ.type === type_1.Type.NOMINAL) {
                return stats.cardinality(encQ) <= opt.maxCardinalityForCategoricalColor;
            }
            return true;
        }
    }, {
        name: 'maxCardinalityForFacet',
        description: 'Row/column channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        requireAllProperties: true,
        strict: false,
        satisfy: function (encQ, schema, stats, opt) {
            if (encQ.channel === channel_1.Channel.ROW || encQ.channel === channel_1.Channel.COLUMN) {
                return stats.cardinality(encQ) <= opt.maxCardinalityForFacet;
            }
            return true;
        }
    }, {
        name: 'maxCardinalityForShape',
        description: 'Shape channel should not have too high cardinality',
        properties: [property_1.Property.CHANNEL, property_1.Property.FIELD, property_1.Property.BIN, property_1.Property.TIMEUNIT],
        requireAllProperties: true,
        strict: false,
        satisfy: function (encQ, schema, stats, opt) {
            if (encQ.channel === channel_1.Channel.SHAPE) {
                return stats.cardinality(encQ) <= opt.maxCardinalityForShape;
            }
            return true;
        }
    }
].map(function (ec) { return new EncodingConstraintModel(ec); });
exports.ENCODING_CONSTRAINT_INDEX = exports.ENCODING_CONSTRAINTS.reduce(function (m, ec) {
    m[ec.name()] = ec;
    return m;
}, {});
exports.ENCODING_CONSTRAINTS_BY_PROPERTY = exports.ENCODING_CONSTRAINTS.reduce(function (m, c) {
    c.properties().forEach(function (prop) {
        m[prop] = m[prop] || [];
        m[prop].push(c);
    });
    return m;
}, {});

},{"../property":9,"../query":10,"../schema":11,"../util":13,"./base":2,"vega-lite/src/channel":25,"vega-lite/src/type":29}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var channel_1 = require('vega-lite/src/channel');
var mark_1 = require('vega-lite/src/mark');
var type_1 = require('vega-lite/src/type');
var base_1 = require('./base');
var property_1 = require('../property');
var query_1 = require('../query');
var util_1 = require('../util');
var SpecConstraintModel = (function (_super) {
    __extends(SpecConstraintModel, _super);
    function SpecConstraintModel(specConstraint) {
        _super.call(this, specConstraint);
    }
    SpecConstraintModel.prototype.satisfy = function (specQ, schema, stats, opt) {
        if (this.constraint.requireAllProperties) {
            var hasRequiredPropertyAsEnumSpec = util_1.some(this.constraint.properties, function (prop) {
                switch (prop) {
                    case property_1.Property.MARK:
                        return query_1.isEnumSpec(specQ.getMark());
                    case property_1.Property.CHANNEL:
                    case property_1.Property.AGGREGATE:
                    case property_1.Property.BIN:
                    case property_1.Property.TIMEUNIT:
                    case property_1.Property.FIELD:
                    case property_1.Property.TYPE:
                        return util_1.some(specQ.getEncodings(), function (encQ) {
                            return query_1.isEnumSpec(encQ[prop]);
                        });
                    default:
                        throw new Error('Unimplemnted');
                }
            });
            if (hasRequiredPropertyAsEnumSpec) {
                return true;
            }
        }
        return this.constraint.satisfy(specQ, schema, stats, opt);
    };
    return SpecConstraintModel;
}(base_1.AbstractConstraintModel));
exports.SpecConstraintModel = SpecConstraintModel;
function satisfyPreferredType(theType, configName) {
    return function (specQ, schema, stats, opt) {
        var xEncQ = specQ.getEncodingQueryByChannel(channel_1.Channel.X);
        var yEncQ = specQ.getEncodingQueryByChannel(channel_1.Channel.Y);
        var xIsTheType = xEncQ && xEncQ.type === theType;
        var yIsTheType = yEncQ && yEncQ.type === theType;
        return !yEncQ || !xEncQ ||
            (xIsTheType && yIsTheType) ||
            (!xIsTheType && !yIsTheType) ||
            (xIsTheType && opt[configName] === channel_1.Channel.X) ||
            (yIsTheType && opt[configName] === channel_1.Channel.Y);
    };
}
exports.SPEC_CONSTRAINTS = [
    {
        name: 'autoAddCount',
        description: 'Automatically adding count only for plots with only ordinal, binned quantitative, or temporal with timeunti fields.',
        properties: [property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.TYPE, property_1.Property.AUTOCOUNT],
        requireAllProperties: false,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            var hasAutoCount = util_1.some(specQ.getEncodings(), function (encQ) { return encQ.autoCount === true; });
            if (hasAutoCount) {
                return util_1.every(specQ.getEncodings(), function (encQ) {
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
                    throw new Error('Unsupported Type');
                });
            }
            else {
                var neverHaveAutoCount = util_1.every(specQ.enumSpecIndex.autoCount, function (indexTuple) {
                    return !query_1.isEnumSpec(specQ.getEncodingQueryByIndex(indexTuple.index).autoCount);
                });
                if (neverHaveAutoCount) {
                    return util_1.some(specQ.getEncodings(), function (encQ) {
                        if (encQ.type === type_1.Type.QUANTITATIVE) {
                            if (encQ.autoCount === false) {
                                return false;
                            }
                            else {
                                return !encQ.bin || query_1.isEnumSpec(encQ.bin);
                            }
                        }
                        else if (encQ.type === type_1.Type.TEMPORAL) {
                            return !encQ.timeUnit || query_1.isEnumSpec(encQ.timeUnit);
                        }
                        return false;
                    });
                }
            }
            return true;
        }
    },
    {
        name: 'channelPermittedByMarkType',
        description: 'Each encoding channel should be supported by the mark type',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        requireAllProperties: false,
        strict: true,
        satisfy: function (specQ, schema, stats, opt) {
            var mark = specQ.getMark();
            if (query_1.isEnumSpec(mark))
                return true;
            return util_1.every(specQ.getEncodings(), function (encQ) {
                if (query_1.isEnumSpec(encQ.channel))
                    return true;
                return channel_1.supportMark(encQ.channel, mark);
            });
        }
    },
    {
        name: 'hasAllRequiredChannelsForMark',
        description: 'All required channels for the specified mark should be specified',
        properties: [property_1.Property.CHANNEL, property_1.Property.MARK],
        requireAllProperties: true,
        strict: true,
        satisfy: function (specQ, schema, stats, opt) {
            var mark = specQ.getMark();
            switch (mark) {
                case mark_1.Mark.AREA:
                case mark_1.Mark.LINE:
                    return specQ.channelUsed(channel_1.Channel.X) && specQ.channelUsed(channel_1.Channel.Y);
                case mark_1.Mark.TEXT:
                    return specQ.channelUsed(channel_1.Channel.TEXT);
                case mark_1.Mark.BAR:
                case mark_1.Mark.CIRCLE:
                case mark_1.Mark.POINT:
                case mark_1.Mark.SQUARE:
                case mark_1.Mark.TICK:
                    return true;
                case mark_1.Mark.RULE:
                    return specQ.channelUsed(channel_1.Channel.X) || specQ.channelUsed(channel_1.Channel.Y);
            }
            throw new Error('hasAllRequiredChannelsForMark not implemented for mark' + mark);
        }
    },
    {
        name: 'omitFacetOverPositionalChannels',
        description: 'Do not use non-positional channels unless all positional channels are used',
        properties: [property_1.Property.CHANNEL],
        requireAllProperties: true,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            return specQ.channelUsed(channel_1.Channel.ROW) || specQ.channelUsed(channel_1.Channel.COLUMN) ?
                specQ.channelUsed(channel_1.Channel.X) && specQ.channelUsed(channel_1.Channel.Y) :
                true;
        }
    },
    {
        name: 'omitMultipleNonPositionalChannels',
        description: 'Do not use multiple non-positional encoding channel to avoid over-encoding.',
        properties: [property_1.Property.CHANNEL],
        requireAllProperties: false,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            var encodings = specQ.getEncodings();
            var nonPositionChannelCount = 0;
            for (var i = 0; i < encodings.length; i++) {
                var channel = encodings[i].channel;
                if (!query_1.isEnumSpec(channel)) {
                    if (channel === channel_1.Channel.COLOR || channel === channel_1.Channel.SHAPE || channel === channel_1.Channel.SIZE) {
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
        properties: [property_1.Property.CHANNEL],
        requireAllProperties: true,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            return util_1.some(channel_1.NONSPATIAL_CHANNELS, function (channel) { return specQ.channelUsed(channel); }) ?
                specQ.channelUsed(channel_1.Channel.X) && specQ.channelUsed(channel_1.Channel.Y) :
                true;
        }
    },
    {
        name: 'omitRawBarLineArea',
        description: 'Don\'t use bar, line or area to visualize raw plot as they often lead to occlusion.',
        properties: [property_1.Property.MARK, property_1.Property.AGGREGATE],
        requireAllProperties: true,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            if (util_1.isin(specQ.getMark(), [mark_1.Mark.BAR, mark_1.Mark.LINE, mark_1.Mark.AREA])) {
                return specQ.isAggregate();
            }
            return true;
        }
    },
    {
        name: 'omitRawContinuousFieldForAggregatePlot',
        description: 'Aggregate plot should not use raw continuous field as group by values. ' +
            '(Quantitative should be binned. Temporal should have time unit.)',
        properties: [property_1.Property.AGGREGATE, property_1.Property.TIMEUNIT, property_1.Property.BIN, property_1.Property.TYPE],
        requireAllProperties: false,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            if (specQ.isAggregate()) {
                return util_1.every(specQ.getEncodings(), function (encQ) {
                    if (encQ.type === type_1.Type.TEMPORAL) {
                        return !!encQ.timeUnit;
                    }
                    if (encQ.type === type_1.Type.QUANTITATIVE) {
                        return !!encQ.bin || !!encQ.aggregate;
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
        properties: [property_1.Property.FIELD],
        requireAllProperties: false,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            var usedField = {};
            return util_1.every(specQ.getEncodings(), function (encQ) {
                if (encQ.field && !query_1.isEnumSpec(encQ.field)) {
                    if (usedField[encQ.field]) {
                        return false;
                    }
                    usedField[encQ.field] = true;
                    return true;
                }
                return true;
            });
        }
    },
    {
        name: 'omitVerticalDotPlot',
        description: 'Do not output vertical dot plot.',
        properties: [property_1.Property.CHANNEL],
        requireAllProperties: false,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            var encodings = specQ.getEncodings();
            if (encodings.length === 1 && encodings[0].channel === channel_1.Channel.Y) {
                return false;
            }
            return true;
        }
    },
    {
        name: 'preferredBinAxis',
        description: 'Always use preferred axis for a binned field.',
        properties: [property_1.Property.CHANNEL, property_1.Property.BIN],
        requireAllProperties: true,
        strict: false,
        satisfy: function (specQ, schema, stats, opt) {
            var xEncQ = specQ.getEncodingQueryByChannel(channel_1.Channel.X);
            var yEncQ = specQ.getEncodingQueryByChannel(channel_1.Channel.Y);
            var xBin = xEncQ && !!xEncQ.bin;
            var yBin = yEncQ && !!yEncQ.bin;
            return (xBin && yBin) ||
                (!xBin && !yBin) ||
                (xBin && opt.preferredBinAxis === channel_1.Channel.X) ||
                (yBin && opt.preferredBinAxis === channel_1.Channel.Y);
        }
    },
    {
        name: 'preferredTemporalAxis',
        description: 'Always use preferred axis for a time field.',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE],
        requireAllProperties: true,
        strict: false,
        satisfy: satisfyPreferredType(type_1.Type.TEMPORAL, 'preferredTemporalAxis')
    },
    {
        name: 'preferredOrdinalAxis',
        description: 'Always use preferred axis for an ordinal field.',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE],
        requireAllProperties: true,
        strict: false,
        satisfy: satisfyPreferredType(type_1.Type.ORDINAL, 'preferredOrdinalAxis')
    },
    {
        name: 'preferredNominalAxis',
        description: 'Always use preferred axis for a nominal field.',
        properties: [property_1.Property.CHANNEL, property_1.Property.TYPE],
        requireAllProperties: true,
        strict: false,
        satisfy: satisfyPreferredType(type_1.Type.NOMINAL, 'preferredNominalAxis')
    },
    {
        name: 'noRepeatedChannel',
        description: 'Each encoding channel should only be used once.',
        properties: [property_1.Property.CHANNEL],
        requireAllProperties: false,
        strict: true,
        satisfy: function (specQ, schema, stats, opt) {
            var usedChannel = {};
            return util_1.every(specQ.getEncodings(), function (encQ) {
                if (!query_1.isEnumSpec(encQ.channel)) {
                    if (usedChannel[encQ.channel]) {
                        return false;
                    }
                    usedChannel[encQ.channel] = true;
                    return true;
                }
                return true;
            });
        }
    }
].map(function (sc) { return new SpecConstraintModel(sc); });
exports.SPEC_CONSTRAINT_INDEX = exports.SPEC_CONSTRAINTS.reduce(function (m, c) {
    m[c.name()] = c;
    return m;
}, {});
exports.SPEC_CONSTRAINTS_BY_PROPERTY = exports.SPEC_CONSTRAINTS.reduce(function (m, c) {
    c.properties().forEach(function (prop) {
        m[prop] = m[prop] || [];
        m[prop].push(c);
    });
    return m;
}, {});

},{"../property":9,"../query":10,"../util":13,"./base":2,"vega-lite/src/channel":25,"vega-lite/src/mark":27,"vega-lite/src/type":29}],5:[function(require,module,exports){
"use strict";
exports.version = '0.0.1';
var cqlGenerate = require('./generate');
var cqlGroup = require('./group');
var cqlModel = require('./model');
var cqlProperty = require('./property');
var cqlQuery = require('./query');
var cqlSchema = require('./schema');
var cqlStats = require('./stats');
var cqlUtil = require('./util');
exports.generate = cqlGenerate.generate;
exports.group = cqlGroup;
exports.model = cqlModel;
exports.property = cqlProperty;
exports.query = cqlQuery;
exports.schema = cqlSchema;
exports.stats = cqlStats;
exports.util = cqlUtil;

},{"./generate":6,"./group":7,"./model":8,"./property":9,"./query":10,"./schema":11,"./stats":12,"./util":13}],6:[function(require,module,exports){
"use strict";
var encoding_1 = require('./constraint/encoding');
var spec_1 = require('./constraint/spec');
var model_1 = require('./model');
var property_1 = require('./property');
var query_1 = require('./query');
var util_1 = require('./util');
exports.ENUMERATOR_INDEX = {};
function generate(specQuery, schema, stats, opt) {
    if (opt === void 0) { opt = {}; }
    opt = util_1.extend({}, query_1.DEFAULT_QUERY_CONFIG, opt);
    var specModel = model_1.SpecQueryModel.build(specQuery, schema, opt);
    var enumSpecIndex = specModel.enumSpecIndex;
    var answerSet = [specModel];
    opt.propertyPrecedence.forEach(function (prop) {
        if (enumSpecIndex[prop]) {
            var reducer = exports.ENUMERATOR_INDEX[prop](enumSpecIndex, schema, stats, opt);
            answerSet = answerSet.reduce(reducer, []);
        }
    });
    return answerSet;
}
exports.generate = generate;
exports.ENUMERATOR_INDEX[property_1.Property.MARK] = function (enumSpecIndex, schema, stats, opt) {
    return function (answerSet, specQ) {
        var markEnumSpec = specQ.getMark();
        markEnumSpec.enumValues.forEach(function (mark) {
            specQ.setMark(mark);
            var specConstraints = spec_1.SPEC_CONSTRAINTS_BY_PROPERTY[property_1.Property.MARK] || [];
            var satisfySpecConstraints = util_1.every(specConstraints, function (c) {
                if (c.strict() || !!opt[c.name()]) {
                    var satisfy = c.satisfy(specQ, schema, stats, opt);
                    if (!satisfy && opt.verbose) {
                        console.log(c.name() + ' failed with ' + specQ.toShorthand() + ' for mark');
                    }
                    return satisfy;
                }
                return true;
            });
            if (satisfySpecConstraints) {
                answerSet.push(specQ.duplicate());
            }
        });
        specQ.resetMark();
        return answerSet;
    };
};
property_1.ENCODING_PROPERTIES.forEach(function (prop) {
    exports.ENUMERATOR_INDEX[prop] = EncodingPropertyGeneratorFactory(prop);
});
function EncodingPropertyGeneratorFactory(prop) {
    return function (enumSpecIndex, schema, stats, opt) {
        return function (answerSet, specQ) {
            var indexTuples = enumSpecIndex[prop];
            function enumerate(jobIndex) {
                if (jobIndex === indexTuples.length) {
                    answerSet.push(specQ.duplicate());
                    return;
                }
                var indexTuple = indexTuples[jobIndex];
                var encQ = specQ.getEncodingQueryByIndex(indexTuple.index);
                if (encQ.autoCount === false) {
                    enumerate(jobIndex + 1);
                }
                else {
                    var propEnumSpec = specQ.getEncodingProperty(indexTuple.index, prop);
                    propEnumSpec.enumValues.forEach(function (propVal) {
                        specQ.setEncodingProperty(indexTuple.index, prop, propVal, indexTuple.enumSpec);
                        var encodingConstraints = encoding_1.ENCODING_CONSTRAINTS_BY_PROPERTY[prop] || [];
                        var satisfyEncodingConstraints = util_1.every(encodingConstraints, function (c) {
                            if (c.strict() || !!opt[c.name()]) {
                                var satisfy = c.satisfy(specQ.getEncodingQueryByIndex(indexTuple.index), schema, stats, opt);
                                if (!satisfy && opt.verbose) {
                                    console.log(c.name() + ' failed with ' + specQ.toShorthand() + ' for ' + indexTuple.enumSpec.name);
                                }
                                return satisfy;
                            }
                            return true;
                        });
                        if (!satisfyEncodingConstraints) {
                            return;
                        }
                        var specConstraints = spec_1.SPEC_CONSTRAINTS_BY_PROPERTY[prop] || [];
                        var satisfySpecConstraints = util_1.every(specConstraints, function (c) {
                            if (c.strict() || !!opt[c.name()]) {
                                var satisfy = c.satisfy(specQ, schema, stats, opt);
                                if (!satisfy && opt.verbose) {
                                    console.log(c.name() + ' failed with ' + specQ.toShorthand() + ' for ' + indexTuple.enumSpec.name);
                                }
                                return satisfy;
                            }
                            return true;
                        });
                        if (!satisfySpecConstraints) {
                            return;
                        }
                        enumerate(jobIndex + 1);
                    });
                    specQ.resetEncodingProperty(indexTuple.index, prop, indexTuple.enumSpec);
                }
            }
            enumerate(0);
            return answerSet;
        };
    };
}
exports.EncodingPropertyGeneratorFactory = EncodingPropertyGeneratorFactory;

},{"./constraint/encoding":3,"./constraint/spec":4,"./model":8,"./property":9,"./query":10,"./util":13}],7:[function(require,module,exports){
"use strict";
var channel_1 = require('vega-lite/src/channel');
var query_1 = require('./query');
function group(specQueries, keyFn) {
    return specQueries.reduce(function (groups, specQ) {
        var name = keyFn(specQ);
        groups[name] = groups[name] || [];
        groups[name].push(specQ);
        return groups;
    }, {});
}
exports.group = group;
function dataKey(specQ) {
    return specQ.getEncodings().map(query_1.stringifyEncodingQueryFieldDef)
        .sort()
        .join('|');
}
exports.dataKey = dataKey;
function channelType(channel) {
    if (query_1.isEnumSpec(channel)) {
        return query_1.SHORT_ENUM_SPEC + '';
    }
    var c = channel;
    switch (c) {
        case channel_1.Channel.X:
        case channel_1.Channel.Y:
            return 'xy';
        case channel_1.Channel.ROW:
        case channel_1.Channel.COLUMN:
            return 'facet';
        case channel_1.Channel.COLOR:
        case channel_1.Channel.SIZE:
        case channel_1.Channel.SHAPE:
        case channel_1.Channel.OPACITY:
            return 'non-xy';
        case channel_1.Channel.TEXT:
        case channel_1.Channel.DETAIL:
        case channel_1.Channel.PATH:
        case channel_1.Channel.ORDER:
            return c + '';
    }
    console.warn('channel type not implemented for ' + c);
    return c + '';
}
function encodingKey(specQ) {
    return specQ.getEncodings().map(function (encQ) {
        var fieldDef = query_1.stringifyEncodingQueryFieldDef(encQ);
        return channelType(encQ.channel) + ':' + fieldDef;
    })
        .sort()
        .join('|');
}
exports.encodingKey = encodingKey;

},{"./query":10,"vega-lite/src/channel":25}],8:[function(require,module,exports){
"use strict";
var aggregate_1 = require('vega-lite/src/aggregate');
var type_1 = require('vega-lite/src/type');
var property_1 = require('./property');
var query_1 = require('./query');
var util_1 = require('./util');
function getDefaultName(prop) {
    switch (prop) {
        case property_1.Property.MARK:
            return 'm';
        case property_1.Property.CHANNEL:
            return 'c';
        case property_1.Property.AGGREGATE:
            return 'a';
        case property_1.Property.AUTOCOUNT:
            return '#';
        case property_1.Property.BIN:
            return 'b';
        case property_1.Property.TIMEUNIT:
            return 'tu';
        case property_1.Property.FIELD:
            return 'f';
        case property_1.Property.TYPE:
            return 't';
    }
    throw new Error('Default name undefined');
}
function getDefaultEnumValues(prop, schema, opt) {
    switch (prop) {
        case property_1.Property.FIELD:
            return schema.fields();
        case property_1.Property.BIN:
        case property_1.Property.AUTOCOUNT:
            return [false, true];
        case property_1.Property.MARK:
        case property_1.Property.CHANNEL:
        case property_1.Property.AGGREGATE:
        case property_1.Property.TIMEUNIT:
        case property_1.Property.TYPE:
            return opt[prop + 's'] || [];
    }
    throw new Error('No default enumValues for ' + prop);
}
exports.getDefaultEnumValues = getDefaultEnumValues;
var SpecQueryModel = (function () {
    function SpecQueryModel(spec, enumSpecIndex, schema, enumSpecAssignment) {
        if (enumSpecAssignment === void 0) { enumSpecAssignment = {}; }
        this._spec = spec;
        this._encodingMap = spec.encodings.reduce(function (m, encQ) {
            if (!query_1.isEnumSpec(encQ.channel)) {
                m[encQ.channel] = encQ;
            }
            return m;
        }, {});
        this._enumSpecIndex = enumSpecIndex;
        this._enumSpecAssignment = enumSpecAssignment;
        this._schema = schema;
    }
    SpecQueryModel.build = function (specQ, schema, opt) {
        specQ = util_1.duplicate(specQ);
        var enumSpecIndex = {};
        if (query_1.isEnumSpec(specQ.mark)) {
            var name_1 = getDefaultName(property_1.Property.MARK);
            specQ.mark = query_1.initEnumSpec(specQ.mark, name_1, opt.marks);
            enumSpecIndex.mark = { enumSpec: specQ.mark };
        }
        specQ.encodings.forEach(function (encQ, index) {
            if (encQ.autoCount !== undefined) {
                console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');
                encQ.type = type_1.Type.QUANTITATIVE;
            }
            if (encQ.type === undefined) {
                encQ.type = query_1.SHORT_ENUM_SPEC;
            }
            property_1.ENCODING_PROPERTIES.forEach(function (prop) {
                if (query_1.isEnumSpec(encQ[prop])) {
                    var defaultEnumSpecName = getDefaultName(prop) + index;
                    var defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
                    encQ[prop] = query_1.initEnumSpec(encQ[prop], defaultEnumSpecName, defaultEnumValues);
                    (enumSpecIndex[prop] = enumSpecIndex[prop] || []).push({
                        enumSpec: encQ[prop],
                        index: index
                    });
                }
            });
        });
        if (opt.autoAddCount) {
            var countEncQ_1 = {
                channel: {
                    name: getDefaultName(property_1.Property.CHANNEL) + specQ.encodings.length,
                    enumValues: getDefaultEnumValues(property_1.Property.CHANNEL, schema, opt)
                },
                autoCount: {
                    name: getDefaultName(property_1.Property.AUTOCOUNT) + specQ.encodings.length,
                    enumValues: [false, true]
                },
                type: type_1.Type.QUANTITATIVE
            };
            specQ.encodings.push(countEncQ_1);
            var index_1 = specQ.encodings.length - 1;
            [property_1.Property.CHANNEL, property_1.Property.AUTOCOUNT].forEach(function (prop) {
                (enumSpecIndex[prop] = enumSpecIndex[prop] || []).push({
                    enumSpec: countEncQ_1[prop],
                    index: index_1
                });
            });
        }
        return new SpecQueryModel(specQ, enumSpecIndex, schema);
    };
    Object.defineProperty(SpecQueryModel.prototype, "enumSpecIndex", {
        get: function () {
            return this._enumSpecIndex;
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
        return new SpecQueryModel(util_1.duplicate(this._spec), this._enumSpecIndex, this._schema, util_1.duplicate(this._enumSpecAssignment));
    };
    SpecQueryModel.prototype.setMark = function (mark) {
        var name = this._spec.mark.name;
        this._enumSpecAssignment[name] = this._spec.mark = mark;
    };
    SpecQueryModel.prototype.resetMark = function () {
        var enumSpec = this._spec.mark = this._enumSpecIndex.mark.enumSpec;
        delete this._enumSpecAssignment[enumSpec.name];
    };
    SpecQueryModel.prototype.getMark = function () {
        return this._spec.mark;
    };
    SpecQueryModel.prototype.getEncodingProperty = function (index, prop) {
        return this._spec.encodings[index][prop];
    };
    SpecQueryModel.prototype.setEncodingProperty = function (index, prop, value, enumSpec) {
        var encQ = this._spec.encodings[index];
        if (prop === property_1.Property.CHANNEL && encQ.channel && !query_1.isEnumSpec(encQ.channel)) {
            delete this._encodingMap[encQ.channel];
        }
        encQ[prop] = value;
        this._enumSpecAssignment[enumSpec.name] = value;
        if (prop === property_1.Property.CHANNEL) {
            this._encodingMap[value] = encQ;
        }
    };
    SpecQueryModel.prototype.resetEncodingProperty = function (index, prop, enumSpec) {
        var encQ = this._spec.encodings[index];
        if (prop === property_1.Property.CHANNEL) {
            delete this._encodingMap[encQ.channel];
        }
        encQ[prop] = enumSpec;
        delete this._enumSpecAssignment[enumSpec.name];
    };
    SpecQueryModel.prototype.channelUsed = function (channel) {
        return !!this._encodingMap[channel];
    };
    SpecQueryModel.prototype.getEncodings = function () {
        return this._spec.encodings;
    };
    SpecQueryModel.prototype.getEncodingQueryByChannel = function (channel) {
        return this._encodingMap[channel];
    };
    SpecQueryModel.prototype.getEncodingQueryByIndex = function (i) {
        return this._spec.encodings[i];
    };
    SpecQueryModel.prototype.isDimension = function (channel) {
        var encQ = this._encodingMap[channel];
        return encQ && query_1.isDimension(encQ);
    };
    SpecQueryModel.prototype.isMeasure = function (channel) {
        var encQ = this._encodingMap[channel];
        return encQ && query_1.isMeasure(encQ);
    };
    SpecQueryModel.prototype.isAggregate = function () {
        return util_1.some(this._spec.encodings, function (encQ) {
            return (!query_1.isEnumSpec(encQ.aggregate) && !!encQ.aggregate) || encQ.autoCount === true;
        });
    };
    SpecQueryModel.prototype.toShorthand = function () {
        return query_1.stringifySpecQuery(this._spec);
    };
    SpecQueryModel.prototype.toSpec = function (data) {
        if (query_1.isEnumSpec(this._spec.mark))
            return null;
        var encoding = {};
        for (var i = 0; i < this._spec.encodings.length; i++) {
            var encQ = this._spec.encodings[i];
            if (query_1.isEnumSpec(encQ.channel))
                return null;
            var fieldDef = {};
            var PROPERTIES = [property_1.Property.AGGREGATE, property_1.Property.BIN, property_1.Property.TIMEUNIT, property_1.Property.FIELD, property_1.Property.TYPE];
            for (var j = 0; j < PROPERTIES.length; j++) {
                var prop = PROPERTIES[j];
                if (query_1.isEnumSpec(encQ[prop]))
                    return null;
                if (encQ[prop] !== undefined) {
                    fieldDef[prop] = encQ[prop];
                }
            }
            if (encQ.autoCount === true) {
                fieldDef.aggregate = aggregate_1.AggregateOp.COUNT;
                fieldDef.field = '*';
                fieldDef.type = type_1.Type.QUANTITATIVE;
            }
            else if (encQ.autoCount === false) {
                continue;
            }
            encoding[encQ.channel] = fieldDef;
        }
        return util_1.extend(data ? { data: data } : {}, {
            mark: this._spec.mark,
            encoding: encoding
        });
    };
    return SpecQueryModel;
}());
exports.SpecQueryModel = SpecQueryModel;

},{"./property":9,"./query":10,"./util":13,"vega-lite/src/aggregate":24,"vega-lite/src/type":29}],9:[function(require,module,exports){
"use strict";
(function (Property) {
    Property[Property["MARK"] = 'mark'] = "MARK";
    Property[Property["CHANNEL"] = 'channel'] = "CHANNEL";
    Property[Property["AGGREGATE"] = 'aggregate'] = "AGGREGATE";
    Property[Property["AUTOCOUNT"] = 'autoCount'] = "AUTOCOUNT";
    Property[Property["BIN"] = 'bin'] = "BIN";
    Property[Property["TIMEUNIT"] = 'timeUnit'] = "TIMEUNIT";
    Property[Property["FIELD"] = 'field'] = "FIELD";
    Property[Property["TYPE"] = 'type'] = "TYPE";
})(exports.Property || (exports.Property = {}));
var Property = exports.Property;
exports.ENCODING_PROPERTIES = [
    Property.CHANNEL,
    Property.BIN,
    Property.TIMEUNIT,
    Property.AGGREGATE,
    Property.AUTOCOUNT,
    Property.FIELD,
    Property.TYPE
];

},{}],10:[function(require,module,exports){
"use strict";
var channel_1 = require('vega-lite/src/channel');
var aggregate_1 = require('vega-lite/src/aggregate');
var mark_1 = require('vega-lite/src/mark');
var timeunit_1 = require('vega-lite/src/timeunit');
var Type_1 = require('vega-lite/src/Type');
var property_1 = require('./property');
var util_1 = require('./util');
exports.DEFAULT_QUERY_CONFIG = {
    verbose: false,
    propertyPrecedence: [
        property_1.Property.TYPE,
        property_1.Property.FIELD,
        property_1.Property.BIN,
        property_1.Property.TIMEUNIT,
        property_1.Property.AGGREGATE,
        property_1.Property.AUTOCOUNT,
        property_1.Property.CHANNEL,
        property_1.Property.MARK
    ],
    marks: [mark_1.Mark.POINT, mark_1.Mark.BAR, mark_1.Mark.LINE, mark_1.Mark.AREA, mark_1.Mark.TICK],
    channels: [channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN, channel_1.SIZE, channel_1.COLOR],
    aggregates: [undefined, aggregate_1.AggregateOp.MEAN],
    timeUnits: [timeunit_1.TimeUnit.MONTH],
    types: [Type_1.Type.NOMINAL, Type_1.Type.ORDINAL, Type_1.Type.QUANTITATIVE, Type_1.Type.TEMPORAL],
    autoAddCount: false,
    omitFacetOverPositionalChannels: true,
    omitMultipleNonPositionalChannels: true,
    omitRawBarLineArea: true,
    omitRawContinuousFieldForAggregatePlot: true,
    omitRepeatedField: true,
    omitNonPositionalOverPositionalChannels: true,
    omitVerticalDotPlot: true,
    preferredBinAxis: channel_1.Channel.X,
    preferredTemporalAxis: channel_1.Channel.X,
    preferredOrdinalAxis: channel_1.Channel.Y,
    preferredNominalAxis: channel_1.Channel.Y,
    maxCardinalityForCategoricalColor: 20,
    maxCardinalityForFacet: 10,
    maxCardinalityForShape: 6,
    typeMatchesSchemaType: true
};
(function (ShortEnumSpec) {
    ShortEnumSpec[ShortEnumSpec["ENUMSPEC"] = '?'] = "ENUMSPEC";
})(exports.ShortEnumSpec || (exports.ShortEnumSpec = {}));
var ShortEnumSpec = exports.ShortEnumSpec;
exports.SHORT_ENUM_SPEC = ShortEnumSpec.ENUMSPEC;
function isEnumSpec(prop) {
    return prop === exports.SHORT_ENUM_SPEC || (prop !== undefined && !!prop.enumValues);
}
exports.isEnumSpec = isEnumSpec;
function initEnumSpec(prop, defaultName, defaultEnumValues) {
    return {
        name: prop.name || defaultName,
        enumValues: prop.enumValues || defaultEnumValues
    };
}
exports.initEnumSpec = initEnumSpec;
function enumSpecShort(value) {
    return (isEnumSpec(value) ? exports.SHORT_ENUM_SPEC : value) + '';
}
function stringifySpecQuery(specQ) {
    var mark = enumSpecShort(specQ.mark);
    var encodings = specQ.encodings.map(stringifyEncodingQuery)
        .sort()
        .join('|');
    return mark + '|' +
        encodings;
}
exports.stringifySpecQuery = stringifySpecQuery;
function isDimension(encQ) {
    return util_1.isin(encQ.type, [Type_1.Type.NOMINAL, Type_1.Type.ORDINAL]) ||
        (!isEnumSpec(encQ.bin) && !!encQ.bin) ||
        (!isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit);
}
exports.isDimension = isDimension;
function isMeasure(encQ) {
    return (encQ.type === Type_1.Type.QUANTITATIVE && !encQ.bin) ||
        (encQ.type === Type_1.Type.TEMPORAL && !encQ.timeUnit);
}
exports.isMeasure = isMeasure;
function stringifyEncodingQuery(encQ) {
    return enumSpecShort(encQ.channel) + ':' + stringifyEncodingQueryFieldDef(encQ);
}
exports.stringifyEncodingQuery = stringifyEncodingQuery;
function stringifyEncodingQueryFieldDef(encQ) {
    var fn = null;
    if (encQ.aggregate && !isEnumSpec(encQ.aggregate)) {
        fn = encQ.aggregate;
    }
    else if (encQ.timeUnit && !isEnumSpec(encQ.timeUnit)) {
        fn = encQ.timeUnit;
    }
    else if (encQ.bin && !isEnumSpec(encQ.bin)) {
        fn = 'bin';
    }
    else if (encQ.autoCount && !isEnumSpec(encQ.autoCount)) {
        fn = 'count';
    }
    else if ((encQ.aggregate && isEnumSpec(encQ.aggregate)) ||
        (encQ.autoCount && isEnumSpec(encQ.autoCount)) ||
        (encQ.timeUnit && isEnumSpec(encQ.timeUnit)) ||
        (encQ.bin && isEnumSpec(encQ.bin))) {
        fn = exports.SHORT_ENUM_SPEC + '';
    }
    var fieldType = enumSpecShort(encQ.field || '*') + ',' + enumSpecShort(encQ.type || Type_1.Type.QUANTITATIVE).substr(0, 1);
    return (fn ? fn + '(' + fieldType + ')' : fieldType);
}
exports.stringifyEncodingQueryFieldDef = stringifyEncodingQueryFieldDef;

},{"./property":9,"./util":13,"vega-lite/src/Type":23,"vega-lite/src/aggregate":24,"vega-lite/src/channel":25,"vega-lite/src/mark":27,"vega-lite/src/timeunit":28}],11:[function(require,module,exports){
"use strict";
var Schema = (function () {
    function Schema(fieldSchemas) {
        this.fieldSchemas = fieldSchemas;
        this.fieldSchemaIndex = fieldSchemas.reduce(function (m, fieldSchema) {
            m[fieldSchema.field] = fieldSchema;
            return m;
        }, {});
    }
    Schema.prototype.fields = function () {
        return this.fieldSchemas.map(function (fieldSchema) { return fieldSchema.field; });
    };
    Schema.prototype.primitiveType = function (field) {
        return this.fieldSchemaIndex[field] ? this.fieldSchemaIndex[field].primitiveType : null;
    };
    Schema.prototype.type = function (field) {
        return this.fieldSchemaIndex[field] ? this.fieldSchemaIndex[field].type : null;
    };
    return Schema;
}());
exports.Schema = Schema;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["STRING"] = 'string'] = "STRING";
    PrimitiveType[PrimitiveType["NUMBER"] = 'number'] = "NUMBER";
    PrimitiveType[PrimitiveType["INTEGER"] = 'integer'] = "INTEGER";
    PrimitiveType[PrimitiveType["BOOLEAN"] = 'boolean'] = "BOOLEAN";
    PrimitiveType[PrimitiveType["DATE"] = 'date'] = "DATE";
})(exports.PrimitiveType || (exports.PrimitiveType = {}));
var PrimitiveType = exports.PrimitiveType;

},{}],12:[function(require,module,exports){
"use strict";
var Stats = (function () {
    function Stats(fieldsStats) {
        this._fieldsStats = fieldsStats;
        this._fieldStatsIndex = fieldsStats.reduce(function (m, fieldStats) {
            m[fieldStats.field] = fieldStats;
            return m;
        }, {});
    }
    Stats.prototype.cardinality = function (encQ) {
        if (encQ.aggregate || encQ.autoCount) {
            return 1;
        }
        else if (encQ.bin) {
            return 1;
        }
        else if (encQ.timeUnit) {
            return 1;
        }
        return this._fieldStatsIndex[encQ.field].distinct;
    };
    return Stats;
}());
exports.Stats = Stats;

},{}],13:[function(require,module,exports){
"use strict";
function isin(item, array) {
    return array.indexOf(item) !== -1;
}
exports.isin = isin;
;
function keys(obj) {
    var k = [], x;
    for (x in obj) {
        k.push(x);
    }
    return k;
}
exports.keys = keys;
;
function duplicate(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.duplicate = duplicate;
;
function every(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
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
function extend(obj, b) {
    var rest = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rest[_i - 2] = arguments[_i];
    }
    for (var x, name, i = 1, len = arguments.length; i < len; ++i) {
        x = arguments[i];
        for (name in x) {
            obj[name] = x[name];
        }
    }
    return obj;
}
exports.extend = extend;
;

},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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

},{"../time":17,"../util":18}],16:[function(require,module,exports){
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
},{"./util":18}],17:[function(require,module,exports){
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
},{"d3-time":14}],18:[function(require,module,exports){
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
  return function(a,b) {
    var i, n, f, x, y;
    for (i=0, n=sort.length; i<n; ++i) {
      f = sort[i]; x = f(a); y = f(b);
      if (x < y) return -1 * sign[i];
      if (x > y) return sign[i];
    }
    return 0;
  };
};

u.cmp = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else if (a >= b) {
    return 0;
  } else if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  }
  return NaN;
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

},{"buffer":1}],19:[function(require,module,exports){
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

},{"jsonify":20}],20:[function(require,module,exports){
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

},{"./lib/parse":21,"./lib/stringify":22}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
"use strict";
(function (Type) {
    Type[Type["QUANTITATIVE"] = 'quantitative'] = "QUANTITATIVE";
    Type[Type["ORDINAL"] = 'ordinal'] = "ORDINAL";
    Type[Type["TEMPORAL"] = 'temporal'] = "TEMPORAL";
    Type[Type["NOMINAL"] = 'nominal'] = "NOMINAL";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
exports.QUANTITATIVE = Type.QUANTITATIVE;
exports.ORDINAL = Type.ORDINAL;
exports.TEMPORAL = Type.TEMPORAL;
exports.NOMINAL = Type.NOMINAL;
exports.SHORT_TYPE = {
    quantitative: 'Q',
    temporal: 'T',
    nominal: 'N',
    ordinal: 'O'
};
exports.TYPE_FROM_SHORT_TYPE = {
    Q: exports.QUANTITATIVE,
    T: exports.TEMPORAL,
    O: exports.ORDINAL,
    N: exports.NOMINAL
};
function getFullName(type) {
    var typeString = type;
    return exports.TYPE_FROM_SHORT_TYPE[typeString.toUpperCase()] ||
        typeString.toLowerCase();
}
exports.getFullName = getFullName;

},{}],24:[function(require,module,exports){
"use strict";
(function (AggregateOp) {
    AggregateOp[AggregateOp["VALUES"] = 'values'] = "VALUES";
    AggregateOp[AggregateOp["COUNT"] = 'count'] = "COUNT";
    AggregateOp[AggregateOp["VALID"] = 'valid'] = "VALID";
    AggregateOp[AggregateOp["MISSING"] = 'missing'] = "MISSING";
    AggregateOp[AggregateOp["DISTINCT"] = 'distinct'] = "DISTINCT";
    AggregateOp[AggregateOp["SUM"] = 'sum'] = "SUM";
    AggregateOp[AggregateOp["MEAN"] = 'mean'] = "MEAN";
    AggregateOp[AggregateOp["AVERAGE"] = 'average'] = "AVERAGE";
    AggregateOp[AggregateOp["VARIANCE"] = 'variance'] = "VARIANCE";
    AggregateOp[AggregateOp["VARIANCEP"] = 'variancep'] = "VARIANCEP";
    AggregateOp[AggregateOp["STDEV"] = 'stdev'] = "STDEV";
    AggregateOp[AggregateOp["STDEVP"] = 'stdevp'] = "STDEVP";
    AggregateOp[AggregateOp["MEDIAN"] = 'median'] = "MEDIAN";
    AggregateOp[AggregateOp["Q1"] = 'q1'] = "Q1";
    AggregateOp[AggregateOp["Q3"] = 'q3'] = "Q3";
    AggregateOp[AggregateOp["MODESKEW"] = 'modeskew'] = "MODESKEW";
    AggregateOp[AggregateOp["MIN"] = 'min'] = "MIN";
    AggregateOp[AggregateOp["MAX"] = 'max'] = "MAX";
    AggregateOp[AggregateOp["ARGMIN"] = 'argmin'] = "ARGMIN";
    AggregateOp[AggregateOp["ARGMAX"] = 'argmax'] = "ARGMAX";
})(exports.AggregateOp || (exports.AggregateOp = {}));
var AggregateOp = exports.AggregateOp;
exports.AGGREGATE_OPS = [
    AggregateOp.VALUES,
    AggregateOp.COUNT,
    AggregateOp.VALID,
    AggregateOp.MISSING,
    AggregateOp.DISTINCT,
    AggregateOp.SUM,
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.VARIANCE,
    AggregateOp.VARIANCEP,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MODESKEW,
    AggregateOp.MIN,
    AggregateOp.MAX,
    AggregateOp.ARGMIN,
    AggregateOp.ARGMAX,
];
exports.SHARED_DOMAIN_OPS = [
    AggregateOp.MEAN,
    AggregateOp.AVERAGE,
    AggregateOp.STDEV,
    AggregateOp.STDEVP,
    AggregateOp.MEDIAN,
    AggregateOp.Q1,
    AggregateOp.Q3,
    AggregateOp.MIN,
    AggregateOp.MAX,
];

},{}],25:[function(require,module,exports){
"use strict";
var util_1 = require('./util');
(function (Channel) {
    Channel[Channel["X"] = 'x'] = "X";
    Channel[Channel["Y"] = 'y'] = "Y";
    Channel[Channel["ROW"] = 'row'] = "ROW";
    Channel[Channel["COLUMN"] = 'column'] = "COLUMN";
    Channel[Channel["SHAPE"] = 'shape'] = "SHAPE";
    Channel[Channel["SIZE"] = 'size'] = "SIZE";
    Channel[Channel["COLOR"] = 'color'] = "COLOR";
    Channel[Channel["TEXT"] = 'text'] = "TEXT";
    Channel[Channel["DETAIL"] = 'detail'] = "DETAIL";
    Channel[Channel["LABEL"] = 'label'] = "LABEL";
    Channel[Channel["PATH"] = 'path'] = "PATH";
    Channel[Channel["ORDER"] = 'order'] = "ORDER";
    Channel[Channel["OPACITY"] = 'opacity'] = "OPACITY";
})(exports.Channel || (exports.Channel = {}));
var Channel = exports.Channel;
exports.X = Channel.X;
exports.Y = Channel.Y;
exports.ROW = Channel.ROW;
exports.COLUMN = Channel.COLUMN;
exports.SHAPE = Channel.SHAPE;
exports.SIZE = Channel.SIZE;
exports.COLOR = Channel.COLOR;
exports.TEXT = Channel.TEXT;
exports.DETAIL = Channel.DETAIL;
exports.LABEL = Channel.LABEL;
exports.PATH = Channel.PATH;
exports.ORDER = Channel.ORDER;
exports.OPACITY = Channel.OPACITY;
exports.CHANNELS = [exports.X, exports.Y, exports.ROW, exports.COLUMN, exports.SIZE, exports.SHAPE, exports.COLOR, exports.PATH, exports.ORDER, exports.OPACITY, exports.TEXT, exports.DETAIL, exports.LABEL];
exports.UNIT_CHANNELS = util_1.without(exports.CHANNELS, [exports.ROW, exports.COLUMN]);
exports.UNIT_SCALE_CHANNELS = util_1.without(exports.UNIT_CHANNELS, [exports.PATH, exports.ORDER, exports.DETAIL, exports.TEXT, exports.LABEL]);
exports.NONSPATIAL_CHANNELS = util_1.without(exports.UNIT_CHANNELS, [exports.X, exports.Y]);
exports.NONSPATIAL_SCALE_CHANNELS = util_1.without(exports.UNIT_SCALE_CHANNELS, [exports.X, exports.Y]);
;
function supportMark(channel, mark) {
    return !!getSupportedMark(channel)[mark];
}
exports.supportMark = supportMark;
function getSupportedMark(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.DETAIL:
        case exports.ORDER:
        case exports.OPACITY:
        case exports.ROW:
        case exports.COLUMN:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, line: true, area: true, text: true
            };
        case exports.SIZE:
            return {
                point: true, tick: true, rule: true, circle: true, square: true,
                bar: true, text: true
            };
        case exports.SHAPE:
            return { point: true };
        case exports.TEXT:
            return { text: true };
        case exports.PATH:
            return { line: true };
    }
    return {};
}
exports.getSupportedMark = getSupportedMark;
;
function getSupportedRole(channel) {
    switch (channel) {
        case exports.X:
        case exports.Y:
        case exports.COLOR:
        case exports.OPACITY:
        case exports.LABEL:
        case exports.DETAIL:
            return {
                measure: true,
                dimension: true
            };
        case exports.ROW:
        case exports.COLUMN:
        case exports.SHAPE:
            return {
                measure: false,
                dimension: true
            };
        case exports.SIZE:
        case exports.TEXT:
            return {
                measure: true,
                dimension: false
            };
        case exports.PATH:
            return {
                measure: false,
                dimension: true
            };
    }
    throw new Error('Invalid encoding channel' + channel);
}
exports.getSupportedRole = getSupportedRole;
function hasScale(channel) {
    return !util_1.contains([exports.DETAIL, exports.PATH, exports.TEXT, exports.LABEL, exports.ORDER], channel);
}
exports.hasScale = hasScale;

},{"./util":30}],26:[function(require,module,exports){
"use strict";
var channel_1 = require('./channel');
var util_1 = require('./util');
function countRetinal(encoding) {
    var count = 0;
    if (encoding.color) {
        count++;
    }
    if (encoding.opacity) {
        count++;
    }
    if (encoding.size) {
        count++;
    }
    if (encoding.shape) {
        count++;
    }
    return count;
}
exports.countRetinal = countRetinal;
function channels(encoding) {
    return channel_1.CHANNELS.filter(function (channel) {
        return has(encoding, channel);
    });
}
exports.channels = channels;
function has(encoding, channel) {
    var channelEncoding = encoding && encoding[channel];
    return channelEncoding && (channelEncoding.field !== undefined ||
        (util_1.isArray(channelEncoding) && channelEncoding.length > 0));
}
exports.has = has;
function isAggregate(encoding) {
    return util_1.any(channel_1.CHANNELS, function (channel) {
        if (has(encoding, channel) && encoding[channel].aggregate) {
            return true;
        }
        return false;
    });
}
exports.isAggregate = isAggregate;
function fieldDefs(encoding) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            if (util_1.isArray(encoding[channel])) {
                encoding[channel].forEach(function (fieldDef) {
                    arr.push(fieldDef);
                });
            }
            else {
                arr.push(encoding[channel]);
            }
        }
    });
    return arr;
}
exports.fieldDefs = fieldDefs;
;
function forEach(encoding, f, thisArg) {
    channelMappingForEach(channel_1.CHANNELS, encoding, f, thisArg);
}
exports.forEach = forEach;
function channelMappingForEach(channels, mapping, f, thisArg) {
    var i = 0;
    channels.forEach(function (channel) {
        if (has(mapping, channel)) {
            if (util_1.isArray(mapping[channel])) {
                mapping[channel].forEach(function (fieldDef) {
                    f.call(thisArg, fieldDef, channel, i++);
                });
            }
            else {
                f.call(thisArg, mapping[channel], channel, i++);
            }
        }
    });
}
exports.channelMappingForEach = channelMappingForEach;
function map(encoding, f, thisArg) {
    return channelMappingMap(channel_1.CHANNELS, encoding, f, thisArg);
}
exports.map = map;
function channelMappingMap(channels, mapping, f, thisArg) {
    var arr = [];
    channels.forEach(function (channel) {
        if (has(mapping, channel)) {
            if (util_1.isArray(mapping[channel])) {
                mapping[channel].forEach(function (fieldDef) {
                    arr.push(f.call(thisArg, fieldDef, channel));
                });
            }
            else {
                arr.push(f.call(thisArg, mapping[channel], channel));
            }
        }
    });
    return arr;
}
exports.channelMappingMap = channelMappingMap;
function reduce(encoding, f, init, thisArg) {
    return channelMappingReduce(channel_1.CHANNELS, encoding, f, init, thisArg);
}
exports.reduce = reduce;
function channelMappingReduce(channels, mapping, f, init, thisArg) {
    var r = init;
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(mapping, channel)) {
            if (util_1.isArray(mapping[channel])) {
                mapping[channel].forEach(function (fieldDef) {
                    r = f.call(thisArg, r, fieldDef, channel);
                });
            }
            else {
                r = f.call(thisArg, r, mapping[channel], channel);
            }
        }
    });
    return r;
}
exports.channelMappingReduce = channelMappingReduce;

},{"./channel":25,"./util":30}],27:[function(require,module,exports){
"use strict";
(function (Mark) {
    Mark[Mark["AREA"] = 'area'] = "AREA";
    Mark[Mark["BAR"] = 'bar'] = "BAR";
    Mark[Mark["LINE"] = 'line'] = "LINE";
    Mark[Mark["POINT"] = 'point'] = "POINT";
    Mark[Mark["TEXT"] = 'text'] = "TEXT";
    Mark[Mark["TICK"] = 'tick'] = "TICK";
    Mark[Mark["RULE"] = 'rule'] = "RULE";
    Mark[Mark["CIRCLE"] = 'circle'] = "CIRCLE";
    Mark[Mark["SQUARE"] = 'square'] = "SQUARE";
})(exports.Mark || (exports.Mark = {}));
var Mark = exports.Mark;
exports.AREA = Mark.AREA;
exports.BAR = Mark.BAR;
exports.LINE = Mark.LINE;
exports.POINT = Mark.POINT;
exports.TEXT = Mark.TEXT;
exports.TICK = Mark.TICK;
exports.RULE = Mark.RULE;
exports.CIRCLE = Mark.CIRCLE;
exports.SQUARE = Mark.SQUARE;

},{}],28:[function(require,module,exports){
"use strict";
(function (TimeUnit) {
    TimeUnit[TimeUnit["YEAR"] = 'year'] = "YEAR";
    TimeUnit[TimeUnit["MONTH"] = 'month'] = "MONTH";
    TimeUnit[TimeUnit["DAY"] = 'day'] = "DAY";
    TimeUnit[TimeUnit["DATE"] = 'date'] = "DATE";
    TimeUnit[TimeUnit["HOURS"] = 'hours'] = "HOURS";
    TimeUnit[TimeUnit["MINUTES"] = 'minutes'] = "MINUTES";
    TimeUnit[TimeUnit["SECONDS"] = 'seconds'] = "SECONDS";
    TimeUnit[TimeUnit["MILLISECONDS"] = 'milliseconds'] = "MILLISECONDS";
    TimeUnit[TimeUnit["YEARMONTH"] = 'yearmonth'] = "YEARMONTH";
    TimeUnit[TimeUnit["YEARMONTHDAY"] = 'yearmonthday'] = "YEARMONTHDAY";
    TimeUnit[TimeUnit["YEARMONTHDATE"] = 'yearmonthdate'] = "YEARMONTHDATE";
    TimeUnit[TimeUnit["YEARDAY"] = 'yearday'] = "YEARDAY";
    TimeUnit[TimeUnit["YEARDATE"] = 'yeardate'] = "YEARDATE";
    TimeUnit[TimeUnit["YEARMONTHDAYHOURS"] = 'yearmonthdayhours'] = "YEARMONTHDAYHOURS";
    TimeUnit[TimeUnit["YEARMONTHDAYHOURSMINUTES"] = 'yearmonthdayhoursminutes'] = "YEARMONTHDAYHOURSMINUTES";
    TimeUnit[TimeUnit["YEARMONTHDAYHOURSMINUTESSECONDS"] = 'yearmonthdayhoursminutesseconds'] = "YEARMONTHDAYHOURSMINUTESSECONDS";
    TimeUnit[TimeUnit["HOURSMINUTES"] = 'hoursminutes'] = "HOURSMINUTES";
    TimeUnit[TimeUnit["HOURSMINUTESSECONDS"] = 'hoursminutesseconds'] = "HOURSMINUTESSECONDS";
    TimeUnit[TimeUnit["MINUTESSECONDS"] = 'minutesseconds'] = "MINUTESSECONDS";
    TimeUnit[TimeUnit["SECONDSMILLISECONDS"] = 'secondsmilliseconds'] = "SECONDSMILLISECONDS";
})(exports.TimeUnit || (exports.TimeUnit = {}));
var TimeUnit = exports.TimeUnit;
exports.TIMEUNITS = [
    TimeUnit.YEAR,
    TimeUnit.MONTH,
    TimeUnit.DAY,
    TimeUnit.DATE,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
    TimeUnit.SECONDS,
    TimeUnit.MILLISECONDS,
    TimeUnit.YEARMONTH,
    TimeUnit.YEARMONTHDAY,
    TimeUnit.YEARMONTHDATE,
    TimeUnit.YEARDAY,
    TimeUnit.YEARDATE,
    TimeUnit.YEARMONTHDAYHOURS,
    TimeUnit.YEARMONTHDAYHOURSMINUTES,
    TimeUnit.YEARMONTHDAYHOURSMINUTESSECONDS,
    TimeUnit.HOURSMINUTES,
    TimeUnit.HOURSMINUTESSECONDS,
    TimeUnit.MINUTESSECONDS,
    TimeUnit.SECONDSMILLISECONDS,
];
function format(timeUnit, abbreviated) {
    if (abbreviated === void 0) { abbreviated = false; }
    if (!timeUnit) {
        return undefined;
    }
    var timeString = timeUnit.toString();
    var dateComponents = [];
    if (timeString.indexOf('year') > -1) {
        dateComponents.push(abbreviated ? '%y' : '%Y');
    }
    if (timeString.indexOf('month') > -1) {
        dateComponents.push(abbreviated ? '%b' : '%B');
    }
    if (timeString.indexOf('day') > -1) {
        dateComponents.push(abbreviated ? '%a' : '%A');
    }
    else if (timeString.indexOf('date') > -1) {
        dateComponents.push('%d');
    }
    var timeComponents = [];
    if (timeString.indexOf('hours') > -1) {
        timeComponents.push('%H');
    }
    if (timeString.indexOf('minutes') > -1) {
        timeComponents.push('%M');
    }
    if (timeString.indexOf('seconds') > -1) {
        timeComponents.push('%S');
    }
    if (timeString.indexOf('milliseconds') > -1) {
        timeComponents.push('%L');
    }
    var out = [];
    if (dateComponents.length > 0) {
        out.push(dateComponents.join('-'));
    }
    if (timeComponents.length > 0) {
        out.push(timeComponents.join(':'));
    }
    return out.length > 0 ? out.join(' ') : undefined;
}
exports.format = format;

},{}],29:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],30:[function(require,module,exports){
"use strict";
var stringify = require('json-stable-stringify');
var util_1 = require('datalib/src/util');
exports.keys = util_1.keys;
exports.extend = util_1.extend;
exports.duplicate = util_1.duplicate;
exports.isArray = util_1.isArray;
exports.vals = util_1.vals;
exports.truncate = util_1.truncate;
exports.toMap = util_1.toMap;
exports.isObject = util_1.isObject;
exports.isString = util_1.isString;
exports.isNumber = util_1.isNumber;
exports.isBoolean = util_1.isBoolean;
var generate_1 = require('datalib/src/generate');
exports.range = generate_1.range;
var encoding_1 = require('./encoding');
exports.has = encoding_1.has;
var channel_1 = require('./channel');
exports.Channel = channel_1.Channel;
var util_2 = require('datalib/src/util');
function hash(a) {
    if (util_2.isString(a) || util_2.isNumber(a) || util_2.isBoolean(a)) {
        return String(a);
    }
    return stringify(a);
}
exports.hash = hash;
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
function without(array, excludedItems) {
    return array.filter(function (item) {
        return !contains(excludedItems, item);
    });
}
exports.without = without;
function union(array, other) {
    return array.concat(without(other, array));
}
exports.union = union;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                f.call(thisArg, obj[k], k, obj);
            }
        }
    }
}
exports.forEach = forEach;
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
function map(obj, f, thisArg) {
    if (obj.map) {
        return obj.map.call(thisArg, f);
    }
    else {
        var output = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                output.push(f.call(thisArg, obj[k], k, obj));
            }
        }
        return output;
    }
}
exports.map = map;
function any(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (f(arr[k], k, i++)) {
            return true;
        }
    }
    return false;
}
exports.any = any;
function all(arr, f) {
    var i = 0;
    for (var k = 0; k < arr.length; k++) {
        if (!f(arr[k], k, i++)) {
            return false;
        }
    }
    return true;
}
exports.all = all;
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
exports.flatten = flatten;
function mergeDeep(dest) {
    var src = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        src[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < src.length; i++) {
        dest = deepMerge_(dest, src[i]);
    }
    return dest;
}
exports.mergeDeep = mergeDeep;
;
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
        if (typeof src[p] !== 'object' || src[p] === null) {
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
var dlBin = require('datalib/src/bins/bins');
function getbins(stats, maxbins) {
    return dlBin({
        min: stats.min,
        max: stats.max,
        maxbins: maxbins
    });
}
exports.getbins = getbins;
function unique(values, f) {
    var results = [];
    var u = {}, v, i, n;
    for (i = 0, n = values.length; i < n; ++i) {
        v = f ? f(values[i]) : values[i];
        if (v in u) {
            continue;
        }
        u[v] = 1;
        results.push(values[i]);
    }
    return results;
}
exports.unique = unique;
;
function warning(message) {
    console.warn('[VL Warning]', message);
}
exports.warning = warning;
function error(message) {
    console.error('[VL Error]', message);
}
exports.error = error;
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

},{"./channel":25,"./encoding":26,"datalib/src/bins/bins":15,"datalib/src/generate":16,"datalib/src/util":18,"json-stable-stringify":19}]},{},[5])(5)
});
//# sourceMappingURL=compassql.js.map
