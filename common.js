/**
 * @param {Event & { target: HTMLTextAreaElement | HTMLInputElement }} evt
 */
export const focusSelect = ({ target }) => {
  target.focus();
  target.select();
};

/**
 * @param {Event & { target: HTMLTextAreaElement | HTMLInputElement }} evt
 */
export const focusSelectCopy = (evt) => {
  focusSelect(evt);
  navigator.clipboard.writeText(evt.target.value);
};
