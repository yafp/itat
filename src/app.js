"use strict";

const SAVE_KEY = "itat-save-v1";
const HIGHSCORES_KEY = "itat-highscores-v1";

const ASSETS = [
  { id: "laptop", name: "Laptop", category: "PC", basePrice: 600, minPrice: 150, maxPrice: 1800 },
  { id: "desktop", name: "Desktop", category: "PC", basePrice: 900, minPrice: 225, maxPrice: 2700 },
  { id: "server", name: "Server", category: "PC", basePrice: 2500, minPrice: 625, maxPrice: 7500 },
  { id: "storage", name: "Storage / NAS", category: "PC", basePrice: 350, minPrice: 88, maxPrice: 1050 },
  { id: "ram", name: "RAM", category: "Component", basePrice: 80, minPrice: 20, maxPrice: 240 },
  { id: "ssd", name: "SSD", category: "Component", basePrice: 120, minPrice: 30, maxPrice: 360 },
  { id: "gpu", name: "GPU", category: "Component", basePrice: 450, minPrice: 112, maxPrice: 1350 },
  { id: "yubikey", name: "YubiKey", category: "Peripheral", basePrice: 60, minPrice: 15, maxPrice: 180 },
  { id: "headset", name: "Headset", category: "Peripheral", basePrice: 80, minPrice: 20, maxPrice: 240 },
  { id: "keyboard-mouse", name: "Keyboard & Mouse", category: "Peripheral", basePrice: 50, minPrice: 12, maxPrice: 150 },
  { id: "windows-license", name: "Windows license", category: "License", basePrice: 100, minPrice: 25, maxPrice: 300 },
  { id: "defender-license", name: "Defender license", category: "License", basePrice: 40, minPrice: 10, maxPrice: 120 },
  { id: "iphone", name: "iPhone", category: "Mobile", basePrice: 700, minPrice: 175, maxPrice: 2100 },
  { id: "samsung-phone", name: "Samsung phone", category: "Mobile", basePrice: 500, minPrice: 125, maxPrice: 1500 },
  { id: "ipad", name: "iPad", category: "Mobile", basePrice: 600, minPrice: 150, maxPrice: 1800 },
  { id: "monitor", name: "Monitor", category: "Peripheral", basePrice: 250, minPrice: 62, maxPrice: 750 }
];

const LOCATIONS = [
  { id: "student-dorm", name: "Student dorm", minModifier: 0.80, maxModifier: 1.20,
    profile: "Students pay more for laptops, phones and peripherals. Strong demand helps sellers, but raises buying costs.",
    categoryPriceModifiers: { Mobile: 1.15, Peripheral: 1.10 }, assetPriceModifiers: { laptop: 1.15 },
    assets: ["laptop", "desktop", "ram", "ssd", "gpu", "yubikey", "headset", "keyboard-mouse", "windows-license", "defender-license", "iphone", "samsung-phone", "monitor"] },
  { id: "campus", name: "Campus", minModifier: 0.90, maxModifier: 1.25,
    profile: "Home-office gear is in demand: laptops, monitors, headsets and keyboard sets typically cost more.",
    assetPriceModifiers: { laptop: 1.15, monitor: 1.20, headset: 1.10, "keyboard-mouse": 1.15 },
    assets: ["laptop", "desktop", "server", "storage", "ram", "ssd", "gpu", "headset", "keyboard-mouse", "windows-license", "iphone", "ipad", "monitor"] },
  { id: "refurbisher", name: "Refurbisher", minModifier: 0.70, maxModifier: 1.10,
    profile: "A source of cheaper used PCs, especially servers and storage. Lower prices help buyers but reduce sale proceeds.",
    categoryPriceModifiers: { PC: 0.90 }, assetPriceModifiers: { server: 0.90, storage: 0.85 },
    assets: ["laptop", "desktop", "server", "storage", "ram", "ssd", "gpu", "yubikey", "defender-license", "iphone", "samsung-phone", "ipad", "monitor"] },
  { id: "shady-reseller", name: "Shady IT reseller", minModifier: 0.60, maxModifier: 1.50,
    profile: "A volatile mix of hardware and licenses. Bargains and expensive offers can appear side by side.",
    assets: ["laptop", "desktop", "storage", "ram", "ssd", "gpu", "yubikey", "headset", "keyboard-mouse", "windows-license", "defender-license", "samsung-phone", "monitor"] },
  { id: "data-center", name: "Data center", minModifier: 0.85, maxModifier: 1.40,
    profile: "Servers, storage and components command a premium. Consumer devices have lower demand and limited availability.",
    categoryPriceModifiers: { Component: 1.10 }, assetPriceModifiers: { server: 1.25, storage: 1.20 },
    assets: ["server", "storage", "desktop", "ram", "ssd", "gpu", "windows-license", "defender-license"] },
  { id: "government-auction", name: "Government auction", minModifier: 0.65, maxModifier: 1.30,
    profile: "Surplus PCs and monitors are typically cheaper. Availability stays fixed; auctions do not require bulk purchases.",
    categoryPriceModifiers: { PC: 0.85 }, assetPriceModifiers: { monitor: 0.85 },
    assets: ["server", "storage", "desktop", "laptop", "ram", "ssd", "gpu", "yubikey", "headset", "keyboard-mouse", "windows-license", "defender-license", "monitor"] }
];

