# Mount Component

Mounts React- and plain Javascript components to HTML-DOM elements, making them usable in a way WebComponents would be used.
Components can be of type React.Component or any given self-contained function.

**mount-component** also takes care about initial props, passed to each component.
Props can be defined directly on the mounting-tags in a form of `data`-attributes.
Any available data-attribute will be passed to the component's constructor.
It's also possible to pass larger chunks of JSON data, by placing them in dedicated
script-tags below the mounting-node (see below).

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

## Passing large chunks of JSON-data

While it's possible to encode JSON into data-attributes and **mount-component**
will actually handle this for you. There are good reasons not to use attributes
for larger chunks of data. Instead **mount-component** recognizes dedicated
JSON-blocks from script-tags nested inside your mounting-tags.

Those Tags require to be `script`-tags with a type of "application/json" and
an optional `id` or `data-id` set for naming the prop for this data. If you
don't specify an `id` or `data-id`-attribute, the default will be `json`.

**Example**

```html
<MyComponent data-title="Hello World!">
    <script type="application/json" id="my-data-prop">
        {
            "users": [
                {"name": "Jane", "age": 24},
                {"name": "John", "age": 21},
                ...
            ]
        }
    </script>
</MyComponent>
```

```javascript

mountComponent('MyComponent', MyComponent);

// -> props: {
//      title: "Hello World",
//      myDataProp: {users: [ ... ]}
// }
```

## API

### mountComponent(selector, component)

Mounts a single component to any elements matching `selector`.

*selector: string* Selector to convert into react-components. Can be everything that `querySelector` accepts.
*component: React.Component|string|function* The (un-instantiated) React-Component, it's name or any non-react `function(node: Element, props: Object)`.

### registerComponent(selector, component)

Registers a component and it's selector globally.

*selector: string* Selector to convert into react-components. Can be everything that `querySelector` accepts.
*component: React.Component|string|function* The (un-instantiated) React-Component, it's name or any non-react `function(node: Element, props: Object)`.

### function mountAll()

Mounts all registered components.

# Authors

* Oliver Erdmann [finaldream](https://github.com/finaldream)

# License

This project is licensed under the [ISC](https://opensource.org/licenses/ISC) License.
