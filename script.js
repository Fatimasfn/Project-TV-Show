// Initialize variables
const body = document.body;
const root = document.getElementById("root");
const selectShow = document.getElementById("showDropDown");
const selectEpisode = document.getElementById("dropDown");
const searchInput = document.getElementById("searchInput");
const episodeDisplayCounter = document.getElementById("episodesNumber");
const showsContainer = document.createElement("div"); // Container for show cards
showsContainer.id = "shows-container";
root.appendChild(showsContainer);



// Initial setup
async function setup() {
  const shows = await fetchShows();
  state.allShows = shows;
  populateShowsDropdown(shows);
  renderShows(shows);
}

let state = {
  searchTerm: "",
  filteredFilms: [],
  allEpisodes: [],
  allShows: [],
  fetchedShows: {}, // Cache for fetched episodes
};

// Function: Fetch all shows
function fetchShows() {
  showLoading(); // Show loading indicator

  return fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((showsData) => {
      const loadingMessage = document.getElementById("loadingMessage");
      if (loadingMessage) {
        loadingMessage.remove();
      }

      return showsData.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
     
    })
    .catch((error) => {
      // Handle errors
      showError(error);
      console.error("Failed to fetch shows:", error);

      // Return an empty array in case of an error
      return [];
    });
}

// Function: Fetch episodes for a selected show
function fetchEpisodes(showId) {
  // Check if episodes for this show are already fetched
  if (state.fetchedShows[showId]) {
    return state.fetchedShows[showId];
  }
  //showLoading();
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
  .then(response=>{
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      return response.json()
  })
    .then( episodesData=>{
      state.fetchedShows[showId] = episodesData;
      return episodesData
    })  
  .catch (error=>{
    showError(error);
    console.error("Failed to fetch episodes:", error);
    return [];
  }
)}


// Helper function: Show loading message
function showLoading() {
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading, please wait...";
  loadingMessage.id = "loadingMessage";
  root.appendChild(loadingMessage);
}

// Helper function: Show error message
function showError(error) {
  //clear();
  const errorMessage = document.createElement("p");
  errorMessage.textContent = `Error: ${error.message}`;
  errorMessage.id = "errorMessage";
  root.appendChild(errorMessage);
}

// Helper function: Clear the DOM
function clear() {
  showsContainer.innerHTML = ""; // Clear shows
    // Clear episodes (but keep the showsContainer)
    const episodes = document.querySelectorAll("#root > :not(#shows-container)");
    episodes.forEach(episode => episode.remove());
}

// Helper function: Create an episode card
function createEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  episodeCard.className = "episode-card";

  const title = document.createElement("h3");
  title.textContent = episode.name;

  const code = document.createElement("p");
  code.textContent = episodeCode(episode);

  const image = document.createElement("img");
  image.src = episode.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";

  const summary = document.createElement("p");
  summary.innerHTML = truncateSummary(episode.summary || "No summary available.");

  episodeCard.append(title, code, image, summary);
  return episodeCard;
}

function createShowCard(show) {
  const template = document.getElementById("shows-card");
  if (!template) {
    console.error("Template with ID 'shows-card' not found.");
    const fallback = document.createElement("div");
          fallback.textContent = `Could not load show: ${show.name}`;
          return fallback;
  }
  
  const showCard = document.importNode(template.content, true);

  const cardContainer = showCard.querySelector("#shows-section");
  cardContainer.dataset.showId = show.id;
  
  const showName = showCard.querySelector("h3");
  showName.textContent = show.name;

  const genre = showCard.querySelector("#show-genre");
  genre.textContent = show.genres.join(", "); 

  const showStatus = showCard.querySelector("#show-status");
  showStatus.textContent = `Status: ${show.status}`;

  const showRating = showCard.querySelector("#show-rating");
  showRating.textContent = `Rating: ${show.rating.average || "N/A"}`;

  const showRuntime = showCard.querySelector("#show-runtime");
  showRuntime.textContent = `Runtime: ${show.runtime} mins`;

  const showImage = showCard.querySelector("#showImg");
  showImage.src = show.image?.medium || "https://via.placeholder.com/210x295?text=No+Image";
  showImage.alt = `${show.name} image`;

  const showSummary = showCard.querySelector("#show-summary");
  showSummary.innerHTML = truncateSummary(show.summary || "No summary available.");
  
  return showCard;
}


// Helper function: Truncate summary
function truncateSummary(summary, maxLength = 150) {
  return summary.length > maxLength ? summary.substring(0, maxLength) + "..." : summary;
}

// Helper function: Generate episode code
function episodeCode(episode) {
  const episodeSeason = episode.season.toString().padStart(2, "0");
  const episodeNumber = episode.number.toString().padStart(2, "0");
  return `S${episodeSeason}E${episodeNumber}`;
}

