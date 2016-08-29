import {AggregateOp} from 'vega-lite/src/aggregate';
import {Channel} from 'vega-lite/src/channel';
import {Data} from 'vega-lite/src/data';
import {Encoding} from 'vega-lite/src/encoding';
import {FieldDef} from 'vega-lite/src/fielddef';
import {Mark} from 'vega-lite/src/mark';
import {Type} from 'vega-lite/src/type';
import {ExtendedUnitSpec} from 'vega-lite/src/spec';

import {QueryConfig} from './config';
import {Property, ENCODING_PROPERTIES, NESTED_ENCODING_PROPERTIES, hasNestedProperty, getNestedEncodingProperty} from './property';
import {EnumSpec, SHORT_ENUM_SPEC, initEnumSpec, isEnumSpec} from './enumspec';
import {EnumSpecIndex} from './enumspecindex';
import {SpecQuery, isAggregate, stack} from './query/spec';
import {isDimension, isMeasure, EncodingQuery} from './query/encoding';
import {GroupBy, ExtendedGroupBy, parse as parseGroupBy} from './query/groupby';
import {spec as specShorthand, PROPERTY_SUPPORTED_CHANNELS, getReplacerIndex} from './query/shorthand';
import {RankingScore} from './ranking/ranking';
import {Schema} from './schema';
import {Dict, duplicate, extend} from './util';

export function getDefaultName(prop: Property) {
  switch (prop) {
    case Property.MARK:
      return 'm';
    case Property.CHANNEL:
      return 'c';
    case Property.AGGREGATE:
      return 'a';
    case Property.AUTOCOUNT:
      return '#';
    case Property.BIN:
      return 'b';
    case Property.BIN_MAXBINS:
      return 'b-mb';
    case Property.SORT:
      return 'so';
    case Property.SORT_FIELD:
      return 'so-f';
    case Property.SORT_OP:
      return 'so-op';
    case Property.SORT_ORDER:
      return 'so-or';
    case Property.SCALE:
      return 's';
    case Property.SCALE_BANDSIZE:
      return 's-bs';
    case Property.SCALE_CLAMP:
      return 's-c';
    case Property.SCALE_DOMAIN:
      return 's-d';
    case Property.SCALE_EXPONENT:
      return 's-e';
    case Property.SCALE_NICE:
      return 's-n';
    case Property.SCALE_RANGE:
      return 's-ra';
    case Property.SCALE_ROUND:
      return 's-r';
    case Property.SCALE_TYPE:
      return 's-t';
    case Property.SCALE_USERAWDOMAIN:
      return 's-u';
    case Property.SCALE_ZERO:
      return 's-z';
    case Property.AXIS:
      return 'ax';
    case Property.AXIS_AXISCOLOR:
      return 'ax-ac';
    case Property.AXIS_AXISWIDTH:
      return 'ax-aw';
    case Property.AXIS_LAYER:
      return 'ax-lay';
    case Property.AXIS_OFFSET:
      return 'ax-of';
    case Property.AXIS_ORIENT:
      return 'ax-or';
    case Property.AXIS_GRID:
      return 'ax-g';
    case Property.AXIS_GRIDCOLOR:
      return 'ax-gc';
    case Property.AXIS_GRIDDASH:
      return 'ax-gd';
    case Property.AXIS_GRIDOPACITY:
      return 'ax-go';
    case Property.AXIS_GRIDWIDTH:
      return 'ax-gw';
    case Property.AXIS_LABELS:
      return 'ax-lab';
    case Property.AXIS_FORMAT:
      return 'ax-f';
    case Property.AXIS_LABELANGLE:
      return 'ax-laba';
    case Property.AXIS_LABELMAXLENGTH:
      return 'ax-labm';
    case Property.AXIS_SHORTTIMELABELS:
      return 'ax-stl';
    case Property.AXIS_SUBDIVIDE:
      return 'ax-sub';
    case Property.AXIS_TICKS:
      return 'ax-t';
    case Property.AXIS_TICKCOLOR:
      return 'ax-tc';
    case Property.AXIS_TICKLABELCOLOR:
      return 'ax-tlc';
    case Property.AXIS_TICKLABELFONT:
      return 'ax-tlf';
    case Property.AXIS_TICKLABELFONTSIZE:
      return 'ax-tlfs';
    case Property.AXIS_TICKPADDING:
      return 'ax-tp';
    case Property.AXIS_TICKSIZE:
      return 'ax-ts';
    case Property.AXIS_TICKSIZEMAJOR:
      return 'ax-tsma';
    case Property.AXIS_TICKSIZEMINOR:
      return 'ax-tsmi';
    case Property.AXIS_TICKSIZEEND:
      return 'ax-tse';
    case Property.AXIS_TICKWIDTH:
      return 'ax-tw';
    case Property.AXIS_VALUES:
      return 'ax-v';
    case Property.AXIS_TITLE:
      return 'ax-ti';
    case Property.AXIS_TITLECOLOR:
      return 'ax-tic';
    case Property.AXIS_TITLEFONT:
      return 'ax-tif';
    case Property.AXIS_TITLEFONTSIZE:
      return 'ax-tifs';
    case Property.AXIS_TITLEFONTWEIGHT:
      return 'ax-tifw';
    case Property.AXIS_TITLEOFFSET:
      return 'ax-tio';
    case Property.AXIS_TITLEMAXLENGTH:
      return 'ax-timl';
    case Property.AXIS_CHARACTERWIDTH:
      return 'ax-cw';
    case Property.LEGEND:
      return 'l';
    case Property.LEGEND_ORIENT:
      return 'l-or';
    case Property.LEGEND_OFFSET:
      return 'l-of';
    case Property.LEGEND_VALUES:
      return 'l-v';
    case Property.LEGEND_FORMAT:
      return 'l-f';
    case Property.LEGEND_LABELALIGN:
      return 'l-la';
    case Property.LEGEND_LABELBASELINE:
      return 'l-lb';
    case Property.LEGEND_LABELCOLOR:
      return 'l-lc';
    case Property.LEGEND_LABELFONT:
      return 'l-lf';
    case Property.LEGEND_LABELFONTSIZE:
      return 'l-lfs';
    case Property.LEGEND_SHORTTIMELABELS:
      return 'l-stl';
    case Property.LEGEND_SYMBOLCOLOR:
      return 'l-syc';
    case Property.LEGEND_SYMBOLSHAPE:
      return 'l-sysh';
    case Property.LEGEND_SYMBOLSIZE:
      return 'l-sysi';
    case Property.LEGEND_SYMBOLSTROKEWIDTH:
      return 'l-sysw';
    case Property.LEGEND_TITLE:
      return 'l-ti';
    case Property.LEGEND_TITLECOLOR:
      return 'l-tic';
    case Property.LEGEND_TITLEFONT:
      return 'l-tif';
    case Property.LEGEND_TITLEFONTSIZE:
      return 'l-tifs';
    case Property.LEGEND_TITLEFONTWEIGHT:
      return 'l-tifw';
    case Property.TIMEUNIT:
      return 'tu';
    case Property.FIELD:
      return 'f';
    case Property.TYPE:
      return 't';
  }
  /* istanbul ignore next */
  throw new Error('Default name undefined');
}

