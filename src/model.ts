import {Channel} from 'vega-lite/src/channel';
import {Encoding} from 'vega-lite/src/encoding';
import {FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/Type';
import {Spec} from 'vega-lite/src/Spec';

import {Property} from './property';
import {SpecQuery, EncodingQuery, EnumSpec, isEnumSpec} from './query';
import {isin, duplicate, keys, some} from './util';

interface EncodingQueryMap {
  [channel: string]: EncodingQuery;
}

export class SpecQueryModel {
  private spec: SpecQuery;
  private encodingMap: EncodingQueryMap;

  public constructor(spec: SpecQuery) {
    this.spec = spec;
    this.encodingMap = spec.encodings.reduce((m, encodingQuery) => {
      if (!isEnumSpec(encodingQuery.channel)) {
        m[encodingQuery.channel as string] = encodingQuery;
      }
      return m;
    }, {} as EncodingQueryMap);
  }

  public duplicate(): SpecQueryModel {
    return new SpecQueryModel(duplicate(this.spec));
  }

  public setMark(mark: Mark | EnumSpec<Mark>) {
    this.spec.mark = mark;
  }

  public getMark() {
    return this.spec.mark;
  }

  public getEncodingProperty(index: number, property: Property) {
    return this.spec.encodings[index][property];
  }

  public setEncodingProperty(index: number, property: Property, value: any) {
    if (property === Property.CHANNEL) {
      this.setChannel(this.spec.encodings[index], value);
    } else {
      this.spec.encodings[index][property] = value;
    }
  }

  private setChannel(encodingQuery: EncodingQuery, channel: Channel) {
    // If there is an old channel
    if (encodingQuery.channel) {
      delete this.encodingMap[channel];
    }

    encodingQuery.channel = channel;

    // If there is a new channel
    if (channel) {
      this.encodingMap[channel] = encodingQuery;
    }
  }

  public channelUsed(channel: Channel) {
    return !!this.encodingMap[channel];
  }

  public getEncodings() {
    return this.spec.encodings;
  }

  public getEncodingQueryByChannel(channel: Channel) {
    return this.encodingMap[channel];
  }

  public getEncodingQueryByIndex(i: number) {
    return this.spec.encodings[i];
  }

  public hasAllChannelAssigned() {
    return keys(this.encodingMap).length === this.spec.encodings.length;
  }

  public isDimension(channel: Channel) {
    const encQ = this.encodingMap[channel];

    return isin(encQ.type, [Type.NOMINAL, Type.ORDINAL]) ||
      (!isEnumSpec(encQ.bin) && !!encQ.bin) ||
      (encQ.type === Type.TEMPORAL && !isEnumSpec(encQ.timeUnit) && !!encQ.timeUnit);
  }

  public isAggregate() {
    return some(this.spec.encodings, (encQ: EncodingQuery) => (!isEnumSpec(encQ.aggregate) && !!encQ.aggregate));
  }

  /**
   * Convert a query to a Vega-Lite spec if it is completed.
   * @return a Vega-Lite spec if completed, null otherwise.
   */
  public toSpec(): Spec {
    if (isEnumSpec(this.spec.mark)) return null;

    let encoding: Encoding = {};

    for (let i = 0; i < this.spec.encodings.length; i++) {
      const encQ = this.spec.encodings[i];

      // if channel is an enum spec, return null
      if (isEnumSpec(encQ.channel)) return null;

      // assemble other property into a field def.
      let fieldDef: FieldDef = {};
      const PROPERTIES = [Property.AGGREGATE, Property.BIN, Property.TIMEUNIT, Property.FIELD, Property.TYPE];
      for (let j = 0; j < PROPERTIES.length; j++) {
        const prop = PROPERTIES[j];

        // if the property is an enum spec, return null
        if (isEnumSpec(encQ[prop])) return null;

        // otherwise, assign the proper to the field def
        if (encQ[prop] !== undefined) {
          fieldDef[prop] = encQ[prop];
        }
      }

      encoding[encQ.channel as Channel] = fieldDef;
    }
    return {
      // TODO: transform, config
      mark: this.spec.mark as Mark,
      encoding: encoding
    };
  }
}
