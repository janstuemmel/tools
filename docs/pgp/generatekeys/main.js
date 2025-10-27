import { generateKey } from "https://esm.sh/openpgp@6.2.2";
import { focusSelectCopy } from "../../util.js";

const usernameElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-username"));
const emailElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-email"));
const passwordElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("input-password"));
const pubkeyElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("output-pubkey"));
const privkeyElem = /** @type {HTMLTextAreaElement} */ (document.getElementById("output-privkey"));

const update = async () => {
  const name = usernameElem.value;
  const email = emailElem.value;
  const passphrase = passwordElem.value ?? undefined;

  await generateKey({
    userIDs: [{ name, email }],
    passphrase,
    format: "armored",
  })
    .then(({ privateKey, publicKey }) => {
      pubkeyElem.value = publicKey;
      pubkeyElem.rows = publicKey.split("\n").length;
      privkeyElem.value = privateKey;
      privkeyElem.rows = privateKey.split("\n").length;
    })
    .catch((e) => {
      pubkeyElem.value = `Error: ${e.message}`;
      privkeyElem.value = "";
    });
};

usernameElem.addEventListener("input", update);
emailElem.addEventListener("input", update);
passwordElem.addEventListener("input", update);

privkeyElem.addEventListener("click", focusSelectCopy);
pubkeyElem.addEventListener("click", focusSelectCopy);

update();