export function getDefaultEnumValues(prop: Property, schema: Schema, opt: QueryConfig): any[] {
  switch (prop) {
    case Property.FIELD:       // For field, by default enumerate all fields
    case Property.SORT_FIELD:
      return schema.fields();

    // True, False for boolean values
    case Property.AXIS:
    case Property.AXIS_GRID:
    case Property.AXIS_LABELS:
    case Property.AXIS_SHORTTIMELABELS:
    case Property.BIN:
    case Property.LEGEND:
    case Property.LEGEND_SHORTTIMELABELS:
    case Property.SCALE:
    case Property.SCALE_CLAMP:
    case Property.SCALE_NICE:
    case Property.SCALE_ROUND:
    case Property.SCALE_USERAWDOMAIN:
    case Property.SCALE_ZERO:
    case Property.AUTOCOUNT:
      return [false, true];


    // For other properties, take default enumValues from config.
    // The config name for each prop is a plural form of the prop.
    case Property.AGGREGATE:
      return opt.aggregates;

    case Property.AXIS_AXISCOLOR:
      return opt.axisAxisColors;

    case Property.AXIS_AXISWIDTH:
      return opt.axisAxisWidths;

    case Property.AXIS_LAYER:
      return opt.axisLayers;

    case Property.AXIS_OFFSET:
      return opt.axisOffsets;

    case Property.AXIS_ORIENT:
      return opt.axisOrients;

    case Property.AXIS_GRIDCOLOR:
      return opt.axisGridColors;

    case Property.AXIS_GRIDDASH:
      return opt.axisGridDashes;

    case Property.AXIS_GRIDOPACITY:
      return opt.axisGridOpacities;

    case Property.AXIS_GRIDWIDTH:
      return opt.axisGridWidths;

    case Property.AXIS_FORMAT:
      return opt.axisFormats;

    case Property.AXIS_LABELANGLE:
      return opt.axisLabelAngles;

    case Property.AXIS_LABELMAXLENGTH:
      return opt.axisLabelMaxLengths;

    case Property.AXIS_SUBDIVIDE:
      return opt.axisSubDivides;

    case Property.AXIS_TICKS:
      return opt.axisTicks;

    case Property.AXIS_TICKCOLOR:
      return opt.axisTickColors;

    case Property.AXIS_TICKLABELCOLOR:
      return opt.axisTickLabelColors;

    case Property.AXIS_TICKLABELFONT:
      return opt.axisTickLabelFonts;

    case Property.AXIS_TICKLABELFONTSIZE:
      return opt.axisTickLabelFontSizes;

    case Property.AXIS_TICKPADDING:
      return opt.axisTickPaddings;

    case Property.AXIS_TICKSIZE:
      return opt.axisTickSizes;

    case Property.AXIS_TICKSIZEMAJOR:
      return opt.axisTickSizeMajors;

    case Property.AXIS_TICKSIZEMINOR:
      return opt.axisTickSizeMinors;

    case Property.AXIS_TICKSIZEEND:
      return opt.axisTickSizeEnds;

    case Property.AXIS_TICKWIDTH:
      return opt.axisTickWidths;

    case Property.AXIS_VALUES:
      return opt.axisValuesList;

    case Property.AXIS_TITLE:
      return opt.axisTitles;

    case Property.AXIS_TITLECOLOR:
      return opt.axisTitleColors;

    case Property.AXIS_TITLEFONT:
      return opt.axisTitleFonts;

    case Property.AXIS_TITLEFONTWEIGHT:
      return opt.axisTitleFontWeights;

    case Property.AXIS_TITLEFONTSIZE:
      return opt.axisTitleFontSizes;

    case Property.AXIS_TITLEOFFSET:
      return opt.axisTitleOffsets;

    case Property.AXIS_TITLEMAXLENGTH:
      return opt.axisTitleMaxLengths;

    case Property.AXIS_CHARACTERWIDTH:
      return opt.axisCharacterWidths;

    case Property.BIN_MAXBINS:
      return opt.maxBinsList;

    case Property.CHANNEL:
      return opt.channels;

    case Property.MARK:
      return opt.marks;

    case Property.LEGEND_ORIENT:
      return opt.legendOrients;

    case Property.LEGEND_OFFSET:
      return opt.legendOffsets;

    case Property.LEGEND_VALUES:
      return opt.legendValuesList;

    case Property.LEGEND_FORMAT:
      return opt.legendFormats;

    case Property.LEGEND_LABELALIGN:
      return opt.legendLabelAligns;

    case Property.LEGEND_LABELBASELINE:
      return opt.legendLabelBaselines;

    case Property.LEGEND_LABELCOLOR:
      return opt.legendLabelColors;

    case Property.LEGEND_LABELFONT:
      return opt.legendLabelFonts;

    case Property.LEGEND_LABELFONTSIZE:
      return opt.legendLabelFontSizes;

    case Property.LEGEND_SYMBOLCOLOR:
      return opt.legendSymbolColors;

    case Property.LEGEND_SYMBOLSHAPE:
      return opt.legendSymbolShapes;

    case Property.LEGEND_SYMBOLSIZE:
      return opt.legendSymbolSizes;

    case Property.LEGEND_SYMBOLSTROKEWIDTH:
      return opt.legendSymbolStrokeWidths;

    case Property.LEGEND_TITLE:
      return opt.legendTitles;

    case Property.LEGEND_TITLECOLOR:
      return opt.legendTitleColors;

    case Property.LEGEND_TITLEFONT:
      return opt.legendTitleFonts;

    case Property.LEGEND_TITLEFONTSIZE:
      return opt.legendTitleFontSizes;

    case Property.LEGEND_TITLEFONTWEIGHT:
      return opt.legendTitleFontWeights;

    case Property.SORT:
      return opt.sorts;

    case Property.SORT_OP:
      return opt.sortOps;

    case Property.SORT_ORDER:
      return opt.sortOrders;

    case Property.SCALE_BANDSIZE:
      return opt.scaleBandSizes;

    case Property.SCALE_DOMAIN:
      return opt.scaleDomains;

    case Property.SCALE_EXPONENT:
      return opt.scaleExponents;

    case Property.SCALE_RANGE:
      return opt.scaleRanges;

    case Property.SCALE_TYPE:
      return opt.scaleTypes;

    case Property.TIMEUNIT:
      return opt.timeUnits;

    case Property.TYPE:
      return opt.types;
  }
  /* istanbul ignore next */
  throw new Error('No default enumValues for ' + prop);
}

