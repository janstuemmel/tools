import { readCleartextMessage, readKey, verify } from "https://esm.sh/openpgp@6.2.2";
import { focusSelect, growTextarea } from "../../util.js";

const privkeyElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-pubkey"));
const signedMessageElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-signed-message"));
const resultElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("output-result"));

/**
 * @param {Error} e
 */
const mapError = (e) => {
  switch (e.message) {
    case "readCleartextMessage: must pass options object containing `cleartextMessage`":
    case "Misformed armored text":
      throw new Error("signed message empty or malformed");
    case "readKey: must pass options object containing `armoredKey` or `binaryKey`":
      throw new Error("privkey not valid or empty");
    default:
      throw e;
  }
};

const update = async () => {
  const armoredKey = privkeyElem.value;
  const text = signedMessageElem.value;

  if (!text) {
    resultElem.value = "";
    return;
  }

  growTextarea(signedMessageElem);

  await Promise.all([readKey({ armoredKey }), readCleartextMessage({ cleartextMessage: text })])
    .then(([verificationKeys, message]) => verify({ message, verificationKeys, expectSigned: true }))
    .then(({ signatures }) => signatures.map((s) => s.verified))
    .then(() => {
      resultElem.value = `Verified`;
    })
    .catch(mapError)
    .catch((e) => {
      resultElem.value = e.message ? `Error: ${e.message}` : `${e}`;
    });
};

signedMessageElem.addEventListener("input", update);
privkeyElem.addEventListener("input", update);

privkeyElem.addEventListener("click", focusSelect);
signedMessageElem.addEventListener("click", focusSelect);

update();
