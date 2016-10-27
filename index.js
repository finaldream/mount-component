/**
 * Mounts React and plain Javascript components to HTML-DOM elements. Each component
 * receives any data-attribute on it's mount-tag as props.
 *
 * Based on https://github.com/finaldream/mount-component
 *
 * @author Oliver Erdmann, <o.erdmann@finaldream.de>
 * @since 22.06.2016
 */

var React;
var ReactDOM;

/* safe-guard optional dependencies */
try{
    React = require('react');
    ReactDOM = require('react-dom');
} catch (e) {}


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

    return element.attributes.getNamedItem(name) ?
           element.attributes.getNamedItem(name).nodeValue :
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
 * Mounts React- or Pure-JS-Components for all elements matching the selector.
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
 * @param {object} [properties] Optional props to be passed to a component.
 *                              Tag-bound props will take precedence.
 * @return {function|array|null} The instance, if one result, an array of instances for multiple results, null for no results.
 */
function mountComponent(selector, component, properties) {

    var elements = document.querySelectorAll(selector);

    if (!elements ||
        !elements.length ||
        !component ||
        !component.prototype
    ) {
        return null;
    }

    var result = [];

    for (var i = 0, l = elements.length; i < l; i++) {

        var el = elements[i];

        if (!el) {
            continue;
        }

        var props = getProps(el);

        if (typeof properties !== 'undefined') {
            props = Object.assign({}, properties, props);
        }

        props.mountNode = el;

        // Allows mounting non-react components
        if (!React || (!!React && !component.prototype.isReactComponent)) {

            /*eslint no-new: 0*/
            result.push(new component(el, props));

            continue;
        }

        if (!React) {
            continue;
        }

        var reactElement = React.createElement(component, props);
        ReactDOM.render(
            reactElement,
            el
        );

        result.push(reactElement);

    }

    if (!result.length) {
        return null;
    }

    if (result.length === 1) {
        return result[0];
    }

    return result;
}


/**
 * Registers a component globally to be mounted.
 *
 * @param {string} selector
 * @param {function} component
 */
function registerComponent(selector, component) {

    var item = {};
    item.selector = selector;
    item.component = component;

    components.push(item);
}

/**
 * Mounts all registered components.
 */
function mountAll() {

    components.forEach(function(item) {
        mountComponent(item.selector, item.component);
    });
}

module.exports = {
    mountComponent: mountComponent,
    registerComponent: registerComponent,
    mountAll: mountAll,
};
