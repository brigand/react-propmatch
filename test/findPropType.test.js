import test from 'tape'
import findPropType from '../src/findPropType';

test('findPropType', (t) => {
  var propTypeYes = () => {};
  var propTypeNo = () => {};
  class Component {
    static propTypes = {
      a: propTypeYes,
    };
  }

  const runTest = (t, propType, defaultName, expected) => t.equal(
    findPropType(Component, propType, defaultName),
    expected
  )

  t.test('finds positive case', (t) => {
    runTest(t, propTypeYes, 'failure', 'a');
    t.end();
  });


  t.test('finds negative case', (t) => {
    runTest(t, propTypeNo, 'success', 'success');
    t.end();
  });
});

