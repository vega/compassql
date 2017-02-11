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
//# sourceMappingURL=base.js.map