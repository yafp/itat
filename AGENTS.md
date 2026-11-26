# AGENTS.md

## PROJECT

- Name: IT Asset Trader (ITAT)
- Genre: Simple browser-based trading game inspired by the core loop of Drug Wars
- Theme: Buy and sell IT assets, manage debt and inventory, and survive market events

## PROJECT IDEA

The player is an independent IT asset trader. Each day, the player can trade at one
location, travel to another location, and react to market events.

The MVP is a 30-day run. The 90-day mode is a future option.

The base game loop is:

1. Review the current location's prices and active events.
2. Buy or sell assets.
3. Choose a destination.
4. Travel to the destination.
5. Resolve the day's event.
6. Advance one day and update market prices.
7. Apply maintenance and debt rules.
8. Continue until the run ends or day 30 is reached.

The player wins by reaching the end of day 30 with enough net worth and without
triggering an automatic failure condition.

## MINIMUM VIABLE PRODUCT

The MVP includes:

- One 30-day game mode
- Six locations
- Sixteen assets
- Twenty-eight market events
- One local browser save
- Desktop and mobile-responsive layouts
- No account system, backend, or server leaderboard

Future features should be kept outside the MVP unless explicitly approved.

## AI USAGE
- Use the model which fits best for the task - and consumed the smallest amount of tokens.
- Try to be conservative
- Do not overspend token
- Test what is needed - but not more.

## TECHNOLOGIES

- HTML
- CSS
- JavaScript
- Browser Local Storage
- Responsive UI for desktop and mobile devices

No build framework or backend is required unless added after the MVP is complete.

We are not using 
- Python
- Node.JS

## CORE GAME TERMS

- **Day:** One turn; a maximum of one travel action occurs per completed day.
- **Cash:** Money currently available to the player.
- **Debt:** Borrowed money that must be repaid.
- **Net worth:** Cash minus debt plus the market value of inventory.
- **Inventory:** Assets currently carried by the player.
- **Capacity:** Maximum number of inventory units the player can carry.
- **Score:** The final ranking value calculated at the end of a run.

## STARTING CONDITIONS

- Starting cash: 2,000 EUR
- Starting debt: 5,000 EUR
- Starting capacity: 10 units
- Starting location: Student dorm
- Loan due: End of day 10

The 5,000 EUR loan is the starting debt and is not added to starting cash.

## LOAN RULES

The 5,000 EUR loan accumulates compound interest at 5% per completed day.

Interest is calculated once at the end of each completed day using:

`new debt = roundUp(debt * 1.05, 0)`

The debt grows during days 1-10 and must be repaid in full by the end of day 10.

- An unpaid loan causes an immediate game-over at the end of day 10.
- Debt may be repaid at any time for the current debt total.
- Partial repayment is allowed.
- Excessive borrowing beyond the starting loan is not available in the MVP.
- Interest stops when the debt reaches zero.

## TURN RULES

At each location, the player may:

- Buy or sell assets.
- Repay debt.
- Buy a capacity upgrade.
- Travel to one destination.

The player may make multiple trades at the current location before traveling, as long
as there is sufficient cash and inventory capacity.

After travel:

- The player advances exactly one day.
- Travel is free in the MVP.
- The selected location becomes the player's current location.

If the player finishes all actions and does not travel, the day does not advance.

## WIN AND LOSS CONDITIONS

### Win

The player wins at the end of day 30 if:

- The starting loan is repaid.
- The player has at least 8,000 EUR net worth.

### Failure

The run ends immediately when:

- The loan is unpaid at the end of day 10.
- The player chooses to retire early.

Early retirement ends the run as a partial completion, unless all win conditions
have also been met.

## SCORE

At the end of a run:

`score = cash - debt + inventory market value`

The displayed score must never be negative; show a minimum score of 0.

## LOCATIONS

- Student dorm
- Campus
- Refurbisher
- Shady IT reseller
- Data center
- Government auction

Each location uses the same market data structure but may have its own price
modifier and asset availability.

Suggested location modifiers:

| Location | Typical modifier |
|---|---:|
| Student dorm | 80%-120% |
| Campus | 90%-125% |
| Refurbisher | 70%-110% |
| Shady IT reseller | 60%-150% |
| Data center | 85%-140% |
| Government auction | 65%-130% |

Availability and modifiers must be configurable in data, not hardcoded in UI components.

### Location market profiles

