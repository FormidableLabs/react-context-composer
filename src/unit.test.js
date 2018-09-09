/* eslint-env jest */

import ContextComposer from '.';
import React from 'react';
import TestRenderer from 'react-test-renderer';

const Theme = React.createContext('light');
const Language = React.createContext('en');

describe('composing providers', () => {
  test('empty array', () => {
    const renderer = TestRenderer.create(
      <ContextComposer contexts={[]}>
        <div />
      </ContextComposer>
    );
    expect(renderer.toJSON()).toMatchSnapshot();
  });
  test('[Theme]', () => {
    const renderer = TestRenderer.create(
      <ContextComposer contexts={[<Theme.Provider value="themeBar" />]}>
        <Theme.Consumer>{theme => `Theme: ${theme}`}</Theme.Consumer>
      </ContextComposer>
    );
    expect(renderer.toJSON()).toMatchSnapshot();
  });
  test('[Theme, Language]', () => {
    const renderer = TestRenderer.create(
      <ContextComposer
        contexts={[
          <Theme.Provider value="themeBar" />,
          <Language.Provider value="langFoo" />
        ]}
      >
        <Theme.Consumer>{theme => `Theme: ${theme}`}</Theme.Consumer>,
        <Language.Consumer>
          {language => `Language: ${language}`}
        </Language.Consumer>
      </ContextComposer>
    );
    expect(renderer.toJSON()).toMatchSnapshot();
  });
  test('does not mutate contexts array', () => {
    TestRenderer.create(
      <ContextComposer
        contexts={Object.freeze([
          <Theme.Provider value="themeBar" />,
          <Language.Provider value="langFoo" />
        ])}
      >
        <div />
      </ContextComposer>
    );
  });
});

describe('composing consumers', () => {
  test('empty array', () => {
    const render = jest.fn(() => null);
    const renderer = TestRenderer.create(
      <ContextComposer contexts={[]}>{render}</ContextComposer>
    );
    expect(render.mock.calls).toMatchSnapshot();
  });
  test('[Theme]', () => {
    const render = jest.fn(() => null);
    const renderer = TestRenderer.create(
      <Theme.Provider value="themeBar">
        <ContextComposer contexts={[Theme]}>{render}</ContextComposer>
      </Theme.Provider>
    );
    expect(render.mock.calls).toMatchSnapshot();
  });
  test('[Theme, Language]', () => {
    const render = jest.fn(() => null);
    const renderer = TestRenderer.create(
      <Language.Provider value="langFoo">
        <Theme.Provider value="themeBar">
          <ContextComposer contexts={[Theme, Language]}>
            {render}
          </ContextComposer>
        </Theme.Provider>
      </Language.Provider>
    );
    expect(render.mock.calls).toMatchSnapshot();
  });
  test('does not mutate contexts array', () => {
    TestRenderer.create(
      <ContextComposer contexts={Object.freeze([Theme, Language])}>
        {() => null}
      </ContextComposer>
    );
  });
});
