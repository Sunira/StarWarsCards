var swapi = {
  characterCount: "",
  setupRangeInput: function () {
    const range = document.getElementById("range");
    const rangeV = document.getElementById("rangeV");

    function setValue() {
      range.value = range.value || 10;
      const newValue = Number(
        ((range.value - range.min) * 100) / (range.max - range.min)
      );
      const newPosition = 10 - newValue * 0.2;
      rangeV.innerHTML = `<span>${range.value}</span>`;
      rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;

      // Any time range value is set, collect new SWAPI Chars and clear Old Ones
      document.querySelector("#swapi-cards").innerHTML = "";
      swapi.getRandomCharacters(range.value);
    }
    document.addEventListener("DOMContentLoaded", setValue());
    range.value = 5;
    range.addEventListener("change", setValue);
  },

  //Retrieve count of character records
  loadCharacters: async function () {
    const response = await fetch("http://swapi.dev/api/people/");
    const allSWAPIChars = await response.json();
    this.characterCount = allSWAPIChars.count || 0;
    this.setupRangeInput();
  },

  //Create array of UNIQUE character IDs to render
  getRandomCharacters: function (numChars) {
    var idArray = [];
    while (idArray.length < numChars) {
      var rando = Math.floor(Math.random() * swapi.characterCount) + 1;
      if (idArray.indexOf(rando) === -1) idArray.push(rando); // Only push unique character Ids.
    }
    //Get Information for Each of these Character IDs
    idArray.forEach(function (value) {
      swapi.getSingleCharacter(value);
    });
  },

  // Hit individual Character Endpoint
  getSingleCharacter: async function (characterID) {
    const response = await fetch("http://swapi.dev/api/people/" + characterID);
    const swapiChar = await response.json();
    this.createCharacterCard(swapiChar, characterID);
  },

  //Generate HTML for each
  createCharacterCard(swapiChar, characterID) {
    const markup = `
                  <div class="person" style="background-image:url(https://source.unsplash.com/800x5${characterID}/?space,stars)">
                      <h2 class="swapi-name">
                          ${swapiChar.name}
                      </h2>
                      <div class="swapi-content">
                      <div class="swapi-item"><p class="swapi-prop"> Gender </p> <p class="swapi-val">${swapiChar.gender}</div>
                      <div class="swapi-item"><p class="swapi-prop"> Hair Color </p>  <p class="swapi-val">${swapiChar.hair_color}</div>
                      <div class="swapi-item"><p class="swapi-prop"> Skin Color </p> <p class="swapi-val">${swapiChar.skin_color}</div>
                      <div class="swapi-item"><p class="swapi-prop"> Eye Color </p> <p class="swapi-val">${swapiChar.eye_color}</div>
                      </div>
                  </div>
                  `;

    const scards = document.querySelector("#swapi-cards");
    scards.insertAdjacentHTML("beforeend", markup);
  },
};

swapi.loadCharacters();
