
propmatch is a useful utility for all high order components. It's useful because strings are brittle identifiers in composition.

## Install

react-propmatch is [available on npm][npm].

```sh
npm install react-propmatch
```

[npm]: https://www.npmjs.com/package/react-propmatch

## Guide/Rationale

Imagine you have a high order component that provides a random number.

```js
function providesRandomNumber(Component){
    return class ProvidesNumber {
        constructor(){
            this.number = Math.random();
        }
        render(){
            return <Component {...this.props} number={this.number} />;
        }
    }
}
```

Cool and now I want to use it on this TimesRandom component. The api looks like this `<TimesRandom number={5} />` and displays a number between 0 and 5;

```js
import providesRandomNumber from './providesRandomNumber';

export default
@providesRandomNumber
class TimesRandom {
    static propTypes = {
        number: React.PropTypes.number
    };
    render(){
        return <div>{this.props.number * this.props.number}</div>;
    }
}
```

Wait! Where did the `5` go? There's compitition over the 'number' name. Also, it's not clear looking at TimesRandom what props providesRandomNumber will be passing.

If we turn to dependency injection via propTypes matching, this gives TimesRandom control over the prop name, and a clear way to document its usage.

```js
import propMatch from 'react-propmatch';

// by default it'll use "number" as the prop name
// we also declare the propType in case our HOC passes something invalid,
// and also so it self documents what it's passing down
// the second parameter defaults to PropTypes.any
const numberProp = propMatch('number', React.PropTypes.number);
export let propType = numberProp.propType;

function providesRandomNumber(Component){
    // make a prop returning factory
    var makeProps = numberProp.makeFactory(Component);

    return class ProvidesNumber {
        constructor(){
            this.number = Math.random();
        }
        render(){
            return <Component {...this.props} {...makeProps(this.number)} />;
        }
    }
}
```

Now with a minor modification, we say that the random number should show up as `this.props.contrivedExample`, and so it is. Now our component
works correctly and we can clearly see the relationship between `providesRandomNumber` and `TimesRandom`'s props without looking at the
`providesRandomNumber` source. Also we need to change neither `providesRandomNumber` or `TimesRandom`'s api when there's a conflict.

```js
import providesRandomNumber, {propType as randomNumberProp} from './providesRandomNumber';

export default
@providesRandomNumber
class TimesRandom {
    static propTypes = {
        number: React.PropTypes.number,
        contrivedExample: randomNumberProp
    };
    render(){
        return <div>{this.props.number * this.props.contrivedExample}</div>;
    }
}
```


