/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType UserEventScript
 */
define(["require", "exports", "N/query", "N/runtime", "N/log"], function (require, exports, query, runtime, log) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeSubmit = exports.beforeLoad = void 0;
    const beforeLoad = (beforeLoadContext) => {
        const soLookup = query
            .runSuiteQL({
            query: "SELECT id, type, entity, custbody_demo as some_field FROM transaction",
        })
            .asMappedResults();
        const firstSO = soLookup[0].id;
        log.debug({ title: "beforeLoad", details: firstSO });
    };
    exports.beforeLoad = beforeLoad;
    const beforeSubmit = (beforeSubmitContext) => {
        const rec = beforeSubmitContext.newRecord;
        if (runtime.ContextType.WEBSERVICES === runtime.executionContext) {
            rec.setValue({ fieldId: "custbody_integrated", value: true });
        }
        const sublistId = "item";
        const lineCount = rec.getLineCount({ sublistId });
        const today = new Date();
        for (let line = 0; line < lineCount; line++) {
            const value = rec.getSublistValue({ sublistId, fieldId: "quantity", line });
            if (!rec.getSublistValue({ sublistId, fieldId: "custcol_date_saved", line })) {
                rec.setSublistValue({ sublistId, fieldId: "custcol_date_saved", line, value: today });
            }
            rec.setSublistValue({ sublistId, fieldId: "custcol_original_quantity", line, value });
        }
    };
    exports.beforeSubmit = beforeSubmit;
});
