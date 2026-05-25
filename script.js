const screens = Array.from(document.querySelectorAll(".screen"));
const navButtons = Array.from(document.querySelectorAll("[data-target]"));
const tabButtons = Array.from(document.querySelectorAll(".tab-bar button"));
const musicToggle = document.querySelector(".music-toggle");
const musicSheet = document.querySelector(".music-sheet");
const nowPlaying = document.querySelector(".now-playing");
const songButtons = Array.from(document.querySelectorAll(".song"));
const musicFileInput = document.querySelector(".music-file");
const audioPlayer = document.querySelector(".audio-player");
const moodButtons = Array.from(document.querySelectorAll(".mood"));
const loveStartPicker = document.querySelector(".love-start-picker");
const loveStartButton = document.querySelector(".love-start-button");
const loveStartInput = document.querySelector(".love-start-input");
const loveStartDate = document.querySelector(".love-start-date");
const loveDays = document.querySelector(".love-days");
const anniversaryLabel = document.querySelector(".anniversary-label");
const anniversaryDays = document.querySelector(".anniversary-days");
const startDialog = document.querySelector(".start-dialog");
const startDialogClose = document.querySelector(".start-dialog-close");
const startDialogInput = document.querySelector(".start-dialog-input");
const startDialogSave = document.querySelector(".start-dialog-save");
const photoInput = document.querySelector(".photo-input");
const photoPreviewList = document.querySelector(".photo-preview-list");
const saveRecordButton = document.querySelector(".save-record");
const savePosterButton = document.querySelector(".save-poster");
const sharePosterButton = document.querySelector(".share-poster");
const reportTabButtons = Array.from(document.querySelectorAll("[data-report-mode]"));
const reportYear = document.querySelector(".year");
const reportTitle = document.querySelector(".report-content h2");
const reportRange = document.querySelector(".range");
const statsList = document.querySelector(".stats");
const posterYear = document.querySelector(".poster-copy > p");
const posterTitle = document.querySelector(".poster-copy h2");
const posterStatsList = document.querySelector(".poster-copy dl");
const timeline = document.querySelector(".timeline");
const archiveCount = document.querySelector(".archive-count");
const toast = document.querySelector(".toast");
const paperDate = document.querySelector(".paper-date strong");
const memoryDialog = document.querySelector(".memory-dialog");
const dialogClose = document.querySelector(".dialog-close");
const dialogGallery = document.querySelector(".dialog-gallery");
const dialogDots = document.querySelector(".dialog-dots");
const dialogPrev = document.querySelector(".dialog-prev");
const dialogNext = document.querySelector(".dialog-next");
const dialogDate = document.querySelector(".dialog-date");
const dialogEmoji = document.querySelector(".dialog-emoji");
const dialogText = document.querySelector(".dialog-text");
let isPlaying = false;
let selectedAudioUrl;
let currentDialogImageIndex = 0;
let lastCommittedLoveStartDate = "";
const STORAGE_KEY = "love-archive-records";
const MIGRATION_KEY = "love-archive-records-date-migrated";
const LOVE_START_KEY = "love-archive-start-date";
const DEFAULT_LOVE_START_DATE = "2024-08-17";
const BASE_ARCHIVE_COUNT = 148;
let uploadedPhotos = ["./coffee-clean.jpg"];
const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const REPORT_KEYWORDS = {
  meals: ["吃饭", "早餐", "午餐", "晚餐", "夜宵", "宵夜", "火锅", "烧烤", "烤肉", "奶茶", "咖啡", "冰美式", "餐厅", "做饭", "外卖", "甜品", "蛋糕"],
  chat: ["聊天", "电话", "视频", "语音", "晚安", "早安", "熬夜", "睡不着", "消息", "微信", "分享", "想你", "陪我聊"],
  meet: ["见面", "约会", "一起", "陪我", "来找我", "去找", "牵手", "拥抱", "看电影", "逛街", "散步", "日落", "旅行", "拍照"],
  fight: ["吵架", "生气", "冷战", "哭", "难过", "委屈", "不开心", "争吵", "闹别扭", "发脾气"],
  makeup: ["和好", "道歉", "哄", "原谅", "抱抱", "没事了", "不气了", "讲开", "复合"],
  surprise: ["惊喜", "礼物", "花", "玫瑰", "蛋糕", "纪念日", "红包", "准备了", "偷偷", "仪式感"]
};
const DEFAULT_RECORDS = [
  {
    id: "default-20260520",
    date: "2026 / 05 / 20",
    weekday: "周三",
    mood: "🥺",
    text: "“今天见面只有 2 小时，\n但还是开心。”",
    images: ["./coffee-clean.jpg"]
  },
  {
    id: "default-20260519",
    date: "2026 / 05 / 19",
    weekday: "周二",
    mood: "🥰",
    text: "一起去看了日落，\n真的好美好美。",
    images: ["./hero-home-lower.jpg"]
  },
  {
    id: "default-20260518",
    date: "2026 / 05 / 18",
    weekday: "周一",
    mood: "😭",
    text: "因为一点小事吵架了，\n但很快就和好了。",
    images: ["./poster-night-clean.jpg"]
  },
  {
    id: "default-20260517",
    date: "2026 / 05 / 17",
    weekday: "周日",
    mood: "🥹",
    text: "他做了我最爱的番茄炒蛋，\n幸福～",
    images: ["./food-clean.jpg"]
  }
];
let activeReportMode = "year";

