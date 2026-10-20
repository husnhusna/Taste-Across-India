# 🥘 Taste Across India
### A Handcrafted 2D Cooking & Mukbang Game (Active Mouse Gameplay Edition)

**Taste Across India** is an active, mouse-controlled 2D cooking and mukbang indie game. You step into traditional regional home kitchens across India, physically prepare authentic recipes through mouse movement, dragging, timing, and pouring physics, and feed your companion **Chintu**!

---

## 🎮 New Active Mouse-Controlled Gameplay

Every major cooking stage responds directly to player input and physically changes the game scene:

```
[ 01: Scoop & Pour ] ➔ [ 02: Stir in Circles ] ➔ [ 03: Physical Layering ] ➔ [ 04: Heat Management ] ➔ [ 05: Mukbang Feeding ]
```

### 1. 🌾 Scooping & Pouring Mini-Game (Rice Flour & Salted Water)
- **Flour Sack Physics:** Click and drag the rice flour sack over the brass *uruli* bowl.
- **Continuous Stream:** Holding the mouse button down over the bowl tilts the sack and showers powdery white flour particles.
- **Spill Detection:** If positioned correctly over the bowl, particles land inside and fill the flour gauge. Move too far to the left or right, and particles spill onto the wooden counter!
- **Salted Water Pouring:** Drag the brass lota over the bowl to pour a stream of shimmering water droplets.

### 2. 🥣 Circular Stirring & Texture Morpher Mini-Game
- **Circular Mouse Motion:** Click and drag the wooden spoon in continuous circular orbits around the bowl.
- **Swirl Vortex:** The engine tracks angular velocity ($d\theta/dt$), causing flour grains and water droplets to swirl in real time.
- **Texture Transformation:** Watch the mixture physically transform:
  - *0% – 30%:* Loose white powder with water specks.
  - *30% – 70%:* Damp flour clumps forming.
  - *70% – 100%:* The authentic Kerala **crumbly moist beach sand** texture (coarse golden granules that hold together when pressed and crumble when touched).

### 3. 🥥 Physical Steamer Layering Mini-Game (Puttu Kutti)
- **Cutaway Steamer Cylinder:** A large interactive cross-section of the *Puttu Kutti* cylinder stands on the counter with its bottom perforated disc.
- **Active Drag-and-Pour:** Click and drag scoops from the coconut bowl and moist flour bowl onto the steamer column. The drop zone is forgiving—any spot over the column counts.
- **Correct-Order Enforcement (recoverable):** Layers must go in the traditional order. If you drop the wrong ingredient, nothing is added and Chintu gently buzzes—just grab the correct bowl and try again. The glowing green outline shows which bowl is needed next.
- **Layer Accumulation:** Ingredients physically fall down inside the cylinder and pile up in distinct, visible textured layers:
  1. Coconut Base 🥥
  2. Moist Flour 🌾
  3. Middle Coconut Divider 🥥
  4. Moist Flour 🌾
  5. Top Coconut Garnish 🥥
- **Drag-on Lid:** Once all 5 layers are placed, drag the metal dome lid onto the top of the cylinder—it snaps shut with an authentic metal clink!

### 4. 🔥 Active Steaming & Heat Management Mini-Game
- **Interactive Stove Dial:** Press and drag the circular dial on the stove to turn the flame between Low, Medium, and High. The dial only moves while you hold it, so it feels like a real knob.
- **Optimal Green Zone:** Maintain the heat in the green sweet spot (40%–75%):
  - *Too Low:* The kettle cools down, steam fades, timer pauses.
  - *Too High:* The flame roars, the pot rattles with warning bursts of steam!
  - *Sweet Spot:* Steady blue flame, water bubbling softly, and fragrant white steam billows gently from the lid vents.
- **Steam Whistle:** Keep the heat in the optimal zone until the steam whistle blows!

### 5. 🥢 Interactive Plating Mini-Game
- **Wooden Pusher:** Click and drag the wooden runner through the cylinder to smoothly push the hot steamed puttu rolls out onto the fresh green plantain leaf!
- **Curry Ladle:** Drag the brass ladle from the clay pot to spoon warm, dark roasted black chickpea curry beside the puttu.

### 6. 😋 Actual Mukbang Feeding Game (Feed Chintu!)
- **Dynamic Eye-Tracking:** Chintu's pupils smoothly follow the mouse cursor and food morsel in real time across the screen!
- **Anticipation Detection:** As you drag a piece of puttu with curry close to his mouth (distance < 130px), Chintu leans forward eagerly with eyes wide and mouth opening wide!
- **Chewing & Reactions:** Releasing the bite into his mouth triggers real-time chewing animations:
  - Rhythmic chewing with puffing cheeks.
  - Crunchy eating sound effects (`playChomp()`).
  - Bouncing coconut crumbs and floating warmth stars.
  - Expressive reactions:
    - *Bite 1:* “The coconut smells so fresh and warm!” (Delighted smile)
    - *Bite 2:* “It really is soft as a cloud—not heavy at all.” (Sparkle eyes)
    - *Bite 3:* “The roasted black chickpea gravy is rich and spicy.” (Cheeks rosy)
    - *Bite 4:* “Full tummy and blissful heart!” (Heart eyes and satisfaction)
  - Each bite visibly removes food from the banana leaf plate until 100% full!

