// ── CONFIG ──────────────────────────────────────────────────
const ACCESS_KEY = "7lv_0Vik82bJl5nIjbNe6L06HW9k4FY86izYDAHSXG4";
const BASE_URL   = "https://api.unsplash.com/search/photos";
const PER_PAGE   = 12;

// ── DOM REFS ─────────────────────────────────────────────────
const gallery     = document.getElementById("gallery");
const statusEl    = document.getElementById("status");
const searchInput = document.getElementById("search-input");

// ── HELPERS ──────────────────────────────────────────────────
function getQuery() {
  return searchInput.value.trim() || "nature";
}

function buildURL(query) {
  return `${BASE_URL}?query=${encodeURIComponent(query)}&per_page=${PER_PAGE}`;
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function renderPhotos(photos) {
  gallery.innerHTML = "";

  if (!photos || photos.length === 0) {
    setStatus("No results found.");
    return;
  }

  photos.forEach((photo, i) => {
    // card
    const card = document.createElement("div");
    card.className = "photo-card";
    card.style.animationDelay = `${i * 30}ms`;

    // img
    const img = document.createElement("img");
    img.src     = photo.urls.small;
    img.alt     = photo.alt_description || photo.description || "Unsplash photo";
    img.loading = "lazy";

    // click → open on Unsplash
    card.addEventListener("click", () => {
      window.open(photo.links.html, "_blank");
    });

    card.appendChild(img);
    gallery.appendChild(card);
  });
}

// ── METHOD 1: XMLHttpRequest ──────────────────────────────────
function searchWithXHR() {
  const query = getQuery();
  setStatus("Loading with XHR…");

  const xhr = new XMLHttpRequest();
  xhr.open("GET", buildURL(query));
  xhr.setRequestHeader("Authorization", `Client-ID ${ACCESS_KEY}`);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      setStatus(`XHR — ${data.total.toLocaleString()} results for "${query}"`);
      renderPhotos(data.results);
    } else {
      setStatus(`XHR Error: ${xhr.status} ${xhr.statusText}`);
    }
  };

  xhr.onerror = function () {
    setStatus("XHR: Network error.");
  };

  xhr.send();
}

// ── METHOD 2: Fetch with Promises ─────────────────────────────
function searchWithFetch() {
  const query = getQuery();
  setStatus("Loading with fetch (promises)…");

  fetch(buildURL(query), {
    headers: { "Authorization": `Client-ID ${ACCESS_KEY}` }
  })
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (data) {
      setStatus(`fetch (promises) — ${data.total.toLocaleString()} results for "${query}"`);
      renderPhotos(data.results);
    })
    .catch(function (err) {
      setStatus("fetch error: " + err.message);
    });
}

// ── METHOD 3: Fetch with Async / Await ────────────────────────
async function searchWithAsyncAwait() {
  const query = getQuery();
  setStatus("Loading with fetch (async/await)…");

  try {
    const response = await fetch(buildURL(query), {
      headers: { "Authorization": `Client-ID ${ACCESS_KEY}` }
    });

    if (!response.ok) throw new Error("HTTP " + response.status);

    const data = await response.json();
    setStatus(`fetch (async/await) — ${data.total.toLocaleString()} results for "${query}"`);
    renderPhotos(data.results);

  } catch (err) {
    setStatus("async/await error: " + err.message);
  }
}

// ── BUTTON EVENTS ─────────────────────────────────────────────
document.getElementById("btn-xhr").addEventListener("click", searchWithXHR);
document.getElementById("btn-fetch").addEventListener("click", searchWithFetch);
document.getElementById("btn-async").addEventListener("click", searchWithAsyncAwait);

// Enter key → async/await
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") searchWithAsyncAwait();
});

// ── DARK MODE ─────────────────────────────────────────────────
const darkBtn = document.getElementById("dark-toggle");
const html    = document.documentElement;

darkBtn.addEventListener("click", function () {
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
  darkBtn.textContent = isDark ? "🌙" : "☀️";
});

// ── LOAD DEFAULT ON PAGE READY ────────────────────────────────
searchWithAsyncAwait();
