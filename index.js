import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./config.js";
const influencersContainer = document.querySelector(".influencers");

const formatCurrency = (value) => {
  if (value >= 1e6) {
    // 1 million or more
    return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (value >= 1e3) {
    // 1 thousand or more
    return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    // Less than 1 thousand
    return value.toString();
  }
};

const getInfluencers = async () => {
  await getDocs(collection(db, "influencers")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // console.log(":: data", data);
      influencersContainer.innerHTML += `
      <a style="text-decoration: none" class="col-md-6 col-xxs-12 col-12 p-2 text-dark influencer-card" style="height: 100px" href="influencer.html?influencer_id=${
        data.influencer_instagram_handle
      }">
        <div
          class="d-flex align-items-center gap-3 bg-light rounded rounded-4 p-3"
        >
          <i class="flaticon-avatar fs-4"></i>
          <div class="d-flex flex-column">
            <h5 class="m-0 influencer-card-title">${data.influencer_name}</h5>
            <p class="m-0">Giveaway : <strong>$${formatCurrency(
              data.given_away_total_dollar_value
            )}</strong></p>
          </div>
        </div>
      </a>
      `;
    });
  });
};

getInfluencers();
