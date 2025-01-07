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
// Render function: Clears previous content and renders filtered episodes
function render() {
  clear();
  renderEpisodeCards();
}

//initializing all variables
const body = document.body;
const root = document.getElementById("root");
const oneEpisode = getOneEpisode();
const allEpisodes = getAllEpisodes();
const state = {
  allEpisodes: allEpisodes,
  searchTerm: "",
  filteredFilms: allEpisodes
};

// Initial render
renderEpisodeCards(allEpisodes);


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
  episodeDisplayCounter.textContent = `Displaying ${state.filteredFilms.length}/73 episodes`;

  render(state.filteredFilms);
});


//200b
const selectEpisode = document.getElementById("dropDown");

// Loop through all episodes and create an <option> for each
allEpisodes.forEach(episode => {
  const option = document.createElement("option");
  option.textContent = `${episodeCode(episode)} - ${episode.name}`;
  option.value = episode.id; // Assuming each episode has a unique ID
  selectEpisode.appendChild(option);
});

//Helper function deconstruct
function deconstructCode(selectedText){
  //returns substring of episode code 
  const separatorIndex = selectedText.indexOf(" -");
   return selectedText.substring(0, separatorIndex);
}


selectEpisode.addEventListener("change", (event) => {
   const selectedText = event.target.selectedOptions[0].text;

  // loop through all episode find the match
 const foundEpisode = allEpisodes.find((episode) => 
  deconstructCode(selectedText) === episodeCode(episode));

  clear();
  //append to root
  const episodeCard = createEpisodeCard(foundEpisode);
  root.append(episodeCard); 
//dynamically create a go back to all episode page
  const button = document.createElement("button")
  button.textContent = "go back to all episode"
  root.append(button);
  button.addEventListener("click",() => {
      clear();
      renderEpisodeCards(allEpisodes);
      selectEpisode.selectedIndex = 0;
      button.remove();
    });
 })
 
   

window.onload = setup;