const EVENTS = [
  { id: "windows-10-ended", name: "Windows 10 support ended", description: "PC and component demand is rising.", weight: 9, duration: 2, assetIds: ["laptop", "desktop", "server", "ram", "ssd", "gpu"], minModifier: 1.10, maxModifier: 1.25 },
  { id: "corporate-refresh", name: "Corporate hardware refresh", description: "Used business hardware floods the market.", weight: 10, duration: 2, assetIds: ["laptop", "desktop", "server", "storage"], minModifier: 0.70, maxModifier: 0.85 },
  { id: "critical-vulnerability", name: "Critical vulnerability discovered", description: "Security hardware and licenses are in demand.", weight: 8, duration: 3, assetIds: ["yubikey", "windows-license", "defender-license"], minModifier: 1.20, maxModifier: 1.50 },
  { id: "license-audits", name: "Microsoft license audits", description: "Software license demand increases.", weight: 8, duration: 2, assetIds: ["windows-license", "defender-license"], minModifier: 1.20, maxModifier: 1.40 },
  { id: "semiconductor-shortage", name: "Semiconductor shortage", description: "Storage and component supply becomes scarce.", weight: 7, duration: 3, assetIds: ["ram", "ssd", "gpu", "storage"], minModifier: 1.25, maxModifier: 1.50 },
  { id: "back-to-school", name: "Back-to-school demand", description: "Portable devices are selling quickly.", weight: 8, duration: 2, assetIds: ["laptop", "iphone", "samsung-phone", "ipad"], minModifier: 1.15, maxModifier: 1.30 },
  { id: "government-recycling", name: "Government recycling sale", description: "Public-sector assets enter the market cheaply.", weight: 7, duration: 2, assetIds: ["laptop", "desktop", "server", "storage", "ram", "ssd", "gpu"], minModifier: 0.65, maxModifier: 0.90 },
  { id: "datacenter-decommission", name: "Data-center decommission", description: "Large used infrastructure is being liquidated.", weight: 7, duration: 3, assetIds: ["server", "storage", "desktop", "ram", "ssd", "gpu"], minModifier: 0.70, maxModifier: 0.85 },
  { id: "crypto-mining-boom", name: "Crypto mining boom", description: "GPUs suddenly become extremely desirable.", weight: 5, duration: 2, assetIds: ["gpu"], minModifier: 1.35, maxModifier: 1.50 },
  { id: "crypto-market-crash", name: "Crypto market crash", description: "Miners dump used GPUs onto the market.", weight: 5, duration: 2, assetIds: ["gpu"], minModifier: 0.60, maxModifier: 0.75 },
  { id: "ssd-price-war", name: "SSD price war", description: "Manufacturers aggressively cut storage prices.", weight: 5, duration: 2, assetIds: ["ssd", "storage"], minModifier: 0.65, maxModifier: 0.80 },
  { id: "ram-factory-fire", name: "RAM factory fire", description: "Supply disruption sends memory prices soaring.", weight: 5, duration: 3, assetIds: ["ram"], minModifier: 1.35, maxModifier: 1.50 },
  { id: "major-cloud-outage", name: "Major cloud outage", description: "Companies panic-buy on-premises infrastructure.", weight: 5, duration: 2, assetIds: ["server", "storage"], minModifier: 1.20, maxModifier: 1.40 },
  { id: "cloud-migration-wave", name: "Cloud migration wave", description: "Companies dispose of old on-prem hardware.", weight: 5, duration: 3, assetIds: ["server", "storage"], minModifier: 0.65, maxModifier: 0.80 },
  { id: "remote-work-boom", name: "Remote-work boom", description: "Remote workers drive demand for home-office gear.", weight: 5, duration: 3, assetIds: ["laptop", "headset", "monitor"], minModifier: 1.20, maxModifier: 1.40 },
  { id: "return-to-office", name: "Return-to-office mandate", description: "Companies dump surplus remote-working hardware.", weight: 5, duration: 2, assetIds: ["laptop", "headset"], minModifier: 0.75, maxModifier: 0.90 },
  { id: "university-semester", name: "University semester starts", description: "Students scramble for affordable equipment.", weight: 5, duration: 2, assetIds: ["laptop", "monitor", "keyboard-mouse"], minModifier: 1.15, maxModifier: 1.30 },
  { id: "campus-renovation", name: "Campus renovation clearance", description: "Old computer labs are cleared out cheaply.", weight: 5, duration: 2, assetIds: ["desktop", "monitor", "keyboard-mouse"], minModifier: 0.65, maxModifier: 0.80 },
  { id: "ransomware-outbreak", name: "Ransomware outbreak", description: "Security products and backup storage sell rapidly.", weight: 5, duration: 2, assetIds: ["defender-license", "yubikey", "storage"], minModifier: 1.25, maxModifier: 1.50 },
  { id: "passwordless-mandate", name: "Passwordless security mandate", description: "Organizations urgently deploy hardware authentication.", weight: 5, duration: 3, assetIds: ["yubikey"], minModifier: 1.30, maxModifier: 1.50 },
  { id: "new-windows-release", name: "New Windows release", description: "Hardware upgrades begin ahead of OS migrations.", weight: 5, duration: 3, assetIds: ["laptop", "desktop", "windows-license"], minModifier: 1.15, maxModifier: 1.30 },
  { id: "compatibility-disaster", name: "Compatibility disaster", description: "Businesses delay purchases after widespread compatibility problems.", weight: 5, duration: 2, assetIds: ["laptop", "desktop", "windows-license"], minModifier: 0.75, maxModifier: 0.90 },
  { id: "smartphone-launch-day", name: "Smartphone launch day", description: "Demand spikes around new flagship devices.", weight: 5, duration: 1, assetIds: ["iphone", "samsung-phone"], minModifier: 1.20, maxModifier: 1.40 },
  { id: "previous-phone-clearance", name: "Previous-generation phone clearance", description: "Retailers clear inventory after new models appear.", weight: 5, duration: 2, assetIds: ["iphone", "samsung-phone"], minModifier: 0.65, maxModifier: 0.85 },
  { id: "school-tablet-program", name: "School tablet program", description: "A large education program creates sudden tablet demand.", weight: 5, duration: 3, assetIds: ["ipad"], minModifier: 1.25, maxModifier: 1.45 },
  { id: "warehouse-liquidation", name: "Warehouse liquidation", description: "A reseller urgently liquidates excess inventory.", weight: 5, duration: 1, assetIds: ["laptop", "desktop", "monitor", "headset"], minModifier: 0.60, maxModifier: 0.80 },
  { id: "supply-chain-restored", name: "Supply chain restored", description: "Component shortages finally ease.", weight: 5, duration: 3, assetIds: ["ram", "ssd", "gpu"], minModifier: 0.70, maxModifier: 0.85 },
  { id: "ai-hardware-frenzy", name: "AI hardware frenzy", description: "Everybody suddenly decides they need AI infrastructure.", weight: 5, duration: 3, assetIds: ["gpu", "server", "storage", "ram"], minModifier: 1.25, maxModifier: 1.50 }
];

const UPGRADES = [
  { id: "backpack", name: "Basic backpack", cost: 500, capacityBonus: 5 },
  { id: "equipment-case", name: "Equipment case", cost: 1200, capacityBonus: 15 },
  { id: "storage-unit", name: "Mobile storage unit", cost: 2500, capacityBonus: 30 }
];