function showScreen(id) {
  if (id === "record") {
    syncPaperDate();
  }
  if (id === "report" || id === "poster") {
    renderReport(activeReportMode);
  }

  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
    if (screen.id === id) {
      screen.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === id);
  });

  musicSheet.classList.remove("is-open");
  musicSheet.setAttribute("aria-hidden", "true");
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.target));
});

function commitLoveStartDate({ silent = false } = {}) {
  if (!loveStartInput.value) return;
  const nextValue = loveStartInput.value;
  const hasChanged = nextValue !== lastCommittedLoveStartDate;

  localStorage.setItem(LOVE_START_KEY, loveStartInput.value);
  renderLoveStartDate(loveStartInput.value);
  renderReport(activeReportMode);
  lastCommittedLoveStartDate = loveStartInput.value;

  if (!silent && hasChanged) {
    showToast("恋爱开始日已更新");
  }
}

function openLoveStartPicker() {
  startDialogInput.value = loveStartInput.value;
  startDialogInput.max = loveStartInput.max;
  if (!startDialog.open) {
    startDialog.showModal();
  }
  startDialog.classList.add("is-open");
  startDialogInput.focus({ preventScroll: true });
}

function closeLoveStartPicker() {
  startDialog.classList.remove("is-open");
  if (startDialog.open) {
    startDialog.close();
  }
}

function saveStartDialogDate() {
  if (!startDialogInput.value) return;
  loveStartInput.value = startDialogInput.value;
  commitLoveStartDate();
  closeLoveStartPicker();
}

loveStartPicker.addEventListener("click", (event) => {
  if (event.target === loveStartInput) return;
  openLoveStartPicker();
});

loveStartButton.addEventListener("click", (event) => {
  event.stopPropagation();
  openLoveStartPicker();
});

loveStartInput.addEventListener("input", () => commitLoveStartDate({ silent: true }));
loveStartInput.addEventListener("change", () => commitLoveStartDate());
startDialogSave.addEventListener("click", saveStartDialogDate);
startDialogClose.addEventListener("click", closeLoveStartPicker);
startDialog.addEventListener("click", (event) => {
  if (event.target === startDialog) {
    closeLoveStartPicker();
  }
});
startDialogInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveStartDialogDate();
  }
});

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function parseLocalDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatStartDate(value) {
  return String(value).replaceAll("-", ".");
}

function parseRecordDate(record) {
  if (record.createdAt) {
    const createdAt = new Date(record.createdAt);
    if (!Number.isNaN(createdAt.getTime())) {
      return createdAt;
    }
  }

  const match = String(record.date || "").match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) {
    return null;
  }
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function diffDays(fromDate, toDate) {
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.max(0, Math.floor((end - start) / 86_400_000));
}