### 7. 🥞 Spreading, Roasting & Folding the Dosa (Tamil Nadu)
- **Follow-the-ladle spreading:** Grab the batter ladle and circle it over the tawa. The batter visibly follows your motion — pouring first, then thinning outward. A single click never finishes it: you must physically trace a circle.
- **Visible coverage map:** Twelve pips around the tawa light up as you work each side. An uncovered rim sector is highlighted in red with the hint “A little thick on one side — circle that area!”, then recovers as soon as you circle it. Moving the ladle off the tawa earns **no** progress.
- **Real roasting:** On the tawa, the dial now drives actual cooking — the dosa goes from pale wet batter → golden crisp lace → charred patches. Overheat and it *burns* (smoke, darkened food), but lowering the flame to the green band cools it back down and it still cooks through.
- **Loosen, then fold:** No automatic folding. First slide the spatula in **horizontally** under the dosa to loosen it, then **lift** to fold — with a smooth half-moon fold animation and a distinct wobble while loosening.

### 8. 😋 Expressive Mukbang Feeding (Feed Chintu!)
- **Distinct character states:** Chintu moves through idle → anticipating → mouth-open → chewing → delighted → satisfied, each with its own face, head-bob and squash-and-stretch.
- **Food-approach reaction:** Carry a morsel near his face and he leans in with wide eyes and opens his mouth; pull away and he settles back to idle.
- **One bite per drag:** A single grab-and-release counts as exactly one bite. Releasing in mid-air (away from the mouth) is ignored and never eats the morsel.
- **Shrinking portion:** Each bite visibly removes food from the plantain leaf, and reactions depend on the recipe and how full he is.

### 9. ⭐ Three-Star Scoring & Replayability
- Every run is measured: **spreading quality**, **cooking accuracy** (time in the sweet spot), **waste** (burns & spills) and **plating**.
- The recap shows a **★/☆ three-star rating**, a **0–100 score**, your **personal best**, and a short “what went well / what to improve” tip list.
- Personal bests are saved **per recipe** and shown in the Recipe Book. Replaying a mastered dish never pays duplicate coins, but it *does* let you beat your score.

### 10. 🍳 The Reusable Cooking Mechanics (Shared Across Dishes)

Every dish is a data-driven list of steps, and every step names one of these
shared mechanics. The same mechanic is reused with different colours, labels
and ingredients, so each dish looks and cooks like itself without a bespoke
simulation. New dishes added these mechanics on top of the puttu/dosa ones:

| Mechanic | What you physically do | Used by |
| :--- | :--- | :--- |
| `POUR_FLOUR` / `POUR_WATER` | Drag a sack/cup over the bowl and hold to pour | every dish |
| `CIRCULAR_STIR` | Grab the spoon and stir in circles | batters, kurma, masala |
| `SPREAD_BATTER` | Circle the ladle to spread/roll out | appam, paratha, luchi, poli |
| `STEAM_COOK` | Hold the heat dial in the green band | idli, pongal, pav bhaji, poli |
| `LAYER_STEAMER` | Alternate scoops in order, then snap the lid | puttu, idli |
| `FRY_SHAPE` | Shape a mixture over the bowl, then fry it | medu vada |
| `FRY_DROP` | Dip a battered batch into oil and flip | pazham pori |
| `ASSEMBLE` | Drag prepared pieces onto the plate in order | vada pav, kathi roll |
| `SIMMER_POT` | Add ingredients **in order**, then stir the pot | stew, pongal, pav bhaji, misal, puran poli, chole, alur dom |
| `MASH_MIX` | Add butter, then press & drag to mash | pav bhaji |
| `TANDOOR_GRILL` | Rotate the skewer over the fire (a still hold does nothing) | paneer tikka |
| `BOIL_SYRUP` | Heat a pot of syrup into the sweet zone | rasgulla |
| `ROLL_BALLS` | Press & circle to roll a smooth ball | rasgulla, poli dough |
| `PLATE_DISH` | Push the dish out, then pour the accompaniment | every dish |
| `MUKBANG_FEED` | Drag warm bites into Chintu's mouth | every dish |
| `RECAP` | Collect coins & stars | every dish |

Wrong actions are always **recoverable**: dropping an ingredient out of order
adds nothing (just grab the glowing correct one), overheating burns the food —
but lowering the flame still lets it finish, and letting go of a morsel away
from Chintu's mouth never counts as a bite.

---

## 🚀 How to Launch the Game (Instant & Offline)

The game requires **no setup, no internet, and no dependencies**.

### Double-Click Launch
1. Open Windows File Explorer and navigate to:
   ```text
   C:\Users\HUSNA\.gemini\antigravity\scratch\taste-across-india
   ```
