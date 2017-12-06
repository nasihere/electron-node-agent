"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function HMTimeNow() {
    var d = new Date(), h = (d.getHours() < 10 ? '0' : '') + d.getHours(), m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    return h + ':' + m;
}
exports.HMTimeNow = HMTimeNow;
//# sourceMappingURL=time.js.map