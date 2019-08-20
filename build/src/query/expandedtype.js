import * as TYPE from 'vega-lite/build/src/type';
export var ExpandedType;
(function (ExpandedType) {
    ExpandedType.QUANTITATIVE = TYPE.QUANTITATIVE;
    ExpandedType.ORDINAL = TYPE.ORDINAL;
    ExpandedType.TEMPORAL = TYPE.TEMPORAL;
    ExpandedType.NOMINAL = TYPE.NOMINAL;
    ExpandedType.KEY = 'key';
})(ExpandedType || (ExpandedType = {}));
export function isDiscrete(fieldType) {
    return fieldType === TYPE.ORDINAL || fieldType === TYPE.NOMINAL || fieldType === ExpandedType.KEY;
}
//# sourceMappingURL=expandedtype.js.map