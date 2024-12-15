const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

exports.sendMultiChannelNotification = functions.https.onCall(async (data, context) => {
  const { userId, jobId, type, channels } = data;

  // Get user and job details
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const jobDoc = await admin.firestore().collection('jobs').doc(jobId).get();

  const userData = userDoc.data();
  const jobName = jobDoc.data().name;

  const notifications = [];

  // Email Notification
  if (channels.email) {
    const emailNotification = sendEmail(userData.email, jobName);
    notifications.push(emailNotification);
  }

  // Push Notification
  if (channels.push && userData.pushToken) {
    const pushNotification = sendPush(userData.pushToken, jobName);
    notifications.push(pushNotification);
  }

  // Wait for all notifications to complete
  await Promise.all(notifications);

  return { success: true };
});

// Email sending function
async function sendEmail(email, jobName) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: functions.config().email.user,
      pass: functions.config().email.pass
    }
  });

  const mailOptions = {
    from: 'Preferred Staffing <noreply@preferredstaffing.com>',
    to: email,
    subject: 'New Job Assignment',
    html: `
      <h2>New Job Assignment</h2>
      <p>You have been assigned to: ${jobName}</p>
      <p>Please log in to your account to view the details.</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

// Push notification function
async function sendPush(token, jobName) {
  const message = {
    notification: {
      title: 'New Job Assignment',
      body: `You have been assigned to ${jobName}`
    },
    token: token
  };

  return admin.messaging().send(message);
}

// Track user verification status changes
exports.onUserVerificationStatusChange = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();

    // If phone verification status changed to true
    if (!previousData.phoneVerified && newData.phoneVerified) {
      // Notify admins about new verified user
      const adminsSnapshot = await admin.firestore()
        .collection('users')
        .where('role', '==', 'admin')
        .get();

      const notifications = adminsSnapshot.docs.map(async (adminDoc) => {
        const adminData = adminDoc.data();
        if (adminData.email) {
          await sendEmail(
            adminData.email,
            `New User Verified: ${newData.firstName} ${newData.lastName}`
          );
        }
      });

      await Promise.all(notifications);
    }
  });