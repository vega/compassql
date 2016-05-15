import {Property} from '../property';

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
  requireAllProperties: boolean;

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