/**
 * Internal class for specQuery that provides helper for the enumeration process.
 */
export class SpecQueryModel {
  private _spec: SpecQuery;

  /** channel => EncodingQuery */
  private _channelCount: Dict<number>;
  private _enumSpecIndex: EnumSpecIndex;
  private _enumSpecAssignment: Dict<any>;
  private _schema: Schema;
  private _opt: QueryConfig;

  private _rankingScore: Dict<RankingScore> = {};


  /**
   * Build an enumSpecIndex by detecting enumeration specifiers
   * in the input specQuery and replace short enum specs with
   * full ones that includes both names and enumValues.
   *
   * @return a SpecQueryModel that wraps the specQuery and the enumSpecIndex.
   */
  public static build(specQ: SpecQuery, schema: Schema, opt: QueryConfig): SpecQueryModel {
    let enumSpecIndex: EnumSpecIndex = new EnumSpecIndex();
    // mark
    if (isEnumSpec(specQ.mark)) {
      const name = getDefaultName(Property.MARK);
      specQ.mark = initEnumSpec(specQ.mark, name, opt.marks);
      enumSpecIndex.setMark(specQ.mark);
    }

    // TODO: transform

    // encodings
    specQ.encodings.forEach((encQ, index) => {
      if (encQ.autoCount !== undefined) {
        // This is only for testing purpose
        console.warn('A field with autoCount should not be included as autoCount meant to be an internal object.');

        encQ.type = Type.QUANTITATIVE; // autoCount is always quantitative
      }

      if (encQ.type === undefined) {
        // type is optional -- we automatically augment enum spec if not specified
        encQ.type = SHORT_ENUM_SPEC;
      }

      // For each property of the encodingQuery, enumerate
      ENCODING_PROPERTIES.forEach((prop) => {
        if(isEnumSpec(encQ[prop])) {
          // Assign default enum spec name and enum values.
          const defaultEnumSpecName = getDefaultName(prop) + index;
          const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
          const enumSpec = encQ[prop] = initEnumSpec(encQ[prop], defaultEnumSpecName, defaultEnumValues);

          // Add index of the encoding mapping to the property's enum spec index.
          enumSpecIndex.setEncodingProperty(index, prop, enumSpec);
        }
      });

      // For each nested property of the encoding query  (e.g., encQ.bin.maxbins)
      NESTED_ENCODING_PROPERTIES.forEach((nestedProp) => {
        const propObj = encQ[nestedProp.parent]; // the property object e.g., encQ.bin
        if (propObj) {
          const prop = nestedProp.property;
          const child = nestedProp.child;
          if (isEnumSpec(propObj[child])) {
            // Assign default enum spec name and enum values.
            const defaultEnumSpecName = getDefaultName(prop) + index;
            const defaultEnumValues = getDefaultEnumValues(prop, schema, opt);
            const enumSpec = propObj[child] = initEnumSpec(propObj[child], defaultEnumSpecName, defaultEnumValues);

            // Add index of the encoding mapping to the property's enum spec index.
            enumSpecIndex.setEncodingProperty(index, prop, enumSpec);
          }
        }
      });
    });

    // AUTO COUNT
    // Add Auto Count Field
    if (opt.autoAddCount) {
      const countEncQ: EncodingQuery = {
        channel: {
          name: getDefaultName(Property.CHANNEL) + specQ.encodings.length,
          enum: getDefaultEnumValues(Property.CHANNEL, schema, opt)
        },
        autoCount: {
          name: getDefaultName(Property.AUTOCOUNT) + specQ.encodings.length,
          enum: [false, true]
        },
        type: Type.QUANTITATIVE
      };
      specQ.encodings.push(countEncQ);

      const index = specQ.encodings.length - 1;

      // Add index of the encoding mapping to the property's enum spec index.
      enumSpecIndex.setEncodingProperty(index, Property.CHANNEL, countEncQ.channel);
      enumSpecIndex.setEncodingProperty(index, Property.AUTOCOUNT, countEncQ.autoCount);
    }

    return new SpecQueryModel(specQ, enumSpecIndex, schema, opt, {});
  }

