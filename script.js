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
  const season = episode.season.toString().padStart(2, '0');
  const number = episode.number.toString().padStart(2, '0');
  // Concatenate the formatted string
  return `S${season}E${number}`;
}



//getOneEpisode returns an obj with info for one episode.
const episode = getOneEpisode();
const episodes = getAllEpisodes();

//create a function that fill in the tag and append it.
const createEpisodeCard = (episode) =>{

const episodeCard = document.getElementById("episode-card").content.cloneNode(true);
episodeCard.querySelector("h3").textContent = episode.name;
episodeCard.querySelector("#episode-code").textContent = `${episodeCode(episode)}`;
episodeCard.querySelector("img").src = episode.image.medium;
episodeCard.querySelector("#summary").innerHTML = episode.summary;

return episodeCard;
}


const episodeCards = episodes.map(createEpisodeCard);
document.body.append(...episodeCards);





window.onload = setup;
