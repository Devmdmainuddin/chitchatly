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
  sendEmailVerification,
   reauthenticateWithCredential
} from 'firebase/auth'
import { getDatabase, ref, set,onValue, push, } from "firebase/database";

import { app } from '../firebase/firebase.config'
import useAxiosCommon from '../hooks/useAxiosCommon';
import Swal from 'sweetalert2';


export const AuthContext = createContext(null)
const auth = getAuth(app)
const db = getDatabase();
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const axiosCommon = useAxiosCommon()

  
// ............

// const starCountRef = ref(db, 'posts/' + postId + '/starCount');
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   updateStarCount(postElement, data);
// });





const createUser = async (name,email, password) => {
    setLoading(true);
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      updateProfile(user,{
        displayName: name,
        timestamp: Date.now()
      })
      .then(() => {
        console.log(user);
        sendEmailVerification(auth.currentUser,{
          url: 'http://localhost:5173/login',
          handleCodeInApp: true,
        })
          .then(() => {
            console.log(user);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Verification Code Send Succesfully",
              showConfirmButton: false,
              timer: 1500,
            });
            setLoading(false);
          })
          .then(() => {
            console.log(user);
            set(ref(db, 'users/' + user.uid), {
              username: name,
              email: email,
              userId:user.uid,
              password:password,
              timestamp: Date.now()
            });
          })
          .catch(() => {
           
          });
      });
      // setUser(user);
    } catch (error) {
      const errorCode = error.code;
      if (errorCode.includes('auth/email-already-in-use')) {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Email is already in use.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (errorCode.includes('auth/invalid-email')) {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Invalid email.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (errorCode.includes('auth/weak-password')) {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Weak password.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error creating user !",
          showConfirmButton: false,
          timer: 1500
        });
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
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Incorrect password. Please try again.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (errorCode.includes('auth/user-not-found')) {
        
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "No user found with this email.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
      
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error during sign in",
          showConfirmButton: false,
          timer: 1500
        });
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
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Google sign-in popup closed by user. Please try again.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (errorCode.includes('auth/cancelled-popup-request')) {
        
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Popup was closed due to a new request. Please try again.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (errorCode.includes('auth/network-request-failed')) {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Network error. Please check your internet connection and try again.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Google sign-in failed !",
          showConfirmButton: false,
          timer: 1500
        });
      }
  
      throw error; 
    } finally {
      setLoading(false); 
    }
  }
  const handleUpdatePassword = async (password, currentPassword) => {
    const currentUser = auth.currentUser; // Get the current user
  
    if (!currentUser) {
      
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "No user is currently signed in.",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  
    try {
      // Reauthenticate the user with their current password
      await reauthenticateWithCredential(currentUser, credential);
  
      // If reauthentication is successful, update the password
      await updatePassword(currentUser, password);
  
      // Show success message with SweetAlert
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your password has been updated",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      // Handle errors and display appropriate error messages
      if (error.code === 'auth/wrong-password') {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "The current password is incorrect. Please try again.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (error.code === 'auth/weak-password') {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "The new password is too weak. Please choose a stronger one.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "An error occurred while updating the password.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  };
  const resetPassword = async (email) => {
    setLoading(true); // Start loading
    try {
      // Send the password reset email
      await sendPasswordResetEmail(auth, email);
      
      // Display success message
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Password reset email sent to ${email}. Please check your inbox.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      // Handle errors
      if (error.code === 'auth/user-not-found') {
        
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "No user found with this email. Please check the email address.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (error.code === 'auth/invalid-email') {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Invalid email format. Please provide a valid email address.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
       
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "An error occurred while sending the password reset email.",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };
  const logOut = async () => {
    setLoading(true); 
  
    try {
      await signOut(auth); 
      setUser(null); 
      console.log('User successfully logged out.');
    } catch (error) {
      
      Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Failed to log out. Please try again.",
				showConfirmButton: false,
				timer: 1500
			});
    } finally {
      setLoading(false); // Stop loading, whether success or failure
    }
  };
  const updateUserProfile = async (name, photo) => {
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      // toast.error('No user is currently signed in.');
      Swal.fire({
				position: "top-end",
				icon: "error",
				title: "No user is currently signed in.",
				showConfirmButton: false,
				timer: 1500
			});
      return;
    }
  
    try {
      // Update the user's display name and photo URL
      await updateProfile(currentUser, {
        displayName: name,
        // photoURL: photo,
      });
  
      // Optionally, update the user state if needed
      setUser({
        ...currentUser, // Retain other properties
        displayName: name,
        // photoURL: photo,
      });
  
      // Provide feedback to the user
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Profile updated successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
  
      Swal.fire({
				position: "top-end",
				icon: "error",
				title: "Failed to update profile. Please try again.",
				showConfirmButton: false,
				timer: 1500
			});
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      // const userEmail = currentUser?.email || user?.email;
      // const loggedUser = { email: userEmail }
      setUser(currentUser)
      setLoading(false); 
      // if(currentUser.emailVerified){
      //   setVerify(true);
      // dispatch(userLoginInfo(user));
      // localStorage.setItem("userInfo", JSON.stringify(user));
      // }
      // if (currentUser) {
        
      //   axiosCommon.post(`/jwt`, loggedUser)
      //     .then(res => {
      //       if (res.data.token) {
      //         localStorage.setItem('access-token', res.data.token)
      //         setLoading(false)
      //       }
      //     })
      // } else {
      //   localStorage.removeItem('access-token')
      //   setLoading(false)
      // }

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