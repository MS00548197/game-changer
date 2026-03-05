const storageKey = "gameChangerDaily";

const targets = {
  water: 5,
  exercise: 30,
  steps: 10000,
  sleep: 8,
};

const fields = {
  goalType: document.getElementById("goalType"),
  clientName: document.getElementById("clientName"),
  mobileNumber: document.getElementById("mobileNumber"),
  height: document.getElementById("height"),
  weight: document.getElementById("weight"),
  bmiValue: document.getElementById("bmiValue"),
  idealRange: document.getElementById("idealRange"),
  targetPlan: document.getElementById("targetPlan"),
  water: document.getElementById("water"),
  exercise: document.getElementById("exercise"),
  steps: document.getElementById("steps"),
  sleep: document.getElementById("sleep"),
  shakeTaken: document.getElementById("shakeTaken"),
  notes: document.getElementById("notes"),
  saveBtn: document.getElementById("saveBtn"),
  dailyScore: document.getElementById("dailyScore"),
  dailyStatus: document.getElementById("dailyStatus"),
  waterValue: document.getElementById("waterValue"),
  exerciseValue: document.getElementById("exerciseValue"),
  stepsValue: document.getElementById("stepsValue"),
  sleepValue: document.getElementById("sleepValue"),
  waterProgress: document.getElementById("waterProgress"),
  exerciseProgress: document.getElementById("exerciseProgress"),
  stepsProgress: document.getElementById("stepsProgress"),
  sleepProgress: document.getElementById("sleepProgress"),
  historyList: document.getElementById("historyList"),
  weeklySummary: document.getElementById("weeklySummary"),
  monthlySummary: document.getElementById("monthlySummary"),
  tabButtons: [...document.querySelectorAll(".tab-btn")],
  tabPanels: [...document.querySelectorAll(".tab-panel")],
};

let state = {
  profile: {
    clientName: "",
    mobileNumber: "",
  },
  lastDaily: {},
  entries: {},
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function calculateScoreFromData(data) {
  const waterPct = Math.min((Number(data.water) || 0) / targets.water, 1);
  const exercisePct = Math.min((Number(data.exercise) || 0) / targets.exercise, 1);
  const stepsPct = Math.min((Number(data.steps) || 0) / targets.steps, 1);
  const sleepPct = Math.min((Number(data.sleep) || 0) / targets.sleep, 1);
  const shakePct = data.shakeTaken ? 1 : 0;
  return Math.round(((waterPct + exercisePct + stepsPct + sleepPct + shakePct) / 5) * 100);
}

function calculateScore() {
  return calculateScoreFromData({
    water: fields.water.value,
    exercise: fields.exercise.value,
    steps: fields.steps.value,
    sleep: fields.sleep.value,
    shakeTaken: fields.shakeTaken.checked,
  });
}

function updateStatus(score) {
  fields.dailyScore.textContent = `${score}%`;
  fields.dailyStatus.classList.remove("on", "almost", "needs");
  if (score >= 80) {
    fields.dailyStatus.textContent = "On Track";
    fields.dailyStatus.classList.add("on");
  } else if (score >= 50) {
    fields.dailyStatus.textContent = "Almost There";
    fields.dailyStatus.classList.add("almost");
  } else {
    fields.dailyStatus.textContent = "Needs Attention";
    fields.dailyStatus.classList.add("needs");
  }
}

function calculateBodyMetrics() {
  const heightCm = Number(fields.height.value);
  const weightKg = Number(fields.weight.value);
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    fields.bmiValue.textContent = "--";
    fields.idealRange.textContent = "--";
    fields.targetPlan.textContent = "Enter height and weight to see target weight gain/loss.";
    return;
  }

  const h2 = (heightCm / 100) ** 2;
  const bmi = weightKg / h2;
  const idealMin = 18.5 * h2;
  const idealMax = 24.9 * h2;
  fields.bmiValue.textContent = bmi.toFixed(1);
  fields.idealRange.textContent = `${idealMin.toFixed(1)}kg - ${idealMax.toFixed(1)}kg`;

  if (fields.goalType.value === "loss") {
    fields.targetPlan.textContent =
      weightKg > idealMax
        ? `Target loss: ${(weightKg - idealMax).toFixed(1)}kg to reach ${idealMax.toFixed(1)}kg.`
        : "You are in/near ideal range. Focus on consistency and body composition.";
  } else {
    fields.targetPlan.textContent =
      weightKg < idealMin
        ? `Target gain: ${(idealMin - weightKg).toFixed(1)}kg to reach ${idealMin.toFixed(1)}kg.`
        : "You are in/near ideal range. Focus on lean-muscle gain and recovery.";
  }
}

