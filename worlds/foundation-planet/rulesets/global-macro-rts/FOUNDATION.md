# Global Macro RTS — experimental foundation

Status: **EXPERIMENTAL DESIGN CONTRACT v0.1**

This ruleset uses Foundation Planet as the physical world body. It does not replace the Planet model. The Planet remains spherical and authoritative for global position; units and buildings operate through bounded local flat surface frames so ordinary RTS logic can use simple X/Z coordinates without pretending the globe itself is flat.

Nothing in this file is CANON merely because it exists. It records the active design direction for this experiment so implementation does not silently drift.

## Spatial rule

- Global identity: latitude/longitude + unit sphere vector on Foundation Planet.
- Local RTS identity: X/Z metres inside a tangent surface frame anchored to the globe.
- Crossing a local frame boundary rebases the same canonical globe coordinate into another flat frame; it must not teleport or alter world identity.
- Global territory accounting uses a deterministic equal-area cell grid. A cell is bookkeeping, not a rendered tile requirement.
- The world should be enormous relative to units and buildings. Crossing large planetary distances is possible but deliberately slow and logistically meaningful.

## Run / drop lifecycle

- A player drops only after the previous run is dead.
- Logging out does not end a run and logging in does not create a new drop.
- Returning players resume whatever remains of the same civilization.
- Offline play hands control to a bounded defensive Guardian: defend, repair, rebuild existing authorized structures/forces where economy allows; do not expand, conquer, research new directions, or invent new strategic intent.
- The run death test is based on loss of all qualifying civilization buildings. Defensive structures and scattered resource buildings do not keep a run alive by themselves. Surviving hidden units do not act as extra lives.

## Crew and control

- Crew is the root human unit.
- Crew can gather ordinary resources using player-configured automatic priorities. Automation may use known/visible information only; it may not reveal resources through fog.
- Training/equipping can irreversibly specialize Crew. A specialist does not freely respec back to Crew or swap specialty.
- Vehicle use can require trained/licensed crew.
- Crew can instead become stronger economic citizens/specialists.
- Units can be drag/dropped into persistent parties. A party can then be selected and commanded with one action so mass control remains usable on mobile as well as desktop.

## Vision

- Strong fog of war is fundamental.
- Unseen world state is not revealed by UI convenience.
- Exploration expands actionable knowledge.
- Night reduces unaided vision; light restores local vision but can expose presence.
- Gathering automation only acts on resources inside knowledge/vision allowed by the rules.

## Food and population pressure

- No design population cap is assumed. Population is limited primarily by what the economy can feed and equip.
- Every crew/person consumes food over time.
- Food can be stockpiled and deliberately burned to sustain larger armies or temporary economic pressure.
- Initial food-policy shape to tune later:
  - Well Fed: about +20% food consumption, about +10% gathering/production, about +10% overall physical/combat performance.
  - Normal: baseline, with room for tiny flavour-level dissatisfaction penalties if desired.
  - Rations: about -40% food consumption, about -30% gathering/production and other work output, about -10% physical/combat performance.
- Exact numbers are tuning values, not locked balance.
- Major world cities are kept powerful but naturally bounded by the same food/economic pressure rather than infinite scripted expansion.

## Materials and technology

- Common surface/near-ground materials should be limited and understandable.
- Expensive deep mining can discover RNG-based useful materials later.
- Small RNG world impacts/asteroids can continuously introduce material opportunities across the huge map.
- Asteroid/resource opportunities are not globally announced; they matter only when discovered through actual vision/operation.
- More territory therefore increases exposure to resource/material/technology opportunities, but also increases travel, defense, and logistics burden.
- Blueprints/capabilities may come from several sources: deliberate research, quests/milestones, RNG discovery, run-only finds, and other later world systems.
- Materials should support different costs, strengths, weaknesses, and construction choices rather than one simple linear tier ladder.
- On-map repetitive upgrade loops should stay lighter than the macro, fighting, logistics, blueprint, and material decisions.

## Destruction economy

Persistent per-object battlefield salvage is intentionally avoided at this scale.

- Unit destruction can be resolved as arithmetic rather than dropped objects.
- A fixed conversion from the destroyed opposing unit's material value can produce food for the destroying side. Same rule for all sides.
- 1% of food gained through this destruction conversion is also credited as gold.
- Gold is a slow-stacking strategic reserve intended primarily for expensive mercenary hiring / reinforcement moments rather than a constantly micromanaged economy.
- At run end, raw session gold is multiplied by the highest global map-control percentage reached during that run, using the literal percentage as the tiny bonus:

  `final_gold = raw_gold * (1 + peak_map_control_percent / 100)`

  Example: peak control of 1% of the entire globe gives only a 1% bonus (`x1.01`). On a planet-scale map that is already an extreme achievement; the bonus is intentionally small and can matter mainly across long-term high-score competition.

## World cities

- The map can contain settlements/cities of very different scale, including a few enormous established powers.
- Large cities should obey the same underlying economy where practical: high production can coexist with high food/upkeep burden.
- Provoking a top city can cause it to mobilize a serious existing defensive response rather than merely spawning a cosmetic punishment force.
- Taking such a city should not be hard-coded impossible, but should be close to impossible for ordinary lone growth and capable of becoming a major world-scale event.

## Mass-macro rule

Before adding a mechanic, ask whether it still makes sense with tens or hundreds of thousands of units involved.

Prefer:

- aggregate arithmetic;
- bounded automatic orders;
- deterministic state;
- large strategic decisions;
- cheap representation of distant/inactive state;

instead of per-corpse loot, per-object cleanup, repetitive clicking, or bookkeeping that grows linearly with every casualty.

**Working rule:** complexity belongs primarily in relationships between large systems, not in chores attached to every tiny object.