2. **Double-click** `index.html`.
3. It opens immediately in Google Chrome, Microsoft Edge, or Firefox!

> **Tip:** If you edit any file while the game is open, refresh the page (F5) to load the changes.

### How to Test the Interactions (Beginner Walkthrough)
Every step is driven by **mouse movement and dragging**, not by clicking a "Next" button. If you get stuck, the bouncing arrow plus a short instruction tells you exactly what to do.

1. **Add flour** – Press on the flour sack and drag/hold it over the brass bowl until the flour gauge fills. Move it away from the bowl and you'll see flour spill onto the counter.
2. **Add water** – Drag the brass lota over the bowl and hold to pour a stream.
3. **Stir** – Press the wooden spoon and move your mouse in circles around the bowl. Keep stirring until the mixture turns into crumbly "beach sand".
4. **Layer** – Drag a scoop of coconut onto the tall steamer column, then flour, alternating coconut → flour → coconut → flour → coconut. A green glow shows which bowl to use. Drop the wrong one and nothing happens—just try again.
5. **Steam** – Press the round heat dial and drag it until the gauge indicator sits inside the **green** band, then hold it there until the whistle.
6. **Plate** – Drag the wooden push rod to slide the puttu out onto the leaf, then hold the curry ladle over the leaf to pour the curry.
7. **Feed Chintu** – Drag each of the 4 food morsels up to Chintu's mouth and release.
8. **Recap** – A parchment card appears with your star rating, score and `+100 Coins` reward; Cook Again or return to the map.

**Cooking the Crispy Roast Dosa (Tamil Nadu):** pour dal & water, stir, then **circle the ladle** to spread the batter out to the edges (watch the 12 coverage pips), hold the flame in the **green band** to roast it golden, **slide then lift** the spatula to fold, plate it with sambar & chutney, and feed Chintu the wedges.

### 🧪 Development Test Mode (Jump Straight Into Any Dish)

Every dish can be launched directly for play-testing, **without** shortcutting
normal player progression. Open the browser console (**F12 → Console**) and run:

```js
dev.list()              // prints every playable dish id
dev.launch('wb-luchi')  // jumps straight into that dish's real cooking flow
```

A dev launch bypasses **only** the map's "region locked" gate. It never grants
coins, never records a completion, and never unlocks a region — so it is safe
to use while developing and cannot cheat the player's save file.

### Keyboard & Accessibility Aids
- **`H` / `?`** – Replay the current step's hint.
- **`M` / `S`** – Mute / unmute sound instantly (a toast confirms the change).
- **`Esc`** – Close any open dialog.
- Draggable items visibly **lift and scale up** while held, with landing feedback and lightweight cooking sounds, so it's always clear what you've grabbed.

### Running the Automated Tests
From the project folder, run:
```text
node test_game.js
```
This checks the recipe data, art, sounds, step order, and drives the real mouse mechanics (layering, steaming, plating, feeding) to confirm each one actually changes game state. It also **plays all 20 dishes end-to-end with real gestures** and verifies that a burned run scores lower than a clean one.

---

## 🗺️ 5 States & All 20 Dishes — **All Playable Now**

| State | Unlock | Dishes |
| :--- | :--- | :--- |
| **🌴 Kerala** | Free (start) | Puttu & Kadala Curry, Appam, Pazham Pori, Kerala Vegetable Stew |
| **🛕 Tamil Nadu** | Unlocks after Puttu (100 coins) | Crispy Roast Dosa, Fluffy Steamed Idli, Ghee Ven Pongal, Medu Vada |
| **🌊 Maharashtra** | 200 coins | Mumbai Vada Pav, Pav Bhaji, Kolhapuri Misal Pav, Festive Puran Poli |
| **🌾 Punjab** | 300 coins | Chole Bhature, Dhaba Aloo Paratha, Mathania Sweet Lassi, Tandoori Paneer Tikka |
| **🪕 West Bengal** | 400 coins | Kolkata Kathi Roll, Feathery Luchi, Bengali Alur Dom, Spongy Rosogolla |

Every dish has a complete, ordered cooking flow (prepare → cook → plate → feed →
score), its own ingredients and look, hints, and recoverable mistakes.

---

## 📁 Project Structure

```text
taste-across-india/
├── index.html           # Main stage with interactive 60 FPS HTML5 Canvas
├── README.md            # Complete game guide
├── css/
│   └── style.css        # Handcrafted indie styling & canvas layout
├── js/
│   ├── audio.js         # Web Audio API procedural synthesizer (pouring, stirring, chomping)
│   ├── art.js           # Hand-illustrated vector art, characters & environments
│   ├── engine.js        # Active canvas physics, circular stirring, pouring & mukbang
│   ├── app.js           # State machine, local storage save system & folios
│   └── data/
│       ├── recipes.js       # 5 states, dish metadata, puttu & dosa steps
│       └── recipes-extra.js # Step lists + registry entries for the other 18 dishes
└── test_game.js         # Automated test suite (data, art, audio & real mouse mechanics)
```