Locations may define `categoryPriceModifiers` and `assetPriceModifiers`.
Missing modifiers default to 1; category and asset modifiers multiply together.
Both market generation and travel price estimates apply these profiles before
price clamping. Existing saved prices remain unchanged until the next market update.

- Student dorm: mobile devices +15%, peripherals +10%, laptops +15%.
- Campus: laptops +15%, monitors +20%, headsets +10%, keyboard-mouse +15%.
- Refurbisher: PCs -10%, with another -10% for servers and -15% for storage.
- Shady IT reseller: no extra modifiers; retains its wide 60%-150% price range.
- Data center: components +10%, servers +25%, storage +20%; consumer devices
  and peripherals are no longer available to buy here. Owned assets remain sellable.
- Government auction: PCs -15%, monitors -15%; no bulk or stock-limit mechanics.

The market displays the current location and its profile. Destination buttons also
show each profile. Higher prices benefit sellers but raise purchase costs.

## IT ASSETS

The MVP contains sixteen assets across these categories:

### PCs
- Laptop
- Desktop
- Server
- Storage device or NAS

For data-model purposes, `storage` is a marketable storage device or NAS asset,
while `ssd` remains an internal or component storage product.

### PC components

- RAM
- SSD
- GPU

### Peripherals

- YubiKey
- Headsets
- Keyboard & Mouse
- Monitor

### Licenses

- Windows license
- Microsoft Defender license

### Mobile devices

- iPhone
- Samsung phone
- iPad

Additional asset entries should remain future scope. The sixteen assets listed below
are the complete MVP set.

## ASSET PRICE RULES

Every asset must have a data entry containing:

- Stable ID
- Display name
- Base price
- Minimum market price
- Maximum market price
- Base quantity or available range
- Category
- Location preference or availability

Suggested base prices:

| Asset | Base price | Minimum price | Maximum price |
|---|---:|---:|---:|
| Laptop | 600 EUR | 150 EUR | 1,800 EUR |
| Desktop | 900 EUR | 225 EUR | 2,700 EUR |
| Server | 2,500 EUR | 625 EUR | 7,500 EUR |
| Storage device / NAS | 350 EUR | 88 EUR | 1,050 EUR |
| RAM | 80 EUR | 20 EUR | 240 EUR |
| SSD | 120 EUR | 30 EUR | 360 EUR |
| GPU | 450 EUR | 112 EUR | 1,350 EUR |
| YubiKey | 60 EUR | 15 EUR | 180 EUR |
| Headset | 80 EUR | 20 EUR | 240 EUR |
| Keyboard and mouse set | 50 EUR | 12 EUR | 150 EUR |
| Monitor | 250 EUR | 62 EUR | 750 EUR |
| Windows license | 100 EUR | 25 EUR | 300 EUR |
| Microsoft Defender license | 40 EUR | 10 EUR | 120 EUR |
| iPhone | 700 EUR | 175 EUR | 2,100 EUR |
| Samsung phone | 500 EUR | 125 EUR | 1,500 EUR |
| iPad | 600 EUR | 150 EUR | 1,800 EUR |

### Asset IDs

Use stable, lowercase asset IDs for code and save data:

- `laptop`
- `desktop`
- `server`
- `storage`
- `ram`
- `ssd`
- `gpu`
- `yubikey`
- `headset`
- `keyboard-mouse`
- `windows-license`
- `defender-license`
- `iphone`
- `samsung-phone`
- `ipad`
- `monitor`


Daily prices use this formula:

`current price = round(location base price * random modifier * event modifier, 0)`

Price changes are clamped to the asset's minimum and maximum prices.

Suggested random modifiers:

- Typical range: 85%-115%
- Event range: 70%-150%, depending on event severity

No single daily movement may exceed 50% compared with the previous day's price.

## STORAGE

The player begins with a capacity of 10 inventory units.
Each asset occupies one inventory unit in the MVP.

Storage upgrades:

| Upgrade | Cost | Extra pockets |
|---|---:|---:|
| Basic backpack | 500 EUR | +5 |
| Equipment case | 1,200 EUR | +15 |
| Mobile storage unit | 2,500 EUR | +30 |

A storage upgrade may be purchased once. Purchase is permitted only when the player
has sufficient cash. Upgrades add to existing capacity and may be bought in any
order; they never replace or reduce capacity. Buying all three gives 60 total
pockets, including the starting 10. Upgrade labels show the cost and added pockets
without a projected total; current capacity remains visible, and owned upgrades
show their contribution.

