let allMovies = [];
let selectedGenres = [];

async function fetchMovies() {
  try {
    const response = await fetch('/movies');
    allMovies = await response.json();
    generateGenreButtons();
    displayMovies(allMovies);
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
  }
}

function displayMovies(movies) {
  const container = document.getElementById('movies-container');
  container.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <div class="genres">
        ${(movie.genres || []).map(genre => `<span class="genre">${genre}</span>`).join('')}
      </div>
      <a class="details-button" href="pages/movie_details.html?id=${movie._id}">VIEW DETAILS</a> <!-- Caminho corrigido -->
    `;

    container.appendChild(card);
  });
}

function generateGenreButtons() {
  const genreSet = new Set();
  allMovies.forEach(movie => {
    (movie.genres || []).forEach(genre => genreSet.add(genre));
  });

  const container = document.getElementById('genre-buttons');
  container.innerHTML = '';

  [...genreSet].sort().forEach(genre => {
    const btn = document.createElement('button');
    btn.className = 'genre-button';
    btn.textContent = genre;
    btn.onclick = () => {
      btn.classList.toggle('selected');
      if (selectedGenres.includes(genre)) {
        selectedGenres = selectedGenres.filter(g => g !== genre);
      } else {
        selectedGenres.push(genre);
      }
      filterMovies();
    };
    container.appendChild(btn);
  });
}

function filterMovies() {
  const query = document.getElementById('search-bar').value.toLowerCase();
  const yearRange = document.getElementById('year-range').value;
  const minRuntime = parseInt(document.getElementById('min-runtime').value) || 0;
  const minRating = parseFloat(document.getElementById('min-rating').value) || 0;

  let filtered = allMovies.filter(movie => {
    const titleMatch = movie.title.toLowerCase().includes(query);
    const genreMatch = selectedGenres.length === 0 || (movie.genres || []).some(g => selectedGenres.includes(g));

    let yearMatch = true;
    if (yearRange) {
      const [minYear, maxYear] = yearRange.split('-').map(Number);
      const movieYear = movie.year || 0;
      yearMatch = movieYear >= minYear && movieYear <= maxYear;
    }

    const runtimeMatch = (movie.runtime || 0) >= minRuntime;
    const ratingMatch = (movie.imdb?.rating || 0) >= minRating;

    return titleMatch && genreMatch && yearMatch && runtimeMatch && ratingMatch;
  });

  displayMovies(filtered);
}

document.getElementById('filters-button').addEventListener('click', () => {
  const panel = document.getElementById('filters-panel');
  panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('search-bar').addEventListener('input', filterMovies);
document.getElementById('year-range').addEventListener('change', filterMovies);
document.getElementById('min-runtime').addEventListener('input', filterMovies);
document.getElementById('min-rating').addEventListener('input', filterMovies);

fetchMovies();
