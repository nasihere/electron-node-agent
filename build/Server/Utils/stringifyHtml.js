"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringifyHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
exports.stringifyHtml = stringifyHtml;
//# sourceMappingURL=stringifyHtml.js.map