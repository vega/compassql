import {assert} from 'chai';
import * as CHANNEL from 'vega-lite/build/src/channel';
import * as MARK from 'vega-lite/build/src/mark';
import {AREA, BAR, PRIMITIVE_MARKS} from 'vega-lite/build/src/mark';
import {STACKABLE_MARKS, StackOffset, STACK_BY_DEFAULT_MARKS} from 'vega-lite/build/src/stack';
import * as TYPE from 'vega-lite/build/src/type';
import {fromSpec, getStackChannel, getStackOffset, getVlStack, hasWildcard, SpecQuery} from '../../src/query/spec';
import {without} from '../../src/util';
import {DEFAULT_ENUM_INDEX} from '../../src/wildcard';

describe('query/spec', () => {
  describe('getStackOffset', () => {
    it('should return the stack offset specified', () => {
      DEFAULT_ENUM_INDEX.stack.forEach((stackOffset: StackOffset | null) => {
        const specQ: SpecQuery = {
          mark: 'bar',
          encodings: [
            {channel: CHANNEL.X, aggregate: 'sum', stack: stackOffset, field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
          ]
        };

        assert.equal(getStackOffset(specQ), stackOffset);
      });
    });
  });

  describe('getStackChannel', () => {
    it('should return the channel in which stack is specified', () => {
      DEFAULT_ENUM_INDEX.stack.forEach((stackOffset: StackOffset | null) => {
        const specStackInX: SpecQuery = {
          mark: 'bar',
          encodings: [
            {channel: CHANNEL.X, aggregate: 'sum', stack: stackOffset, field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
          ]
        };

        assert.equal(getStackChannel(specStackInX), CHANNEL.X);

        const specStackInY: SpecQuery = {
          mark: 'bar',
          encodings: [
            {channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', stack: stackOffset, type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
          ]
        };

        assert.equal(getStackChannel(specStackInY), CHANNEL.Y);

        const specStackInColor: SpecQuery = {
          mark: 'bar',
          encodings: [
            {channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'N1', stack: stackOffset, type: TYPE.NOMINAL}
          ]
        };

        assert.equal(getStackChannel(specStackInColor), CHANNEL.COLOR);
      });
    });
  });

  describe('getVlStack', () => {
    const NON_STACKABLE_MARKS = without(PRIMITIVE_MARKS, STACKABLE_MARKS);
    const NON_STACK_BY_DEFAULT_MARKS = without(PRIMITIVE_MARKS, STACK_BY_DEFAULT_MARKS);

    it('should always return null for nonstackable marks with at least of of the stack channel', () => {
      [undefined, 'center', null, 'zero', 'normalize'].forEach((_stack: StackOffset) => {
        NON_STACKABLE_MARKS.forEach(nonStackableMark => {
          const specQ: SpecQuery = {
            mark: nonStackableMark,
            encodings: [
              {channel: CHANNEL.X, aggregate: 'sum', stack: _stack, field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
            ]
          };
          assert.isNull(getVlStack(specQ));
        });
      });
    });

    it('should always return non-null for implicit stack by default marks', () => {
      STACK_BY_DEFAULT_MARKS.forEach(mark => {
        const specQ: SpecQuery = {
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
          ]
        };
        assert.isNotNull(getVlStack(specQ));
      });
    });

    it('should always return null for implicit stack on non stack by default marks', () => {
      NON_STACK_BY_DEFAULT_MARKS.forEach(mark => {
        const specQ: SpecQuery = {
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
          ]
        };
        assert.isNull(getVlStack(specQ));
      });
    });

    it('should always return null if mark is a wildcard', () => {
      const specQ: SpecQuery = {
        mark: '?',
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
        ]
      };
      assert.isNull(getVlStack(specQ));
    });

    it('should return null if any encoding property is a wildcard', () => {
      let specQ: SpecQuery = {
        mark: 'bar',
        encodings: [
          {channel: '?', field: 'Q', type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
        ]
      };
      assert.isNull(getVlStack(specQ));

      specQ = {
        mark: 'bar',
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.Y, field: '?', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
        ]
      };
      assert.isNull(getVlStack(specQ));

      specQ = {
        mark: 'bar',
        encodings: [
          {channel: CHANNEL.X, field: 'Q', type: TYPE.QUANTITATIVE},
          {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
          {channel: CHANNEL.COLOR, field: 'N1', type: '?'}
        ]
      };
      assert.isNull(getVlStack(specQ));
    });

    it('should always return null if there is no grouping channel', () => {
      [undefined, 'center', null, 'zero', 'normalize'].forEach((_stack: StackOffset) => {
        PRIMITIVE_MARKS.forEach(mark => {
          const specQ: SpecQuery = {
            mark: mark,
            encodings: [
              {channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL}
            ]
          };
          assert.isNull(getVlStack(specQ));
        });
      });
    });
    it('should always be disabled if both x and y are aggregate', () => {
      PRIMITIVE_MARKS.forEach(mark => {
        const specQ: SpecQuery = {
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.Y, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
            {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
          ]
        };
        assert.isNull(getVlStack(specQ));
      });
    });

    it('should always be disabled if neither x nor y is aggregate', () => {
      PRIMITIVE_MARKS.forEach(mark => {
        const specQ: SpecQuery = {
          mark: mark,
          encodings: [
            {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
            {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
          ]
        };
        assert.isNull(getVlStack(specQ));
      });
    });

    describe('getVlStack().groupbyChannel, .fieldChannel', () => {
      it('should be correct for horizontal', () => {
        [BAR, AREA].forEach(stackableMark => {
          const specQ: SpecQuery = {
            mark: stackableMark,
            encodings: [
              {channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
            ]
          };
          const _stack = getVlStack(specQ);
          assert.equal(_stack.fieldChannel, CHANNEL.X);
          assert.equal(_stack.groupbyChannel, CHANNEL.Y);
        });
      });

      it('should be correct for horizontal (single)', () => {
        [BAR, AREA].forEach(stackableMark => {
          const specQ: SpecQuery = {
            mark: stackableMark,
            encodings: [
              {channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
            ]
          };
          const _stack = getVlStack(specQ);
          assert.equal(_stack.fieldChannel, CHANNEL.X);
          assert.equal(_stack.groupbyChannel, null);
        });
      });

      it('should be correct for vertical', () => {
        [BAR, AREA].forEach(stackableMark => {
          const specQ: SpecQuery = {
            mark: stackableMark,
            encodings: [
              {channel: CHANNEL.Y, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.X, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
            ]
          };
          const _stack = getVlStack(specQ);
          assert.equal(_stack.fieldChannel, CHANNEL.Y);
          assert.equal(_stack.groupbyChannel, CHANNEL.X);
        });
      });

      it('should be correct for vertical (single)', () => {
        [BAR, AREA].forEach(stackableMark => {
          const specQ: SpecQuery = {
            mark: stackableMark,
            encodings: [
              {channel: CHANNEL.Y, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
            ]
          };
          const _stack = getVlStack(specQ);
          assert.equal(_stack.fieldChannel, CHANNEL.Y);
          assert.equal(_stack.groupbyChannel, null);
        });
      });

      it('should be correct for auto count', () => {
        [BAR, AREA].forEach(stackableMark => {
          const specQ = {
            mark: stackableMark,
            encodings: [
              {channel: CHANNEL.Y, autoCount: true, type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
            ]
          };
          const _stack = getVlStack(specQ);
          assert.isNotNull(_stack);
        });
      });
    });

    describe('getVlStack().offset', () => {
      it('should return zero for stackable marks with at least of of the stack channel if stacked is unspecified', () => {
        [BAR, AREA].forEach(stackableMark => {
          const specQ: SpecQuery = {
            mark: stackableMark,
            encodings: [
              {channel: CHANNEL.X, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
              {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
              {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
            ]
          };
          assert.equal(getVlStack(specQ).offset, 'zero');
        });
      });

      it('should return the specified stack for stackable marks with at least one of the stack channel', () => {
        ['center', 'zero', 'normalize'].forEach((_stack: StackOffset) => {
          [BAR, AREA].forEach(stackableMark => {
            const specQ: SpecQuery = {
              mark: stackableMark,
              encodings: [
                {channel: CHANNEL.X, stack: _stack, aggregate: 'sum', field: 'Q', type: TYPE.QUANTITATIVE},
                {channel: CHANNEL.Y, field: 'N', type: TYPE.NOMINAL},
                {channel: CHANNEL.COLOR, field: 'N1', type: TYPE.NOMINAL}
              ]
            };
            assert.equal(getVlStack(specQ).offset, _stack);
          });
        });
      });
    });
  });

  describe('fromSpec', () => {
    it('should produce correct SpecQuery', () => {
      const specQ = fromSpec({
        data: {values: [{x: 1}, {x: 2}]},
        transform: [{filter: 'datum.x ===2'}],
        mark: MARK.POINT,
        encoding: {
          x: {
            field: 'x',
            type: TYPE.QUANTITATIVE,
            axis: {orient: 'top', shortTimeLabels: true, tickCount: 5, title: 'test x channel'}
          },
          y: {
            field: 'x',
            type: TYPE.QUANTITATIVE,
            scale: null
          },
          color: {
            field: 'n',
            type: 'nominal',
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        },
        config: {}
      });
      assert.deepEqual(specQ, {
        data: {values: [{x: 1}, {x: 2}]},
        transform: [{filter: 'datum.x ===2'}],
        mark: MARK.POINT,
        encodings: [
          {
            channel: 'x',
            field: 'x',
            type: TYPE.QUANTITATIVE,
            axis: {orient: 'top', shortTimeLabels: true, tickCount: 5, title: 'test x channel'}
          },
          {channel: 'y', field: 'x', type: TYPE.QUANTITATIVE, scale: false},
          {
            channel: 'color',
            field: 'n',
            type: 'nominal',
            legend: {orient: 'right', labelAlign: 'left', symbolSize: 12, title: 'test title'}
          }
        ],
        config: {}
      });
    });

    it('should produce correct SpecQuery with Sort', () => {
      const specQ = fromSpec({
        data: {values: [{x: 1}, {x: 2}]},
        transform: [{filter: 'datum.x ===2'}],
        mark: MARK.POINT,
        encoding: {
          x: {field: 'x', sort: 'ascending', type: TYPE.QUANTITATIVE},
          y: {field: 'x', sort: {field: 'x', op: 'mean', order: 'ascending'}, type: TYPE.QUANTITATIVE, scale: null}
        },
        config: {}
      });
      assert.deepEqual(specQ, {
        data: {values: [{x: 1}, {x: 2}]},
        transform: [{filter: 'datum.x ===2'}],
        mark: MARK.POINT,
        encodings: [
          {channel: 'x', field: 'x', sort: 'ascending', type: TYPE.QUANTITATIVE},
          {
            channel: 'y',
            field: 'x',
            sort: {field: 'x', op: 'mean', order: 'ascending'},
            type: TYPE.QUANTITATIVE,
            scale: false
          }
        ],
        config: {}
      });
    });

    it('should produce correct SpecQuery without data, transform, config', () => {
      const specQ = fromSpec({
        mark: MARK.POINT,
        encoding: {
          x: {field: 'x', type: TYPE.QUANTITATIVE},
          y: {field: 'x', type: TYPE.QUANTITATIVE, scale: null}
        }
      });
      assert.deepEqual(specQ, {
        mark: MARK.POINT,
        encodings: [
          {channel: 'x', field: 'x', type: TYPE.QUANTITATIVE},
          {channel: 'y', field: 'x', type: TYPE.QUANTITATIVE, scale: false}
        ]
      });
    });
  });

  describe('hasWildcard', () => {
    it('returns true if there is a wildcard mark', () => {
      assert(
        hasWildcard({
          mark: '?',
          encodings: []
        })
      );
    });

    it('returns true if there is a wildcard encoding top-level property', () => {
      assert(
        hasWildcard({
          mark: 'point',
          encodings: [
            {
              channel: '?',
              field: 'x',
              type: 'quantitative'
            }
          ]
        })
      );
    });

    it('returns true if there is a wildcard encoding nested property', () => {
      assert(
        hasWildcard({
          mark: 'point',
          encodings: [
            {
              channel: 'x',
              scale: {
                type: '?'
              },
              field: 'x',
              type: 'quantitative'
            }
          ]
        })
      );
    });

    it('returns false if there is no wildcard', () => {
      assert(
        !hasWildcard({
          mark: 'point',
          encodings: [
            {
              channel: 'x',
              bin: {
                maxbins: 20
              },
              field: 'x',
              type: 'quantitative'
            }
          ]
        })
      );
    });

    it('returns false if all wildcard are excluded', () => {
      assert(
        !hasWildcard(
          {
            mark: '?',
            encodings: [
              {
                channel: 'x',
                bin: {
                  maxbins: 20
                },
                field: 'x',
                type: 'quantitative'
              }
            ]
          },
          {exclude: ['mark']}
        )
      );
    });
  });
});
