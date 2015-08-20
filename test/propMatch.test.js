import test from 'tape';
import propMatch from '../src/propMatch';

test('propMatch', (t) => {
    t.test('creates object with correct key', (t) => {
        var prop = propMatch('foo');
        t.test('with default', (t) => {
            var C = {};
            var res = prop.makeFactory(C)(5);
            t.equal(res.foo, 5);
            t.end();
        });

        t.test('with match', (t) => {
            var C = {propTypes: {bar: prop.propType}};
            var res = prop.makeFactory(C)(7);
            t.equal(res.foo, undefined);
            t.equal(res.bar, 7);
            t.equal(Object.keys(res).length, 1);
            t.end();
        });

        t.end();
    });
    t.end();
});