  constructor(spec: SpecQuery, enumSpecIndex: EnumSpecIndex, schema: Schema, opt: QueryConfig, enumSpecAssignment: Dict<any>) {
    this._spec = spec;
    this._channelCount = spec.encodings.reduce((m, encQ) => {
      if (!isEnumSpec(encQ.channel) && encQ.autoCount !== false) {
        m[encQ.channel as string] = 1;
      }
      return m;
    }, {} as Dict<number>);

    this._enumSpecIndex = enumSpecIndex;
    this._enumSpecAssignment = enumSpecAssignment;
    this._opt = opt;
    this._schema = schema;
  }

  public get enumSpecIndex() {
    return this._enumSpecIndex;
  }

  public get schema() {
    return this._schema;
  }

  public get specQuery() {
    return this._spec;
  }

  public duplicate(): SpecQueryModel {
    return new SpecQueryModel(duplicate(this._spec), this._enumSpecIndex, this._schema, this._opt, duplicate(this._enumSpecAssignment));
  }

  public setMark(mark: Mark) {
    const name = (this._spec.mark as EnumSpec<Mark>).name;
    this._enumSpecAssignment[name] = this._spec.mark = mark;
  }

  public resetMark() {
    const enumSpec = this._spec.mark = this._enumSpecIndex.mark;
    delete this._enumSpecAssignment[enumSpec.name];
  }

