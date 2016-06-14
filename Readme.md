# Mount Component

Mounts React and plain Javascript components to HTML-DOM elements. Each component
receives any data-attribute on it's mount-tag as props.

Components can be of type React.Component or any given self-contained function.


## Usage

```html
<Slider data-show="3" data-content="{...}"></Slider>
<div class="grid" data-limit="12" data-offset="0" data-content="{...}"></div>
```

```javascript

import {registerComponent, mountAll} from 'mount-component';

// Registers a component to a custom Tag.
registerComponent('Slider', SliderComponent);
registerComponent('.grid', GridComponent);

// Mounts all registered components to matching DOM-elements.
mountAll();
```

## API

### mountComponent(selector, component)

Mounts a single component to any elements matching `selector`.

*selector: string* Selector to convert into react-components. Can be everything that `querySelector` accepts.
*component: React.Component|string|function* The (un-instantiated) React-Component, it's name or any non-react `function(node: Element, props: Object)`.

### registerComponent(selector, component)

Registers a component and it's selector globally.

*selector: string* Selector to convert into react-components. Can be everyhing that `querySelector` accepts.
*component: React.Component|string|function* The (un-instantiated) React-Component, it's name or any non-react `function(node: Element, props: Object)`.

### function mountAll()

Mounts all registered components.

# Authors

* Oliver Erdmann [finaldream](https://github.com/finaldream)

# License

This project is licensed under the [ISC](https://opensource.org/licenses/ISC) License.
