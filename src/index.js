/*
 * Reacts new context API encourages composing. But composing renderFns can get really long
 * This utility lets us implify our render methods by composing multiple contexts together
 *
 * example:
 *
 * ```js
 *   <ContextComposer contexts={[
 *    <Theme.Provider value="light" />
 *    <Language.Provider value="en" />
 *   ]}>
 *
 *     <ContextComposer contexts={[Theme, Language]}>
 *       {(theme, language) => <span>{theme} {language}</span>}
 *     </ContextComposer>
 *
 *   </ContextComposer>
 * ```
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function ContextComposer({contexts, children}) {
  // Compose Consumers for renderfns
  if (typeof children === 'function') {
    const curriedContexts = [];
    const curry = (currentContexts) => {
      if (!currentContexts.length) {
        return children(...curriedContexts);
      }

      const Context = currentContexts.pop();

      return (
        <Context.Consumer>
          {(providedContext) => {
            curriedContexts.push(providedContext);

            return curry(currentContexts);
          }}
        </Context.Consumer>
      );
    }

    return curry(contexts.reverse());

  // Compose Providers
  } else {
    return contexts.reduce((res, context, i) => {
      return React.cloneElement(context, {
        children: context[i + 1] || children,
      });
    });
  }
}

ContextComposer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]).isRequired,

  contexts: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.shape({
        Provider: PropTypes.func.isRequired,
        Consumer: PropTypes.func.isRequired
      }),
    ])
  ).isRequired,
};

