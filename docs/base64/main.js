const textElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-text"));
const base64Elem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-base64"));


/** @param {string} s */
const atobOrError = (s) => {
  try {
    return atob(s);
  } catch (e) {
    return `Error: ${e}`;
  }
};

/** @param {Event} evt */
const update = (evt) => {
  const target = /** @type {HTMLTextAreaElement} */ (evt.target);

  switch (target.id) {
    case "input-text":
      base64Elem.value = btoa(target.value);
      return;
    case "input-base64":
      textElem.value = atobOrError(target.value);
      return;
  }
};

textElem.addEventListener("input", update);
base64Elem.addEventListener("input", update);