function getNextAnniversary(startDate, today) {
  let years = today.getFullYear() - startDate.getFullYear();
  let anniversary = new Date(startDate.getFullYear() + years, startDate.getMonth(), startDate.getDate());
  if (anniversary <= today) {
    years += 1;
    anniversary = new Date(startDate.getFullYear() + years, startDate.getMonth(), startDate.getDate());
  }
  return {
    years,
    daysLeft: diffDays(today, anniversary)
  };
}

function animateLoveDays(value) {
  loveDays.classList.remove("has-settled");
  loveDays.textContent = value;
  loveDays.dataset.count = String(value);
  requestAnimationFrame(() => loveDays.classList.add("has-settled"));
}

function renderLoveStartDate(value) {
  const today = new Date();
  let startDate = parseLocalDate(value) || parseLocalDate(DEFAULT_LOVE_START_DATE);
  if (startDate > today) {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
  const normalizedValue = toDateInputValue(startDate);
  const days = diffDays(startDate, today);
  const anniversary = getNextAnniversary(startDate, today);

  loveStartInput.max = toDateInputValue(today);
  loveStartInput.value = normalizedValue;
  lastCommittedLoveStartDate = normalizedValue;
  loveStartDate.textContent = formatStartDate(normalizedValue);
  animateLoveDays(days);
  anniversaryLabel.textContent = `距离 ${anniversary.years} 周年`;
  anniversaryDays.textContent = anniversary.daysLeft === 0 ? "就是今天" : `还有 ${anniversary.daysLeft} 天`;
}

function initLoveStartDate() {
  const savedDate = localStorage.getItem(LOVE_START_KEY) || DEFAULT_LOVE_START_DATE;
  renderLoveStartDate(savedDate);
}

function isSameMonth(date, now = new Date()) {
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function isSameYear(date, now = new Date()) {
  return date.getFullYear() === now.getFullYear();
}

function hasAnyKeyword(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getReportRecords(mode) {
  const now = new Date();
  const startDate = parseLocalDate(localStorage.getItem(LOVE_START_KEY) || DEFAULT_LOVE_START_DATE);
  return getSavedRecords().filter((record) => {
    const date = parseRecordDate(record);
    if (!date) return false;
    if (startDate && date < startDate) return false;
    return mode === "month" ? isSameMonth(date, now) : isSameYear(date, now);
  });
}

function countRecordsByKeywords(records, keywords) {
  return records.filter((record) => hasAnyKeyword(record.text || "", keywords)).length;
}

function buildReport(mode = activeReportMode) {
  const now = new Date();
  const records = getReportRecords(mode);
  const totalRecords = records.length;
  const moods = records.map((record) => record.mood || "");
  const texts = records.map((record) => record.text || "");
  const moodTextPairs = records.map((record) => `${record.mood || ""} ${record.text || ""}`);

  const meals = countRecordsByKeywords(records, REPORT_KEYWORDS.meals);
  const chatKeywordCount = countRecordsByKeywords(records, REPORT_KEYWORDS.chat);
  const meet = countRecordsByKeywords(records, REPORT_KEYWORDS.meet);
  const fight = records.filter((record) => {
    const content = `${record.mood || ""} ${record.text || ""}`;
    return record.mood === "😡" || hasAnyKeyword(content, REPORT_KEYWORDS.fight);
  }).length;
  const makeup = countRecordsByKeywords(records, REPORT_KEYWORDS.makeup);
  const surprise = countRecordsByKeywords(records, REPORT_KEYWORDS.surprise);

  const cryingOrSoft = moodTextPairs.filter((content) => content.includes("😭") || content.includes("🥺") || content.includes("🥹")).length;
  const happy = moods.filter((mood) => mood === "🥰" || mood === "❤️").length;
  const uploadPhotos = records.reduce((sum, record) => sum + normalizeRecordImages(record).length, 0);
  const chat = chatKeywordCount;
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const range = mode === "month"
    ? `时间：${year}.${month}.01 - ${year}.${month}.${String(monthEnd).padStart(2, "0")}`
    : `时间：${year}.01.01 - ${year}.12.31`;

  return {
    year: mode === "month" ? month : year,
    title: mode === "month" ? `${Number(month)}月恋爱月报` : "我们的恋爱报告",
    range,
    records,
    stats: [
      ["utensils", "一起吃饭", meals, "次"],
      ["moon", "熬夜聊天", chat, "次"],
      ["calendar-heart", "见面", meet, "次"],
      ["heart-crack", "吵架", fight, "次"],
      ["heart-handshake", "和好", makeup, "次"],
      ["gift", "制造惊喜", surprise, "次"]
    ],
    posterStats: [
      ["一起吃饭", `${meals} 次`],
      ["熬夜聊天", `${chat} 次`],
      ["见面", `${meet} 次`],
      ["吵架", `${fight} 次`],
      ["和好", `${makeup} 次`]
    ],
    insight: totalRecords
      ? `共记录 ${totalRecords} 条真实瞬间，${uploadPhotos} 张照片，开心心情 ${happy} 次。`
      : "还没有真实记录，保存今天后报告会自动生成。"
  };
}

function renderPosterPreview(report) {
  posterYear.textContent = report.year;
  posterTitle.textContent = report.title;
  posterStatsList.innerHTML = report.posterStats
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("");
}

function getSavedRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function setSavedRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function migrateSavedRecords() {
  if (localStorage.getItem(MIGRATION_KEY)) {
    return;
  }

  const records = getSavedRecords();
  const today = formatRecordDate();
  let changed = false;
  const migrated = records.map((record) => {
    if (record.date !== "2026 / 05 / 24") {
      return record;
    }

    const createdAt = record.createdAt ? new Date(record.createdAt) : null;
    const replacementDate = createdAt && !Number.isNaN(createdAt.getTime())
      ? formatRecordDate(createdAt)
      : today;
    changed = true;
    return {
      ...record,
      ...replacementDate
    };
  });

  if (changed) {
    setSavedRecords(migrated);
  }
  localStorage.setItem(MIGRATION_KEY, "true");
}

function updateArchiveCount() {
  archiveCount.textContent = BASE_ARCHIVE_COUNT + getSavedRecords().length;
}

function formatRecordDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return {
    date: `${year} / ${month} / ${day}`,
    weekday: WEEKDAYS[date.getDay()]
  };
}

function syncPaperDate() {
  if (paperDate) {
    paperDate.textContent = formatRecordDate().date;
  }
}

function normalizeRecordImages(record) {
  return record.images?.length ? record.images : [record.image || "./coffee-clean.jpg"];
}

function appendMultilineText(element, text) {
  String(text).split("\n").forEach((line, index) => {
    if (index) {
      element.append(document.createElement("br"));
    }
    element.append(line);
  });
}

function getArchiveRecords() {
  const savedRecords = getSavedRecords()
    .slice()
    .reverse()
    .map((record) => ({ ...record, isSaved: true }));
  return [...savedRecords, ...DEFAULT_RECORDS];
}

function createMemoryCard(record) {
  const images = normalizeRecordImages(record);
  const article = document.createElement("article");
  article.className = `memory-card${record.isSaved ? " is-new" : ""}`;
  article.dataset.recordId = String(record.id);
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `查看 ${record.date} 的恋爱瞬间`);

  const time = document.createElement("time");
  time.textContent = `${record.date}　${record.weekday || ""}`.trim();

  const emoji = document.createElement("p");
  emoji.className = "emoji";
  emoji.textContent = record.mood || "❤️";

  const text = document.createElement("p");
  appendMultilineText(text, record.text || "今天也想把爱存下来。");

  const image = document.createElement("img");
  image.alt = "恋爱瞬间照片";
  image.src = images[0];

  article.append(time, emoji, text, image);

  if (images.length > 1) {
    const photoCount = document.createElement("span");
    photoCount.className = "photo-count";
    photoCount.textContent = `+${images.length - 1}`;
    article.append(photoCount);
  }

  return article;
}

function renderArchive() {
  timeline.innerHTML = "";
  getArchiveRecords().forEach((record) => timeline.append(createMemoryCard(record)));
  updateArchiveCount();
}

function saveTodayRecord() {
  const { date, weekday } = formatRecordDate();
  const record = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    date,
    weekday,
    mood: document.querySelector(".mood.is-selected")?.textContent.trim() || "❤️",
    text: document.querySelector("textarea").value.trim() || "今天也想把爱存下来。",
    images: uploadedPhotos.length ? uploadedPhotos : ["./coffee-clean.jpg"]
  };
  const records = getSavedRecords();
  records.push(record);
  setSavedRecords(records);
  renderArchive();
  renderReport(activeReportMode);
  showScreen("archive");
  showToast("已永久存档，档案馆 +1");
}

