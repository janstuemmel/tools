import { createMessage, encrypt, readKey } from "https://esm.sh/openpgp@6.2.2";
import { focusSelect, focusSelectCopy } from "../../util.js";

const pubkeyElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-pubkey"));
const pubkeyInfoElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-pubkey-info"));
const messageElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-message"));
const cipherElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("output-cipher"));

const update = async () => {
  const armoredKey = pubkeyElem.value;
  const text = messageElem.value;

  const textLength = text.split("\n").length;
  messageElem.rows = textLength > 5 ? textLength : 5;

  await Promise.all([readKey({ armoredKey }), createMessage({ text })])
    .then(([encryptionKeys, message]) => {
      pubkeyInfoElem.value = encryptionKeys.users.map((u) => `UserID: ${u.userID?.userID ?? "n/A"}`).join("\n");
      pubkeyInfoElem.rows = encryptionKeys.users.length;
      return encrypt({ message, encryptionKeys });
    })
    .then((cipher) => {
      cipherElem.rows = text !== "" ? cipher.split("\n").length : 5;
      cipherElem.value = text !== "" ? cipher : "";
    })
    .catch((e) => {
      pubkeyInfoElem.value = "";
      cipherElem.value = armoredKey !== "" ? `Error: ${e.message}` : "";
    });
};

pubkeyElem.addEventListener("input", update);
messageElem.addEventListener("input", update);
pubkeyElem.addEventListener("click", focusSelect);
cipherElem.addEventListener("click", focusSelectCopy);

update();
