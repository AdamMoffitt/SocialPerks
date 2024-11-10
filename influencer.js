import {
  getDocs,
  collection,
  query,
  where,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./config.js";
const influencerName = document.querySelector(".influencer-name");
const influencerDetails = document.querySelector(".influencer-details");
const activeGiveaways = document.querySelector(".active-giveaways");
const pastGiveaways = document.querySelector(".past-giveaways");
const URLparams = new URLSearchParams(window.location.search);

const fetchGiveaways = async (giveawayIds) => {
  try {
    // Fetch all giveaways in parallel
    const giveawayPromises = giveawayIds.map((giveawayId) =>
      getDoc(doc(db, "giveaways", giveawayId))
    );
    const giveawaySnapshots = await Promise.all(giveawayPromises);

    // Map the results to an array of giveaway data
    const giveaways = giveawaySnapshots
      .filter((snapshot) => snapshot.exists()) // Filter out non-existing documents
      .map((snapshot) => ({
        id: snapshot.id,
        ...snapshot.data(),
      }));

    return giveaways;
  } catch (error) {
    console.error("Error fetching giveaways:", error);
    return [];
  }
};

const renderActiveGiveaways = (giveawayIds) => {
  fetchGiveaways(giveawayIds).then((giveaways) => {
    giveaways.forEach((giveaway) => {
      console.log(activeGiveaways);
      activeGiveaways.innerHTML += `
      <div class="col-md-4">
        <div class="giveaway-card border border-1 rounded p-3">
          <img
            src="https://placeholder.co/600x400?text=Post+Image"
            class="w-100 rounded rounded-1"
            alt="Post Image"
          />
          <p class="mt-1 mb-0 fs-3 fw-bold">$${giveaway.dollar_value}</p>
          <p class="m-0">${giveaway.num_winners} Winners</p>
          <p class="mb-2">${giveaway.num_entered} Entered</p>
          <button class="jo-btn w-100">Enter</button>
        </div>
      </div>
     `;
    });
  });
};

const renderPastGiveawaways = (giveawayIds) => {
  fetchGiveaways(giveawayIds).then((giveaways) => {
    giveaways.forEach((giveaway) => {
      console.log(activeGiveaways);
      pastGiveaways.innerHTML += `
      <div class="col-md-4">
        <div class="giveaway-card border border-1 rounded p-3">
          <img
            src="https://placeholder.co/600x400?text=Post+Image"
            class="w-100 rounded rounded-1"
            alt="Post Image"
          />
          <p class="mt-1 mb-0 fs-3 fw-bold">$${giveaway.dollar_value}</p>
          <p class="m-0">${giveaway.num_winners} Winners</p>
          <p class="mb-2">${giveaway.num_entered} Entered</p>
          <button class="jo-btn w-100">Enter</button>
        </div>
      </div>
     `;
    });
  });
};

const initialFetch = async () => {
  try {
    const q = query(
      collection(db, "influencers"),
      where("influencer_instagram_handle", "==", URLparams.get("influencer_id"))
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const data = doc.data();

      window.document.title = "SocialPerks | " + data.influencer_name;
      influencerName.innerHTML = data.influencer_name;
      influencerDetails.innerHTML = `
      <div class="d-flex gap-3 align-items-center">
        <div
          style="width: 80px; height: 80px"
          class="rounded rounded-circle border border-2 border-dark d-flex align-items-center justify-content-center"
        >
          <i class="flaticon-avatar fs-1"></i>
        </div>
        <div class="d-flex flex-column gap-0">
          <h2 class="fw-bold influencer-name m-0">${data.influencer_name}</h2>
          <p class="m-0">Given away: <strong>${data.given_away_total_dollar_value}</strong></p>
        </div>
        <a class="jo-btn" style="cursor: pointer">Follow</a>
      </div>  
      `;

      renderActiveGiveaways(data.active_giveaways);
      renderPastGiveawaways(data.past_giveaways);
    });
  } catch (error) {
    console.log(error);
  }
};

initialFetch();
