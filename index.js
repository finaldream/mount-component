const React = require('react');
const ReactDOM = require('react-dom');
const camelcase = require('camelcase');

const DATA_ATTR_REGEX = /^data-([\w-_]*)/i;
const components = new Map();


/**
 * Gets props for element
 *
 * @param {Element} el Element to get props for
 * @returns {object}
 */
function getProps(el) {

    const result = {};

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
 * Will also instantiate non-React-Components, by passing the mounted node and props to the constructor.
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

    components.set(selector, component);

}

/**
 * Mounts all registered components.
 */
function mountAll() {

    for (const [selector, component] of components) {

        mountComponent(selector, component);

    }

}

module.exports = {
    mountComponent,
    registerComponent,
    mountAll,
};
