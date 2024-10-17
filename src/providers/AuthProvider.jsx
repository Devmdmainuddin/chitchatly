import PropTypes from 'prop-types'
import { createContext,  useEffect,  useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
   reauthenticateWithCredential
} from 'firebase/auth'
import { app } from '../firebase/firebase.config'
import useAxiosCommon from '../hooks/useAxiosCommon';


export const AuthContext = createContext(null)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const axiosCommon = useAxiosCommon()

const createUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      const errorCode = error.code;
      if (errorCode.includes('auth/email-already-in-use')) {
        console.error('Email is already in use.');
      } else if (errorCode.includes('auth/invalid-email')) {
        console.error('Invalid email.');
      } else if (errorCode.includes('auth/weak-password')) {
        console.error('Weak password.');
      } else {
        console.error('Error creating user:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); 
      return userCredential.user; 
    } catch (error) {
      const errorCode = error.code;
      if (errorCode.includes('auth/wrong-password')) {
        console.error('Incorrect password. Please try again.');
      } else if (errorCode.includes('auth/user-not-found')) {
        console.error('No user found with this email.');
      } else {
        console.error('Error during sign in:', error.message);
      }
      throw error; 
    } finally {
      setLoading(false); 
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setUser(userCredential.user); // Set the authenticated user
      console.log('Google Sign-in successful!');
      return userCredential.user; // Optionally return user data if needed
    } catch (error) {
      const errorCode = error.code;
  
      // Handle specific Google sign-in errors
      if (errorCode.includes('auth/popup-closed-by-user')) {
        console.error('Google sign-in popup closed by user. Please try again.');
      } else if (errorCode.includes('auth/cancelled-popup-request')) {
        console.error('Popup was closed due to a new request. Please try again.');
      } else if (errorCode.includes('auth/network-request-failed')) {
        console.error('Network error. Please check your internet connection and try again.');
      } else {
        console.error('Google sign-in failed:', error.message);
      }
  
      throw error; 
    } finally {
      setLoading(false); 
    }
  }
  const handleUpdatePassword = async (password, currentPassword) => {
    const currentUser = auth.currentUser; // Get the current user
  
    if (!currentUser) {
      // toast.error('No user is currently signed in.');
      return;
    }
  
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  
    try {
      // Reauthenticate the user with their current password
      await reauthenticateWithCredential(currentUser, credential);
  
      // If reauthentication is successful, update the password
      await updatePassword(currentUser, password);
  
      // Show success message with SweetAlert
      // Swal.fire({
      //   position: "top-end",
      //   icon: "success",
      //   title: "Your password has been updated",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
    } catch (error) {
      // Handle errors and display appropriate error messages
      if (error.code === 'auth/wrong-password') {
        // toast.error('The current password is incorrect. Please try again.');
      } else if (error.code === 'auth/weak-password') {
        // toast.error('The new password is too weak. Please choose a stronger one.');
      } else {
        // toast.error(error.message || 'An error occurred while updating the password.');
      }
    }
  };
  const resetPassword = async (email) => {
    setLoading(true); // Start loading
    try {
      // Send the password reset email
      await sendPasswordResetEmail(auth, email);
      
      // Display success message
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: `Password reset email sent to ${email}. Please check your inbox.`,
      //   showConfirmButton: false,
      //   timer: 2000,
      // });
    } catch (error) {
      // Handle errors
      if (error.code === 'auth/user-not-found') {
        // toast.error('No user found with this email. Please check the email address.');
      } else if (error.code === 'auth/invalid-email') {
        // toast.error('Invalid email format. Please provide a valid email address.');
      } else {
        // toast.error(error.message || 'An error occurred while sending the password reset email.');
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };
  const logOut = async () => {
    setLoading(true); // Start loading
  
    try {
      await signOut(auth); // Sign out the user from Firebase
      setUser(null); // Reset user state upon successful sign-out
      console.log('User successfully logged out.');
    } catch (error) {
      console.error('Error logging out:', error.message);
      // Optionally, you can show a toast or alert to the user
      // toast.error('Failed to log out. Please try again.');
    } finally {
      setLoading(false); // Stop loading, whether success or failure
    }
  };
  const updateUserProfile = async (name, photo) => {
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      // toast.error('No user is currently signed in.');
      return;
    }
  
    try {
      // Update the user's display name and photo URL
      await updateProfile(currentUser, {
        displayName: name,
        photoURL: photo,
      });
  
      // Optionally, update the user state if needed
      setUser({
        ...currentUser, // Retain other properties
        displayName: name,
        photoURL: photo,
      });
  
      // Provide feedback to the user
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'Profile updated successfully',
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
    } catch (error) {
      // Handle any errors that occur during profile update
      console.error('Error updating profile:', error.message);
      // toast.error('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      const userEmail = currentUser?.email || user?.email;
      const loggedUser = { email: userEmail }
      setUser(currentUser)

      if (currentUser) {
        // saveUser(currentUser)
        axiosCommon.post(`/jwt`, loggedUser)
          .then(res => {
            if (res.data.token) {
              localStorage.setItem('access-token', res.data.token)
              setLoading(false)
            }
          })
      } else {
        localStorage.removeItem('access-token')
        setLoading(false)
      }

  })
    return () => {
      unSubscribe();
    }
  }, [axiosCommon,user])

  const authinfo = {
    createUser,
    signIn,
    user,
    loading,
    signInWithGoogle,
    handleUpdatePassword,
    resetPassword,
    updateUserProfile,
    logOut
  }
  return (

    <AuthContext.Provider value={authinfo}> {children}</AuthContext.Provider>

  );
};

AuthProvider.propTypes = {
  children: PropTypes.object,
}

export default AuthProvider;