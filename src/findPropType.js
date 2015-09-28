/*
 Searches for the propType in Component's propType
 Returns a string
 */
export default function findPropType(Component, propType, defaultKey){
  if (!Component.propTypes) return defaultKey;
  var keys = Object.keys(Component.propTypes);
  for (let key of keys) {
    if (Component.propTypes[key] === propType) {
      return key;
    }
  }
  return defaultKey;
}

