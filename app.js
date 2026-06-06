/* =========================================
   SPACEWATCH — LIVE GLOBAL LAUNCH DATA
   Version 1: Upcoming launches in UK time
========================================= */

const launchList = document.getElementById("launchList");
const lastUpdated = document.getElementById("lastUpdated");
const refreshBtn = document.getElementById("refreshBtn");

/*
  Launch Library 2 by The Space Devs.
  This pulls upcoming global rocket launches.
  mode=detailed gives us richer mission/provider/pad/video data.
*/
const API_URL =
  "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=12&mode=detailed";

/* ---------- BASIC SAFETY HELPERS ---------- */

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeText(value, fallback = "Not confirmed") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return escapeHtml(value);
}

/* ---------- UK DATE / TIME ---------- */

function formatUkDate(dateString) {
  if (!dateString) return "Time to be confirmed";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Time to be confirmed";
  }

  return date.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatShortUkTime(dateString) {
  if (!dateString) return "TBC";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "TBC";
  }

  return date.toLocaleString("en-GB", {
    timeZone: "Europe/London",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ---------- COUNTDOWN ---------- */

function getCountdown(dateString) {
  if (!dateString) return "TBC";

  const launchTime = new Date(dateString).getTime();

  if (Number.isNaN(launchTime)) {
    return "TBC";
  }

  const now = Date.now();
  const difference = launchTime - now;

  if (difference <= 0) {
    return "Launch window open";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes / 60) % 24);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/* ---------- LAUNCH DATA HELPERS ---------- */

function getProvider(launch) {
  return (
    launch.launch_service_provider?.name ||
    launch.lsp_name ||
    "Provider not confirmed"
  );
}

function getRocketName(launch) {
  return (
    launch.rocket?.configuration?.full_name ||
    launch.rocket?.configuration?.name ||
    launch.rocket?.name ||
    "Rocket not confirmed"
  );
}

function getLocation(launch) {
  return (
    launch.pad?.location?.name ||
    launch.pad?.name ||
    "Location not confirmed"
  );
}

function getPadName(launch) {
  return launch.pad?.name || "Launch pad not confirmed";
}

function getMissionDescription(launch) {
  return (
    launch.mission?.description ||
    launch.mission?.name ||
    launch.launch_description ||
    "Mission details have not been confirmed yet."
  );
}

function getMissionType(launch) {
  return (
    launch.mission?.type ||
    launch.mission?.orbit?.name ||
    "Mission type not confirmed"
  );
}

function getVideoUrl(launch) {
  if (Array.isArray(launch.vidURLs) && launch.vidURLs.length > 0) {
    return launch.vidURLs[0]?.url;
  }

  if (Array.isArray(launch.vidurls) && launch.vidurls.length > 0) {
    return launch.vidurls[0]?.url;
  }

  if (Array.isArray(launch.webcast_live) && launch.webcast_live.length > 0) {
    return launch.webcast_live[0]?.url;
  }

  return null;
}

function getInfoUrl(launch) {
  return launch.url || launch.infoURLs?.[0]?.url || launch.info_url || null;
}

/* ---------- STATUS / WATCHABILITY ---------- */

function getStatusName(launch) {
  return launch.status?.name || "Status unknown";
}

function getStatusDescription(launch) {
  return launch.status?.description || "";
}

function getStatusClass(statusName) {
  const status = String(statusName || "").toLowerCase();

  if (
    status.includes("go") ||
    status.includes("success") ||
    status.includes("confirmed")
  ) {
    return "green";
  }

  if (
    status.includes("hold") ||
    status.includes("tbc") ||
    status.includes("tbd") ||
    status.includes("to be confirmed") ||
    status.includes("to be determined")
  ) {
    return "blue";
  }

  if (
    status.includes("failure") ||
    status.includes("failed") ||
    status.includes("scrub") ||
    status.includes("cancel")
  ) {
    return "red";
  }

  return "blue";
}

function getWatchLabel(launch) {
  const videoUrl = getVideoUrl(launch);
  const status = getStatusName(launch).toLowerCase();

  if (videoUrl) {
    return "Watch link available";
  }

  if (status.includes("go")) {
    return "Likely watchable";
  }

  if (status.includes("tbc") || status.includes("tbd")) {
    return "Time uncertain";
  }

  return "Scheduled";
}

function getScheduleNote(launch) {
  const status = getStatusName(launch);
  const statusDescription = getStatusDescription(launch);

  if (statusDescription) {
    return statusDescription;
  }

  if (status) {
    return `Current schedule status: ${status}. Launch dates can move.`;
  }

  return "Launch dates can move, especially before final confirmation.";
}

/* ---------- HERO DEMO UPDATE ---------- */

function updateHeroDemo(launches) {
  if (!Array.isArray(launches) || launches.length === 0) return;

  const firstLaunch = launches[0];

  const nextLaunchCard = document.querySelector(".next-launch-card");
  const countdownCard = document.querySelector(".countdown-card");

  if (nextLaunchCard) {
    const strong = nextLaunchCard.querySelector("strong");
    const small = nextLaunchCard.querySelector("small");

    if (strong) {
      strong.textContent = getRocketName(firstLaunch);
    }

    if (small) {
      small.textContent = formatShortUkTime(firstLaunch.net) + " UK";
    }
  }

  if (countdownCard) {
    const strong = countdownCard.querySelector("strong");
    const small = countdownCard.querySelector("small");

    if (strong) {
      const countdownText = getCountdown(firstLaunch.net);

    strong.textContent =
  countdownText === "Launch window open" ? "Live now" : countdownText;
    }

    if (small) {
      small.textContent = "Updates automatically";
    }
  }
}

/* ---------- CARD TEMPLATE ---------- */

function createLaunchCard(launch, index) {
  const missionName = safeText(launch.name, "Unnamed launch");
  const provider = safeText(getProvider(launch));
  const rocket = safeText(getRocketName(launch));
  const statusName = getStatusName(launch);
  const statusClass = getStatusClass(statusName);
  const watchLabel = safeText(getWatchLabel(launch));
  const ukTime = safeText(formatUkDate(launch.net));
  const countdown = safeText(getCountdown(launch.net));
  const location = safeText(getLocation(launch));
  const padName = safeText(getPadName(launch));
  const missionType = safeText(getMissionType(launch));
  const description = safeText(getMissionDescription(launch));
  const scheduleNote = safeText(getScheduleNote(launch));
  const videoUrl = getVideoUrl(launch);
  const infoUrl = getInfoUrl(launch);

  const featuredClass = index === 0 ? " featured" : "";

  return `
    <article class="launch-card${featuredClass}">
      <div class="launch-card-top">
        <div>
          <span class="launch-provider">${provider}</span>
          <h3>${missionName}</h3>
        </div>

        <span class="status-pill ${statusClass}">${watchLabel}</span>
      </div>

      <div class="launch-info-grid">
        <div>
          <span>UK time</span>
          <strong>${ukTime}</strong>
        </div>

        <div>
          <span>Countdown</span>
          <strong>${countdown}</strong>
        </div>

        <div>
          <span>Location</span>
          <strong>${location}</strong>
        </div>

        <div>
          <span>Rocket</span>
          <strong>${rocket}</strong>
        </div>

        <div>
          <span>Mission</span>
          <strong>${missionType}</strong>
        </div>

        <div>
          <span>Launch pad</span>
          <strong>${padName}</strong>
        </div>
      </div>

      <p>${description}</p>

      <p class="schedule-note">
        ${scheduleNote}
      </p>

      <div class="launch-actions">
        ${
          videoUrl
            ? `<a href="${escapeHtml(videoUrl)}" class="launch-link" target="_blank" rel="noopener">Watch live ↗</a>`
            : `<span class="launch-muted">No live stream link yet</span>`
        }

        <span class="launch-muted">Details shown above</span>
        
      </div>
    </article>
  `;
}

/* ---------- LOADING / ERROR STATES ---------- */

function showLoading() {
  launchList.innerHTML = `
    <article class="launch-card featured">
      <div class="launch-card-top">
        <div>
          <span class="launch-provider">SpaceWatch</span>
          <h3>Loading upcoming launches...</h3>
        </div>
        <span class="status-pill blue">Fetching data</span>
      </div>

      <div class="launch-info-grid">
        <div>
          <span>UK time</span>
          <strong>Loading</strong>
        </div>
        <div>
          <span>Countdown</span>
          <strong>Loading</strong>
        </div>
        <div>
          <span>Location</span>
          <strong>Loading</strong>
        </div>
      </div>

      <p>
        SpaceWatch is checking the latest public global rocket launch schedule.
      </p>
    </article>
  `;

  lastUpdated.textContent = "Loading latest public launch schedule...";
}

function showEmpty() {
  launchList.innerHTML = `
    <article class="launch-card featured">
      <div class="launch-card-top">
        <div>
          <span class="launch-provider">SpaceWatch</span>
          <h3>No upcoming launches found</h3>
        </div>
        <span class="status-pill blue">Try again later</span>
      </div>

      <p>
        No upcoming launch data was returned at the moment. This may be temporary.
      </p>
    </article>
  `;

  lastUpdated.textContent = "No upcoming launches found.";
}

function showError(error) {
  console.error("SpaceWatch launch loading error:", error);

  launchList.innerHTML = `
    <article class="launch-card featured error-card">
      <div class="launch-card-top">
        <div>
          <span class="launch-provider">SpaceWatch</span>
          <h3>Launch schedule unavailable</h3>
        </div>
        <span class="status-pill red">Connection issue</span>
      </div>

      <p>
        SpaceWatch could not load the latest rocket launch schedule right now.
        This could be a temporary API or internet connection issue.
      </p>

      <p class="schedule-note">
        Try the Refresh button again in a moment.
      </p>
    </article>
  `;

  lastUpdated.textContent = "Launch schedule temporarily unavailable.";
}

/* ---------- MAIN DATA LOAD ---------- */

async function loadLaunches() {
  showLoading();

  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.textContent = "Refreshing...";
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Launch API returned ${response.status}`);
    }

    const data = await response.json();
    const rawLaunches = Array.isArray(data.results) ? data.results : [];

    const launches = rawLaunches.filter((launch) => {
  if (!launch.net) return true;

    const launchTime = new Date(launch.net).getTime();

  if (Number.isNaN(launchTime)) return true;

  return launchTime > Date.now() - 1000 * 60 * 30;
});

    if (!launches.length) {
      showEmpty();
      return;
    }

    updateHeroDemo(launches);

    launchList.innerHTML = launches
      .map((launch, index) => createLaunchCard(launch, index))
      .join("");

    const nowUk = new Date().toLocaleString("en-GB", {
      timeZone: "Europe/London",
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });

    lastUpdated.textContent =
      `Live schedule loaded: ${nowUk} UK. Launch dates can change.`;

  } catch (error) {
    showError(error);
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.textContent = "Refresh";
    }
  }
}

/* ---------- AUTO REFRESH COUNTDOWNS EVERY MINUTE ---------- */

let countdownRefreshTimer = null;

function startCountdownRefresh() {
  if (countdownRefreshTimer) {
    clearInterval(countdownRefreshTimer);
  }

  countdownRefreshTimer = setInterval(() => {
    loadLaunches();
  }, 1000 * 60 * 5);
}

/* ---------- BUTTON EVENTS ---------- */

if (refreshBtn) {
  refreshBtn.addEventListener("click", loadLaunches);
}

/* ---------- START APP ---------- */

loadLaunches();
startCountdownRefresh();