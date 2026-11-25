import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const $ = (id) => document.getElementById(id);

let currentUser = null;
let memberData = null;


// Display member information
function displayMember(data, user) {
  const name = data.fullName || "JIBWIS Member";

  $("memberName").textContent = name;
  $("profileName").textContent = name;
  $("profileEmail").textContent = user.email || "—";

  $("memberAvatar").textContent = name.charAt(0).toUpperCase();

  $("memberId").textContent = data.idNumber || "Not assigned";
  $("memberDivision").textContent = data.division || "—";

  $("profilePhone").textContent = data.phone || "—";
  $("profileState").textContent = data.state || "—";
  $("profileLga").textContent = data.lga || "—";
  $("profileRank").textContent = data.rank || "Member";
  $("profileDetachment").textContent = data.detachment || "—";
  $("profileUnit").textContent = data.unit || "—";
}


// Check login and load profile
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("login.html");
    return;
  }

  currentUser = user;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      alert("Your member record could not be found. Please contact the administrator.");
      await signOut(auth);
      return;
    }

    memberData = userSnapshot.data();

    displayMember(memberData, user);

    // Show admin link only when a trusted custom claim exists.
    const tokenResult = await user.getIdTokenResult(true);
    const role = tokenResult.claims.role;

    if (role === "admin" || role === "superadmin") {
      $("adminNotice").classList.remove("hidden");
    }

  } catch (error) {
    console.error("Dashboard error:", error);
    alert("Unable to load your dashboard. Please check your connection and try again.");
  }

});


// Logout
$("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.replace("login.html");
  } catch (error) {
    alert("Unable to log out. Please try again.");
  }
});


// Open profile editor
$("editProfileBtn").addEventListener("click", () => {

  if (!memberData) return;

  $("editName").value = memberData.fullName || "";
  $("editPhone").value = memberData.phone || "";
  $("editEmail").value = currentUser.email || "";

  $("profileForm").classList.remove("hidden");
  $("profileForm").scrollIntoView({ behavior: "smooth" });

});


// Cancel profile editing
$("cancelEditBtn").addEventListener("click", () => {
  $("profileForm").classList.add("hidden");
  $("profileMessage").textContent = "";
});


// Save profile changes
$("profileForm").addEventListener("submit", async (event) => {

  event.preventDefault();

  if (!currentUser) return;

  const newName = $("editName").value.trim();
  const newPhone = $("editPhone").value.trim();

  if (!newName || !newPhone) {
    $("profileMessage").textContent = "Please complete all required fields.";
    return;
  }

  const message = $("profileMessage");
  message.textContent = "Saving changes...";

  try {

    const userRef = doc(db, "users", currentUser.uid);

    await updateDoc(userRef, {
      fullName: newName,
      phone: newPhone
    });

    memberData.fullName = newName;
    memberData.phone = newPhone;

    displayMember(memberData, currentUser);

    message.textContent = "Your profile has been updated successfully.";

  } catch (error) {

    console.error(error);

    message.textContent =
      "Update failed. Your account may not yet have permission to edit these details.";

  }

});