## MARKET EVENTS

An event is resolved after a successful travel action and applies to the next market
recalculation.

Each event entry must define:

- Stable ID
- Display name
- Description
- Probability weight
- Duration in days
- Affected asset IDs
- Price modifier

There is a 15% chance of no event per completed day.

Events from the previous day may remain active for their configured duration.
Multiple events may be active only if they affect different assets.

Suggested MVP events:

| Event | Asset impact |
|---|---|
| Windows 10 support ended | Laptop, desktop, server, and PC components: 110%-125% |
| Corporate hardware refresh | Laptop, desktop, server, and storage: 70%-85% |
| Critical vulnerability discovered | YubiKey, Windows license, and Defender: 120%-150% |
| Microsoft license audits | Windows and Defender licenses: 120%-140% |
| Semiconductor shortage | RAM, SSD, GPU, and storage: 125%-150% |
| Back-to-school demand | Laptop, mobile phones, and iPad: 115%-130% |
| Government recycling sale | Laptop, desktop, server, storage, and PC components: 65%-90% |
| Data-center decommission | Server, storage, desktop, RAM, SSD, and GPU: 70%-85% |

Additional MVP events:

| Event | Affected assets | Price modifier | Duration | Weight | Description |
|---|---|---:|---:|---:|---|
| Crypto mining boom | GPU | 135%-150% | 2 | 5 | GPUs suddenly become extremely desirable. |
| Crypto market crash | GPU | 60%-75% | 2 | 5 | Miners dump used GPUs onto the market. |
| SSD price war | SSD, storage | 65%-80% | 2 | 5 | Manufacturers aggressively cut storage prices. |
| RAM factory fire | RAM | 135%-150% | 3 | 5 | Supply disruption sends memory prices soaring. |
| Major cloud outage | Server, storage | 120%-140% | 2 | 5 | Companies panic-buy on-premises infrastructure. |
| Cloud migration wave | Server, storage | 65%-80% | 3 | 5 | Companies dispose of old on-prem hardware. |
| Remote-work boom | Laptop, headset, monitor | 120%-140% | 3 | 5 | Remote workers drive demand for home-office gear. |
| Return-to-office mandate | Laptop, headset | 75%-90% | 2 | 5 | Companies dump surplus remote-working hardware. |
| University semester starts | Laptop, monitor, keyboard-mouse | 115%-130% | 2 | 5 | Students scramble for affordable equipment. |
| Campus renovation clearance | Desktop, monitor, keyboard-mouse | 65%-80% | 2 | 5 | Old computer labs are cleared out cheaply. |
| Ransomware outbreak | Defender license, YubiKey, storage | 125%-150% | 2 | 5 | Security products and backup storage sell rapidly. |
| Passwordless security mandate | YubiKey | 130%-150% | 3 | 5 | Organizations urgently deploy hardware authentication. |
| New Windows release | Laptop, desktop, Windows license | 115%-130% | 3 | 5 | Hardware upgrades begin ahead of OS migrations. |
| Compatibility disaster | Laptop, desktop, Windows license | 75%-90% | 2 | 5 | Businesses delay purchases after widespread compatibility problems. |
| Smartphone launch day | iPhone, Samsung phone | 120%-140% | 1 | 5 | Demand spikes around new flagship devices. |
| Previous-generation phone clearance | iPhone, Samsung phone | 65%-85% | 2 | 5 | Retailers clear inventory after new models appear. |
| School tablet program | iPad | 125%-145% | 3 | 5 | A large education program creates sudden tablet demand. |
| Warehouse liquidation | Laptop, desktop, monitor, headset | 60%-80% | 1 | 5 | A reseller urgently liquidates excess inventory. |
| Supply chain restored | RAM, SSD, GPU | 70%-85% | 3 | 5 | Component shortages finally ease. |
| AI hardware frenzy | GPU, server, storage, RAM | 125%-150% | 3 | 5 | Everybody suddenly decides they need AI infrastructure. |

Events must clamp prices and affect only the configured assets.
Events should be shown clearly before recalculated prices are applied.
All 28 events include a short humorous story alongside the factual description,
affected assets, price range, and duration. Stories do not change event effects.
New events require explicit acknowledgement, including after reloading a pending turn.

## CHARACTERS AND RUN MEMORIES

Each location has a named character, a locally drawn SVG portrait, and three
rotating dialogue lines with useful hints about that location's actual demand:

- Student dorm: Alex, dorm-room tinkerer.
- Campus: Priya, campus IT fixer.
- Refurbisher: Rosa, second-chance hardware specialist.
- Shady IT reseller: Vik, extremely unofficial sales department.
- Data center: Morgan, very tired data-center technician.
- Government auction: Bernard, keeper of surplus and forms.

Dialogue is selected by day, without consuming randomness or changing prices.
Travel choices introduce the destination's character.

Normal sales use average-cost profit accounting. Track realized trading profit
(including losses), units sold by category, profit by asset, best profitable
sale, location visits, and the day the loan was actually repaid. Sales with
unknown historical cost count as sold but are explicitly excluded from profit
statistics.

Celebrate a new best profitable sale and full loan repayment with a brief
notification and a persistent latest-milestone message, without confetti or
required animation. Partial repayment and developer loan clearing do not earn
the repayment milestone.

The end summary preserves the actual win/failure outcome and adds a trading
alter ego, best sale by profit, favourite stop by visits, and realized trading
profit. Titles are cosmetic and do not change scores:

- Debt-Free Since Tuesday: fully repay the loan on or before day 5.
- Otherwise, Rack-to-Riches: servers produce the highest positive recorded
  profit among assets.
- Otherwise, The Dongle Baron / The License Whisperer: peripherals / licenses
  make up more than half of recorded units sold.
- Otherwise, The Second-Life Trader, or Trader in the Making if no sales exist.

## RANDOMNESS

All random decisions must use:

- A seedable pseudo-random number generator
- A fixed seed for testing and saved replays
- The random seed in the save data

The player should never receive a guaranteed unfair event at the start of the game.

## USER INTERFACE

Required UI:

- Current day and 30-day limit
- Cash and debt
- Inventory and capacity
- Net worth
- Current location
- Active event summary
- Asset list with buy/sell controls
- Travel destination selector
- Loan repayment control
- Storage upgrade controls
- Trading history showing day, location, trade type, asset, quantity, money,
  and sale profit/loss in money and percent
- Save and reset controls
- Game-over and win summary

The horizontal status bar places Day, Cash, Debt, and Net worth above the main
market column. Green Travel and red New game buttons align above the pockets /
developer-tools column on desktop, with a stacked layout on mobile. Travel also
remains in the sidebar. Travel, Loan, and Storage show matching local SVG illustrations.
The vertical navigation's app name and logo are visually separate from its links;
links show icons and labels on desktop and icons with hover labels on smaller screens.
After a run ends (including day 30), disable both Travel navigation buttons and
all destination buttons. A new game must re-enable them; the travel action itself
must also reject attempts beyond the final day.

Keep the desktop market compact and unobstructed: its two-column grid shows all
16 goods and their trade controls at a 1366-by-768 viewport without scrolling.
The location character/profile and latest milestone sit in the right sidebar
below Pockets, rather than above the goods. The market heading still identifies
the current location. On mobile, show the market before the stacked sidebar;
keep all information accessible without collapsed panels.
Travel destination cards place the location icon and name on the first row's left
and the contact portrait/name on its right. The location profile and owned-item
summary appear on the second row. The Highscores dialog uses its sidebar trophy
icon and a text Close button; the Settings dialog uses the same cog icon as its
navigation link.

Show centered, acknowledged loan-warning dialogs two days and one day before
the end-of-day-10 repayment deadline.
Loan-warning and market-event dialogs use an explicit `OK` action.

Small purchase and repayment actions should not require confirmation, but invalid
actions must show an immediate message.

Do not use color alone to communicate:

- Rising or falling prices
- Loan urgency
- Low capacity

Use text labels and symbols such as `+`, `-`, `Low`, `Due soon`, or `Critical`.

The interface must:

- Use readable tap targets for mobile devices
- Support keyboard navigation
- Provide visible keyboard focus
- Keep primary actions reachable at a 360-pixel viewport width
- Support reduced-motion preferences
- Avoid hiding essential information behind a collapsed panel

## LOCAL STORAGE

The game must support:

- One active save
- Automatic save after a completed day
- Automatic save after a purchase, sale, loan repayment, or upgrade
- Load at startup
- Manual reset with confirmation

The save format must include:

- Save version
- Random seed
- Current day
- Current location
- Cash
- Debt
- Capacity
- Inventory
- Active events
- Price map
- Upgrades
- Game status
- Chronological trade history with purchase cost and sale profit/loss records
- Acknowledged loan-warning days
- Run statistics and latest milestone

