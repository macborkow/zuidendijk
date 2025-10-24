localStorage.setItem("visitedZuidendijk", "true");

// Splash screen logic
const splash = document.createElement("style");
const timeNow = new Date().toISOString();
const lastVisit = localStorage.getItem("lastVisit") || "1970-01-01T00:00:00.000Z";
if (new Date(timeNow) - new Date(lastVisit) > 5 * 60 * 1000) {
  localStorage.setItem("visitedZuidendijk", "false");
} 
localStorage.setItem("lastVisit", timeNow);

if (localStorage.getItem("visitedZuidendijk") === "true") {
  splash.textContent = "#splash { display: none !important; }";
  document.head.appendChild(splash);
} else {
  const splashImg = document.createElement("img");
  splashImg.src = "./images/logo.png";
  splashImg.alt = "Zuidendijk logo";
  document.getElementById("splash").appendChild(splashImg);
}
  
// List jour news files here in date-descending order
const newsFiles = [
  "2025-10-16-burendag.md",
  "2025-07-31-website-launch.md",
];

// Simple markdown parser with basic support for # headers and images
function parseMarkdown(md, dateString) {
  const lines = md.split("\n");
  const container = document.createElement("div");
  container.className = "news-post";

  // Title-date row container (flex)
  const headerRow = document.createElement("div");
  headerRow.className = "news-header-row";

  // Prepare date
  const dateBox = document.createElement("div");
  dateBox.className = "news-date";
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  dateBox.textContent = formattedDate;

  // Placeholder for title
  const titleBox = document.createElement("h2");
  titleBox.className = "news-title";

  headerRow.appendChild(titleBox);
  headerRow.appendChild(dateBox);
  container.appendChild(headerRow);

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith("# ")) {
      titleBox.textContent = line.substring(2).trim();
      return;
    }
    // Image line !(img)[path]
    const imgMatch = line.match(/^!\(img\)\[(.+)\]$/);
    if (imgMatch) {
      const img = document.createElement("img");
      img.src = `.${imgMatch[1]}`;
      img.alt = "News image";
      img.className = "news-image";
      container.appendChild(img);
      return;
    }
    // Normal paragraph
    if (line.length > 0) {
      const p = document.createElement("p");
      p.textContent = line;
      container.appendChild(p);
    }
  });

  return container;
}

async function loadNews() {
  const root = document.getElementById("content");
  const container = document.createElement("div");
  container.id = "news-container";
  root.innerHTML = "Loaden nieuws...";

  for (const file of newsFiles) {
    try {
      const response = await fetch(`./news/${file}`);
      if (!response.ok) throw new Error(`Failed to fetch ${file}`);

      const text = await response.text();
      const datePart = file.split("-").slice(0, 3).join("-"); // YYYY-MM-DD
      const post = parseMarkdown(text, datePart);
      container.appendChild(post);
    } catch (e) {
      console.error(e);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = `Error loading ${file}`;
      container.appendChild(errorMsg);
    }
  }
  root.innerHTML = "";
  root.appendChild(container);
}


const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("side-menu");
function toggleSideMenu() {
  // Hamburger menu toggle
  hamburger.classList.toggle("open");
  sideMenu.classList.toggle("open");
}
  

function showNavWrapper() {
  const nav = document.getElementById("nav-wrapper");
  nav.style.display = "block";
  // force a reflow so the browser registers the display change before opacity
  void nav.offsetWidth;
  nav.classList.add("visible");
}


hamburger.addEventListener("click", () => {
  toggleSideMenu();
});

// Show nav-wrapper after splash screen ends
if (localStorage.getItem("visitedZuidendijk") === "true") {
  showNavWrapper();
} else {
  setTimeout(() => {
    showNavWrapper();
  }, 2500); // matches splash fadeOut timing
}

// Add this inside your DOMContentLoaded or after the DOM is ready

document.querySelector('a[href="#over"]').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.setItem("lastVisit", new Date().toISOString());
  fetch('about.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('content').innerHTML = html;
    });
  toggleSideMenu();
  window.location.hash = '#over';
});
document.querySelector('a[href="#contact"]').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.setItem("lastVisit", new Date().toISOString());
  fetch('contact.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('content').innerHTML = html;
    });
  toggleSideMenu();
  window.location.hash = '#contact';
});
document.querySelector('a[href="#archief"]').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.setItem("lastVisit", new Date().toISOString());
  fetch('archive.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('content').innerHTML = html;
    });
  toggleSideMenu();
  window.location.hash = '#archief';
});

// Restore news when "Nieuws" is clicked
document.querySelector('a[href="/"]').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.setItem("lastVisit", new Date().toISOString());
  loadNews(); // your existing function
  toggleSideMenu();
  window.location.hash = '';
});

// Timeline loader function
async function loadTimeline() {
  const container = document.getElementById("content");
  container.innerHTML = '<div id="timeline-embed" style="width: 60vw; height: 30vh"></div>';
  try {
    const response = await fetch('timeline-data.json');
    const data = await response.json();
    window.timeline = new TL.Timeline('timeline-embed', data);
  } catch (e) {
    container.innerHTML = "<p>Fout bij laden van de tijdlijn.</p>";
    console.error(e);
  }
}

// Add handler for Tijdlijn button
document.querySelector('a[href="#tijdlijn"]').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.setItem("lastVisit", new Date().toISOString());
  loadTimeline();
  toggleSideMenu();
  // set the right hash
  window.location.hash = '#tijdlijn';
});

const target = document.querySelector('#nav-wrapper');

document.addEventListener('click', (event) => {
  const withinBoundaries = event.composedPath().includes(target)

  if (!withinBoundaries) {
    if (sideMenu.classList.contains("open")) {
      toggleSideMenu();
    }
  }
})

// go to the right section based on URL hash
window.addEventListener('load', () => {
  const hash = window.location.hash;
  console.log("Current hash:", hash);
  if (hash === '#over') {
    fetch('about.html')
      .then(response => response.text())
      .then(html => {
	document.getElementById('content').innerHTML = html;
      });
  } else if (hash === '#contact') {
    fetch('contact.html')
      .then(response => response.text())
      .then(html => {
	document.getElementById('content').innerHTML = html;
      });
  } else if (hash === '#archief') {
    fetch('archive.html')
      .then(response => response.text())
      .then(html => {
	document.getElementById('content').innerHTML = html;
      });
  } else if (hash === '#tijdlijn') {
    loadTimeline();
  } else {
    loadNews();
  }
});
