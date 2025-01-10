//You can edit ALL of the code here

function setup() {
  const allEpisodes = getAllEpisodes();
 // return makePageForEpisodes(state.filteredFilms);
}
//sets text to the root element in the html
/*function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${state.filteredFilms.length} episode(s)`;
  return rootElem;
}*/


//Refactored version
// Helper function: Generates an episode code in the format SxxExx
function episodeCode(episode) {
  const episodeSeason = episode.season.toString().padStart(2, '0');
  const episodeNumber = episode.number.toString().padStart(2, '0');
  return `S${episodeSeason}E${episodeNumber}`;
}
// Helper function: Clears all episode cards from the DOM
function clear() {
  const sections = document.getElementsByTagName("section");
  const elements = Array.from(sections);
  elements.forEach(element => element.remove());
}
//helper function: truncate summary
function truncateSummary(summary, maxLength = 150) {
  if (summary.length > maxLength) {
    return summary.substring(0, maxLength) + '...';
  }
  return summary;
}

// Helper function: Creates an episode card with episode details
function createEpisodeCard(oneEpisode) {
  const episodeCard = document.getElementById("episode-card").content.cloneNode(true);
  episodeCard.querySelector("h3").textContent = oneEpisode.name;
  episodeCard.querySelector("#episode-code").textContent = `${episodeCode(oneEpisode)}`;
  episodeCard.querySelector("img").src = oneEpisode.image.medium;
  episodeCard.querySelector("#summary").innerHTML = truncateSummary(oneEpisode.summary);
   
  return episodeCard;
}

// Helper function: Generates episode cards and appends them to the DOM
function renderEpisodeCards() {
  const episodeCards = state.filteredFilms.map(createEpisodeCard);
   root.append(...episodeCards); 
}

//Helper function deconstruct
function deconstructCode(selectedText){
  //returns substring of episode code 
  const separatorIndex = selectedText.indexOf(" -");
   return selectedText.substring(0, separatorIndex);
}

// Render function: Clears previous content and renders filtered episodes
function render() {
  clear();
  renderEpisodeCards();
}

//Show a loading message
function showLoading() {
  clear(); // Clear previous content
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading episodes, please wait...";
  loadingMessage.id = "loadingMessage";
  root.appendChild(loadingMessage);
}

// Show an error message
function showError(error) {
  clear(); // Clear previous content
  const errorMessage = document.createElement("p");
  errorMessage.textContent = `Error: ${error.message}`;
  errorMessage.id = "errorMessage";
  root.appendChild(errorMessage);
}  



//initializing all variables
const body = document.body;
const root = document.getElementById("root");
//const oneEpisode = getOneEpisode();
//const allEpisodes = getAllEpisodes();
let state = {
  //allEpisodes: allEpisodes,
  searchTerm: "",
  filteredFilms: [],
  allEpisodes:[]
};


//level 300

async function fetchEpisodes(){
  showLoading(); //msg whilst it waits for data
  try { const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
      if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      const data = await response.json();
  
      return data;
      //else
      } catch {
        showError(error);
        console.error("Failed to fetch episodes:", error);
        return [];
  }
}
 


fetchEpisodes().then(function(films){
    loadingMessage.remove()
    console.log(films, "<---fetched films");
    state.allEpisodes = films;
    state.filteredFilms = films;
  render();

   // Populate the selectEpisode dropdown after fetching episodes
  films.forEach((episode) => {
    const option = document.createElement("option");
    option.textContent = `${episodeCode(episode)} - ${episode.name}`;
    option.value = episode.id; // Assuming each episode has a unique ID
    selectEpisode.appendChild(option);
  });
 })

// Event listener: Filters episodes based on search input
const input = document.getElementById("searchInput");
input.addEventListener("keyup", () => {
  state.searchTerm = input.value.toLowerCase();

  // Filter episodes by name or summary
  state.filteredFilms = state.allEpisodes.filter(film => 
    film.summary.toLowerCase().includes(state.searchTerm) || 
    film.name.toLowerCase().includes(state.searchTerm)
  );

  // Update the number of matched episodes
  const episodeDisplayCounter = document.getElementById("episodesNumber");
  episodeDisplayCounter.textContent = `Displaying ${state.filteredFilms.length}/ ${state.allEpisodes.length}`;
 
  render();
});


//200b
const selectEpisode = document.getElementById("dropDown");

selectEpisode.addEventListener("change", (event) => {
   state.searchTerm = event.target.selectedOptions[0].text;

  // loop through all episode find the match
   state.filteredFilms = state.allEpisodes.filter((episode) => 
     deconstructCode(state.searchTerm) === episodeCode(episode));

  render()
  
  //dynamically create a go back to all episode page
  if (!document.getElementById("goBackButton")) {
    const button = document.createElement("button")
    button.id = "goBackButton";
    button.textContent = "go back to all episode"
    root.append(button);
      
      button.addEventListener("click",() => {
      //renderEpisodeCards(allEpisodes);
      state.filteredFilms = state.allEpisodes; // Reset to all episodes
      render();
      selectEpisode.selectedIndex = 0;
      button.remove();
      });
  }
 })

 

 
   

window.onload = setup;
