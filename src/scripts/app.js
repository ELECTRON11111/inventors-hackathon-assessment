const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population';
const countryContainer = document.getElementById('country-list');
const searchInput = document.getElementById('search');
const regionFilter = document.getElementById('region-filter');
let countries = [];

// Fetch country data from the API
async function fetchCountries() {
    try {
        const response = await fetch(apiUrl);
        countries = await response.json();
        displayCountries(countries);
        populateRegionFilter(countries);
    } catch (error) {
        console.error('Error fetching country data:', error);
    }
}

// Display countries in cards
function displayCountries(countries) {
    countryContainer.innerHTML = '';
    countries.forEach(country => {
        const countryCard = document.createElement('div');
        countryCard.classList.add('card'); // <-- Use 'card' for styling
        countryCard.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="country-flag">
            <h2>${country.name.common}</h2>
            <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p>Region: ${country.region || 'N/A'}</p>
            <p>Population: ${country.population?.toLocaleString() || 'N/A'}</p>
        `;
        countryContainer.appendChild(countryCard);
    });
}

// Populate region filter options
function populateRegionFilter(countries) {
    const regions = Array.from(new Set(countries.map(c => c.region).filter(Boolean)));
    regionFilter.innerHTML = `<option value="All">All Regions</option>` +
        regions.map(region => `<option value="${region}">${region}</option>`).join('');
}

// Search countries by name
searchInput.addEventListener('input', () => {
    filterAndDisplay();
});

// Filter countries by region
regionFilter.addEventListener('change', () => {
    filterAndDisplay();
});

// Combined filter function
function filterAndDisplay() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;
    let filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    );
    if (selectedRegion !== 'All') {
        filtered = filtered.filter(country => country.region === selectedRegion);
    }
    displayCountries(filtered);
}

// Initial fetch
fetchCountries();