The application must validate loaded data and begin a new run if the save is missing,
invalid, or corrupted.

Save version 5 adds loan-warning acknowledgement state, retaining the existing
`itat-save-v1` slot. Version 4 added trade history. Version-1 saves first receive
the version-2 additive storage/no-health migration:
recalculate capacity as 10 plus all purchased bonuses and remove old health
fields. Version-1/2 saves then gain empty statistics tracked from their current
day; version-3 request data is discarded; version-4 saves gain unacknowledged
loan warnings. Do not invent historical trades, sales, visits, or repayment
dates; count the current location as the first tracked visit. Preserve cash,
inventory, prices, seed, pending events, run status, and highscore eligibility.
Persist migrated saves immediately; completed runs remain completed.

PostHog initializes on hosted HTTP(S) pages, but not on local `file://` runs, so
local filesystem paths are not sent to analytics.

### Local highscores

- A separate `itat-highscores-v1` local-storage entry holds up to 10 results.
- Rank by final net worth (cash + inventory market value - debt). Negative net
  worth is retained even though the displayed final score has a minimum of 0.
  Existing highscore entries remain unchanged.
- Results show player name (1-24 characters after trimming), money, and completion date.
- Both won and failed runs can qualify. Starting/resetting a run does not submit
  a result or erase the highscore list.
- A qualifying run offers optional name entry in the end summary, then opens the
  top 10 after saving. Earlier submitted results retain priority on ties.
- Each run has a stable ID to prevent duplicate submissions, including after reload.
- Ended saves restore their summary and any remaining name-entry opportunity.
- Invalid or inaccessible highscore storage shows an explicit error and is not
  silently overwritten.
- Highscores are accessible above Settings in the sidebar. The list explains that
  it is local to this browser/device, not global, and is removed with browser data.

## DATA MODEL GUIDELINES

Prefer plain JavaScript objects or JSON-style configuration for locations, assets,
and events.

Example data shapes:

```js
const location = {
  id: "student-dorm",
  name: "Student dorm",
  priceModifierMin: 0.80,
  priceModifierMax: 1.20,
  availableAssets: ["laptop", "ram", "ssd", "iphone"]
};

const asset = {
  id: "ram",
  name: "RAM",
  basePrice: 80,
  minPrice: 40,
  maxPrice: 160,
  category: "component"
};

const event = {
  id: "windows-10-support-ended",
  name: "Windows 10 support ended",
  description: "Laptop, desktop, server, and PC component prices increase.",
  weight: 8,
  duration: 2,
  affectedAssetIds: ["laptop", "desktop", "server", "ram", "ssd", "gpu"],
  priceModifierMin: 1.10,
  priceModifierMax: 1.25
};
```

The implementation may refine these structures, but stable IDs and save format must
remain backward-compatible or include migration logic.

## ACCEPTANCE CRITERIA

The MVP is complete when:

- A player can start a new 30-day run.
- Starting cash, debt, capacity, and location match the documented values.
- A player can buy, sell, repay debt, and purchase storage upgrades.
- A player can travel to exactly one location per completed day.
- Asset prices remain between each asset's configured minimum and maximum prices.
- Daily debt interest is calculated once and loan repayment is enforced on day 10.
- Centered loan-warning dialogs appear on days 8 and 9 and require an OK
  acknowledgement; acknowledging a warning persists across reloads.
- An event can affect only its configured assets and expires after its duration.
- The player can win or lose through the documented conditions.
- The final score and inventory market value are calculated correctly.
- A save can be created, reloaded, reset, and corrupted safely.
- The interface remains usable at a 360-pixel viewport width.
- Core controls are keyboard accessible.
- Refreshing the browser restores the active local save.
- All locations show their character and useful dialogue without rerolling prices.
- Trade history retains purchases and sales after reload, sorted by day; known
  sale costs show profit/loss as money and percent.
- Ordinary sales correctly record profit/loss and best-sale records.
- End summaries show an evidence-based title without replacing the real outcome.
- Version-1/2/3/4 saves migrate without losing progress or inventing run history.

## FUTURE FEATURES

Keep these outside the MVP:

- 90-day mode
- Multiple save slots
- Achievements
- Online leaderboards
- Competitor traders
- Supplier reputation
- Additional locations
- Additional asset categories
- Trade licenses or legality mechanics
- Real backend authentication