const CONTACTS = {
  "student-dorm": {
    name: "Alex", role: "Dorm-room tinkerer", skin: "#d8a17c", hair: "#382f35", shirt: "#76baff", accessory: "glasses",
    lines: [
      "I fix laptops between lectures. Mostly instead of lectures. Students here pay extra for portable gear.",
      "A second monitor is a study essential. A third is clearly a personality trait. Peripherals sell well here.",
      "Your old phone could be someone's first decent one. Mobile prices tend to be higher around the dorm."
    ]
  },
  campus: {
    name: "Priya", role: "Campus IT fixer", skin: "#ae7655", hair: "#252533", shirt: "#bca2ed", accessory: "headset",
    lines: [
      "Every lecture hall has an HDMI cable. Nobody knows where. Monitors and keyboard sets are in demand.",
      "The students need laptops. The faculty need the Wi-Fi password again. Laptop prices run high here.",
      "A working headset is worth its weight in uninterrupted meetings. Office gear commands a premium."
    ]
  },
  refurbisher: {
    name: "Rosa", role: "Second-chance hardware specialist", skin: "#edbb98", hair: "#ad6453", shirt: "#58d69f", accessory: "glasses",
    lines: [
      "Nothing here is obsolete. Some of it is just waiting for a less demanding owner. PCs are cheaper here.",
      "These servers have years left in them. And possibly somebody's lunch behind the drive bay. Check our lower server prices.",
      "A little dust never hurt a NAS. A lot of dust is why I own a vacuum. Storage is usually a bargain here."
    ]
  },
  "shady-reseller": {
    name: "Vik", role: "Extremely unofficial sales department", skin: "#bf8d70", hair: "#302c37", shirt: "#ffc56e", accessory: "cap",
    lines: [
      "Factory sealed. Different factory, admittedly. Prices swing widely here, so compare before you commit.",
      "The warranty is my word. My word is 'probably'. Some offers are bargains; others really aren't.",
      "I bought low, you buy... let's negotiate. This market has the widest price range in town."
    ]
  },
  "data-center": {
    name: "Morgan", role: "Very tired data-center technician", skin: "#e5ba9e", hair: "#9eb0c4", shirt: "#7bbbc7", accessory: "headset",
    lines: [
      "These servers are practically new. Only three reorganizations old. Server demand is strong here.",
      "The cloud is just my building, but with better marketing. Storage and components command a premium.",
      "I haven't seen daylight, but I have seen your asking price. Bring servers, not smartphones."
    ]
  },
  "government-auction": {
    name: "Bernard", role: "Keeper of surplus and forms", skin: "#cf9c78", hair: "#c5b7a5", shirt: "#a9b5cb", accessory: "tie",
    lines: [
      "Perfectly usable PCs. Replaced because the new ones match the chairs. Surplus hardware is usually cheaper here.",
      "Please complete form B to request form A. Buying discounted monitors is considerably simpler.",
      "One department's surplus is another trader's margin. Look for lower PC and monitor prices."
    ]
  }
};

const EVENT_FLAVOUR = {
  "windows-10-ended": "The office PC has outlived three managers. Its support contract has not.",
  "corporate-refresh": "The new laptops are silver. The old laptops were also silver. Procurement is delighted.",
  "critical-vulnerability": "The emergency meeting has a password. Unfortunately, it is 'password'.",
  "license-audits": "An auditor has entered the chat. Everyone suddenly remembers software costs money.",
  "semiconductor-shortage": "The chips are down. So is the number of chips.",
  "back-to-school": "A new term, a fresh notebook, and a laptop that sounds like a departing aircraft.",
  "government-recycling": "Perfectly good hardware, retired after a courageous career in spreadsheets.",
  "datacenter-decommission": "The cloud has moved out. It left rather a lot of furniture.",
  "crypto-mining-boom": "The GPUs have discovered a second career. Nobody has told the electricity bill.",
  "crypto-market-crash": "Lightly used GPUs. Previous owner: one very warm warehouse.",
  "ssd-price-war": "Two manufacturers blinked at the same time. Your storage budget thanks them.",
  "ram-factory-fire": "A production line is offline. The rest of the world is suddenly very low on memory.",
  "major-cloud-outage": "It turns out 'someone else's computer' can also need restarting.",
  "cloud-migration-wave": "Everything is moving to the cloud. The server rack is moving to your van.",
  "remote-work-boom": "The kitchen table has been promoted to regional headquarters.",
  "return-to-office": "Management has discovered collaboration. Again.",
  "university-semester": "The reading list is optional. A laptop that boots is less negotiable.",
  "campus-renovation": "The computer lab is becoming a collaboration space. Its computers were not consulted.",
  "ransomware-outbreak": "The backup budget has been reconsidered with remarkable speed.",
  "passwordless-mandate": "Goodbye forgotten passwords. Hello 'has anyone seen my security key?'",
  "new-windows-release": "The Start button has moved. The upgrade budget is moving with it.",
  "compatibility-disaster": "The printer worked yesterday. This has been confirmed by fourteen witnesses.",
  "smartphone-launch-day": "A slightly better camera has caused a considerably larger queue.",
  "previous-phone-clearance": "Yesterday's flagship. Today's perfectly sensible purchase.",
  "school-tablet-program": "Thirty tablets, thirty bright futures, and one very brave IT coordinator.",
  "warehouse-liquidation": "Everything must go. Especially the inventory spreadsheet.",
  "supply-chain-restored": "The parts have arrived. Someone please tell the waiting list.",
  "ai-hardware-frenzy": "The board asked for AI. IT asked for a budget. Both got a slide deck."
};

let state;
let activeTrade = null;
let notificationsEnabled = true;

function random(seed) {
  let value = seed >>> 0;
  value += 0x6D2B79F5;
  let result = value;
  result = Math.imul(result ^ (result >>> 15), result | 1);
  result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
  const output = ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  return { value: value >>> 0, output };
}

function nextRandom() {
  const roll = random(state.seed);
  state.seed = roll.value;
  return roll.output;
}

function createRunStatistics(day = 1, locationId = "student-dorm") {
  return {
    sinceDay: day,
    soldUnits: 0,
    unknownCostUnits: 0,
    realizedProfit: 0,
    profitByAsset: Object.fromEntries(ASSETS.map(asset => [asset.id, 0])),
    soldByCategory: Object.fromEntries(ASSETS.map(asset => [asset.category, 0])),
    visits: Object.fromEntries(LOCATIONS.map(location => [location.id, location.id === locationId ? 1 : 0])),
    loanRepaidDay: null,
    bestSale: null,
    milestone: ""
  };
}

function newGame() {
  const seed = Date.now() >>> 0;
  state = {
    version: 5,
    runId: crypto.randomUUID(),
    seed,
    day: 1,
    locationId: "student-dorm",
    cash: 2000,
    debt: 5000,
    capacity: 10,
    inventory: {},
    costBasis: {},
    activeEvents: [],
    pendingEvent: null,
    prices: {},
    upgrades: [],
    statistics: createRunStatistics(),
    tradeHistory: [],
    loanWarningsAcknowledged: [],
    status: "playing"
  };

  ASSETS.forEach(asset => {
    state.inventory[asset.id] = 0;
    state.costBasis[asset.id] = 0;
  });
  updatePrices();
  saveGame();
  showMessage("A new run started. Repay the loan by the end of day 10.", "good");
  render();
}

