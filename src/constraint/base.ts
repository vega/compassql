import {PropertyType} from '../schema';

export interface AbstractConstraint {
  name: string;
  description: string;
  propertyTypes: PropertyType[];

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

  public propertyTypes(): PropertyType[] {
    return this.constraint.propertyTypes;
  }

  public strict(): boolean {
    return this.constraint.strict;
  }
}
