import { isEncodingNestedProp } from '../property';
import { isWildcard } from '../wildcard';
import { every } from '../util';
/**
 * Abstract model for a constraint.
 */
export class AbstractConstraintModel {
    constructor(constraint) {
        this.constraint = constraint;
    }
    name() {
        return this.constraint.name;
    }
    description() {
        return this.constraint.description;
    }
    properties() {
        return this.constraint.properties;
    }
    strict() {
        return this.constraint.strict;
    }
}
export class EncodingConstraintModel extends AbstractConstraintModel {
    constructor(constraint) {
        super(constraint);
    }
    hasAllRequiredPropertiesSpecific(encQ) {
        return every(this.constraint.properties, (prop) => {
            if (isEncodingNestedProp(prop)) {
                let parent = prop.parent;
                let child = prop.child;
                if (!encQ[parent]) {
                    return true;
                }
                return !isWildcard(encQ[parent][child]);
            }
            if (!encQ[prop]) {
                return true;
            }
            return !isWildcard(encQ[prop]);
        });
    }
    satisfy(encQ, schema, encWildcardIndex, opt) {
        // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
        if (!this.constraint.allowWildcardForProperties) {
            // TODO: extract as a method and do unit test
            if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
                return true;
            }
        }
        return this.constraint.satisfy(encQ, schema, encWildcardIndex, opt);
    }
}
//# sourceMappingURL=base.js.map