function currentLocation() {
  return LOCATIONS.find(location => location.id === state.locationId);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function formatEuros(value) {
  return `${Math.round(value).toLocaleString("en-GB")} EUR`;
}

function inventoryCount() {
  return Object.values(state.inventory).reduce((total, count) => total + count, 0);
}

function inventoryValue() {
  return ASSETS.reduce((total, asset) => total + (state.inventory[asset.id] || 0) * (state.prices[asset.id] || asset.basePrice), 0);
}

function netWorth() {
  return state.cash - state.debt + inventoryValue();
}

function calculateScore() {
  return Math.max(0, Math.round(netWorth()));
}

function locationAssetModifier(location, asset) {
  return (location.categoryPriceModifiers?.[asset.category] ?? 1)
    * (location.assetPriceModifiers?.[asset.id] ?? 1);
}

function previewLocationPrices(destination) {
  const preview = {};

  ASSETS.forEach(asset => {
    if (!destination.assets.includes(asset.id)) {
      preview[asset.id] = clamp(asset.basePrice, asset.minPrice, asset.maxPrice);
      return;
    }

    const locationModifier = (destination.minModifier + destination.maxModifier) / 2;
    let eventModifier = 1;

    state.activeEvents.forEach(event => {
      if (event.assetIds.includes(asset.id)) {
        eventModifier *= (event.minModifier + event.maxModifier) / 2;
      }
    });

    preview[asset.id] = clamp(
      Math.round(asset.basePrice * locationModifier * locationAssetModifier(destination, asset) * eventModifier),
      asset.minPrice,
      asset.maxPrice
    );
  });

  return preview;
}

function profitForAsset(assetId, sellPrice, quantity = state.inventory[assetId] || 0) {
  const count = state.inventory[assetId] || 0;
  const costBasis = state.costBasis[assetId] || 0;
  if (count <= 0 || costBasis <= 0) return null;

  const profitPerItem = sellPrice - costBasis;
  const profitPercent = (profitPerItem / costBasis) * 100;
  return {
    profitPerItem,
    profitPercent,
    totalProfit: profitPerItem * quantity
  };
}

function formatSignedEuros(value) {
  const rounded = Math.round(value);
  return `${rounded >= 0 ? "+" : ""}${formatEuros(rounded)}`;
}

function formatSignedPercent(value) {
  const rounded = Math.round(value);
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

function rememberMilestone(message) {
  state.statistics.milestone = message;
  showMessage(message, "good");
}

function settleSale(assetId, quantity, proceeds) {
  const asset = ASSETS.find(item => item.id === assetId);
  const profit = profitForAsset(assetId, proceeds / quantity, quantity);
  const statistics = state.statistics;
  let newRecord = false;

  state.tradeHistory.push({
    day: state.day,
    locationId: state.locationId,
    type: "sell",
    assetId,
    quantity,
    price: proceeds / quantity,
    total: proceeds,
    profit: profit?.totalProfit ?? null,
    profitPercent: profit?.profitPercent ?? null
  });

  statistics.soldUnits += quantity;
  statistics.soldByCategory[asset.category] += quantity;
  if (profit) {
    statistics.realizedProfit += profit.totalProfit;
    statistics.profitByAsset[assetId] += profit.totalProfit;
    if (profit.totalProfit > (statistics.bestSale?.profit ?? 0)) {
      statistics.bestSale = {
        assetId, quantity, proceeds, profit: profit.totalProfit,
        locationId: state.locationId, day: state.day
      };
      newRecord = true;
      rememberMilestone(`Best sale yet! ${quantity}x ${asset.name}: ${formatSignedEuros(profit.totalProfit)} profit.`);
    }
  } else {
    statistics.unknownCostUnits += quantity;
  }

  state.inventory[assetId] -= quantity;
  if (state.inventory[assetId] === 0) state.costBasis[assetId] = 0;
  state.cash += proceeds;
  return newRecord;
}

function traderEnding() {
  const statistics = state.statistics;
  if (statistics.loanRepaidDay !== null && statistics.loanRepaidDay <= 5) {
    return { title: "Debt-Free Since Tuesday", story: `You cleared the entire loan on day ${statistics.loanRepaidDay}. The lender misses you. You do not miss the lender.` };
  }
  const topAsset = ASSETS.reduce((best, asset) =>
    statistics.profitByAsset[asset.id] > statistics.profitByAsset[best.id] ? asset : best);
  if (topAsset.id === "server" && statistics.profitByAsset.server > 0) {
    return { title: "Rack-to-Riches", story: "Servers earned you more trading profit than any other asset. The cloud was someone else's computer; the margin was yours." };
  }
  if (statistics.soldByCategory.Peripheral > statistics.soldUnits / 2) {
    return { title: "The Dongle Baron", story: "Most of your sold items were peripherals. Small connectors, surprisingly big ambitions." };
  }
  if (statistics.soldByCategory.License > statistics.soldUnits / 2) {
    return { title: "The License Whisperer", story: "Most of your sold items were licenses. You made paperwork look like a business model." };
  }
  return statistics.soldUnits > 0
    ? { title: "The Second-Life Trader", story: `You traded ${statistics.soldUnits} items onward. Somewhere, an old piece of tech has a new job.` }
    : { title: "Trader in the Making", story: "No sales this time. Every trading story starts somewhere, even if it starts with very full bookmarks." };
}

function renderRunHighlights() {
  const statistics = state.statistics;
  const ending = traderEnding();
  document.getElementById("end-trader-title").textContent = ending.title;
  document.getElementById("end-trader-story").textContent = ending.story;
  document.getElementById("end-trading-profit").textContent = formatSignedEuros(statistics.realizedProfit);
  const best = statistics.bestSale;
  document.getElementById("end-best-sale").textContent = best
    ? `${best.quantity}x ${ASSETS.find(asset => asset.id === best.assetId).name}: ${formatSignedEuros(best.profit)} profit, day ${best.day}`
    : "No profitable sale recorded";
  const favourite = LOCATIONS.reduce((best, location) =>
    statistics.visits[location.id] > statistics.visits[best.id] ? location : best);
  document.getElementById("end-favourite-location").textContent = `${favourite.name} (${statistics.visits[favourite.id]} visits)`;
  document.getElementById("end-statistics-note").textContent =
    `Trading statistics tracked from day ${statistics.sinceDay}. Profit uses average purchase cost and excludes interest and upgrades.`
    + (statistics.unknownCostUnits > 0 ? ` ${statistics.unknownCostUnits} sold items had unknown cost and are excluded from profit.` : "");
}

function advanceDays(count) {
  if (state.status !== "playing") return;

  let remaining = count;
  const startingDay = state.day;
  while (remaining > 0 && state.status === "playing" && !state.pendingEvent
    && !document.getElementById("loan-warning-dialog").open) {
    const currentIndex = LOCATIONS.findIndex(location => location.id === state.locationId);
    const destination = LOCATIONS[(currentIndex + 1) % LOCATIONS.length];
    travel(destination.id);
    remaining -= 1;
  }

  if (state.day > startingDay && state.status === "playing") {
    showMessage(`Advanced ${state.day - startingDay} day${state.day - startingDay === 1 ? "" : "s"} for testing.`, "good");
  }
  saveGame();
  render();
}

function giveDeveloperCash() {
  if (state.status !== "playing") return;
  state.cash += 10000;
  saveGame();
  showMessage("Developer mode: added 10,000 EUR.", "good");
  render();
}

function clearDeveloperLoan() {
  if (state.status !== "playing") return;
  const repaid = state.debt;
  state.debt = 0;
  saveGame();
  showMessage(`Developer mode: cleared ${formatEuros(repaid)} of debt.`, "good");
  render();
}

function openTradeDialog(assetId, mode) {
  if (state.status !== "playing" || state.pendingEvent) return;

  const asset = ASSETS.find(item => item.id === assetId);
  if (!asset) return;

  const price = state.prices[assetId];
  let maximum;

  if (mode === "buy") {
    maximum = Math.min(
      state.capacity - inventoryCount(),
      Math.floor(state.cash / price)
    );
  } else {
    maximum = state.inventory[assetId] || 0;
  }

  if (maximum < 1) return;

  activeTrade = { assetId, mode };
  document.getElementById("trade-title").textContent = `${mode === "buy" ? "Buy" : "Sell"} ${asset.name}`;
  const slider = document.getElementById("trade-slider");
  slider.min = "1";
  slider.max = String(maximum);
  slider.value = "1";
  updateTradePreview(1);
  document.querySelectorAll("[data-trade-quantity]").forEach(button => {
    const preset = button.dataset.tradeQuantity;
    const quantity = preset === "max"
      ? maximum
      : preset === "half"
        ? Math.ceil(maximum / 2)
        : 1;
    button.textContent = preset === "half" ? `Half (${quantity})` : String(quantity);
  });

  document.getElementById("trade-dialog").showModal();
}

function updateTradePreview(quantity) {
  if (!activeTrade) return;

  const asset = ASSETS.find(item => item.id === activeTrade.assetId);
  if (!asset) return;

  const price = state.prices[asset.id];
  const total = price * quantity;
  document.getElementById("trade-quantity").textContent = String(quantity);
  document.getElementById("trade-summary").textContent =
    `${formatEuros(price)} per item - ${quantity} item${quantity === 1 ? "" : "s"} totals ${formatEuros(total)}`;
  document.getElementById("trade-confirm").textContent =
    `${activeTrade.mode === "buy" ? "Buy" : "Sell"} ${quantity}`;

  const impact = document.getElementById("trade-impact");
  if (activeTrade.mode === "sell") {
    const profit = profitForAsset(asset.id, price, quantity);
    impact.className = `trade-impact ${profit && profit.totalProfit < 0 ? "profit-negative" : "profit-positive"}`;
    impact.textContent = profit
      ? `Potential sale: ${formatEuros(total)} - ${profit.totalProfit >= 0 ? "profit" : "loss"} ${formatSignedEuros(profit.totalProfit)} (${formatSignedPercent(profit.profitPercent)})`
      : `Potential sale: ${formatEuros(total)} - cost basis unknown`;
  } else {
    impact.className = "trade-impact";
    impact.textContent = "";
  }
}

function updatePrices() {
  const location = currentLocation();

  ASSETS.forEach((asset, assetIndex) => {
    if (!location.assets.includes(asset.id)) {
      state.prices[asset.id] = clamp(asset.basePrice, asset.minPrice, asset.maxPrice);
      return;
    }

    const locationModifier = location.minModifier + nextRandom() * (location.maxModifier - location.minModifier);
    let eventModifier = 1;

    state.activeEvents.forEach(event => {
      if (event.assetIds.includes(asset.id)) {
        eventModifier *= event.minModifier + nextRandom() * (event.maxModifier - event.minModifier);
      }
    });

    const locationIndex = LOCATIONS.findIndex(item => item.id === location.id);
    const tier = (assetIndex + state.day + locationIndex) % 5;
    const tierRanges = [
      [0.05, 0.20],
      [0.25, 0.40],
      [0.45, 0.60],
      [0.65, 0.80],
      [0.85, 0.95]
    ];
    const spread = nextRandom() * (tierRanges[tier][1] - tierRanges[tier][0]);
    const targetRatio = tierRanges[tier][0] + spread;
    const targetPrice = asset.minPrice + (asset.maxPrice - asset.minPrice) * targetRatio;
    let price = Math.round(targetPrice * locationModifier * locationAssetModifier(location, asset) * eventModifier);
    price = clamp(price, asset.minPrice, asset.maxPrice);

    if (state.prices[asset.id]) {
      const previous = state.prices[asset.id];
      price = clamp(price, Math.ceil(previous * 0.50), Math.floor(previous * 1.50));
      price = clamp(price, asset.minPrice, asset.maxPrice);
    }

    state.prices[asset.id] = price;
  });
}

function buyAsset(assetId, quantity = 1) {
  if (state.status !== "playing") return;

  const asset = ASSETS.find(item => item.id === assetId);
  if (!asset || !currentLocation().assets.includes(assetId)) {
    showMessage("This asset is not available at the current location.", "bad");
    return;
  }

  const price = state.prices[assetId];
  if (inventoryCount() >= state.capacity) {
    showMessage("Your inventory is full. Buy a storage upgrade.", "bad");
    return;
  }
  const freePocketCount = state.capacity - inventoryCount();
  const affordableCount = Math.floor(state.cash / price);
  const maximum = Math.min(freePocketCount, affordableCount);
  quantity = clamp(Math.floor(quantity), 1, maximum);
  if (quantity < 1) {
    showMessage(`You need ${formatEuros(price)} to buy ${asset.name}.`, "bad");
    return;
  }

  state.cash -= price * quantity;
  const previousCount = state.inventory[assetId] || 0;
  const previousCost = state.costBasis[assetId] || 0;
  const nextCount = previousCount + quantity;
  state.costBasis[assetId] = previousCount > 0
    ? ((previousCost * previousCount) + (price * quantity)) / nextCount
    : price;
  state.inventory[assetId] = nextCount;
  state.tradeHistory.push({
    day: state.day,
    locationId: state.locationId,
    type: "buy",
    assetId,
    quantity,
    price,
    total: price * quantity,
    profit: null,
    profitPercent: null
  });
  saveGame();
  showMessage(`Bought ${quantity} ${asset.name} for ${formatEuros(price * quantity)}.`, "good");
  render();
}

function sellAsset(assetId, quantity = 1) {
  if (state.status !== "playing") return;

  const asset = ASSETS.find(item => item.id === assetId);
  const owned = state.inventory[assetId] || 0;
  if (!asset || owned < 1) {
    showMessage("You do not own this asset.", "bad");
    return;
  }

  const price = state.prices[assetId];
  quantity = clamp(Math.floor(quantity), 1, owned);
  settleSale(assetId, quantity, price * quantity);
  saveGame();
  showMessage(`Sold ${quantity} ${asset.name} for ${formatEuros(price * quantity)}.`, "good");
  render();
}

function activateTab(tab) {
  document.querySelectorAll("[data-tab]").forEach(tabButton => {
    const active = tabButton.dataset.tab === tab;
    tabButton.classList.toggle("is-active", active);
    tabButton.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-tab-panel]").forEach(panel => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === tab);
  });
}

function travel(destinationId) {
  if (state.status !== "playing" || state.day >= 30 || state.pendingEvent) return;
  if (destinationId === state.locationId) return;

  state.locationId = destinationId;
  state.day += 1;
  state.statistics.visits[destinationId] += 1;
  state.activeEvents = state.activeEvents
    .map(event => ({ ...event, remainingDays: event.remainingDays - 1 }))
    .filter(event => event.remainingDays > 0);

  const event = resolveRandomEvent();
  if (event) {
    state.pendingEvent = event.id;
    document.getElementById("day-stat").textContent = `${state.day} / 30`;
    saveGame();
    showEventDialog(event);
    return;
  }

  completeTravelTurn();
}

function completeTravelTurn() {
  state.pendingEvent = null;
  if (state.debt > 0) {
    state.debt = Math.ceil(state.debt * 1.05);
  }

  updatePrices();

  if (state.day > 10) {
    // The due check is handled exactly at the end of day 10 below.
  }

  if (state.day === 10 && state.debt > 0) {
    endGame("Loan overdue", "The loan was not repaid by the end of day 10.", "failed");
    return;
  }

  if (state.day >= 30) {
    finishAtDay30();
    return;
  }

  saveGame();
  render();
  showLoanWarningIfNeeded();
}

function resolveRandomEvent() {
  if (nextRandom() < 0.15) {
    showMessage("No major market event occurred today.", "good");
    return null;
  }

  const totalWeight = EVENTS.reduce((total, event) => total + event.weight, 0);
  let roll = nextRandom() * totalWeight;
  let selected = EVENTS[EVENTS.length - 1];

  for (const event of EVENTS) {
    roll -= event.weight;
    if (roll <= 0) {
      selected = event;
      break;
    }
  }

  const overlapping = state.activeEvents.some(active =>
    active.assetIds.some(assetId => selected.assetIds.includes(assetId))
  );
  if (overlapping) return null;

  state.activeEvents.push({ ...selected, remainingDays: selected.duration });
  return selected;
}

function showEventDialog(event) {
  const assetNames = event.assetIds
    .map(assetId => ASSETS.find(asset => asset.id === assetId)?.name)
    .filter(Boolean);
  document.getElementById("event-title").textContent = event.name;
  document.getElementById("event-story").textContent = EVENT_FLAVOUR[event.id];
  document.getElementById("event-description").textContent = event.description;
  document.getElementById("event-assets").textContent = assetNames.join(", ");
  document.getElementById("event-price-impact").textContent =
    `${Math.round(event.minModifier * 100)}%-${Math.round(event.maxModifier * 100)}%`;
  document.getElementById("event-duration").textContent =
    `${event.duration} day${event.duration === 1 ? "" : "s"}`;
  document.getElementById("event-dialog").showModal();
}

function showLoanWarningIfNeeded() {
  const warningDay = state.day;
  const dialog = document.getElementById("loan-warning-dialog");
  if (state.status !== "playing" || state.debt <= 0
    || ![8, 9].includes(warningDay)
    || state.loanWarningsAcknowledged.includes(warningDay)
    || dialog.open) return;

  const daysUntilDue = 10 - warningDay;
  const deadline = daysUntilDue === 1 ? "tomorrow" : "in 2 days";
  document.getElementById("loan-warning-message").textContent =
    `Your loan of ${formatEuros(state.debt)} is due ${deadline}, at the end of day 10. Repay it before completing day 10.`;
  document.getElementById("loan-warning-dialog").showModal();
}

function repay(amount) {
  if (state.status !== "playing" || state.debt <= 0) return;

  const payment = Math.min(amount, state.debt, state.cash);
  if (payment <= 0) {
    showMessage("You do not have enough cash to repay the loan.", "bad");
    return;
  }

  state.debt -= payment;
  state.cash -= payment;
  if (state.debt === 0) {
    state.statistics.loanRepaidDay = state.day;
    rememberMilestone(`Loan cleared on day ${state.day}! Your next good trade belongs entirely to you.`);
  }
  saveGame();
  showMessage(`Repaid ${formatEuros(payment)} of the loan.`, "good");
  render();
}

function buyUpgrade(upgradeId) {
  if (state.status !== "playing") return;

  const upgrade = UPGRADES.find(item => item.id === upgradeId);
  if (!upgrade) return;
  if (state.upgrades.includes(upgradeId)) {
    showMessage("This upgrade is already active.", "bad");
    return;
  }
  if (state.cash < upgrade.cost) {
    showMessage(`You need ${formatEuros(upgrade.cost)} for ${upgrade.name}.`, "bad");
    return;
  }

  state.cash -= upgrade.cost;
  state.capacity += upgrade.capacityBonus;
  state.upgrades.push(upgradeId);
  saveGame();
  showMessage(`Purchased ${upgrade.name}: +${upgrade.capacityBonus} pockets. Capacity is now ${state.capacity} units.`, "good");
  render();
}

function finishAtDay30() {
  if (state.debt === 0 && netWorth() >= 8000) {
    endGame("Successful run", "The loan is cleared and the net-worth target has been reached.", "won");
  } else {
    endGame("Run ended", "The required day-30 score was not reached.", "failed");
  }
}

function endGame(title, message, outcome) {
  state.status = outcome;
  state.endedAt = new Date().toISOString();
  state.endSummary = { title, message };
  saveGame();
  render();
  showEndSummary();
}

function showEndSummary() {
  document.getElementById("end-eyebrow").textContent = state.status === "won" ? "Retirement secured" : "Run complete";
  document.getElementById("end-title").textContent = state.endSummary?.title || "Run ended";
  document.getElementById("end-message").textContent = state.endSummary?.message || "This run is complete. Start a new run to trade again.";
  document.getElementById("end-score").textContent = calculateScore().toLocaleString("en-GB");
  document.getElementById("end-networth").textContent = formatEuros(netWorth());
  renderRunHighlights();
  const entries = loadHighscores();
  const submitted = state.highscoreSubmitted || entries?.some(entry => entry.runId === state.runId);
  const qualifies = entries !== null && !submitted && qualifiesForHighscores(entries, netWorth());
  document.getElementById("highscore-entry").hidden = !qualifies;
  document.getElementById("highscore-name").value = "";
  document.getElementById("end-highscore-message").textContent = entries === null
    ? "Local highscores could not be loaded. See the local top 10 for details."
    : submitted
      ? "Your result has already been saved."
      : qualifies
        ? "You made the local top 10! Enter a name to save your result."
        : "This result did not reach the local top 10.";
  document.getElementById("end-dialog").showModal();
}

function loadHighscores() {
  try {
    const saved = localStorage.getItem(HIGHSCORES_KEY);
    const entries = saved === null ? [] : JSON.parse(saved);
    if (!Array.isArray(entries) || entries.length > 10 || !entries.every(entry =>
      entry && typeof entry.runId === "string" && entry.runId.length > 0
      && typeof entry.name === "string" && entry.name.trim().length > 0 && entry.name.length <= 24
      && Number.isSafeInteger(entry.money)
      && typeof entry.date === "string" && Number.isFinite(Date.parse(entry.date))
    ) || new Set(entries.map(entry => entry.runId)).size !== entries.length) {
      throw new Error("Invalid local highscore data");
    }
    document.getElementById("highscores-error").textContent = "";
    return entries.sort((a, b) => b.money - a.money);
  } catch (error) {
    console.error("Could not load local highscores.", error);
    document.getElementById("highscores-error").textContent =
      "Local highscores could not be read. Browser storage may be blocked or the data damaged. Existing data has not been overwritten.";
    return null;
  }
}

function qualifiesForHighscores(entries, money) {
  return entries.length < 10 || money > entries[entries.length - 1].money;
}

function renderHighscores() {
  const entries = loadHighscores();
  const list = document.getElementById("highscores-list");
  list.replaceChildren();
  document.getElementById("highscores-empty").hidden = entries === null || entries.length > 0;
  if (entries === null) return;

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    [String(index + 1), entry.name, formatEuros(entry.money), new Date(entry.date).toLocaleDateString("en-GB")]
      .forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });
    list.append(row);
  });
}

