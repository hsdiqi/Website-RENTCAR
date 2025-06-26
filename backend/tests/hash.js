const bcrypt = require("bcrypt");

(async () => {
  const plainPassword = "bee123";
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Hash:", hash);
})();
