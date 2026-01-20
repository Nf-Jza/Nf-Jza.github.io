
let backend = null;

new QWebChannel(qt.webChannelTransport, channel => {
  backend = channel.objects.backend;
  init();
});

let config = {
  isRunning: false,
  lot: 0.01,
  bias: 0
};

const CONFIG_PATH = "control.json";

const LOT_MIN = 0.01;
const LOT_STEP = 0.01;

/* ===== Light Theme Colors ===== */
const tradeStatusStyleStart = "color:#ffffff;background-color:#2563eb;";
const tradeStatusStyleStop  = "color:#ffffff;background-color:#dc2626;";

const activeBiasStyle   = "background:#a8b0ff;color:#92400e;";
const inactiveBiasStyle = "background:#f1f5f9;color:#64748b;";

/* ===== Elements ===== */
const lotInput = document.getElementById("lot");
const tradeStatusButton = document.getElementById("tradeStatusBtn");
const biasBtnBuy = document.getElementById("buyBiasBtn");
const biasBtnNeutral = document.getElementById("neutralBiasBtn");
const biasBtnSell = document.getElementById("sellBiasBtn");
const lotButtons = document.querySelectorAll(".lot-buttons button");

function loadConfig() {
  backend.loadConfig(function (json) {
    const data = JSON.parse(json);
    config = { ...config, ...data };
    applyConfigToUI();
  });
}
function writeConfig() {
  backend.saveConfig(JSON.stringify(config));
}

function applyConfigToUI() {
  lotInput.value = config.lot;

  tradeStatusButton.textContent = config.isRunning ? "STOP🫷" : "START📈";
  tradeStatusButton.style = config.isRunning
    ? tradeStatusStyleStop
    : tradeStatusStyleStart;

  lotButtons.forEach(btn => btn.disabled = config.isRunning);

  tradeBias(config.bias);
}

function changeLot(delta) {
  let current = parseFloat(lotInput.value) || config.lot;

  if (delta === 0) {
    current = LOT_MIN;
  } else {
    current += delta;
  }

  if (current < LOT_MIN) current = LOT_MIN;

  current = parseFloat(current.toFixed(2));
  config.lot = current;
  lotInput.value = current;

  writeConfig();
}

function changeTradeStatus() {
  config.isRunning = !config.isRunning;

  tradeStatusButton.textContent = config.isRunning ? "STOP🫷" : "START📈";
  tradeStatusButton.style = config.isRunning
    ? tradeStatusStyleStop
    : tradeStatusStyleStart;

  lotButtons.forEach(btn => btn.disabled = config.isRunning);

  writeConfig();
}

function tradeBias(bias) {
  config.bias = bias;

  biasBtnBuy.style     = bias === 1  ? activeBiasStyle : inactiveBiasStyle;
  biasBtnNeutral.style = bias === 0  ? activeBiasStyle : inactiveBiasStyle;
  biasBtnSell.style    = bias === -1 ? activeBiasStyle : inactiveBiasStyle;

  writeConfig();
}

function init() {
  loadConfig();
}

function SecondPanel(){
  const panel1 = document.querySelector(".panel1");
  if (panel1.classList.contains("hidden")) {
    panel1.classList.remove("hidden");
    return;
  } else {
    panel1.classList.add("hidden");
    return;
  }
}
function minimizeApp() {  backend.minimizeApp();}
function confirmActionCloseApp() {
  const overlay = document.getElementById("confirm-overlay");
  overlay.classList.remove("hidden");

  document.getElementById("confirm-yes").onclick = () => {
    overlay.classList.add("hidden");
    backend.closeApp();
  };

  document.getElementById("confirm-no").onclick = () => {
    overlay.classList.add("hidden");
  };
}