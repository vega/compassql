import {QueryConfig} from '../config';
import {isEncodingNestedProp, Property} from '../property';
import {PropIndex} from '../propindex';
import {isWildcard, Wildcard} from '../wildcard';
import {Schema} from '../schema';
import { every} from '../util';

import {EncodingQueryBase} from '../query/encoding';

/**
 * Abstract interface for a constraint.
 */
export interface AbstractConstraint {
  name: string;
  description: string;
  properties: Property[];

  /**
   * Whether this constraint requires all specified properties types to be specific
   * in order to call satisfy function.
   */
  allowWildcardForProperties: boolean;

  /**
   * Whether this constraint is strict (not optional).
   */
  strict: boolean;
}

/**
 * Abstract model for a constraint.
 */
export class AbstractConstraintModel {
  protected constraint: AbstractConstraint;

  constructor(constraint: AbstractConstraint) {
    this.constraint = constraint;
  }

  public name(): string {
    return this.constraint.name;
  }

  public description(): string {
    return this.constraint.description;
  }

  public properties(): Property[] {
    return this.constraint.properties;
  }

  public strict(): boolean {
    return this.constraint.strict;
  }
}

/**
 * Collection of constraints for a single encoding mapping.
 */

/** A method for satisfying whether the provided encoding query satisfy the constraint. */
export interface EncodingConstraintChecker<E extends EncodingQueryBase> {
  (encQ: E, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig): boolean;
}

export class EncodingConstraintModel<E extends EncodingQueryBase> extends AbstractConstraintModel {
  constructor(constraint: EncodingConstraint<E>) {
    super(constraint);
  }

  public hasAllRequiredPropertiesSpecific(encQ: E): boolean {
    return every(this.constraint.properties, (prop: Property) => {

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

  public satisfy(encQ: E, schema: Schema, encWildcardIndex: PropIndex<Wildcard<any>>, opt: QueryConfig): boolean {
    // TODO: Re-order logic to optimize the "allowWildcardForProperties" check
    if (!this.constraint.allowWildcardForProperties) {
      // TODO: extract as a method and do unit test

      if (!this.hasAllRequiredPropertiesSpecific(encQ)) {
        return true;
      }
    }
    return (this.constraint as EncodingConstraint<E>).satisfy(encQ, schema, encWildcardIndex, opt);
  }
}

/** Constraint for a single encoding mapping */
export interface EncodingConstraint<E extends EncodingQueryBase> extends AbstractConstraint {
  /** Method for checking if the encoding query satisfies this constraint. */
  satisfy: EncodingConstraintChecker<E>;
}
