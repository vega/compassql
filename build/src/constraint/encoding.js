"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_1 = require("../query/encoding");
var field_1 = require("./field");
var value_1 = require("./value");
/**
 * Check all encoding constraints for a particular property and index tuple
 */
function checkEncoding(prop, wildcard, index, specM, schema, opt) {
    // Check encoding constraint
    var encodingConstraints = field_1.FIELD_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
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
    var valueContraints = value_1.VALUE_CONSTRAINTS_BY_PROPERTY.get(prop) || [];
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