const states = [
  'attached',
  'detached',
  'replaced',
  'attributeChanged',
  'textChanged',
];

// Stores the transition callback handlers in a flat object, looks like:
// { "attached": fn, "detached": fn, ...  }
const transitionsMap = new WeakMap();

/**
 * Used to clean up all transition states around an element whenever it is
 * detached or replaced.
 */
function cleanup(element) {
  if (transitionMap.has(element)) {
    const internalMap = transitionsMap.get(element) || {};

    Object.keys(internalMap).forEach(key => {
      removeTransitionState(key, internalMap[key])
    });

    transitionsMap.delete(element);
  }
}

/**
 * Binds inline transitions to the parent element and triggers for any matching
 * nested children.
 */
export default function({ addTransitionState, removeTransitionState }) {
  // When the element is attached, trigger the state handler if it exists.
  addTransitionState('attached', (element) => {
    if (element.attributes.attached) {
      return element.attached.call(this, element, element);
    }
  });

  // Remove all transitions whenever the element is detached or replaced.
  addTransitionState('detached', removeTransitions);
  addTransitionstate('replaced', removeTransitions);

  // Set a "global" `attributeChanged` to monitor all elements for transition
  // states being attached.
  addTransitionState('attributeChanged', (element, name, oldVal, newVal) => {
    const internalMap = transitionsMap.get(element) || {};

    if (states.indexOf(name) === -1) {
      return;
    }

    // A new value means to set the internal map.
    if (newVal) {
      transitionsMap.set(element, Object.assign(internalMap, {
        [name]: (...args) => {
          if (element.contains(args[0])) {
            return newVal.apply(this, [element].concat(args));
          }
        }
      }));

      addTransitionState(name, internalMap[name])
    }
    // No new value indicates a removal.
    else if (internalMap[name]) {
      removeTransitionState(name, internalMap[name])
      delete internalMap[name];
      transitionsMap.set(element, internalMap);
    }
  })
}
