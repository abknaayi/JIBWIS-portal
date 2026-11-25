import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const form = document.getElementById("registerForm");

const stateSelect = document.getElementById("state");

const lgaSelect = document.getElementById("lga");

const divisionSelect = document.getElementById("division");

const detachmentSelect = document.getElementById("detachment");

const unitSelect = document.getElementById("unit");


function status(message, type = "") {

  const element = document.getElementById("registerStatus");

  element.textContent = message;

  element.className = "status " + type;

}


function resetSelect(select, label) {

  select.innerHTML = "";

  select.add(new Option(label, ""));

}


function escapeError(error) {

  const messages = {

    "auth/email-already-in-use":
      "This email already has an account. Please sign in.",

    "auth/invalid-email":
      "Please enter a valid email address.",

    "auth/weak-password":
      "Your password is too weak.",

    "auth/network-request-failed":
      "Network error. Check your internet connection."

  };

  return messages[error.code] || "Registration failed. Please try again.";

}


// LOAD NIGERIA DATA

let nigeriaData = {};

async function loadNigeriaData() {

  try {

    const response = await fetch("./nigeriaData.json");

    if (!response.ok) {
      throw new Error("Nigeria data file not found.");
    }

    nigeriaData = await response.json();

    resetSelect(stateSelect, "Select State");

    Object.keys(nigeriaData)
      .sort()
      .forEach(state => {

        stateSelect.add(new Option(state, state));

      });

  } catch(error) {

    status(
      "Could not load Nigeria location data. Check nigeriaData.json.",
      "error"
    );

    console.error(error);

  }

}

loadNigeriaData();


// STATE SELECTION

stateSelect.addEventListener("change", () => {

  resetSelect(lgaSelect, "Select LGA");

  resetSelect(divisionSelect, "Select Division");

  resetSelect(detachmentSelect, "Select Detachment");

  resetSelect(unitSelect, "Select Unit");

  const lgas = nigeriaData[stateSelect.value] || [];

  lgas.forEach(lga => {

    lgaSelect.add(new Option(lga, lga));

  });

});


// LGA SELECTION

lgaSelect.addEventListener("change", () => {

  resetSelect(divisionSelect, "Select Division");

  resetSelect(detachmentSelect, "Select Detachment");

  resetSelect(unitSelect, "Select Unit");

  if (!lgaSelect.value) return;

  ["A", "B", "C"].forEach(value => {

    divisionSelect.add(
      new Option("Division " + value, value)
    );

  });

});


// DIVISION SELECTION

divisionSelect.addEventListener("change", () => {

  resetSelect(detachmentSelect, "Select Detachment");

  resetSelect(unitSelect, "Select Unit");

  if (!divisionSelect.value) return;

  ["A", "B", "C"].forEach(value => {

    detachmentSelect.add(
      new Option("Detachment " + value, value)
    );

  });

});


// DETACHMENT SELECTION

detachmentSelect.addEventListener("change", () => {

  resetSelect(unitSelect, "Select Unit");

  if (!detachmentSelect.value) return;

  ["A", "B"].forEach(value => {

    unitSelect.add(
      new Option("Unit " + value, value)
    );

  });

});


// CREATE ACCOUNT

form.addEventListener("submit", async event => {

  event.preventDefault();

  const button = document.getElementById("registerButton");

  const email = document.getElementById("email").value.trim();

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;


  if (password !== confirmPassword) {

    status("Passwords do not match.", "error");

    return;

  }


  if (
    !stateSelect.value ||
    !lgaSelect.value ||
    !divisionSelect.value ||
    !detachmentSelect.value ||
    !unitSelect.value
  ) {

    status("Please complete all membership location fields.", "error");

    return;

  }


  button.disabled = true;

  button.textContent = "Creating Account...";

  status("Please wait while your account is being created...");


  try {

    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = credential.user;


    await setDoc(doc(db, "users", user.uid), {

      fullName: document.getElementById("fullName").value.trim(),

      email: email,

      phone: document.getElementById("phone").value.trim(),

      country: "Nigeria",

      state: stateSelect.value,

      lga: lgaSelect.value,

      division: divisionSelect.value,

      detachment: detachmentSelect.value,

      unit: unitSelect.value,

      idNumber: document.getElementById("idNumber").value.trim(),

      rank: document.getElementById("rank").value.trim(),

      profileImage: "",

      createdAt: serverTimestamp()

      // Role is intentionally NOT supplied by the browser.

    });


    status(
      "Registration successful! Opening your dashboard...",
      "success"
    );

    window.location.replace("dashboard.html");


  } catch(error) {

    status(escapeError(error), "error");

    button.disabled = false;

    button.textContent = "Create Account";

    console.error(error);

  }

});