function saveHighscore(event) {
  event.preventDefault();
  if (state.status === "playing") return;
  const input = document.getElementById("highscore-name");
  const name = input.value.trim();
  input.setCustomValidity(name ? "" : "Enter a player name, not just spaces.");
  if (!input.reportValidity()) return;

  const entries = loadHighscores();
  if (entries === null) {
    document.getElementById("end-highscore-message").textContent =
      "Your result could not be saved because local highscores could not be loaded.";
    return;
  }
  if (state.highscoreSubmitted || entries.some(entry => entry.runId === state.runId)) {
    document.getElementById("highscore-entry").hidden = true;
    document.getElementById("end-highscore-message").textContent = "Your result has already been saved.";
    return;
  }
  if (!qualifiesForHighscores(entries, netWorth())) {
    document.getElementById("highscore-entry").hidden = true;
    document.getElementById("end-highscore-message").textContent = "Another result has moved this run outside the local top 10.";
    return;
  }
  entries.push({ runId: state.runId, name, money: netWorth(), date: state.endedAt || new Date().toISOString() });
  entries.sort((a, b) => b.money - a.money);
  try {
    localStorage.setItem(HIGHSCORES_KEY, JSON.stringify(entries.slice(0, 10)));
  } catch (error) {
    console.error("Could not save local highscore.", error);
    document.getElementById("end-highscore-message").textContent =
      "Your result could not be saved. Check browser storage permissions or available space, then try again.";
    return;
  }
  state.highscoreSubmitted = true;
  document.getElementById("highscore-entry").hidden = true;
  try {
    saveGame();
  } catch (error) {
    console.error("Highscore saved, but run progress could not be saved.", error);
    document.getElementById("end-highscore-message").textContent =
      "Your highscore was saved, but run progress could not be saved. Check browser storage, then use View local top 10.";
    return;
  }
  document.getElementById("end-highscore-message").textContent = "Your result has been saved.";
  document.getElementById("end-dialog").close();
  renderHighscores();
  document.getElementById("highscores-dialog").showModal();
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function validRunStatistics(statistics, day) {
  const nonnegativeInteger = value => Number.isSafeInteger(value) && value >= 0;
  if (!statistics || !Number.isInteger(statistics.sinceDay)
    || statistics.sinceDay < 1 || statistics.sinceDay > day
    || !["soldUnits", "unknownCostUnits"].every(key => nonnegativeInteger(statistics[key]))
    || statistics.unknownCostUnits > statistics.soldUnits
    || !Number.isFinite(statistics.realizedProfit)
    || !ASSETS.every(asset => Number.isFinite(statistics.profitByAsset?.[asset.id])
      && nonnegativeInteger(statistics.soldByCategory?.[asset.category]))
    || !LOCATIONS.every(location => nonnegativeInteger(statistics.visits?.[location.id]))
    || Object.values(statistics.soldByCategory).reduce((sum, units) => sum + units, 0) !== statistics.soldUnits
    || (statistics.loanRepaidDay !== null && (!Number.isInteger(statistics.loanRepaidDay)
      || statistics.loanRepaidDay < statistics.sinceDay || statistics.loanRepaidDay > day))
    || typeof statistics.milestone !== "string" || statistics.milestone.length > 240) return false;

  const best = statistics.bestSale;
  return best === null || Boolean(best
    && ASSETS.some(asset => asset.id === best.assetId)
    && LOCATIONS.some(location => location.id === best.locationId)
    && Number.isSafeInteger(best.quantity) && best.quantity > 0
    && Number.isSafeInteger(best.proceeds) && best.proceeds > 0
    && Number.isFinite(best.profit) && best.profit > 0
    && Number.isInteger(best.day) && best.day >= statistics.sinceDay && best.day <= day);
}

function validTradeHistory(history, day) {
  if (!Array.isArray(history)) return false;
  let previousDay = 0;
  return history.every(trade => {
    const isBuy = trade?.type === "buy";
    const isSell = trade?.type === "sell";
    const hasProfit = trade?.profit === null && trade?.profitPercent === null
      || Number.isFinite(trade?.profit) && Number.isFinite(trade?.profitPercent);
    const valid = Number.isInteger(trade?.day) && trade.day >= 1 && trade.day <= day
      && trade.day >= previousDay
      && LOCATIONS.some(location => location.id === trade.locationId)
      && (isBuy || isSell)
      && ASSETS.some(asset => asset.id === trade.assetId)
      && Number.isSafeInteger(trade.quantity) && trade.quantity > 0
      && Number.isSafeInteger(trade.price) && trade.price > 0
      && Number.isSafeInteger(trade.total) && trade.total === trade.price * trade.quantity
      && hasProfit
      && (isSell || trade.profit === null && trade.profitPercent === null);
    previousDay = trade?.day;
    return valid;
  });
}

function validLoanWarningsAcknowledged(warningDays) {
  return Array.isArray(warningDays)
    && warningDays.every(day => day === 8 || day === 9)
    && new Set(warningDays).size === warningDays.length;
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) {
    newGame();
    return;
  }

  let migrated = false;
  try {
    const parsed = JSON.parse(saved);
    if (
      ![1, 2, 3, 4, 5].includes(parsed.version) ||
      !Number.isInteger(parsed.day) ||
      parsed.day < 1 || parsed.day > 30 ||
      !LOCATIONS.some(location => location.id === parsed.locationId) ||
      (parsed.pendingEvent && !EVENTS.some(event => event.id === parsed.pendingEvent)) ||
      !Array.isArray(parsed.activeEvents) ||
      !Array.isArray(parsed.upgrades) ||
      !parsed.upgrades.every(id => UPGRADES.some(upgrade => upgrade.id === id)) ||
      new Set(parsed.upgrades).size !== parsed.upgrades.length ||
      !ASSETS.every(asset => Number.isInteger(parsed.inventory?.[asset.id]))
    ) {
      throw new Error("Invalid save");
    }
    state = parsed;
    const capacity = 10 + UPGRADES.reduce((total, upgrade) =>
      total + (state.upgrades.includes(upgrade.id) ? upgrade.capacityBonus : 0), 0);
    if (state.version === 1) {
      state.version = 2;
      state.capacity = capacity;
      delete state.infrastructureHealth;
      state.activeEvents.forEach(event => {
        delete event.healthChange;
      });
      migrated = true;
    } else if (state.capacity !== capacity) {
      throw new Error("Invalid storage capacity");
    }
    if (state.version === 2) {
      state.statistics = createRunStatistics(state.day, state.locationId);
      state.version = 3;
      migrated = true;
    }
    if (state.version === 3) {
      delete state.statistics.requestsCompleted;
      delete state.buyerRequest;
      state.tradeHistory = [];
      state.version = 4;
      migrated = true;
    }
    if (state.version === 4) {
      state.loanWarningsAcknowledged = [];
      state.version = 5;
      migrated = true;
    }
    if (!validRunStatistics(state.statistics, state.day)
      || !validTradeHistory(state.tradeHistory, state.day)
      || !validLoanWarningsAcknowledged(state.loanWarningsAcknowledged)) {
      throw new Error("Invalid run statistics, trade history, or loan warning state");
    }
    if (!state.runId) {
      state.runId = crypto.randomUUID();
      migrated = true;
    }
    if (!state.costBasis) state.costBasis = {};
    ASSETS.forEach(asset => {
      if (!Object.prototype.hasOwnProperty.call(state.inventory, asset.id)) {
        state.inventory[asset.id] = 0;
      }
      if (!Object.prototype.hasOwnProperty.call(state.costBasis, asset.id)) {
        state.costBasis[asset.id] = state.inventory[asset.id] > 0 ? state.prices?.[asset.id] || 0 : 0;
      }
    });
    if (!state.status) state.status = "playing";
  } catch (error) {
    console.error("Could not load the saved game.", error);
    localStorage.removeItem(SAVE_KEY);
    newGame();
    showMessage("The saved game was invalid. A new game has been started.", "bad");
    return;
  }

  if (migrated) {
    try {
      saveGame();
    } catch (error) {
      console.error("Could not persist the updated saved game.", error);
      showMessage("Your game was updated in memory, but could not be saved. Check browser storage permissions and available space.", "bad");
    }
  }
  render();
  if (state.pendingEvent) {
    showEventDialog(EVENTS.find(event => event.id === state.pendingEvent));
  } else if (state.status !== "playing") {
    showEndSummary();
  } else {
    showLoanWarningIfNeeded();
  }
}