function updateView() {
  const water = Number(fields.water.value);
  const exercise = Number(fields.exercise.value);
  const steps = Number(fields.steps.value);
  const sleep = Number(fields.sleep.value);

  fields.waterValue.textContent = `${water} / ${targets.water}L`;
  fields.exerciseValue.textContent = `${exercise} / ${targets.exercise} min`;
  fields.stepsValue.textContent = `${steps.toLocaleString()} / ${targets.steps.toLocaleString()}`;
  fields.sleepValue.textContent = `${sleep} / ${targets.sleep} hr`;

  fields.waterProgress.style.width = `${Math.min((water / targets.water) * 100, 100)}%`;
  fields.exerciseProgress.style.width = `${Math.min((exercise / targets.exercise) * 100, 100)}%`;
  fields.stepsProgress.style.width = `${Math.min((steps / targets.steps) * 100, 100)}%`;
  fields.sleepProgress.style.width = `${Math.min((sleep / targets.sleep) * 100, 100)}%`;

  calculateBodyMetrics();
  updateStatus(calculateScore());
}

function renderHistoryAndReports() {
  const items = Object.values(state.entries).sort((a, b) => (a.date < b.date ? 1 : -1));

  if (!items.length) {
    fields.historyList.innerHTML = "<li>No saved check-ins yet.</li>";
    fields.weeklySummary.textContent = "No entries yet.";
    fields.monthlySummary.textContent = "No entries yet.";
    return;
  }

  fields.historyList.innerHTML = items
    .slice(0, 20)
    .map((entry) => {
      const score = calculateScoreFromData(entry);
      return `<li><strong>${entry.date}</strong> — Score ${score}%, Wt ${entry.weight || "-"}kg, Water ${entry.water}L, Ex ${entry.exercise}m, Steps ${entry.steps}, Sleep ${entry.sleep}h</li>`;
    })
    .join("");

  const now = new Date();
  const weekCutoff = new Date(now);
  weekCutoff.setDate(now.getDate() - 7);
  const monthCutoff = new Date(now);
  monthCutoff.setDate(now.getDate() - 30);

  const weekly = items.filter((e) => new Date(e.date) >= weekCutoff);
  const monthly = items.filter((e) => new Date(e.date) >= monthCutoff);

  fields.weeklySummary.textContent = buildReportText(weekly, "7-day");
  fields.monthlySummary.textContent = buildReportText(monthly, "30-day");
}

function buildReportText(entries, label) {
  if (!entries.length) return `No ${label} entries yet.`;
  const avg = (key) => (entries.reduce((s, e) => s + (Number(e[key]) || 0), 0) / entries.length).toFixed(1);
  const avgScore = (entries.reduce((s, e) => s + calculateScoreFromData(e), 0) / entries.length).toFixed(0);
  return `${entries.length} entries • Avg score ${avgScore}% • Water ${avg("water")}L • Exercise ${avg("exercise")} min • Steps ${avg("steps")} • Sleep ${avg("sleep")} hr`;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function saveData() {
  const today = getTodayKey();
  const daily = {
    date: today,
    goalType: fields.goalType.value,
    height: Number(fields.height.value) || 0,
    weight: Number(fields.weight.value) || 0,
    water: Number(fields.water.value) || 0,
    exercise: Number(fields.exercise.value) || 0,
    steps: Number(fields.steps.value) || 0,
    sleep: Number(fields.sleep.value) || 0,
    shakeTaken: fields.shakeTaken.checked,
    notes: fields.notes.value,
  };

  state.profile.clientName = fields.clientName.value.trim();
  state.profile.mobileNumber = fields.mobileNumber.value.trim();
  state.lastDaily = daily;
  state.entries[today] = daily;

  saveState();
  renderHistoryAndReports();

  fields.saveBtn.textContent = "Saved ✓";
  setTimeout(() => {
    fields.saveBtn.textContent = "Save Today's Progress";
  }, 1200);
}

function loadData() {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state = {
          profile: parsed.profile || { clientName: "", mobileNumber: "" },
          lastDaily: parsed.lastDaily || {},
          entries: parsed.entries || {},
        };
      }
    } catch (_e) {
      state = { profile: { clientName: "", mobileNumber: "" }, lastDaily: {}, entries: {} };
    }
  }

  fields.clientName.value = state.profile.clientName || "";
  fields.mobileNumber.value = state.profile.mobileNumber || "";

  const d = state.lastDaily || {};
  fields.goalType.value = d.goalType ?? "loss";
  fields.height.value = d.height || "";
  fields.weight.value = d.weight || "";
  fields.water.value = d.water ?? 0;
  fields.exercise.value = d.exercise ?? 0;
  fields.steps.value = d.steps ?? 0;
  fields.sleep.value = d.sleep ?? 0;
  fields.shakeTaken.checked = Boolean(d.shakeTaken);
  fields.notes.value = d.notes ?? "";

  updateView();
  renderHistoryAndReports();
}

function setupTabs() {
  fields.tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      fields.tabButtons.forEach((b) => b.classList.remove("active"));
      fields.tabPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

[
  fields.goalType,
  fields.height,
  fields.weight,
  fields.water,
  fields.exercise,
  fields.steps,
  fields.sleep,
  fields.shakeTaken,
].forEach((el) => {
  el.addEventListener("input", updateView);
  el.addEventListener("change", updateView);
});

fields.saveBtn.addEventListener("click", saveData);
setupTabs();
loadData();
