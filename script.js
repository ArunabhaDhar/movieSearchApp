// --- API Configurations ---
const TV_SEARCH_API = `https://api.tvmaze.com/search/shows?q=`;
const TV_DEFAULT = `https://api.tvmaze.com/search/shows?q=comedy`;

// PUT YOUR OMDB API KEY HERE ON THE LINE BELOW
const MOVIE_API_KEY = 'e7f6601b'; 

const MOVIE_SEARCH_API = `https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&s=`;
const MOVIE_DEFAULT = `https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&s=batman`;

// --- State ---
let currentMode = 'tv'; 

// --- DOM Elements ---
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tabTv = document.getElementById('tab-tv');
const tabMovie = document.getElementById('tab-movie');

// Initial Load
fetchTvShows(TV_DEFAULT);

// --- Tab Event Listeners ---
tabTv.addEventListener('click', () => {
    currentMode = 'tv';
    tabTv.classList.add('active');
    tabMovie.classList.remove('active');
    search.placeholder = "Search for a TV show...";
    fetchTvShows(TV_DEFAULT); 
});

tabMovie.addEventListener('click', () => {
    currentMode = 'movie';
    tabMovie.classList.add('active');
    tabTv.classList.remove('active');
    search.placeholder = "Search for a Movie...";
    fetchMovies(MOVIE_DEFAULT); 
});

// --- Search Form Submission ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        if (currentMode === 'tv') {
            fetchTvShows(TV_SEARCH_API + searchTerm);
        } else {
            fetchMovies(MOVIE_SEARCH_API + searchTerm);
        }
        search.value = ''; 
    }
});

// --- Fetch & Render TV Shows (TVmaze API) ---
async function fetchTvShows(url) {
    try {
        // Show the loading spinner
        main.innerHTML = '<div class="loader"></div>';

        const response = await fetch(url);
        const data = await response.json();
        
        main.innerHTML = ''; // Clear the spinner

        if (data.length === 0) {
            main.innerHTML = `<h2>No TV shows found!</h2>`;
            return;
        }

        data.forEach((item) => {
            const show = item.show;
            const title = show.name;
            const imageUrl = show.image ? show.image.medium : 'https://via.placeholder.com/300x450?text=No+Image';
            const rating = show.rating && show.rating.average ? show.rating.average : 'N/A';

            createCard(imageUrl, title, rating);
        });
    } catch (error) {
        console.error("Error fetching TV data: ", error);
        main.innerHTML = `<h2>Error loading data.</h2>`;
    }
}

// --- Fetch & Render Movies (OMDb API) ---
async function fetchMovies(url) {
    try {
        // Show the loading spinner
        main.innerHTML = '<div class="loader"></div>';

        const response = await fetch(url);
        const data = await response.json();
        
        main.innerHTML = ''; // Clear the spinner

        if (data.Search) {
            data.Search.forEach((movie) => {
                const title = movie.Title;
                const imageUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
                const year = movie.Year; 

                createCard(imageUrl, title, year);
            });
        } else {
            main.innerHTML = `<h2>No movies found!</h2>`;
        }
    } catch (error) {
        console.error("Error fetching Movie data: ", error);
        main.innerHTML = `<h2>Error loading data.</h2>`;
    }
}

// --- Helper Function to Create HTML Cards ---
function createCard(imageUrl, title, secondaryInfo) {
    const el = document.createElement('div');
    el.classList.add('movie');

    el.innerHTML = `
        <img src="${imageUrl}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span>${secondaryInfo}</span>
        </div>
    `;

    main.appendChild(el);
}
