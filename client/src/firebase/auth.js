import { auth, db } from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// User roles
export const ROLES = {
  ADMIN: 'admin',
  FOREMAN: 'foreman',
  EMPLOYEE: 'employee'  // Default role
};

// Create new user (now with default role)
export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Set default role as employee
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: ROLES.EMPLOYEE,  // Default role
      createdAt: new Date().toISOString(),
      status: 'active'
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Admin function to update user role
export const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole
    });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Get user role
export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return ROLES.EMPLOYEE;  // Default if not set
  } catch (error) {
    throw error;
  }
};

// Sign in user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const signOutUser = () => {
  return signOut(auth);
}; 

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Resend verification email
export const resendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, updates, { merge: true });
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (user, newEmail, password) => {
  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await verifyBeforeUpdateEmail(user, newEmail);
    return true;
  } catch (error) {
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (user, currentPassword, newPassword) => {
  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return true;
  } catch (error) {
    throw error;
  }
};

// Initialize reCAPTCHA verifier
export const initializeRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',  // or 'invisible'
      callback: () => {
        // reCAPTCHA solved, you can now initiate phone verification
        console.log('reCAPTCHA solved');
      }
    });
  }
};

// Send phone verification code
export const sendPhoneVerification = async (phoneNumber) => {
  try {
    initializeRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return true;
  } catch (error) {
    console.error('Error sending code:', error);
    throw error;
  }
};

// Verify phone code
export const verifyPhoneCode = async (code) => {
  try {
    const result = await window.confirmationResult.confirm(code);
    // Update user profile with verified phone
    await updateDoc(doc(db, 'users', result.user.uid), {
      phoneVerified: true,
      status: 'active',
      phoneVerifiedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

// Create user with phone verification
export const createUserWithPhone = async (userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    const user = userCredential.user;
    
    // Store user data with phone verification status
    await setDoc(doc(db, 'users', user.uid), {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: ROLES.EMPLOYEE,
      createdAt: new Date().toISOString(),
      status: 'pending_phone_verification',
      phoneVerified: false
    });

    // Send verification SMS
    await sendPhoneVerification(userData.phone);

    return user;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch('/api/getUsers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await auth.currentUser.getIdToken()}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    throw error;
  }
};