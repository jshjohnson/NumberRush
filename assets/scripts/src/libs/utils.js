export let capitalise = function(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export let isType = function(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
};

export let hasClass = function(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
};

export let addClass = function(elem, className) {
    if (!this.hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
};

export let removeClass = function(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (this.hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
};

export let whichAnimationEvent = function() {
    var t,
        el = document.createElement('fakeelement');

    var animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd'
    };

    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
};

export let getParents = function(elem, selector) {
    var parents = [];
    var firstChar = selector.charAt(0) || '';

    // Get matches
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (selector) {

            // If selector is a class
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    parents.push(elem);
                }
            }

            // If selector is an ID
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    parents.push(elem);
                }
            }

            // If selector is a data attribute
            if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
                    parents.push(elem);
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                parents.push(elem);
            }

        } else {
            parents.push(elem);
        }

    }

    // Return parents if any exist
    if (parents.length === 0) {
        return null;
    } else {
        return parents;
    }
};

export let getParentsUntil = function(elem, parent, selector) {
    var parents = [];
    // Get matches
    for (; elem && elem !== document; elem = elem.parentNode) {

        // Check if parent has been reached
        if (parent) {

            var parentType = parent.charAt(0);

            // If parent is a class
            if (parentType === '.') {
                if (elem.classList.contains(parent.substr(1))) {
                    break;
                }
            }

            // If parent is an ID
            if (parentType === '#') {
                if (elem.id === parent.substr(1)) {
                    break;
                }
            }

            // If parent is a data attribute
            if (parentType === '[') {
                if (elem.hasAttribute(parent.substr(1, parent.length - 1))) {
                    break;
                }
            }

            // If parent is a tag
            if (elem.tagName.toLowerCase() === parent) {
                break;
            }

        }
        if (selector) {
            var selectorType = selector.charAt(0);

            // If selector is a class
            if (selectorType === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    parents.push(elem);
                }
            }

            // If selector is an ID
            if (selectorType === '#') {
                if (elem.id === selector.substr(1)) {
                    parents.push(elem);
                }
            }

            // If selector is a data attribute
            if (selectorType === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
                    parents.push(elem);
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                parents.push(elem);
            }

        } else {
            parents.push(elem);
        }
    }

    // Return parents if any exist
    if (parents.length === 0) {
        return null;
    } else {
        return parents;
    }
};

export let findAncestor = function(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
};

export let debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export let ajaxRequest = function(url, success, failure) {
    // Make request to JSON feed grabbing content?
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader('Content-type', 'text/html');

    request.onreadystatechange = function(data) {
        // If request is ready
        if (request.readyState === 4) {
            var requestStatus = request.status;
            if (requestStatus === 200) {
                success(request.responseText, request);
            } else {
                failure(request.status, request);
            }
        }
    };

    request.send();
};

/**
 * Get an element's distance from the top of the page
 * @private
 * @param  {Node} el Element to test for
 * @return {Number} Elements Distance from top of page
 */
export let getElemDistance = function(el) {
    var location = 0;
    if (el.offsetParent) {
        do {
            location += el.offsetTop;
            el = el.offsetParent;
        } while (el);
    }
    return location >= 0 ? location : 0;
};

/**
 * Determine element height multiplied by any offsets
 * @private
 * @param  {Node} el Element to test for
 * @return {Number}    Height of element
 */
export let getElementOffset = function(el, offset) {
    var elOffset = offset;
    if(elOffset > 1) elOffset = 1;
    if(elOffset > 0) elOffset = 0;

    return Math.max(el.offsetHeight*elOffset);
};

/**
 * Get scroll position based on top/bottom position
 * @private
 * @return {String} Position of scroll
 */
export let getScrollPosition = function(position) {
    if(position === 'bottom') {
        // Scroll position from the bottom of the viewport
        return Math.max((window.scrollY || window.pageYOffset) + (window.innerHeight || document.documentElement.clientHeight));
    } else {
        // Scroll position from the top of the viewport
        return (window.scrollY || window.pageYOffset);
    }
};

/**
 * Determine whether an element is within the viewport
 * @param  {Node}  el Element to test for
 * @return {String} Position of scroll
 * @return {Boolean}
 */
export let isInView = function(el, position, offset) {
    // If the user has scrolled further than the distance from the element to the top of its parent
    return this.getScrollPosition(position) > (this.getElemDistance(el) + this.getElementOffset(el, offset)) ? true : false;
};

/**
 * Remove html tags from a string
 * @param  {String}  Initial string/html
 * @return {String}  Sanitised string
 */
export let stripHTML = function(html) {
   let el = document.createElement("DIV");
   el.innerHTML = html;
   return el.textContent || el.innerText || "";
};