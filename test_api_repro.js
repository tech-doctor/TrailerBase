const apiKey = 'af6b563ec687bcd938b75f366399aa4c';
const movieId = 550; // Fight Club
const badUrl = `https://api.themoviedb.org/3/movie/${movieId}+/videos?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=`;
const goodUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=`;

async function test() {
  console.log("Testing API URLs...");
  try {
    const resBad = await fetch(badUrl);
    console.log(`Bad URL status: ${resBad.status}`);
    if (resBad.ok) {
        const data = await resBad.json();
        console.log("Bad URL data: ", data); // check if it actually returns something valid despite status
    }
  } catch (e) {
    console.log(`Bad URL failed: ${e.message}`);
  }

  try {
    const resGood = await fetch(goodUrl);
    console.log(`Good URL status: ${resGood.status}`);
  } catch (e) {
    console.log(`Good URL failed: ${e.message}`);
  }
}
test();
