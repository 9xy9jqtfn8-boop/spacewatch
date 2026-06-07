const spacecamFeeds = [
  {
    title: "Earth Orbit Live",
    category: "orbit",
    type: "Live orbit view",
    description:
      "Real-time or near-real-time Earth views from orbit when the external camera feed is available.",
    note: "Best for Earth-from-space views.",
    button: "Open orbit view",
    url: "https://www.nasa.gov/live/"
  },
  {
    title: "Station Earth View",
    category: "orbit",
    type: "ISS camera",
    description:
      "A direct Earth-facing space station camera view, useful when the station is in daylight and the feed is active.",
    note: "May go dark during orbital night.",
    button: "Open station view",
    url: "https://eol.jsc.nasa.gov/esrs/HDEV/"
  },
  {
    title: "Mission Control Live",
    category: "missions",
    type: "Mission broadcast",
    description:
      "Official mission coverage, launch broadcasts, astronaut events and space agency live programming.",
    note: "Event-based coverage.",
    button: "Open mission feed",
    url: "https://www.nasa.gov/live/"
  },
  {
    title: "European Space Broadcast",
    category: "missions",
    type: "Agency broadcast",
    description:
      "European space mission coverage, live events, launches, briefings and special broadcasts.",
    note: "Live when events are scheduled.",
    button: "Open broadcast",
    url: "https://watch.esa.int/"
  },
  {
    title: "Deep Space Watch",
    category: "observatories",
    type: "Telescope activity",
    description:
      "See what major space telescopes are observing now, recently observed, or are scheduled to observe next.",
    note: "Observation status, not a video camera.",
    button: "Open deep space view",
    url: "https://spacetelescopelive.org/"
  },
  {
    title: "Maunakea Sky Watch",
    category: "observatories",
    type: "Night sky camera",
    description:
      "A high-altitude sky camera view from Maunakea, often showing stars, meteors, twilight and summit conditions.",
    note: "Excellent hidden-gem feed.",
    button: "Open sky watch",
    url: "https://www.nao.ac.jp/en/livecam/"
  },
  {
    title: "Summit Sky Cameras",
    category: "observatories",
    type: "Mountain observatory cams",
    description:
      "Public summit cameras and low-light sky views from a major observatory site.",
    note: "Weather and darkness affect visibility.",
    button: "Open summit cameras",
    url: "https://www.cfht.hawaii.edu/en/gallery/webcams.php"
  },
  {
    title: "4K Mountain StarCam",
    category: "observatories",
    type: "StarCam stream",
    description:
      "A public 24/7 StarCam-style view from one of the world’s most important astronomy locations.",
    note: "Strong SpaceCam feature card.",
    button: "Open StarCam",
    url: "https://www.cfht.hawaii.edu/en/gallery/starcam.php"
  },
  {
    title: "Southern Observatory View",
    category: "observatories",
    type: "Observatory webcams",
    description:
      "Live webcam views from professional observatory sites in one of the driest astronomy locations on Earth.",
    note: "Multiple external camera views.",
    button: "Open observatory view",
    url: "https://www.eso.org/public/outreach/webcams/"
  },
  {
    title: "Future Telescope Site",
    category: "observatories",
    type: "Construction webcam",
    description:
      "A live view from a major next-generation telescope site, showing the observatory environment and progress.",
    note: "Good for space infrastructure fans.",
    button: "Open site view",
    url: "https://elt.eso.org/about/webcams/"
  },
  {
    title: "Live Telescope Events",
    category: "events",
    type: "Public observing",
    description:
      "Live observing sessions for asteroids, comets, eclipses, supermoons and special night-sky events.",
    note: "Best when an event is scheduled.",
    button: "Open event feed",
    url: "https://www.virtualtelescope.eu/webtv/"
  },
  {
    title: "Solar Watch",
    category: "observatories",
    type: "Solar observing",
    description:
      "Specialist public solar and space-observing links, including solar telescope and satellite image feeds where available.",
    note: "Useful during solar activity.",
    button: "Open solar view",
    url: "https://www.nao.ac.jp/en/livecam/"
  }
];

function renderSpaceCamCards(filter = "all") {
  const grid = document.getElementById("spacecamGrid");

  if (!grid) return;

  const selectedFeeds =
    filter === "all"
      ? spacecamFeeds
      : spacecamFeeds.filter((feed) => feed.category === filter);

  grid.innerHTML = selectedFeeds
    .map(
      (feed) => `
        <article class="spacecam-card" data-category="${feed.category}">
          <div class="spacecam-card-top">
            <span class="spacecam-card-tag">${feed.type}</span>
            <span class="spacecam-status-dot"></span>
          </div>

          <h3>${feed.title}</h3>

          <p>${feed.description}</p>

          <div class="spacecam-meta">
            <span>External public feed</span>
            <span>${feed.note}</span>
          </div>

          <a href="${feed.url}" target="_blank" rel="noopener noreferrer" class="spacecam-link">
            ${feed.button}
          </a>
        </article>
      `
    )
    .join("");
}

function setupSpaceCamTabs() {
  const tabs = document.querySelectorAll(".spacecam-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-spacecam-filter");
      renderSpaceCamCards(filter);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSpaceCamCards("all");
  setupSpaceCamTabs();
});