function openMemoryDialog(record) {
  const images = normalizeRecordImages(record);
  currentDialogImageIndex = 0;
  dialogGallery.innerHTML = "";
  images.forEach((src, index) => {
    const image = document.createElement("img");
    image.alt = `恋爱瞬间照片 ${index + 1}`;
    image.src = src;
    dialogGallery.append(image);
  });

  dialogDots.innerHTML = "";
  images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.dataset.index = String(index);
    dot.setAttribute("aria-label", `查看第 ${index + 1} 张照片`);
    dot.className = index === 0 ? "is-active" : "";
    dot.addEventListener("click", () => setDialogImage(index));
    dialogDots.append(dot);
  });
  const hasMultipleImages = images.length > 1;
  dialogDots.hidden = !hasMultipleImages;
  dialogPrev.hidden = !hasMultipleImages;
  dialogNext.hidden = !hasMultipleImages;

  dialogDate.textContent = `${record.date}　${record.weekday || ""}`.trim();
  dialogEmoji.textContent = record.mood || "❤️";
  dialogText.textContent = record.text || "今天也想把爱存下来。";

  if (!memoryDialog.open) {
    memoryDialog.showModal();
  }
  memoryDialog.classList.add("is-open");
  requestAnimationFrame(() => setDialogImage(0, "auto"));
}

