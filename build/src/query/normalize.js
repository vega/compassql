import { duplicate } from '../util';
/**
 * Normalize the non-nested version of the query
 * (basically when you have a `groupBy`)
 * to a standardize nested.
 */
export function normalize(q) {
    if (q.groupBy) {
        let nest = {
            groupBy: q.groupBy
        };
        if (q.orderBy) {
            nest.orderGroupBy = q.orderBy;
        }
        let normalizedQ = {
            spec: duplicate(q.spec),
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
    return duplicate(q); // We will cause side effect to q.spec in SpecQueryModel.build
}
//# sourceMappingURL=normalize.js.map