document.getElementById("market-list").addEventListener("click", event => {
  const buyButton = event.target.closest("[data-buy]");
  const sellButton = event.target.closest("[data-sell]");
  if (buyButton) openTradeDialog(buyButton.dataset.buy, "buy");
  if (sellButton) openTradeDialog(sellButton.dataset.sell, "sell");
});

document.getElementById("travel-list").addEventListener("click", event => {
  const button = event.target.closest("[data-travel]");
  if (button) {
    travel(button.dataset.travel);
    activateTab("market");
  }
});

document.getElementById("trade-slider").addEventListener("input", event => {
  if (!activeTrade) return;
  updateTradePreview(Number(event.target.value));
});

document.querySelectorAll("[data-trade-quantity]").forEach(button => {
  button.addEventListener("click", () => {
    if (!activeTrade) return;

    const slider = document.getElementById("trade-slider");
    const maximum = Number(slider.max);
    const preset = button.dataset.tradeQuantity;
    slider.value = String(preset === "max"
      ? maximum
      : preset === "half"
        ? Math.ceil(maximum / 2)
        : 1);
    updateTradePreview(Number(slider.value));
  });
});

document.getElementById("trade-confirm").addEventListener("click", () => {
  if (!activeTrade) return;
  const quantity = Number(document.getElementById("trade-slider").value);
  if (activeTrade.mode === "buy") {
    buyAsset(activeTrade.assetId, quantity);
  } else {
    sellAsset(activeTrade.assetId, quantity);
  }
  document.getElementById("trade-dialog").close();
  activeTrade = null;
});