function closeMemoryDialog() {
  memoryDialog.classList.remove("is-open");
  if (memoryDialog.open) {
    memoryDialog.close();
  }
}

function findRecordById(id) {
  return getArchiveRecords().find((record) => String(record.id) === String(id));
}

function updateDialogDots() {
  const width = dialogGallery.clientWidth || 1;
  const index = Math.round(dialogGallery.scrollLeft / width);
  markDialogImage(index);
}

function markDialogImage(index) {
  currentDialogImageIndex = index;
  Array.from(dialogDots.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
    dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
  });
}

function setDialogImage(index, behavior = "smooth") {
  const count = dialogGallery.children.length;
  if (!count) return;

  const nextIndex = (index + count) % count;
  const left = dialogGallery.clientWidth * nextIndex;
  currentDialogImageIndex = nextIndex;
  dialogGallery.scrollTo({
    left,
    behavior
  });
  markDialogImage(nextIndex);

  window.setTimeout(() => {
    if (Math.abs(dialogGallery.scrollLeft - left) > 2) {
      dialogGallery.scrollLeft = left;
    }
    markDialogImage(nextIndex);
  }, behavior === "smooth" ? 320 : 0);
}

function handleDialogDotSwitch(event) {
  const dot = event.target.closest("button[data-index]");
  if (!dot) return;

  event.preventDefault();
  event.stopPropagation();
  setDialogImage(Number(dot.dataset.index), "auto");
}

