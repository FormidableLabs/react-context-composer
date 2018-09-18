/*
 * Reacts new context API encourages composing. But composing renderFns can get really long
 * This utility lets us simplify our render methods by composing multiple contexts together
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

    return curry(contexts.slice().reverse());

  // Compose Providers
  } else {
    return contexts.reduceRight((children, parent, i) => {
      return React.cloneElement(parent, {
        children,
      });
    }, children);
  }
}

// This is a loose check which is sufficient for duck-typing Context objects but is not sound for
// general use.
// We do _not_ want to duplicate the internals of react-is (which has `isContextConsumer` and
// `isContextProvider`) here, nor worry about only importing it in development builds.
const reactOpaqueComponent = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.func
]);

ContextComposer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]).isRequired,

  contexts: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.shape({
        Provider: reactOpaqueComponent.isRequired,
        Consumer: reactOpaqueComponent.isRequired
      }),
    ])
  ).isRequired,
};

