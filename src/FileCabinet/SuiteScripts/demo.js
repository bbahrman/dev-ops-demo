/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType UserEventScript
 */
define(["require", "exports", "N/query", "N/log"], function (require, exports, query, log) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeLoad = void 0;
    const beforeLoad = (beforeLoadContext) => {
        const soLookup = query.runSuiteQL({
            query: `SELECT id, type, entity, custbody_demo as some_field FROM transaction`
        }).asMappedResults();
        const firstSO = soLookup[0].id;
        log.debug({ title: 'beforeLoad', details: firstSO });
    };
    exports.beforeLoad = beforeLoad;
});
