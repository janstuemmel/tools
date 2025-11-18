import { createCleartextMessage, decryptKey, readPrivateKey, sign } from "https://esm.sh/openpgp@6.2.2";
import { focusSelect, focusSelectCopy, growTextarea } from "../../util.js";

const privkeyElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-privkey"));
const passwordElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-password"));
const messageElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-message"));
const signedMessageElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("output-signed-message"));

/**
 * @param {Error} e
 */
const mapError = (e) => {
  switch (e.message) {
    case "readPrivateKey: must pass options object containing `armoredKey` or `binaryKey`":
    case "Misformed armored text":
      throw new Error("privkey not valid or empty");
    default:
      throw e;
  }
};

const update = async () => {
  const armoredKey = privkeyElem.value;
  const text = messageElem.value;
  const passphrase = passwordElem.value ?? undefined;

  if (!text) {
    signedMessageElem.value = "";
    return;
  }

  growTextarea(messageElem);

  const readKey = readPrivateKey({ armoredKey })
    .then((privateKey) => privateKey.isDecrypted() ? privateKey : decryptKey({ privateKey, passphrase }));

  await Promise.all([readKey, createCleartextMessage({ text })])
    .then(([signingKeys, message]) => sign({ signingKeys, message }))
    .then((value) => {
      signedMessageElem.value = value;
      growTextarea(signedMessageElem);
    })
    .catch(mapError)
    .catch((e) => {
      signedMessageElem.value = e.message ? `Error: ${e.message}` : `${e}`;
    });
};

messageElem.addEventListener("input", update);
privkeyElem.addEventListener("input", update);
passwordElem.addEventListener("input", update);

privkeyElem.addEventListener("click", focusSelect);
signedMessageElem.addEventListener("click", focusSelectCopy);

update();
