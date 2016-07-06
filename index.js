/**
 * Mounts React and plain Javascript components to HTML-DOM elements. Each component
 * receives any data-attribute on it's mount-tag as props.
 *
 * Based on https://github.com/finaldream/mount-component
 *
 * @author Oliver Erdmann, <o.erdmann@finaldream.de>
 * @since 22.06.2016
 */


var React = require('react');
var ReactDOM = require('react-dom');
var camelcase = require('camelcase');

var DATA_ATTR_REGEX = /^data-([\w-_]*)/i;
var components = [];

/**
 * Resolves a named attribute from an Element.
 *
 * @private
 * @param {Element} element Element to get the attribute from
 * @param {String} name Name of the attribute (key)
 * @param {*} [defaultValue] Optional value returned if the attribute dones nt exists.
 *
 * @returns {*} The attribute's value or defaultValue
 */
function getNamedAttribute(element, name, defaultValue) {

    if (!element || !element.attributes || !element.attributes.getNamedItem) {
        return defaultValue;
    }

    return child.attributes.getNamedItem(name) ?
           child.attributes.getNamedItem(name).nodeValue :
           defaultValue;
}

/**
 * Gets props for element
 *
 * @private
 * @param {Element} el Element to get props for
 * @returns {object}
 */
function getProps(el) {

    var result = {};

    var children = el.children;
    for (var i = 0; i < children.length; i++) {

        var child = children[i];

        if (child &&
            child.tagName.toLowerCase() === 'script' &&
            getNamedAttribute(child, 'type') === 'application/json'
        ) {
            var key = getNamedAttribute(child, 'id',
                getNamedAttribute(child, 'data-id', 'json')
            );

            key = camelcase(key);

            try {
                var content = child.innerHTML;
                result[key] = JSON.parse(content);
            } catch(e) {}
        }
    }

    if (!el.hasAttributes()) {
        return result;
    }

    var attrs = el.attributes;
    for (var j = attrs.length - 1; j >= 0; j--) {

        var match = DATA_ATTR_REGEX.exec(attrs[j].name);
        if (!match || match.length < 2) {
            continue;
        }

        var propName = camelcase(match[1]);
        var value = decodeURI(attrs[j].value);

        // Try to parse json.
        try {
            value = JSON.parse(value);
        } catch (e) {
            // noop
        }

        result[propName] = value;

    }

    return result;

}

/**
 * Mounts React-Components for all elements matching the selector.
 * Any data-attributes will be passed as props, prop-names are converted to camelcase,
 * with the 'data-' part stripped off (eg. "data-base-path" will become "basePath").
 * Tries to parse JSON for props, passes values as objects on success, as string otherwise.
 * Provides a references to the mounted node as `this.props.mountNode`.
 *
 * Will also instantiate non-React-Components, by passing the mounted node and props to the varructor.
 *
 * @param {string}                 selector  Selector to convert into react-components
 * @param {React.Component|string|function} component The (un-instantiated) React-Component, it's name or any
 *                                                    non-react function(node: Element, props: Object)
 */
function mountComponent(selector, component) {

    var elements = document.querySelectorAll(selector);

    if (!elements || !elements.length) {
        return;
    }

    for (var i = 0, l = elements.length; i < l; i++) {

        var el = elements[i];

        if (!el) {
            return;
        }

        var props = getProps(el);

        props.mountNode = el;

        // Allows mounting non-react components
        if (!component.prototype.isReactComponent) {

            /*eslint no-new: 0*/
            new component(el, props);

            continue;
        }

        var reactElement = React.createElement(component, props);
        ReactDOM.render(
            reactElement,
            el
        );

    }
}


/**
 * Registers a component globally to be mounted.
 *
 * @param {string} selector
 * @param {function} component
 */
function registerComponent(selector, component) {

    var reactComponent = {};
    reactComponent.selector = selector;
    reactComponent.component = component;

    components.push(reactComponent);
}

/**
 * Mounts all registered components.
 */
function mountAll() {

    components.forEach(function(component) {
        mountComponent(component.selector, component.component);
    });
}

module.exports = {
    mountComponent: mountComponent,
    registerComponent: registerComponent,
    mountAll: mountAll,
};