  public getMark() {
    return this._spec.mark;
  }

  public getEncodingProperty(index: number, prop: Property) {
    const encQ = this._spec.encodings[index];
    const nestedProp = getNestedEncodingProperty(prop);
    if (nestedProp) { // nested encoding property
      return encQ[nestedProp.parent][nestedProp.child];
    }
    return encQ[prop]; // encoding property (non-nested)
  }

  public setEncodingProperty(index: number, prop: Property, value: any, enumSpec: EnumSpec<any>) {
    const encQ = this._spec.encodings[index];
    const nestedProp = getNestedEncodingProperty(prop);
    if (prop === Property.CHANNEL && encQ.channel && !isEnumSpec(encQ.channel)) {
      // If there is an old channel
      this._channelCount[encQ.channel as Channel]--;
    }

    if (nestedProp) { // nested encoding property
      encQ[nestedProp.parent][nestedProp.child] = value;
    } else if (hasNestedProperty(prop) && value === true) {
      encQ[prop] = extend({},
        encQ[prop], // copy all existing properties
        {enum: undefined, name: undefined} // except name and values to it no longer an enumSpec
      );
    } else { // encoding property (non-nested)
      encQ[prop] = value;
    }

    this._enumSpecAssignment[enumSpec.name] = value;

    if (prop === Property.CHANNEL) {
      // If there is a new channel, make sure it exists and add it to the count.
      this._channelCount[value] = (this._channelCount[value] || 0) + 1;
    }
  }

  public resetEncodingProperty(index: number, prop: Property, enumSpec: EnumSpec<any>) {
    const encQ = this._spec.encodings[index];
    const nestedProp = getNestedEncodingProperty(prop);
    if (prop === Property.CHANNEL) {
      this._channelCount[encQ.channel as Channel]--;
    }

    // reset it to enumSpec
    if (nestedProp) { // nested encoding property
      encQ[nestedProp.parent][nestedProp.child] = enumSpec;
    } else { // encoding property (non-nested)
      encQ[prop] = enumSpec;
    }

    // add remove value that is reset from the assignment map
    delete this._enumSpecAssignment[enumSpec.name];
  }

  public channelUsed(channel: Channel) {
    // do not include encoding that has autoCount = false because it is not a part of the output spec.
    return this._channelCount[channel] > 0;
  }

  public stack() {
    return stack(this._spec);
  }

  public getEncodings() {
    // do not include encoding that has autoCount = false because it is not a part of the output spec.
    return this._spec.encodings.filter((encQ) => encQ.autoCount !== false);
  }

  public getEncodingQueryByChannel(channel: Channel) {
    for (let i = 0; i < this._spec.encodings.length; i++) {
      if (this._spec.encodings[i].channel === channel) {
        return this._spec.encodings[i];
      }
    }
    return undefined;
  }

  public getEncodingQueryByIndex(i: number) {
    return this._spec.encodings[i];
  }

  public isDimension(channel: Channel) {
    const encQ = this.getEncodingQueryByChannel(channel);
    return encQ && isDimension(encQ);
  }

  public isMeasure(channel: Channel) {
    const encQ = this.getEncodingQueryByChannel(channel);
    return encQ && isMeasure(encQ);
  }

  public isAggregate() {
    return isAggregate(this._spec);
  }

