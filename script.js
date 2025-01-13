// Initialize variables
const body = document.body;
const root = document.getElementById("root");
const selectShow = document.getElementById("showDropDown");
const selectEpisode = document.getElementById("dropDown");
const searchInput = document.getElementById("searchInput");
const episodeDisplayCounter = document.getElementById("episodesNumber");

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

      // Parse the JSON response
      return response.json();
    })
    .then((showsData) => {
      
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

  showLoading();
  return fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
  .then(response=>{
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      return response.json()
    
  }
)
    .then( episodesData=>{
      state.fetchedShows[showId] = episodesData;
      return episodesData
    }
  )
    
    
  
  .catch (error=>{
    showError(error);
    console.error("Failed to fetch episodes:", error);
    return [];
  }

)
}
// Helper function: Show loading message
function showLoading() {
  clear();
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading, please wait...";
  loadingMessage.id = "loadingMessage";
  root.appendChild(loadingMessage);
}

// Helper function: Show error message
function showError(error) {
  clear();
  const errorMessage = document.createElement("p");
  errorMessage.textContent = `Error: ${error.message}`;
  errorMessage.id = "errorMessage";
  root.appendChild(errorMessage);
}

// Helper function: Clear the DOM
function clear() {
  root.innerHTML = "";
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

// Render episodes
function renderEpisodes() {
  clear();
  const episodeCards = state.filteredFilms.map(createEpisodeCard);
  root.append(...episodeCards);

  // Update episode count
  episodeDisplayCounter.textContent = `Displaying ${state.filteredFilms.length} / ${state.allEpisodes.length}`;
}

// Populate shows dropdown
function populateShowsDropdown(shows) {
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selectShow.appendChild(option);
  });
}

// Populate episodes dropdown
function populateEpisodesDropdown(episodes) {
  selectEpisode.innerHTML = ""; // Clear previous options
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
  renderEpisodes();
});

// Event listener: Handle episode selection
selectEpisode.addEventListener("change", (event) => {
  const episodeId = event.target.value;

  if (!episodeId) return;

  state.filteredFilms = state.allEpisodes.filter((episode) => episode.id == episodeId);
  renderEpisodes();
});

// Event listener: Search input
searchInput.addEventListener("keyup", () => {
  state.searchTerm = searchInput.value.toLowerCase();

  state.filteredFilms = state.allEpisodes.filter((episode) =>
    episode.name.toLowerCase().includes(state.searchTerm) ||
    episode.summary?.toLowerCase().includes(state.searchTerm)
  );

  renderEpisodes();
});

// Initial setup
async function setup() {
  const shows = await fetchShows();
  state.allShows = shows;
  populateShowsDropdown(shows);
}

window.onload = setup;
