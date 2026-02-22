const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-key.json"))
});

const db = admin.firestore();
module.exports = db;
