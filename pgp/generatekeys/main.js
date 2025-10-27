import { generateKey } from "https://esm.sh/openpgp@6.2.2";
import { focusSelectCopy } from "../../common.js";

/** @type {Record<string, HTMLTextAreaElement>} */
const ELEM = {
  username: document.getElementById("input-username"),
  email: document.getElementById("input-email"),
  password: document.getElementById("input-password"),
  pubkey: document.getElementById("output-pubkey"),
  privkey: document.getElementById("output-privkey"),
};

const update = async () => {
  const name = ELEM.username.value;
  const email = ELEM.email.value;
  const passphrase = ELEM.password.value ?? undefined;

  await generateKey({
    userIDs: [{ name, email }],
    passphrase,
    format: "armored",
  })
    .then(({ privateKey, publicKey }) => {
      ELEM.pubkey.value = publicKey;
      ELEM.pubkey.rows = publicKey.split("\n").length;
      ELEM.privkey.value = privateKey;
      ELEM.privkey.rows = privateKey.split("\n").length;
    })
    .catch((e) => {
      ELEM.pubkey.value = `Error: ${e.message}`;
      ELEM.privkey.value = "";
    });
};

ELEM.username.addEventListener("input", update);
ELEM.email.addEventListener("input", update);
ELEM.password.addEventListener("input", update);

ELEM.privkey.addEventListener("click", focusSelectCopy);
ELEM.pubkey.addEventListener("click", focusSelectCopy);

update();
