const bcrypt = require("bcrypt");

(async () => {
  const plainPassword = "admin123";
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log("Hash:", hash);
})();