function renderPhotoPreviews() {
  photoPreviewList.innerHTML = uploadedPhotos
    .map((src, index) => `
      <figure class="upload-card" data-photo-index="${index}">
        <img alt="上传照片 ${index + 1}" src="${src}" />
        <button class="remove-photo" type="button" aria-label="移除图片">×</button>
        <figcaption>${index === 0 ? "LOS ANGELES" : "LOVE ARCHIVE"} · ${String(23 + index).padStart(2, "0")}:14 PM</figcaption>
      </figure>
    `)
    .join("");
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function shrinkImage(dataUrl) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const maxWidth = 900;
  const scale = Math.min(1, maxWidth / image.width);
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

photoInput.addEventListener("change", async () => {
  const files = Array.from(photoInput.files || []).filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  const photos = await Promise.all(files.map(async (file) => shrinkImage(await readImageAsDataUrl(file))));
  uploadedPhotos = [...uploadedPhotos, ...photos].slice(0, 9);
  renderPhotoPreviews();
  showToast(`已上传 ${photos.length} 张照片`);
  photoInput.value = "";
});

photoPreviewList.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-photo");
  if (!button) return;
  const card = button.closest(".upload-card");
  const index = Number(card.dataset.photoIndex);
  uploadedPhotos.splice(index, 1);
  if (!uploadedPhotos.length) {
    uploadedPhotos = ["./coffee-clean.jpg"];
  }
  renderPhotoPreviews();
});

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = text.split("\n");
  let currentY = y;

  lines.forEach((line) => {
    let current = "";
    Array.from(line).forEach((char) => {
      const test = current + char;
      if (ctx.measureText(test).width > maxWidth && current) {
        ctx.fillText(current, x, currentY);
        current = char;
        currentY += lineHeight;
      } else {
        current = test;
      }
    });
    ctx.fillText(current, x, currentY);
    currentY += lineHeight;
  });

  return currentY;
}

async function createPosterBlob() {
  const report = buildReport(activeReportMode);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  const image = await loadImage("./poster-night-clean.jpg");
  const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  ctx.drawImage(image, x, y, width, height);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.14)");
  gradient.addColorStop(0.45, "rgba(0, 0, 0, 0.26)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.78)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f8f1e7";
  ctx.font = "42px Georgia, serif";
  ctx.fillText(report.year, 96, 156);
  ctx.font = "44px Microsoft YaHei, sans-serif";
  ctx.fillText(report.title, 96, 218);
  ctx.font = "52px KaiTi, serif";
  drawWrappedText(ctx, "“爱不会消失，\n它只是被记录了下来。”", 96, 388, 820, 82);

  ctx.font = "30px Microsoft YaHei, sans-serif";
  report.stats.forEach(([, label, value, unit], index) => {
    const rowY = 830 + index * 64;
    ctx.fillStyle = "rgba(248, 241, 231, 0.78)";
    ctx.fillText(label, 106, rowY);
    ctx.fillStyle = "#fff8ef";
    ctx.fillText(`${value} ${unit}`, 360, rowY);
  });

  ctx.font = "42px Segoe Script, cursive";
  ctx.fillText("Love Archive.", 382, 1680);
  ctx.font = "24px Georgia, serif";
  ctx.fillStyle = "rgba(248, 241, 231, 0.72)";
  ctx.fillText(report.range.replace("时间：", "").replaceAll(".", " / "), 300, 1738);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png", 0.94));
}

async function savePosterImage() {
  savePosterButton.disabled = true;
  savePosterButton.innerHTML = '<i data-lucide="download"></i>生成中...';
  window.lucide?.createIcons();
  try {
    const blob = await createPosterBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "love-archive-poster.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("海报已保存为 PNG");
  } catch {
    showToast("保存失败，请再点一次");
  } finally {
    savePosterButton.disabled = false;
    savePosterButton.innerHTML = '<i data-lucide="download"></i>保存图片';
    window.lucide?.createIcons();
  }
}

async function sharePoster() {
  if (navigator.share) {
    try {
      await navigator.share({ title: "我们的恋爱报告", text: "爱不会消失，它只是被记录了下来。" });
      showToast("已打开分享面板");
    } catch {
      showToast("已取消分享");
    }
  } else {
    await navigator.clipboard?.writeText("我们的恋爱报告：爱不会消失，它只是被记录了下来。");
    showToast("分享文案已复制");
  }
}

function setSong(name) {
  songButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.song === name);
  });
  nowPlaying.querySelector("span").textContent = `深夜恋爱歌单 · ${name}`;
  nowPlaying.classList.add("is-visible");
}