  public toShorthand(groupBy?: (Property | ExtendedGroupBy)[]): string {
    if (groupBy) {
      let include: Dict<boolean> = {}, replace: Dict<Dict<string>> = {};
      parseGroupBy(groupBy, include, replace);
      return specShorthand(this._spec, include, getReplacerIndex(replace));
    }
    return specShorthand(this._spec);
  }

  private _encoding(): Encoding {
    let encoding: Encoding = {};

    for (let i = 0; i < this._spec.encodings.length; i++) {
      const encQ = this._spec.encodings[i];
      let fieldDef: FieldDef = {};

      // For count field that is automatically added, convert to correct vega-lite fieldDef
      if (encQ.autoCount === true) {
        fieldDef.aggregate = AggregateOp.COUNT;
        fieldDef.field = '*';
        fieldDef.type = Type.QUANTITATIVE;
      } else if (encQ.autoCount === false) {
        continue; // Do not include this in the output.
      }

      // if channel is an enum spec, return null
      if (isEnumSpec(encQ.channel)) return null;

      // assemble other property into a field def.
      const PROPERTIES = [Property.AGGREGATE, Property.BIN, Property.TIMEUNIT, Property.FIELD, Property.TYPE, Property.SCALE, Property.SORT, Property.AXIS, Property.LEGEND];
      // TODO(#226):
      // write toSpec() and toShorthand() in a way that prevents outputting inapplicable scale, sort, axis / legend
      for (let j = 0; j < PROPERTIES.length; j++) {
        const prop = PROPERTIES[j];

        // if the property is an enum spec, return null
        if (isEnumSpec(encQ[prop])) return null;

        // otherwise, assign the proper to the field def
        if (encQ[prop] !== undefined) {

          if (!PROPERTY_SUPPORTED_CHANNELS[prop] ||  // all channels support this prop
            PROPERTY_SUPPORTED_CHANNELS[prop][encQ.channel as Channel]) {
            fieldDef[prop] = encQ[prop];
          }
        }
      }

      if (fieldDef.bin === false) {
        // exclude bin false
        delete fieldDef.bin;
      }

      encoding[encQ.channel as Channel] = fieldDef;
    }
    return encoding;
  }
  /**
   * Convert a query to a Vega-Lite spec if it is completed.
   * @return a Vega-Lite spec if completed, null otherwise.
   */
  public toSpec(data?: Data): ExtendedUnitSpec {
    if (isEnumSpec(this._spec.mark)) return null;

    let spec: any = {};
    data = data || this._spec.data;
    if (data) {
      spec.data = data;
    }

    if (this._spec.transform) {
      spec.transform = this._spec.transform;
    }

    spec.mark = this._spec.mark as Mark;
    spec.encoding = this._encoding();
    if (spec.encoding === null) {
      return null;
    }
    if (this._spec.config || this._opt.defaultSpecConfig)
    spec.config = extend({}, this._opt.defaultSpecConfig, this._spec.config);

    return spec;
  }

  public getRankingScore(rankingName: string) {
    return this._rankingScore[rankingName];
  }

  public setRankingScore(rankingName: string, score: RankingScore) {
    this._rankingScore[rankingName] = score;
  }
}

export class SpecQueryModelGroup {
  private _name: string;
  private _path: string;
  private _items: (SpecQueryModel | SpecQueryModelGroup)[];
  private _groupBy: GroupBy;
  private _orderGroupBy: string | string[];

  constructor(name: string = '', path: string = '', items: (SpecQueryModel | SpecQueryModelGroup)[] = [],
              groupBy: GroupBy = undefined, orderGroupBy: string | string[] = undefined) {
    this._name = name;
    this._path = path;
    this._items = items;
    this._groupBy = groupBy;
    this._orderGroupBy = orderGroupBy;
  }

  public getTopSpecQueryModel(): SpecQueryModel {
    const topItem = this._items[0];
    if (topItem instanceof SpecQueryModelGroup) {
      return topItem.getTopSpecQueryModel();
    } else {
      return topItem;
    }
  }

  public get name() {
    return this._name;
  }

  public get items() {
    return this._items;
  }

  public get groupBy() {
    return this._groupBy;
  }

  public set groupBy(groupBy: GroupBy) {
    this._groupBy = groupBy;
  }

  public get orderGroupBy() {
    return this._orderGroupBy;
  }

  public set orderGroupBy(orderGroupBy: string | string[]) {
    this._orderGroupBy = orderGroupBy;
  }
}
