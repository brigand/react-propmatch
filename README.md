
propmatch is a useful utility for all high order components. It's useful because strings are brittle identifiers in composition, and
it allows you to see where props are coming from in the wrapped component.

## Install

react-propmatch is [available on npm][npm].

```sh
npm install react-propmatch
```

[npm]: https://www.npmjs.com/package/react-propmatch

## Guide

Note: This guide assumes you're using es6 with babel, and the optional 'es7.classProperties' transform.

Let's start by writing a simple high order component that sends the current time as a prop. The details are omitted for brevity.

```js
function providesTime(Component){

  return class TimeProvider extends React.Component {
    constructor(){ ... }
    componentDidMount(){ ... }
    componentWillUnmount(){ ... }

    render(){
      return <Component {...this.props} time={this.state.time} />
    }
  };
}

@providesTime
class Clock {
  render(){
    return <div>new Date(this.props.time).toString()</div>;
  }
}
```

Because string keys are brittle and conflict prone, and the origin of props is often unclear, we can use react-propmatch to
enable a clearer way of describing the relationship.

```js
import propMatch from 'react-propmatch';

var {propTypes, makeFactory} = propMatch({time: null});

function providesTime(Component){
  var makeProps = makeFactory(Component);

  return class TimeProvider extends React.Component {
    constructor(){ ... }
    componentDidMount(){ ... }
    componentWillUnmount(){ ... }

    render(){
      return <Component 
        {...this.props} 
        {...makeProps({time: this.state.time})}
      />
    }
  };
}

// expose the propTypes
providesTime.propTypes = propTypes;

@providesTime
class Clock {
  render(){
    return <div>new Date(this.props.time).toString()</div>;
  }
}
```

And this behaves exactly like the first example. So let's say that our clock want's to take a prop called 'time' which is a boolean. If true, don't render the date.

Damn, we have a conflict. Well instead of changing clock's api, or having to change the possibly third-party `providesTime`, we just declare our propTypes.

```js
@providesTime
class Clock {
  static propTypes = {
    time: PropTypes.boolean,
    milliseconds: providesTime.propTypes.time,
  };

  render(){
    var d = new Date(this.props.milliseconds);
    return <div>{this.props.time ? d.toTimeString() : d.toString()}</div>;
  }
}
```

react-propmatch looks at the propTypes and tries to find a match. It falls back to using the keys you provide initially, which is why it defaults to 'time' here.

That's all, happy high order component making!



