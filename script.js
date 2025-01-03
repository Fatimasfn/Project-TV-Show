//You can edit ALL of the code here

function setup() {
  const allEpisodes = getAllEpisodes();
  return makePageForEpisodes(allEpisodes);
}

//sets text to the root element in the html
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  return rootElem;
}


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
render();
function render(){
const episodeCards = allEpisodes.map(createEpisodeCard);
document.body.append(...episodeCards);

}



window.onload = setup;