document.getElementById("acknowledge-event-button").addEventListener("click", () => {
  if (!state.pendingEvent) return;
  document.getElementById("event-dialog").close();
  completeTravelTurn();
});

document.getElementById("event-dialog").addEventListener("cancel", event => {
  event.preventDefault();
});

document.getElementById("acknowledge-loan-warning-button").addEventListener("click", () => {
  const warningDay = state.day;
  const acknowledgedDays = state.loanWarningsAcknowledged;
  if ([8, 9].includes(warningDay) && !acknowledgedDays.includes(warningDay)) {
    acknowledgedDays.push(warningDay);
    try {
      saveGame();
    } catch (error) {
      acknowledgedDays.pop();
      console.error("Could not save the loan warning acknowledgement.", error);
      document.getElementById("loan-warning-message").textContent =
        "Your acknowledgement could not be saved. Check browser storage, then try again.";
      return;
    }
  }
  document.getElementById("loan-warning-dialog").close();
});

document.getElementById("loan-warning-dialog").addEventListener("cancel", event => {
  event.preventDefault();
});

document.getElementById("upgrade-list").addEventListener("click", event => {
  const button = event.target.closest("[data-upgrade]");
  if (button) buyUpgrade(button.dataset.upgrade);
});

document.getElementById("repay-button").addEventListener("click", () => repay(100));
document.getElementById("repay-all-button").addEventListener("click", () => repay(state.cash));
document.getElementById("dev-advance-button").addEventListener("click", () => advanceDays(5));
document.getElementById("dev-end-button").addEventListener("click", () => advanceDays(Math.max(1, 30 - state.day)));
document.getElementById("dev-cash-button").addEventListener("click", giveDeveloperCash);
document.getElementById("dev-repay-button").addEventListener("click", clearDeveloperLoan);

