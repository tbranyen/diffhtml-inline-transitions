diffHTML Inline Transitions
---------------------------

Latest stable version: 1.2.0

[![Build Status](https://travis-ci.org/tbranyen/diffhtml-inline-transitions.svg?branch=master)](https://travis-ci.org/tbranyen/diffhtml-inline-transitions)
[![Coverage Status](https://coveralls.io/repos/github/tbranyen/diffhtml-inline-transitions/badge.svg?branch=master)](https://coveralls.io/github/tbranyen/diffhtml-inline-transitions?branch=master)

Tiny module to support binding/unbinding transition hooks declaratively.

#### Install

``` sh
npm install diffhtml-inline-transitions
```

#### About transition hooks

diffHTML allows developers to globally define transitions that can react to
changes in the DOM and optionally prevent renders until a returned Promise
completes. This is ideal for animations and monitoring when things happen.

You can read more on them here: https://github.com/tbranyen/diffhtml#user-content-add-a-transition-state-callback

What isn't ideal is defining all these transitions globally. It'd be nicer to
be able to inline them directly into a tagged template...

This module does just that, and works identical to `addTransitionState`, except
for two minor differences.

- First, it adds the element you defined the transition on as the first argument
  to the transition callback. This way you can track the relationship between
  where the transition was mounted and any child elements that may trigger it.

- Second, it sets the transition callback context (the `this`) to be the
  current element being affected, which makes it more useful.

#### API

- Subscribe to attribute changes

  ```js
  const unsubscribe = inlineTransitions(diff);
  ```
- Unsubscribe from attribute changes:

  ```js
  unsubscribe();
  ```

Apply to an element by passing the function to the associated state name:

``` js
import $ from 'jquery';
import * as diff from 'diffhtml';
import inlineTransitions from 'diffhtml-inline-transitions';

const { innerHTML, html } = diff;

// Enable the monitoring of attributes for changes.
inlineTransitions(diff);

// Use jQuery to return a promise and fade in the body and paragraph.
function fadeIn() {
  return $(this).fadeOut(0).fadeIn(1000).promise();
}

innerHTML(document.body, html`<body attached=${fadeIn}>
  <p>Watch me fade in slowly!</p>
</body>`);
```

#### License

Copyright © 2016 Tim Branyen (@tbranyen)
Licensed under the MIT license.
