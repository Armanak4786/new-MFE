import configure from 'src/assets/configure.json';

/**
 * Utility functions for workflow status checking with case-insensitive comparison
 */

/**
 * Cleans and normalizes a workflow status string by removing quotes and trimming whitespace
 * @param val - The value to clean
 * @returns Cleaned and normalized string, or empty string if null/undefined
 */
const cleanAndNormalize = (val: string | null | undefined): string => {
  if (!val) {
    return '';
  }
  // Remove leading/trailing quotes (both single and double) and trim whitespace
  return val.replace(/^["']+|["']+$/g, '').trim().toLowerCase();
};

/**
 * Checks if a workflow status is in the view list (case-insensitive)
 * @param status - The workflow status to check
 * @returns true if the status is in the view list
 */
export function isWorkflowStatusInView(status: string | null | undefined): boolean {
  const normalizedStatus = cleanAndNormalize(status);
  if (!normalizedStatus) {
    return false;
  }
  
  return configure?.workflowStatus?.view?.some(
    viewStatus => cleanAndNormalize(viewStatus) === normalizedStatus
  ) || false;
}

/**
 * Checks if a workflow status is in the edit list (case-insensitive)
 * @param status - The workflow status to check
 * @returns true if the status is in the edit list
 */
export function isWorkflowStatusInEdit(status: string | null | undefined): boolean {
  const normalizedStatus = cleanAndNormalize(status);
  if (!normalizedStatus) {
    return false;
  }
  
  return configure?.workflowStatus?.edit?.some(
    editStatus => cleanAndNormalize(editStatus) === normalizedStatus
  ) || false;
}

/**
 * Checks if a workflow status is in either view or edit list (case-insensitive)
 * @param status - The workflow status to check
 * @returns true if the status is in either view or edit list
 */
export function isWorkflowStatusInViewOrEdit(status: string | null | undefined): boolean {
  return isWorkflowStatusInView(status) || isWorkflowStatusInEdit(status);
}

/**
 * Checks if a workflow status should disable the field/button (in view or edit list, case-insensitive)
 * This is an alias for isWorkflowStatusInViewOrEdit for better readability
 * @param status - The workflow status to check
 * @returns true if the field/button should be disabled
 */
export function isWorkflowStatusDisabled(status: string | null | undefined): boolean {
  return isWorkflowStatusInViewOrEdit(status);
}

/**
 * Checks if a workflow status should make the field read-only (in view list only, case-insensitive)
 * @param status - The workflow status to check
 * @returns true if the field should be read-only
 */
export function isWorkflowStatusReadOnly(status: string | null | undefined): boolean {
  return isWorkflowStatusInView(status);
}
