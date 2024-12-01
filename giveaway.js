import {
  getDocs,
  doc,
  addDoc,
  collection,
  getDoc,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./config.js";

const influencerId = localStorage.getItem("influencer_handle");
if (!influencerId) window.location.href = "login.html";

const form = document.querySelector(".jo-checkout-form");
const submitButton = form.querySelector("button[type='submit']");

const validateField = (field) => {
  const errorMessage = field.nextElementSibling;
  let isValid = true;

  if (field.validity.valueMissing) {
    errorMessage.textContent = `${
      field.placeholder || field.name
    } is required.`;
    field.classList.add("error");
    isValid = false;
  } else if (field.type === "number" && field.value < 0) {
    errorMessage.textContent = `Please enter a valid positive number.`;
    field.classList.add("error");
    isValid = false;
  } else {
    errorMessage.textContent = "";
    field.classList.remove("error");
  }

  return isValid;
};

const validateForm = () => {
  let isValid = true;
  const fields = form.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
};

// Validate field on blur and input
const fields = form.querySelectorAll("input, textarea");
fields.forEach((field) => {
  field.addEventListener("input", () => validateField(field));
  field.addEventListener("blur", () => validateField(field));
});

// Validate form on submit
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isFormValid = validateForm();
  if (isFormValid) {
    console.log("Form submitted successfully!");

    // Disable the submit button during submission
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    await addGiveawayAndUpdateInfluencer(formObject, influencerId);

    // Re-enable the submit button after submission
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  } else {
    console.log("Form contains errors. Please fix them before submitting.");
  }
});

const addGiveawayAndUpdateInfluencer = async (giveawayData, influencerId) => {
  try {
    // Add a new document to the "giveaways" collection
    const giveawayRef = await addDoc(collection(db, "giveaways"), giveawayData);
    console.log("Giveaway added with ID:", giveawayRef.id);

    // Fetch the existing influencer data
    const influencerRef = doc(db, "influencers", influencerId);
    const influencerSnapshot = await getDoc(influencerRef);

    let influencerData;
    if (influencerSnapshot.exists()) {
      influencerData = influencerSnapshot.data();
      console.log("Current Influencer Data:", influencerData);

      // Update the active_giveaways array with the new giveaway ID
      const updatedActiveGiveaways = Array.isArray(
        influencerData.active_giveaways
      )
        ? [...influencerData.active_giveaways, giveawayRef.id]
        : [giveawayRef.id];

      // Update given_away_total_dollar_value
      const updatedDollarValue =
        (parseInt(influencerData.given_away_total_dollar_value) || 0) +
        parseInt(giveawayData.dollar_value || "0");

      // Update the influencer document
      await updateDoc(influencerRef, {
        active_giveaways: updatedActiveGiveaways,
        given_away_total_dollar_value: updatedDollarValue.toString(),
      });
    } else {
      // If influencer doesn't exist, create a new influencer document
      const newInfluencerData = {
        influencer_name: giveawayData.influencer_handle || influencerId,
        influencer_instagram_handle: influencerId,
        active_giveaways: [giveawayRef.id],
        past_giveaways: [],
        given_away_total_dollar_value: giveawayData.dollar_value || "0",
      };

      await setDoc(influencerRef, newInfluencerData);
      console.log("New influencer added:", newInfluencerData);
    }

    // Reset the form after successful submission
    form.reset();
    console.log("Form reset successfully.");
  } catch (error) {
    console.error("Error adding/updating document:", error);
  }
};
