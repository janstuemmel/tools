import { decrypt, decryptKey, readMessage, readPrivateKey } from "https://esm.sh/openpgp@6.2.2";
import { focusSelect } from "../../util.js";

const privkeyElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-privkey"));
const passwordElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-password"));
const cipherElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-cipher"));
const cleartextElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("output-cleartext"));

const update = async () => {
  const armoredKey = privkeyElem.value;
  const armoredMessage = cipherElem.value;
  const passphrase = passwordElem.value ?? undefined;

  const inputCipherLenth = cipherElem.value.split("\n").length;
  cipherElem.rows = inputCipherLenth > 5 ? inputCipherLenth : 5;

  if (!armoredKey || !armoredMessage) {
    cleartextElem.value = "";
    return;
  }

  const readKey = readPrivateKey({ armoredKey })
    .then((privateKey) => privateKey.isDecrypted() ? privateKey : decryptKey({ privateKey, passphrase }));

  await Promise.all([readMessage({ armoredMessage }), readKey])
    .then(([message, decryptionKeys]) => decrypt({ message, decryptionKeys }))
    .then(({ data }) => {
      cleartextElem.value = data;
      const dataLength = data.split("\n").length;
      cleartextElem.rows = dataLength > 5 ? dataLength : 5;
    })
    .catch((e) => {
      cleartextElem.value = `Error: ${e.message}`;
    });
};

cipherElem.addEventListener("input", update);
privkeyElem.addEventListener("input", update);
passwordElem.addEventListener("input", update);

cipherElem.addEventListener("click", focusSelect);
privkeyElem.addEventListener("click", focusSelect);

update();