function addGoBackToAllShowsButton() {
 const header = document.querySelector('header');
    let button = document.querySelector('#backToShowsButton'); // Check for existing button

    if (!button) {
        button = document.createElement('button');
        button.id = 'backToShowsButton';
        button.textContent = 'Back to Shows';

        button.addEventListener('click', () => {
            renderShows(state.allShows);
            button.remove(); 
            state.searchTerm = "";
            selectShow.value = "";
            searchInput.value="";
            selectShow.style.display = "inline-block"; // Show the Show dropdown again
            searchInput.placeholder = "Enter your search here ...";
            
        });

        header.appendChild(button);
    }
}

function clearEpisodes() {
  const episodeCards = document.querySelectorAll(".episode-card");
  episodeCards.forEach((card) => card.remove());
}


// Render episodes
function renderEpisodes() {
  clearEpisodes();

 const showSections = document.querySelectorAll("#shows-container section");
 showSections.forEach((section) => section.remove());

  const episodeCards = state.filteredFilms.map(createEpisodeCard);
  root.append(...episodeCards);

  // Update episode count
  episodeDisplayCounter.textContent = `Displaying ${state.filteredFilms.length} / ${state.allEpisodes.length}`;
  // navigation link to enable the user to return to the "shows listing"
  addGoBackToAllShowsButton();

}

function renderShows(shows) {
  //clearEpisodes()

  const episodeCards = document.querySelectorAll(".episode-card");
  episodeCards.forEach((card) => card.remove());

  shows.forEach((show) => {
    const showCard = createShowCard(show);
     showsContainer.appendChild(showCard);
  });

  episodeDisplayCounter.innerHTML = "";
  selectEpisode.style.display = "none";
  
}

// Populate shows dropdown
function populateShowsDropdown(shows) {
   selectShow.innerHTML = '<option value="" disabled selected>Select a show</option>';
        shows.forEach((show) => {
          const option = document.createElement("option");
          option.value = show.id;
          option.textContent = show.name;
          selectShow.appendChild(option);
        });
}

// Populate episodes dropdown
function populateEpisodesDropdown(episodes) {
  selectEpisode.innerHTML =
          '<option value="" disabled selected>Select an episode</option>';
       episodes.forEach((episode) => {
          const option = document.createElement("option");
          option.value = episode.id;
          option.textContent = `${episodeCode(episode)} - ${episode.name}`;
          selectEpisode.appendChild(option);
        });
}

// Event listener: Handle show selection
selectShow.addEventListener("change", async (event) => {
  const showId = event.target.value;

  if (!showId) return;

  const episodes = await fetchEpisodes(showId);
  state.allEpisodes = episodes;
  state.filteredFilms = episodes;

  populateEpisodesDropdown(episodes);

  const showCards = document.querySelectorAll(".show-card");
  showCards.forEach((card) => card.remove());

  renderEpisodes();

   selectShow.style.display = "none";
    searchInput.placeholder = "Search episodes...";
});


// Event listener: Handle episode selection
selectEpisode.addEventListener("change", (event) => {
  const episodeId = event.target.value;

  if (!episodeId) return;

  state.filteredFilms = state.allEpisodes.filter((episode) => episode.id == episodeId);
  const episodeCards = document.querySelectorAll(".episode-card");
  episodeCards.forEach((card) => card.remove());
  renderEpisodes();

  let returnButton = document.querySelector("#returnButton");
      if (!returnButton) {
    returnButton = document.createElement("button");
    returnButton.id = "returnButton";
    returnButton.textContent = "Return to all episodes";
    root.append(returnButton);

    returnButton.addEventListener("click", () => {
      // Reset to show all episodes
      state.filteredFilms = state.allEpisodes;
      renderEpisodes();
      returnButton.remove();
    });
  }
});

// Event listener: Search input
searchInput.addEventListener("keyup", () => {
    state.searchTerm = searchInput.value.toLowerCase();

    if (state.allEpisodes.length > 0) {
        // If episodes are loaded
        state.filteredFilms = state.allEpisodes.filter((episode) =>
            episode.name.toLowerCase().includes(state.searchTerm) ||
            episode.summary?.toLowerCase().includes(state.searchTerm)
        );
        //console.log(state.filteredFilms)
        //clearEpisodes()
        const episodeCards = document.querySelectorAll(".episode-card");
        episodeCards.forEach((card) => card.remove());
        renderEpisodes();
    } else {
        // If no episodes are loaded, filter shows
        const filteredShows = state.allShows.filter(show =>
            show.name.toLowerCase().includes(state.searchTerm) ||
            show.summary.toLowerCase().includes(state.searchTerm)
        );
        console.log(filteredShows)
        const showCards = document.querySelectorAll(".show-card");
        showCards.forEach((card) => card.remove());
        renderShows(filteredShows);
    }
});

root.addEventListener("click", (event) => {
    const showCard = event.target.closest("#shows-section");
    if (showCard) {
        const showId = showCard.dataset.showId;
        fetchEpisodes(showId).then((episodesData) => {
            state.filteredFilms = episodesData;
            state.allEpisodes = episodesData;
            renderEpisodes();
            populateEpisodesDropdown(state.filteredFilms);
            selectShow.style.display = "none"; // Hide show dropdown
            searchInput.placeholder = "Search episodes..."; // Update search placeholder
        });
    }
});



window.onload = setup;
