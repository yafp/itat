"use strict";

function contactPortrait(contact) {
  const accessories = {
    glasses: '<rect x="20" y="29" width="17" height="12" rx="4"/><rect x="43" y="29" width="17" height="12" rx="4"/><path d="M37 33h6"/>',
    headset: '<path d="M17 33v-5a23 23 0 0 1 46 0v15l-11 5"/><rect x="13" y="31" width="7" height="15" rx="3"/><rect x="60" y="31" width="7" height="15" rx="3"/>',
    cap: '<path d="M17 23c0-22 46-22 46 0z" fill="#ffc56e"/><path d="M17 23h51"/>',
    tie: '<path d="m35 60 5 5 5-5m-5 5-4 12h8z" fill="#76baff"/>'
  };
  return `<svg class="contact-portrait" viewBox="0 0 80 80" role="img" aria-label="Portrait of ${contact.name}">
    <rect width="80" height="80" rx="16" fill="#22364d"/>
    <path d="M9 80V70c0-20 62-20 62 0v10" fill="${contact.shirt}"/>
    <rect x="34" y="46" width="12" height="16" rx="4" fill="${contact.skin}"/>
    <ellipse cx="40" cy="31" rx="23" ry="26" fill="${contact.hair}"/>
    <ellipse cx="40" cy="35" rx="20" ry="23" fill="${contact.skin}"/>
    <path d="M20 26c2-24 38-25 41 0-13 1-19-7-21-10-4 7-11 10-20 10" fill="${contact.hair}"/>
    <g fill="none" stroke="#192638" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M29 33h1m20 0h1m-15 13q4 4 8 0"/>
      ${accessories[contact.accessory]}
    </g>
  </svg>`;
}

function assetIcon(assetId) {
  const icons = {
    laptop: '<rect x="3" y="5" width="18" height="12" rx="1"/><path d="M1 19h22M6 17l-1 2m13-2 1 2"/>',
    desktop: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
    server: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M8 6h.01M8 12h.01M8 18h.01"/>',
    storage: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h10M7 17h.01"/>',
    ram: '<rect x="2" y="7" width="20" height="10" rx="1"/><path d="M6 17v3M10 17v3M14 17v3M18 17v3M6 7V4m4 3V4m4 3V4m4 3V4"/>',
    ssd: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 15h8M8 10h.01"/>',
    gpu: '<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M6 9h12v6H6zM7 21h10M9 18v3m6-3v3"/>',
    yubikey: '<circle cx="8" cy="13" r="4"/><path d="M12 13h8v4h-3v3h-3v-7"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H4zM17 14h3v6h-3z"/>',
    "keyboard-mouse": '<rect x="2" y="7" width="20" height="11" rx="2"/><path d="M6 11h.01M10 11h.01M14 11h.01M18 11h.01M6 14h12"/>',
    "windows-license": '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18M7 7h2m6 2h2M7 16h2m6-2h2"/>',
    "defender-license": '<path d="M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6z"/><path d="M12 7v10m-5-5h10"/>',
    iphone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 5h2M11 19h2"/>',
    "samsung-phone": '<rect x="7" y="2" width="10" height="20" rx="2"/><circle cx="12" cy="6" r=".5"/><path d="M11 19h2"/>',
    ipad: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="18" r=".5"/>',
    monitor: '<rect x="3" y="5" width="18" height="12" rx="1"/><path d="M12 17v4M8 21h8"/>'
  };

  return `<svg class="asset-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[assetId] || icons.desktop}</svg>`;
}

function locationIcon(locationId) {
  const icons = {
    "student-dorm": '<path d="M3 10l9-7 9 7M5 9v11h14V9M9 20v-6h6v6"/>',
    campus: '<path d="M3 8l9-5 9 5H3zM5 10h14M7 10v8m5-8v8m5-8v8M4 20h16"/>',
    refurbisher: '<path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6M9 10h.01M15 10h.01"/>',
    "shady-reseller": '<rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    "data-center": '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M8 6h.01M8 12h.01M8 18h.01"/>',
    "government-auction": '<path d="M3 8h18M5 10v7m14-7v7M3 19h18M12 3v5M9 5h6"/>'
  };

  return `<svg class="location-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[locationId] || icons.campus}</svg>`;
}

function getPriceTier(asset, price) {
  const range = asset.maxPrice - asset.minPrice;
  const ratio = range > 0 ? (price - asset.minPrice) / range : 0;

  if (ratio <= 0.20) return { label: "Extreme cheap", className: "price-extreme-cheap" };
  if (ratio <= 0.40) return { label: "Cheap", className: "price-cheap" };
  if (ratio <= 0.60) return { label: "Moderate", className: "price-moderate" };
  if (ratio <= 0.80) return { label: "Expensive", className: "price-expensive" };
  return { label: "Extreme", className: "price-extreme" };
}

