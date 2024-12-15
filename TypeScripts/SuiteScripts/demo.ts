/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @NScriptType UserEventScript
 */

import type { EntryPoints } from "N/types";
import query = require("N/query");
import runtime = require("N/runtime");
import log = require("N/log");

export const beforeLoad: EntryPoints.UserEvent.beforeLoad = (beforeLoadContext) => {
  const soLookup: ISQLSalesOrder[] = query
    .runSuiteQL({
      query: "SELECT id, type, entity, custbody_demo as some_field FROM transaction",
    })
    .asMappedResults() as any;

  const firstSO = soLookup[0].id;
  log.debug({ title: "beforeLoad", details: firstSO });
};

export const beforeSubmit: EntryPoints.UserEvent.beforeSubmit = (beforeSubmitContext) => {
  const rec = beforeSubmitContext.newRecord;
  if (runtime.ContextType.WEBSERVICES === runtime.executionContext) {
    rec.setValue({ fieldId: "custbody_integrated", value: true });
  }
  const sublistId = "item";
  const lineCount = rec.getLineCount({ sublistId });
  for (let line = 0; line < lineCount; line++) {
    const value = rec.getSublistValue({ sublistId, fieldId: "quantity", line });
    rec.setSublistValue({ sublistId, fieldId: "custcol_original_quantity", line, value });
  }
};

interface ISQLSalesOrder {
  id: number;
  type: string;
  entity: number;
  some_field: "T" | "F";
}
