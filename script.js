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

//getOneEpisode returns an obj with info for one episode.
const episode = getOneEpisode();

//create a function that fill in the tag and append it.

const createEpisodeCard = (episode) =>{

const episodeCard = document.getElementById("episode-card").content.cloneNode(true);
episodeCard.querySelector("h3").textContent = episode.name;
episodeCard.querySelector("#episode-code").textContent = episode.season, episode.number;
episodeCard.querySelector("img").src = episode.image.medium;
episodeCard.querySelector("#summary").textContent = episode.summary;

return episodeCard
}


const episodeCard = createEpisodeCard(episode);

document.body.append(episodeCard);




window.onload = setup;
