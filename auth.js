import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

const resetForm = document.getElementById("resetForm");

const loginSection = document.getElementById("loginSection");

const forgotSection = document.getElementById("forgotSection");


function showStatus(id, message, type = "") {

  const element = document.getElementById(id);

  element.textContent = message;

  element.className = "status " + type;

}


function friendlyError(error) {

  const messages = {

    "auth/invalid-credential":
      "Incorrect email or password.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/user-not-found":
      "No account was found with this email.",

    "auth/wrong-password":
      "Incorrect email or password.",

    "auth/too-many-requests":
      "Too many attempts. Please wait and try again.",

    "auth/network-request-failed":
      "Network error. Check your internet connection.",

    "auth/user-disabled":
      "This account has been disabled. Contact an administrator."

  };

  return messages[error.code] || "Something went wrong. Please try again.";

}


// CHECK AUTHENTICATION

onAuthStateChanged(auth, user => {

  if (user) {

    window.location.replace("dashboard.html");

  }

});


// LOGIN

loginForm.addEventListener("submit", async event => {

  event.preventDefault();

  const button = document.getElementById("loginButton");

  const email = document.getElementById("loginEmail").value.trim();

  const password = document.getElementById("loginPassword").value;

  button.disabled = true;

  button.textContent = "Signing In...";

  showStatus("loginStatus", "Please wait...");

  try {

    await signInWithEmailAndPassword(auth, email, password);

    showStatus("loginStatus", "Login successful.", "success");

    window.location.replace("dashboard.html");

  } catch(error) {

    showStatus(
      "loginStatus",
      friendlyError(error),
      "error"
    );

    button.disabled = false;

    button.textContent = "Sign In";

  }

});


// OPEN FORGOT PASSWORD

document.getElementById("forgotLink").addEventListener("click", event => {

  event.preventDefault();

  loginSection.classList.add("hidden");

  forgotSection.classList.remove("hidden");

});


// BACK TO LOGIN

document.getElementById("backToLogin").addEventListener("click", event => {

  event.preventDefault();

  forgotSection.classList.add("hidden");

  loginSection.classList.remove("hidden");

});


// PASSWORD RESET

resetForm.addEventListener("submit", async event => {

  event.preventDefault();

  const button = document.getElementById("resetButton");

  const email = document.getElementById("resetEmail").value.trim();

  button.disabled = true;

  button.textContent = "Sending...";

  showStatus("resetStatus", "Sending reset link...");

  try {

    await sendPasswordResetEmail(auth, email);

    showStatus(
      "resetStatus",
      "Reset link sent. Check your email inbox and spam folder.",
      "success"
    );

  } catch(error) {

    showStatus(
      "resetStatus",
      friendlyError(error),
      "error"
    );

  }

  button.disabled = false;

  button.textContent = "Send Reset Link";

});