localStorage.setItem("visitedZuidendijk", "true");

// Splash screen logic
const splash = document.createElement("style");
const timeNow = new Date().toISOString();
const lastVisit = localStorage.getItem("lastVisit") || timeNow;
if (new Date(timeNow) - new Date(lastVisit) > 30 * 1000) {
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
  const container = document.getElementById("news-container");
  container.innerHTML = ""; // clear loading text

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
}

// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("side-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  sideMenu.classList.toggle("open");
});

// Show nav-wrapper after splash screen ends
if (localStorage.getItem("visitedZuidendijk") === "true") {
  document.getElementById("nav-wrapper").style.display = "block";
} else {
  setTimeout(() => {
    document.getElementById("nav-wrapper").style.display = "block";
  }, 2500); // matches splash fadeOut timing
}

loadNews();
