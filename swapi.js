var swapi = {
  init: function () {
    this.loadCharacters();
  },
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

      // Any time range value is set, collect new SWAPI Chars
      document.querySelector("#swapi-cards").innerHTML = "";
      swapi.getRandomCharacters(range.value);
    }
    document.addEventListener("DOMContentLoaded", setValue);
    range.value = 10;
    range.addEventListener("change", setValue);
  },
  loadCharacters: async function () {
    const response = await fetch("http://swapi.dev/api/people/");
    const allSWAPIChars = await response.json();
    this.characterCount = allSWAPIChars.count || 0;

    this.getRandomCharacters(10);
    this.setupRangeInput();
  },

  getRandomCharacters: function (numChars) {
    //Create array of UNIQUE character IDs to render
    var idArray = [];

    while (idArray.length < numChars) {
      var rando = Math.floor(Math.random() * swapi.characterCount) + 1;
      if (idArray.indexOf(rando) === -1) idArray.push(rando); // Only push unique character Ids.
    }

    idArray.forEach(function (value) {
      swapi.loadCharacter(value);
    });
  },

  loadCharacter: async function (characterID) {
    const response = await fetch("http://swapi.dev/api/people/" + characterID);
    const swapiChar = await response.json();
    this.createCharacterCard(swapiChar, characterID);
    console.log(swapiChar);
  },
  createCharacterCard(swapiChar, characterID) {
    const markup = `
                  <div class="person" style="background-image:url(https://source.unsplash.com/800x5${characterID}/?space,stars)">
                      <h2 cass="swapi-name">
                          ${swapiChar.name}
                      </h2>
                      <div class="swapi-content">
                      <div class="swapi-item"><p class="swapi-prop"> Skin Color </p> <p class="swapi-val">${swapiChar.skin_color}</div>
                      <div class="swapi-item"><p class="swapi-prop"> Hair Color </p>  <p class="swapi-val">${swapiChar.hair_color}</div>
                      <div class="swapi-item"><p class="swapi-prop"> Skin Color </p> <p class="swapi-val">${swapiChar.skin_color}</div>
                      </div>
                  </div>
                  `;

    const scards = document.querySelector("#swapi-cards");
    scards.insertAdjacentHTML("beforeend", markup);
  },
};

swapi.init();
