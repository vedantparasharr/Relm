// ======================
// Load Environment Variables
// ======================
require("dotenv").config();

// ======================
// App Import
// ======================
const app = require("./app");

// ======================
// Server Configuration
// ======================
const PORT = process.env.PORT || 3000;

// ======================
// Start Server
// ======================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
