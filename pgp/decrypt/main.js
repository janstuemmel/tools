import {
  decrypt,
  decryptKey,
  readMessage,
  readPrivateKey,
} from "https://esm.sh/openpgp@6.2.2";
import { focusSelect } from "../../common.js";

/** @type {Record<string, HTMLTextAreaElement>} */
const ELEM = {
  privkey: document.getElementById("input-privkey"),
  password: document.getElementById("input-password"),
  cipher: document.getElementById("input-cipher"),
  cleartext: document.getElementById("output-cleartext"),
};

const update = async () => {
  const armoredKey = ELEM.privkey.value;
  const armoredMessage = ELEM.cipher.value;
  const passphrase = ELEM.password.value ?? undefined;

  const inputCipherLenth = ELEM.cipher.value.split("\n").length;
  ELEM.cipher.rows = inputCipherLenth > 5 ? inputCipherLenth : 5;

  if (!armoredKey || !armoredMessage) {
    ELEM.cleartext.value = "";
    return;
  }

  const readKey = readPrivateKey({ armoredKey })
    .then((privateKey) =>
      privateKey.isDecrypted()
        ? privateKey
        : decryptKey({ privateKey, passphrase })
    );

  await Promise.all([readMessage({ armoredMessage }), readKey])
    .then(([message, decryptionKeys]) => decrypt({ message, decryptionKeys }))
    .then(({ data }) => {
      ELEM.cleartext.value = data;
      const dataLength = data.split("\n").length;
      ELEM.cleartext.rows = dataLength > 5 ? dataLength : 5;
    })
    .catch((e) => {
      ELEM.cleartext.value = `Error: ${e.message}`;
    });
};

ELEM.cipher.addEventListener("input", update);
ELEM.privkey.addEventListener("input", update);
ELEM.password.addEventListener("input", update);

ELEM.cipher.addEventListener("click", focusSelect);
ELEM.privkey.addEventListener("click", focusSelect);

update();
