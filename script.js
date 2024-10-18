const form = document.querySelector("form");
const resultDiv = document.querySelector(".result");
const loadingDiv = document.querySelector(".loading");
const errorModal = document.getElementById("errorModal");
const errorMessage = document.getElementById("errorMessage");
const closeModal = document.querySelector(".close");
const historyDiv = document.querySelector(".history");
const toggleHistoryButton = document.getElementById("toggleHistory");

let searchHistory = []; // Array to store search history

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const word = form.elements[0].value.trim();
  if (word) {
    resultDiv.style.display = "block"; // Show the results div
    getWordInfo(word);
    addToHistory(word); // Add word to search history
  } else {
    resultDiv.style.display = "none"; // Hide the results div if no word is entered
  }
});

const getWordInfo = async (word) => {
  loadingDiv.style.display = "block";
  resultDiv.innerHTML = ""; // Clear previous results
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) throw new Error("Word not found");
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    showErrorModal(error.message);
  } finally {
    loadingDiv.style.display = "none";
  }
};

const displayResults = (data) => {
  resultDiv.innerHTML = data
    .map((entry) => {
      const meanings = entry.meanings
        .map(
          (meaning) => `
            <h3>${meaning.partOfSpeech}</h3>
            <p>Meaning: ${meaning.definitions[0].definition || "Not Found"}</p>
            <p>Example: ${meaning.definitions[0].example || "N/A"}</p>
        `
        )
        .join("");
      return `<h2>${entry.word}</h2>${meanings}`;
    })
    .join("");
};

const showErrorModal = (message) => {
  errorMessage.textContent = message;
  errorModal.style.display = "block";
};

// Close modal functionality
const closeModalFunction = () => {
  errorModal.style.display = "none";
};

closeModal.onclick = closeModalFunction;

window.onclick = (event) => {
  if (event.target === errorModal) {
    closeModalFunction();
  }
};

// Close modal on "Esc" key press
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModalFunction();
  }
});

const addToHistory = (word) => {
  if (!searchHistory.includes(word)) {
    searchHistory.push(word);
    const historyItem = document.createElement("div");
    historyItem.textContent = word;
    historyItem.classList.add("history-item");
    historyItem.onclick = () => getWordInfo(word); // Re-search when clicked
    historyDiv.appendChild(historyItem);
  }
};

// Toggle search history visibility
toggleHistoryButton.addEventListener("click", () => {
  if (historyDiv.style.display === "none") {
    historyDiv.style.display = "block";
    toggleHistoryButton.textContent = "Hide Search History"; // Change button text
  } else {
    historyDiv.style.display = "none";
    toggleHistoryButton.textContent = "Show Search History"; // Change button text
  }
});