function renderTradeHistory() {
  const history = state.tradeHistory.slice().sort((first, second) => first.day - second.day);
  const list = document.getElementById("trade-history-list");
  list.replaceChildren();
  document.getElementById("trade-history-empty").hidden = history.length > 0;

  history.forEach(trade => {
    const location = LOCATIONS.find(item => item.id === trade.locationId);
    const asset = ASSETS.find(item => item.id === trade.assetId);
    const row = document.createElement("tr");
    const values = [
      `Day ${trade.day}`,
      location.name,
      trade.type === "buy" ? "Buy" : "Sell",
      asset.name,
      String(trade.quantity),
      `${trade.type === "buy" ? "-" : "+"}${formatEuros(trade.total)}`
    ];
    values.forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    const result = document.createElement("td");
    if (trade.type === "buy") {
      result.textContent = "N/A";
    } else if (trade.profit === null) {
      result.textContent = "Cost unknown";
    } else {
      result.className = `history-profit ${trade.profit < 0 ? "history-profit-negative" : "history-profit-positive"}`;
      result.textContent = `${formatSignedEuros(trade.profit)} (${formatSignedPercent(trade.profitPercent)})`;
    }
    row.append(result);
    list.append(row);
  });
}

function render() {
  const location = currentLocation();
  const count = inventoryCount();
  const travelDisabled = state.status !== "playing" || state.day >= 30;
  const travelDisabledReason = travelDisabled ? "This run is over. Start a new game to travel." : "";
  document.querySelectorAll('[data-tab="travel"]').forEach(button => {
    button.disabled = travelDisabled;
    button.title = travelDisabled ? travelDisabledReason : "Travel";
  });

  document.getElementById("day-stat").textContent = `${state.day} / 30`;
  document.getElementById("cash-stat").textContent = formatEuros(state.cash);
  document.getElementById("debt-stat").textContent = formatEuros(state.debt);
  document.getElementById("networth-stat").textContent = formatEuros(netWorth());
  document.getElementById("pockets-heading").textContent = `Pockets (${count} / ${state.capacity})`;

  document.getElementById("day-stat").className = "";
  document.getElementById("cash-stat").className = "status-positive";
  document.getElementById("debt-stat").className = state.debt > 0 ? "status-negative" : "status-positive";
  document.getElementById("networth-stat").className = netWorth() >= 0 ? "status-positive" : "status-negative";

  const marketCount = location.assets.length;
  document.getElementById("market-heading").textContent = `Market - ${location.name}`;
  document.getElementById("market-count").textContent = `${ASSETS.length} goods - ${marketCount} available`;
  document.getElementById("market-location-name").textContent = location.name;
  document.getElementById("market-profile").textContent = location.profile;
  document.getElementById("travel-location-name").textContent = `Currently: ${location.name}`;
  const contact = CONTACTS[location.id];
  document.getElementById("contact-portrait").innerHTML = contactPortrait(contact);
  document.getElementById("contact-name").textContent = `${contact.name} - ${contact.role}`;
  document.getElementById("contact-dialogue").textContent = contact.lines[(state.day - 1) % contact.lines.length];
  const milestone = document.getElementById("milestone-banner");
  milestone.hidden = !state.statistics.milestone;
  milestone.textContent = state.statistics.milestone;
  renderTradeHistory();

  const marketList = document.getElementById("market-list");
  marketList.innerHTML = "";

  ASSETS.forEach(asset => {
    const owned = state.inventory[asset.id] || 0;
    const tradedHere = location.assets.includes(asset.id);
    const available = tradedHere || owned > 0;
    const buyAvailable = tradedHere;
    const tier = getPriceTier(asset, state.prices[asset.id]);
    const buyDisabled = !buyAvailable || inventoryCount() >= state.capacity || state.cash < state.prices[asset.id];
    const sellDisabled = owned <= 0;
    const buyTitle = !buyAvailable
      ? "Unavailable at this market"
      : inventoryCount() >= state.capacity
      ? "No free pockets"
      : state.cash < state.prices[asset.id]
        ? "Not enough cash"
        : `Buy ${asset.name}`;
    const sellTitle = sellDisabled ? "No items to sell" : `Sell ${asset.name}`;
    const saleProfit = owned > 0 ? profitForAsset(asset.id, state.prices[asset.id]) : null;
    const saleClass = saleProfit
      ? saleProfit.totalProfit > 0
        ? " market-sell-profit"
        : saleProfit.totalProfit < 0
          ? " market-sell-loss"
          : " market-sell-neutral"
      : "";
    const row = document.createElement("article");
    row.className = `market-row${available ? "" : " market-unavailable"}${buyAvailable ? "" : " market-sell-only"}${saleClass}`;
    row.innerHTML = `
      <div>
        <div class="asset-heading">
          ${assetIcon(asset.id)}
          <div>
            <span class="asset-name">${asset.name}</span>
            <span class="asset-meta">${asset.category} - ${buyAvailable ? formatEuros(state.prices[asset.id]) : owned > 0 ? `Sell at ${formatEuros(state.prices[asset.id])}` : "Not available"}</span>
          </div>
        </div>
        ${buyAvailable
          ? `<span class="price-pill ${tier.className}" title="Price range: ${formatEuros(asset.minPrice)} to ${formatEuros(asset.maxPrice)}">${tier.label}</span>`
          : owned > 0
            ? '<span class="price-pill sell-only-pill">Sell only</span>'
            : '<span class="price-pill unavailable-pill">Unavailable</span>'}
        <span class="owned">Owned: ${owned}</span>
      </div>
      <div class="asset-actions">
        <button class="trade-button" type="button" data-buy="${asset.id}" aria-label="${buyTitle}" title="${buyTitle}" ${buyDisabled ? "disabled" : ""}>BUY</button>
        <button class="trade-button" type="button" data-sell="${asset.id}" aria-label="${sellTitle}" title="${sellTitle}" ${sellDisabled ? "disabled" : ""}>SELL</button>
      </div>
    `;
    marketList.append(row);
  });

  const pocketsList = document.getElementById("pockets-list");
  pocketsList.innerHTML = "";
  const ownedAssets = ASSETS.filter(asset => (state.inventory[asset.id] || 0) > 0);

  if (ownedAssets.length === 0) {
    pocketsList.innerHTML = '<p class="empty-state">Your pockets are empty.</p>';
  } else {
    ownedAssets.forEach(asset => {
      const assetCount = state.inventory[asset.id];
      const profit = profitForAsset(asset.id, state.prices[asset.id]);
      const item = document.createElement("div");
      item.className = "pocket-item";
      item.innerHTML = `
        <div>
          <div class="pocket-heading">${assetIcon(asset.id)}<div><strong>${assetCount}x ${asset.name}</strong>
          <span>Avg. cost ${formatEuros(state.costBasis[asset.id] || 0)}</span></div></div>
        </div>
        ${profit
          ? `<div class="pocket-profit ${profit.totalProfit >= 0 ? "profit-positive" : "profit-negative"}">
              <strong>${formatSignedEuros(profit.profitPerItem)} / item</strong>
              <span>${formatSignedPercent(profit.profitPercent)} - ${formatSignedEuros(profit.totalProfit)} total</span>
            </div>`
          : '<div class="pocket-profit"><span>Cost unknown</span></div>'}
      `;
      pocketsList.append(item);
    });
  }

  const travelList = document.getElementById("travel-list");
  travelList.innerHTML = "";
  LOCATIONS.forEach(destination => {
    if (destination.id === state.locationId) return;
    const contact = CONTACTS[destination.id];
    const previewPrices = previewLocationPrices(destination);
    let previewProfit = 0;
    let previewCount = 0;
    let profitableCount = 0;

    ownedAssets.forEach(asset => {
      const assetCount = state.inventory[asset.id] || 0;
      const profit = profitForAsset(asset.id, previewPrices[asset.id]);
      if (profit) {
        previewProfit += profit.totalProfit;
        previewCount += assetCount;
        if (profit.totalProfit > 0) profitableCount += assetCount;
      }
    });

    const button = document.createElement("button");
    button.type = "button";
    button.className = "travel-button";
    button.dataset.travel = destination.id;
    button.disabled = travelDisabled;
    button.title = travelDisabledReason;
    button.innerHTML = `
      <span class="travel-heading">${locationIcon(destination.id)}<strong>${destination.name}</strong></span>
      <span class="travel-contact"><span>Meet <strong>${contact.name}</strong>, ${contact.role.toLowerCase()}.</span>${contactPortrait(contact)}</span>
      <span class="travel-details">
        <span class="travel-profile">${destination.profile}</span>
        <span class="travel-inventory">${previewCount > 0
          ? `${previewCount} owned item${previewCount === 1 ? "" : "s"} - ${profitableCount} profitable - ${formatSignedEuros(previewProfit)} estimated`
          : "No owned items"}</span>
      </span>
    `;
    travelList.append(button);
  });

  const upgradeList = document.getElementById("upgrade-list");
  upgradeList.innerHTML = "";
  document.getElementById("storage-status").textContent =
    `${count} / ${state.capacity} pockets used. Each upgrade adds pockets and can be bought once, in any order.`;
  UPGRADES.forEach(upgrade => {
    const owned = state.upgrades.includes(upgrade.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "upgrade-button";
    button.dataset.upgrade = upgrade.id;
    button.disabled = owned;
    button.textContent = owned
      ? `${upgrade.name} - Owned (+${upgrade.capacityBonus} pockets)`
      : `${upgrade.name} - ${formatEuros(upgrade.cost)} - +${upgrade.capacityBonus} pockets`;
    upgradeList.append(button);
  });

  const repayOne = document.getElementById("repay-button");
  repayOne.textContent = "Repay 100 EUR";
  repayOne.disabled = state.debt <= 0 || state.cash < 100;

  const repayAll = document.getElementById("repay-all-button");
  repayAll.disabled = state.debt <= 0 || state.cash <= 0;

  document.getElementById("loan-status").textContent = state.debt > 0
    ? `Due at the end of day 10 - current debt ${formatEuros(state.debt)}`
    : "Loan repaid";
}

function showMessage(text, tone = "") {
  if (!notificationsEnabled) return;
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${tone || "neutral"}`;
  toast.setAttribute("role", "status");
  toast.textContent = text;
  container.append(toast);
  window.setTimeout(() => toast.remove(), 3500);
}
