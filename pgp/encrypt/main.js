import { createMessage, encrypt, readKey } from "https://esm.sh/openpgp@6.2.2";
import { focusSelect, focusSelectCopy } from "../../common.js";

/** @type {Record<string, HTMLTextAreaElement>} */
const ELEM = {
  pubkey: document.getElementById("input-pubkey"),
  pubkeyInfo: document.getElementById("input-pubkey-info"),
  message: document.getElementById("input-message"),
  cipher: document.getElementById("output-cipher"),
};

const update = async () => {
  const armoredKey = ELEM.pubkey.value;
  const text = ELEM.message.value;

  const textLength = text.split("\n").length;
  ELEM.message.rows = textLength > 5 ? textLength : 5;

  await Promise.all([readKey({ armoredKey }), createMessage({ text })])
    .then(([encryptionKeys, message]) => {
      ELEM.pubkeyInfo.value = encryptionKeys.users.map((u) =>
        `UserID: ${u.userID.userID}`
      ).join("\n");
      ELEM.pubkeyInfo.rows = encryptionKeys.users.length;
      return encrypt({ message, encryptionKeys });
    })
    .then((cipher) => {
      ELEM.cipher.rows = text !== "" ? cipher.split("\n").length : 5;
      ELEM.cipher.value = text !== "" ? cipher : "";
    })
    .catch((e) => {
      ELEM.pubkeyInfo.value = "";
      ELEM.cipher.value = armoredKey !== "" ? `Error: ${e.message}` : "";
    });
};

ELEM.pubkey.addEventListener("input", update);
ELEM.message.addEventListener("input", update);
ELEM.pubkey.addEventListener("click", focusSelect);
ELEM.cipher.addEventListener("click", focusSelectCopy);

update();
