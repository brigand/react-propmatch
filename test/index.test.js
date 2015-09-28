import test from 'tape'
import propMatch from '../src/index';

test('index', (t) => {

  t.test('returns propTypes with correct keys', (t) => {
    var {propTypes} = propMatch({a: null, b: null});
    t.equal(Object.keys(propTypes).join(', '), 'a, b');
    t.equal(typeof propTypes.a, 'function');
    t.equal(typeof propTypes.b, 'function');
    t.end();
  });

  t.test('maps props', (t) => {
    var {propTypes, makeFactory} = propMatch({a: null, b: null});
    class Component {
      static propTypes = {
        'other a': propTypes.a,
      };
    }
    var makeProps = makeFactory(Component);
    var props = makeProps({a: 1, b: 2});
    t.deepEqual(props, {'other a': 1, b: 2});

    t.end();
  });
});