musicToggle.addEventListener("click", async () => {
  if (!audioPlayer.src) {
    musicSheet.classList.toggle("is-open");
    musicSheet.setAttribute("aria-hidden", String(!musicSheet.classList.contains("is-open")));
    showToast("先上传 MP3 / M4A / WAV 音乐");
    return;
  }

  isPlaying = audioPlayer.paused;
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicSheet.classList.toggle("is-open");
  musicSheet.setAttribute("aria-hidden", String(!musicSheet.classList.contains("is-open")));
  nowPlaying.classList.toggle("is-visible", isPlaying);

  if (isPlaying) {
    await audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

songButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setSong(button.dataset.song);
  });
});

musicFileInput.addEventListener("change", () => {
  const file = musicFileInput.files?.[0];
  if (!file) return;
  if (file.name.toLowerCase().endsWith(".ncm")) {
    showToast("NCM 不能直接播放，请先转成 MP3/M4A/WAV");
    musicFileInput.value = "";
    return;
  }
  if (selectedAudioUrl) {
    URL.revokeObjectURL(selectedAudioUrl);
  }
  selectedAudioUrl = URL.createObjectURL(file);
  audioPlayer.src = selectedAudioUrl;
  audioPlayer.loop = true;
  setSong(file.name.replace(/\.[^.]+$/, ""));
  showToast("音乐已上传，点右上角播放");
});

audioPlayer.addEventListener("pause", () => {
  isPlaying = false;
  musicToggle.classList.remove("is-playing");
  musicToggle.setAttribute("aria-pressed", "false");
});

audioPlayer.addEventListener("play", () => {
  isPlaying = true;
  musicToggle.classList.add("is-playing");
  musicToggle.setAttribute("aria-pressed", "true");
  nowPlaying.classList.add("is-visible");
});

function renderReport(mode = activeReportMode) {
  activeReportMode = mode;
  const report = buildReport(mode);
  reportTabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.reportMode === mode);
  });
  reportYear.textContent = report.year;
  reportTitle.innerHTML = `${report.title} <span>♥</span>`;
  reportRange.textContent = report.range;
  statsList.innerHTML = report.stats
    .map(([icon, label, value, unit]) => `
      <div><dt><i data-lucide="${icon}"></i>${label}</dt><dd>${value} <small>${unit}</small></dd></div>
    `)
    .join("");
  renderPosterPreview(report);
  window.lucide?.createIcons();
}

reportTabButtons.forEach((button) => {
  button.addEventListener("click", () => renderReport(button.dataset.reportMode));
});

timeline.addEventListener("click", (event) => {
  const card = event.target.closest(".memory-card");
  if (!card) return;
  const record = findRecordById(card.dataset.recordId);
  if (record) {
    openMemoryDialog(record);
  }
});

timeline.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".memory-card");
  if (!card) return;
  event.preventDefault();
  const record = findRecordById(card.dataset.recordId);
  if (record) {
    openMemoryDialog(record);
  }
});

dialogGallery.addEventListener("scroll", updateDialogDots, { passive: true });
dialogDots.addEventListener("pointerdown", handleDialogDotSwitch);
dialogDots.addEventListener("click", handleDialogDotSwitch);
dialogPrev.addEventListener("click", () => setDialogImage(currentDialogImageIndex - 1));
dialogNext.addEventListener("click", () => setDialogImage(currentDialogImageIndex + 1));
dialogClose.addEventListener("click", closeMemoryDialog);
memoryDialog.addEventListener("click", (event) => {
  if (event.target === memoryDialog) {
    closeMemoryDialog();
  }
});
memoryDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    setDialogImage(currentDialogImageIndex - 1);
  }
  if (event.key === "ArrowRight") {
    setDialogImage(currentDialogImageIndex + 1);
  }
});
memoryDialog.addEventListener("close", () => memoryDialog.classList.remove("is-open"));

saveRecordButton.addEventListener("click", saveTodayRecord);
savePosterButton.addEventListener("click", savePosterImage);
sharePosterButton.addEventListener("click", sharePoster);
initLoveStartDate();
syncPaperDate();
migrateSavedRecords();
renderPhotoPreviews();
renderArchive();
renderReport(activeReportMode);

if (window.lucide) {
  window.lucide.createIcons();
}
