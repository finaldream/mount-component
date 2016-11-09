# Mount Component

Binds Javascript- and React-Components to HTML-DOM elements, making them usable similar to WebComponents.
A "component" can be any Javascript-Constructor or React-Components.

**mount-component** also takes care about initial props, passed to each component.
Props can be defined directly on the mounting-tags in a form of `data`-attributes.
Any available data-attribute will be passed to the component's constructor.
It's also possible to pass larger chunks of JSON data, by placing them in dedicated
script-tags below or on the mounting-node (see below).

## Features


## Usage

```html
<Slider data-show="3" data-content="{...}"></Slider>
<div class="grid" data-limit="12" data-offset="0" data-content="{...}"></div>
```

```javascript

import {mountComponent} from 'mount-component';

// Mounts components to custom tags.
mountComponent('Slider', SliderComponent);
mountComponent('.grid', GridComponent);
```

## Passing chunks of JSON-data

While it's possible to encode JSON into data-attributes and **mount-component**
will actually handle decoding them for you. There are good reasons not to use attributes
for larger data-structures. Instead **mount-component** recognizes dedicated
JSON-blocks nested inside or on a mounting-tag.

Those Tags require to be `script`-tags with a type of "application/json" and
an optional `data-name`-attribute set for naming the prop for the data. If you
don't specify a `data-name`-attribute, the default prop-name will be `data`.

**Example**

```html
<MyComponent data-title="Hello World!">
    <script type="application/json" data-name="my-prop">
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
//      myProp: {users: [ ... ]}
// }
```

There is also support for data-only Components, that don't have a visual aspect and therefor don't require to be mounted 
to a special DOM-element, but may need to be initialized with data from the DOM. 

In that case, you can directly specify a script/Json tag as a mounting-element.

```html
<script id="tracking" type="application/json">
    {
        "tracking": {
            ...
        }
    }
</script>
```

```javascript

mountComponent('#tracking', TrackingComponent);

// -> props: {
//      data: {tracking: { ... }}
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

## Changelog

### 1.3.0

* Constructor arguments on pure-JS components have been swapped, so that `props` come first.
* The default Json-key has been changed from "json" to "data"
* Script/Json-Tags can be mounted directly, without the need of an additional wrapper.
* A JSON-tag's prop-name can now only be specified through the attribute `data-name`.

# Authors

* Oliver Erdmann [finaldream](https://github.com/finaldream)

# License

This project is licensed under the [ISC](https://opensource.org/licenses/ISC) License.
