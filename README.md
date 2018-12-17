# DEPRECATED

With the advent of React's new hooks feature, this package has little value. Instead of rendering your contexts, you can use the react hook to access it in the function definition. An example:

```js
import { useContext } from 'react';
import { ContextA, ContextB, ContextC } from './contexts';

function Component() {
  const a = useContext(ContextA);
  const b = useContext(ContextB);
  const c = useContext(ContextC);
  
  return (<...>);
}
```


## react-context-composer 

React 16.3 shipped a new [Context API](https://reactjs.org/docs/context.html). The API encourages composition. This utility component helps keep your code clean when your component will be rendering multiple Context Providers and Consumers.

## Usage

```jsx
import React, { Component } from 'react'
import ContextComposer from 'react-context-composer';
import createReactContext, { type Context } from 'create-react-context';

type Theme = 'light' | 'dark';
type Language = 'en';

// Pass a default theme to ensure type correctness
const ThemeContext: Context<Theme> = createReactContext('light');
const LanguageContext: Context<Language> = createReactContext('en');

class ThemeToggler extends React.Component<
  { children: Node },
  { theme: Theme, language: Language }
> {
  state = { theme: 'light', language: 'en' };
  render() {
    return (
      // Pass the current context value to the Provider's `value` prop.
      // Changes are detected using strict comparison (Object.is)
      <ContextComposer contexts={[
        <ThemeContext.Provider value={this.state.theme} />
        <LanguageContext.Provider value={this.state.language} />
      ]}>
        <button
          onClick={() => {
            this.setState(state => ({
              theme: state.theme === 'light' ? 'dark' : 'light'
            }));
          }}
        >
          Toggle theme
        </button>
        {this.props.children}
      </ContextComposer>
    );
  }
}

function Title({children}) {
  return (
    <ContextComposer contexts={[ThemeContext, LanguageContext]}>
      {(theme, language) => (
        <h1 style={{ color: theme === 'light' ? '#000' : '#fff' }}>
          {language}: {children}
        </h1>
      )}
    </ContextComposer>
  );
}

render(
  <ThemeToggler>
    <Title>Hi!</Title>
  </ThemeToggler>,
  domNode
);
```

## License

MIT © [Blaine Kasten](https://github.com/blainekasten)
