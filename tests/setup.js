const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(process.cwd(), ".env.test"),
  override: true,
});

if (process.env.NODE_ENV !== "test") {
  throw new Error(
    "Las pruebas funcionales deben ejecutarse con NODE_ENV=test."
  );
}
