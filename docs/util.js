/**
 * @param {PointerEvent} evt
 */
export const focusSelect = (evt) => {
  const target = /** @type {HTMLTextAreaElement | HTMLInputElement} */ (evt.target);
  if (target) {
    target.focus();
    target.select();
  }
};

/**
 * @param {PointerEvent} evt
 */
export const focusSelectCopy = (evt) => {
  const target = /** @type {HTMLTextAreaElement | HTMLInputElement} */ (evt.target);
  focusSelect(evt);
  if (target) {
    navigator.clipboard.writeText(target.value);
  }
};

/**
 * 
 * @param {HTMLTextAreaElement} elem 
 * @param {number} rows 
 */
export const growTextarea = (elem, rows = 5) => {
  const elemLength = elem.value.split("\n").length;
  elem.rows = elemLength > rows ? elemLength : rows;
}