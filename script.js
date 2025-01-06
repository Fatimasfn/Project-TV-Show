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

function episodeCode(episode) {
  // Extract season and episode numbers
  const episodeSeason = episode.season.toString().padStart(2, '0');
  const episodeNumber = episode.number.toString().padStart(2, '0');
  // Concatenate the formatted string
  return `S${episodeSeason}E${episodeNumber}`;
}



//getOneEpisode returns an obj with info for one episode.
const oneEpisode = getOneEpisode();
const allEpisodes = getAllEpisodes();


//create a function that fill in the tag and append it.
const createEpisodeCard = (oneEpisode) =>{

const episodeCard = document.getElementById("episode-card").content.cloneNode(true);
episodeCard.querySelector("h3").textContent = oneEpisode.name;
episodeCard.querySelector("#episode-code").textContent = `${episodeCode(oneEpisode)}`;
episodeCard.querySelector("img").src = oneEpisode.image.medium;
episodeCard.querySelector("#summary").innerHTML = oneEpisode.summary;

return episodeCard;
}
//render()
const state = {
  allEpisodes: allEpisodes,
  searchTerm: "",
  filteredFilms:allEpisodes
};
const input = document.getElementById("searchInput");
input.addEventListener("keyup", () => {
  state.searchTerm = input.value.toLowerCase();
  console.log(state.allEpisodes)
   state.filteredFilms = state.allEpisodes.filter((film) =>{
    
     return film.summary.toLowerCase().includes(state.searchTerm) || film.name.toLocaleLowerCase().includes(state.searchTerm)


 } );
 render();
 


 const numberOfFilteredEpisodes=document.getElementById("episodsNumber")
 numberOfFilteredEpisodes.textContent=`the number of matched episodes:${state.filteredFilms.length}`
 
});


function render() {
  console.log(state.filteredFilms);
  clear();
  const episodeCards = state.filteredFilms.map(createEpisodeCard);
  document.body.append(...episodeCards);
}

  render()
function clear(){
 
  const sections=document.getElementsByTagName("section")
  const elements=Array.from(sections)
  
 
  elements.forEach(element=>element.remove())
}

const selectEpisode=document.getElementById("dropDown")
allEpisodes.forEach(episode=>{
const option = document.createElement("option");

option.textContent = episodeCode(episode)+" "+episode.name
option.value=episode.name


// Append the option to the dropdown
selectEpisode.appendChild(option);

})
selectEpisode.addEventListener("change", () => {
  const selectedOption = selectEpisode.options[selectEpisode.selectedIndex];
  state.searchTerm=selectedOption.value.toLocaleLowerCase()
  state.filteredFilms=state.allEpisodes.filter((film)=>{
    return film.name.toLocaleLowerCase().includes(state.searchTerm)
  })
   render()
   
});

window.onload = setup;
