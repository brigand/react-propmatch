import findPropType from './findPropType';

/*
 Takes a mapping of props to propTypes. You can pass null as a shorthand for PropTypes.any.
 Returns an object with `propTypes` and `makeFactory` properties. See below.
 */
export default function propMatch(props){
  var res = {};
  var sourceKeys = Object.keys(props)

  /*
   Make a propTypes mapping which should be exposed to the user.
   These are how reverse lookups are performed.
   */
  res.propTypes = sourceKeys.reduce((propTypes, key) => {
    propTypes[key] = (...args) => {
      if (typeof props[key] === 'function') {
        return props[key](...args);
      }
    };
    return propTypes;
  }, {});


  /*
   This returns a factory where props may be passed in,
   and the keys will be transformed to match the output keys.

   Call this once directly inside the high order component.
   */
  res.makeFactory = (Component) => {
    var restPropTypes = Object.assign({}, Component.propTypes || {});

    var keyMap = sourceKeys.reduce((keyMap, key) => {
      keyMap[key] = findPropType(Component, res.propTypes[key], key);
      delete restPropTypes[keyMap[key]];
      return keyMap;
    }, {});



    /*
     This function takes props and returns props.
     Example usage:

     ```js
     <Component {...thisFunction({a: 1})} />
     ```
     */
    return {
      restPropTypes: restPropTypes,
      makeProps: (inProps) => {
        // potentially hot path code
        var outProps = {};
        for (let i=0; i<sourceKeys.length; i++) {
          let inKey = sourceKeys[i];
          let outKey = keyMap[inKey];
          outProps[outKey] = inProps[inKey];
        }
        return outProps;
      }
    }
  };

  return res;
}

