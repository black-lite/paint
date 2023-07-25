"use strict";
var Templates;
(function (Templates) {
    function createElement(tagName, props, ...subNodes) { return $(`<${tagName}/>`, props).append(subNodes); }
    Templates.createElement = createElement;
})(Templates || (Templates = {}));
//# sourceMappingURL=templates.ui.js.map