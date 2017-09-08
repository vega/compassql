"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var property_1 = require("../property");
var wildcard_1 = require("../wildcard");
var util_1 = require("../util");
/**
 * Abstract model for a constraint.
 */
var AbstractConstraintModel = /** @class */ (function () {
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
var EncodingConstraintModel = /** @class */ (function (_super) {
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
}(AbstractConstraintModel));
exports.EncodingConstraintModel = EncodingConstraintModel;
//# sourceMappingURL=base.js.map