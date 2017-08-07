"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("vega-lite/build/src/type");
var ExpandedType;
(function (ExpandedType) {
    ExpandedType.QUANTITATIVE = type_1.Type.QUANTITATIVE;
    ExpandedType.ORDINAL = type_1.Type.ORDINAL;
    ExpandedType.TEMPORAL = type_1.Type.TEMPORAL;
    ExpandedType.NOMINAL = type_1.Type.NOMINAL;
    ExpandedType.KEY = 'key';
})(ExpandedType = exports.ExpandedType || (exports.ExpandedType = {}));
function isDiscrete(fieldType) {
    return fieldType === type_1.Type.ORDINAL || fieldType === type_1.Type.NOMINAL || fieldType === ExpandedType.KEY;
}
exports.isDiscrete = isDiscrete;
//# sourceMappingURL=expandedtype.js.map