document.getElementById("reset-button").addEventListener("click", () => {
  document.getElementById("reset-dialog").showModal();
});

document.getElementById("confirm-reset-button").addEventListener("click", () => {
  document.getElementById("reset-dialog").close();
  newGame();
});

document.getElementById("play-again-button").addEventListener("click", () => {
  document.getElementById("end-dialog").close();
  newGame();
});

document.getElementById("highscore-entry").addEventListener("submit", saveHighscore);
document.getElementById("highscore-name").addEventListener("input", event => {
  event.target.setCustomValidity("");
});
document.getElementById("end-highscores-button").addEventListener("click", () => {
  renderHighscores();
  document.getElementById("highscores-dialog").showModal();
});
document.getElementById("trade-history-button").addEventListener("click", () => {
  renderTradeHistory();
  document.getElementById("trade-history-dialog").showModal();
});

document.querySelectorAll("[data-tab]").forEach(button => {
  button.addEventListener("click", () => {
    activateTab(button.dataset.tab);
  });
});

document.querySelectorAll("[data-open-dialog]").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.openDialog === "highscores-dialog") renderHighscores();
    document.getElementById(button.dataset.openDialog)?.showModal();
  });
});

document.getElementById("reduced-motion-setting").addEventListener("change", event => {
  document.body.classList.toggle("reduce-motion", event.target.checked);
  localStorage.setItem("itat-reduced-motion", event.target.checked ? "1" : "0");
});

document.getElementById("notifications-setting").addEventListener("change", event => {
  notificationsEnabled = event.target.checked;
  localStorage.setItem("itat-notifications", notificationsEnabled ? "1" : "0");
});

notificationsEnabled = localStorage.getItem("itat-notifications") !== "0";
const reducedMotionSetting = document.getElementById("reduced-motion-setting");
const notificationsSetting = document.getElementById("notifications-setting");
reducedMotionSetting.checked = localStorage.getItem("itat-reduced-motion") === "1";
notificationsSetting.checked = notificationsEnabled;
document.body.classList.toggle("reduce-motion", reducedMotionSetting.checked);

loadGame();
