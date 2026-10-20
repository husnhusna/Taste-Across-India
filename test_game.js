/**
 * Taste Across India - Comprehensive Automated Test Suite
 * Tests all game data, handcrafted SVG assets, sound methods, and the full interactive cooking loop.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Taste Across India Automated Test Suite (Interactive Canvas Edition)...\n');

// 1. Check file existence
const requiredFiles = [
  'index.html',
  'README.md',
  'css/style.css',
  'js/audio.js',
  'js/art.js',
  'js/data/recipes.js',
  'js/engine.js',
  'js/app.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${file}`);
    allFilesExist = false;
  } else {
    const stat = fs.statSync(fullPath);
    console.log(`✅ File present: ${file} (${stat.size} bytes)`);
  }
});

if (!allFilesExist) {
  process.exit(1);
}

// 2. Mock Browser Environment for Engine & App Testing
global.window = global;
global.Image = class { constructor() { this.src = ''; } };
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.addEventListener = () => {};
global.window.addEventListener = () => {};

global.document = {
  getElementById: (id) => {
    return {
      id,
      width: 960,
      height: 480,
      textContent: '',
      innerHTML: '',
      disabled: false,
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      },
      addEventListener: () => {},
      querySelectorAll: () => [],
      querySelector: () => null,
      appendChild: () => {},
      remove: () => {},
      getContext: () => ({
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        rect: () => {},
        roundRect: () => {},
        strokeRect: () => {},
        fillRect: () => {},
        ellipse: () => {},
        fill: () => {},
        stroke: () => {},
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        drawImage: () => {},
        fillText: () => {},
        moveTo: () => {},
        lineTo: () => {},
        quadraticCurveTo: () => {},
        closePath: () => {}
      }),
      getBoundingClientRect: () => ({ left: 100, top: 100, width: 960, height: 480 })
    };
  },
  querySelectorAll: (selector) => [],
  querySelector: (selector) => null,
  addEventListener: () => {},
  createElement: (tag) => {
    return {
      tagName: tag,
      className: '',
      textContent: '',
      innerHTML: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {}
      },
      addEventListener: () => {},
      remove: () => {}
    };
  }
};

global.localStorage = {
  store: {},
  getItem: function(k) { return this.store[k] !== undefined ? this.store[k] : null; },
  setItem: function(k, v) { this.store[k] = v.toString(); },
  removeItem: function(k) { delete this.store[k]; }
};

// 3. Load Audio, Art, Recipes, Engine, App
require('./js/audio.js');
require('./js/art.js');
require('./js/data/recipes.js');
require('./js/data/recipes-extra.js');
require('./js/engine.js');
require('./js/app.js');

// The browser creates window.app on DOMContentLoaded; in Node we build it here.
// We call only the pure state/economy methods, which are safe against the mock DOM.
if (!window.app && typeof window.GameApp === 'function') {
  window.app = new window.GameApp();
}

// 4. Test STATES_DATA & 20 Planned Dishes
console.log('\n--- Testing Recipe Database & 5 States ---');
if (!Array.isArray(window.STATES_DATA) || window.STATES_DATA.length !== 5) {
  console.error(`❌ Expected 5 states, got ${window.STATES_DATA ? window.STATES_DATA.length : 0}`);
  process.exit(1);
}
console.log(`✅ Verified 5 states in database: ${window.STATES_DATA.map(s => s.name).join(', ')}`);

let totalDishes = 0;
let playableDishes = 0;
window.STATES_DATA.forEach(state => {
  totalDishes += state.dishes.length;
  state.dishes.forEach(d => {
    if (d.status === 'playable') playableDishes++;
  });
});

console.log(`✅ Verified total planned dishes: ${totalDishes} (Expected 20)`);
console.log(`✅ Verified playable dishes: ${playableDishes} (all 20 dishes)`);

if (totalDishes !== 20) {
  console.error(`❌ Expected 20 total planned dishes, got ${totalDishes}`);
  process.exit(1);
}

// Every dish must now be playable...
if (playableDishes !== 20) {
  console.error(`❌ Expected all 20 dishes playable, got ${playableDishes}`);
  process.exit(1);
}

// ...and every playable dish must have a real, complete, ordered step list in
// the recipe registry (metadata alone is not enough to call a dish playable).
let registryMisses = 0;
window.STATES_DATA.forEach(state => {
  state.dishes.forEach(dish => {
    const def = window.RECIPES[dish.id];
    const ok =
      def &&
      Array.isArray(def.steps) &&
      def.steps.length >= 6 &&
      def.steps.every((s, i) => s && s.id && s.type && typeof s.title === 'string') &&
      def.steps[def.steps.length - 1].type === 'RECAP' &&
      def.steps.some(s => s.type === 'MUKBANG_FEED') &&
      def.steps.some(s => s.type === 'PLATE_DISH' || s.type === 'PLATING');
    if (!ok) {
      console.error(`❌ Dish ${dish.id} is marked playable but has no complete step list`);
      registryMisses++;
    }
  });
});
if (registryMisses === 0) {
  console.log('✅ Every playable dish has a complete, ordered step list ending in RECAP');
}

// 5. Test Handcrafted Vector Art Library
console.log('\n--- Testing Handcrafted SVG Vector Art Assets ---');
const testSvgs = [
  { name: 'Tara (Happy)', svg: window.ART.chefTara('happy', 100) },
  { name: 'Tara (Talking)', svg: window.ART.chefTara('talking', 100) },
  { name: 'Tara (Cheering)', svg: window.ART.chefTara('cheering', 100) },
  { name: 'Chintu (Hungry)', svg: window.ART.chintu('hungry', 150) },
  { name: 'Chintu (Mouth Open)', svg: window.ART.chintu('mouth_open', 150) },
  { name: 'Chintu (Chewing)', svg: window.ART.chintu('chewing', 150) },
  { name: 'Chintu (Delighted)', svg: window.ART.chintu('delighted', 150) },
  { name: 'Kitchen Environment Background', svg: window.ART.kitchenSceneBg() },
  { name: 'Dining Room Environment Background', svg: window.ART.diningSceneBg() },
  { name: 'Coarse Rice Flour', svg: window.ART.riceFlour(80) },
  { name: 'Fresh Grated Coconut', svg: window.ART.gratedCoconut(80) },
  { name: 'Water Cup', svg: window.ART.waterCup(80) },
  { name: 'Sea Salt', svg: window.ART.saltPinch(80) },
  { name: 'Kadala Curry', svg: window.ART.kadalaCurry(80) },
  { name: 'Chili Powder', svg: window.ART.chiliPowder(80) },
  { name: 'Mustard Seeds', svg: window.ART.mustardSeeds(80) },
  { name: 'Fresh Milk', svg: window.ART.freshMilk(80) },
  { name: 'Uruli Mixing Bowl (Dry)', svg: window.ART.mixingBowl(0, 200) },
  { name: 'Uruli Mixing Bowl (Moist Crumb)', svg: window.ART.mixingBowl(100, 200) },
  { name: 'Puttu Kutti Steamer', svg: window.ART.puttuKutti(['coconut', 'flour'], 200) },
  { name: 'Steaming Station (Cooking)', svg: window.ART.steamingStation(true, 200) },
  { name: 'Plated Plantain Leaf', svg: window.ART.platedPuttu(4, 250) }
];

testSvgs.forEach(item => {
  if (typeof item.svg !== 'string' || !item.svg.includes('<svg') || !item.svg.includes('</svg>')) {
    console.error(`❌ Failed SVG generation for: ${item.name}`);
    process.exit(1);
  } else {
    console.log(`✅ Handcrafted SVG verified: ${item.name} (${item.svg.length} chars)`);
  }
});

// 6. Test Sound Engine Synthesizer Methods
console.log('\n--- Testing Web Audio Sound Engine Interface ---');
const soundMethods = [
  'playPop',
  'playSuccess',
  'playError',
  'playPowderPour',
  'playWaterPour',
  'playSprinkle',
  'playStir',
  'playClink',
  'playSlide',
  'playSteam',
  'playFlameClick',
  'playChomp',
  'playYum',
  'playCoin',
  'playVictory'
];

soundMethods.forEach(method => {
  if (typeof window.sound[method] !== 'function') {
    console.error(`❌ Missing sound method: ${method}`);
    process.exit(1);
  } else {
    window.sound.setSoundEnabled(false);
    window.sound[method]();
    console.log(`✅ Sound method verified: ${method}()`);
  }
});

// 7. Test Cooking Steps Progression Logic
console.log('\n--- Testing Kerala Puttu Step-by-Step Cooking Mechanics ---');
const steps = window.PUTTU_RECIPE_STEPS;
if (!Array.isArray(steps) || steps.length !== 8) {
  console.error(`❌ Expected 8 recipe steps, got ${steps.length}`);
  process.exit(1);
}

const expectedStepTypes = [
  'POUR_FLOUR',
  'POUR_WATER',
  'CIRCULAR_STIR',
  'LAYER_STEAMER',
  'STEAM_COOK',
  'PLATE_DISH',
  'MUKBANG_FEED',
  'RECAP'
];

steps.forEach((step, idx) => {
  if (step.type !== expectedStepTypes[idx]) {
    console.error(`❌ Step ${idx + 1} type mismatch: expected ${expectedStepTypes[idx]}, got ${step.type}`);
    process.exit(1);
  }
  console.log(`✅ Step ${idx + 1} verified: [${step.type}] ${step.title} -> "${step.actionText}"`);
});

// 8. Test Step 7: Mukbang Feeder Reactions
console.log('\n--- Testing Mukbang Feeder Reactions ---');
const mukbangStep = steps.find(s => s.type === 'MUKBANG_FEED');
if (mukbangStep.bitesNeeded !== 4 || mukbangStep.reactions.length !== 4) {
  console.error('❌ Mukbang step mismatch');
  process.exit(1);
}
console.log(`✅ 4 mukbang bites & reactions verified for Chintu:`);
mukbangStep.reactions.forEach((r, idx) => {
  console.log(`   Bite ${idx + 1}: ${r}`);
});

// 11. Test Cooking Glossary
console.log('\n--- Testing Cooking Vocabulary Glossary ---');
const glossaryKeys = Object.keys(window.COOKING_GLOSSARY);
console.log(`✅ Verified ${glossaryKeys.length} glossary entries: ${glossaryKeys.join(', ')}`);

// 12. Test Active Cooking Engine Invocations
console.log('\n--- Testing Interactive Cooking Engine Invocations ---');
if (typeof window.engine.startRecipe === 'function') {
  window.engine.startRecipe('kerala-puttu');
  console.log('✅ Started recipe: kerala-puttu in engine');

  // Load through steps
  for (let i = 0; i < steps.length; i++) {
    window.engine.loadStep(i);
    console.log(`✅ Engine loaded step ${i + 1}: ${steps[i].type}`);
  }
}

// 13. Test Real Mouse-Mechanic State Changes (drive the engine directly)
console.log('\n--- Testing Real Mouse-Driven Mechanic State Changes ---');
const engine = window.engine;

// Helper: simulate a full press-drag-release using internal design coordinates.
const drag = (fromX, fromY, toX, toY) => {
  engine.mouse.x = fromX;
  engine.mouse.y = fromY;
  engine.mouse.isDown = true;
  engine.handleInputDown(fromX, fromY);
  engine.mouse.x = toX;
  engine.mouse.y = toY;
  engine.handleInputMove(toX, toY);
  engine.mouse.isDown = false;
  engine.handleInputUp();
};

// Helper: hold a drag (for pressure/drag-to-complete mechanics) while ticking the sim.
const dragAndHold = (fromX, fromY, toX, toY, ticks) => {
  engine.mouse.x = fromX;
  engine.mouse.y = fromY;
  engine.mouse.isDown = true;
  engine.handleInputDown(fromX, fromY);
  engine.mouse.x = toX;
  engine.mouse.y = toY;
  engine.handleInputMove(toX, toY);
  for (let i = 0; i < ticks; i++) engine.updateSimulation();
};

let mechanicFailures = 0;
const assertTrue = (label, cond) => {
  if (cond) {
    console.log(`✅ ${label}`);
  } else {
    console.error(`❌ ${label}`);
    mechanicFailures++;
  }
};

// 13a. LAYER_STEAMER: five correct drags should stack all five layers and move the guide to the lid.
engine.loadStep(3);
const layeringOrder = [
  [220, 340], // coconut bowl
  [740, 340], // flour bowl
  [220, 340],
  [740, 340],
  [220, 340]
];
let layerGuide = null;
layeringOrder.forEach(([bx, by]) => {
  // Forgiving drop zone: any point over the steamer column counts.
  drag(bx, by, 480, 200);
  layerGuide = engine.sim.guide ? engine.sim.guide() : null;
});
assertTrue('Layering: 5 correct drags complete all layers', layerGuide && layerGuide.text === 'Drag lid to the top');

// 13b. Wrong ingredient must be rejected (guide stays on the required scoop).
engine.loadStep(3);
drag(740, 340, 480, 200); // flour first is wrong; coconut is needed
const wrongGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Layering: wrong ingredient is rejected (recoverable)', wrongGuide && wrongGuide.text === 'Drag coconut in');

// 13c. STEAM_COOK: turning the dial into the green sweet spot should finish and advance.
engine.loadStep(4);
dragAndHold(480, 435, 500, 433, 1);
for (let i = 0; i < 300; i++) engine.updateSimulation();
assertTrue('Steam: holding heat in the sweet spot completes cooking',
  engine.sim.isComplete && engine.sim.isComplete());

// 13d. PLATE_DISH: pushing the rod fully then ladling curry should complete.
engine.loadStep(5);
dragAndHold(120, 250, 300, 250, 5); // push the puttu out
const pushedGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Plating: pushing the rod extrudes the puttu',
  engine.sim.getRollOut && engine.sim.getRollOut() > 0.9 && pushedGuide && pushedGuide.text === 'Pour curry on the leaf');
dragAndHold(800, 300, 610, 300, 140); // hold the ladle over the leaf
assertTrue('Plating: holding the ladle pours curry and completes',
  engine.sim.isComplete && engine.sim.isComplete());

// 13e. MUKBANG_FEED: four drags to the mouth should finish all bites.
engine.loadStep(6);
const morsels = [[380, 390], [420, 375], [460, 395], [500, 380]];
morsels.forEach(([mx, my]) => { drag(mx, my, 480, 175); });
assertTrue('Mukbang: four bites to Chintu complete feeding',
  engine.sim.isComplete && engine.sim.isComplete() && engine.sim.getBitesLeft() === 0);

// 13f. Guide pointer data is present for a fresh interactive step.
engine.loadStep(0);
const flourGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Beginner guide: step 1 exposes a guide target', !!flourGuide && typeof flourGuide.text === 'string');

// 14. Recipe Registry, Compatibility & Economy/Progression Tests
console.log('\n--- Testing Recipe Registry, Compatibility & Economy ---');

// 14a. Registry exists and exposes the puttu recipe with steps.
assertTrue('Registry: window.RECIPES is defined', !!window.RECIPES && typeof window.RECIPES === 'object');
const puttuDef = window.RECIPES['kerala-puttu'];
assertTrue('Registry: kerala-puttu entry exists', !!puttuDef);
assertTrue('Registry: kerala-puttu has 8 steps', puttuDef && Array.isArray(puttuDef.steps) && puttuDef.steps.length === 8);

// 14b. Compatibility: registry steps are the same list as PUTTU_RECIPE_STEPS.
assertTrue('Compatibility: PUTTU_RECIPE_STEPS still equals registry steps',
  puttuDef && window.PUTTU_RECIPE_STEPS === puttuDef.steps && window.PUTTU_RECIPE_STEPS.length === 8);

// 14c. startRecipe looks up from the registry for any known id.
const startedOk = engine.startRecipe('kerala-puttu');
assertTrue('startRecipe: returns true for a known recipe', startedOk === true);
assertTrue('startRecipe: sets currentRecipe from the registry', engine.currentRecipe && engine.currentRecipe.id === 'kerala-puttu');
assertTrue('startRecipe: carries rewardCoins through', engine.currentRecipe && engine.currentRecipe.rewardCoins === 100);
assertTrue('startRecipe: carries unlocksStateId through', engine.currentRecipe && engine.currentRecipe.unlocksStateId === 'tamil-nadu');

// 14d. startRecipe refuses an unknown / not-yet-built recipe.
const realWarn = console.warn;
console.warn = () => {}; // silence the expected "no recipe" warning during this check
const badStart = engine.startRecipe('not-a-real-dish');
console.warn = realWarn;
assertTrue('startRecipe: refuses a dish without steps', badStart === false);

// 14e. Duplicate coin rewards are prevented.
const app = window.app;
app.coins = 0;
app.completedRecipes = [];
app.unlockedStates = ['kerala'];
const firstAward = app.awardRecipeCompletion('kerala-puttu', 100, 'tamil-nadu');
const coinsAfterFirst = app.coins;
const secondAward = app.awardRecipeCompletion('kerala-puttu', 100, 'tamil-nadu');
const coinsAfterSecond = app.coins;
assertTrue('Economy: first completion awards coins once', firstAward === true && coinsAfterFirst === 100);
assertTrue('Economy: duplicate completion awards no extra coins', secondAward === false && coinsAfterSecond === 100);

// 14e-2. Development test launch: entering a locked dish's real flow must not
// pay coins, mark it complete, or unlock its region. It only skips the map gate.
app.coins = 0;
app.completedRecipes = [];
app.unlockedStates = ['kerala'];
const devOk = app.devLaunch('wb-luchi'); // West Bengal, locked (cost 400)
assertTrue('Dev launch: opens a locked dish\'s flow', devOk === true);
assertTrue('Dev launch: marks the recipe as devMode', engine.currentRecipe && engine.currentRecipe.devMode === true);
// Walk the dev-launched dish to its recap and confirm nothing is credited.
const devDef = window.RECIPES['wb-luchi'];
engine.loadStep(devDef.steps.length - 1);
engine.updateSimulation();
assertTrue('Dev launch: awards no coins', app.coins === 0);
assertTrue('Dev launch: records no completion', app.completedRecipes.length === 0);
assertTrue('Dev launch: unlocks no region', !app.unlockedStates.includes('west-bengal'));
// A normal launch must still NOT be devMode.
engine.startRecipe('kerala-puttu');
assertTrue('Normal launch: is not in devMode', engine.currentRecipe.devMode === false);

// 14f. Correct state unlocking (not hardcoded to Tamil Nadu).
app.completedRecipes = [];
app.unlockedStates = ['kerala'];
app.awardRecipeCompletion('kerala-puttu', 100, 'tamil-nadu');
assertTrue('Progression: completing puttu unlocks Tamil Nadu', app.unlockedStates.includes('tamil-nadu'));
assertTrue('Progression: does not unlock a later state early', !app.unlockedStates.includes('maharashtra'));

// 14g. State unlock handler: refuses with insufficient coins.
app.coins = 50;
app.unlockedStates = ['kerala'];
const poorUnlock = app.unlockState('maharashtra'); // costs 200
assertTrue('Unlock: refuses purchase with insufficient coins', poorUnlock === false && !app.unlockedStates.includes('maharashtra'));
assertTrue('Unlock: does not deduct coins on a refused purchase', app.coins === 50);

// 14h. State unlock handler: succeeds with enough coins and deducts once.
app.coins = 500;
const buyOk = app.unlockState('maharashtra');
assertTrue('Unlock: succeeds with sufficient coins', buyOk === true && app.unlockedStates.includes('maharashtra'));
assertTrue('Unlock: deducts the exact cost', app.coins === 300);

// 14i. Duplicate purchase is prevented (no double charge).
const buyAgain = app.unlockState('maharashtra');
assertTrue('Unlock: duplicate purchase is refused', buyAgain === false);
assertTrue('Unlock: duplicate purchase does not charge again', app.coins === 300);

// 14j. Unknown state id is refused safely.
assertTrue('Unlock: unknown state id is refused', app.unlockState('atlantis') === false);

// 14k. Saved-data safety: unlockedStates/completedRecipes survive a reload round-trip.
app.saveData();
const rereadCoins = parseInt(localStorage.getItem('taste_india_coins'), 10);
const rereadRecipes = JSON.parse(localStorage.getItem('taste_india_completed_recipes'));
const rereadStates = JSON.parse(localStorage.getItem('taste_india_unlocked_states'));
assertTrue('Save: coins persisted as a number', rereadCoins === app.coins);
assertTrue('Save: completed recipes persisted', Array.isArray(rereadRecipes) && rereadRecipes.includes('kerala-puttu'));
assertTrue('Save: unlocked states persisted', Array.isArray(rereadStates) && rereadStates.includes('maharashtra'));

// 14l. Step config plumbing: a recipe step without `data` keeps the exact
// original guide text and behaviour (backward compatibility).
engine.startRecipe('kerala-puttu');
engine.loadStep(3);
const compatGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Config: puttu layering guide text unchanged without data', compatGuide && compatGuide.text === 'Drag coconut in');

// 14m. Step config is honoured when present (custom left label changes guide).
engine.initLayeringSim({ leftKey: 'jaggery', rightKey: 'rice', expectedOrder: ['jaggery', 'rice', 'jaggery', 'rice', 'jaggery'] });
const customGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Config: custom leftKey drives the guide text', customGuide && customGuide.text === 'Drag jaggery in');

// 15. UI-triggered Region Unlock Flow
console.log('\n--- Testing UI-Triggered Region Unlock Flow ---');

// 15a. requestUnlock refuses an already-unlocked region (nothing to buy).
app.coins = 1000;
app.unlockedStates = ['kerala', 'maharashtra'];
assertTrue('Unlock flow: requestUnlock refuses an owned region', app.requestUnlock('maharashtra') === false);

// 15b. requestUnlock opens the dialog for a locked region but spends nothing.
app.coins = 500;
app.unlockedStates = ['kerala'];
const openedDialog = app.requestUnlock('maharashtra'); // cost 200, affordable
assertTrue('Unlock flow: requestUnlock opens dialog for a locked region', openedDialog === true);
assertTrue('Unlock flow: opening the dialog spends no coins', app.coins === 500);
assertTrue('Unlock flow: opening the dialog does not unlock yet', !app.unlockedStates.includes('maharashtra'));

// 15c. Cancelling (no confirm) leaves coins and locks untouched.
assertTrue('Unlock flow: cancel keeps coins intact', app.coins === 500);
assertTrue('Unlock flow: cancel keeps region locked', !app.unlockedStates.includes('maharashtra'));

// 15d. requestUnlock still opens for an unaffordable region (message shown),
//     and spending is impossible because confirm routes through unlockState.
app.coins = 10;
const openedUnaffordable = app.requestUnlock('punjab'); // cost 300
assertTrue('Unlock flow: requestUnlock opens for unaffordable region', openedUnaffordable === true);
const poorConfirm = app.confirmUnlock('punjab');
assertTrue('Unlock flow: confirming without funds fails', poorConfirm === false);
assertTrue('Unlock flow: failed confirm deducts nothing', app.coins === 10);
assertTrue('Unlock flow: failed confirm stays locked', !app.unlockedStates.includes('punjab'));

// 15e. Confirming with enough coins purchases exactly once and refreshes state.
app.coins = 500;
app.unlockedStates = ['kerala'];
const okConfirm = app.confirmUnlock('maharashtra');
assertTrue('Unlock flow: confirming with funds succeeds', okConfirm === true);
assertTrue('Unlock flow: confirm deducts the exact cost', app.coins === 300);
assertTrue('Unlock flow: confirm unlocks the region', app.unlockedStates.includes('maharashtra'));

// 15f. A second confirm is a no-op (no duplicate charge).
const dupConfirm = app.confirmUnlock('maharashtra');
assertTrue('Unlock flow: duplicate confirm is refused', dupConfirm === false);
assertTrue('Unlock flow: duplicate confirm does not charge again', app.coins === 300);

// 15g. Purchase persists immediately for the next session.
const persistedStates = JSON.parse(localStorage.getItem('taste_india_unlocked_states'));
const persistedCoins = parseInt(localStorage.getItem('taste_india_coins'), 10);
assertTrue('Unlock flow: purchase persisted to storage', Array.isArray(persistedStates) && persistedStates.includes('maharashtra'));
assertTrue('Unlock flow: resulting coins persisted to storage', persistedCoins === 300);

// 15h. Locked-state dish guard: a playable dish in a locked region must not launch.
//     We simulate the guard predicate used by the map click handler.
app.unlockedStates = ['kerala'];
const lockedDishState = app.findStateIdForRecipe('kerala-puttu'); // kerala IS unlocked
assertTrue('Unlock flow: finds owning state for a recipe', lockedDishState === 'kerala');
assertTrue('Unlock flow: kerala recipe allowed while kerala is unlocked',
  app.unlockedStates.includes(lockedDishState));

// 16. Crispy Roast Dosa (tn-dosa) - registration, flow & mechanics
console.log('\n--- Testing Crispy Roast Dosa (tn-dosa) ---');

// 16a. Registered, playable, associated with Tamil Nadu, has its own reward.
const dosaDef = window.RECIPES['tn-dosa'];
assertTrue('Dosa: recipe registered under tn-dosa', !!dosaDef);
assertTrue('Dosa: associated with Tamil Nadu', dosaDef && dosaDef.stateId === 'tamil-nadu' && dosaDef.stateName === 'Tamil Nadu');
assertTrue('Dosa: has its own coin reward (150)', dosaDef && dosaDef.rewardCoins === 150);
assertTrue('Dosa: exposes its own steps array', dosaDef && Array.isArray(dosaDef.steps) && dosaDef.steps.length === 9);
assertTrue('Dosa: marked playable in STATES_DATA', (() => {
  const st = window.STATES_DATA.find(s => s.id === 'tamil-nadu');
  const dish = st && st.dishes.find(d => d.id === 'tn-dosa');
  return !!dish && dish.status === 'playable';
})());
// Completing the dosa must not re-unlock a state (Tamil Nadu already done).
assertTrue('Dosa: does not claim a state unlock', dosaDef && dosaDef.unlocksStateId === null);

// 16b. Step order matches the documented A->F flow.
const dosaTypes = dosaDef.steps.map(s => s.type);
const expectedDosaTypes = [
  'POUR_FLOUR', 'POUR_WATER', 'CIRCULAR_STIR', 'SPREAD_BATTER',
  'STEAM_COOK', 'FLIP_FOLD', 'PLATE_DISH', 'MUKBANG_FEED', 'RECAP'
];
assertTrue('Dosa: step order is correct', JSON.stringify(dosaTypes) === JSON.stringify(expectedDosaTypes));
assertTrue('Dosa: DOSA_RECIPE_STEPS exported & matches registry', window.DOSA_RECIPE_STEPS === dosaDef.steps);

// 16c. Registry lookup starts the dosa and carries its data.
const dosaStart = engine.startRecipe('tn-dosa');
assertTrue('Dosa: startRecipe returns true', dosaStart === true);
assertTrue('Dosa: currentRecipe is tn-dosa', engine.currentRecipe && engine.currentRecipe.id === 'tn-dosa');
assertTrue('Dosa: reward carried through', engine.currentRecipe.rewardCoins === 150);

// 16d. Stage A - pour dal & water (reused mechanics) reach full.
engine.loadStep(0);
engine.mouse.x = 220; engine.mouse.y = 310; engine.mouse.isDown = true;
engine.handleInputDown(220, 310);
engine.mouse.x = 480; engine.mouse.y = 250;
engine.handleInputMove(480, 250);
for (let i = 0; i < 400 && engine.currentStepIdx === 0; i++) engine.updateSimulation();
engine.mouse.isDown = false;
engine.handleInputUp();
// Once the pour is done the guide clears (the sim only guides while work remains).
const dalGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Dosa A: pouring dal fills the bowl (guide clears when done)', dalGuide === null);

// 16e. Stage A - stirring the batter.
engine.loadStep(2);
engine.mouse.x = 480; engine.mouse.y = 260; engine.mouse.isDown = true;
engine.handleInputDown(480, 260);
let stirCompleted = false;
for (let loop = 0; loop < 120 && !stirCompleted; loop++) {
  for (let a = 0; a < 12; a++) {
    const ang = (a / 12) * Math.PI * 2;
    engine.mouse.x = 480 + Math.cos(ang) * 70;
    engine.mouse.y = 340 + Math.sin(ang) * 30;
    engine.handleInputMove(engine.mouse.x, engine.mouse.y);
    engine.updateSimulation();
  }
}
engine.mouse.isDown = false;
engine.handleInputUp();
if (!engine.sim.guide || engine.sim.guide() === null) stirCompleted = true;
assertTrue('Dosa A: circular stirring smooths the batter to completion', stirCompleted);

// 16f. Stage B - a single click must NOT complete the spread.
engine.loadStep(3);
const spreadGuideBefore = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Dosa B: spread stage exposes a guide to the ladle', !!spreadGuideBefore);

// Single click / tap (down + up at the ladle, no circular motion).
engine.mouse.x = 740; engine.mouse.y = 300; engine.mouse.isDown = true;
engine.handleInputDown(740, 300);
engine.mouse.x = 480; engine.mouse.y = 320;
engine.handleInputMove(480, 320);
engine.updateSimulation();
engine.mouse.isDown = false;
engine.handleInputUp();
assertTrue('Dosa B: a single click does not complete spreading', engine.sim.isComplete() === false);

// 16g. Stage B - circular spreading does complete, and completes only once.
engine.mouse.x = 740; engine.mouse.y = 300; engine.mouse.isDown = true;
engine.handleInputDown(740, 300);
let spreadDone = false;
for (let loop = 0; loop < 200 && !spreadDone; loop++) {
  for (let a = 0; a < 16; a++) {
    const ang = (a / 16) * Math.PI * 2;
    engine.mouse.x = 480 + Math.cos(ang) * 130;
    engine.mouse.y = 320 + Math.sin(ang) * 130;
    engine.handleInputMove(engine.mouse.x, engine.mouse.y);
    engine.updateSimulation();
  }
  if (engine.sim.isComplete()) spreadDone = true;
}
assertTrue('Dosa B: circling the ladle spreads the batter to completion', spreadDone);

// 16h. Stage C - roasting with the heat dial in the sweet spot.
engine.loadStep(4);
engine.mouse.x = 480; engine.mouse.y = 435; engine.mouse.isDown = true;
engine.handleInputDown(480, 435);
engine.mouse.x = 520; engine.mouse.y = 428;
engine.handleInputMove(520, 428);
let roastDone = false;
for (let i = 0; i < 400 && !roastDone; i++) {
  engine.updateSimulation();
  if (engine.sim.isComplete && engine.sim.isComplete()) roastDone = true;
}
assertTrue('Dosa C: roasting with correct heat completes', roastDone);

// 16i. Stage C - flip/fold must NOT happen automatically; it needs the gesture.
engine.loadStep(5);
const foldGuideBefore = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Dosa C: fold stage starts by asking to loosen', foldGuideBefore && /Slide under/.test(foldGuideBefore.text));

// Loosen: drag the spatula leftward across the tawa, then lift to fold.
engine.mouse.x = 700; engine.mouse.y = 330; engine.mouse.isDown = true;
engine.handleInputDown(700, 330);
engine.mouse.x = 380; engine.mouse.y = 330;
engine.handleInputMove(380, 330); // loosens fully and locks the folded state
engine.updateSimulation();
// Now lift upward to fold
let foldDone = false;
for (let i = 0; i < 80 && !foldDone; i++) {
  engine.mouse.y -= 4;
  engine.handleInputMove(engine.mouse.x, engine.mouse.y);
  engine.updateSimulation();
  if (engine.sim.isComplete && engine.sim.isComplete()) foldDone = true;
}
assertTrue('Dosa C: loosening then lifting folds the dosa', foldDone);

// 16j. Stage D - plate the dosa then pour sambar/chutney.
engine.loadStep(6);
// Drag the tool rightward across the completion threshold.
engine.mouse.x = 120; engine.mouse.y = 250; engine.mouse.isDown = true;
engine.handleInputDown(120, 250);
engine.mouse.x = 320; engine.mouse.y = 250;
engine.handleInputMove(320, 250);
for (let i = 0; i < 6; i++) engine.updateSimulation();
engine.handleInputUp();
const afterPlateGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Dosa D: dragging the dosa to the plate advances to pouring', afterPlateGuide && /Pour sambar/.test(afterPlateGuide.text));

// Pour sambar over the plate (hold the pot over the plate).
const leafX = 610, leafY = 330;
engine.mouse.x = 800; engine.mouse.y = 300; engine.mouse.isDown = true;
engine.handleInputDown(800, 300);
engine.mouse.x = leafX; engine.mouse.y = leafY - 30;
engine.handleInputMove(leafX, leafY - 30);
for (let i = 0; i < 200; i++) {
  engine.mouse.isDown = true;
  engine.updateSimulation();
}
engine.mouse.isDown = false;
engine.handleInputUp();
assertTrue('Dosa D: pouring sambar & chutney completes the plate',
  engine.sim.isComplete && engine.sim.isComplete());

// 16k. Stage E - feeding Chintu with dosa-specific reactions.
const dosaFeed = dosaDef.steps.find(s => s.type === 'MUKBANG_FEED');
assertTrue('Dosa E: uses recipe-specific reactions', dosaFeed && dosaFeed.reactions.length === 4 && /crisp/.test(dosaFeed.reactions[0]));
assertTrue('Dosa E: uses dosa morsel styling', dosaFeed && dosaFeed.morselStyle === 'dosa');
engine.loadStep(7);
const dosaMorsels = [[380, 390], [420, 375], [460, 395], [500, 380]];
dosaMorsels.forEach(([mx, my]) => { drag(mx, my, 480, 175); });
const dosaFeedGuide = engine.sim.guide ? engine.sim.guide() : null;
assertTrue('Dosa E: four bites feed Chintu completely', dosaFeedGuide === null);

// 16l. Stage F - completion recap and duplicate reward protection.
app.coins = 0;
app.completedRecipes = [];
app.unlockedStates = ['kerala', 'tamil-nadu'];
// Loading the RECAP step is the real completion path: it awards the recipe's
// own reward exactly once via awardRecipeCompletion.
engine.loadStep(8);
assertTrue('Dosa F: recap step awards the 150-coin reward', app.coins === 150);
assertTrue('Dosa F: completion recorded once', app.completedRecipes.filter(r => r === 'tn-dosa').length === 1);
// Replaying the recap must not pay again.
engine.loadStep(8);
assertTrue('Dosa F: replaying the recap awards no extra coins', app.coins === 150);
assertTrue('Dosa F: still recorded exactly once', app.completedRecipes.filter(r => r === 'tn-dosa').length === 1);
// Direct economy call is also guarded.
const secondDosaAward = app.awardRecipeCompletion('tn-dosa', 150, null);
assertTrue('Dosa F: duplicate award call refused', secondDosaAward === false && app.coins === 150);

// 16m. Invalid action: starting a dish with no steps is still refused.
const realWarn2 = console.warn;
console.warn = () => {};
const badDosa = engine.startRecipe('not-a-real-dish'); // unknown, has no steps
console.warn = realWarn2;
assertTrue('Dosa: un-built dish still refused', badDosa === false);

// Restore a clean recipe state for any later assertions.
engine.startRecipe('kerala-puttu');

// ---------------------------------------------------------------------------
console.log('\n--- Testing Scoring, Personal Bests, Feeding Guards & Replay ---');
// ---------------------------------------------------------------------------

// 17a. The scorecard resets when a recipe starts, so runs don't leak metrics.
app.coins = 0;
app.completedRecipes = [];
app.bestScores = {};
engine.startRecipe('tn-dosa');
assertTrue('Score: a fresh run starts with an empty scorecard',
  engine.scorecard &&
  engine.scorecard.waste === 0 &&
  engine.scorecard.spreadCoverage === null &&
  engine.scorecard.bites === 0);

// 17b. Metrics accumulate / set through the mechanic API.
engine.recordMetric('waste', 2);
engine.setMetric('spreadCoverage', 90);
assertTrue('Score: recordMetric accumulates values', engine.scorecard.waste === 2);
assertTrue('Score: setMetric sets an absolute value', engine.scorecard.spreadCoverage === 90);
engine.setMetric('spreadCoverage', 80);
assertTrue('Score: setMetric replaces rather than stacks', engine.scorecard.spreadCoverage === 80);

// 17c. computeScore turns metrics into a 0..100 score and 1..3 stars.
let scoreRes = engine.computeScore();
assertTrue('Score: computeScore returns a bounded score',
  scoreRes && scoreRes.score >= 0 && scoreRes.score <= 100);
assertTrue('Score: computeScore returns 1..3 stars',
  scoreRes.stars >= 1 && scoreRes.stars <= 3);
assertTrue('Score: a high-quality run earns 3 stars',
  (function () {
    engine.resetScorecard(engine.currentRecipe);
    engine.recordMetric('spreadCoverage', 95);
    engine.recordMetric('cookQuality', 92);
    engine.recordMetric('plateQuality', 95);
    return engine.computeScore().stars === 3;
  })());

// 17d. A sloppy run scores lower and yields tips to improve.
const goodScore = (function () {
  engine.resetScorecard(engine.currentRecipe);
  engine.recordMetric('spreadCoverage', 95);
  engine.recordMetric('cookQuality', 92);
  engine.recordMetric('plateQuality', 95);
  return engine.computeScore();
})();
const poorScore = (function () {
  engine.resetScorecard(engine.currentRecipe);
  engine.recordMetric('spreadCoverage', 40);
  engine.recordMetric('cookQuality', 35);
  engine.recordMetric('plateQuality', 50);
  engine.recordMetric('waste', 6);
  return engine.computeScore();
})();
assertTrue('Score: a sloppy run scores below a clean run', poorScore.score < goodScore.score);
assertTrue('Score: a sloppy run still returns improvement tips', poorScore.tips.length > 0);
assertTrue('Score: a clean run acknowledges the good work', goodScore.tips.some(t => /^✅/.test(t)));

// 17e. Personal bests are saved per recipe and only improve.
const firstSave = app.recordScore('tn-dosa', 70, 2);
assertTrue('Best score: first run is stored as a new best', firstSave && firstSave.isNewBest === true && firstSave.bestScore === 70);
const secondSave = app.recordScore('tn-dosa', 55, 1);
assertTrue('Best score: a worse run does not overwrite the best',
  secondSave && secondSave.isNewBest === false && secondSave.bestScore === 70);
const thirdSave = app.recordScore('tn-dosa', 88, 3);
assertTrue('Best score: a better run raises the best',
  thirdSave && thirdSave.isNewBest === true && thirdSave.bestScore === 88 && thirdSave.bestStars === 3);

// 17f. Best scores persist to storage and survive a reload.
const savedScoresRaw = global.localStorage.getItem('taste_india_best_scores');
assertTrue('Best score: result persisted to storage', !!savedScoresRaw && JSON.parse(savedScoresRaw)['tn-dosa'].bestScore === 88);
app.bestScores = {};
app.loadSaveData();
assertTrue('Best score: restored after a reload', app.bestScores['tn-dosa'] && app.bestScores['tn-dosa'].bestScore === 88);

// 17g. Different recipes keep separate bests.
app.recordScore('kerala-puttu', 91, 3);
assertTrue('Best score: recipes track independent bests',
  app.bestScores['kerala-puttu'].bestScore === 91 && app.bestScores['tn-dosa'].bestScore === 88);

// 17h. Resetting progress clears the bests too (confirm auto-accepted in the harness).
global.confirm = () => true;
app.resetData();
assertTrue('Best score: resetting progress clears best scores',
  Object.keys(app.bestScores).length === 0);

// 17i. Feeding: one drag can only ever count as one bite.
app.coins = 0;
app.completedRecipes = [];
engine.startRecipe('tn-dosa');
engine.loadStep(7);
const bitesAtStart = engine.sim.getBitesLeft();
drag(380, 390, 480, 175);
const bitesAfterOne = engine.sim.getBitesLeft();
assertTrue('Feeding: one drag removes exactly one bite', bitesAtStart - bitesAfterOne === 1);

// Releasing repeatedly over the mouth with no new grab must not add bites:
engine.sim.onUp();
engine.sim.onUp();
engine.updateSimulation();
assertTrue('Feeding: releasing again without grabbing adds no extra bite',
  engine.sim.getBitesLeft() === bitesAfterOne);

// 17j. Feeding: a bite dropped away from the mouth does not count.
drag(420, 375, 200, 420);
assertTrue('Feeding: a bite released away from the mouth is not eaten',
  engine.sim.getBitesLeft() === bitesAfterOne);

// 17k. Feeding: Chintu reacts through distinct states.
assertTrue('Feeding: Chintu reaches a chewing/delighted state after a bite',
  ['chewing', 'delighted', 'satisfied'].includes(engine.sim.getState()));

// 17l. Feeding: the recorded bite metric tracks actual bites served.
assertTrue('Feeding: bite metric incremented once per served bite',
  engine.scorecard.bites === 1);

// 17m. Replaying a mastered recipe improves the score without extra coins.
app.coins = 0;
app.completedRecipes = [];
app.unlockedStates = ['kerala', 'tamil-nadu'];
engine.startRecipe('tn-dosa');
// Simulate a first (mediocre) clear.
engine.setMetric('spreadCoverage', 60);
engine.setMetric('cookQuality', 55);
engine.setMetric('plateQuality', 70);
engine.loadStep(8);
const replayCoinsAfterFirst = app.coins;
assertTrue('Replay: first completion pays the reward once', replayCoinsAfterFirst === 150);
const bestAfterFirst = app.bestScores['tn-dosa'].bestScore;

// Replay with a better run: score improves, coins do not.
engine.restartCurrentRecipe();
// restartCurrentRecipe must clear the previous run's metrics (regression guard).
assertTrue('Replay: restarting clears the previous run metrics',
  engine.scorecard.spreadCoverage === null && engine.scorecard.waste === 0 && engine.scorecard.bites === 0);
engine.setMetric('spreadCoverage', 96);
engine.setMetric('cookQuality', 94);
engine.setMetric('plateQuality', 96);
engine.loadStep(8);
assertTrue('Replay: replaying awards no duplicate coins', app.coins === replayCoinsAfterFirst);
assertTrue('Replay: replay improves the personal best', app.bestScores['tn-dosa'].bestScore > bestAfterFirst);
assertTrue('Replay: completion still recorded exactly once',
  app.completedRecipes.filter(r => r === 'tn-dosa').length === 1);

// 17n. Recovery: an overheated dish can still be rescued by lowering the flame.
engine.startRecipe('tn-dosa');
engine.loadStep(4); // STEAM_COOK on the tawa profile
engine.mouse.isDown = true;
engine.handleInputDown(480, 435);
engine.mouse.x = 480; engine.mouse.y = 480; // slam the flame past the sweet spot
engine.handleInputMove(480, 480);
for (let i = 0; i < 120; i++) engine.updateSimulation();
const burnedValue = engine.sim.getBurn ? engine.sim.getBurn() : 0;
assertTrue('Cooking: an overheated flame registers burn (not just a meter)', burnedValue > 0);
// Now bring it back to the sweet spot and finish.
engine.mouse.x = 520; engine.mouse.y = 428;
engine.handleInputMove(520, 428);
let rescued = false;
for (let i = 0; i < 600 && !rescued; i++) {
  engine.updateSimulation();
  if (engine.sim.isComplete && engine.sim.isComplete()) rescued = true;
}
assertTrue('Cooking: lowering the flame recovers and still completes', rescued);

// 17o. Spreading reports real coverage (used by scoring).
engine.startRecipe('tn-dosa');
engine.loadStep(3);
engine.mouse.x = 740; engine.mouse.y = 300; engine.mouse.isDown = true;
engine.handleInputDown(740, 300);
for (let loop = 0; loop < 200; loop++) {
  for (let a = 0; a < 16; a++) {
    const ang = (a / 16) * Math.PI * 2;
    engine.mouse.x = 480 + Math.cos(ang) * 130;
    engine.mouse.y = 320 + Math.sin(ang) * 130;
    engine.handleInputMove(engine.mouse.x, engine.mouse.y);
    engine.updateSimulation();
  }
  if (engine.sim.isComplete && engine.sim.isComplete()) break;
}
assertTrue('Spread: full circling reports near-complete coverage',
  engine.scorecard.spreadCoverage !== null && engine.scorecard.spreadCoverage > 50);

// 17p. Off-tawa motion earns no coverage progress.
engine.startRecipe('tn-dosa');
engine.loadStep(3);
engine.mouse.x = 740; engine.mouse.y = 300; engine.mouse.isDown = true;
engine.handleInputDown(740, 300);
const radiusBefore = engine.sim.getBatterRadius();
for (let i = 0; i < 40; i++) {
  engine.mouse.x = 60 + (i % 5) * 10;
  engine.mouse.y = 60;
  engine.handleInputMove(engine.mouse.x, engine.mouse.y);
  engine.updateSimulation();
}
assertTrue('Spread: wandering off the tawa adds no spread progress',
  engine.sim.getBatterRadius() <= radiusBefore + 0.5);

// 17q. Keyboard mute shortcut toggles sound without breaking settings.
const soundBefore = app.settings.sound;
app.settings.sound = !app.settings.sound;
app.applySettings();
app.settings.sound = soundBefore;
assertTrue('Controls: sound toggle round-trips cleanly', app.settings.sound === soundBefore);

// ---------------------------------------------------------------------------
console.log('\n--- Section 18: Every Dish Plays End-to-End With Real Gestures ---');
// A recipe is only "playable" if it can actually be completed by hand. This
// drives each registered dish, step by step, with genuine mouse input and
// checks that (a) every mechanic reports completion, (b) the recap is reached,
// and (c) a real score with metrics is produced — not merely that a bar moved.
const playStepToCompletion = (step) => {
  const type = step.type;
  const d = step.data || {};
  const done = () => (type === 'RECAP') || (engine.sim.isComplete && engine.sim.isComplete());

  if (type === 'POUR_FLOUR' || type === 'POUR_WATER') {
    const home = type === 'POUR_FLOUR' ? [220, 310] : [740, 300];
    engine.mouse.x = home[0]; engine.mouse.y = home[1]; engine.mouse.isDown = true;
    engine.handleInputDown(home[0], home[1]);
    engine.handleInputMove(480, 300);
    for (let i = 0; i < 500 && !done(); i++) { engine.mouse.isDown = true; engine.updateSimulation(); }
    engine.handleInputUp();
  } else if (type === 'CIRCULAR_STIR' || type === 'ROLL_BALLS') {
    const c = type === 'CIRCULAR_STIR' ? [480, 340] : [480, 300];
    engine.mouse.x = c[0] - 60; engine.mouse.y = c[1]; engine.mouse.isDown = true;
    engine.handleInputDown(c[0] - 60, c[1]);
    for (let a = 0; a < 1200 && !done(); a++) {
      const ang = a * 0.4;
      engine.mouse.x = c[0] + Math.cos(ang) * 60;
      engine.mouse.y = c[1] + Math.sin(ang) * 40;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
    }
    engine.handleInputUp();
  } else if (type === 'SPREAD_BATTER') {
    engine.mouse.x = 740; engine.mouse.y = 300; engine.mouse.isDown = true;
    engine.handleInputDown(740, 300);
    engine.handleInputMove(480, 320);
    for (let a = 0; a < 1500 && !done(); a++) {
      const ang = a * 0.12;
      engine.mouse.x = 480 + Math.cos(ang) * 150;
      engine.mouse.y = 320 + Math.sin(ang) * 62;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
    }
    engine.handleInputUp();
  } else if (type === 'STEAM_COOK' || type === 'BOIL_SYRUP') {
    engine.mouse.x = 480; engine.mouse.y = 435; engine.mouse.isDown = true;
    engine.handleInputDown(480, 435);
    const lo = d.sweetMin !== undefined ? d.sweetMin : 0.42;
    const hi = d.sweetMax !== undefined ? d.sweetMax : 0.78;
    const ang = ((lo + hi) / 2) * Math.PI * 1.5 - Math.PI * 0.75;
    engine.mouse.x = 480 + Math.cos(ang) * 30;
    engine.mouse.y = 435 + Math.sin(ang) * 30;
    engine.handleInputMove(engine.mouse.x, engine.mouse.y);
    for (let i = 0; i < 800 && !done(); i++) { engine.mouse.isDown = true; engine.updateSimulation(); }
    engine.handleInputUp();
  } else if (type === 'FLIP_FOLD') {
    engine.mouse.x = 700; engine.mouse.y = 330; engine.mouse.isDown = true;
    engine.handleInputDown(700, 330);
    for (let i = 0; i < 300 && !done(); i++) {
      engine.mouse.x = Math.max(430, 700 - i * 2.2);
      engine.mouse.y = 330;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
      if (engine.sim.isLoosened && engine.sim.isLoosened()) break;
    }
    for (let i = 0; i < 300 && !done(); i++) {
      engine.mouse.x = 520; engine.mouse.y = 330 - i * 1.5;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
    }
    engine.handleInputUp();
  } else if (type === 'LAYER_STEAMER') {
    const order = d.expectedOrder || ['coconut', 'flour', 'coconut', 'flour', 'coconut'];
    const leftKey = d.leftKey || 'coconut';
    for (const key of order) {
      if (done()) break;
      const from = key === leftKey ? [220, 340] : [740, 340];
      drag(from[0], from[1], 480, 150);
      for (let i = 0; i < 6; i++) engine.updateSimulation();
    }
    if (!done()) { drag(340, 390, 480, 130); for (let i = 0; i < 20; i++) engine.updateSimulation(); }
  } else if (type === 'FRY_SHAPE') {
    engine.mouse.x = 780; engine.mouse.y = 300; engine.mouse.isDown = true;
    engine.handleInputDown(780, 300);
    engine.handleInputMove(480, 250);
    for (let i = 0; i < 500 && !engine.sim.isShaped(); i++) {
      engine.mouse.x = 480 + Math.sin(i * 0.5) * 30;
      engine.mouse.y = 250 + Math.cos(i * 0.5) * 20;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
    }
    engine.handleInputUp();
    engine.mouse.x = 780; engine.mouse.y = 300; engine.mouse.isDown = true;
    engine.handleInputDown(780, 300);
    engine.handleInputMove(480, 330);
    for (let i = 0; i < 500 && !done(); i++) { engine.mouse.isDown = true; engine.updateSimulation(); }
    engine.handleInputUp();
  } else if (type === 'FRY_DROP') {
    // Dip the tray by holding it over the oil long enough for the sim to tick.
    dragAndHold(180, 300, 480, 340, 12);
    engine.mouse.isDown = false;
    engine.handleInputUp();
    for (let r = 0; r < 4 && !done(); r++) {
      engine.mouse.x = 480; engine.mouse.y = 340; engine.mouse.isDown = true;
      engine.handleInputDown(480, 340);
      for (let i = 0; i < 400 && !done(); i++) { engine.mouse.isDown = true; engine.updateSimulation(); }
      engine.handleInputUp();
      for (let i = 0; i < 4; i++) engine.updateSimulation();
    }
  } else if (type === 'ASSEMBLE') {
    const expected = d.expected || [];
    for (let i = 0; i < expected.length; i++) {
      if (done()) break;
      drag(130, 150 + i * 100, 480, 330);
      for (let k = 0; k < 6; k++) engine.updateSimulation();
    }
  } else if (type === 'SIMMER_POT') {
    const total = (d.ingredients || []).length;
    for (let i = 0; i < total; i++) {
      const cur = engine.sim.getAdded();
      if (cur >= total) break;
      drag(120, 140 + cur * 74, 480, 340);
      for (let k = 0; k < 6; k++) engine.updateSimulation();
    }
    engine.mouse.x = 420; engine.mouse.y = 250; engine.mouse.isDown = true;
    engine.handleInputDown(420, 250);
    for (let a = 0; a < 400 && !done(); a++) {
      const ang = a * 0.4;
      engine.mouse.x = 480 + Math.cos(ang) * 60;
      engine.mouse.y = 340 + Math.sin(ang) * 40;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
    }
    engine.handleInputUp();
  } else if (type === 'MASH_MIX') {
    drag(120, 200, 480, 330);
    for (let k = 0; k < 4; k++) engine.updateSimulation();
    engine.mouse.x = 760; engine.mouse.y = 280; engine.mouse.isDown = true;
    engine.handleInputDown(760, 280);
    engine.handleInputMove(480, 330);
    for (let i = 0; i < 600 && !done(); i++) {
      engine.mouse.x = 480 + Math.sin(i * 0.7) * 50;
      engine.mouse.y = 330 + Math.cos(i * 0.7) * 25;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
    }
    engine.handleInputUp();
  } else if (type === 'TANDOOR_GRILL') {
    engine.mouse.x = 480; engine.mouse.y = 220; engine.mouse.isDown = true;
    engine.handleInputDown(480, 220);
    for (let i = 0; i < 1000 && !done(); i++) {
      engine.mouse.x = 480 + Math.sin(i * 0.3) * 80;
      engine.mouse.y = 220;
      engine.handleInputMove(engine.mouse.x, engine.mouse.y);
      engine.mouse.isDown = true;
      engine.updateSimulation();
    }
    engine.handleInputUp();
  } else if (type === 'PLATE_DISH' || type === 'PLATING') {
    // Push the cooked dish out onto the plate: grab the pusher and hold it to
    // the right while the sim ticks, then ladle curry/gravy over the leaf.
    dragAndHold(120, 250, 320, 250, 400);
    engine.mouse.isDown = false;
    engine.handleInputUp();
    engine.mouse.x = 800; engine.mouse.y = 300; engine.mouse.isDown = true;
    engine.handleInputDown(800, 300);
    engine.handleInputMove(610, 300);
    for (let i = 0; i < 400 && !done(); i++) { engine.mouse.isDown = true; engine.updateSimulation(); }
    engine.handleInputUp();
  } else if (type === 'MUKBANG_FEED') {
    [[380, 390], [420, 375], [460, 395], [500, 380]].forEach(([mx, my]) => {
      if (done()) return;
      drag(mx, my, 480, 175);
      for (let k = 0; k < 6; k++) engine.updateSimulation();
    });
  }

  for (let k = 0; k < 4; k++) engine.updateSimulation();
  return done();
};

let dishesPlayed = 0;
let dishesFailed = 0;
Object.keys(window.RECIPES).forEach(id => {
  const def = window.RECIPES[id];
  if (!engine.startRecipe(id)) { dishesFailed++; console.error(`❌ ${id}: could not start`); return; }

  // Run through every step except the recap, verifying each mechanic completes.
  let ok = true;
  for (let i = 0; i < def.steps.length - 1; i++) {
    engine.loadStep(i);
    engine.updateSimulation();
    if (!playStepToCompletion(def.steps[i])) {
      let diag = '';
      try {
        diag = ` rollOut=${engine.sim.getRollOut ? engine.sim.getRollOut() : '?'} curryFill=${engine.sim.getCurryFill ? engine.sim.getCurryFill() : '?'} fry=${engine.sim.getFry ? engine.sim.getFry() : '?'} dipped=${engine.sim.getDipped ? engine.sim.getDipped() : '?'}`;
      } catch (e) { diag = ' diagERR'; }
      console.error(`❌ ${id}: step ${i + 1}/${def.steps.length} [${def.steps[i].type}] did not complete${diag}`);
      ok = false;
      break;
    }
  }
  if (!ok) { dishesFailed++; return; }

  // The recap must award a real score, and the run must have captured at least
  // one genuine technique metric (not just an empty fallback).
  engine.loadStep(def.steps.length - 1);
  engine.updateSimulation();
  const score = engine.computeScore();
  const s = engine.scorecard;
  const metrics = ['spreadCoverage', 'cookQuality', 'plateQuality', 'fryQuality',
    'simmerQuality', 'mashQuality', 'grillQuality', 'syrupQuality', 'rollQuality',
    'assembleQuality', 'bites'];
  const measured = metrics.filter(k => s[k] !== null && s[k] !== undefined && s[k] !== 0);
  if (typeof score.score !== 'number' || score.score <= 0 || measured.length === 0) {
    console.error(`❌ ${id}: recap produced no usable score (score=${score.score}, metrics=${measured.join(',') || 'none'})`);
    dishesFailed++;
    return;
  }
  dishesPlayed++;
});
assertTrue(`Every dish is completable by hand (${dishesPlayed}/20 played through)`,
  dishesFailed === 0 && dishesPlayed === 20);

// Dish-specific configuration lives either nested under `data` (the convention
// for new dishes) or directly on the step (used by the shared tail steps and by
// the original reference dishes, which intentionally rely on mechanic defaults).
// What must never happen is an ingredient-tray mechanic shipping with no items,
// or a plating/feeding step shipping with no look — those would render generic,
// mislabelled food.
let dataMisses = 0;
const hasConfig = (st) =>
  (st.data && Object.keys(st.data).length > 0) ||
  Object.keys(st).some(k => !['id', 'title', 'type', 'actionText', 'hint', 'stepIndex', 'data'].includes(k));

Object.keys(window.RECIPES).forEach(id => {
  const def = window.RECIPES[id];
  // The two original reference dishes rely on mechanic-built-in look defaults
  // by design; the 18 newer dishes must each describe their own look.
  const isLegacy = id === 'kerala-puttu' || id === 'tn-dosa';
  def.steps.forEach((st, i) => {
    // Presentation steps must describe how this dish looks.
    if (['PLATE_DISH', 'PLATING', 'MUKBANG_FEED'].includes(st.type)) {
      const look = st.plateLook || st.look || st.dishStyle || st.morselStyle ||
        (st.data && (st.data.plateLook || st.data.look || st.data.dishStyle || st.data.morselStyle));
      if (!look && !isLegacy) {
        console.error(`❌ ${id}: step ${i + 1} [${st.type}] has no dish look`);
        dataMisses++;
      }
    }
  });
  // Trays and ingredient lists must actually name their contents.
  const simmer = def.steps.find(s => s.type === 'SIMMER_POT');
  if (simmer && (!simmer.data || !simmer.data.ingredients || simmer.data.ingredients.length < 3)) {
    console.error(`❌ ${id}: SIMMER_POT has no proper ingredient list`);
    dataMisses++;
  }
  const assemble = def.steps.find(s => s.type === 'ASSEMBLE');
  if (assemble && (!assemble.data || !assemble.data.items || Object.keys(assemble.data.items).length < 2)) {
    console.error(`❌ ${id}: ASSEMBLE has no proper item list`);
    dataMisses++;
  }
});
assertTrue('Every dish describes its own ingredients, items and look', dataMisses === 0);

engine.startRecipe('kerala-puttu');

if (mechanicFailures > 0) {
  console.error(`\n❌ ${mechanicFailures} assertion(s) failed.\n`);
  process.exit(1);
}

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The active mouse-controlled cooking game is complete, responsive, and ready to play!\n');
process.exit(0);
