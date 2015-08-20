import {PropTypes} from 'react';
const debugLog = (...xs) => console.error(...xs);

export default function propMatch(name, propTypeToWrap=PropTypes.any){
    function makeFactory(Component){
        if (!Component.propTypes) return makeFactoryForKey(name);

        // find key for key,value of C.pT where value===exports.propType
        for (let propTypeKey of Object.getOwnPropertyNames(Component.propTypes)) {
            const propTypeValue = Component.propTypes[propTypeKey];
            if (propTypeValue === propType) {
                return makeFactoryForKey(propTypeKey);
            }
        }

        return makeFactoryForKey(name);
    }

    function makeFactoryForKey(key){
        debugLog(`makeFactoryForKey('${key}')`);
        return (value) => {
            const res = {[key]: value};
            debugLog(`makeFactoryForKey('${key}')(${JSON.stringify(value)})`);
            return res;
        }
    }

    function propType(...args){
        return propTypeToWrap(...args);
    }
    propType.toString = () => `react-propmatch propType ${name}`;

    return {makeFactory, propType}
};

