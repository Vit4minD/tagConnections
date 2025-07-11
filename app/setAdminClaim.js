const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Replace with the UID of the user you want to make admin
const uid = "aFPym4hxNCbCjjVl0LEmZq7O82l1";

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Custom claim 'admin: true' set for user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error setting custom claim:", error);
    process.exit(1);
  });
