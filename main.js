let allCountries = []


let wrapper = null
let toggleBtn = null
let sortSelect = null
let searchInput = null
let regionSelect = null


function renderCountries(list) {
  wrapper.innerHTML = ''
  if (!list || list.length === 0) {
    wrapper.innerHTML = '<p>No countries found…</p>'
    return
  }

  list.forEach(e => {
    let card = document.createElement('div')
    card.className = 'country-card'
    card.innerHTML = `
      <a target="_blank" href="${e?.maps?.googleMaps || '#'}">
        <img src="${e?.flags?.png}" alt="flag of ${e?.name?.common}">
        <div class="info">
          <div class="name">${e?.name?.common}</div>
          <div>Capital: ${e?.capital?.[0] ?? 'N/A'}</div>
          <div>Region: ${e?.region ?? 'N/A'}</div>
          <div>Population: ${Number(e?.population || 0).toLocaleString()}</div>
        </div>
      </a>
    `
    wrapper.append(card)
  })
}


function applyFilters() {
  let filtered = [...allCountries]


  let q = searchInput.value.trim().toLowerCase()
  if (q) {
    filtered = filtered.filter(c =>
      c?.name?.common?.toLowerCase().includes(q)
    )
  }


  let r = regionSelect.value
  if (r !== 'all') {
    filtered = filtered.filter(c => c?.region === r)
  }


  if (sortSelect.value === 'A-Z') {
    filtered.sort((a, b) => a.name.common.localeCompare(b.name.common))
  } else if (sortSelect.value === 'Z-A') {
    filtered.sort((a, b) => b.name.common.localeCompare(a.name.common))
  }

  renderCountries(filtered)
}


async function getFlags() {
  try {
    let res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,maps')
    let data = await res.json()
    allCountries = Array.isArray(data) ? data : []
    renderCountries(allCountries)
  } catch (e) {
    console.error('Xatolik:', e)
  }
}


function initThemeToggle() {
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    toggleBtn.textContent = document.body.classList.contains('dark')
      ? 'Light Mode ☀️'
      : 'Dark Mode 🌙'
  })
}


function wireEvents() {
  sortSelect.addEventListener('change', applyFilters)
  searchInput.addEventListener('input', applyFilters)
  regionSelect.addEventListener('change', applyFilters)
}


document.addEventListener('DOMContentLoaded', () => {
  wrapper = document.querySelector('.countries-grid')
  toggleBtn = document.getElementById('dark-mode-toggle')
  sortSelect = document.getElementById('sort-select')
  searchInput = document.getElementById('search-input')
  regionSelect = document.getElementById('region-select')

  initThemeToggle()
  wireEvents()
  getFlags()
})
