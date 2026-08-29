# Foundation Planet contract

## World identity and ownership

`world.axm.foundation-planet` owns its seed, global coordinate model, physical substrate, environmental profiles, world clock and persisted interventions. A game may read those systems and submit a governed action proposal later. Loading a game must never replace, reset or privately fork the canonical planet without explicit creation of a separate world lineage.

## Coordinates

Canonical locations use decimal latitude and longitude plus meters relative to mean sea level:

```json
{
  "schema": "axm.foundation-planet.coordinate/v1",
  "world_id": "world.axm.foundation-planet",
  "latitude_deg": 18.5,
  "longitude_deg": 24.5,
  "elevation_m": 412,
  "reference": "planet-mean-sea-level"
}
```

Render coordinates are disposable projections. Orbital Three.js units and local tangent-sector kilometers must never be persisted as canonical world positions.

## Hierarchical streaming

The intended simulation hierarchy is:

```text
planet climate and population fields
  → regional statistical populations
    → loaded local sectors
      → individual visible and interactive organisms
```

The first renderer uses a 120 km regional sector and a 3 km individual-organism focus sector. Leaving a sector may collapse unchanged individuals back into deterministic population state. Interventions, named organisms and game-relevant state must be recorded before collapse.

The regional tier now estimates producer biomass, species-level animal abundance, carrying capacity, decomposition activity and food-web support across the 14,400 km² sector. Those values are simulation priors, not a claim that every estimated animal exists as an individual record. Only a small focus subset is rendered. Later authoritative population state must version interventions and migration separately from these deterministic priors.

## Layer contract

Physical layers: `terrain`, `hydrology`, `groundwater`, `geology`.

Condition layers: `atmosphere`, `clouds`, `weather`, `cryosphere`.

Living layers: `vegetation`, `fauna`, `decomposers`.

The terrain substrate cannot be disabled in this lineage. Other layers can be enabled independently. The living master control changes all living layers together but does not merge their state. A barren condition profile sets natural life abundance to zero without deleting living-state history.

## Condition profiles

Profiles are parameter sets over one planet identity. They may change sea level, temperature, moisture, ice line, atmosphere rendering and natural-life abundance. They may not change the world ID, seed, coordinate reference, ownership or persisted interventions.

## Geology and hydrology

Geology is sampled from fourteen deterministic spherical plate provinces. Plate identity, crust type, crust age, motion proxy, nearest-boundary type and boundary proximity are stable coordinate data. Bedrock, soil depth and erosion risk combine that substrate with relief and climate.

Hydrology v2 is anchored to a canonical latitude/longitude grid rather than the center of a requested render window. Buffered canonical tiles route each land cell to its steepest lower neighbor. Accumulated catchment area and climate runoff determine visible reaches, discharge, width, depth and order. Each reach owns a stable grid-derived ID, canonical endpoints and a downstream-reach link. Overlapping loaded sectors must return identical canonical reach facts; their local render coordinates may differ. Sector edges publish handoffs rather than pretending the river ends. Interior sinks may form lakes. Stateful Earth columns may add current discharge, runoff, baseflow and water-table diagnostics without rewriting canonical reach identity or long-term discharge.

`axm.foundation-planet.basin-routing-engine/v4` is the durable cross-scale bridge between the 0.25-degree Earth-system grid and those canonical reaches. For each loaded land cell, one deterministic main reach is selected from the canonical reach facts inside that cell. Water leaves the Earth-cell runoff queue only when `axm.foundation-planet.basin-inlet-receipt/v3` records equal sender debit and reach credit. That inlet also records an explicit parameterized land-runoff chemistry boundary derived from freshwater volume, local ecology, substrate and temperature. It credits persistent `axm.foundation-planet.river-chemistry-state/v1` reservoirs for dissolved inorganic and organic carbon, inorganic nitrogen and phosphorus, and dissolved oxygen. Land ecology does not yet own phosphorus or oxygen reservoirs and is not debited for those headwater inputs, so this boundary remains named rather than disguised as a closed soil-to-river material route.

Water and chemistry persist together by profile and stable reach ID. Each step derives all reach transfers from the same pre-step storage, so newly received material cannot cross several reaches in one invocation. `axm.foundation-planet.river-reach-transfer/v3` records the exact C/N/P/O2 sender debit and downstream receiver credit beside water. A reach marked as an ocean outlet may deliver only to the loaded canonical ocean Earth cell containing its mouth.

Before ocean credit, `axm.foundation-planet.estuary-state/v1` persistently retains sediment organic carbon, nitrogen and phosphorus at that mouth. `axm.foundation-planet.estuary-flux-receipt/v1` converts oxygen-limited DOC respiration into DIC, records dissolved-oxygen consumption, retains bounded C/N/P fractions, and exposes denitrified nitrogen as an explicit gas boundary. `axm.foundation-planet.ocean-mouth-receipt/v4` therefore partitions one exact river debit among persistent estuary sediment, oxygen consumption, a nested `axm.foundation-planet.atmosphere-gas-boundary-input-receipt/v1` that credits denitrified nitrogen to the receiving coastal column's local atmosphere, and a nested `axm.foundation-planet.ocean-ecology-river-input-receipt/v1` for the remaining dissolved coastal-ocean credit. River, estuary, atmosphere, ocean and combined ledgers close independently. Oxygen consumption remains an explicit reaction term rather than an atmospheric receiver, and this bounded reactor is not resolved estuary hydrodynamics. If the downstream reach, sector or mouth cell is not loaded, both water and chemistry stay in reach storage and `axm.foundation-planet.river-boundary-receipt/v1` names the unresolved handoff.

This implements stateful routing across the loaded canonical reach graph, not a complete planet-wide basin solve. Reach storage that leaves the visible sector remains persisted, but it cannot advance again until that canonical reach returns to a loaded graph. A v2 basin snapshot migrates with empty estuary storage rather than invented historical sediment. At this historical rung, depression filling, endorheic spill rules, floodplains, channel morphology, resolved estuary circulation and a resolved three-dimensional aquifer geometry remained intentionally unsolved. The Rung 36 and Rung 37 addenda below supersede only finite mineral routing and bounded floodplain exchange; neither claims resolved channel morphology or inundation hydraulics.

## Stateful surface Earth system

`axm.foundation-planet.earth-system-column/v1` is a sparse canonical 0.25-degree surface-column model. Every cell carries a boundary layer and an `axm.foundation-planet.free-troposphere/v2` compatibility reservoir, each with temperature, water vapor, bounded cloud liquid, bounded cloud ice and an independent eastward/northward wind vector, plus a runoff-routing queue. Boundary-layer and free-troposphere pressure thickness sum to surface pressure. New columns begin at a 25%/75% partition; horizontal transport may evolve the boundary fraction within 8% to 50%, and local pressure forcing preserves the transported fraction. Representative layer heights are terrain plus 0.5 km and terrain plus 4.5 km. Layer dry-air mass and sensible-heat capacity scale with actual pressure thickness. A visited land cell also carries ponded water, aged snow-water equivalent, root-zone water, deep-soil water, groundwater storage, soil freeze and surface heat. A visited ocean cell carries mixed-layer depth, temperature, freshwater anomaly, salinity, thermodynamic sea-ice water equivalent/fraction/thickness, and a distinct aged snow-on-sea-ice reservoir. Bedrock and soil depth select bounded porosity, field capacity, wilting point, conductivity, aquifer depth and specific yield.

Each column also owns `axm.foundation-planet.atmosphere-biogeochemistry-state/v3`: persistent local carbon-dioxide carbon, oxygen and nitrogen-gas reservoirs in eight ordered `axm.foundation-planet.atmosphere-biogeochemistry-layer/v1` records aligned with the native pressure column. The whole-column fields are exact sums and compatibility projections, not a second reservoir. Land and ocean ecology still expose their established exchangeable-atmosphere fields for compatibility, but those fields are synchronized mirrors rather than independent reservoirs. `axm.foundation-planet.atmosphere-biosphere-gas-flux-receipt/v1` closes each local land-atmosphere or ocean-atmosphere C/O2 exchange at native surface layer 0; estuary and floodplain denitrification credit nitrogen to that same surface layer through typed boundary-input receipts. `axm.foundation-planet.atmosphere-biogeochemistry-vertical-transport-receipt/v1` consumes all seven native adjacent dry-air exchange receipts, applies ordered conservative lower/upper composition exchange, and closes C/O2/N2 without claiming molecular diffusion or three-dimensional plumes. Loaded horizontal transport is described with the Earth transport graph below. These gases are not globally mixed, so their CO2 ppm, oxygen and nitrogen fractions remain local bounded proxies rather than a global atmospheric-composition or chemistry claim.

`axm.foundation-planet.atmosphere-pressure-column/v2` is the persisted native vertical state inside
that Earth-system column. It contains eight bottom-to-top
`axm.foundation-planet.atmosphere-pressure-layer/v2` records. The lower two layers aggregate into the
boundary-layer compatibility band and the upper six aggregate into the free-troposphere compatibility
band. Each native layer persists pressure thickness and its derived dry-air mass, air temperature,
vapor water, cloud liquid, cloud ice, eastward/northward wind and momentum, sensible and moist enthalpy,
horizontal kinetic energy and terrain-referenced geopotential energy. Contiguous interface pressures
descend from surface pressure to the model top. Interface and center heights use the hypsometric
relation with the layer's vapor- and liquid-adjusted virtual temperature. The last geometry interval
uses a declared 0.1 hPa pressure floor so a zero-mass model-top boundary does not imply infinite
height; all pressure thickness and therefore all declared dry-air mass remains in the eight layers.

The two legacy bands are now an explicit compatibility projection rather than a claim that the
persisted vertical state has only two levels. Weather boundary relaxation and existing surface
consumers still produce or consume band aggregates. Before native local thermodynamics, an
`axm.foundation-planet.atmosphere-pressure-column-sync-receipt/v2` maps changed boundary forcing into
the eight levels. After compatibility-only surface processes, the same schema
rescales native layer pressure thicknesses within the affected band, preserves native temperature
anomalies, maps exact vapor and cloud totals, and shifts tangent-wind profiles to the requested
aggregate momentum. Native shear that would exceed the 90 m/s per-level bound is coherently reduced
around the requested band mean instead of clipping levels independently. The receipt closes surface
and band pressure, dry-air mass, vapor, cloud liquid, cloud ice, moist enthalpy and both tangent-momentum
components against the compatibility target. It also names native shear kinetic energy and the
geopotential representation adjustment between the old two representative heights and the eight
hypsometric layer centers.

Each fixed step is no longer than one planet day. Land fluxes include rain, snow, melt, sublimation, infiltration, evaporation, transpiration, percolation, recharge, capillary rise, surface runoff and baseflow. Ocean fluxes include typed rain and snow, evaporation, mixed-layer heat storage and sea-ice freeze/melt. Every native level computes a pressure-local saturation capacity blended over water and ice from its dry-air mass, center pressure and temperature. `axm.foundation-planet.atmosphere-pressure-layer-phase-receipt/v3` records that level's initial/final vapor, cloud liquid, cloud ice and temperature; condensation/deposition; evaporation/sublimation; liquid/ice freezing and melting; precipitation source phase; descent phase changes; vaporization and fusion heat; water and moist-enthalpy residuals; and any phase mass retained because its latent heat would cross the declared -120 to 70 °C native-layer envelope. The lower-two and upper-six results are also projected into `axm.foundation-planet.atmosphere-phase-change-receipt/v3` and `axm.foundation-planet.free-troposphere-phase-receipt/v3` compatibility schemas so existing consumers do not need to invent a second atmosphere.

Combined native cloud liquid plus ice remains bounded to 12 mm across the lower two levels and 8 mm across the upper six, apportioned by pressure thickness. When a long step needs more precipitation than that instantaneous capacity, deterministic condensation/deposition-to-precipitation subcycles may repeat without exceeding it. Each `axm.foundation-planet.atmosphere-precipitation-descent-receipt/v3` identifies the source level and rain/snow phase, every crossed interface, each thermally bounded melting/freezing transition with its receiving-layer fusion heat, and the typed surface rain/snow destination with equal sender debit and receiver credit. Upper condensate can therefore reach the surface only through an explicit native descent route. Precipitation can never exceed cloud plus vapor actually available above the declared 0.2 mm boundary-band vapor floor and the finite per-upper-level numerical floor. Weather-demanded condensation and deposition are bounded nucleation parameterizations, not resolved aerosol, droplets, ice crystals or collision/coalescence microphysics. Surface evaporation and transpiration return vapor to the boundary compatibility band and are reconciled back into the native column.

`axm.foundation-planet.native-cloud-optics/v1` derives independent liquid and ice water paths from all
eight native layers. Those paths produce bounded broadband shortwave and longwave optical depths,
cloud cover and a condensate-weighted emission temperature. The
`axm.foundation-planet.atmosphere-co2-radiative-coupling-receipt/v1` reads the authoritative eight-layer
gas state and matching native pressure-temperature paths. It derives a bounded grey optical depth and
surface contribution per layer, compares the result against 420 ppm at the same temperatures, applies
a bulk cloud-overlap mask and caps the surface adjustment at +/-20 W/m2. A true 420 ppm profile is
reference-neutral; layer ordering remains causal because emission temperature and transmission through
lower layers are retained in each typed layer record. The
`axm.foundation-planet.surface-radiation-receipt/v2` nests this receipt and records top-of-atmosphere
forcing, clear-sky and cloud transmissivity, absorbed surface shortwave, upward and downward longwave,
baseline downward longwave, the CO2 adjustment, cloud shortwave and longwave forcing, and the applied
surface albedo. Land albedo blends substrate, the persistent active
canopy and snow whose reflectivity decays with persisted age; snow masks part of the canopy rather than
silently replacing its structure. Ocean albedo blends open water with thickness-dependent sea
ice and any snow retained on that ice. These fluxes causally enter surface heat storage. Radiation
reads composition at local-step start, so gas exchange and transport affect the next local radiation
step. These are broadband bulk parameterizations, not spectral or line-by-line radiative transfer,
resolved cloud particle optics or a scientific climate closure.

`axm.foundation-planet.cryosphere-phase-receipt/v1` closes the phase enthalpy of land snow, ocean snow
and sea-ice water equivalent using the same 334,000 J/kg fusion constant and liquid-water reference as
the atmosphere. Incoming snow carries negative phase enthalpy. Melt and sublimation consume energy;
ice growth releases it. Ocean freezing uses the local salinity-derived freezing point, while conserved
mean ice mass determines bounded concentration and thickness. Snow falling over open water melts into
the freshwater anomaly; snow falling on the ice fraction persists and ages. This is thermodynamic
surface ice, not brine-pocket physics, leads, ridging, rafting or dynamic sea-ice transport.

`axm.foundation-planet.land-ecology-state/v1` is the persistent physical land-vegetation checkpoint.
It retains a bounded functional type; canopy cover, leaf area, height, root depth, roughness and
albedo; living, litter, soil-organic and local exchangeable-atmosphere carbon; and living, litter,
organic-soil and mineral nitrogen. `axm.foundation-planet.land-ecology-flux-receipt/v1` records
absorbed-light gross primary production, nitrogen-limited retained growth, autotrophic and
heterotrophic respiration, litterfall, humification, mineralization and uptake, with independently
tested carbon and nitrogen residuals. Rooted canopy demand feeds transpiration, canopy and litter
suppress exposed-soil evaporation, canopy cover changes surface albedo, and canopy height changes
aerodynamic roughness. The atmospheric carbon reservoir is deliberately a local exchangeable proxy
and exact mirror of its atmosphere-owned column state; it is carried only by loaded native dry-air
routes and is not a globally mixed pressure tracer.

`axm.foundation-planet.ocean-ecology-state/v2` is the persistent mixed-layer and deep-ocean marine checkpoint. It
retains local exchangeable-atmosphere and dissolved inorganic carbon, dissolved organic carbon,
phytoplankton, zooplankton and detritus carbon; dissolved, plankton and detrital nitrogen and
phosphorus; and local exchangeable-atmosphere plus dissolved oxygen. Its water-column diagnostics
derive chlorophyll, euphotic depth, oxygen saturation and hypoxia risk from those reservoirs.
`axm.foundation-planet.ocean-ecology-flux-receipt/v2` records light-, temperature-, open-water-,
nitrogen- and phosphorus-limited gross and retained primary production; grazing, mortality,
oxygen-limited respiration and remineralization; photosynthetic oxygen production; and local
air-sea carbon and oxygen exchange. Carbon, nitrogen and phosphorus close as local element ledgers;
oxygen closes against its declared photosynthetic and respiratory fluxes. The atmosphere values are
local exchangeable proxies, not globally mixed gas tracers. The plankton process is a bounded bulk
parameterization, not mechanistic plankton biochemistry or resolved individuals.

Each v2 checkpoint owns `axm.foundation-planet.deep-ocean-state/v1`: deep dissolved inorganic and
organic carbon, inorganic nitrogen and phosphorus, dissolved oxygen, detrital C/N/P and persistent
seafloor-buried organic C/N/P. `axm.foundation-planet.deep-ocean-exchange-receipt/v1` records signed
dissolved exchange from concentration gradients, sinking detrital export, oxygen-limited deep
remineralization and burial. Mixed-layer plus deep C/N/P close internally; oxygen closes against the
explicit deep respiration term. Life-off keeps dissolved physical exchange active while freezing
sinking, remineralization and burial. This is a sparse vertical bulk organ, not resolved thermohaline
circulation, water masses, gyres, eddies or bathymetric currents.

All seven adjacent native interfaces emit `axm.foundation-planet.atmosphere-adjacent-layer-exchange-receipt/v3`. Each interface derives a bounded background and lapse/moisture-instability exchange fraction, moves equal gross dry-air parcels upward and downward without changing either layer's dry-air mass, and transports sensible heat, vapor, cloud liquid, cloud ice and both tangent-momentum components. Tangent kinetic energy lost by mixing is returned to native sensible heat. Equal gross geopotential transfer is recorded in both directions.

Every interface also owns `axm.foundation-planet.atmosphere-pressure-vertical-interface/v1` state: convective kinetic energy, effective moving mass, bounded updraft velocity, and an exactly compensating downdraft velocity and momentum. Its `axm.foundation-planet.atmosphere-pressure-interface-buoyancy-receipt/v1` lifts the lower parcel over the actual adjacent-center separation using the moisture-dependent critical lapse rate, compares virtual temperature to the upper ambient layer, and converts only bounded positive buoyancy work from sensible heat into that interface's kinetic reservoir. Stable kinetic energy decays on a declared time scale and is returned to both adjacent layers. Equal entrained and detrained bulk dry-air mass is explicit; this is a conservative bulk closure, not resolved plume geometry.

The composite `axm.foundation-planet.atmosphere-pressure-column-dynamics-receipt/v3` contains all eight mixed-phase receipts, all seven interface receipts, every typed precipitation route and per-interface rain/snow totals. Moist enthalpy uses liquid water as the phase reference, includes vapor latent energy and subtracts cloud-ice fusion energy; the outgoing phase enthalpy of surface snow is explicit. The receipt closes native water, moist enthalpy after fusion, horizontal and convective kinetic conversion, eastward/northward momentum, paired vertical momentum, horizontal kinetic energy, convective kinetic energy and resolved energy. `pressureLevelDynamicsResolved` is true only after this native step has produced valid evidence. It does not mean resolved droplets or crystals, three-dimensional convection, turbulence or scientific forecast authority.

`axm.foundation-planet.atmosphere-vertical-exchange-receipt/v3` is the compatibility projection of those seven native receipts. It retains the established boundary/free display fields and aggregate energy terms for consumers, but it does not run a second two-band physical process. It names all native interface receipts and explicitly marks `boundedTwoLayerParameterization: false` and `threeDimensionalConvection: false`.

Diagnostic weather relaxation remains an explicit signed atmospheric-boundary moisture and moist-enthalpy term. The atmospheric moist-enthalpy ledger uses the compatibility projection of all eight levels' sensible heat plus vapor latent energy, closes native phase change, records surface latent input, and subtracts native tangent-momentum thermalization plus the native interface buoyancy/dissipation conversion projected by the v3 receipt. The complete vertical ledger additionally includes horizontal and seven-interface convective kinetic energy plus terrain-referenced atmospheric geopotential energy. Surface runoff and baseflow enter the persistent routing queue rather than leaving the model without a receiver. The complete column water ledger closes all native atmospheric water, surface, soil, aquifer, routing queue, ocean, sea ice and snow-on-ice against only the explicit boundary term. The surface-energy ledger now accounts for receipted cloud radiation, sensible and vaporization flux, prescribed deep-surface boundary relaxation, incoming-snow phase enthalpy, frozen-water fusion storage and sensible surface storage. Numerical residuals are tested. Life-off freezes the persistent land-ecology carbon and nitrogen pools, emits a dormant zero-physiology receipt and removes transpiration. It also freezes plankton, particulate organic matter, sinking export, deep remineralization and burial while continuing receipted physical air-sea and mixed-to-deep dissolved exchange. Life-off does not stop abiotic evaporation, groundwater, pressure-level thermodynamics, radiation, snow/ice phase change, convective-energy decay, mixed-layer heat, salinity or physical ocean chemistry.

The `axm.foundation-planet.earth-system-engine/v23` sparse cache persists at most 32 recently visited columns in the browser world envelope. Condition profiles keep isolated history keys over the same canonical cell, and profile replacement is atomic so a new profile ID cannot be initialized from the preceding profile's sample. The engine refuses backward time while tolerating at most 0.0864 seconds of serialization skew between the world clock and a rounded column timestamp. Version 2 through 22 caches migrate into the v23 envelope with explicit transport clocks, runoff reservoirs, canonical-reach lineage, layer wind vectors, mixed-phase cloud fields, pressure-coordinate state and only the dynamics evidence those versions actually contained. A v22 column's legacy `surface-radiation-receipt/v1` is invalidated rather than promoted into fabricated CO2 evidence; the first real local step earns a v2 receipt. A v21 gas-state v2 column partitions its exact bulk C/O2/N2 totals over the eight persisted pressure layers in proportion to dry-air mass, marks the migration checkpoint, and gains no fabricated vertical or horizontal transport receipt. A v20 gas-state v1 column first gains the horizontal-lineage fields without fabricated routes; a v19 column promotes its existing land or ocean exchangeable-atmosphere proxy into the authoritative local gas reservoir exactly once without duplicating carbon or oxygen. Older land, ocean, cryosphere, cloud and native-interface migrations retain their established empty-checkpoint and conservation guarantees. Existing v23 snapshots restore exactly, including native clouds, frozen-surface state, all seven interface reservoirs, eight-level atmospheric gases, current CO2-radiation lineage and current vertical/horizontal lineage, land, mixed-layer and deep-ocean ecology pools and current receipts. Older unreleased mixed-profile caches remain invalid. The separate basin engine persists at most 4,096 reach states and never evicts stored water or chemistry to satisfy that bound. A v1 water-only basin snapshot migrates each reach with an explicit empty chemistry checkpoint and never fabricates historical solutes; v2 snapshots add empty estuary storage, and v3 snapshots gain the atmosphere receiver without invented historical nitrogen-gas inputs.

`axm.foundation-planet.earth-transport-graph/v1` connects loaded cardinal neighbors on the same canonical grid and profile. Each `axm.foundation-planet.earth-transport-step/v8` derives every edge flux from the same pre-step state, scales water and pressure-derived dry-air mass by actual spherical cell area, then applies all transfers simultaneously. `axm.foundation-planet.atmosphere-pressure-horizontal-transport-receipt/v2` contains eight ordered level ledgers plus every mass, tracer, pressure-impulse and Coriolis receipt. Each `axm.foundation-planet.atmosphere-pressure-layer-horizontal-mass-route-receipt/v1` identifies one native level, sender, receiver and transfer ID; records equal dry-air debit and credit; and names the parcel's carried vapor, cloud liquid, cloud ice, absolute sensible enthalpy, tangent momentum and geopotential energy. Independent bounded pressure-gradient and wind/Courant terms determine each level's route. Native-level tracer mixing is separate from dry-air advection. `axm.foundation-planet.atmosphere-biogeochemistry-transport-receipt/v2` reuses those exact native dry-air routes as its backbone. Every `axm.foundation-planet.atmosphere-biogeochemistry-route-receipt/v2` names its parent transfer and carries carbon-dioxide carbon, oxygen and nitrogen gas from the sender's pre-step composition at that route's native layer; it explicitly records that no whole-column average was used. Simultaneous application closes all three area-weighted loaded-domain reservoirs and eight separate level ledgers; per-column local receipts retain eight layer ledgers, the domain digest and exact incoming/outgoing lineage, and compatibility ecology mirrors are resynchronized after commit. Hydraulic-head groundwater flow between land cells and freshwater-anomaly plus mixed-layer heat exchange between ocean cells remain parallel processes. Loaded ocean-ocean edges also mix fourteen persistent dissolved, plankton and detrital C/N/P/O2 pools. Every pool emits a typed `axm.foundation-planet.ocean-ecology-transport-receipt/v1`, is bounded by donor availability, and closes area-weighted carbon, nitrogen, phosphorus and oxygen domain ledgers. Local exchangeable atmospheric gas proxies are deliberately not transported by this ocean process because the atmosphere-owned transport seam is authoritative. Water and dry air are transferred as mass, momentum as kilograms-meters per second and heat as energy, so unequal cell areas at different latitudes do not manufacture those quantities. Reversing caller cell order must produce the same state and digest.

Every absent cardinal neighbor emits `axm.foundation-planet.earth-boundary-receipt/v1`; a sparse domain never silently invents a source or sink outside the loaded graph. Time-misaligned neighbors emit an explicit refusal and do not exchange future state. Transport clocks, the domain receipt, each column's compact `axm.foundation-planet.atmosphere-pressure-column-horizontal-local-receipt/v2` and altered reservoirs persist with the engine. Atmospheric vapor plus cloud liquid plus cloud ice close into the local precipitation/evaporation ledger while deterministic weather relaxation remains visible as signed boundary convergence. Neighbor transport closes every native level's dry-air mass, combined mixed-phase water, fusion-aware moist enthalpy, tangent momentum, horizontal kinetic energy and resolved energy. Surface pressure is the sum of all eight native pressure thicknesses; the two scalar band displays are mass-weighted compatibility projections. `axm.foundation-planet.atmosphere-pressure-layer-horizontal-coriolis-receipt/v1` rotates every native tangent vector by the exact local Coriolis parameter derived from latitude and the planet's 86,400-second day. Northern and southern latitudes deflect opposite ways; exact rotation changes direction without materially changing speed or kinetic energy.

The loaded-domain momentum ledger subtracts every level's exact declared pressure and Coriolis impulses before testing its residual. Its kinetic-energy ledger separates inelastic momentum-mixing dissipation, pressure work and numerically neutral Coriolis work. Each mass receipt embeds `axm.foundation-planet.atmosphere-pressure-layer-horizontal-geopotential-route-receipt/v1`, which records terrain-following sender/receiver heights, carried potential energy and exact destination adjustment work. Hydrostatic height reconstruction is also named so the eight-level geopotential and resolved-energy ledgers close. Projecting eight distinct winds and heights into two display bands necessarily discards within-band variance; the compatibility ledger records those kinetic and geopotential representation terms instead of reporting them as physical loss. Native interface convection is still a bounded bulk parameterization. None of these paths is resolved droplet/ice microphysics, aerosol nucleation, three-dimensional plumes, continuous circulation across unloaded cells, a global circulation solution or scientific precipitation forecasting. This is conservative sparse transport plus explicit forcing and planetary exchange in local tangent coordinates, not global angular-momentum conservation or a scientific pressure-wave solver.

After loaded horizontal transport commits its simultaneous eight-level state, every destination
column normalizes its hypsometric geometry and projects the result into the two compatibility bands.
The native domain receipt proves level-indexed sender/receiver routes and per-level closure; the
per-column local receipt retains its exact domain digest. The pressure-column sync receipt separately
proves that the compatibility projection preserves dry-air mass, water, moist enthalpy and tangent
momentum. The compatibility fields are consumers of native state, not horizontal transport authority.

`axm.foundation-planet.runoff-route-receipt/v1` remains the coarse topographic fallback for water that did not enter a loaded canonical river inlet. It advances a land cell's pre-step routing queue toward its steepest lower, time-aligned loaded cardinal neighbor. Application is simultaneous: new incoming water cannot traverse several cells in one step. A land receiver retains it in its own queue; an ocean receiver gains the exact area-weighted freshwater mass and updates salinity. When no lower neighbor is loaded, the queue is retained and the receipt names the unresolved condition. Together with the basin engine this prevents sparse-domain water deletion while preserving two distinct, receipted scales. At this historical rung, floodplains and sediment remained absent; Rungs 36 and 37 later add finite material and bounded loaded-reach floodplain storage. Long-range pressure waves across unloaded cells, resolved three-dimensional vertical circulation, continuous plume-scale buoyancy and entrainment, continuous upper-air circulation outside the sparse loaded graph, ocean currents and three-dimensional aquifers remain later rungs.

### Rung 34 soil/runoff material ownership addendum

This addendum supersedes the earlier parameterized land-runoff boundary text. Earth-system engine v24
adds `axm.foundation-planet.soil-biogeochemistry-state/v1` to every land column and
`axm.foundation-planet.runoff-biogeochemistry-queue/v1` beside its water queue. The soil state owns
finite dissolved inorganic carbon, dissolved organic carbon, inorganic nitrogen, inorganic phosphorus
and oxygen per square meter. `axm.foundation-planet.soil-runoff-mobilization-receipt/v1` debits those
pools and credits the persistent queue by an identical amount using a runoff-dependent fraction.
Zero runoff moves zero material.

Earth transport v9 applies the same pre-step water fraction to the runoff chemistry queue. Each routed
receipt nests `axm.foundation-planet.runoff-biogeochemistry-transfer-receipt/v1` sender evidence and
either an area-weighted land-queue receiver or
`axm.foundation-planet.ocean-ecology-runoff-input-receipt/v1`. All applications are simultaneous, so
newly received chemistry cannot traverse a second cell during the same invocation. Dedicated runoff
queue and dissolved-ocean receiver ledgers close C/N/P/O2 independently of atmospheric compatibility
mirrors.

Basin engine v5 and inlet receipt v4 debit the same Earth-cell queue before river chemistry v2 accepts
the exact pools. Sender and receiver use one transfer ID. The coupled basin ledger includes land runoff
as an internal persistent reservoir; `parameterizedLandRunoffChemistryBoundary` is false. River,
estuary, ocean and atmosphere behavior downstream remains as previously contracted.

Engine v23 saves migrate to v24 with an explicit empty soil checkpoint and empty runoff chemistry
queue. The first genuine local step establishes a named canonical soil initial condition and exports
nothing; a later real step may mobilize it. Transport v8 and basin v4 receipts are retained only as
legacy evidence and cannot satisfy v9/v5 sender-debit checks. Basin v4 reach chemistry pools migrate
exactly to river chemistry v2, while old parameterized cumulative inputs remain labeled as legacy.
The organ is bounded bulk soil-water chemistry, not resolved soil horizons, mineral weathering,
sorption, redox kinetics, pore networks or scientific watershed chemistry.

### Rung 35 experience projection and authority membrane addendum

`axm.foundation-planet.experience-sector-capsule/v1` is the planet-owned, renderer-independent handoff
for games, observers, AI stewards and future Holodeck or Experiment World brokers. It is created from a
typed `axm.foundation-planet.experience-source/v1` and binds the Caelus world ID, lineage, exact source
revision, current save checksum, canonical latitude/longitude/elevation anchor, local floating-origin
physics frame, active layers, environment, loaded hydrology, Earth-system column and regional ecology.
Environment, layers, hydrology, Earth-system, ecology and physics each receive a component checksum;
their aggregate enters the capsule checksum. Set-like feature lists are normalized before hashing.

The capsule is not canonical state, contains no live Three.js renderer objects and has no mutation,
apply, reset or promotion authority. `axm.foundation-planet.experience-lease/v1` declares exactly one of
three access modes:

- `observer` may receive `axm.foundation-planet.experience-observation/v1` structured state and cannot
  propose a world action;
- `player` may emit `axm.foundation-planet.world-action-proposal/v1`, bound to the capsule and expected
  source revision, but cannot apply it;
- `sandbox` may emit `axm.foundation-planet.detached-sandbox-fork/v1` and mutate that detached candidate
  creatively, but the fork cannot write back or promote itself.

All three use `axm.foundation-planet.experience-intent/v1` plus a monotonic lease sequence. Receipts use
`axm.foundation-planet.experience-intent-receipt/v1`, preserve refusals, and state that neither capsule
nor canonical world was changed. A stale sequence, mismatched actor, wrong capsule lineage, unsupported
schema, exhausted lease budget or mode/authority mismatch fails closed. Proposal payloads are finite,
JSON-only and bounded; open-ended action kinds do not imply permission to execute them.

`axm.foundation-planet.experience-protocol-audit/v1` is read-only and independently validates capsule,
lease, receipt, proposal and sandbox-fork digests plus the no-authority truth boundary. API v31 exposes
the capsule/lease/dispatch/audit seam. Mirror, Holodeck and Experiment World are explicitly unconnected;
the first real cross-system broker, canonical writeback adapter or promotion path is a separate serious
integration step requiring human-governed review.

### Rung 36 finite geomorphic sediment addendum

Each canonical land column now owns finite clay, silt, sand and gravel in
`axm.foundation-planet.surface-sediment-state/v1`. Its declared initial inventory is derived from
substrate texture, soil depth and bulk density. `axm.foundation-planet.surface-erosion-receipt/v1`
uses surface runoff, rainfall impact, a bounded slope proxy, substrate erosion risk, canopy/litter
protection and freeze state to debit only material actually owned by that cell. The exact debit credits
`axm.foundation-planet.runoff-sediment-queue/v1`. A dry step exports zero, no grain can become negative,
and `geomorphicElevationAdjustmentM` records only the bounded local lowering associated with the
debited mass.

Earth transport v10 uses the exact routed water fraction for
`axm.foundation-planet.runoff-sediment-transfer-receipt/v1`. A loaded land receiver gets an
area-weighted queue credit; a loaded ocean receiver gets
`axm.foundation-planet.coastal-sediment-input-receipt/v1`, partitioned between persistent suspended
and deposited coastal grain pools. Sender and receiver share one transfer ID. Missing neighbors retain
the queue rather than dropping mineral mass.

Basin engine v6 and inlet receipt v5 debit the Earth-cell sediment queue before
`axm.foundation-planet.river-sediment-input-receipt/v1` credits persistent reach suspended load.
`axm.foundation-planet.river-reach-transfer/v4` derives its load from the pre-step reach state,
grain-selectively deposits a fraction into persistent bed storage and credits the remainder to the
downstream reach. `axm.foundation-planet.ocean-mouth-receipt/v5` performs the same exact sender debit
and bed partition before crediting the loaded coast. Unloaded downstream or mouth handoffs retain both
suspended and bed material and publish `retainedSedimentKg`. Runoff, river, coast and combined ledgers
close independently for clay, silt, sand and gravel.

Earth engine v24 and basin v5 restore through explicit empty migration checkpoints. They invent no
historical erosion or sediment transport, invalidate legacy receipts and require a genuine later step
to earn current evidence. `axm.foundation-planet.system-audit/v1` now verifies the local surface/queue
schema pair, exact transport sender/receiver receipts, basin inlet lineage, persistent river/coastal
truth and per-grain residuals. The experience capsule retains land surface sediment, runoff queue and
ocean coastal sediment inside its digest-bound Earth-system component. API v32 exposes the organ
description and complete selected state.

The contract remains deliberately bounded: this is a finite bulk material cycle, not a scientific
erosion, soil-formation or landscape-evolution model. It does not resolve entrainment thresholds,
abrasion, grain-shape evolution, channel cross-sections, bank migration, floodplains, deltas, coastal
currents, morphodynamic feedbacks or an always-loaded global sediment network.

## Rung 37 floodplain addendum

`axm.foundation-planet.basin-routing-engine/v7` adds one persistent
`axm.foundation-planet.floodplain-state/v1` beside every owned canonical reach state. The reservoir
owns water, dissolved C/N/P/O2 chemistry, suspended clay/silt/sand/gravel and grain-resolved deposits.
Channel and floodplain are distinct owners. Reach length, width and depth define a declared bulk
bankfull capacity; channel water above it can be debited into floodplain storage. A finite recession
fraction can later debit floodplain water and its proportional chemistry/suspended load back to the
channel.

Every exchange publishes `axm.foundation-planet.floodplain-exchange-receipt/v1`. The receipt binds the
reach, clock, bankfull controls, overbank and return water, both chemistry directions, grain-selective
overbank entrainment, grain-selective deposition and combined residuals. Basin water totals include
both channel and floodplain storage. Basin chemistry and sediment totals likewise include floodplain
reservoirs, so internal exchange cannot masquerade as a boundary source or sink. Unloaded reaches
retain their floodplain state and boundary receipts name retained floodplain water and sediment.

A basin v6 snapshot without floodplain state restores through an empty migration checkpoint. The
first v7 exchange observation clears that checkpoint without moving channel matter, preventing
invented historical inundation. Pre-v7 receipts are not accepted as current floodplain evidence.
The system audit checks receipt schema, paired ownership, water/chemistry/grain residuals and the
truth boundary independently of the general basin check. API v33 exposes the state and compact
diagnostics; experience capsules may carry the bounded semantic reach projection without renderer or
world-mutation authority.

This addendum resolves only persistent, conservative bulk overbank storage and return at loaded
canonical reaches. It does not claim a terrain-raster inundation surface, hydraulic backwater,
levees, bank erosion or failure, floodplain vegetation succession, deposit remobilization, continuous
unloaded-reach evolution or scientific flood forecasting.

## Rung 38 habitat-potential addendum

`axm.foundation-planet.basin-routing-engine/v8` adds a read-only
`axm.foundation-planet.floodplain-habitat-state/v1` to each owned reach. It observes persisted
floodplain material and stores only witnessed wet/dry duration, spell continuity, flood-pulse count,
rolling hydroperiod, peak inundation, deposit increments and bounded fertility signals. Its normalized
open-water, mudflat, reed/sedge, wet-meadow and riparian-woodland fractions are habitat potential, not
plant biomass, species occupancy or population state. Every transition binds to the exact material
exchange digest and proves the observer left the floodplain byte-identical. A v7 migration starts with
zero historical days and pulses.

## Rung 39 flood-event addendum

`axm.foundation-planet.basin-routing-engine/v9` adds
`axm.foundation-planet.flood-event-history-state/v1` beside material floodplain ownership and habitat
memory. The organ observes, but cannot mutate, the exact v1 floodplain exchange. A wet observation
starts or continues an event; the first later dry observation completes it. Events preserve start/end
boundaries, wet duration, observation count, peak water and inundated fraction, integrated inundation
exposure, overbank and return water, C/N/P/O2 payload, and clay/silt/sand/gravel overbank and deposit
payload. `axm.foundation-planet.flood-event-transition-receipt/v1` binds each lifecycle transition to
the exact exchange digest plus equal before/after material digests.

Each reach retains at most the most recent 32 completed events. Lifetime completion/eviction counts,
mean duration, mean recurrence interval and historical peaks remain compact after detail eviction.
The archive and receipt ordering are deterministic. A v8 snapshot restores through an empty event
checkpoint; if its current floodplain is wet, the state must first witness a dry boundary and cannot
invent a pre-migration event. API v35 and the experience capsule expose only a bounded, non-authoritative
semantic projection. The system audit checks schema, exchange lineage, observer purity, lifecycle truth
and archive bounds independently.

This event record is limited to loaded reach observations. It is not a scientific flood-frequency
model, flood forecast, terrain-resolved inundation history, or proof of events while a reach was
unloaded. Completed-event duration counts observed wet intervals; `endDay` is the first observed dry
boundary.

## Rung 40 floodplain-succession addendum

`axm.foundation-planet.basin-routing-engine/v10` adds
`axm.foundation-planet.floodplain-succession-state/v1` to every owned reach. It consumes the exact
current habitat-memory and flood-event receipts and advances five functional guilds with finite seed
banks, juvenile cover and mature cover. Its explicit boundary and internal flows are local seed
production, parameterized external seed rain, germination, decay, recruitment, maturation, ordinary
mortality, flood-caused mortality and post-flood recovery. Guild flood-tolerance traits affect the
disturbance loss. Competition deterministically limits total living cover to 0.98.

`axm.foundation-planet.floodplain-succession-receipt/v1` carries the exact habitat and event digests,
per-guild seed and cover ledgers, closure residuals, the before/after community and truth boundaries.
The audit independently rejects open ledgers, mismatched lineage, duplicate or missing guild flows,
cover beyond capacity and false material authority. With Life disabled, cover and seed banks are
frozen while dormant time remains observable. State, receipts and the basin result are invariant to
caller reach order.

A v9 snapshot restores through an empty succession checkpoint. Its first transition establishes no
cover, seed bank or living history; later colonization can arise only from newly processed boundary
inputs and local reproduction. API v36 and experience capsules expose a bounded renderer-independent
projection. This organ owns functional-guild community state, not plant biomass matter, species
occupancy, resolved individuals, mechanistic plant biochemistry, unloaded continuous evolution or a
scientific succession forecast.

## Rung 41 floodplain-plant-matter addendum

`axm.foundation-planet.basin-routing-engine/v11` adds
`axm.foundation-planet.floodplain-plant-matter-state/v1` beside the v10
functional-guild community. The new organ owns persistent live,
standing-dead and litter carbon and nitrogen for aquatic pioneers, mudflat
annuals, reed/sedge, wet meadow and riparian woodland. It consumes the exact
current succession receipt and derives a finite live-matter target from only
the cover above any migration baseline.

Positive growth is a paired ownership transfer. The deterministic midpoint
Earth cell must be loaded land and must debit its existing land-ecology live
biomass through
`axm.foundation-planet.land-ecology-subgrid-biomass-debit/v1`. One sender
receipt may batch several reach/guild allocations; each receiver records the
same transfer IDs and binds the sender digest. The basin receipt closes loaded
land live biomass plus all persistent reach plant matter across C and N with
the coupled basin aggregate policy: its measured residual and unrounded signed
operands determine a per-identity IEEE-754 bound with a one-kilogram floor.
The partition therefore cannot be counted as both unchanged land biomass and
new floodplain biomass.

Mortality transfers live matter to standing dead. A bounded guild-specific
fall fraction transfers standing dead to litter. Those are internal C/N moves,
not boundaries. Life-off freezes all three pools. Unloaded reaches retain the
state. A v10 snapshot receives a plant-matter migration checkpoint; its first
v11 observation records existing cover as `legacyUnmaterializedCover` and
creates no matter. Later growth above that baseline requires a genuine paired
land-cell debit.

This organ owns neither phosphorus nor plant water because compatible sender
reservoirs have not been established. It also does not implement litter
decomposition, respiration, nutrient uptake, resolved individuals, species
occupancy, mechanistic plant biochemistry or scientific biomass calibration.
API v37, read-only system-audit evidence and experience capsules expose the
bounded semantic state without granting mutation authority.

## Rung 42 floodplain-plant-resource addendum

`axm.foundation-planet.basin-routing-engine/v12` persists
`axm.foundation-planet.floodplain-plant-resources-state/v1` beside the v11
plant C/N organ. The resource organ owns live tissue water plus live,
standing-dead and litter phosphorus. It may carry a supported-carbon
reference solely to bind each resource pool to the exact R41 matter flow; that
reference is not carbon ownership and is excluded from material totals.

Every positive resource increment requires two native evidence lines. The
current plant-matter receipt names the per-guild new-carbon increment, and
`axm.foundation-planet.floodplain-plant-resource-debit/v1` removes the exact
derived water and dissolved P from the persistent local floodplain. Both sides
carry the same uptake transfer IDs and the resource receipt binds the sender
digest. Growth is scaled to the minimum of loaded land C capacity, loaded land
N capacity, local floodplain water capacity and local dissolved-P capacity
before any sender is debited.

Guild mortality transfers supported P from live matter to standing dead and
returns the proportional live tissue water to the local floodplain through
`axm.foundation-planet.floodplain-plant-water-return/v1`. The return sender and
receiver share an exact ID. Standing-dead fall moves P to litter. No
decomposition boundary exists, so P cannot silently leave litter. The basin
step includes live plant water in its loaded water conservation equation and
all plant P in the coupled aquatic phosphorus equation.

Life-off freezes the resource state. Unloaded reaches retain it. A v11 save
receives a migration checkpoint that records existing C/N as legacy
unsupported matter but creates no historical P or water and performs no
uptake. API v38, the read-only resource integrity check and renderer-neutral
experience projection expose this truth.

This contract does not claim root-resolved hydraulics, plant transpiration to
the atmosphere, decomposition or soil-nutrient return, mechanistic
stoichiometry, resolved individuals, species occupancy or scientific
calibration. Mortality water returns to the local floodplain reservoir only;
partitioning it between soil and atmosphere is a named future seam.

## Rung 43 floodplain-decomposition addendum

`axm.foundation-planet.basin-routing-engine/v13` persists
`axm.foundation-planet.floodplain-decomposition-state/v1` beside the plant
matter and resource organs. Decomposition state is process memory only. It
does not own C, N or P and cannot serve as an independent material source.

An eligible per-guild standing-dead or litter transfer is bounded by the
minimum of the plant-matter pool's owned carbon and the plant-resource pool's
supported-carbon reference. Its nitrogen is proportional to the selected
owned matter and its phosphorus is proportional to the selected resource
pool. Unsupported legacy plant matter remains in place and cannot receive
retroactive phosphorus through this seam.

Every positive transfer requires three exact evidence lines with the same
reach, guild, pool and transfer ID:

1. `axm.foundation-planet.floodplain-plant-detritus-matter-debit/v1`
   removes owned C/N from persistent standing dead or litter.
2. `axm.foundation-planet.floodplain-plant-detritus-resource-debit/v1`
   removes the matching non-owning supported-C reference and owned P.
3. `axm.foundation-planet.floodplain-detrital-return-credit/v1` credits that
   C to local dissolved organic carbon and that N/P to local dissolved
   inorganic nitrogen/phosphorus.

`axm.foundation-planet.floodplain-decomposition-receipt/v1` binds all three
receipt digests and exact transfer quantities. The basin ledger closes donor
C/N/P against the local floodplain credit and separately verifies that the
supported-carbon reference mirrors, but never owns, the transferred carbon.
The read-only audit rejects missing or mismatched schemas, reach lineage,
digests, IDs, pool identities, quantities, transition status or residuals.

Moisture, Life abundance and bounded aggregate guild/pool turnover rates
govern activity; a single call cannot exceed one day. Life-off requires zero
allocations and freezes process memory except for explicit dormant time. A
v12 save receives a zero-history checkpoint and its first v13 step moves no
matter. Caller order must reproduce the same three sender/receiver receipt
sets, decomposition receipt, basin digest and persisted state. Unloaded
reaches retain and receipt cumulative return memory. API v39 and the
renderer-neutral experience projection expose the state without granting
mutation authority.

The only R43 receiver is local floodplain chemistry. Atmospheric respiration,
oxygen consumption, soil nutrient delivery, microbial population state,
mechanistic decomposition and scientific calibration remain false. No later
layer may infer those processes from the local C/N/P return receipt.

## Rung 44 floodplain-respiration addendum

`axm.foundation-planet.basin-routing-engine/v14` persists
`axm.foundation-planet.floodplain-respiration-state/v1` beside the material
owners. Respiration state owns only process memory: observed, dormant and
oxygen-limited days, cumulative observed reaction and exact last-receipt
lineage. Floodplain chemistry remains the sole owner of DOC, DIC and dissolved
O2.

`axm.foundation-planet.floodplain-respiration-receipt/v1` first plans a
bounded aerobic reaction from local floodplain moisture, Life abundance and
available DOC. Its potential DOC mineralization is capped by local dissolved
oxygen at 32/12 kg O2 per kg C. The paired
`axm.foundation-planet.floodplain-aerobic-mineralization-receipt/v1` then
records one local atomic chemistry transition:

1. debit floodplain dissolved organic carbon;
2. credit exactly equal floodplain dissolved inorganic carbon;
3. debit only the stoichiometrically required floodplain dissolved oxygen.

The chemistry hand rejects unequal DOC/DIC, incorrect oxygen stoichiometry,
sender overdraw and non-zero Life-off reactions before commit. The process
hand rejects missing, wrong-reach or quantity-mismatched chemistry receipts.
The read-only system audit independently verifies schemas, reach lineage,
receipt digests, transition statuses, local truth boundaries and the basin
carbon/O2 residuals. The coupled basin oxygen ledger includes this declared
local sink rather than hiding it as numerical loss.

One call cannot exceed one day. Life-off freezes all chemistry transfer and
records dormant process time only. A v13 save gains zeroed respiration memory;
the first v14 transition clears its migration checkpoint without moving C/O2
or inventing history. Reversing reach and column order must reproduce the
same chemistry receipts, process receipts, basin digest and persisted state.
Unloaded reaches retain and explicitly receipt cumulative respiration memory.
API v40 and the renderer-independent experience projection expose compact
semantic observations without mutation authority.

This contract does not claim atmospheric gas exchange, an anaerobic pathway,
microbial population state, resolved redox or enzyme chemistry, mechanistic
temperature dependence, soil delivery or scientific calibration. Oxygen
limitation is an enforced availability boundary, not a complete ecological or
biogeochemical model.

## Rung 45 floodplain-atmosphere gas-exchange addendum

`axm.foundation-planet.basin-routing-engine/v15` adds persistent
`axm.foundation-planet.floodplain-gas-exchange-state/v1` to each reach. This
state owns only observed, inactive and atmosphere-unavailable time, cumulative
observed exchange and exact last-receipt lineage. Floodplain chemistry remains
the DIC and dissolved-O2 owner; the existing eight-layer local atmosphere
remains the CO2-carbon and atmospheric-O2 owner.

For a loaded atmosphere cell, one bounded plan computes an exchangeable-DIC
evasion amount and a dissolved-oxygen deficit reaeration amount. DIC evasion is
capped by the local floodplain DIC reservoir. Reaeration is capped by the
temperature-parameterized freshwater saturation deficit and the actual native
surface-layer atmospheric oxygen reservoir. The plan cannot mutate either
owner.

Commit requires one shared exchange ID across two atomic owner hands:

1. `axm.foundation-planet.floodplain-gas-exchange-receipt/v1` debits local DIC
   and credits local dissolved O2;
2. `axm.foundation-planet.atmosphere-floodplain-gas-exchange-receipt/v1`
   credits native atmosphere layer-0 CO2 carbon and debits layer-0 oxygen;
3. `axm.foundation-planet.floodplain-gas-exchange-process-receipt/v1` binds
   both owner digests, exact quantities, reach, atmosphere cell and transition.

The atmosphere hand rejects a surface-layer oxygen overdraw before mutation.
The process hand rejects a missing, mismatched or wrong-lineage owner pair.
The read-only audit independently checks schemas, transfer identity, quantity
pairing, native layer ownership, transition statuses and four C/O2 residuals.
The native atmosphere owner permits at most 0.001 kg absolute binary
floating-point residue when a small flux is subtracted from a planet-cell gas
reservoir; this explicit owner-level bound is separate from the basin's
per-identity coupled aggregate policy.
The coupled basin carbon and oxygen ledgers include the same explicit transfer,
so gas exchange cannot hide material loss or creation.

Physical exchange continues with Life off. A v14 basin snapshot gains an empty
migration checkpoint whose first v15 transition moves no C/O2 and invents no
history. If the matching atmosphere cell is not loaded, the process emits an
explicit zero-transfer unavailable observation and no owner receipts. Unloaded
reach memory remains persisted and receipted. API v41 and the experience
projection expose compact state without write authority.

This is a local bounded one-way CO2-evasion/O2-reaeration parameterization. It
does not claim bidirectional Henry-law equilibrium, carbonate speciation,
resolved boundary-layer turbulence, wind or wave transfer, barometric and
salinity corrections, global mixing, continuous unloaded exchange or
scientific calibration.

## Rung 46 bidirectional floodplain carbon-gradient addendum

`axm.foundation-planet.basin-routing-engine/v16` migrates the gas-exchange
process to `axm.foundation-planet.floodplain-gas-exchange-state/v2`. The state
still owns process memory only. Floodplain chemistry remains the local DIC and
dissolved-O2 owner, and the native eight-layer atmosphere remains the CO2
carbon and atmospheric-O2 owner.

The carbon plan compares two bounded quantities:

1. an exchangeable fraction of floodplain-owned DIC; and
2. an aqueous CO2-carbon equilibrium target derived from local water mass,
   temperature and the native atmosphere surface layer's CO2 ppm proxy.

The declared reference is 0.167 mg C/L at 420 ppm and 25 C. The temperature
factor is `exp(-0.025 * (temperatureC - 25))`; local CO2 scales the target
linearly relative to 420 ppm. This is an explicit deterministic proxy, not a
claim that total DIC is dissolved molecular CO2 or that pH, alkalinity and
carbonate speciation have been solved.

A positive signed gradient proposes `carbonToAtmosphereKgC`; a negative
gradient proposes `carbonToFloodplainKgC`. Both cannot be positive in one
transition. Evasion is bounded by actual floodplain DIC. Invasion is bounded by
actual native atmosphere layer-0 CO2 carbon. Oxygen-deficit reaeration remains
bounded separately by local dissolved-O2 saturation deficit and actual layer-0
atmospheric oxygen.

Commit requires one exchange ID across these v2 receipts:

1. `axm.foundation-planet.floodplain-gas-exchange-receipt/v2` records the
   exclusive DIC debit or credit plus any dissolved-O2 credit;
2. `axm.foundation-planet.atmosphere-floodplain-gas-exchange-receipt/v2`
   records the opposite CO2-carbon side and the atmospheric-O2 debit in native
   layer 0;
3. `axm.foundation-planet.floodplain-gas-exchange-process-receipt/v2` binds
   both owner digests, direction, quantities, reach and atmosphere cell.

The atmosphere hand refuses either CO2-carbon or oxygen overdraw before
mutation. Basin v16 checks the signed owner-to-owner carbon residual, oxygen
residual, native-layer lineage, exclusive direction and process/owner digest
binding. The prior owner-level 0.001 kg absolute floating-point bound remains
explicit for subtracting small fluxes from planet-cell reservoirs.

A v15 snapshot preserves v1 observed days, unavailable days, cumulative
evasion and cumulative reaeration. It initializes cumulative carbon invasion
to zero and sets a migration checkpoint. The first v16 observation performs no
transfer, clears the checkpoint and invents no reverse history. Previous basin
receipts are not accepted as v16 bidirectional evidence. API v42 and the
renderer-independent experience projection expose the compact v2 state without
write authority.

This addendum supersedes R45 only for carbon directionality. It remains a
bounded concentration-gradient parameterization, not a complete Henry-law,
carbonate-speciation, air-water turbulence, wind/wave, bubble, barometric,
salinity or scientific gas-flux model.

## Rung 47 floodplain denitrification addendum

`axm.foundation-planet.basin-routing-engine/v17` adds persistent
`axm.foundation-planet.floodplain-denitrification-state/v1` process memory to
each reach. Floodplain chemistry remains the DOC, DIC and DIN material owner;
the native eight-layer atmosphere remains the nitrogen-gas owner. The process
state owns observation counts, bounded activity diagnostics, cumulative
reaction quantities and evidence digests only.

The plan runs after local aerobic respiration and before physical air-water gas
exchange. It reads actual floodplain water and chemistry, computes dissolved
oxygen in mg/L, and opens an anoxia gate only below the bounded configurable
threshold (2 mg/L by default). Potential daily DOC consumption is further
bounded by wetness, living abundance, actual DOC and a configurable reactive
nitrate-equivalent fraction of actual DIN (0.5 by default). Calling that
fraction nitrate-equivalent is a truth boundary: DIN is not relabelled as
fully nitrate and nitrate/ammonium speciation is not present.

The declared bounded stoichiometry is one kg DOC-C to one kg DIC-C and 14/15
kg DIN-N to 14/15 kg N2-N. A material-moving transition requires one transfer
ID across:

1. `axm.foundation-planet.floodplain-denitrification-reaction-receipt/v1`,
   which debits floodplain DOC and DIN, credits floodplain DIC and closes the
   local carbon and nitrogen boundary;
2. `axm.foundation-planet.atmosphere-gas-boundary-input-receipt/v1`, which
   identifies `floodplain-denitrification`, binds the reaction digest and
   credits nitrogen only to native atmosphere layer 0; and
3. `axm.foundation-planet.floodplain-denitrification-receipt/v1`, which binds
   the reach, atmosphere cell, transfer ID, quantities and both owner digests.

The system audit checks both owner schemas, exact lineage and quantities,
surface-layer placement, carbon closure, nitrogen reaction closure,
floodplain-to-atmosphere transfer closure and both owner residuals. An unloaded
atmosphere produces a typed zero-transfer process observation and no owner
receipts. Life off freezes all reaction pools. A v16 snapshot initializes
empty process memory with a migration checkpoint; its first v17 observation
moves no material and invents no history. Previous v16 receipts remain legacy
evidence and are not relabelled as v17 denitrification evidence. API v43 and
the renderer-independent experience projection expose this state read-only.

This is not a mechanistic microbial or redox model. It does not resolve
nitrate/ammonium, nitrite, nitrous oxide, pH, alkalinity, porewater transport,
temperature kinetics or scientifically calibrated denitrification rates.

## Rung 48 temperature-responsive denitrification addendum

`axm.foundation-planet.basin-routing-engine/v18` and
`axm.foundation-planet.floodplain-denitrification-state/v2` add a bounded
temperature response to the R47 process without changing material ownership.
For each loaded reach, the plan uses the owning Earth-system column's surface
temperature as an explicit floodplain-water-temperature proxy. It multiplies
the existing wetness, anoxia and living activity factors by
`Q10^((temperatureC - referenceTemperatureC) / 10)`. Defaults are Q10 2 and
reference 20 °C; accepted Q10 is bounded to 0.5–4 and the resulting response
factor is bounded to 0.05–4.

The v2 process state adds temperature-constrained duration and the latest proxy
temperature, reference, Q10, unclamped factor, bounded factor and constraint
flag. `axm.foundation-planet.floodplain-denitrification-receipt/v2` binds those
diagnostics to the unchanged v1 floodplain reaction receipt and v1 atmosphere
boundary receipt. Therefore all R47 transfer IDs, paired owner debits/credits,
stoichiometry and conservation checks remain authoritative. The audit also
requires finite bounded temperature diagnostics and the declared proxy truth
boundary.

A v17 basin snapshot preserves every prior denitrification observation counter
and cumulative reaction total, initializes temperature-constrained history to
zero, drops legacy receipts and requires one v18 zero-transfer checkpoint. The
checkpoint cannot invent historical reaction or temperature evidence. API v44
and experience capsules project the new diagnostics read-only.

The surface value is a forcing proxy, not persistent floodplain water
temperature. This rung does not resolve thermal inertia, freeze/thaw,
Arrhenius kinetics, microbial populations, nitrate/ammonium speciation or
scientifically calibrated rates.

## Rung 49 nitrate and ammonium ownership addendum

`axm.foundation-planet.river-chemistry-state/v3` replaces aggregate DIN-only
ownership with persistent `dissolvedNitrateNitrogenKgN` and
`dissolvedAmmoniumNitrogenKgN` reservoirs. The retained
`dissolvedInorganicNitrogenKgN` field is an exact compatibility sum and must
equal nitrate plus ammonium after every normalization, debit, credit and
transport. `axm.foundation-planet.floodplain-state/v2` owns the same pair.

A generic land-runoff nitrogen input is partitioned by
`nitrateFraction` at the river receiver; the default is 0.5. The v3 river
input receipt records both credited species, the fraction, exact transfer
identity and a `measuredInputSpeciationClaimed: false` boundary. The sender's
total-N debit is unchanged. River-to-river, river-to-estuary, overbank and
return-flow transfers carry nitrate and ammonium with the exact transported
water fraction. Basin v19 reports independent nitrate, ammonium and aggregate
compatibility residuals, each under the existing one-kilogram numerical
tolerance.

`axm.foundation-planet.floodplain-detrital-return-credit/v3` credits returned
plant nitrogen to ammonium and proves nitrate is unchanged under the R60
per-channel numeric policy. Denitrification
then reads actual owned nitrate. The v2 local reaction receipt debits nitrate,
leaves ammonium invariant, closes DOC-to-DIC carbon and nitrate-to-N2-N
stoichiometry, and preserves the exact native-atmosphere receiver lineage.
`axm.foundation-planet.floodplain-denitrification-state/v3` and its v3 process
receipt retain the R48 temperature response while removing the former
reactive-nitrate-equivalent fraction. Ammonium is never eligible for this
reaction.

Restoring `axm.foundation-planet.basin-routing-engine/v18` into v19 preserves
total channel and floodplain DIN, cumulative denitrification reaction history
and temperature history. Legacy aggregate DIN is initialized 50/50 into the
new pools as a declared model initialization, not reconstructed evidence.
Legacy receipts are dropped, all new owner states carry migration checkpoints,
and the first v19 process observation must move zero material and invent no
history. API v45 and the experience capsule expose compact river and
floodplain species projections without mutation authority.

Nitrite, nitrification, pH and alkalinity remain unresolved. A future
nitrification rung must add an explicit ammonium debit, nitrate credit and
oxygen/alkalinity ledger; the [EPA Nutrient Control Design Manual](https://www.epa.gov/sites/production/files/2019-08/documents/nutrient_control_design_manual.pdf)
documents the oxygen and alkalinity demands that make a silent conversion
scientifically dishonest.

## Rung 50 oxygen-ledgered floodplain nitrification addendum

`axm.foundation-planet.floodplain-state/v3` adds the local
`axm.foundation-planet.floodplain-nitrification-reaction-receipt/v1` owner
boundary. The reaction debits persistent dissolved ammonium-N, credits
persistent dissolved nitrate-N by the same amount, and debits persistent
dissolved oxygen at 4.57 kg O2 per kg N. Its receipt proves exact transfer
identity and independently closes ammonium debit, nitrate credit, aggregate
DIN, dissolved-oxygen debit and oxygen stoichiometry. No atmospheric boundary
receipt exists because all three material pools belong to the same floodplain
chemistry owner.

`axm.foundation-planet.floodplain-nitrification-state/v1` is persistent
process memory, and `axm.foundation-planet.floodplain-nitrification-receipt/v1`
binds its transition to the current local reaction receipt and digest. The
bounded first-order plan reads actual owned ammonium and dissolved oxygen,
requires aerobic availability, uses wetness and Life controls, and applies the
loaded Earth-system surface temperature as an explicit water-temperature proxy
with default Q10 2 and reference 20 C. Gas exchange runs first, so current-step
reaeration is material available to the reaction. Only oxygen above the
configured minimum concentration is reactive, so a bounded step retains that
aerobic reserve. Life-off permits no reaction or cumulative-process change.

Nitrification also creates an explicit 7.14 kg CaCO3-equivalent alkalinity
demand diagnostic per kg N. The 4.57 oxygen factor and 7.14 alkalinity factor
follow the [EPA Nutrient Control Design Manual](https://www.epa.gov/sites/default/files/2019-08/documents/nutrient_control_design_manual.pdf).
The diagnostic is not a debit: Caelus does not yet own floodplain alkalinity,
river alkalinity or pH state. This rung therefore makes no material-alkalinity,
pH-feedback, nitrite-intermediate, microbial-population, persistent
water-temperature or calibrated-rate claim. Its ammonium-to-nitrate reaction
is a declared one-step approximation.

`axm.foundation-planet.basin-routing-engine/v20` and step v20 include the
reaction in species-specific nitrogen and dissolved-oxygen conservation
ledgers, retain unloaded nitrification memory, and expose typed reaction and
process receipt arrays to the read-only system audit. Restoring v19 preserves
all existing owner and process state, initializes only the absent v1
nitrification organ to zero, drops legacy receipts, and requires one typed
zero-reaction checkpoint without invented history. API v46 and the experience
capsule project the compact result without mutation authority.

## Rung 51 end-to-end alkalinity addendum

This addendum supersedes R50 only for material alkalinity. R50's cumulative
alkalinity-demand value remains preserved as explicitly legacy diagnostic
history and is not migrated into the v2 material-debit total.

R51 adds a persistent acid-neutralizing-capacity ledger represented only as
kilograms of CaCO3 equivalent. The material owners are
`axm.foundation-planet.soil-biogeochemistry-state/v2`,
`axm.foundation-planet.runoff-biogeochemistry-queue/v2`,
`axm.foundation-planet.river-chemistry-state/v4`,
`axm.foundation-planet.floodplain-state/v4`,
and the mixed layer in
`axm.foundation-planet.ocean-ecology-state/v3`. Process organs observe and bind
these owners; they do not silently become material owners.
`axm.foundation-planet.estuary-state/v2` retains sediment and cumulative
reaction history, while alkalinity itself crosses the estuary as an exact
transformation flux rather than a persistent estuary-water pool.

New canonical soil state receives a deterministic bedrock-responsive initial
condition. Carbonate/limestone substrates begin with more capacity than
granite/gneiss substrates under otherwise comparable forcing, consistent with
the qualitative [USGS alkalinity overview](https://www.usgs.gov/water-science-school/science/alkalinity-and-water).
New canonical ocean state uses a declared open-ocean 2,300 micromole/kg total
alkalinity reference at salinity 35 from NOAA's
[CO2 system calculation guidance](https://www.ncei.noaa.gov/access/ocean-carbon-acidification-data-system/oceans/co2rprt.html).
Neither value is a measured local observation. Restoring prior soil, runoff,
river, floodplain or ocean schemas preserves all prior C/N/P/O2, species and
process history, initializes material alkalinity to zero and records a
migration checkpoint. Prior estuary state preserves sediment and reaction
history while initializing cumulative generated alkalinity to zero. No
historical material alkalinity is reconstructed.

Every material route carries alkalinity beside the existing dissolved tracers:

1. v2 soil mobilization and runoff-transfer receipts debit the finite soil or
   runoff owner and credit the exact receiving queue, land cell or loaded ocean;
2. river input v4, floodplain exchange v3 and basin inlet/reach/mouth v7 receipts
   bind sender and receiver quantities under one transfer ID;
3. estuary flux v2 passes river alkalinity to the coast while separately
   recording reaction generation; and
4. ocean flux v3 plus river/runoff input v2 receipts and Earth transport v11
   conserve mixed-layer alkalinity across loaded neighbors.

Nitrification in `axm.foundation-planet.floodplain-nitrification-state/v2`
debits 7.14 kg CaCO3 equivalent per kg ammonium-N converted, in addition to the
existing 4.57 kg O2 debit. Available owned alkalinity is a hard material cap;
the plan cannot overdraw it. Floodplain denitrification state/receipt v4 and
local reaction receipt v3 credit 3.57 kg CaCO3 equivalent per kg nitrate-N
converted to N2-N. Estuary denitrification applies the same generation factor.
The nitrification factors follow the
[EPA Nutrient Control Design Manual](https://www.epa.gov/sites/default/files/2019-08/documents/nutrient_control_design_manual.pdf);
the denitrification factor follows EPA's
[Municipal Nutrient Removal Technologies report](https://www.epa.gov/sites/default/files/2019-08/documents/municipal_nutrient_removal_technologies_vol_i.pdf).

`axm.foundation-planet.basin-routing-engine/v21` and step v21 include specific
runoff, river, estuary and ocean alkalinity residuals plus a coupled residual
that accounts for nitrification consumption and floodplain/estuary
denitrification generation. The read-only system audit adds a dedicated
`end-to-end-alkalinity-ledger` check for schemas, route lineage, reaction
stoichiometry, owner debits/credits and all residuals. Experience capsules and
API v47 expose only read-only projections.

The [USGS field-method definition](https://www.usgs.gov/publications/chapter-a6-section-66-alkalinity-and-acid-neutralizing-capacity)
supports interpreting the pool as capacity to neutralize strong acid. It does
not support relabelling that capacity as pH. R51 does not resolve carbonate,
bicarbonate, borate or other species; solve the carbonate system; couple DIC to
equilibrium; calculate pH; exchange alkalinity with the deep ocean; claim
measured concentrations; or claim calibrated watershed, estuary or ocean
chemistry.

## Rung 52 mixed-layer/deep-ocean alkalinity addendum

R52 extends, but does not reinterpret, R51's kg-CaCO3-equivalent
acid-neutralizing-capacity ledger. The additional material owner is
`axm.foundation-planet.deep-ocean-state/v2`, whose
`alkalinity.dissolvedKgCaCO3Eqm2` field is finite, non-negative and included in
the ocean column's total alkalinity. The mixed owner remains
`axm.foundation-planet.ocean-ecology-state/v4`;
`axm.foundation-planet.deep-ocean-exchange-receipt/v2` is the only local
vertical transfer authority between them.

The existing bounded exchange-depth calculation compares mixed and deep
concentrations and produces a signed
`alkalinitySurfaceToDeepKgCaCO3Eqm2`. A positive value debits the mixed layer
and credits the deep ocean; a negative value performs the exact reverse. The
receipt publishes
`alkalinityResidualKgCaCO3Eqm2 = finalMixed + finalDeep - initialMixed -
initialDeep`, with tolerance `1e-9 kg-CaCO3-equivalent/m2`. Ocean ecology flux
v4 includes the deep owner in its initial/final total and requires both its
local total residual and the nested vertical residual to close. Physical
alkalinity exchange continues when Life is disabled and creates no biological
reaction claim.

New canonical deep state receives the same declared salinity-scaled 2,300
micromole/kg open-ocean reference used at the R51 mixed-layer boundary. It is a
model initial condition, never a measured local value. NOAA PMEL's
[carbonate-system guidance](https://www.pmel.noaa.gov/co2/files/dickson_thecarbondioxidesysteminseawater_equilibriumchemistryandmeasurementspp17-40.pdf)
identifies DIC and total alkalinity as conservative quantities with respect to
mixing. NOAA NCEI's
[Guide to Best Practices for Ocean CO2 Measurements](https://www.ncei.noaa.gov/access/ocean-carbon-acidification-data-system/oceans/Handbook_2007/Guide_all_in_one.pdf)
defines measured total alkalinity and the broader equilibrium system; R52 does
not claim either.

Normalization of `axm.foundation-planet.deep-ocean-state/v1` preserves all
prior carbon, nitrogen, phosphorus and oxygen values, creates deep alkalinity
at exact zero with `explicit-zero-migration`, sets a migration checkpoint, and
drops the obsolete v1 exchange receipt. A v26 Earth-system checkpoint preserves
the R51 mixed-layer alkalinity unchanged while applying that deep migration.
No historical deep alkalinity or vertical flux is fabricated. Current v27
snapshots restore byte-for-byte through the JSON checkpoint boundary.

`axm.foundation-planet.system-audit/v2` adds
`mixed-deep-ocean-alkalinity-ledger`. When a current vertical receipt exists,
the check requires current owner and receipt schemas, finite non-negative
owners, a finite signed exchange, exact residual closure, nested receipt
lineage, and false measurement/speciation/pH claims. With typed owners but no
committed step it reports the exchange seam as honestly unobserved. The audit,
API v48 and experience projection remain read-only.

This addendum does not implement carbonate or bicarbonate pools, borate or
other minor species, DIC/alkalinity equilibrium, pH, buffering feedbacks,
calcium-carbonate precipitation/dissolution, measured-chemistry assimilation,
benthic or hydrothermal alkalinity reactions, unloaded-column exchange or
three-dimensional circulation. The local exchange-depth proxy is not a
scientific ocean-circulation model.

### R52 restore-clock continuity boundary

`axm.foundation-planet.basin-routing-engine/v22` adds
`axm.foundation-planet.basin-clock-alignment-checkpoint/v1`. It is available
once, and only for a profile loaded through `restore()`. If that saved basin
clock differs from the already committed Earth-transport clock, the latter is
the continuity authority. The engine records the old basin day, committed
transport day and signed delta; preserves all reach-owned material exactly;
sets the basin clock to the committed day; and invalidates the latest routing
receipt because it no longer describes the aligned boundary.

The checkpoint explicitly states that no historical routing was reconstructed
and no material replay occurred. A matching restored clock is left unchanged.
Fresh profiles are ineligible, a profile cannot align twice, and all later
clock mismatches retain the existing hard refusal. Basin routing step v21 is
unchanged because this repair changes saved-state continuity, not transport or
material-transfer semantics. API v48 projects the result read-only through
`basinRoutingStatus()`.

Browser-local world-state v2 also defines a transactional storage boundary.
The next in-memory envelope and revision are installed only after `setItem`
succeeds. If the normal JSON envelope exceeds the origin quota, the store
retries with
`axm.foundation-planet.compressed-world-state-storage/v1` using the explicit
lossless `lzw-uint16-base64` encoding. Loading decompresses first and then
applies the unchanged world identity and checksum validation. Compression does
not grant secrecy or authority. If raw and compressed writes both fail, the
old envelope remains active and the runtime exposes a visible `SAVE FAILED`
diagnostic plus a console error.

## Rung 53 mixed-layer carbonate diagnostic addendum

R53 adds no material owner. The persistent mixed-layer DIC, total-alkalinity
and dissolved-inorganic-phosphorus fields remain authoritative. The new
`axm.foundation-planet.mixed-layer-carbonate-diagnostic/v1` is a deterministic,
read-only observer of those fields plus mixed-layer depth, temperature and
salinity. Its output is current equilibrium state, not a separate pool and not
historical evidence.
Mixed-layer depth is converted to solution mass with an explicit 1,000 kg/m3
reference density. R53 does not claim a measured density or TEOS-10 state.

The declared surface-pressure constant set uses Lueker et al. (2000) K1/K2,
Dickson (1990) KB, Millero (1995) KW and phosphate constants, and the Lee et
al. (2010) boron-to-salinity relationship. Hydrogen ion and equilibrium
constants use the total scale. The Lueker open-ocean validity envelope is
2–35 °C and salinity 19–43. Inputs outside it produce a typed
`OUTSIDE_CONSTANT_VALIDITY` result with no pH or species; clamping and silent
extrapolation are forbidden.

For a solved result, CO2-star + bicarbonate + carbonate must reproduce input
DIC, the four phosphate species must reproduce input dissolved inorganic
phosphorus, and calculated total alkalinity must match the owner within
`1e-12 mol/kg`. The output publishes the pH bracket, iteration count and all
three residuals. Bisection is bounded to 80 iterations and pH 3–12. A failure
to bracket or converge is not a valid typed environmental refusal and fails
the runtime integrity check.

`axm.foundation-planet.ocean-ecology-state/v5` and flux v5 carry the diagnostic
and exact source-owner binding. Restoring ocean state v4 preserves all
C/N/P/O2/alkalinity owners, recomputes only the current observer and invalidates
the old v4 ocean flux receipt rather than relabelling it. Earth-system engine
v28 preserves compatible v27 transport receipts, while system audit v3 adds
`mixed-layer-carbonate-diagnostic`. API v49 and experience projections are
read-only.

The observer includes carbonate, borate, water and phosphate alkalinity. It
does not include silicate, fluoride, sulfide or ammonia alkalinity; pressure corrections;
deep-ocean pH; calcium or mineral saturation; precipitation/dissolution;
measured inputs; or pH feedback on any process. It must not be used as evidence
for those absent capabilities.

## Rung 54 carbonate-informed air-sea carbon addendum

R54 grants no new material owner. The persistent local atmosphere carbon pool
and mixed-layer DIC pool remain authoritative. The pure
`axm.foundation-planet.air-sea-carbon-exchange-proposal/v1` may propose one
signed transfer, and only the existing paired owner-move seam may apply it.
Positive means atmosphere to mixed-layer DIC; negative means mixed-layer DIC
to atmosphere. The applied amount must equal the proposal after sender bounds,
and combined atmosphere-plus-ocean carbon must remain unchanged.

A solved proposal requires the current
`axm.foundation-planet.mixed-layer-carbonate-diagnostic/v1`. Its DIC,
alkalinity, dissolved inorganic phosphorus, depth, temperature and salinity
source signature must match the proposal inputs at their declared publication
precision. `CARBONATE_DIAGNOSTIC_UNAVAILABLE`,
`CARBONATE_SOURCE_MISMATCH` and other typed method refusals carry zero proposed
and applied carbon. A refusal cannot be relabelled as active exchange.

Atmospheric dry CO2 is the local atmosphere-owned ppm compatibility proxy, not
an observation. At surface pressure, the proposal applies Weiss-and-Price
seawater vapor pressure, Weiss (1974) CO2 solubility, and the Weiss virial `B`
plus cross-virial delta fugacity correction. The audit holds
`ln(K0) = -3.5617` at 25 °C and salinity 35 and independently recomputes wet-air
pCO2, fCO2, equilibrium CO2-star, disequilibrium, raw relaxed mass, sender
bound, direction and application. The declared method pressure envelope is
800–1,150 hPa; it is not authority for deep or unusual-pressure chemistry.

The relaxation fraction may respond to wind, sea ice and duration but is an
explicit bounded bulk parameterization. R54 does not claim a calibrated
gas-transfer velocity, measured ocean skin temperature, measured pCO2,
cool-skin/warm-layer correction, global ocean circulation, or
species-resolved pH response. Those absent capabilities remain false in state,
receipt, audit, manifest and API projections.

Ocean ecology state/flux v6 migrates v5 material exactly and invalidates the
empirical v5 flux receipt. Earth-system engine v29 migrates v28 and may retain
compatible transport receipts. System audit v4 adds
`carbonate-informed-air-sea-carbon-exchange`; API v50 exposes the current
receipt read-only. None of these migrations fabricates historical R54 evidence.

## Rung 55 native phase thermal-envelope addendum

R55 grants no new water, heat or momentum owner. The pure
`axm.foundation-planet.atmosphere-phase-thermal-envelope/v1` proposal bounds
each warming or cooling phase change by the native layer's available sensible
temperature headroom between -120 and 70 °C. Only the supported mass moves and
its complete latent energy is applied. The unsupported request remains in its
source phase; a later pressure-column normalization may not use temperature
clipping to erase energy after the material move.

Pressure dynamics v4, layer phase v3, precipitation descent v3, and both
compatibility phase v3 schemas publish their envelope lineage, limit counts,
largest rejected request and closure residuals. Earth-system engine v30
migrates v29 by preserving current material, thermal and momentum owners,
invalidating old phase receipts and resetting only the ephemeral atmosphere
energy receipt to a labelled present-state checkpoint. It may not fabricate
historical R55 evidence. System audit v5 requires current envelope lineage,
eight valid layer receipts, in-envelope temperatures and sub-tolerance native
water, moist-enthalpy and resolved-energy residuals when a current receipt is
present. With valid state but no current receipt, the check is honestly
`NOT_APPLICABLE`.

The held R54 ocean counterexample and the 36-location adversarial sweep support
the bounded repair. They do not establish resolved cloud microphysics,
upper-atmosphere chemistry, calibrated convection, scientific forecast quality
or closure under every indefinitely repeated boundary forcing. The separately
observed constant-wet 365-day land residual remains typed **BROKEN**
counterevidence outside this repair's acceptance claim.

## Rung 56 boundary-energy ledger addendum

The prescribed compatibility boundary may request an aggregate two-band
temperature that cannot be represented without moving one or more native
pressure layers outside the declared -120 to 70 °C envelope. Native state
remains authoritative. A reconciliation that retains a layer at an envelope
limit is not allowed to silently charge the compatibility request as though it
were fully applied.

Every current local step therefore persists
`axm.foundation-planet.atmosphere-boundary-energy-receipt/v1`. It records the
compatibility initial and requested final moist enthalpy, native initial and
final moist enthalpy, requested and applied boundary changes, initial and final
projection adjustments, their native-envelope reconciliation, the boundary
sync residual, envelope-limited layer IDs and a closed receipt identity. The
whole-atmosphere ledger uses the applied native boundary change. Requested and
applied values remain separately inspectable; the reconciliation term may not
be used to erase an unrelated phase, transport, surface or rounding residual.

Earth-system engine v31 migrates v30 material, temperature and momentum owners
unchanged. Valid v4 native pressure-dynamics evidence remains valid, while the
new boundary receipt is `NOT_APPLICABLE` until a current v31 step produces it.
A migration checkpoint must say whether legacy phase evidence or legacy
boundary-energy evidence was discarded. System audit v6 fails a stepped current
column when the receipt is missing, its identity is altered, its budget copy
diverges, or its applied value is not the value charged by the atmosphere
ledger.

The held constant-wet land replay proves the bounded contract only: the first
material boundary-envelope reconciliation occurs on day 215; the maximum
explicit adjustment is 207,978.793070 J/m²; and the 365-day maximum
whole-atmosphere residual is 0.006005 J/m². It does not grant scientific
boundary-layer calibration, global circulation, upper-atmosphere chemistry, or
forecast authority.

## Rung 57 land subgrid numeric-closure addendum

A land-to-floodplain biomass debit must preserve its measured carbon and
nitrogen residuals. It may not erase those residuals, round them to zero, or
declare a free-form tolerance. Current evidence uses
`axm.foundation-planet.land-ecology-subgrid-biomass-debit/v2` and the typed
`axm.foundation-planet.land-ecology-mass-closure-policy/v1`.

For each mass channel, the permitted representation bound is the greater of
0.000001 kg and eight times `Number.EPSILON` times the largest absolute recorded
operand participating in the debit identity. The receipt records the operand
scale, factor, floor, derived bound and unmodified residual. System audit v7
must independently recompute the bound from the before, debit and after values;
it fails missing policy evidence, changed residuals, altered factors or an
inflated sender-supplied bound. Passing this check proves only that the measured
closure error is consistent with the declared binary floating-point policy.

Basin engine v23 and step receipt v22 require current v2 land sender evidence
before `truthBoundaryValid` can pass. Migration from engine v22 preserves
basin-owned profiles, material owners and clocks, but an older step v21 receipt
is discarded into an explicit no-current-receipt state. Migration does not
rewrite old evidence as though it satisfied the new policy.

The held 48-case Earth-cell sweep observed a maximum 0.000061035 kg residual
and no failures after this repair, versus 11 failures under the former fixed
one-milligram comparison. The maximum observed use of the derived bound was
11.9%. These measurements bound the tested contract; they do not establish
arbitrary-precision conservation, scientific calibration or closure for all
unobserved states.

## Rung 58 floodplain plant-resource numeric-closure addendum

A floodplain plant-resource transition must preserve the measured supported
carbon, phosphorus and live tissue-water residuals separately for every guild
and for the aggregate owner. Current evidence uses
`axm.foundation-planet.floodplain-plant-resources-receipt/v2` and the typed
`axm.foundation-planet.floodplain-plant-resource-mass-closure-policy/v1`.

For each material channel, the representation bound is the greater of
0.0000001 kg and eight times `Number.EPSILON` times the largest absolute
recorded operand in that channel's before-transfer-after identity. A receipt
may not substitute an operand from another channel, erase the measured residue,
or choose a larger free-form tolerance. System audit v8 independently derives
all guild and aggregate bounds from the recorded operands, verifies the
reported maximum residue and utilization, and fails an inflated tolerance even
when the underlying transition is otherwise conservative.

Basin engine v24 and step receipt v23 require current v2 plant-resource
evidence before the basin plant-resource truth boundary can pass. Migration
from engine v23 preserves profiles, material owners and clocks, but discards an
older step-v22 receipt until a current step creates current evidence. It does
not reconstruct historical floating-point closure.

The held 150-case Earth-cell sweep observed a maximum 0.000000476837 kg
residual and no failures under the derived policy, versus five failures under
the former fixed 0.0000001 kg comparison. Maximum observed bound utilization
was 3.36%. A wider 250-case adversarial representation sweep produced no
derived-bound failures while preserving a maximum 0.25 kg residue at a
5-quadrillion-kilogram operand scale. These are bounded representation tests,
not scientific calibration, arbitrary-precision conservation or an exhaustive
planet-state proof.

## Rung 59 floodplain plant-matter numeric-closure addendum

A floodplain plant-matter transition must preserve measured carbon and
nitrogen residuals separately for every functional guild and for the aggregate
owner. Current evidence uses
`axm.foundation-planet.floodplain-plant-matter-receipt/v2` and the typed
`axm.foundation-planet.floodplain-plant-matter-mass-closure-policy/v1`.

For each material channel, the representation bound is the greater of
0.0000001 kg and eight times `Number.EPSILON` times the largest absolute
recorded operand in that channel's before-credit-after identity. The receipt
must retain its measured residue and may not choose a larger free-form
tolerance. System audit v9 independently recomputes every guild and aggregate
identity, policy bound, maximum residue and maximum utilization. A changed
receipt-supplied tolerance fails even when the underlying transition remains
conservative.

Basin engine v25 and step receipt v24 require current v2 plant-matter evidence
before the basin plant-matter truth boundary can pass. Migration from engine
v24 preserves profiles, material owners and clocks, but discards older
step-v23 evidence until a current transition creates current evidence. It does
not reconstruct historical floating-point closure.

The held 250-case standing-dead/litter representation sweep observed a maximum
0.000030517578 kg residual and no failures under the derived policy, versus 22
failures under the former fixed 0.0000001 kg comparison. Maximum observed bound
utilization was 12.19%. These are bounded representation tests, not scientific
calibration, arbitrary-precision conservation or an exhaustive planet-state
proof.

## Rung 60 floodplain detrital-return receiver numeric-closure addendum

A persistent floodplain detrital-return credit must preserve the measured
carbon, total-nitrogen, ammonium-nitrogen, unchanged-nitrate and phosphorus
residuals as separate material-channel evidence. Current receiver evidence uses
`axm.foundation-planet.floodplain-detrital-return-credit/v3` and the typed
`axm.foundation-planet.floodplain-detrital-return-mass-closure-policy/v1`.

Carbon, total nitrogen and ammonium retain a 0.0000001 kg absolute floor;
unchanged nitrate and phosphorus retain a 0.000000001 kg floor. Each actual
bound is the greater of its floor and eight times `Number.EPSILON` times that
channel's largest absolute recorded before-credit-after operand. The receiver
must retain its measured residual, may not use an operand from another material
channel, and may not choose a larger free-form tolerance. System audit v10
independently recomputes all five identities, policy bounds, maximum residue and
maximum utilization; a changed receipt-supplied tolerance fails even when its
truth flags remain green.

Basin engine v26 and step receipt v25 require current v3 receiver evidence
before the decomposition sender-and-receiver truth boundary can pass.
Migration from engine v25 preserves profiles, material owners and clocks, but
discards older step-v24 evidence until a current step creates current receiver
evidence. Historical floating-point closure is never reconstructed.

The held 250-case receiver representation sweep observed a maximum
0.000164031982 kg residual and no failures under the derived policy, versus 35
failures under the former fixed thresholds. Maximum observed bound utilization
was 33.2%. These are bounded representation tests, not scientific calibration,
arbitrary-precision conservation or an exhaustive planet-state proof.

## Rung 61 floodplain reaction receiver numeric-closure addendum

Every persistent floodplain aerobic-mineralization, denitrification,
nitrification and gas-exchange chemistry owner must preserve each measured
carbon, nitrogen, ammonium, oxygen and alkalinity residual that its reaction
actually produces. Current evidence uses aerobic-mineralization receipt v2,
denitrification-reaction receipt v4, nitrification-reaction receipt v3 and
floodplain gas-exchange receipt v3 under the shared typed
`axm.foundation-planet.floodplain-reaction-mass-closure-policy/v1`.

Carbon, total nitrogen, oxygen and alkalinity retain a 0.0000001 kg absolute
floor; ammonium nitrogen retains a 0.000000001 kg floor. Each identity's actual
bound is the greater of its material-channel floor and eight times
`Number.EPSILON` times the largest absolute operand recorded for that identity.
A receipt may not borrow another identity's operand scale, erase a measured
residue or choose a larger free-form tolerance. Immediate process wrappers use
the same derived policy when comparing a process plan with its chemistry owner.
The atmosphere-side gas-exchange owner remains governed by its existing
separate contract.

System audit v11 independently reconstructs every receiver identity and bound,
including the declared maxima and utilization. Altering any one of the four
reaction families' receipt-supplied bounds fails its owning process audit even
when its residuals and truth flags are left untouched. Basin engine v27 and
step receipt v26 require current reaction-owner evidence before their reaction
truth boundaries can pass. Migration from engine v26 preserves profiles,
material owners and clocks, but discards step-v25 evidence until a current step
creates current receipts; it never manufactures historical numeric closure.

The held 240-case representation sweep observed a maximum
0.00048828125 kg residual and no failures under the derived policy, versus 54
false failures under the former fixed thresholds. Maximum observed bound
utilization remained below 11%. These are bounded representation tests, not
scientific calibration, arbitrary-precision conservation or an exhaustive
planet-state proof.

## Rung 62 atmosphere gas-exchange owner numeric-closure addendum

The native-atmosphere owner of paired floodplain gas exchange must preserve the
measured carbon and oxygen residuals produced when per-square-meter native-layer
state is reconciled with total-kilogram exchange. Current evidence uses
`axm.foundation-planet.atmosphere-floodplain-gas-exchange-receipt/v3` under
`axm.foundation-planet.atmosphere-floodplain-gas-exchange-mass-closure-policy/v1`.

Carbon and oxygen each retain a 0.001 kg absolute material floor. Each
identity's actual bound is the greater of that floor and eight times
`Number.EPSILON` times the largest absolute total-kilogram operand recorded for
the identity. The carbon identity records atmosphere before, floodplain credit,
floodplain debit and atmosphere after; oxygen records atmosphere before,
floodplain debit and atmosphere after. A receipt may not erase a measured
residual, borrow another identity's scale or choose a larger free-form bound.

System audit v12 independently reconstructs both identities, their bounds,
maximum residual and maximum utilization. Altering a receipt-supplied bound
fails the gas-exchange audit even if its truth flags remain green. Atmosphere
state v4 migrates v3 material layers and cumulative movement without preserving
the old v2 gas receipt. Gas-process state v3 likewise preserves clocks,
cumulative exchange and owner digests from v2 while dropping the old process
receipt. Basin engine v28 preserves v27 profiles, material owners and clocks,
but accepts only step-v27 evidence; step-v26 history is not promoted.

The held 105-case representation sweep observed a maximum 262,144 kg residual
and no failures under the derived policy, versus 23 false failures under the
former fixed threshold. Maximum observed bound utilization stayed below 12%.
The extreme receiving-area sweep is a bounded binary floating-point accounting
test, not scientific gas-transfer calibration, arbitrary-precision
conservation, a resolved air-water interface or exhaustive planet-state proof.

## Rung 63 geomorphic sediment transfer numeric-closure addendum

Every persistent absolute-kilogram geomorphic sediment transfer owner must
preserve its measured clay, silt, sand and gravel residuals separately. Current
evidence uses runoff sediment transfer receipt v2, river sediment input and
route receipts v2, and coastal sediment input receipt v2 under the shared typed
`axm.foundation-planet.geomorphic-sediment-transfer-mass-closure-policy/v1`.

Each identity and grain retains a 0.0000001 kg material floor. Its actual bound
is the greater of that floor and eight times `Number.EPSILON` times the largest
absolute operand recorded for that exact identity and grain. A receipt may not
borrow another grain or identity's scale, erase a measured residual, or choose
a larger free-form tolerance. River routing must prove sender debit, persistent
bed credit and requested-load partition identities. Coastal input must prove
both persistent receiver credit and input partition. The surface erosion
kg/m2 ledger is outside this absolute-kilogram policy.

System audit v13 independently reconstructs the recorded identities, each
derived bound, maximum residual and maximum utilization. Altering a single
receipt-supplied per-grain bound fails its owning transport or basin audit even
when the residual and truth flags remain unchanged. Earth engine v32 and basin
engine v29 preserve v31/v28 material owners and clocks through normalization,
but old transport step v11 and basin step v27 evidence is discarded rather
than promoted. Current transport step v12 and basin step v28 evidence is
required to pass the new truth boundary.

The held 150-case discovery sweep observed a maximum 136,445,952 kg residual
and no failures under the derived policy, versus 72 false failures under the
former fixed floor. Maximum observed bound utilization remained below 7.5%.
These are bounded binary floating-point representation tests, not scientific
erosion or sediment-transport calibration, arbitrary-precision conservation,
resolved morphodynamics, a global sediment-network proof or an exhaustive
planet-state proof.

## Rung 65 channel–floodplain exchange numeric-closure addendum

Every loaded channel/floodplain transfer must preserve twelve measured
material-owner residuals: water; total carbon and nitrogen; nitrate and
ammonium; phosphorus, oxygen and alkalinity; and clay, silt, sand and gravel.
Current evidence uses
`axm.foundation-planet.floodplain-exchange-receipt/v4` with nested
`axm.foundation-planet.floodplain-exchange-mass-closure/v1` under the typed
`axm.foundation-planet.floodplain-exchange-mass-closure-policy/v1`.

Water retains its one-kilogram material floor. Each chemistry and grain identity
retains its 0.000001 kg floor. The actual numerical bound is the greater of that
identity's floor and eight times `Number.EPSILON` times the sum of the absolute
unrounded signed operands for that identity alone. Water records final channel,
final floodplain, negative initial channel and negative initial floodplain
owners. Each dissolved identity records the same four owner positions. Each
grain records final channel suspended, channel bed, floodplain suspended and
floodplain deposited owners followed by their four negative initial owners. A
receipt may not erase a measured residue, borrow another identity's scale or
choose a larger free-form bound.

System audit v15 independently reconstructs the exact identity set, operand
counts, signed sums, policy bounds, compatibility residual projections,
aggregate maximum residual, maximum bound and maximum utilization. Altering one
recorded operand or one receipt-supplied tolerance fails the dedicated
`floodplain-exchange-receipts` check even when green truth flags remain. Basin
engine v31 accepts v30 state, preserves its material owners and clocks, and
discards step-v29 evidence instead of promoting the old exchange contract.
Floodplain state normalization likewise preserves current material and
cumulative history but drops a stored v3 exchange receipt; it does not invent a
new migration transfer.

The held 150-case representation sweep covered all twelve operand shapes. All
150 mathematically zero sums exceeded their former fixed floors, while none
failed the derived policy. Maximum measured residue was 3.25 kg, maximum bound
was 32,768 kg and maximum bound utilization was 2.5390625%. This is a bounded
binary floating-point accounting test, not arbitrary-precision conservation,
resolved inundation hydraulics, scientific flood calibration or an exhaustive
planet-state proof.

## Rung 66 floodplain thermal-owner addendum

Every persisted reach owns one
`axm.foundation-planet.floodplain-thermal-state/v1` beside its floodplain
material owner. The state carries liquid-water temperature, the water mass to
which that temperature applies, sensible heat, observed wet and dry time,
cumulative net-advected heat, cumulative parameterized external-boundary heat
and the latest typed transition. Denitrification, nitrification and
floodplain-atmosphere gas exchange must read the same final temperature and
record the exact digest of that reach's thermal transition. A same-step direct
surface-temperature proxy is no longer sufficient evidence.

Current thermal evidence is
`axm.foundation-planet.floodplain-thermal-receipt/v1` with nested
`axm.foundation-planet.floodplain-thermal-energy-closure/v1` under
`axm.foundation-planet.floodplain-thermal-energy-closure-policy/v1`. For an
observed transition the signed energy operands are final sensible heat,
negative initial heat, negative inflow heat, positive outflow heat and negative
external-boundary heat. The numerical decision bound is the greater of one
joule or eight times `Number.EPSILON` times the sum of those absolute unrounded
operands. The measured residual and utilization remain evidence and may not be
clamped, replaced or hidden by a receipt-supplied tolerance.

Basin engine v32 accepts v31 state. A reach without the R66 owner receives an
empty one-shot thermal checkpoint while every pre-existing material,
chemistry, biological, clock and cumulative owner remains unchanged. The first
step initializes current sensible heat from current water and the declared
incoming-temperature boundary, records that pre-R66 heat history is
unobserved, and makes no historical closure claim. Step-v30 receipts are not
promoted to step v31.

System audit v16 independently reconstructs water change, the five energy
terms, signed operands, policy bound, residual, utilization, aggregate maxima
and the exact digest/temperature binding of all three consumer processes. It
must fail tolerance inflation, altered energy operands or altered consumer
digests even when receipt truth flags remain green. API v62 exposes the owner,
policy, receipts and live mean-temperature/residual/bound/utilization
diagnostics read-only.

This contract does not claim a resolved channel-water temperature, an
atmosphere or soil debit for the parameterized external heat boundary,
freeze–thaw phase ownership, latent heat, scientific calibration, arbitrary
precision, exhaustive planet-state proof, promotion or canonization.

## Rung 67 river thermal-owner addendum

Every materialized loaded canonical reach owns
`axm.foundation-planet.river-thermal-state/v1`. A loaded reach definition with
no materialized water-owner state is counted explicitly and receives no
invented thermal state or history. The owner persists channel
water temperature, tracked water, sensible heat, wet/dry observation time and
cumulative heat moved through land inlets, reach inlets, reach or mouth
outflows, net floodplain exchange and the parameterized external boundary.
Unmaterialized and unloaded reaches are not advanced as a hidden global network.

An active transition emits
`axm.foundation-planet.river-thermal-receipt/v1`, exactly one digest-bound
`axm.foundation-planet.river-thermal-pre-route-projection/v1` and typed
`axm.foundation-planet.river-thermal-transfer/v1` entries. Land runoff,
reach-to-reach routing and river-mouth outflow use the same unrounded water,
temperature, sensible heat and transfer ID in the material receipt and thermal
owner. The pre-route projection binds the prior river receipt and current
floodplain thermal receipt before simultaneous routing.

Floodplain thermal state and receipt v2 distinguish exact net channel exchange
from other local water-owner adjustments. River-to-floodplain heat uses the
prior persistent river temperature; floodplain return heat uses the prior
persistent floodplain temperature. Local plant-water changes are reconciled at
the local floodplain temperature and cannot be relabelled as river exchange.
Gross counterflow and resolved inundation remain explicitly outside scope.

`axm.foundation-planet.river-thermal-energy-closure/v1` uses
`axm.foundation-planet.river-thermal-energy-closure-policy/v1`. Its signed
operands are final heat, negative initial heat, heat sent to the floodplain,
negative heat returned from the floodplain, negative land-inlet heat, negative
reach-inlet heat, route-outflow heat and negative external-boundary heat. The
numeric bound is the greater of one joule or eight `Number.EPSILON` steps at
the sum of the absolute unrounded operands. Measured residual and utilization
remain evidence and may not be overwritten by receipt assertions.

Basin engine v33 accepts v32 state. A reach without river thermal state gains
only an empty one-shot checkpoint; existing floodplain, material, chemistry,
biology, clock and cumulative owners remain unchanged. The first R67 step
observes current water and initializes heat from the surface boundary without
claiming pre-R67 history or closure. Step-v31 receipts are discarded rather
than promoted to step v32.

System audit v17 independently recomputes transfer heat, water ownership,
pre-route projection terms, the eight closure operands, scale-aware bound,
residual, utilization, material-transfer digests and river/floodplain source
binding. The basin receipt separately publishes the loaded graph-definition
count, materialized river-owner count and their difference; closure applies to
every published owner receipt, not nonexistent owners. API v63, experience
capsules and live diagnostics expose the state read-only. This contract does not claim runoff-source or atmosphere/soil heat
debits, an ocean thermal receiver credit, global unloaded routing, freeze-thaw,
latent heat, scientific calibration, arbitrary precision, promotion or
canonization.

## Rung 68 ocean-mouth thermal receiver addendum

A loaded canonical river mouth must carry the exact unrounded water,
temperature and sensible heat already debited from its persistent river thermal
owner into one `axm.foundation-planet.ocean-mouth-thermal-receipt/v1`. The
receiver is the existing Earth-system ocean mixed-layer heat owner at the
loaded destination cell. The operation updates persistent `heatContentJm2`,
`mixedLayerTemperatureC` and surface temperature without creating another
reservoir or changing mixed-layer depth.

The receipt binds the river transfer ID, source reach, destination cell,
receiver area, mixed-layer depth, volumetric heat capacity
`4.186e6 J m-3 K-1`, areal and total heat capacity, initial and final owner
terms, independently recomputed river heat, typed truth boundaries and digest.
`axm.foundation-planet.ocean-mouth-thermal-energy-closure/v1` uses
`axm.foundation-planet.ocean-mouth-thermal-energy-closure-policy/v1`. Its signed
operands are final mixed-layer sensible heat, negative initial mixed-layer heat
and negative credited river heat. The numerical bound is the greater of one
joule or eight `Number.EPSILON` steps at the sum of the absolute unrounded
operands. The measured residual and utilization may not be overwritten by
receipt assertions.

Basin engine v34 accepts v33 owner state unchanged. Because R67 has no ocean
receiver receipt, step-v32 evidence is discarded rather than promoted to step
v33. System audit v18 independently recomputes transfer heat, fixed-depth heat
capacity, initial and final owner terms, signed operands, residual, derived
bound, digest and outer mouth-transfer binding. API v64 exposes the description,
route receipt and live audit evidence read-only.

This contract fixes mixed-layer depth for the credit. It does not claim
river-water displacement, entrainment, vertical heat transport, three-dimensional
ocean circulation, freeze-thaw or latent heat, a global unloaded river network,
scientific calibration, arbitrary precision, promotion or canonization.

## Rung 69 Life-off plant-resource lineage addendum

Every materialized floodplain reach emits one typed plant-resource debit and
one typed plant-water return receipt on every basin step, including when both
carry zero transfers. A Life-disabled or resource-migration transition must
bind the exact digests of those receipts in
`axm.foundation-planet.floodplain-plant-resources-receipt/v3`. It may not erase
their lineage merely because no uptake or return occurred.

For both statuses, the nested uptake and water-return transfer ID arrays are
empty, credited/debited quantities are zero, and the before and after plant
phosphorus and tissue-water owners are identical. The typed no-op receipts are
evidence of an observed zero transfer, not authority to create material or to
simulate dormant ecology. Basin engine v35 preserves v34 owners and clocks but
discards its older step-v33 evidence. System audit v19 independently matches
the nested debit and return digests to their corresponding reach receipts and
requires the basin exact-transfer truth boundary to remain closed.

This addendum does not reinterpret older v2 receipts, invent historical
lineage, change the Life toggle's process authority, add global unloaded
routing, claim scientific calibration, promote or canonize the branch.

## Rung 70 ocean boundary-input numeric closure addendum

Every current ocean ecology river or runoff boundary input must emit a v3
receiver receipt containing
`axm.foundation-planet.ocean-ecology-boundary-input-mass-closure/v1`. The
closure has exactly five identities: carbon, nitrogen, phosphorus, oxygen and
alkalinity. Each identity records exactly three unrounded signed kilogram
operands in this order: final persistent receiving owner, negative initial
receiving owner and negative boundary input. Its residual is the sum of those
operands; it may not be clamped, replaced by zero or inferred from a green
truth flag.

`axm.foundation-planet.ocean-ecology-boundary-input-mass-closure-policy/v1`
sets a 0.000000001 kg absolute floor and an eight-`Number.EPSILON` scale term
at the sum of the absolute signed operands. Every identity records its derived
bound, bound utilization and closed verdict. The aggregate closure records
the exact identity count and maxima. The receiver-credit truth flags must be
derived from these identities. Fixed absolute tolerance is explicitly false.

`axm.foundation-planet.ocean-mouth-receipt/v10` must bind the nested v3
receiver receipt to the same transfer ID as the outer river-mouth delivery.
System audit v20 independently reconstructs every residual, tolerance,
utilization, maximum, summary verdict and transfer binding. A supplied
tolerance, summary, input amount or transfer ID that disagrees with the
recorded operands fails even when all producer truth flags remain green.

Basin engine v36 accepts v35 owners and clocks without changing material but
discards step-v34 evidence. Older ocean boundary v2 receipts are likewise
dropped during normalization rather than promoted to the R70 evidence shape.
API v66 exposes the current boundary receipt count, measured maxima, policy and
route verdict read-only. This addendum addresses bounded IEEE-754 owner-credit
representation only; it does not authorize created material, arbitrary
precision, resolved carbonate chemistry or pH, global unloaded routing,
scientific calibration, promotion or canonization.

## Rung 71 runoff thermal-owner addendum

Every current land column with a runoff-water queue MUST also carry
`axm.foundation-planet.runoff-thermal-queue/v1`. Its `trackedWaterMm` MUST bind
the same material owner as `routing.runoffQueueMm`; `sensibleHeatJm2` MUST equal
that water mass times 4,184 J/kg/K times the queue temperature within the typed
scale-aware numerical bound. Serialization rounding MUST NOT detach the water
and thermal owners.

`axm.foundation-planet.runoff-thermal-generation-receipt/v1` MUST record the
initial owner, surface-runoff and baseflow water and heat inputs, final owner,
measured water residual and unrounded signed energy operands. Its policy is
`axm.foundation-planet.runoff-thermal-energy-closure-policy/v1`: the tolerance
is the greater of one joule or eight IEEE-754 epsilon steps at the sum of the
absolute operands. The receipt MUST preserve the measured residual. Surface
runoff and baseflow temperatures are parameterized inputs; the receipt MUST set
`generationSourceHeatOwnerDebited` false and MUST NOT imply resolved soil or
groundwater thermal owners.

Earth transport step v13 MUST move runoff heat with exactly the routed water
fraction. Each routed edge MUST contain a v1 sender-debit receipt and either a
v1 land-queue receiver credit or a v1 ocean-input receiver credit. Sender and
receiver MUST share transfer ID, water kilograms, temperature and sensible
heat. A direct ocean receiver MUST credit the existing fixed-depth mixed-layer
heat owner exactly once and MUST expose independently recomputed input heat,
owner closure and the fixed-capacity limitation.

Every runoff thermal sender debit and receiver credit MUST preserve the signed
water-owner operands, measured residual and derived `numericToleranceKg`. That
bound MUST be the greater of 0.000001 kg or eight IEEE-754 epsilon steps at the
sum of the absolute unrounded signed kilogram operands. System audit v21 MUST
recompute this bound independently and reject an inflated receipt bound.
Floodplain thermal v2 water-owner change MUST use and expose the same policy;
neither seam may treat a fixed absolute water threshold alone as planetary
closure evidence.

Basin inlet receipt v9 MUST debit the persistent Earth-cell runoff thermal
queue with the exact water fraction removed by basin capture. The nested sender
receipt digest MUST bind river thermal transfer v2, which MUST declare
`sourceThermalOwnerDebited` true, `parameterizedRunoffTemperature` false and
`persistentRunoffThermalTemperature` true. River thermal receipt v2 MUST credit
the same water, temperature and joules. Producer truth flags alone are
insufficient evidence; the basin and system audit MUST recompute and bind the
operands and digests independently.

Earth engine v33 accepts v32 state by initializing the current runoff thermal
owner without reconstructing historical heat. Basin engine v37 accepts v36
material state while discarding older step evidence that cannot prove the R71
sender debit. `axm.foundation-planet.system-audit/v21` MUST fail altered
operands, detached IDs or digests, inflated tolerances, missing current owners,
or a receiver credit without its paired sender debit. API v67 exposes this
contract read-only.

This addendum does not authorize a historical-heat reconstruction, upstream
soil/groundwater heat debit, latent-heat or freeze/thaw routing, scientific
calibration, global unloaded routing, promotion or canonization.

## Rung 72 land-hydrology thermal-owner addendum

Each loaded land Earth column MUST persist four water-bound sensible-heat
owners under `axm.foundation-planet.land-hydrology-thermal-state/v1`: surface
ponded water, root-zone water, deep-soil water and groundwater. Each reservoir
MUST expose its exact water depth, temperature and sensible heat. Internal
infiltration, percolation and recharge MUST move water and its paired heat
between those owners in the same step receipt; runoff and baseflow generation
MUST debit the exact surface or groundwater owner before crediting the R71
runoff thermal queue.

`axm.foundation-planet.land-hydrology-thermal-step-receipt/v1` MUST preserve
initial and final owner operands, water-owner residuals, measured water and
energy residuals, derived scale-aware bounds, exact requested-versus-applied
transfers and a digest. The nested runoff source receipt and runoff generation
receipt MUST share step ID, water, temperature and sensible heat. System audit
v22 MUST recompute those operands and digests independently; a producer truth
flag alone is not evidence of source-owner debit.

Loaded groundwater exchange MUST carry the corresponding sensible heat with
the exact area-weighted groundwater water routes. Its typed transport receipt
MUST bind each sender and receiver column ID, transferred water kilograms,
temperature, joules and the source owner digest. It proves only transport
among the loaded columns present in that receipt, not global groundwater flow.

Earth engine v34 accepts v33 state by preserving every current land-water owner
and creating an explicit current-state thermal checkpoint. It MUST NOT invent
historical temperatures, transfers, heat or receipts. Earth transport v14 and
system audit v22 accept and inspect the new owner lineage. API v68 exposes the
description, closure policy and current persisted owner state read-only.

Rung 72 does not debit an atmosphere or other upstream sender for precipitation
heat, does not credit an atmosphere receiver for evaporated sensible heat, and
does not resolve freeze/thaw, latent heat, subsurface conduction, geothermal
forcing, scientific calibration or unloaded global behavior. It does not
authorize promotion or canonization.

## Rung 101: historical-source observation-authenticity requests

Every fresh v63 loaded-land column retaining an exact valid R100
artifact-integrity contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-request-contract-receipt/v1`.
The contract MUST embed and digest-bind that exact R100 source and preserve all
28 route identities. Exactly 24 `EVIDENCE` routes MUST request
`evidence.observation.authenticity.verify`; exactly four Mike/AXM `AUTHORITY`
routes MUST remain excluded. Candidate self-verification MUST NOT be accepted.

Each eligible route MUST retain its native claim kind and corresponding
evidence plan: restart/reload comparison for persistence claims, direct source
and schema inspection for static-structure claims, or paired sender/receiver
receipts for transport claims. Each plan MUST also retain stronger evidence
and explicit counterevidence. A caller claim or R100 digest match alone MUST
remain counterevidence, not authenticity proof.

The transient packet producer MUST accept only the exact R101 contract, a
valid structurally reviewable R99 candidate package, and its exact matching
R100 `ARTIFACT_DIGESTS_MATCH_CLAIMS_WITHOUT_EVIDENCE_VERIFICATION` assessment.
It MUST emit one request per digest-matched candidate item with status
`AWAITING_INDEPENDENT_OBSERVATION_AUTHENTICITY_EVIDENCE`. It MUST NOT persist
the packet or artifact bytes, select or trust a verifier, observe evidence,
make a decision, authenticate an observation, verify provenance or meaning,
grant authority, admit a candidate, or mutate the world.

System audit v51 MUST independently rebuild R101's routes and proof plans from
exact R100, validate the 28/24/4 split, three native evidence kinds,
current-column and budget binding, emission mode, zero verifier/evidence/
decision/persistence counts, and bounded truth. It MUST reject route or proof
substitution, source rebinding, stored verifier evidence, fabricated decisions,
and authenticity, authority, persistence, or admission inflation.

Earth engine v63 MUST accept v62 state. A v62 lineage retaining an exact valid
R100 contract MAY receive a migration-labelled R101 contract because it binds
only retained contract state; it MUST NOT claim recovered evidence or history.
A lineage missing exact R100 MUST receive a permanent checkpoint and MUST NOT
synthesize a replacement. Native and migrated contracts and checkpoints MUST
survive exact save and restore. API v97 exposes all four R101 schemas, its
description, and the transient request-packet builder while preserving R100
API v96.

R101 advances only request routing for independent observation-authenticity
evidence. It MUST NOT claim that a trusted verifier, independent observation
record, verification decision, authenticity, provenance, physical-meaning
review, evidence admission, historical physical source owner, or debit receipt
exists. `evidence.observation.authenticity.verify` remains an evidence gap and
`authority.physical-meaning.review` remains a Mike/AXM authority gap. R101 MUST
NOT promote itself or claim `CANON` status.

## Rung 102: signed authenticity-response integrity

Every fresh v64 loaded-land column retaining an exact valid R101 request
contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-signed-response-contract-receipt/v1`.
The contract MUST embed and digest-bind that exact R101 source, preserve all 28
routes, declare signed responses only for the 24 evidence routes, and exclude
the four Mike/AXM authority routes. Its native proof plans MUST remain exact.

A response envelope MUST bind the exact R102 contract and exact R101 packet and
MUST contain exactly one result for every request. A result's claimed proof
surface MUST be `save-restart-reload-comparison` for persistence,
`direct-source-and-schema-inspection` for static structure, or
`sender-receiver-receipt-pair` for transport. Evidence record digests MUST be
SHA-256 descriptors, timestamps MUST parse, and canonical JSON MUST not exceed
65,536 characters. These are structural conditions on caller claims, not proof
that the claims are authentic, meaningful, or independently produced.

The detached verifier MUST use Web Crypto Ed25519 over the exact canonical
envelope with a caller-supplied 32-byte raw public key and 64-byte signature.
A signature-integrity `PASS` MUST mean only that this envelope and signature
match under that supplied key. It MUST NOT imply trusted key ownership, claimed
verifier identity, verifier independence, observation authenticity, provenance,
physical meaning, evidence verification, authority, persistence, candidate
admission, or world mutation. All those verdicts MUST remain `UNKNOWN`, false,
or `NOT_AUTHORIZED` as applicable.

System audit v52 MUST independently reconstruct the 28/24/4 routes, native
proof plans, summary, zero response/key/identity/independence/authenticity/
persistence counts, budget binding, emission mode, and bounded truth from exact
R101. It MUST reject algorithm or route substitution, converted authority
routes, stored envelopes or assessments, asserted key trust, source rebinding,
and authenticity, authority, persistence, or admission inflation.

Earth engine v64 MUST accept v63 state. A v63 lineage retaining exact R101 MAY
receive a migration-labelled R102 contract because the migration binds only
retained contract state; it MUST NOT synthesize a verifier, signature,
observation, evidence, or decision. A lineage missing exact R101 MUST receive a
permanent checkpoint. Native and migrated contracts and checkpoints MUST
survive exact save and restore. API v98 exposes all six R102 schemas, the
bounded envelope producer, canonical text producer, and async signature
verifier while preserving R101 API v97.

R102 advances only structural response routing and detached signature
integrity under an untrusted caller-supplied key. Trusted key binding, verifier
identity and independence, authentic observation evidence, provenance,
physical-meaning review, evidence admission, historical physical source owners,
and debit receipts remain unresolved. R102 MUST NOT promote itself or claim
`CANON` status.

## Rung 103: verifier-key-binding evidence requests

Every fresh v65 loaded-land column retaining an exact valid R102 signed-response
contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-request-contract-receipt/v1`.
The contract MUST embed and digest-bind that exact R102 source, preserve all 28
routes and native proof plans, declare requests only for the 24 evidence routes,
and exclude the four Mike/AXM authority routes.

Each eligible route MUST declare `trust.verifier-key.bind`,
`identity.verifier.claim.resolve`, and
`evidence.verifier.independence.verify` as required capabilities. The contract
MUST retain zero trusted registries, key bindings, trusted identities,
independent verifiers, authenticated observations, persisted packets, and
decisions. It MUST NOT turn the existence of a request into evidence that any
capability is available.

The transient request builder MUST re-run the actual R102 Ed25519 verifier over
the exact R101 packet and R102 envelope and MUST emit no request unless that
fresh assessment is `PASS`. A `PASS` remains supplied-key integrity only. The
request packet MAY retain public-key and signature hashes but MUST NOT retain
raw key or signature bytes. Literal equality between a candidate claimed
producer id and claimed verifier id MUST be recorded as
`LITERAL_IDENTIFIER_COLLISION` counterevidence. Literal inequality MUST be
recorded as insufficient to prove identity or independence.

System audit v53 MUST independently rebuild R103's exact 28/24/4 routes,
capability ids, native proof plans, zero-material summary, current-column and
budget binding, emission mode, and bounded truth from exact R102. It MUST reject
capability substitution, converted authority routes, injected registries,
bindings, identity or independence evidence, decisions, source rebinding, and
authenticity, authority, persistence, or admission inflation.

Earth engine v65 MUST accept v64 state. A v64 lineage retaining exact R102 MAY
receive a migration-labelled R103 contract because the migration binds only
retained contract state; it MUST NOT synthesize a registry, binding, identity,
independence evidence, observation, or decision. A lineage missing exact R102
MUST receive a permanent checkpoint. Native and migrated contracts and
checkpoints MUST survive exact save and restore. API v99 exposes all four R103
schemas and the async signature-pass-gated transient request builder while
preserving R102 API v98.

R103 advances only routing for missing verifier-key-binding, identity, and
independence evidence. It MUST NOT trust a key, resolve a verifier, establish
independence, authenticate an observation, verify provenance or physical
meaning, persist a decision, admit evidence, identify historical physical
source owners, or supply debit receipts. R103 MUST NOT promote itself or claim
`CANON` status.

## Rung 104: authority-decision and revocation signature integrity

Every fresh v66 loaded-land column retaining an exact valid R103
verifier-key-binding request contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity-contract-receipt/v1`.
It MUST embed and digest-bind exact R103, preserve all 28 routes, declare 24
decision-integrity routes, and exclude the four Mike/AXM authority routes.

Eligible routes MUST declare local implementation of
`authority.verifier-key-binding-decision.signature.verify` and
`authority.verifier-key-binding.revocation.verify`. They MUST continue to
declare `authority.host-trust-anchor.provision` as required but unavailable.
The contract MUST retain zero host trust anchors, trusted policies, policy
descriptors, decision envelopes, revocation snapshots, assessments, trusted
bindings, authenticated observations, and admissions.

A transient policy descriptor MUST bind exact R104, cover the exact 24 eligible
routes, identify distinct Ed25519 decision and revocation keys by id and SHA-256
hash, and bound the policy, decision, and revocation-snapshot windows. It MUST
never contain raw key bytes and MUST always remain
`CALLER_SUPPLIED_UNTRUSTED_VERIFIER_BINDING_POLICY_DESCRIPTOR` unless a future
host-authority contract provisions a trust anchor. R104 has no such host
contract.

A transient decision envelope MUST bind exact R104, exact R103 packet, and exact
policy descriptor. It MUST cover every R103 request exactly once and preserve
the candidate/verifier identifiers, verifier-key hash, and literal-collision
flag. `BIND`, `HOLD`, and `REJECT` are requested actions only. R104 MUST apply
zero bindings. A transient revocation snapshot MUST bind exact R104 and policy,
use the distinct revocation key, and MAY list revoked decision digests, decision
nonces, or verifier-key hashes within declared bounds.

The verifier MUST perform detached Ed25519 verification over canonical decision
and revocation text, compare both supplied public-key hashes with the policy,
require exact source digests, check all validity windows at an explicit caller
evaluation time, reject either authority key matching the R103 claimed verifier
key, and fail on any signed revocation hit. Integrity `PASS` MUST mean only that
the two artifacts are intact under keys named by the caller-supplied untrusted
policy. Host trust, policy authority, verifier-key binding, identity,
independence, authenticity, provenance, physical meaning, evidence verification,
and admission verdicts MUST remain unresolved. Raw keys, signatures, policies,
decisions, revocations, and assessments MUST NOT enter world state. R104 has no
persistent replay ledger.

System audit v54 MUST independently reconstruct R104's exact 28/24/4 routes,
capabilities, zero-material summary, current-column and budget binding, emission
mode, and bounded truth from exact R103. It MUST reject converted authority
routes, capability substitution, injected trust or binding state, source
rebinding, persistence, authority, authenticity, or admission inflation.

Earth engine v66 MUST accept v65 state. A v65 lineage retaining exact R103 MAY
receive a migration-labelled R104 contract; it MUST NOT synthesize a policy,
trust anchor, decision, revocation, assessment, replay entry, or binding. A
lineage missing exact R103 MUST receive a permanent checkpoint. Native and
migrated contracts and checkpoints MUST survive exact save and restore. API
v100 exposes the eight R104 schemas, transient builders, canonical signing text,
dual-signature verifier, and description while preserving API v99.

R104 advances only authority-decision and revocation integrity under a
caller-supplied untrusted policy. It MUST NOT provision host trust, trust a
policy, bind a key, resolve a verifier, establish independence, authenticate an
observation, verify provenance or physical meaning, persist a decision or replay
guard, admit evidence, identify historical physical source owners, or supply
debit receipts. R104 MUST NOT promote itself or claim `CANON` status.

## Rung 73 liquid-water atmosphere-land thermal-owner addendum

For each loaded land step, the Earth-system engine MUST emit
`axm.foundation-planet.atmosphere-land-liquid-water-thermal-receipt/v1`.
The receipt MUST bind the exact current native pressure-dynamics receipt and
the exact R72 land-hydrology thermal step receipt.

For liquid rainfall, the native lowest pressure layer dry-air sensible-heat
owner MUST be debited by `waterMm * 4184 J kg-1 K-1 * waterTemperatureC`, and
the land surface ponded-water thermal owner MUST receive that same heat. For
liquid surface evaporation, bare-soil evaporation and transpiration, the land
surface/root thermal owners MUST be debited and the native lowest atmosphere
layer MUST receive the same heat. Both routes MUST carry stable transfer IDs,
source-debit and receiver-credit truth, water, temperature and sensible heat.

The native atmosphere owner and complete native moist-enthalpy change MUST
each retain their unrounded signed operands, measured residual and a numerical
bound equal to the greater of one joule per square metre or eight IEEE-754
epsilon steps at the sum of absolute operands. Neither residual may be clamped.
If exact application would move the native owner outside `-120 C` to `70 C`,
the entire coupling MUST be refused; partial application and post-material
temperature clipping are not valid closure evidence.

Engine v35 MUST accept v34 state while preserving existing atmosphere, land
and runoff owners. It MUST initialize the new boundary receipt to null and
MUST NOT reconstruct historical transfer evidence. The first subsequent land
step may create current lineage. System audit v23 MUST independently recompute
receipt digests, water-temperature heat bindings, owner state, both closure
bounds, thermal envelope and atmosphere energy-budget binding. API v69 exposes
the description and typed closure policy read-only.

This addendum applies only to liquid rainfall and liquid land evaporation.
Broad precipitation and evaporation thermal claims remain false. In R73,
snowfall, snowmelt and sublimation sensible-heat ownership was unresolved. This
organ does not claim latent-heat modeling, resolved droplet thermodynamics,
scientific calibration, unloaded global behavior, promotion or canonization.

## Rung 74 land-snow thermal-owner addendum

Each loaded land Earth column MUST persist one snow sensible-heat owner under
`axm.foundation-planet.land-snow-thermal-state/v1`. Its tracked snow water
equivalent MUST match the cryosphere snow owner. Its sensible heat MUST equal
tracked water times the declared `2108 J kg-1 K-1` model heat capacity times a
snow temperature bounded from `-80 C` through `0 C`. The temperature assigned
to new snowfall is the bounded native lowest-atmosphere-layer proxy; it MUST NOT
be described as resolved snowfall or snow-grain thermodynamics.

`axm.foundation-planet.land-snow-thermal-step-receipt/v1` MUST bind initial and
final snow owners, snowfall input, snowmelt output and sublimation output. Its
water and energy closures MUST preserve unrounded signed operands and measured
residuals. Each numerical bound MUST be the greater of the typed absolute floor
and eight IEEE-754 epsilon steps at the sum of absolute operands. A producer
boolean alone is not evidence of closure.

Every land step MUST also emit
`axm.foundation-planet.atmosphere-land-snow-thermal-receipt/v1`. It MUST bind
the exact pressure-dynamics, cryosphere-phase, R72 land-hydrology, R73 liquid
boundary and R74 snow-step receipts. Snowfall MUST pair the native lowest-layer
sensible-heat debit with the persistent snow receiver credit. Sublimation MUST
pair the snow sender debit with the native atmosphere receiver credit. These
transfers MUST chain from the exact final R73 atmosphere owner, remain inside
the native `-120 C` to `70 C` envelope, close both the native dry-air owner and
native moist enthalpy, and enter the complete atmosphere energy budget.

Snowmelt MUST debit the signed sensible heat carried out of the snow owner. The
existing land-hydrology receiver admits meltwater at `0 C`; until another owner
explicitly supplies the cold-content warming, the receipt MUST keep both
`snowmeltLiquidReceiverSensibleHeatCredited` and
`snowmeltColdContentWarmingOwnerDebited` false and MUST expose the required
warming joules. R74 MUST NOT treat this declared gap as closed.

Engine v36 MUST accept v35 state while preserving the exact pressure-column,
R73 liquid boundary, land-hydrology and runoff thermal owners. It MUST create
only a current-snow no-history checkpoint with
`historicalHeatReconstructed: false`; it MUST NOT invent prior snow heat or
transfers. System audit v24 MUST independently recompute source digests,
water-temperature heat, persistent owner binding, snow water/energy closure,
R73-to-R74 owner chaining, atmosphere owner/moist-enthalpy closure, the explicit
snowmelt gap and atmosphere-budget binding. API v70 exposes the state, receipt
and typed closure policy read-only.

This addendum does not model latent heat, resolve snowfall temperature or snow
microphysics, resolve the snowmelt cold-content source, claim scientific
calibration, claim unloaded global behavior, authorize promotion or authorize
canonization.

## Rung 75 snowmelt cold-content owner addendum

Every current loaded land step MUST close the downstream R74 snowmelt
cold-content handoff through
`axm.foundation-planet.land-snowmelt-cold-content-receipt/v1`. The receipt MUST
bind the exact current R74 snow-step digest, R72 land-hydrology step digest,
cryosphere phase receipt and
`axm.foundation-planet.surface-energy-ledger/v1` step ID. It MUST NOT alter or
re-sign the earlier R74 atmosphere/snow receipt merely to conceal that receipt's
historically explicit downstream gap.

The warming requirement MUST equal the negative of the signed sensible heat
carried by the removed snow. The existing land surface sensible-heat owner MUST
record the equal negative debit in its energy ledger. The surface ledger MUST
close `storage change - surface flux - boundary heat - precipitation phase
input + cold-content warming` within its derived numerical bound. Its stored
sensible-heat change and cryosphere phase-storage change MUST remain distinct
operands.

The persistent land-hydrology surface-water owner MUST receive the same
snowmelt water at exactly `0 C`. Relative to that reference, the final liquid
sensible heat MUST be zero. The receiver transition MUST close `final liquid
sensible heat - initial frozen sensible heat - warming credit`; a zero final
sensible-heat value MUST NOT be misreported as an absent receiver credit.

Source debit, receiver transition and surface-energy closures MUST preserve
their unrounded signed operands and measured residuals. Each bound MUST be the
greater of one joule per square metre or eight IEEE-754 epsilon steps at the sum
of the absolute operands. Producer truth flags, rounded display values or an
inflated tolerance are insufficient evidence.

The existing cryosphere phase receipt remains authoritative for fusion latent
heat. R75 MUST bind that receipt but MUST keep
`latentHeatModeledByThisOrgan: false`; the sensible cold-content term MUST NOT
duplicate, replace or relabel the fusion term.

Engine v37 MUST accept v36 state while preserving its exact R74 snow,
atmosphere, land-hydrology and other thermal owners. It MUST initialize the R75
receipt to null with an explicit no-history migration checkpoint and MUST NOT
reconstruct historical cold-content transfers. System audit v25 MUST
independently recompute source digests, water/temperature bindings, surface
owner heat, all three closures and latent/sensible separation. API v71 exposes
the description, receipt schema and closure policy read-only.

This addendum does not resolve snow conduction, meltwater percolation through
snow, snow microphysics, scientific calibration or unloaded global behavior.
It does not authorize promotion or canonization.

## Rung 76 land surface-snow thermal exchange addendum

Every current loaded-land step MUST propose one signed sensible-heat exchange
between the existing land surface sensible-heat owner and the persistent R74
snow thermal owner. The proposal MUST bind the exact current R74 snow-step
digest and preserve the initial surface and snow owners. Its bulk response MUST
use the two declared owner heat capacities, the temperature difference and the
declared `2.5 day` response timescale. The transfer MUST be capped before
application so the snow owner remains within `-80 C` through `0 C`.

A positive signed amount denotes land-surface heat credited to snow; a negative
amount denotes snow heat credited to the land surface. The surface-energy
ledger MUST include that same signed amount, and
`axm.foundation-planet.land-surface-snow-thermal-receipt/v1` MUST bind the
exact proposal, R74 receipt, R75 receipt and surface-energy step. The paired
transfer MUST close `surface owner entry + snow owner entry`. The persistent
snow closure MUST close `final snow heat - initial snow heat - signed heat to
snow`. The complete surface closure MUST close `storage change - surface flux
- boundary heat - precipitation phase input + R75 cold-content warming +
signed heat to snow`.

All closures MUST preserve unrounded operands and measured residuals. Each
numerical bound MUST be the greater of one joule per square metre or eight
IEEE-754 epsilon steps at the sum of absolute operands. A producer flag,
rounded display value, fixed inflated tolerance or re-signed detached proposal
is not sufficient evidence.

R76 MUST NOT change snow water, create snowmelt or model fusion latent heat.
The earlier R74 receipt MUST remain intact after the current snow owner changes.
The independent audit MUST instead verify the exact R74-final to R76-initial to
R76-final/current owner chain and recompute the proposal and all three
closures.

Engine v38 MUST accept v37 state while preserving exact R75 and R74 owners and
receipts. It MUST initialize the R76 receipt to null with an explicit no-history
migration checkpoint and MUST NOT reconstruct historical exchange. System
audit v26 MUST independently reject unsigned source changes, detached signed
ledger or owner entries, inflated numerical bounds and fabricated conduction,
fusion, calibration or global claims. API v72 exposes the description, receipt
schema and closure policy read-only.

This addendum specifies a parameterized bulk two-owner response. It does not
resolve snow conduction, snow layers, phase change, scientific calibration or
unloaded global behavior, and it does not authorize promotion or canonization.

## Rung 77 land surface-root-zone-water thermal exchange addendum

Every current loaded-land step MUST propose one signed sensible-heat exchange
between the existing land surface sensible-heat owner and the persistent R72
root-zone-water thermal owner. The proposal MUST bind the exact current R72
land-hydrology thermal-step digest and preserve the initial surface and
root-zone owners. Its bulk response MUST use the two declared owner heat
capacities, their temperature difference and the declared `4 day` response
timescale. The transfer MUST be capped before application so root-zone liquid
water remains within `-2 C` through `45 C`.

A positive signed amount denotes land-surface heat credited to root-zone water;
a negative amount denotes root-zone-water heat credited to the land surface.
The surface-energy ledger MUST include that same signed amount, and
`axm.foundation-planet.land-surface-root-zone-thermal-receipt/v1` MUST bind the
exact proposal, R72 receipt, R76 receipt and surface-energy step. The paired
transfer MUST close `surface owner entry + root-zone owner entry`. The
persistent root-zone closure MUST close `final root-zone heat - initial
root-zone heat - signed heat to root-zone water`. The complete surface closure
MUST close `storage change - surface flux - boundary heat - precipitation phase
input + R75 cold-content warming + R76 heat to snow + signed heat to root-zone
water`.

All closures MUST preserve unrounded operands and measured residuals. Each
numerical bound MUST be the greater of one joule per square metre or eight
IEEE-754 epsilon steps at the sum of absolute operands. A producer flag,
rounded display value, fixed inflated tolerance or re-signed detached proposal
is not sufficient evidence. Root-zone water mass MUST remain unchanged by this
organ.

The earlier R72 receipt MUST remain intact after R77 changes the current
root-zone owner. The independent audit MUST instead verify the exact R72-final
to R77-initial to R77-final/current owner chain, the exact R76 handoff, and
recompute the proposal and all three closures.

Engine v39 MUST accept v38 state while preserving exact R76, R75,
land-hydrology and other owner lineage. It MUST initialize the R77 receipt to
null with an explicit no-history migration checkpoint and MUST NOT reconstruct
historical exchange. System audit v27 MUST independently reject unsigned source
changes, detached signed ledger or owner entries, inflated numerical bounds and
fabricated conduction, deeper-water, phase, geothermal, calibration or global
claims. API v73 exposes the description, receipt schema and closure policy
read-only.

The existing surface heat capacity already includes a prescribed soil-depth
term. This addendum MUST NOT introduce or imply a second generic solid-soil
owner. It specifies a parameterized surface/root-zone-water bulk response, not
resolved soil conduction, deep-soil or groundwater heat exchange, phase change,
geothermal forcing, scientific calibration or unloaded global behavior. It does
not authorize promotion or canonization.

## Rung 78 root-zone/deep-soil-water thermal exchange addendum

Every current loaded-land step MUST propose one signed sensible-heat exchange
between the persistent R72 root-zone-water and deep-soil-water thermal owners.
The proposal MUST bind the exact current R72 land-hydrology thermal-step digest
and R77 surface/root-zone receipt. It MUST preserve both initial liquid-water
owners. Its bulk response MUST use their joint liquid-water heat capacity,
their temperature difference and the declared `12 day` response timescale.
The transfer MUST be capped before application so both water temperatures
remain within `-2 C` through `45 C`.

A positive signed amount denotes root-zone-water heat credited to deep-soil
water; a negative amount denotes deep-soil-water heat credited to root-zone
water. `axm.foundation-planet.land-root-deep-water-thermal-receipt/v1` MUST
bind the exact proposal and both source receipts. The paired closure MUST close
`root-zone owner entry + deep-soil owner entry`. Each individual owner closure
MUST close its final heat, initial heat and signed transfer. The combined owner
closure MUST close both final heats against both initial heats. Neither water
mass may change through this organ.

All closures MUST preserve unrounded operands and measured residuals. Each
numerical bound MUST be the greater of one joule per square metre or eight
IEEE-754 epsilon steps at the sum of absolute operands. A producer flag,
rounded display value, fixed inflated tolerance or re-signed detached proposal
is not sufficient evidence.

The R72 and R77 receipts MUST remain intact after R78 changes the current root
and deep-soil water owners. Their audits MUST verify the downstream handoffs,
and system audit v28 MUST independently recompute the proposal, owner bindings
and all four R78 closures.

Engine v40 MUST accept v39 state while preserving exact R77, R76, R75,
land-hydrology and other owner lineage. It MUST initialize the R78 receipt to
null with an explicit no-history migration checkpoint and MUST NOT reconstruct
historical exchange. API v74 exposes the description, receipt schema and
closure policy read-only.

This addendum specifies a parameterized bulk exchange between two liquid-water
owners. It MUST NOT introduce or imply a solid-soil heat owner, resolved soil
conduction, groundwater heat exchange, phase change, geothermal forcing,
scientific calibration or unloaded global behavior. It does not authorize
promotion or canonization.

## Rung 79 deep-soil/groundwater-water thermal exchange addendum

Every current loaded-land step MUST propose one signed sensible-heat exchange
between the persistent R72 deep-soil-water and groundwater-water thermal
owners. The proposal MUST bind the exact current R72 land-hydrology
thermal-step digest and R78 root/deep-water receipt. It MUST preserve both
initial liquid-water owners. Its bulk response MUST use their joint
liquid-water heat capacity, their temperature difference and the declared `30
day` response timescale. The transfer MUST be capped before application so
both water temperatures remain within `-2 C` through `45 C`.

A positive signed amount denotes deep-soil-water heat credited to groundwater
water; a negative amount denotes groundwater-water heat credited to deep-soil
water.
`axm.foundation-planet.land-deep-groundwater-water-thermal-receipt/v1`
MUST bind the exact proposal and both source receipts. The paired closure MUST
close `deep-soil owner entry + groundwater owner entry`. Each individual owner
closure MUST close its final heat, initial heat and signed transfer. The
combined owner closure MUST close both final heats against both initial heats.
Neither water mass may change through this organ.

All closures MUST preserve unrounded operands and measured residuals. Each
numerical bound MUST be the greater of one joule per square metre or eight
IEEE-754 epsilon steps at the sum of absolute operands. A producer flag,
rounded display value, fixed inflated tolerance or re-signed detached proposal
is not sufficient evidence.

The R72 and R78 receipts MUST remain intact after R79 changes the current deep
and groundwater water owners. Their audits MUST verify the downstream
handoffs. When a loaded groundwater-transport receipt begins from the exact
R79 final groundwater owner, system audit v29 MUST validate its schema, digest
and final-current binding. A stale receipt with a different initial owner MUST
NOT be treated as downstream evidence; the current groundwater owner MUST then
equal R79 final directly.

Engine v41 MUST accept v40 state while preserving exact R78, R77, R76, R75,
land-hydrology and other owner lineage. It MUST initialize the R79 receipt to
null with an explicit no-history migration checkpoint and MUST NOT reconstruct
historical exchange. API v75 exposes the description, receipt schema and
closure policy read-only.

This addendum specifies a parameterized bulk exchange between two
liquid-water owners. It MUST NOT introduce or imply a solid-soil heat owner,
resolved soil or aquifer conduction, phase change, geothermal forcing,
scientific calibration or unloaded global behavior. It does not authorize
promotion or canonization.

## Runtime integrity and handoff

`axm.foundation-planet.system-audit/v33` is a read-only report over the currently selected Earth-system
column plus the latest loaded transport and basin receipts when those optional seams have run. It
routes each claim to evidence that can prove it: current schema lineage; the eight-level/seven-interface
pressure shape; the native phase thermal envelope and per-layer latent ledger; requested, applied and envelope-reconciled atmosphere boundary energy; water, surface-energy and moist-enthalpy residuals; atmosphere-owned gas state and gas
receipt; nested native-layer CO2-radiation schema, eight-layer shape, longwave accounting and truth
boundary; exact land/ocean compatibility mirrors; deep-ocean lineage and mixed/deep alkalinity closure; bounded mixed-layer carbonate source binding, species closure, alkalinity residual and typed refusals; carbonate-informed air-sea wet-air fugacity, direction, sender bound, paired owner application and carbon closure; loaded gas-domain receipt and
 area-weighted C/O2/N2 residuals; persistent surface, root-zone, deep-soil,
 groundwater and runoff-water sensible-heat owners; paired land-hydrology
 water/heat transfers; runoff-generation source-owner debit; loaded groundwater
 heat transport; paired liquid rainfall native-atmosphere debit and liquid land
 evaporation credit; persistent land-snow heat, snowfall/sublimation atmosphere
 transfers, the R74 downstream handoff, the exact R75 land-surface
 cold-content debit plus zero-Celsius land-hydrology receiver credit, and the
 R76 paired land-surface/snow sensible-heat owner exchange, the R77 paired
 land-surface/root-zone-water sensible-heat owner exchange, the R78 paired
 root-zone/deep-soil-water sensible-heat owner exchange, and the R79 paired
 deep-soil/groundwater-water sensible-heat owner exchange with its
 exact-current optional groundwater-transport handoff, the R80 paired
 groundwater-water/aquifer-matrix sensible-heat exchange, and the R81 paired
 deep-soil-water/non-overlapping-deep-subsurface-matrix sensible-heat
 exchange, followed by the R82 paired land-surface/deep-subsurface-matrix
 exchange across their exact coincident interface, followed by the R83 paired
 deep-subsurface/aquifer-matrix sensible-heat exchange across their explicit
 positive separation;
 evaporation native-atmosphere credit with exact land-receipt binding; land transfer, direct ocean credit and basin-inlet sender-debit
 bindings; transport truth boundaries; scale-aware
land-subgrid and per-channel floodplain plant-matter, plant-resource and
detrital-return, reaction-receiver, channel/floodplain exchange, river,
floodplain, ocean-boundary material and ocean-mouth sensible-heat closure,
exact shared-temperature and
receiver-owner receipt binding, and per-grain geomorphic-sediment numeric closure; and
finite surface/runoff sediment ownership, paired land/river/coast sediment receipts, independently
recomputed scale-aware coupled basin water, chemistry, plant-matter and
per-grain basin material residuals, and typed channel/floodplain exchange receipts. A required failure makes the verdict `FAIL`. An optional seam with no
receipt is `NOT_APPLICABLE`, producing `PASS_WITH_UNOBSERVED_OPTIONAL_SEAMS` instead of an invented pass.
`axm.foundation-planet.basin-aggregate-mass-closure-policy/v1` covers exactly
twelve coupled identities: water; C/N/P/O2/alkalinity; loaded-land plus
floodplain-plant C/N; and clay/silt/sand/gravel. Each identity records its
unrounded signed kilogram operands and measured residual. Its numerical bound
is the greater of the retained one-kilogram floor or eight IEEE-754 epsilon
steps at the sum of the absolute operands. The residual is never clamped or
relabelled as transported matter, and a value beyond its derived bound fails.

The browser publishes this report through `AXMFoundationPlanet.audit()` and the System integrity
diagnostic. The audit never mutates the world, repairs evidence, creates a receipt or grants scientific
authority. Its purpose is compact runtime trust, regression detection and exact handoff between later
AI stewards, game rulesets and world organs.

A persisted `surface-radiation-receipt/v1` predates the CO2 seam and is therefore honestly
`NOT_APPLICABLE` for this check. A current v2 receipt that omits or contradicts its nested CO2 evidence
is malformed and must return `FAIL`; version age cannot be used to hide a current contract violation.

## Seasonal and ecosystem dynamics

Seasonal state derives from canonical coordinate, axial tilt and world day. Weather cells are deterministic local conditions, not a forecast and not a global fluid solve. Pressure, wind, humidity, precipitation, lightning and fire risk provide atmospheric forcing. When a sparse Earth column exists, carried surface temperature, snow storage and age, sea-ice state, dynamic albedo, mixed-phase cloud optical depths, shortwave/longwave fluxes, cryosphere fusion receipt, plant-available soil water, persistent canopy/root/litter structure, local land carbon and nitrogen pools, physiological water demand, land-ecology flux receipt, persistent marine C/N/P/O2 and plankton pools, chlorophyll and hypoxia diagnostics, marine flux receipt, surface pressure, both compatibility-band wind vectors, the eight-level pressure-column schema, seven interface states, model-top height, lowest/highest layer temperatures, native water totals, sync residual, native dynamics schema, eight phase receipts, seven interface receipts, eight horizontal-level ledgers, precipitation routes, native water/resolved-energy residuals, convective kinetic energy, maximum interface velocity, buoyancy work and complete vertical-energy residual feed back into visible local weather rather than being regenerated as unrelated values. The procedural synoptic pressure and wind remain explicit boundary-forcing targets for the local column; they do not silently replace transported state. These coupled values may drive render effects and ecosystem stepping, but their truth boundary remains `scientificModel: false`. `pressureLevelDynamicsResolved` is true only when the loaded column has actually run the native local vertical organ; it is not a claim of forecast quality or three-dimensional fluid resolution.

Visited regional population state is persisted separately from both deterministic carrying-capacity priors and the physical column's aggregate land-ecology pools. State records retain cumulative births, mortality, predation losses, migration, fire disturbance, recovery and governed interventions. Animal totals are reconciled into juvenile, adult and senescent cohorts; maturation and senescence use catalog life-history values. Disabling Life makes physical vegetation physiology plus terrestrial, freshwater and marine population tiers dormant; it must not delete their history. A game may not call an intervention a world fact without a future governed world-action adapter.

## Physics seam

Every loaded sector publishes `axm.foundation-planet.physics-sector/v1`: a meter-scale, right-handed floating origin whose axes are east, radial-up and north; exact transforms between that frame and canonical planet coordinates; radial gravity with latitude and altitude variation; simulation bounds; and intended collider classes for terrain, ocean, rivers and organisms. The current explorer is kinematic and ground constrained. A future general rigid-body engine attaches to this descriptor rather than turning the whole planet into one physics scene. Physics results that alter canonical world state must return governed world actions rather than writing planet state directly.

## Revisioned persistence and shared-host seam

The v2 local save is a lineage-bound, checksummed envelope. Each commit receives a monotonically increasing revision and parent revision and appends a compact typed event. A writer may provide its expected revision; stale writes fail with `REVISION_CONFLICT`.

The optional shared authority is the Workshop Living World service v0.2. It preserves the original `living-globe` compatibility slot and stores every additional world under an isolated named lineage. A Caelus bootstrap must carry `world.axm.foundation-planet`, seed `18470219`, the local lineage ID, `axm.foundation-planet.coordinate/v1` and `axm.foundation-planet.host-contract/v1`. Creation is explicit and permission-gated. Opening the renderer never creates, attaches or mutates a host.

Hosted writes carry world ID, lineage and expected revision. Stale revisions, cross-world mutation, ownership or lineage transfer, silent reset and secret-like fields are refused. The host publishes a bounded change journal and creates world-specific snapshots with guarded restore. A matching hosted lineage may become authoritative; the browser-local save remains active otherwise.

Games and physics adapters produce governed intents. They never receive apply or reset authority. `axm.foundation-planet.sector-subscription/v1` selects nearby canonical entities by great-circle radius without treating render coordinates as truth.

## Authoritative participant movement

`axm.foundation-planet.authority-kernel/v1` binds controller seats to canonical participant records. The default cap is eight participants. Inputs use `axm.controller-input/v1`, monotonically increasing seat sequences and bounded axes/buttons. Replays, unbound seats and direct client position claims are refused. A deterministic fixed-step kernel owns acceleration, speed bounds, surface or swim mode and canonical latitude/longitude/elevation updates. It emits `axm.foundation-planet.authority-patch/v1` proposals; only the Living World service may persist them. This kernel is implemented and tested, but it does not mean a shared session is automatically running.

## Species catalog seam

The local `axm.foundation-planet.species-catalog/v1` schema and versioned catalog data now declare realm occupancy, habitat envelope, salinity and water-depth bounds, freshwater dependency, trophic role, maturity, reproduction strategy, life strategy, keystone role, movement model, activity cycle, asset archetype and simulation fidelity tiers. The renderer consumes catalog entries; it does not define biological truth. Rung 5 contains 96 broad ecological archetypes across terrestrial, freshwater, coastal, marine and deep-marine systems, not every real species. Future catalog versions may add entries without changing world coordinates or render code. A catalog update must preserve stable species IDs or publish an explicit migration.

## Rung 80: persistent aquifer-matrix sensible-heat ownership

R80 adds a persistent, parameterized aquifer-mineral-matrix sensible-heat
owner beside the existing R72 groundwater-water owner. It is deliberately
distinct from the existing land-surface sensible-heat owner. Each bounded
loaded-land step binds the exact current R79 receipt, then applies one signed,
equal-and-opposite groundwater-water/matrix transfer with a declared `90 day`
bulk response. Groundwater remains inside `-2 C` through `45 C`; the matrix
owner remains inside `-20 C` through `80 C`.

The matrix bulk capacity uses a declared `2e6 J m-3 K-1`, a bounded effective
depth derived from aquifer depth, and a bounded solid fraction derived from
porosity. These are model parameters, not measurements or calibration. The
receipt carries paired, groundwater, matrix and combined closures with
unrounded operands, measured residuals, and the established one-joule or
eight-ULP numerical bound. The exchange moves no groundwater water and changes
no matrix geometry.

The independent audit recomputes the parameterization, proposal, temperature
envelopes, exact R79-to-R80 owner chain, downstream exact-current loaded
groundwater transport when present, all signed owner entries, and all four
closures. Earth engine v42 migrates v41 columns by preserving R79 and earlier
evidence while initializing the matrix at current groundwater temperature as
an explicit no-history checkpoint. Only a later land step earns R80 evidence.

R80 does not resolve heat conduction through aquifer geometry, create a
geothermal source, model phase change, claim scientific calibration, or make
claims about unloaded global behavior. It remains `EXPERIMENTAL`; passing
tests does not promote or canonize it.

## Rung 81: persistent deep-subsurface-matrix sensible-heat ownership

R81 adds a persistent, parameterized deep-subsurface mineral-matrix
sensible-heat owner paired with the existing R79 deep-soil-water owner. The
matrix interval MUST begin at the clamped `soilDepthM` lower boundary of the
existing land-surface owner. It MUST end before the R80 aquifer-matrix upper
boundary. Its modeled thickness MUST be derived from the available gap and
remain within `0.5 m` through `8 m`; its solid fraction MUST be derived from
porosity and remain within `0.38` through `0.94`. Its declared solid
volumetric heat capacity is `2e6 J m-3 K-1`.

Each bounded loaded-land step MUST bind the exact current R79 receipt and
apply one signed, equal-and-opposite deep-soil-water/matrix transfer using a
declared `45 day` bulk response. Deep-soil water MUST remain within `-2 C`
through `45 C`; the matrix MUST remain within `-20 C` through `80 C`. The
exchange MUST preserve deep-soil water mass and all matrix interval and
capacity geometry. The receipt MUST carry paired, deep-soil, matrix, and
combined closures using the established one-joule or eight-ULP scale-aware
bound while retaining measured residuals.

The independent audit MUST recompute the substrate interval without trusting
producer geometry. It MUST verify the exact R79-final to R81-initial to
R81-final/current deep-soil owner chain, exact persistent matrix state,
proposal and receipt digests, signed entries, temperature envelopes, and all
four closures. A re-signed overlapping interval, detached owner, changed water
mass or geometry, inflated numeric tolerance, malformed R79 lineage, or
fabricated conduction/geothermal/calibration claim MUST fail.

Earth engine v43 MUST accept v42 state, preserve exact R80/R79 and earlier
evidence, and initialize R81 at current deep-soil-water temperature with an
explicit no-history checkpoint. Historical R81 exchange MUST NOT be
reconstructed. System audit v31 and API v77 expose the state, receipt, policy,
and audit read-only.

R81 does not resolve subsurface conduction, add geothermal forcing, model
phase change, claim scientific calibration, or claim unloaded-global
behavior. It does not authorize promotion or canonization.

## Rung 82: land-surface/deep-subsurface-matrix interface exchange

R82 connects the existing land-surface sensible-heat owner to R81's
persistent deep-subsurface mineral-matrix owner across their already declared
coincident boundary at clamped `soilDepthM`. It MUST NOT create a new material
reservoir, change either owner's heat capacity or interval geometry, overlap
owner intervals, or treat the interface as an external source.

Each bounded loaded-land step MUST bind the exact current R81 receipt and the
serialized final owner of the current surface-energy stage. It then applies
one signed, equal-and-opposite transfer with a declared `21 day` bulk response.
The land-surface owner MUST remain within `-120 C` through `80 C`; the matrix
owner MUST remain within `-20 C` through `80 C`. The receipt MUST carry paired,
surface-owner, matrix-owner, and combined closures using the established
one-joule or eight-ULP scale-aware bound while preserving measured residuals.

The independent audit MUST recompute surface heat capacity, the clamped
interface boundary, serialized surface-stage binding, response proposal,
temperature envelopes, exact R81-final to R82-initial to current owner chain,
signed entries, and all four closures. It MUST recognize R82 as the exact
downstream matrix handoff from R81. An unsigned proposal, detached surface or
matrix owner, noncoincident interface, changed owner geometry, inflated numeric
bound, changed response parameter, malformed R81 or surface-stage lineage, or
fabricated conduction/geothermal/calibration claim MUST fail.

Earth engine v44 MUST accept v43 state, preserve exact R81 and earlier evidence
and both current owners, and add only an explicit R82 no-history checkpoint.
Historical R82 exchange MUST NOT be reconstructed. System audit v32 and API
v78 expose the receipt, closure policy, interface, and audit read-only.

R82 is a parameterized bulk interface response, not resolved heat conduction.
It does not add geothermal forcing, model phase change, claim scientific
calibration, or claim behavior outside loaded land columns. It does not
authorize promotion or canonization.

## Rung 83: deep-subsurface/aquifer-matrix thermal exchange

R83 connects the existing R82 deep-subsurface mineral-matrix owner to the
existing R80 aquifer mineral-matrix owner. It MUST NOT add a new material or
energy reservoir, alter either owner's heat capacity or interval geometry,
move water, overlap their intervals, or treat either owner as an external heat
source. The explicit separation MUST be the aquifer upper-boundary depth minus
the deep-subsurface lower-boundary depth and MUST be positive.

Each bounded loaded-land step MUST bind the exact current R82 and R80 receipt
digests and their final matrix owners. It then applies one signed,
equal-and-opposite sensible-heat transfer using the declared distance-aware
bulk response:

```text
effective response timescale days = 120 * (1 + separationM / 10)
```

Both owners MUST remain within their existing temperature envelopes. The
receipt MUST carry paired-transfer, deep-owner, aquifer-owner, and combined
closures using the established one-joule or eight-ULP scale-aware bound while
preserving the measured residuals.

The independent audit MUST recompute both exact source digests, substrate and
owner geometry, positive gap, effective response timescale, proposal, owner
chain, temperature envelopes, signed entries, and all four closures. R80,
R81, and R82 audits MUST accept a downstream R83 handoff only when its exact
current source and owner lineage remains intact. An unsigned proposal,
detached current owner, overlapping or changed geometry, inflated numeric
bound, altered distance response, malformed source lineage, or fabricated
conduction, external-heat, geothermal, phase, calibration, or global claim
MUST fail.

Earth engine v45 MUST accept v44 state, preserve exact R82, R81, R80, and
earlier evidence plus both current matrix owners, and add only an explicit R83
no-history checkpoint. Historical R83 exchange MUST NOT be reconstructed.
System audit v33 and API v79 expose the receipt, closure policy, separation,
response, and audit read-only.

R83 is a parameterized distance-aware bulk response, not resolved
inter-matrix, subsurface, or aquifer conduction. It does not add external or
geothermal heat, move water, model phase change, claim scientific calibration,
or claim behavior outside loaded land columns. It does not authorize promotion
or canonization.

## Rung 84: persistent intervening-vadose-matrix thermal mediation

R84 MUST create one persistent mineral-matrix sensible-heat owner for the
entire positive gap declared by the exact current R83 receipt. Its upper
boundary MUST equal the deep-subsurface matrix lower boundary and its lower
boundary MUST equal the aquifer-matrix upper boundary. The three owner
intervals MUST NOT overlap. Its capacity MUST be its exact thickness times the
existing substrate solid fraction times the declared `2e6 J m-3 K-1` solid
volumetric heat capacity.

The exact current R83 receipt MUST remain intact source evidence. Before
mediation, R84 MUST post a reversal equal to the negative of R83's signed heat
to the aquifer and thereby restore the R83 initial deep and aquifer owners.
The direct R83 transfer MUST NOT remain double-counted. R84 MUST then compute
the deep-to-vadose and vadose-to-aquifer requests simultaneously from those
restored owners and the current vadose owner using:

```text
interface response timescale days = 75 * (1 + owner-center distanceM / 10)
```

One shared envelope limiter MUST preserve all three existing temperature
bounds. The receipt MUST carry seven scale-aware measured-residual closures:
R83 reconciliation, deep/vadose transfer, vadose/aquifer transfer, deep owner,
vadose owner, aquifer owner, and combined three-owner energy.

The independent audit MUST recompute the exact R83 digest and transfer,
substrate geometry, capacity, interface-center distances, response times,
proposal, envelope scale, three owner chains, signed entries, and all seven
closures. The R80 through R83 auditors MUST accept their downstream current
owners only through an intact exact R84 handoff. Unsigned proposal changes,
detached owners, changed or overlapping geometry, an inexact R83 reversal,
direct-transfer double-counting, inflated numeric bounds, altered response
times, or fabricated conduction, external-heat, geothermal, phase,
calibration, or global claims MUST fail.

Earth engine v46 MUST accept v45 state, preserve exact R83, R82, R81, R80, and
earlier evidence plus both current adjacent owners, and initialize R84 at the
mean of their current temperatures with an explicit no-history checkpoint.
Historical R84 exchange MUST NOT be reconstructed. System audit v34 and API
v80 expose the state, receipt, policy, and audit read-only.

R84 does not move water, add external or geothermal heat, resolve
inter-matrix, subsurface, aquifer, or vadose conduction, model phase change,
claim scientific calibration, resolve or debit the upstream soil/groundwater
source-heat owner, or claim unloaded-global behavior. It does not authorize
promotion or canonization.

## Rung 85: native vadose-matrix thermal mediation

The current runtime MUST NOT apply an R83 direct deep-subsurface-to-aquifer
matrix heat transfer and MUST NOT apply an R84 compensating reversal. R83 and
R84 schemas remain legacy compatibility contracts only.

Each loaded-land step MUST bind the intact exact current R82
surface/subsurface receipt and its final deep-subsurface matrix owner, the
intact exact current R80 groundwater/aquifer receipt and its final aquifer
matrix owner, and the persistent current vadose-matrix owner. It MUST compute
the deep-to-vadose and vadose-to-aquifer requests simultaneously using the R84
geometry and response rule:

```text
interface response timescale days = 75 * (1 + owner-center distanceM / 10)
```

One shared envelope limiter MUST preserve all three existing temperature
bounds. The receipt MUST carry six scale-aware measured-residual closures:
deep/vadose transfer, vadose/aquifer transfer, deep owner, vadose owner,
aquifer owner, and combined three-owner energy. No current R83 receipt or
direct-transfer budget entry may be emitted.

The independent audit MUST recompute both current source digests, the exact
substrate geometry, capacity and center distances, both responses, proposal,
envelope scale, all three owner handoffs, signed entries, and all six closures.
The R80, R81, and R82 audits MUST bind their downstream matrix owners through
the intact native R85 receipt. Re-signed changed geometry, inflated numeric
bounds, altered responses, detached owners, malformed source lineage, or
fabricated direct-transfer, reversal, conduction, external-heat, geothermal,
phase, calibration, or global claims MUST fail.

Earth engine v47 MUST accept v46 state while preserving exact current deep,
vadose, and aquifer owners. Intact R83 and R84 receipts MUST be retained only
inside labelled read-only compatibility evidence and MUST be cleared from
current receipt and budget authority. Historical heat MUST NOT be
reconstructed. The migrated vadose owner MUST carry a no-history checkpoint
until the first later step earns a current native receipt. System audit v35 and
API v81 expose the current state, receipt, compatibility lineage, policy, and
audit read-only.

R85 does not move water, add external or geothermal heat, resolve
inter-matrix, subsurface, aquifer, or vadose conduction, model phase change,
claim scientific calibration, resolve or debit the upstream soil/groundwater
source-heat owner, or claim unloaded-global behavior. It does not authorize
promotion or canonization.

## Rung 86: three-matrix aggregate thermal ledger

Each loaded-land step MUST emit one
`axm.foundation-planet.land-matrix-thermal-aggregate-receipt/v1` after the
current R85 mediation. The ledger MUST bind the intact exact current R80
groundwater/aquifer, R81 deep-soil/subsurface, R82 surface/subsurface, and R85
native-vadose receipt digests and step IDs. All four sources MUST share one
step ordinal.

The exact sequential owner chain MUST hold: R81's final deep owner is R82's
initial deep owner; R82's final deep owner is R85's initial deep owner; R80's
final aquifer owner is R85's initial aquifer owner; and all three R85 final
owners equal the current persistent deep, vadose, and aquifer owners. The
ledger MUST NOT mutate those owners.

R80's aquifer entry plus R81's and R82's deep-matrix entries are the only
external changes counted by the aggregate. R85's deep, vadose, and aquifer
entries MUST close to zero as internal transfers. A second scale-aware closure
MUST reconcile the final three-owner sensible heat against the initial three
owners and those three external entries. The retired R83 direct transfer and
legacy R83/R84 compatibility evidence MUST NOT be counted.

System audit v36 MUST independently bind the source schemas and digests,
recompute the step ordinal, exact owner chain, external and internal entries,
both measured residuals, and their one-joule/eight-ULP bounds. A detached
source or current owner, altered source digest, inflated numeric bound,
retired-transfer count, or fabricated physical-owner mutation, external heat,
conduction, geothermal, calibration, or global claim MUST fail.

Earth engine v48 MUST accept v47 state while preserving all three matrix
owners and exact current R80/R81/R82/R85 evidence. It MUST add only an R86
no-history checkpoint and MUST NOT reconstruct an aggregate receipt. The first
later loaded-land step earns current aggregate evidence. API v82 exposes the
description, receipt schema, closure policy, current receipt, and independent
audit read-only.

R86 is a cross-organ accounting proof, not a new heat-transfer process. It
does not move water or heat, add external or geothermal heat, resolve
conduction or phase change, claim scientific calibration, resolve or debit the
upstream soil/groundwater source-heat owner, or claim unloaded-global
behavior. It does not authorize promotion or canonization.

## Rung 87: consecutive three-matrix thermal continuity

After a loaded land column has emitted two consecutive intact R86 receipts,
the current step MUST emit one
`axm.foundation-planet.land-matrix-thermal-continuity-receipt/v1`. It MUST
embed both exact R86 sources and bind each source schema, digest, step ID, and
step ordinal. The current ordinal MUST equal the previous ordinal plus one.
No receipt may be reconstructed for a step that was not observed.

The previous R86 final deep-subsurface, vadose, and aquifer owners MUST equal
the corresponding current R86 initial owners exactly. The current R86 final
owners MUST equal the current persistent owners exactly. The receipt MUST NOT
mutate any physical owner.

Only the current R86 external R80 aquifer entry and R81/R82 deep-matrix
entries may be counted as temporal external changes. The current R85 entries
MUST remain internal and MUST retain their zero-sum closure. A scale-aware
measured-residual closure MUST reconcile all three current final sensible-heat
owners against all three previous final owners and those three current
external entries using the declared one-joule/eight-ULP policy.

System audit v37 MUST independently validate both embedded R86 receipts and
their digests; both source bindings; consecutive ordinals; exact owner
handoff; current final-owner persistence; external/internal classification;
the closure operands, residual, and bound; budget binding; and all bounded
truth claims. Re-signed detached evidence, inexact owner handoff, inflated
numeric bounds, retired or legacy evidence counting, physical-owner mutation,
historical reconstruction, or fabricated external-heat, conduction,
geothermal, calibration, or global claims MUST fail.

Earth engine v49 MUST accept v48 state while preserving exact current R86 and
all three current matrix owners. It MUST add only an R87 no-history checkpoint
and MUST NOT fabricate temporal history. The first later loaded-land step may
earn current R87 evidence from the preserved R86 source. API v83 exposes the
description, receipt schema, closure policy, current receipt, and independent
audit read-only.

R87 is a temporal accounting proof, not a new heat-transfer process. It does
not move water or heat, add external or geothermal heat, resolve conduction or
phase change, claim scientific calibration, resolve or debit the upstream
soil/groundwater source-heat owner, or claim unloaded-global behavior. It does
not authorize promotion or canonization.

## Rung 88: source-complete three-matrix continuity witness

Each loaded-land aggregate-producing step MUST persist one
`axm.foundation-planet.land-matrix-thermal-source-bundle/v1` containing the
exact current R80, R81, R82, and R85 receipts. The bundle MUST bind the current
R86 schema, digest, step ID, and ordinal. It MUST remain a read-only evidence
container and MUST NOT mutate any physical owner.

When exact previous and current source bundles plus current R87 continuity are
available, the step MUST emit one
`axm.foundation-planet.land-matrix-thermal-continuity-witness-receipt/v1`.
The witness MUST retain both bundles and the exact R87 receipt. Its window MUST
contain exactly the two adjacent aggregate-producing steps named by R87; it
MUST NOT accumulate an unbounded history.

For each step independently, all four retained source receipt schemas and
digests MUST validate. Their ordinals MUST agree. Their source digests, step
IDs, sequential owner handoffs, external R80/R81/R82 entries, internal R85
entries, initial and final three-matrix owners, and both R86 scale-aware
closures MUST replay exactly. The witness MUST bind those same two R86 digests
through R87. Source-complete means complete at the retained
R80/R81/R82/R85 receipt boundary; it MUST NOT imply indefinite ancestry.

System audit v38 MUST independently recompute both bundle replays, witness and
R87 bindings, current-column source digests, final current owners, budget
binding, and every bounded truth claim. A re-signed changed source receipt,
bundle digest, aggregate entry or closure, replay summary, current binding, or
fabricated mutation, retired/legacy count, external heat, reconstructed
history, conduction, geothermal, calibration, or global claim MUST fail.

Earth engine v50 MUST accept v49 state while preserving exact current R86,
R87, R80/R81/R82/R85 receipts, and all three current owners. Migration MAY
package those already-present exact current receipts as the prior source
bundle, but MUST emit no historical R88 witness. The first later loaded-land
step may earn the witness. API v84 exposes the source-bundle, aggregate-replay,
witness, and audit contracts read-only.

R88 is a bounded provenance proof, not a heat-transfer process. It does not
move water or heat, add external or geothermal heat, reconstruct heat history,
resolve conduction or phase change, claim scientific calibration, resolve or
debit the upstream soil/groundwater source-heat owner, or claim
unloaded-global behavior. It does not authorize promotion or canonization.

## Rung 89: expanded matrix source-owner energy closure

Each loaded-land aggregate-producing step MUST emit one
`axm.foundation-planet.land-matrix-thermal-source-owner-ledger-receipt/v1`.
It MUST bind the exact current R88 source bundle and R86 aggregate schema,
digest, step ID, and ordinal. It MUST validate the exact current R80, R81, R82,
and R85 receipts and their sequential matrix-owner handoffs.

The R80 groundwater-water, R81 deep-soil-water, and R82 surface sensible-heat
signed entries MUST each equal the negative of their corresponding R86 matrix
entry. The R85 deep, vadose, and aquifer entries MUST remain internal and sum
to zero within the scale-aware bound. The receipt MUST retain these six
initial and final owners:

- groundwater-water;
- deep-soil-water;
- surface sensible-heat;
- deep-subsurface matrix;
- vadose matrix; and
- aquifer matrix.

It MUST carry three paired counterpart closures, one native R85 internal
closure, one counterpart-source-total to R86-external-total closure, and one
expanded six-owner initial-to-final energy closure. Every closure MUST derive
its tolerance from the established one-joule or eight-ULP policy and MUST
preserve the measured residual.

System audit v39 MUST independently recompute source receipt validity, bundle
and aggregate bindings, ordinals, owner handoffs, all signed entries, all six
closures, current groundwater/deep-soil/surface and matrix owner bindings,
budget binding, and every bounded truth claim. A re-signed detached bundle,
changed counterpart or matrix entry, changed owner, inflated tolerance,
altered closure, or fabricated mutation, external heat, historical origin,
conduction, geothermal, calibration, or global claim MUST fail.

Earth engine v51 MUST accept v50 state while preserving exact current
R80/R81/R82/R85, R86/R87/R88, and all current owners. It MUST add only an R89
no-history checkpoint and MUST NOT emit a retroactive R89 ledger. The first
later loaded-land step may earn current R89 evidence. API v85 exposes the
receipt, closure policy, description, and independent audit read-only.

R89 expands the accounting boundary for current step transfers; it is not a
new heat-transfer process. It MUST NOT claim that the historical initial
matrix endowment/source-origin boundary is resolved or debited. It MUST NOT
reconstruct historical heat, mutate physical owners, add external or
geothermal heat, resolve conduction or phase change, claim scientific
calibration, or claim unloaded-global behavior. It does not authorize
promotion or canonization.

## Rung 90: configured matrix initial-endowment provenance

Every fresh v52 loaded-land column MUST retain one
`axm.foundation-planet.land-matrix-thermal-initial-endowment-receipt/v1`.
The receipt MUST bind the exact column ID, seed, initial day, substrate,
deep-subsurface source temperature, aquifer source temperature, and vadose
arithmetic mean of the clamped adjacent matrix temperatures. It MUST retain
the exact initial deep-subsurface, vadose, and aquifer matrix state schemas,
parameterizations, and owners.

All three initial owners MUST replay deterministically from the retained
inputs. Each owner's sensible heat MUST equal its parameterized areal heat
capacity multiplied by its retained temperature. The receipt MUST preserve the
exact sum as a modeled sensible-heat coordinate relative to zero Celsius and
MUST label that quantity `J m-2`. This coordinate MUST NOT be represented as
absolute thermodynamic energy.

The receipt boundary MUST be
`axm.foundation-planet.land-matrix-thermal-initial-endowment-boundary/v1` with
classification `configured-model-initial-condition-endowment`. Its historical
physical source owner and debit receipt MUST be null, and its transfer-entry
list MUST be empty. The receipt MUST NOT mutate an owner or perform a heat
transfer merely by recording initialized state.

System audit v40 MUST independently recompute the receipt digest, creation
context and substrate binding, all three parameterizations and initial owners,
the vadose adjacent mean, the modeled total, boundary classification, budget
binding, bounded truth, and the current matrix states' immutable geometry and
capacity bindings. A changed source temperature, initial owner, current static
parameter, context, substrate, modeled total, or re-signed physical-source,
debit, transfer, absolute-energy, conduction, geothermal, calibration, or
global claim MUST fail.

Earth engine v52 MUST accept v51 state while preserving exact current R89,
R88, R87, R86, current source owners, and current matrix owners. Because v51
did not retain initialization inputs, migration MUST emit no R90 receipt and
MUST add an explicit no-history checkpoint. A later step MUST NOT manufacture
or earn retroactive genesis evidence. The independent R90 audit MUST report
`NOT_APPLICABLE` for that checkpoint lineage. Current v52 receipt and
checkpoint states MUST survive exact save and restore. API v86 exposes the
receipt, boundary schema, description, and audit read-only.

R90 resolves only the provenance of native model initialization. It MUST NOT
claim that the historical physical source owner for the initial matrix
endowment is resolved or debited. It MUST NOT reconstruct historical heat,
mutate physical owners, add external or geothermal heat, resolve conduction or
phase change, claim absolute thermodynamic energy, claim scientific
calibration, or claim unloaded-global behavior. It does not authorize
promotion or canonization.

## Rung 91: configured genesis-to-first-step matrix continuity

For every fresh loaded-land lineage that reaches its first aggregate-producing
step, Earth engine v53 MUST persist one
`axm.foundation-planet.land-matrix-thermal-genesis-continuity-receipt/v1`.
The receipt MUST retain the exact valid R90 configured initial-endowment
receipt and the exact valid step-ordinal-one R86 aggregate receipt. It MUST
bind both source schemas and digests to those retained receipts.

The R90 initial deep-subsurface, vadose, and aquifer owners MUST equal the R86
first-step initial owners exactly. The receipt MUST retain both owner sets and
MUST contain an empty `unreceiptedIntervalEntries` array. Its configured total
and first-step initial total MUST be recomputed from the three owners and MUST
close under the established one-joule or eight-ULP scale-aware policy. The
receipt MUST describe this as configured-state continuity, not as a transfer,
mutation, historical reconstruction, or absolute-energy measurement.

System audit v41 MUST independently validate both source digests and schemas,
column and creation-context bindings, step ordinal, all three exact owner
handoffs, totals, empty interval, closure policy and residual, emission mode,
budget binding, persistence, and bounded truth. A re-signed detached source or
owner, changed source binding, non-empty interval or transfer entry, inflated
tolerance, or fabricated physical-source, debit, absolute-energy, conduction,
geothermal, calibration, or global claim MUST fail.

Earth engine v53 MUST accept v52 state with only evidence-supported outcomes.
An unstepped v52 column retaining exact R90 evidence MUST remain awaiting its
first aggregate and MAY earn R91 on that real first step. A v52 step-one column
MAY receive an R91 receipt only when exact retained R90 and R86 sources support
it; the receipt MUST identify migration from retained evidence. A later v52
column without the exact first aggregate MUST receive a permanent no-history
checkpoint and MUST NOT earn R91 retroactively. Current v53 receipts,
checkpoint states, and sources MUST survive exact save and restore. API v87
exposes the receipt, closure schemas, description, and independent audit
read-only.

R91 proves only zero-unreceipted-owner-delta continuity between configured
genesis and the initial owner state of the first runtime aggregate. It MUST NOT
claim that the historical physical source owner is resolved or debited. It
MUST NOT move or add heat, invent a transfer, reconstruct an unobserved
interval, claim absolute thermodynamic energy, resolve conduction or phase
change, add geothermal forcing, claim scientific calibration, or claim
unloaded-global behavior. It does not authorize promotion or canonization.

## Rung 92: configured-genesis through first-step expanded source-owner closure

For every fresh loaded-land lineage that completes its first runtime step,
Earth engine v54 MUST persist one
`axm.foundation-planet.land-matrix-thermal-genesis-source-owner-closure-receipt/v1`.
The receipt MUST retain the exact valid R91 genesis-continuity receipt and the
exact valid step-ordinal-one R89 source-owner ledger. It MUST bind both source
schemas and digests, the R91 creation context, and step ordinal one.

R91's configured genesis deep-subsurface, vadose, and aquifer owners MUST equal
the R89 initial matrix owners exactly. The configured initial expanded owner
set MUST contain those R91 matrix owners plus the initial groundwater-water,
deep-soil-water, and surface sensible-heat counterpart owners retained by the
first-step R89 ledger. The final expanded owner set MUST equal R89's six final
owners exactly.

The receipt MUST recompute both six-owner totals and carry one measured-
residual closure from the configured expanded initial owners to the first-step
final owners. Its numeric tolerance MUST use the established one-joule or
eight-ULP scale-aware policy. The receipt MUST NOT mutate any owner or perform
a heat transfer. Its counterpart owners MUST be described as entering at the
first runtime step; their historical initialization or genesis provenance MUST
remain unbound.

System audit v42 MUST independently recompute both embedded digests, source
bindings, creation context, exact matrix handoff, all six initial and final
owners, totals, closure operands, measured residual, derived tolerance,
emission mode, persistence, and bounded truth. A re-signed detached R89 owner,
changed R91 or R89 binding, altered owner graph, inflated tolerance, or
fabricated counterpart-genesis, mutation, transfer, physical-history,
absolute-energy, conduction, geothermal, calibration, or global claim MUST
fail.

Earth engine v54 MUST accept v53 with only evidence-supported outcomes. An
unstepped v53 lineage with intact configured evidence MUST remain awaiting its
first source-owner ledger and MAY earn native R92 only on that real first
step. A v53 step-one lineage MAY receive a migration-labelled R92 receipt only
when exact retained R91 and first-step R89 sources support it. A later v53
lineage without the exact first R89 ledger MUST receive a permanent no-history
checkpoint and MUST NOT earn R92 retroactively. Current v54 receipts,
checkpoint states, sources, and truth MUST survive exact save and restore. API
v88 exposes the receipt, closure schemas, description, and independent audit
read-only.

R92 proves only a bounded accounting graph from configured matrix genesis plus
first-runtime-step counterpart owners through the first-step final six owners.
It MUST NOT claim counterpart historical initialization provenance, resolve or
debit the historical physical source owner of the configured matrix endowment,
reconstruct historical heat, mutate owners, move or add heat, claim absolute
thermodynamic energy, resolve conduction or phase change, add geothermal
forcing, claim scientific calibration, or claim unloaded-global behavior. It
does not authorize promotion or canonization.

## Rung 93: configured counterpart initial-endowment provenance

Every fresh v55 loaded-land column MUST retain one
`axm.foundation-planet.land-matrix-thermal-counterpart-initial-endowment-receipt/v1`.
The receipt MUST bind the exact column ID, seed, initial day, substrate,
configured sample moisture, configured ecology freshwater potential, seasonal
groundwater temperature, surface-derived deep-soil temperature, and rounded
initial surface temperature.

The deep-soil water amount MUST equal the Earth engine's six-decimal rounded
clamp of `deepFieldCapacityMm * (0.45 + moisture * 0.7)` to the interval from
zero through `deepCapacityMm`. The groundwater amount MUST equal the
six-decimal rounded clamp of `aquiferCapacityMm * (0.08 +
freshwaterPotential * 0.58)` to the interval from zero through
`aquiferCapacityMm`. Both water owners MUST use the existing liquid-water
temperature bounds and 4,184 J kg-1 K-1 sensible-heat coordinate. The surface
owner MUST use `2.35e6 + soilDepthM * 1.15e6` J m-2 K-1 and the rounded
initial surface temperature. The receipt MUST preserve the exact three-owner
sum as modeled sensible heat relative to zero Celsius and MUST NOT represent
it as absolute thermodynamic energy.

The receipt boundary MUST be
`axm.foundation-planet.land-matrix-thermal-counterpart-initial-endowment-boundary/v1`
with classification
`configured-model-counterpart-initial-condition-endowment`. Its three
historical physical source-owner fields and three source-owner debit-receipt
fields MUST be null, and its transfer-entry list MUST be empty. Recording the
configured owners MUST NOT mutate state or perform a transfer.

System audit v43 MUST independently recompute the digest, configured formulas,
three owners, modeled total, creation context, substrate binding, boundary,
budget persistence, and bounded truth. A pristine unstepped column MUST retain
the exact three initialized owners. An otherwise unstepped column whose
groundwater owner has changed through a valid loaded groundwater-transport
receipt MAY remain valid only when that receipt is digest-valid and its final
owner for the audited column equals the current groundwater owner. A re-signed
changed input, detached owner or substrate, invalid transport bypass, or
fabricated first-step, physical-source, debit, transfer, mutation,
absolute-energy, conduction, geothermal, calibration, or global claim MUST
fail.

Earth engine v55 MUST accept v54 state while preserving the current owners.
Because v54 did not retain the complete configured input set, migration MUST
emit no R93 receipt and MUST add a permanent no-history checkpoint. Later
steps MUST NOT reconstruct or earn retroactive configured-genesis provenance.
Current v55 receipts and checkpoints MUST survive exact save and restore. API
v89 exposes the receipt, boundary schema, description, and independent audit
read-only.

R93 proves configured model provenance only. It MUST NOT claim that the
configured counterpart owners hand off exactly into the first runtime step.
It MUST NOT resolve or debit historical physical source owners, reconstruct
historical heat, mutate owners, move or add heat, claim absolute thermodynamic
energy, resolve conduction or phase change, add geothermal forcing, claim
scientific calibration, or claim unloaded-global behavior. It does not
authorize promotion or canonization.

## Rung 94: receipted counterpart genesis-to-first-matrix handoff

For every fresh v56 loaded-land lineage whose exact configured counterpart
state remains attached through its first runtime step, the Earth engine MUST
persist one
`axm.foundation-planet.land-matrix-thermal-counterpart-genesis-continuity-receipt/v1`.
The receipt MUST retain the exact valid R93 initial-endowment receipt, exact
valid step-ordinal-one R89 source-owner ledger, and exact valid step-one land
hydrology, surface/snow, surface/root-zone, root/deep-water, and
deep/groundwater-water receipts.

R94 MUST NOT require the raw R93 owners to equal the R89 initial counterpart
owners. The groundwater and deep-soil chains MUST instead join through the
retained hydrology and paired water-owner receipts field for field. The
surface chain MUST join the R93 surface owner to the embedded first surface-
energy ledger and its R89 endpoint using the established one-joule energy
floor and explicit 1e-6 temperature/capacity coordinate reconciliation. The
surface/snow and surface/root-zone receipts MUST retain the same surface-
energy projection under their own digests.

The receipt MUST retain owner-specific interval entries for the hydrology
groundwater and deep-soil deltas, root/deep and deep/groundwater signed owner
entries, and surface-energy storage change. It MUST recompute one closure per
counterpart owner from the configured owner, exact interval entries, and R89
endpoint. Each closure MUST use the established one-joule or eight-ULP
scale-aware policy, preserve its measured residual, and close. The
unreceipted-entry list MUST be empty. This is a receipted interval claim, not
a claim that the raw endpoint owners or their modeled heat totals are equal.

System audit v44 MUST independently re-digest the receipt and all embedded
typed sources, check source bindings, recompute every owner-chain join,
interval entry, closure operand, measured residual, derived tolerance,
emission mode, persistence binding, and bounded truth. A re-signed detached
R89 endpoint, changed source binding, invalid interval receipt, unreceipted
entry, inflated tolerance, or fabricated mutation, transfer, combined-six-
owner, physical-history, absolute-energy, conduction, geothermal,
calibration, or global claim MUST fail.

Earth engine v56 MUST accept v55 with only evidence-supported outcomes. An
unstepped v55 lineage with intact R93 evidence MUST remain awaiting its real
first runtime owner interval. A v55 step-one lineage MAY receive a migration-
labelled R94 receipt only when the complete retained R93, R89, and interval
sources independently support it. A later, incomplete, or pre-step-detached
lineage MUST receive a permanent no-history checkpoint and MUST NOT invent
continuity. Current v56 receipts and checkpoints MUST survive exact save and
restore. API v90 exposes the receipt, closure schemas, description, and
independent audit read-only.

R94 proves only a read-only modeled-owner lineage into the first matrix
source-owner ledger. It MUST NOT mutate an owner, perform a new transfer,
claim a combined six-owner graph, resolve or debit historical physical source
owners, reconstruct historical heat, claim absolute thermodynamic energy,
resolve conduction or phase change, add geothermal forcing, claim scientific
calibration, or claim unloaded-global behavior. It does not authorize
promotion or canonization.

## Rung 95: counterpart historical-source evidence requirements

Every fresh v57 loaded-land column with an exact R93 configured counterpart
initial-endowment receipt MUST retain one
`axm.foundation-planet.land-matrix-thermal-counterpart-historical-source-requirements-receipt/v1`.
The receipt MUST retain and digest-bind the exact R93 source. It MUST declare
exactly one
`axm.foundation-planet.land-matrix-thermal-counterpart-historical-source-owner-requirement/v1`
for each configured groundwater-water, deep-soil-water, and surface
sensible-heat owner, in that order. Each requirement MUST bind the exact
configured owner, R93 digest, and owner path.

Each owner requirement MUST keep its historical physical source-owner slot
and historical source-owner debit-receipt slot null. It MUST keep the
following admission criteria false and name them as missing evidence: a typed
persistent source-owner state existing before configured endowment; an
independent source identity and physical scope; compatible energy coordinates
and units; exact sender pre-debit and post-debit states; an exact receiver
binding to the configured R93 owner; sender-debit and receiver-credit closure;
and declared human or AXM review of the proposed physical meaning. Every
requirement MUST remain `UNRESOLVED`.

The receipt summary MUST report three configured owners, three required
physical source owners, three required sender-debit receipts, zero admitted
source owners, zero admitted debit receipts, and three outstanding
requirements. The receipt MUST NOT provide an admission path, infer a source
from model parameters, retrofit a runtime owner as its own historical source,
or treat a configured initial condition as evidence of physical funding.

System audit v45 MUST independently re-digest the R95 receipt and embedded
R93 source, validate their attachment to the column, reconstruct all three
requirements from the exact configured owners, require all evidence slots and
criteria to remain empty and false, check summary, budget persistence, and
bounded truth, and reject re-signed source rebinding or fabricated source,
debit, resolution, mutation, transfer, history, combined-graph,
absolute-energy, conduction, geothermal, calibration, or global claims.

Earth engine v57 MUST accept v56 state. A v56 lineage retaining an exact valid
R93 source MAY receive a migration-labelled R95 requirements receipt because
the receipt records only present missing-evidence requirements; it MUST NOT
claim recovered history. A lineage without exact R93 evidence MUST receive a
permanent checkpoint and MUST NOT manufacture configured-owner or physical-
source evidence. Native and migrated receipts and checkpoints MUST survive
exact save and restore. API v91 exposes both R95 schemas, its description, and
the independent audit read-only.

R95 advances only the auditability of the unresolved historical-source
frontier. It MUST NOT resolve or debit a historical physical source owner,
admit a candidate, reconstruct historical heat, mutate an owner, perform a
transfer, claim a combined six-owner graph, claim absolute thermodynamic
energy, resolve conduction or phase change, add geothermal forcing, claim
scientific calibration, or claim unloaded-global behavior. It does not
authorize promotion or canonization.

## Rung 96: matrix-endowment historical-source evidence requirement

Every fresh v58 loaded-land column with an exact R90 configured matrix
initial-endowment receipt MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-requirements-receipt/v1`.
The receipt MUST retain and digest-bind the exact R90 source. It MUST declare
one
`axm.foundation-planet.land-matrix-thermal-historical-source-endowment-requirement/v1`
for the complete configured endowment bundle, binding the exact deep-
subsurface, vadose, and aquifer initial states, their paths, and the common
thermal coordinate.

The single requirement MUST keep its historical physical source-owner and
historical source-owner debit-receipt slots null. It MUST keep the following
admission criteria false and list them as missing evidence: a typed persistent
source-owner state existing before configured endowment; an independent
source identity and physical scope; compatible energy coordinates and units;
exact sender pre-debit and post-debit states; receiver allocation across all
three exact R90 owners; sender-debit and three-receiver-credit closure; and
declared human or AXM review of the proposed physical meaning. Both physical-
source-owner and debit-receipt cardinalities MUST remain unresolved. The
requirement MUST remain `UNRESOLVED`.

The receipt summary MUST report three configured matrix owners, one required
endowment evidence bundle, zero admitted physical-source bundles, zero
admitted sender-debit bundles, and one outstanding requirement. It MUST NOT
split the singular R90 boundary into invented per-owner sources, infer a
source from initialization parameters, provide a candidate-admission path,
or treat the configured endowment as evidence of physical funding.

System audit v46 MUST independently re-digest the R96 receipt and embedded
R90 source, validate their attachment to the column, reconstruct the complete
requirement from the exact configured states and coordinate, require both
evidence slots and all criteria to remain empty and false, check unresolved
cardinalities, summary, budget persistence, and bounded truth, and reject
re-signed source rebinding or fabricated source, debit, cardinality,
resolution, mutation, transfer, history, combined-graph, absolute-energy,
conduction, geothermal, calibration, or global claims.

Earth engine v58 MUST accept v57 state. A v57 lineage retaining an exact valid
R90 source MAY receive a migration-labelled R96 requirements receipt because
the receipt records only present missing-evidence requirements; it MUST NOT
claim recovered history. A lineage without exact R90 evidence MUST receive a
permanent checkpoint and MUST NOT manufacture configured-owner or physical-
source evidence. Native and migrated receipts and checkpoints MUST survive
exact save and restore. API v92 exposes both R96 schemas, its description,
and the independent audit read-only.

R96 advances only the auditability of the unresolved matrix-endowment
historical-source frontier. It MUST NOT resolve how many source owners or
debit receipts are required, resolve or debit a historical physical source,
admit a candidate, reconstruct historical heat, mutate an owner, perform a
transfer, claim a combined six-owner graph, claim absolute thermodynamic
energy, resolve conduction or phase change, add geothermal forcing, claim
scientific calibration, or claim unloaded-global behavior. It does not
authorize promotion or canonization.

## Rung 97: asymmetric historical-source requirements inventory

Every fresh v59 loaded-land column retaining exact valid R95 and R96
requirements receipts MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-requirements-inventory-receipt/v1`.
The inventory MUST embed and digest-bind those exact two receipts. Its two
typed inventory boundaries MUST preserve R96 as one matrix-endowment bundle
requirement and R95 as three owner-scoped counterpart requirements; it MUST
NOT flatten either source shape.

The inventory MUST report six configured-owner references, four requirement
records, four physical-source evidence slots, four sender-debit evidence
slots, zero admitted sources, zero admitted debits, and four outstanding
requirements. All eight evidence slots MUST remain empty through the exact
embedded R95 and R96 records. R96's source and debit cardinalities MUST remain
explicitly unresolved. R95's three owner-scoped records MUST NOT be upgraded
into a claim about distinct source-owner cardinality. No cross-boundary
source-owner or debit-receipt cardinality MAY be inferred.

System audit v47 MUST independently re-digest the R97 receipt and both
embedded sources, validate their attachment to the current column, rebuild
both asymmetric boundaries and the four-record/eight-slot summary, check
budget persistence and bounded truth, and reject re-signed source rebinding,
shape flattening, fabricated evidence, candidates, cardinality, resolution,
mutation, transfer, history, combined-graph, absolute-energy, conduction,
geothermal, calibration, or global claims.

Earth engine v59 MUST accept v58 state. A v58 lineage retaining both exact
valid R95 and R96 receipts MAY receive a migration-labelled R97 inventory
because it binds only retained present evidence; it MUST NOT claim recovered
history. A lineage missing either exact source MUST receive a permanent
checkpoint and MUST NOT synthesize a replacement requirement source. Native
and migrated receipts and checkpoints MUST survive exact save and restore.
API v93 exposes both R97 schemas, its description, and the independent audit
read-only.

R97 advances only the auditability of the two unresolved requirement
boundaries. It MUST NOT admit a source, supply a debit receipt, resolve
cross-boundary cardinality, fund either configured endowment, claim a
combined six-owner physical graph, reconstruct history, mutate an owner, move
heat, claim absolute thermodynamic energy, resolve conduction or phase
change, add geothermal forcing, claim scientific calibration, or claim
unloaded-global behavior. It does not authorize promotion or canonization.

## Rung 98: historical-source evidence readiness

Every fresh v60 loaded-land column retaining an exact valid R97 requirements
inventory MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-evidence-readiness-receipt/v1`.
The receipt MUST embed and digest-bind that exact R97 source and preserve its
one matrix-bundle record plus three counterpart-owner records.

Each of the four requirement records MUST map its seven exact criteria to
seven acquisition requests. Across the receipt there MUST be 28 requests for
nine unique capabilities: 24 `EVIDENCE` gaps and four `AUTHORITY` gaps. The
matrix-bundle receiver-allocation and three-receiver closure capabilities MUST
remain distinct from the counterpart configured-owner receiver-credit and
single-receiver closure capabilities.

Every request MUST remain `MISSING`, carry no observed evidence, have an
`UNKNOWN` verification verdict, satisfy no criterion, and grant no authority.
Every record MUST remain `BLOCKED` at the capability route and `NOT_READY` for
admission, with null candidate package and null review decision. The typed
capability route MUST NOT be interpreted as blocking the persistent steward
goal itself. Receipt totals MUST report zero observed evidence, zero verified
evidence, zero candidates, and zero admission-ready requirements.

System audit v48 MUST independently re-digest R98 and R97, rebuild all four
records and 28 requests from the exact R97 criteria, validate the asymmetric
capability mapping, current-column attachment, summary, budget persistence,
and bounded truth, and reject request removal or substitution, re-signed R97
rebinding, fabricated evidence, candidate or review injection, admission
authority, resolution, mutation, transfer, history, combined-graph,
absolute-energy, conduction, geothermal, calibration, or global claims.

Earth engine v60 MUST accept v59 state. A v59 lineage retaining an exact valid
R97 receipt MAY receive a migration-labelled R98 receipt because it binds only
retained present requirements; it MUST NOT claim recovered evidence or
history. A lineage missing exact R97 MUST receive a permanent checkpoint and
MUST NOT synthesize replacement requirements. Native and migrated receipts and
checkpoints MUST survive exact save and restore. API v94 exposes all three R98
schemas, its description, and the independent audit read-only.

R98 advances only the auditability and acquisition routing of the unresolved
historical-source frontier. It MUST NOT identify or admit a source, supply or
verify a debit receipt, resolve cardinality, fund either configured endowment,
create a candidate admission path, grant admission authority, claim a physical
source graph, reconstruct history, mutate an owner, move heat, claim absolute
thermodynamic energy, resolve conduction or phase change, add geothermal
forcing, claim scientific calibration, or claim unloaded-global behavior. It
does not authorize promotion or canonization.

## Rung 99: historical-source evidence intake contract

Every fresh v61 loaded-land column retaining an exact valid R98 readiness
receipt MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-evidence-intake-contract-receipt/v1`.
The contract MUST bind the exact R98 digest and route all 28 requests without
changing their requirement, criterion, capability, or expected-artifact
identity. Exactly 24 `EVIDENCE` requests MUST allow untrusted candidate-data
submission. Exactly four `AUTHORITY` requests MUST prohibit candidate
submission and require a Mike Tobi/AXM review decision.

A candidate package MUST remain `UNREVIEWED_CANDIDATE_DATA`, carry only
caller-claimed producer, observation, source-pointer, and SHA-256 content
digest metadata, contain no authority decisions, and bind the exact current
contract digest. Its content MUST NOT be loaded or executed. The pure
structural assessor MAY report partial structural reviewability or complete
24-item structural coverage, but MUST preserve `UNKNOWN` evidence and
physical-meaning verdicts plus `NOT_AUTHORIZED` admission. Candidate packages
and assessments MUST NOT be persisted in Earth-system state, alter any
receipt, mutate any owner, or transfer heat.

System audit v49 MUST independently rebuild R99's 28 slots from exact R98,
validate the 24/4 routing split, current-column attachment, zero-count
summary, budget persistence, and bounded truth, and reject request removal,
substitution, re-signed source rebinding, stored candidates or reviews,
verification, authority, admission, resolution, mutation, transfer, history,
combined-graph, absolute-energy, conduction, geothermal, calibration, or
global claims.

Earth engine v61 MUST accept v60 state. A v60 lineage retaining an exact valid
R98 receipt MAY receive a migration-labelled R99 contract because it binds
only retained readiness state; it MUST NOT claim recovered evidence or
history. A lineage missing exact R98 MUST receive a permanent checkpoint and
MUST NOT synthesize a replacement contract. Native and migrated contracts and
checkpoints MUST survive exact save and restore. API v95 exposes all five R99
schemas, its description, and pure candidate-package create/assess helpers.

R99 advances only structural review intake. It MUST NOT identify, verify, or
admit a historical source or debit receipt, resolve cardinality, fund either
configured endowment, grant admission authority, claim a physical source
graph, reconstruct history, mutate an owner, move heat, claim absolute
thermodynamic energy, resolve conduction or phase change, add geothermal
forcing, claim scientific calibration, or claim unloaded-global behavior. It
does not authorize promotion or canonization.

## Rung 100: historical-source evidence artifact integrity

Every fresh v62 loaded-land column retaining an exact valid R99 intake
contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-evidence-artifact-integrity-contract-receipt/v1`.
The contract MUST embed and digest-bind that exact R99 source and preserve all
28 routes without changing their request identities. Exactly 24 `EVIDENCE`
routes MUST permit resource-bounded inert-byte SHA-256 comparison. Exactly
four `AUTHORITY` routes MUST remain excluded and MUST require Mike Tobi/AXM
physical-meaning review.

The transient comparator MUST accept exact artifact-byte inputs containing a
request id and `Uint8Array`. It MUST enforce 4 MiB per-artifact and 32 MiB
per-assessment limits, clone bytes before hashing, and compare only their
SHA-256 digest with the R99 candidate item's caller-claimed digest. It MUST
refuse invalid, duplicate, extra, missing, oversized, contract-mismatched, or
structurally unreviewable inputs without emitting artifact receipts.

`CONTENT_DIGEST_MATCH` MUST mean only byte equality with the claimed digest.
Observation authenticity, provenance, physical meaning, and evidence
verification MUST remain `UNKNOWN`; admission MUST remain `NOT_AUTHORIZED`.
Artifact bytes and integrity assessments MUST NOT be persisted. Content MUST
NOT be parsed, executed, interpreted, admitted, or applied to Earth-system
state. A mismatch MUST remain an explicit `CONTENT_DIGEST_MISMATCH` failure.

System audit v50 MUST independently rebuild R100's 28 routes from exact R99,
validate its 24/4 split, current-column attachment, zero persistent artifact
and assessment counts, resource bounds, budget persistence, emission mode,
and bounded truth, and reject route substitution, re-signed R99 rebinding,
stored artifacts or receipts, false authenticity, provenance, meaning,
verification, authority, admission, resolution, mutation, transfer, history,
combined-graph, absolute-energy, conduction, geothermal, calibration, or
global claims.

Earth engine v62 MUST accept v61 state. A v61 lineage retaining an exact valid
R99 contract MAY receive a migration-labelled R100 contract because it binds
only retained intake state; it MUST NOT claim recovered evidence or history.
A lineage missing exact R99 MUST receive a permanent checkpoint and MUST NOT
synthesize a replacement contract. Native and migrated contracts and
checkpoints MUST survive exact save and restore. API v96 exposes all five R100
schemas, its description, and the async transient digest-comparison helper.

R100 advances only artifact-byte integrity comparison. It MUST NOT
authenticate an observation, verify provenance or physical meaning, verify or
admit historical evidence, identify or debit a historical physical source
owner, resolve cardinality, fund either configured endowment, grant authority,
reconstruct history, mutate an owner, move heat, claim absolute thermodynamic
energy, resolve conduction or phase change, add geothermal forcing, claim
scientific calibration, or claim unloaded-global behavior. It does not
authorize promotion or canonization.

## Rung 105 host trust-anchor provisioning proposal contract

Every fresh v67 loaded-land column retaining an exact valid R104
authority-decision integrity contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal-contract-receipt/v1`.
It MUST embed and digest-bind exact R104, preserve all 28 routes, declare exactly
24 proposal-eligible routes, and preserve the four authority-review exclusions.
It MUST declare `authority.host-trust-anchor.provision.proposal.create` as
implemented and `authority.host-trust-anchor.provision` as required but
unavailable. It MUST persist zero host references, policies, proposals, trust
anchors, acceptance receipts, bindings, replay entries, or admissions.

A transient claimed-host reference MUST be derived from a structurally valid
`axm.foundation-planet.host-projection/v1` for the Foundation Planet named
world. It MUST bind the exact world id, lineage, non-negative host revision,
64-hex world digest, and `living-world-state-server` owner label. These fields
MUST NOT be described as host authentication, proof of authority, acceptance,
or trust-anchor provisioning.

A transient proposal MUST bind exact R105, its embedded exact R104 contract,
the exact caller-supplied policy descriptor digest and its distinct decision
and revocation public-key hashes, the exact claimed-host reference, and all 24
eligible route ids. It MUST contain no raw public keys, signatures, private
keys, or candidate evidence. The request window MUST be positive and at most
seven days, and the requested review seat MUST remain the AXM host-authority
review seat. Validation with a supplied host projection MUST require exact
equality with the derived claimed-host reference.

The proposal status MUST remain
`PENDING_MIKE_TOBI_AXM_HOST_AUTHORITY_DECISION_PROPOSAL_ONLY`. Its fixed effects
MUST be `applyAuthority: false`, `hostAccepted: false`,
`hostTrustAnchorInstalled: false`, zero trusted verifier bindings, no
persistence, and no world mutation. Host identity, authority, acceptance,
trust-anchor provisioning, policy trust, and verifier binding MUST remain
`UNKNOWN`; admission MUST remain `NOT_AUTHORIZED`. The proposal MUST NOT be
accepted as a host patch or authority receipt.

System audit v55 MUST independently reconstruct R105's exact 28/24/4 routes
from attached R104, validate current-column and budget attachment, zero
persistent-artifact counts, emission mode, capability boundary, and bounded
truth, and reject capability substitution or false host acceptance, trust,
binding, authority, persistence, admission, resolution, mutation, transfer,
history, absolute-energy, or calibration claims.

Earth engine v67 MUST accept v66 state. A v66 lineage retaining exact R104 MAY
receive a migration-labelled R105 contract; a lineage missing exact R104 MUST
receive a permanent checkpoint and MUST NOT synthesize a host reference,
policy, proposal, trust anchor, or acceptance receipt. Native and migrated
contracts and checkpoints MUST survive exact save and restore. API v101 exposes
the four R105 schemas, description, transient builder, and validators while
preserving API v100.

R105 advances only host-bound proposal creation and structural verification.
It MUST NOT authenticate the host, establish host authority, obtain acceptance,
install or persist a trust anchor, trust a policy, bind a verifier key, resolve
identity, prove independence, authenticate an observation, verify provenance or
physical meaning, admit evidence, identify or debit a historical physical
source owner, reconstruct history, mutate an owner, move heat, claim absolute
thermodynamic energy, resolve conduction, add geothermal forcing, or claim
scientific calibration. It does not authorize promotion or canonization.

## Rung 106 host provisioning-receipt signature-integrity contract

Every fresh v68 loaded-land column retaining an exact valid R105 host
trust-anchor provisioning proposal contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity-contract-receipt/v1`.
It MUST embed and digest-bind exact R105, preserve all 28 routes, declare
exactly 24 receipt-signature-integrity routes, and preserve the four
authority-review exclusions. Eligible routes MUST declare
`authority.host-trust-anchor.provision.receipt.signature.verify` as implemented
while `authority.host-trust-anchor.provision.receipt.verify` and
`authority.host-trust-anchor.provision` remain required but unavailable. The
contract MUST persist zero host references, proposals, policies, receipt
envelopes, assessments, raw host-authority keys, signatures, trust anchors,
bindings, replay entries, or admissions.

A transient
`axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-envelope/v1`
MUST bind exact R106, the exact R105 proposal and caller-supplied policy, the
proposal's exact claimed-host world/lineage/revision/digest reference, receipt
id, distinct nonce, bounded receipt window, claimed outcome, review seat,
claimed host-authority key id, and caller-supplied Ed25519 public-key hash. The
receipt window MUST be positive, at most 24 hours, and wholly inside the
proposal window. The claimed host-authority key hash MUST differ from the
caller's untrusted policy decision and revocation key hashes. The envelope MUST
contain no raw public key, signature bytes, private key, candidate evidence, or
applied authority.

The envelope MAY record one of
`CLAIMED_HOST_TRUST_ANCHOR_PROVISIONED`,
`CLAIMED_HOST_TRUST_ANCHOR_PROVISIONING_HELD`, or
`CLAIMED_HOST_TRUST_ANCHOR_PROVISIONING_REJECTED`. These fields MUST remain
untrusted claims rather than observed effects. Actual `applyAuthority`, host
acceptance, installation, policy trust, trusted bindings, persistence, and
world mutation MUST remain false or zero.

The transient verifier MUST accept only a 32-byte raw Ed25519 public key and a
64-byte detached signature bound to the exact envelope digest. It MUST verify
the canonical envelope text, recompute the supplied key and signature SHA-256
hashes, check exact key-hash equality, proposal and receipt windows, nonce
separation, and host-key separation from both policy keys. It MUST retain only
hashes and character counts in the assessment; raw key and signature bytes
MUST NOT persist.

A receipt-signature-integrity `PASS` MUST mean only integrity under the exact
caller-supplied unauthenticated host key. Receipt authority, full provisioning-
receipt verification, host identity, authority to provision, host acceptance,
trust-anchor installation, policy trust, verifier binding, observation
authenticity, provenance, physical meaning, and evidence verification MUST
remain `UNKNOWN` or `UNTRUSTED_CALLER_SUPPLIED`; admission MUST remain
`NOT_AUTHORIZED`. A valid signature MUST NOT apply the receipt's claimed
effects.

System audit v56 MUST independently reconstruct R106's exact 28/24/4 routes
from attached R105, validate current-column and budget attachment, zero
persistent-artifact counts, emission mode, capability boundary, and bounded
truth, and reject capability substitution or false receipt authority, host
acceptance, trust-anchor installation, trust, binding, persistence, admission,
resolution, mutation, transfer, history, absolute-energy, or calibration
claims.

Earth engine v68 MUST accept v67 state. A v67 lineage retaining exact R105 MAY
receive a migration-labelled R106 contract; a lineage missing exact R105 MUST
receive a permanent checkpoint and MUST NOT synthesize a host reference,
proposal, policy, receipt, key, signature, trust anchor, or acceptance state.
Native and migrated contracts and checkpoints MUST survive exact save and
restore. API v102 exposes the five R106 schemas, description, transient
builder, canonicalizer, verifier, and validators while preserving API v101.

R106 advances only provisioning-receipt signature integrity under a
caller-supplied unauthenticated host key. It MUST NOT verify a governed host
receipt, authenticate the host or signer, establish host authority, obtain
acceptance, install or persist a trust anchor, trust a policy, bind a verifier
key, resolve identity, prove independence, authenticate an observation, verify
provenance or physical meaning, admit evidence, identify or debit a historical
physical source owner, reconstruct history, mutate an owner, move heat, claim
absolute thermodynamic energy, resolve conduction, add geothermal forcing, or
claim scientific calibration. It does not authorize promotion or
canonization.

## Rung 107 provisioning-receipt signer-key binding request contract

Every fresh v69 loaded-land column retaining an exact valid R106 receipt-
signature-integrity contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request-contract-receipt/v1`.
It MUST embed and digest-bind exact R106, preserve all 28 routes, declare
exactly 24 signer-key-binding request routes, and preserve the four authority-
review exclusions. Eligible routes MUST declare
`authority.host-trust-anchor.provision.receipt.signer-key.bind.request.create`
as implemented. Actual signer-key binding,
`authority.host-trust-anchor.provision.receipt.verify`, and
`authority.host-trust-anchor.provision` MUST remain required but unavailable.
The contract MUST persist zero receipt envelopes, signature assessments,
request packets, requests, host-authority evidence, decisions, trusted key
bindings, verified receipts, acceptances, trust anchors, admissions, raw keys,
or signatures.

A transient request packet MUST be emitted only after the exact R106 verifier
returns a receipt-signature-integrity `PASS` for the exact proposal, caller-
supplied policy, named-world host projection, receipt envelope, signature
input, and evaluation time. The packet MUST bind exact R107 and R106 digests,
proposal and policy references, the claimed host world id, lineage, revision
and digest, receipt envelope and assessment digests, claimed seat and key id,
public-key and signature hashes, and evaluation time.

The packet MUST contain exactly 24 route-specific requests. Each request MUST
bind its exact inherited request binding, proposal and receipt ids, claimed
host reference, claimed signer-key id and hash, R106 assessment digest, and a
requested `HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER` role scoped to that
host revision, proposal, and receipt. It MUST contain an empty host-authority
evidence array and a null binding decision.

Request creation MUST NOT be treated as binding evidence. Signer-key binding,
receipt authority, full receipt verification, host identity, authority to
provision, host acceptance, trust-anchor installation, and admission verdicts
MUST remain `UNKNOWN` or `NOT_AUTHORIZED`. Actual authority, acceptance,
installation, persistence, and world mutation MUST remain false. Raw public
key and signature bytes MUST NOT appear in the packet.

System audit v57 MUST independently reconstruct R107's exact 28/24/4 routes
from attached R106, validate current-column and budget attachment, zero
persistent-artifact counts, emission mode, capability boundary, and bounded
truth, and reject capability substitution or false binding, authority,
verification, acceptance, installation, persistence, admission, resolution,
mutation, transfer, history, absolute-energy, or calibration claims.

Earth engine v69 MUST accept v68 state. A v68 lineage retaining exact R106 MAY
receive a migration-labelled R107 contract; a lineage missing exact R106 MUST
receive a permanent checkpoint and MUST NOT synthesize a host reference,
receipt, assessment, request, evidence, binding decision, authority, or trust
anchor. Native and migrated contracts and checkpoints MUST survive exact save
and restore. API v103 exposes the four R107 schemas, description, transient
request builder, and validator while preserving API v102.

R107 advances only signer-key-binding request routing after an exact R106
signature-integrity pass. It MUST NOT authenticate the host or signer, bind or
trust a host key, verify a governed receipt, establish authority, obtain
acceptance, install or persist a trust anchor, trust a policy, admit evidence,
identify or debit a historical physical source owner, reconstruct history,
mutate an owner, move heat, claim absolute thermodynamic energy, resolve
conduction, add geothermal forcing, or claim scientific calibration. It does
not authorize promotion or canonization.

## Rung 108 provisioning-receipt signer-key binding authority-decision integrity contract

Every fresh v70 loaded-land column retaining an exact valid R107 signer-key-
binding request contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity-contract-receipt/v1`.
It MUST embed and digest-bind exact R107, preserve all 28 routes, declare
exactly 24 binding-decision integrity routes, and preserve the four authority-
review exclusions. Eligible routes MUST declare
`authority.host-trust-anchor.provision.receipt.signer-key.binding-decision.signature.verify`
and
`authority.host-trust-anchor.provision.receipt.signer-key.binding-decision.revocation.verify`
as implemented. Actual signer-key binding,
`authority.host-trust-anchor.provision.receipt.verify`, and
`authority.host-trust-anchor.provision` MUST remain required but unavailable.

The persistent contract MUST contain zero request packets, caller-supplied
policy descriptors, decision envelopes, revocation snapshots, integrity
assessments, trusted signer-key bindings, verified receipts, acceptances,
trust anchors, admissions, raw keys, or signatures.

A transient caller-supplied policy descriptor MUST bind exact R108 and R107
packet digests, a bounded policy id and revision, one claimed review seat,
separate Ed25519 decision and revocation key identifiers and SHA-256 hashes,
and a validity window no longer than seven days. Each decision and revocation
artifact window MUST be positive, no longer than its declared maximum age,
and wholly inside the policy window. Both policy key hashes MUST differ from
each other and from the claimed provisioning-receipt signer-key hash.

A transient decision envelope MUST contain exactly 24 entries whose request
ids exactly cover the R107 request packet. Each entry MUST bind the request-
binding digest and exact requested host role, world id, lineage, revision,
world digest, proposal, receipt, key id, and key hash. An entry MAY record
`BIND`, `HOLD`, or `REJECT`, but every action MUST remain an untrusted claim.
Its fixed effects MUST say no binding, receipt verification, trust-anchor
installation, persistence, or world mutation occurred.

A transient revocation snapshot MAY name bounded, unique, sorted decision
digests, decision nonces, and receipt-signer public-key hashes. It MUST remain
an untrusted caller-policy claim. The transient signature input MUST accept
only separate 32-byte raw Ed25519 decision and revocation public keys plus two
64-byte detached signatures. Raw keys and signatures MUST NOT persist.

The verifier MUST canonicalize both signed artifacts, verify both signatures,
recompute all key and signature SHA-256 hashes, check policy-key equality,
exact source bindings, validity windows, policy-key separation from the
claimed receipt signer, and revocation by decision digest, decision nonce, or
receipt-signer key hash. A decision-and-revocation integrity `PASS` MUST mean
only integrity under the exact caller-supplied untrusted policy. It MUST NOT
authenticate host authority evidence, trust the policy, apply a requested
`BIND`, bind or trust the receipt signer, authorize or fully verify the
receipt, authenticate the host, establish authority to provision, accept the
proposal, install a trust anchor, or admit evidence. Those verdicts MUST
remain `UNKNOWN`, `UNTRUSTED_CALLER_SUPPLIED`, or `NOT_AUTHORIZED`.

System audit v58 MUST independently reconstruct R108's exact 28/24/4 routes
from attached R107, validate current-column and budget attachment, zero
persistent-artifact counts, emission mode, capability boundary, and bounded
truth, and reject capability substitution or false policy trust, authenticated
host evidence, binding, receipt verification, acceptance, installation,
persistence, admission, resolution, mutation, transfer, history, absolute-
energy, or calibration claims.

Earth engine v70 MUST accept v69 state. A v69 lineage retaining exact R107 MAY
receive a migration-labelled R108 contract; a lineage missing exact R107 MUST
receive a permanent checkpoint and MUST NOT synthesize a request packet,
policy, decision, revocation state, authority, binding, receipt verification,
or trust anchor. Native and migrated contracts and checkpoints MUST survive
exact save and restore. API v104 exposes the eight R108 schemas, description,
transient policy, decision and revocation builders, canonicalizers, verifier,
and validators while preserving API v103.

R108 advances only provisioning-receipt signer-key binding decision and
revocation signature integrity under a caller-supplied untrusted policy. It
MUST NOT authenticate host governance, bind or trust a host key, verify a
governed receipt, establish authority, obtain acceptance, install or persist
a trust anchor, admit evidence, identify or debit a historical physical
source owner, reconstruct history, mutate an owner, move heat, claim absolute
thermodynamic energy, resolve conduction, add geothermal forcing, or claim
scientific calibration. It does not authorize promotion or canonization.

## Rung 109 host-governance trust-root admission request contract

Every fresh v71 loaded-land column retaining an exact valid R108 binding-
decision integrity contract MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-admission-request-contract-receipt/v1`.
It MUST embed and digest-bind exact R108, preserve all 28 routes, declare
exactly 24 host-governance admission-request routes, and preserve the four
authority-review exclusions. Eligible routes MUST declare
`authority.host-governance.trust-root.admission.request.create` as
implemented. They MUST continue to declare all of the following as required
but unavailable:

- `authority.host-governance.trust-root.resolve`
- `authority.host-governance.policy-key.delegation.verify`
- `authority.host-governance.trust-root.admission.decide`
- `authority.host-trust-anchor.provision.receipt.signer-key.bind`
- `authority.host-trust-anchor.provision.receipt.verify`
- `authority.host-trust-anchor.provision`

The persistent contract MUST contain exactly seven unsatisfied evidence
requirements: host-controlled root-origin isolation; host identity and
governance-scope binding; decision-key delegation; revocation-key delegation;
current non-revoked delegation state; candidate receipt-signer key
separation; and host challenge plus replay-gated admission. Every requirement
MUST forbid caller-packet or candidate-key self-assertion. The trust root MUST
resolve from host-controlled out-of-band configuration, never from the
candidate request itself.

The persistent contract MUST contain zero request packets, host-governance
evidence items, resolved trust roots, verified delegations, admission
decisions, trusted signer-key bindings, verified receipts, acceptances, trust
anchors, raw keys, or signatures.

A transient request builder MUST require exact R109, R107 request-packet, R108
policy, decision, revocation, and integrity-assessment sources. The assessment
MUST structurally report an R108 integrity `PASS`, contain no issues, and
report at least one unapplied `BIND`. R109 MUST NOT claim that it reverified
R108 cryptography. Only exact `BIND` entries MAY be routed; `HOLD` and `REJECT`
entries MUST be excluded.

Each transient request MUST bind the exact source digests, claimed world,
lineage, host revision and world digest, claimed governance domain, untrusted
decision and revocation policy-key hashes, claimed receipt-signer key hash,
and a distinct challenge nonce. Its lifetime MUST be positive, no longer than
15 minutes, begin no earlier than the R108 assessment, and end before the
policy, decision, and revocation windows expire. The challenge MUST differ
from the decision and revocation nonces, require an answer under a host-
resolved root, require replay-ledger consumption, and remain unconsumed.

Request creation MUST NOT accept a trust-root key or hash from the caller,
resolve or trust a root, authenticate a host, verify either policy-key
delegation, decide or authorize admission, apply a signer-key binding, verify
a governed receipt, establish authority to provision, accept a proposal,
install a trust anchor, persist transient material, admit evidence, or mutate
the world. Those verdicts MUST remain `UNKNOWN`,
`UNTRUSTED_CALLER_SUPPLIED`, `REPORTED_PASS_UNTRUSTED`, or
`NOT_AUTHORIZED`.

System audit v58 MUST additionally reconstruct R109's exact 28/24/4 routes
and seven evidence requirements from attached R108, validate current-column
and budget attachment, zero persistent-artifact counts, emission mode,
capability boundary, and bounded truth, and reject circular self-trust,
capability substitution, or false root resolution, delegation, admission,
binding, receipt verification, provisioning, persistence, resolution,
mutation, transfer, history, absolute-energy, or calibration claims.

Earth engine v71 MUST accept v70 state. A v70 lineage retaining exact R108 MAY
receive a migration-labelled R109 contract; a lineage missing exact R108 MUST
receive a permanent checkpoint and MUST NOT synthesize a root, delegation,
admission decision, binding, receipt verification, or trust anchor. The v69
R108 migration path and older retained compatibility schemas MUST remain
available. Native and migrated contracts and checkpoints MUST survive exact
save and restore. API v105 exposes the five R109 schemas, description,
transient request builder, and validators while preserving API v104.

R109 advances only non-circular host-governance admission-request routing. It
MUST NOT claim authenticated host governance, bind or trust a host key, verify
a governed receipt, establish authority, obtain acceptance, install or
persist a trust anchor, admit evidence, identify or debit a historical
physical source owner, reconstruct history, mutate an owner, move heat, claim
absolute thermodynamic energy, resolve conduction, add geothermal forcing,
or claim scientific calibration. It does not authorize promotion or
canonization.

## Rung 110: fail-closed host-governance trust-root resolution preflight

Every land column retaining exact R109 MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight-contract-receipt/v1`.
It MUST digest-bind the exact attached R109 schema and receipt digest, preserve
the exact 28/24/4 route projection, and declare
`authority.host-governance.trust-root.resolution.preflight` as implemented on
the 24 eligible routes. `authority.host-governance.trust-root.resolve` and the
five downstream authority capabilities MUST remain required and unavailable.

The contract MUST declare one host-registry boundary whose origin is
`HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION`. That boundary MUST remain
`NOT_CONFIGURED`, have no registry identifier or version, contain zero trust
roots, forbid candidate-request registry or root input, forbid persistence in
Foundation world state, and retain origin authentication as `UNKNOWN`.

The contract MUST retain only the exact R109 schema and digest plus its route
projection. It MUST NOT recursively duplicate the complete R109 lineage. The
independent column audit MUST bind that compact reference and projection back
to the attached R109 contract before reporting `PASS`.

A transient preflight builder MUST accept only exact R110 and structurally
valid R109 sources plus a preflight identifier and evaluation timestamp. The
timestamp MUST fall inside the R109 request window. Registry objects, root
keys, root hashes, signatures, and caller assertions MUST NOT be accepted as
input.

With no configured registry, preflight MUST return
`BLOCKED_HOST_TRUST_ROOT_REGISTRY_NOT_CONFIGURED`, report
`PASS_FAIL_CLOSED` for the preflight itself,
`FAIL_NOT_CONFIGURED` for registry availability, `UNKNOWN` for root,
identity, delegation, binding, receipt, and provisioning verdicts, and
`NOT_AUTHORIZED` for admission. It MUST identify the required host action as
configuration and authentication of an out-of-band registry under
`authority.host-governance.trust-root.resolve`, with
`candidateMaySatisfy: false` and `performed: false`.

The builder and validators MUST reject request-side registry or root
injection, evaluation outside the R109 window, and re-digested fictional
registry configuration or resolution `PASS` claims. They MUST create no root,
delegation, admission, binding, verified receipt, trust anchor, persistence,
or world mutation.

System audit v59 MUST independently reconstruct the R110 route projection,
registry boundary, compact R109 binding, emission mode, budget attachment,
and bounded truth. Earth engine v72 MUST accept v71 state. A v71 lineage
retaining exact R109 MAY receive a migration-labelled R110 contract; a lineage
missing R109 MUST receive a permanent checkpoint. Native and migrated
contracts and checkpoints MUST survive exact save and restore. API v106
exposes the four R110 schemas, description, transient preflight builder, and
validators while preserving API v105.

R110 closes only the typed fail-closed preflight capability. It does not
configure or authenticate a host registry, resolve or trust a root, verify
delegations, authenticate host identity, decide admission, bind a key, verify
a governed receipt, provision a trust anchor, identify or debit a historical
physical source owner, or establish scientific authority. It does not
authorize promotion or canonization.

## Rung 111: host trust-root registry configuration request routing

Every land column retaining exact R110 MUST retain one
`axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request-contract-receipt/v1`.
It MUST digest-bind the exact attached R110 schema and receipt digest, preserve
the exact 28/24/4 route projection, and declare only
`authority.host-governance.trust-root.registry.configuration.request.create`
as implemented on the 24 eligible routes.

R111 MUST split actual host registry configuration from trust-root resolution.
The 24 eligible routes MUST require
`authority.host-governance.trust-root.registry.configure` before
`authority.host-governance.trust-root.resolve`. Both MUST remain
unavailable, together with policy-key delegation verification, admission,
signer-key binding, governed receipt verification, and trust-anchor
provisioning. Surfacing the configure capability MUST NOT be represented as
configuration having occurred.

The compact persistent contract MUST retain only the exact R110 schema and
digest plus its route projection. It MUST declare exactly four unsatisfied
host-only configuration requirements: an authenticated registry identifier
and version; host-governance domain, world, and lineage binding; an
authenticated trust-root identifier and verification-material set; and
registry revocation/version policy with effective time. Every requirement
MUST accept only `HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION`, MUST forbid
caller-packet or candidate-key self-assertion, and MUST retain
`candidateMaySatisfy: false`, `provided: false`, and verdict `UNKNOWN`.

A transient request builder MUST require the exact R111 contract, exact R110
contract and fail-closed preflight packet, and exact R109 admission-request
packet. Its input surface MUST contain only a configuration-request
identifier, request time, and expiry. The request time MUST be at or after the
R110 evaluation. The expiry MUST be later than the request time, no more than
15 minutes later, and no later than the R109 expiry.

A valid transient request MUST report
`HOST_REGISTRY_CONFIGURATION_REQUEST_CREATED_NOT_TRANSMITTED`. It MUST name
`authority.host-governance.trust-root.registry.configure`, carry the four
unmet host-only requirements, and retain null registry identifier, null
registry version, zero configured roots, `candidateMaySatisfy: false`, and
`performed: false`. Delivery MUST remain
`NOT_TRANSMITTED_NO_HOST_CONFIGURATION_ENDPOINT` with null endpoint and null
transport receipt. Recipient identity authentication and all registry,
root-resolution, delegation, binding, receipt, and provisioning verdicts
MUST remain `UNKNOWN`; admission MUST remain `NOT_AUTHORIZED`.

The builder and producer validator MUST reject caller-supplied registry, root,
endpoint, transport, or extra input; request windows beyond exact R109; and
re-digested fictional transmission or configuration claims. A separate packet
audit MUST independently reconstruct the request from exact R111/R110/R109
sources and reject the same authority inflation. Request creation MUST create
no endpoint, perform no transport, configure no registry, add no root, grant
no authority, persist no transient artifact, and mutate no world state.

System audit v60 MUST independently reconstruct the compact R111 route
projection, four requirements, R110 binding, emission mode, budget attachment,
capability separation, and bounded truth. Earth engine v73 MUST accept v72
state. A v72 lineage retaining exact R110 MAY receive a migration-labelled
R111 contract; a lineage missing exact R110 MUST receive a permanent
checkpoint. Native and migrated contracts and checkpoints MUST survive exact
save and restore. API v107 exposes the four R111 schemas, description,
transient request builder, and validators while preserving API v106.

R111 closes only transient, untransmitted host registry configuration-request
creation. It does not discover a host endpoint, transmit or deliver a request,
authenticate a recipient or registry origin, configure a registry, resolve or
trust a root, verify delegations, decide admission, bind a key, verify a
governed receipt, provision a trust anchor, identify or debit a historical
physical source owner, establish scientific authority, promote, or canonize.

## Rung 112: host registry configuration-response signature integrity

Loaded land columns MUST carry
`axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity-contract-receipt/v1`.
The receipt MUST bind the exact R111 request contract by schema and digest,
preserve all 28 routes, retain 24 eligible response-integrity routes, and keep
the same four authority routes excluded. Its only newly implemented capability
MUST be
`integrity.host-governance.trust-root.registry.configuration.response.signature.verify`.
Every eligible route MUST continue to require the distinct, unavailable
`authority.host-governance.trust-root.registry.configure` capability.

The persistent contract MAY declare response-envelope validation and detached
Ed25519 verification using a caller-supplied 32-byte raw public key and 64-byte
signature. It MUST NOT declare that the supplied key is trusted, that a claimed
responder identity is authenticated, or that a registry is configured. It MUST
persist no response envelope, key bytes, signature bytes, assessment, raw trust
root keys, raw policy keys, or replay ledger.

A transient response builder MUST require the exact R112 contract and exact
R111 request packet. Its bounded input MUST include only a response identifier,
claimed responder and signer identifiers, a claimed production time, and a
configuration descriptor. The descriptor MUST be labelled
`CALLER_SUPPLIED_UNAUTHENTICATED_HOST_CONFIGURATION`; MUST preserve the exact
R111 governance domain, world, and lineage; MUST remain inside the exact R111
request window; and MAY carry only a registry identifier/version, one to 32
unique trust-root identifiers with SHA-256 verification-material commitments,
a revocation-state identifier, and an effective time. It MUST reject extra
authority, endpoint, transport, configured-registry, raw-key, or mutation fields.

Canonical response text MUST be the JSON representation of a structurally valid,
digest-valid envelope. Detached verification MUST bind the exact R112 contract,
R111 request digest, response envelope digest, supplied key, and signature. A
valid result MUST report
`REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY`;
an invalid result MUST report
`REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INVALID`. In both cases, signer-key
trust, responder identity trust, registry configuration, registry-origin
authentication, root resolution, and delegation MUST remain `UNKNOWN`, and
admission MUST remain `NOT_AUTHORIZED`. A signature `PASS` proves only that the
canonical bytes match the supplied key.

A separate transient audit MUST independently repeat Ed25519 verification and
compare the assessment's source bindings, key/signature hashes, cryptographic
verdict, issues, and non-authority truth. Producer and audit coverage MUST reject
signature tampering, response substitution, valid-request substitution, scope
drift, authority-field injection, and out-of-window responses without mutating
world state.

System audit v61 MUST independently reconstruct the compact R112 route
projection, exact R111 binding, capability boundary, emission mode, budget
attachment, and bounded truth. Earth engine v74 MUST accept v73 state. A v73
lineage retaining exact R111 MAY receive a migration-labelled R112 contract; a
lineage missing exact R111 MUST receive a permanent checkpoint. Native and
migrated contracts and checkpoints MUST survive exact save and restore. API v108
exposes the five R112 schemas, description, transient envelope construction,
canonicalization, validators, and signature verification while preserving v107.

R112 closes only caller-key response signature integrity. It does not discover
or authenticate a host endpoint, transport a request or response, bind a trusted
host signer key, authenticate a responder or registry origin, configure a
registry, resolve or trust a root, verify delegation, decide admission, bind a
receipt signer key, verify a governed receipt, provision a trust anchor,
identify or debit historical physical source owners, establish scientific
authority, promote, or canonize.

## R113 response signer-key binding request routing

The persistent R113 contract MUST bind the exact R112 contract schema and
digest. It MUST preserve the exact ordered R112 route projection through a
digest plus counts of 28 total routes, 24 eligible routes, and four excluded
authority-review routes. Request creation MUST be represented by
`authority.host-governance.trust-root.registry.configuration.response.signer-key.bind.request.create`.
Actual host binding MUST remain the distinct required capability
`authority.host-governance.trust-root.registry.configuration.response.signer-key.bind`.

A transient R113 packet MUST require the exact R113 contract, R112 contract,
R111 request packet, R112 response envelope, and a structurally valid R112
assessment whose detached signature verdict is `PASS`. That source verdict
MUST be reported as `REPORTED_PASS_UNTRUSTED`; it MUST NOT be upgraded to key
trust or responder authority. The request MAY carry the assessed public-key
SHA-256 commitment and the claimed responder/governance scope. It MUST NOT
carry raw public-key or signature bytes, claim a binding endpoint, transmit,
persist, bind a key, configure a registry, or mutate world state. Its request
window MUST begin no earlier than the claimed response production time, end no
later than the exact R111 expiry, and last no more than fifteen minutes.

An independent contract audit MUST recompute the exact source projection and
capability boundary. An independent packet audit MUST compare every source
digest, the untrusted source verdict, key commitment, claimed scope, bounded
time window, absent transport, and non-authority truth. Coverage MUST reject
assessment/source substitution, key-hash drift, raw-key injection, fictional
delivery/binding/configuration, and overlong or out-of-source request windows.

System audit v62 MUST include the R113 contract check. Earth engine v75 MUST
accept v74 state. A v74 lineage retaining exact R112 MAY receive a
migration-labelled R113 contract; a lineage missing exact R112 MUST receive a
permanent checkpoint. Native and migrated contracts and checkpoints MUST
survive exact save and restore. API v109 exposes the three R113 schemas,
description, validators, and transient request construction while preserving
v108.

R113 closes only request creation for a response signer-key binding review. It
does not bind or trust the response signer key, authenticate the responder or
registry origin, configure a registry, resolve a root, verify delegation,
decide admission, bind a provisioning-receipt signer key, verify a governed
receipt, provision a trust anchor, identify or debit historical physical source
owners, establish scientific authority, promote, or canonize.

## R114 transient response signer-key binding-decision integrity

R114 MUST create its compact contract projection only from the exact attached
R113 response signer-key binding-request contract. The projection MUST bind the
R113 schema and digest, preserve digest-bound counts of 28 total routes, 24
eligible routes, and four authority-review exclusions, and name only these new
implemented capabilities:

- `integrity.host-governance.trust-root.registry.configuration.response.signer-key.binding-decision.signature.verify`
- `integrity.host-governance.trust-root.registry.configuration.response.signer-key.binding-decision.revocation.verify`

The R114 contract, caller policy, decision, revocation snapshot, signature
input, and assessment MUST remain transient. They MUST NOT be added to Earth
state, budget state, migration state, or the persistent system audit. Earth
engine v75 and system audit v62 MUST remain the current persistent schemas, and
there MUST be no v75-to-v76 migration for R114.

A caller-supplied policy MUST bind the exact R114 contract and R113 request,
carry distinct decision and revocation key identifiers plus SHA-256 public-key
commitments, and define bounded validity and freshness limits. It MUST remain
labelled untrusted; policy-key delegation, host authority evidence, and review-
seat authority MUST remain unverified.

A decision envelope MUST bind the exact R113 requested signer-key commitment
and governance scope, carry exactly one `BIND`, `HOLD`, or `REJECT` action, and
remain inside both the caller-policy validity and exact R113 request window. A
revocation snapshot MUST bind the same policy and may revoke the exact decision
digest. Canonical detached Ed25519 verification MUST use caller-supplied raw
32-byte public keys and 64-byte signatures, compare each raw key to its declared
SHA-256 commitment, and fail closed on signature, digest, scope, time, or
revocation mismatch.

A cryptographic `PASS` MUST mean only that the canonical decision and
revocation bytes match the supplied keys and that the decision is not revoked.
It MUST NOT establish policy delegation, review-seat authority, signer-key
trust, responder identity, registry origin, actual signer-key binding, registry
configuration, root resolution, or admission. Admission MUST remain
`NOT_AUTHORIZED`; requested binding and registry effects MUST remain false; no
world mutation may occur; and raw keys and signatures MUST NOT be retained in
the assessment.

A separate transient audit MUST independently recompute the compact contract
projection and compare all assessment source references and non-authority
verdicts. Coverage MUST reject a re-digested projection substitution, tampered
decision signature, validly signed revocation, exact-request binding drift,
out-of-window decisions, and re-digested fictional delegation, binding, or
registry effects. API v110 MUST derive the transient R114 projection from the
currently attached R113 contract and expose the policy, decision, revocation,
canonicalization, and verification operations while preserving API v109.

R114 closes only decision and revocation signature integrity under explicitly
untrusted caller keys. It does not verify policy delegation, bind or trust the
response signer key, authenticate a responder or registry origin, configure a
registry, resolve a root, decide admission, verify a governed receipt,
provision a trust anchor, identify or debit historical physical source owners,
establish scientific authority, promote, or canonize.

## R115 transient policy-key delegation-verification request preflight

R115 MUST derive its compact contract only from the exact transient R114
decision-integrity contract and exact persistent R113 response signer-key
binding-request contract. It MUST bind both source schemas and digests,
preserve digest-bound counts of 28 total routes, 24 eligible routes, and four
authority-review exclusions, and declare only
`contract.host-governance.policy-key.delegation.verification.request.create`
as newly implemented.

Request creation MUST require an exact R114 assessment whose detached decision
and revocation integrity verdict is `PASS`, whose issue list is empty, and
whose requested action is an unapplied `BIND`. The packet MUST bind the exact
R115 contract, R114 contract, R113 packet, caller policy, decision envelope,
revocation snapshot, and R114 assessment. It MUST preserve the exact R113
signer-key commitment and governance scope and the policy's decision and
revocation key identifiers and SHA-256 commitments.

The packet MUST contain exactly two delegation-verification entries and six
host-only evidence requirements covering authenticated registry
configuration, current trust-root resolution, both delegation chains,
revocation/validity, and the exact R113 binding scope. It MUST carry a unique,
unconsumed replay-ledger challenge. Its window MUST begin no earlier than the
R114 evaluation and end no later than every R113, policy, decision, and
revocation source expiry; it MUST last no more than five minutes.

R115 MUST remain `CREATED_NOT_TRANSMITTED`. An endpoint, transport receipt,
recipient authentication, raw public-key bytes, signature bytes, satisfied
host evidence, verified delegation, configured registry, resolved trust root,
authorized admission, applied signer-key binding, persistence, and world
mutation MUST all remain absent or false. An R114 cryptographic pass MUST be
reported only as integrity under an untrusted caller policy and MUST NOT be
upgraded to authority.

A separate transient audit MUST independently reconstruct both contract and
packet. Coverage MUST reject re-digested capability/truth projection drift,
scope substitution, fictional delegation or binding, failed or revoked R114
assessments, out-of-source expiry, invented delivery, and raw-key injection.
Earth engine v75 and system audit v62 MUST remain unchanged; R115 MUST add no
migration. API v111 MUST expose the five R115 schemas, description, and
transient builder while preserving API v110.

R115 closes only fail-closed construction of an exact-source-bound policy-key
delegation-verification request. It does not transmit the request,
authenticate a host endpoint or trust root, verify delegation, decide
admission, bind or trust the response signer key, configure a registry,
identify or debit historical physical source owners, establish scientific
authority, promote, or canonize.

## R116 transient delegation-verification response signature integrity

R116 MUST derive its compact contract only from the exact transient R115,
R114, and persistent R113 contracts. It MUST bind all three source schemas and
digests, preserve digest-bound counts of 28 total routes, 24 eligible routes,
and four authority-review exclusions, and declare only
`integrity.host-governance.policy-key.delegation.verification.response.signature.verify`
as newly implemented.

A caller-supplied response MUST bind the exact R116 contract and R115 request,
remain inside the exact R115 time window, echo the exact request challenge, and
carry a distinct response nonce. It MUST contain exactly two result claims
whose request-entry identifiers, key roles, key identifiers, SHA-256 key
commitments, and delegated scopes match the exact R115 entries. Each result
MAY report `CLAIMED_VERIFIED`, `CLAIMED_REJECTED`, or `CLAIMED_UNKNOWN` plus a
claimed chain digest, trust-root identifier, and registry version. Those values
MUST remain explicitly caller-supplied and unauthenticated.

The response MUST NOT prove that the R115 request was transmitted, that the
response arrived through transport, that the response signer is trusted, that
the challenge was answered by a host-resolved trust root, or that replay
protection occurred. It MUST contain no transport receipt or replay-ledger
receipt and MUST apply no authority effect.

Canonical detached Ed25519 verification MUST accept only a raw 32-byte public
key and 64-byte signature and MUST report SHA-256 commitments rather than retain
the raw values. A cryptographic `PASS` MUST mean only that the canonical
response bytes match the caller-supplied key. Even signed
`CLAIMED_VERIFIED` results MUST leave registry configuration, root resolution,
policy-key delegation verification, and signer-key binding `UNKNOWN`, and
admission MUST remain `NOT_AUTHORIZED`.

A separate transient audit MUST independently reconstruct the R116 contract
and response envelope, repeat Ed25519 verification from the raw one-use input,
and compare the entire assessment. Coverage MUST reject re-digested
capability/truth projection drift, tampered signatures, exact-scope or challenge
substitution, raw-key injection, out-of-window responses, and fabricated
delegation or admission effects.

R116 MUST add no Earth state, persistent system-audit field, migration,
persistence, or world mutation. Earth engine v75 and system audit v62 MUST
remain unchanged. API v112 MUST expose the six R116 schemas, description,
response construction, canonicalization, and signature verification while
preserving API v111.

R116 closes only detached signature integrity for exact-source-bound,
caller-supplied delegation-verification response claims. It does not prove
transport, authenticate a signer or challenge, verify replay protection or
delegation, decide admission, bind the response signer key, identify or debit
historical physical source owners, establish scientific authority, promote,
or canonize.

## R117 transient delegation-verification response signer-key binding request

R117 MUST derive its compact transient contract only from the exact R116,
R115, R114, and R113 contracts. It MUST bind all four source schemas and
digests, preserve digest-bound counts of 28 total routes, 24 eligible routes,
and four authority-review exclusions, and declare only
`contract.host-governance.policy-key.delegation.verification.response.signer-key.binding.request.create`
as newly implemented.

The transient request MUST bind the exact R117 contract, exact R115 request,
exact R116 response envelope, and exact valid R116 signature assessment. It
MUST carry only the assessed response public-key SHA-256 commitment, the exact
response-envelope digest, the claimed response signer identity, and the exact
R115 governance domain, world, and lineage. The source signature verdict MUST
remain `REPORTED_PASS_UNTRUSTED`; signed `CLAIMED_VERIFIED` results MUST NOT be
accepted as delegation authority.

The request MUST remain inside the exact R115 request window and MUST be
`NOT_TRANSMITTED` with no endpoint, transport receipt, raw public key,
signature bytes, trusted responder, actual signer-key binding, registry
configuration, trust-root resolution, policy-key delegation verification, or
admission effect. Actual
`authority.host-governance.policy-key.delegation.verification.response.signer-key.bind`
MUST remain a separate missing host capability.

A separate transient audit MUST independently reconstruct the entire R117
contract and request packet. Coverage MUST reject failed R116 assessments,
response or source substitution, signer-key commitment or governance-scope
drift, raw-key injection, fabricated delivery, binding, delegation, or
admission, and expiry outside the exact R115 window.

R117 MUST add no Earth state, persistent system-audit field, migration,
persistence, or world mutation. Earth engine v75 and system audit v62 MUST
remain unchanged. API v113 MUST expose the three R117 schemas, description,
and transient request builder while preserving API v112.

R117 closes only fail-closed construction of an exact-response-bound signer-key
binding request. It does not transmit the request, authenticate an endpoint or
signer, configure or authenticate a registry, resolve a trust root, verify
policy delegation, decide admission, perform binding, identify or debit
historical physical source owners, establish scientific authority, promote,
or canonize.

## R118 transient delegation-response signer-key binding-decision integrity

R118 MUST derive its compact contract from the exact R117 request contract and
MUST validate that contract against the exact R116, R115, R114, and R113
contract chain. It MUST preserve digest-bound counts of 28 total routes, 24
eligible routes, and four authority-review exclusions. It MUST declare only
these two integrity capabilities as newly implemented:

- `integrity.host-governance.policy-key.delegation.verification.response.signer-key.binding-decision.signature.verify`
- `integrity.host-governance.policy-key.delegation.verification.response.signer-key.binding-decision.revocation.verify`

The R118 policy descriptor MUST remain caller-supplied and untrusted. It MAY
name separate Ed25519 decision and revocation keys by identifier and SHA-256
commitment, one claimed review seat, and bounded policy, decision, and
revocation windows. The raw keys and signatures MUST be transient verification
inputs only.

Each decision envelope MUST bind the exact R117 request packet, its exact
requested signer-key commitment and governance scope, the R118 contract and
policy, and one non-applying `BIND`, `HOLD`, or `REJECT` claim. Each revocation
snapshot MUST be sorted, unique, bounded, and capable of naming revoked
decision digests, decision nonces, or claimed response-signer key commitments.

The verifier MUST check the exact policy, decision, revocation, and request
digests; Ed25519 decision and revocation signatures; key commitments; current
windows; authority-key separation from the requested response-signer key; and
revocation. A passing integrity assessment MUST mean only that the detached
signatures match the keys supplied by the untrusted caller policy. It MUST NOT
authenticate that policy, its delegation, the host, the review seat, or the
requested signer.

The assessment MUST retain only SHA-256 key/signature commitments and canonical
text lengths. It MUST set binding, registry configuration, trust-root
resolution, admission, persistence, and world mutation to absent, `UNKNOWN`, or
`NOT_AUTHORIZED` as applicable. A requested `BIND` action MUST NOT apply a
binding.

A separate audit MUST independently reconstruct the complete R118 contract and
MUST bind the assessment to the exact R118/R117 policy, decision, and revocation
inputs. Coverage MUST include valid signatures, a tampered decision signature,
a validly signed exact-decision revocation, fabricated binding/delegation/
registry effects, request key/scope drift, and expiry outside the exact R117
window.

R118 MUST add no Earth state, persistent system-audit field, migration,
persistence, or world mutation. Earth engine v75 and system audit v62 MUST
remain unchanged. API v114 MUST expose the seven R118 schemas, description, and
transient integrity operations while preserving API v113.

R118 does not bind or trust the response signer key, authenticate a responder,
registry, review seat, or policy, configure a registry, resolve a trust root,
verify policy delegation, decide admission, identify or debit historical
physical source owners, establish scientific authority, promote, or canonize.

## R119 anti-recursion trust-bootstrap closure preflight

R119 MUST derive a transient compact contract only from the exact R110 through
R118 contract custody chain. The validator and independent audit MUST validate
each adjacent source binding through the complete chain and preserve 28 total
routes, 24 eligible routes, and four authority-review exclusions. The only new
capability MUST be
`analysis.host-governance.trust-bootstrap.recursion.detect`.

The recursion witness MUST contain exactly five ordered stages, R114 through
R118. It MUST show that the first caller-supplied binding-policy decision
requires `authority.host-governance.policy-key.delegation.verify`, R115 requests
that capability, R116 checks only an untrusted response signature, R117 asks
for that response signer's key to be bound, and R118 returns to another
caller-supplied policy decision that again requires delegation verification.
It MUST characterize this as a recursive untrusted authority dependency and
MUST NOT assert a literal artifact-graph cycle or an independently anchored
authority outcome.

The closure preflight MUST remain
`BLOCKED_RECURSIVE_UNTRUSTED_AUTHORITY_DEPENDENCY`. It MUST list exactly six
missing host-owned capabilities: registry configuration, trust-root
resolution, registry-response signer-key binding, policy-key delegation
verification, delegation-response signer-key binding, and host-governance
admission decision. It MUST pair them with host-issued evidence boundaries
covering registry/root custody, allowed and denied resolution probes, both
signer bindings, a root-and-policy-bound delegation decision, and the final
admission decision.

R119 MUST prohibit automatically creating another caller-policy decision,
treating signature integrity as authority, treating request creation as host
execution, or persisting transient authority artifacts. No R119 artifact MAY
discover an endpoint, perform transport, bind a signer, configure a registry,
resolve a root, verify delegation, decide admission, identify or debit a
historical physical source owner, persist state, or mutate the world.

Coverage MUST reject re-digested source substitution, missing custody and
recursion stages, fabricated `READY` closure or authority, exact-capability
substitution, and injected endpoint, transport, or binding effects. The audit
MUST reconstruct the contract, witness, and preflight independently from the
exact sources. Earth engine v75 and system audit v62 MUST remain unchanged;
R119 MUST add no migration. API v115 MUST expose the three transient analytical
schemas while preserving v114. R119 remains `EXPERIMENTAL`, and only Mike Tobi
may commit, merge, promote, or declare it `CANON`.

## R120 historical owner/debit admission-readiness preflight

R120 MUST derive a transient contract only from the exact valid R100
historical-source artifact-integrity contract and the exact valid R119
anti-recursion contract, witness, closure preflight, and R110-through-R118
source chain. Its only new capability MUST be
`analysis.foundation-planet.matrix-thermal.historical-source-owner-debit.admission.readiness.evaluate`.

The readiness matrix MUST preserve all 28 R100 routes, including the exact
request binding on each route. It MUST retain 24 evidence routes and four
Mike-Tobi-or-AXM physical-meaning authority-review routes. Byte-integrity
checking MAY be marked implemented only for the 24 evidence routes. Every route
MUST report no observed integrity receipt, no authenticated observation, no
verified provenance, no physical-meaning decision, no trust-bootstrap closure,
no resolved historical source owner, no verified historical debit, and
`NOT_AUTHORIZED` admission.

The closure report MUST remain
`BLOCKED_MISSING_EXTERNAL_EVIDENCE_AND_HOST_AUTHORITY`. It MUST list exactly the
nine historical-source capability IDs from R98 and the six host-owned authority
capability IDs from R119. It MUST group all 28 route requirements by historical
capability and state native proof surfaces for persistence, static structure,
transport, and taste-or-meaning claims. It MUST preserve R119's six external
host-evidence boundaries.

R120 MUST prohibit treating a digest match as evidence verification, accepting
candidate self-attestation, recursively self-authorizing host policy, treating
a locally created request as host execution, inferring an owner or debit across
routes, or mutating owners or the world. The producer validator and independent
audit MUST reject re-digested source substitution, missing or substituted
routes/capabilities, fabricated evidence or admission, and injected owner,
debit, endpoint, transport, persistence, or mutation effects.

R120 MUST add no Earth state, system-audit field, migration, persistence,
transport, owner/debit mutation, or admission. Earth engine v75 and system audit
v62 MUST remain unchanged. API v116 MUST expose the three transient analytical
schemas while preserving v115. Manifest v0.120.0 MUST use Earth-system
descriptor V83. R120 remains `EXPERIMENTAL`, and only Mike Tobi may commit,
merge, promote, or declare it `CANON`.

## R121 external capability specification bundle

R121 MUST derive a transient specification contract and bundle only from the
exact valid R120 contract, matrix, and blocked preflight together with their
exact R100 and R119 sources. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.specification.create`.

The bundle MUST contain exactly fifteen specifications in the exact R120
capability order: eight independent historical-evidence providers, one Mike
Tobi or AXM physical-meaning review provider, and six host-governance authority
providers. The historical specifications MUST cover all 28 R120 routes and
bind every route's exact request-binding digest. Host specifications MUST bind
the exact R119 evidence IDs and acceptance boundaries.

Every specification MUST declare inputs, a neutral result-envelope contract,
expected artifacts, native proof surfaces, side effects, permissions and
consent, resource-budget requirements, failure and recovery behavior,
compatibility, independent verification, and Mike's promotion gate. Native
provider receipt schemas MUST remain null and
`EXTERNAL_PROVIDER_MUST_DECLARE`; results MUST remain
`UNTRUSTED_PENDING_INDEPENDENT_VALIDATION` until that external contract and its
native evidence exist.

Every provider lifecycle MUST remain `SPEC_REQUIRED` with installed,
available, promoted, and canon flags false. A specification MUST NOT be treated
as a provider, invent a native receipt schema, accept self-attestation, treat a
result envelope as authority, execute without declared budgets and permissions,
partially apply a result, or mutate the Foundation or canon.

Producer validation and independent reconstruction MUST reject source
substitution, missing specifications, capability or route-binding drift,
invented native schemas, weakened permission/failure/promotion boundaries,
fabricated provider availability, and injected endpoint, transport,
persistence, owner, debit, or admission effects.

R121 MUST add no Earth state, system-audit field, migration, endpoint,
transport, provider execution, persistence, owner/debit mutation, or admission.
Earth engine v75 and system audit v62 MUST remain unchanged. API v117 MUST
expose four transient R121 schemas while preserving v116. Manifest v0.121.0
MUST use Earth-system descriptor V84. R121 remains `EXPERIMENTAL`, and only
Mike Tobi may commit, merge, promote, or declare it `CANON`.

## R122 external capability provider-binding preflight

R122 MUST derive its transient contract and report only from the exact valid
R121 specification contract, specification bundle, and their exact source
custody. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-binding.preflight`.
Contract creation MUST validate that full custody. Each declaration assessment
MUST thereafter bind the exact R122 contract and the standalone-valid,
cross-digest-linked R121 contract and bundle rather than repeatedly replaying
the full historical source chain.

The contract MUST accept at most 30 caller-supplied declaration records and
at most 262,144 serialized bytes. Each declaration MUST remain
`CALLER_SUPPLIED_UNTRUSTED` and MUST bind one exact R121 capability,
specification ordinal, specification capability ID, and independently
recomputed specification digest.

A declaration MUST include a bounded provider ID and version, exact provider
class, a distinct versioned native receipt-schema identifier, the R121 result
envelope, the expected entrypoint kind, no Foundation write request, the exact
authority seat, fail-closed recovery, bounded runtime and input/output bytes,
an independent verifier ID, required identity probes, and missing live
availability and authorization or consent receipts. It MUST NOT claim that
the provider is installed, available, promoted, or canon.

Malformed declarations and schema, capability, specification, class,
entrypoint, permission, budget, recovery, verification, or lifecycle
substitutions MUST be rejected. More than one structurally compatible
declaration for a capability MUST be reported as ambiguous. An exact
structural match MUST be labelled `CONTRACT_COMPATIBLE_UNVERIFIED` and MUST
remain operationally `BLOCKED`.

The current built-in declaration inventory MUST be empty and the current
report MUST therefore leave all fifteen bindings missing. No declaration or
preflight result may establish provider identity, installation, availability,
native-schema validity, authority, consent, authenticated evidence, owner or
debit closure, or admission.

Producer validation and a separate reconstruction audit MUST bind the exact
input digest, independently reconstruct every declaration assessment and all
fifteen binding rows, and reject injected endpoint, transport, execution,
persistence, owner, debit, admission, promotion, canon, or world-mutation
claims.

R122 MUST add no Earth state, system-audit field, migration, provider
discovery, endpoint resolution, transport, provider execution, persistence,
owner/debit mutation, or admission. Earth engine v75 and system audit v62 MUST
remain unchanged. API v118 MUST expose four transient R122 schemas while
preserving v117. Manifest v0.122.0 MUST use Earth-system descriptor V85. R122
remains `EXPERIMENTAL`, and only Mike Tobi may commit, merge, promote, or
declare it `CANON`.

## R123 provider-verification request handoff

R123 MUST derive its transient request contract and batch only from an exact
valid R122 contract, preflight, declaration array, binding source, and full
custody. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.request.create`.

Only bindings with R122 status `CONTRACT_COMPATIBLE_UNVERIFIED` may produce
a request. Missing, rejected, and ambiguous bindings MUST remain represented
in batch counts but MUST produce no packet. The real built-in empty
declaration inventory MUST produce an empty batch without request identifiers
or a fabricated requester.

Each eligible packet MUST bind the exact R123 contract, R122 preflight,
capability ID, binding ordinal and digest, declaration index and digest,
claimed provider ID, class, version, and caller-declared unverified native
receipt schema. It MUST use a bounded request window no longer than 300,000
milliseconds and a caller-supplied request-batch and requester identifier.
At most fifteen packets and 524,288 serialized batch bytes are allowed.

Every packet MUST carry exactly four proof requirements:

1. independent provider-identity binding;
2. a bounded live challenge with matched sender and receiver receipts;
3. an independently obtained native schema plus validator and held-out
   positive and adversarial fixtures;
4. an exact, unrevoked authority or consent receipt from the required seat.

The request recipient MUST remain `UNRESOLVED`; endpoint and recipient
identity MUST remain null. The missing resolver capability MUST be declared as
`transport.foundation-planet.external-provider-verification.endpoint.resolve`.
Transport status MUST remain `NOT_TRANSMITTED`, sender and receiver receipts
MUST remain null, and receiver application MUST remain `UNKNOWN`.

A request MUST NOT be treated as provider identity, availability, schema
verification, authorization, consent, evidence, owner or debit closure, or
admission. Producer validation and a separate reconstruction audit MUST
reject R122 substitution, ineligible binding requests, invalid or oversized
windows, omitted proof requirements, recipient or endpoint invention,
send-only transport, fabricated receiver receipts, provider readiness,
persistence, promotion, canon, admission, or world-mutation claims.

R123 MUST add no Earth state, system-audit field, migration, endpoint
resolution, transport, provider execution, persistence, owner/debit mutation,
or admission. Earth engine v75 and system audit v62 MUST remain unchanged.
API v119 MUST expose four transient R123 schemas while preserving v118.
Manifest v0.123.0 MUST use Earth-system descriptor V86. R123 remains
`EXPERIMENTAL`, and only Mike Tobi may commit, merge, promote, or declare it
`CANON`.

## R124 provider-verification endpoint-resolution preflight

R124 MUST derive its transient contract and report only from an exact valid
R123 contract, request batch, request source, request options, and full
custody. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.preflight.evaluate`.
It MUST NOT claim to implement
`transport.foundation-planet.external-provider-verification.endpoint.resolve`
or
`transport.foundation-planet.external-provider-verification.request.send-receive`.

The contract MUST accept at most thirty endpoint declarations and 262,144
serialized declaration bytes. The complete preflight MUST remain within
524,288 serialized bytes. Each declaration MUST bind one exact R123 request
ID and digest, capability ID, provider ID and class, and a resolver claim
whose declared validity is entirely inside the R123 request window.

The declared entrypoint and locator kind MUST follow the R122 provider-class
boundary: `HUMAN_REVIEW_ROUTE` for a Mike Tobi or appointed AXM review seat,
`HOST_GOVERNANCE_ROUTE` for host governance, and a canonical credential-free
HTTPS URI for an external evidence service. HTTPS locators MUST contain no
credentials, query, or fragment. Locator and recipient identity trust MUST
remain caller-supplied and unverified.

Every declaration MUST require independent endpoint-ownership evidence,
independent recipient-identity evidence, allowed and denied recipient probes,
and matched sender and receiver receipts. It MUST authorize no endpoint,
human, or host contact and no persistence. It MUST remain unpersisted,
unpromoted, and non-CANON.

Malformed, digest-mismatched, unknown-request, substituted packet,
capability, provider, class, entrypoint, locator, recipient, resolver,
window, verification-plan, permission, or lifecycle declarations MUST be
rejected. More than one compatible declaration for a request MUST be
ambiguous. Exactly one compatible declaration MUST be labelled
`ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED` while endpoint resolution,
ownership, recipient authentication, contact authorization, transport,
provider readiness, and admission all remain false.

The current real R123 request batch MUST remain empty, so the current R124
preflight MUST contain no endpoint row and no declaration. Producer
validation and a separate reconstruction audit MUST bind and reconstruct the
exact R123 sources, declaration assessments, endpoint rows, counts, and
blocking conclusions without calling the R124 builders or validators.

R124 MUST add no Earth state, system-audit field, migration, resolver,
discovery, DNS lookup, endpoint or human contact, transport, provider
execution, persistence, evidence admission, owner/debit mutation, or
admission. Earth engine v75 and system audit v62 MUST remain unchanged. API
v120 MUST expose four transient R124 schemas while preserving v119. Manifest
v0.124.0 MUST use Earth-system descriptor V87. R124 remains `EXPERIMENTAL`,
and only Mike Tobi may commit, merge, promote, or declare it `CANON`.

## R125 endpoint-resolution verification-request handoff

R125 MUST derive its transient request contract and batch only from an exact
valid R124 contract, endpoint preflight, endpoint source, declaration array,
and full custody. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.verification-request.create`.

Only an R124 endpoint row with status
`ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED` may create a request. Missing,
rejected, and ambiguous endpoints MUST remain represented in batch counts but
MUST produce no packet. The real built-in empty endpoint inventory MUST
produce an empty batch without request identifiers or a fabricated requester.

Each eligible packet MUST bind the exact R125 contract, R124 preflight,
endpoint index and digest, R123 request ID and packet digest, endpoint
declaration index and digest, capability, provider, class, locator, recipient
claim, and a request window entirely inside the exact R123 request window.
The window MUST be no longer than 300,000 milliseconds. At most fifteen
packets, 4,096 challenge bytes, and 524,288 serialized batch bytes are
allowed.

Every packet MUST carry exactly five proof requirements:

1. independent resolver identity and authority;
2. endpoint ownership or route custody;
3. recipient identity binding;
4. contact authorization or consent from the exact required seat; and
5. a bounded fresh live challenge with matched sender and receiver receipts.

The resolver recipient MUST remain `UNRESOLVED`; resolver identity and
endpoint MUST remain null. Challenge status MUST remain
`CHALLENGE_MATERIAL_NOT_ISSUED` and its nonce MUST remain null. Transport MUST
remain `NOT_TRANSMITTED`, sender and receiver receipts MUST remain null, and
receiver application MUST remain `UNKNOWN`.

A request MUST NOT be treated as resolver identity or authority, endpoint
ownership or resolution, recipient authentication, contact authorization or
consent, transport, provider verification, evidence, owner or debit closure,
or admission. Producer validation and a separate reconstruction audit MUST
reject R124 substitution, ineligible endpoint requests, invalid or oversized
windows, omitted proof requirements, invented resolver recipients or
challenge material, contact or transport claims, fabricated receiver
receipts, provider readiness, persistence, promotion, canon, admission, or
world-mutation claims.

R125 MUST add no Earth state, system-audit field, migration, DNS lookup,
resolver execution, endpoint or human contact, transport, provider execution,
persistence, evidence admission, owner/debit mutation, or admission. Earth
engine v75 and system audit v62 MUST remain unchanged. API v121 MUST expose
four transient R125 schemas while preserving v120. Manifest v0.125.0 MUST use
Earth-system descriptor V88. R125 remains `EXPERIMENTAL`, and only Mike Tobi
may commit, merge, promote, or declare it `CANON`.

## R126 endpoint-resolver capability specification

R126 MUST derive its transient specification contract and bundle only from an
exact valid R125 contract, request batch, request source, request options, and
full custody. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-specification.create`.
It MUST specify but MUST NOT claim to implement
`transport.foundation-planet.external-provider-verification.endpoint.resolve`
or
`transport.foundation-planet.external-provider-verification.request.send-receive`.

The bundle MUST contain exactly one implementation-neutral endpoint-resolver
specification. Every R125 packet MUST produce one digest-bound input binding
that retains its exact request ID and digest, R124/R123 request binding,
caller-supplied unverified route and recipient claims, request window, and
required authority seat. The current real empty R125 batch MUST produce zero
input bindings while retaining the one capability specification.

The missing-hand specification MUST declare inputs and a versioned result
envelope, side effects, permissions and consent, resource budgets, failure and
recovery, compatibility, a verification contract, and promotion gates. It
MUST require these four independently obtained pre-transport proof surfaces:

1. resolver identity and authority;
2. endpoint ownership or route custody;
3. recipient identity binding; and
4. contact authorization or consent from the exact required seat.

The bounded live challenge with matched sender and receiver receipts MUST
remain deferred to the separate send/receive transport capability. A native
resolver receipt schema MUST remain undeclared until an actual resolver
implementation provides one for independent validation.

The specification MUST allow no Foundation write, endpoint, human, or host
contact, DNS or socket execution, self-authorization, consent invention,
self-installation, self-promotion, or self-canonization. It MUST fail closed;
partial proof MUST NOT resolve an endpoint or authorize contact, and retries
MUST retain the exact contract, batch, request, and binding digests.

Producer validation and a separate reconstruction audit MUST reject R125
substitution, omitted or altered input bindings, weakened proof, permission,
budget, recovery, compatibility, verification, or promotion fields, invented
native schemas, resolver installation or availability, contact, challenge,
transport or receiver claims, provider readiness, persistence, owner, debit,
admission, promotion, canon, or world mutation.

R126 MUST add no Earth state, system-audit field, migration, resolver
implementation or execution, endpoint or human contact, transport, provider
execution, persistence, evidence admission, owner/debit mutation, or admission.
Earth engine v75 and system audit v62 MUST remain unchanged. API v122 MUST
expose five transient R126 schemas while preserving v121. Manifest v0.126.0
MUST use Earth-system descriptor V89. R126 remains `EXPERIMENTAL`, and only
Mike Tobi may commit, merge, install, execute, promote, or declare it `CANON`.

## R127 endpoint-resolver provider-binding preflight

R127 MUST derive its transient binding-preflight contract only from the exact
valid, digest-bound R126 contract and bundle. It MUST compose that sealed R126
boundary without reopening or duplicating the recursively nested R125-through-
R89 custody graph. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider-binding.preflight`.
It MUST NOT claim to implement
`transport.foundation-planet.external-provider-verification.endpoint.resolve`
or
`transport.foundation-planet.external-provider-verification.request.send-receive`.

R127 MUST accept no more than two caller-supplied resolver-provider
declarations totaling at most 65,536 serialized bytes. Each declaration MUST
remain `CALLER_SUPPLIED_UNTRUSTED` and bind the exact R126 contract, bundle,
specification ordinal, capability identifier, and specification digest. It
MUST declare a distinct versioned native resolver receipt schema, exact R126
result-envelope and proof contracts, a fail-closed execution boundary,
permissions and consent, bounded runtime/request/output/registry-query budgets,
failure and recovery behavior, independent verification plans, and a wholly
inactive lifecycle.

One compatible declaration MUST yield only
`CONTRACT_COMPATIBLE_UNVERIFIED`; zero declarations MUST leave the one binding
missing, and multiple compatible declarations MUST be ambiguous pending an
explicit single-provider selection. Compatibility MUST NOT prove resolver
identity or authority, implementation integrity, installation, availability,
native-schema validity, authority or consent, execution, endpoint resolution,
contact, challenge, transport, provider verification, admission, persistence,
owner/debit closure, promotion, or canonization. Every binding MUST remain
operationally `BLOCKED`.

Before any resolver execution, independent evidence MUST still cover resolver
identity and authority, implementation integrity, live availability, the
native receipt schema, allowed and denied identity probes, exact request and
binding digest replay, and the exact per-request authority and consent seats.
The bounded live challenge with matched sender and receiver receipts MUST
remain delegated to the separate missing transport capability.

Producer validation and a separate reconstruction audit MUST reject R126
substitution, oversized or ambiguous declaration input, unknown capability or
provider-class claims, contract/bundle/specification digest mismatch, invented
or reused receipt schemas, weakened execution, permission, resource, recovery,
verification, or lifecycle boundaries, and re-signed claims of identity,
implementation integrity, installation, availability, execution, resolution,
contact, transport, admission, persistence, owner/debit closure, promotion,
canon, or world mutation.

R127 MUST add no Earth state, system-audit field, migration, discovery,
installation, resolver execution, endpoint or human contact, transport,
provider execution, persistence, evidence admission, owner/debit mutation, or
admission. Earth engine v75 and system audit v62 MUST remain unchanged. API
v123 MUST expose four transient R127 schemas while preserving v122. Manifest
v0.127.0 MUST use Earth-system descriptor V90. R127 remains `EXPERIMENTAL`,
and only Mike Tobi may select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.

## R142 closure-evidence acquisition request handoff

R142 MUST derive its contract and batch only from the exact valid R141
contract, recursion witness, closure preflight, and inherited boundary. Its
only new capability MUST be
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route.trust-bootstrap.closure-evidence-acquisition.request.create`.
It MUST NOT create, select, install, expose, execute, or verify a provider;
create or designate a route; authenticate an authority or coordinator; resolve
an endpoint; authorize contact; transmit a request; acquire, verify, or admit
evidence; satisfy a missing capability; persist; mutate; promote; or canonize.

Only an exact R141 closure with status
`BLOCKED_EXTERNAL_AUTHORITY_ANCHORED_VERIFIER_ROUTE_AND_NATIVE_RECEIPTS_REQUIRED`
and `automaticContinuationAllowed: false` MAY produce a packet. The current
empty real R141 closure inventory MUST produce an empty batch with null request
context and MUST reject invented non-empty request options.

Each eligible closure MUST produce exactly one packet that preserves the exact
R141 contract, witness, closure-preflight, route-closure, request-packet,
declaration, candidate, recipient locator, three route-provider, recurring
capability, and missing-capability bindings. It MUST carry exactly four
unavailable and unsatisfied capability requirements: out-of-band designation
decision, verifier-route trust-anchor resolution, endpoint resolution, and
matched send/receive transport. It MUST copy the exact eight R141 native
external evidence obligations and mark every item unacquired, independently
unverified, and unadmitted.

The handoff MAY identify `MIKE_TOBI` and
`AUTHENTICATED_HOST_GOVERNANCE_SEAT` only as eligible coordinators. It MUST keep
authority-seat authentication, coordinator authentication, candidate or route-
provider control exclusion, request acceptance, and acquisition receipt
observation false. It MUST retain a null endpoint, null sender and receiver
receipts, `contactAttempted: false`, and transport status `NOT_TRANSMITTED`.
It MUST prohibit treating the request as authentication, evidence acquisition,
capability satisfaction, an authority decision, route designation, permission
to create another unverified route, contact authority, delivery, evidence
admission, persistence, mutation, promotion, or canonization.

R142 MUST allow at most one packet, four capability requirements and eight
evidence requirements per packet, a 300,000 ms request window, and 524,288
serialized batch bytes. Producer validation and an independent exact-
reconstruction audit that calls no R142 builder or validator MUST reject R141
boundary substitution, invented metadata for empty custody, invalid windows,
extra metadata, and re-signed authentication, acceptance, evidence,
capability, authority, endpoint, contact, transport, persistence, promotion,
canon, or mutation overclaims.

R142 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v138 MUST expose four
transient R142 schemas while preserving v137. Manifest v0.142.0 MUST use Earth-
system descriptor V105. R142 remains `EXPERIMENTAL`, and only Mike Tobi may
select a provider, designate authority, commit, merge, install, execute,
promote, or declare it `CANON`.

## R140 decision-hand provider verification recipient-route preflight

R140 MUST derive its contract and preflight only from the exact valid R139
contract, request batch, nested custody, and request options. Its only new
capability MUST be
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route-resolution.preflight.evaluate`.
The current empty real R139 batch MUST produce an empty preflight. Any route
declaration supplied against that empty batch MUST be rejected rather than
inventing a request, recipient, provider, or route.

For a future exact R139 packet, a declaration MAY be classified only as
structurally compatible and unverified. It MUST exact-bind the request packet,
candidate provider, claimed independent verifier, and request window. Its
endpoint resolver, trust-anchor authority, and receipted send/receive transport
MUST be three distinct caller-supplied untrusted roles and MUST be distinct
from the decision-hand candidate. The transport MUST declare the endpoint and
authority providers as prerequisites. Candidate or self dependency, role
collision, unsafe locator, permission weakening, lifecycle overclaim, custody
substitution, and ambiguity MUST fail closed.

A compatible declaration MUST NOT prove provider identity, independence,
implementation, availability, or an acyclic dependency graph. It MUST NOT
resolve an endpoint or recipient, authenticate a recipient, establish
authority, make an authority decision, designate or authorize a route,
authorize contact, transmit a request, observe or invent sender or receiver
receipts, verify the decision-hand provider, admit evidence, resolve or debit
historical owners, persist, mutate, promote, or canonize anything.

R140 MUST allow at most two route declarations, two declarations per request,
twelve declared dependencies, 131,072 serialized bytes per declaration, and
524,288 serialized preflight bytes. Producer validation and a separate exact
reconstruction audit that calls no R140 builder or validator MUST reject
request and custody drift, direct or dependency-based candidate self-routing,
route-provider role collision, circular dependencies, ambiguity, and re-signed
endpoint, recipient, authority, decision, designation, contact, transport,
receipt, verification, evidence, persistence, promotion, canon, or mutation
overclaims.

R140 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v136 MUST expose four
transient R140 schemas while preserving v135. Manifest v0.140.0 MUST use Earth-
system descriptor V103. R140 remains `EXPERIMENTAL`, and only Mike Tobi may
designate authority, select a route or provider, commit, merge, install,
execute, promote, or declare it `CANON`.

## R141 decision-hand verification-route trust-bootstrap recursion preflight

R141 MUST derive its contract, recursion witness, and closure preflight only
from the exact valid R140 contract, preflight, declarations, and full nested
custody. Its only new capability MUST be
`analysis.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route.trust-bootstrap.recursion.detect`.
The current empty real R140 compatible-route inventory MUST produce an empty
witness and closure preflight.

For each exact R140 `RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED` route,
R141 MAY record only a dependency-class recurrence: independently verifying
the caller-supplied endpoint resolver, trust-anchor authority, and receipted
transport would require verification requests whose independent recipient
routes require the same three unverified capability classes. It MUST NOT claim
a literal artifact-graph cycle or prove that every external provider
implementation is recursive.

The witness MUST preserve the exact R139 request and candidate, R140 route and
declaration binding, three distinct caller-supplied untrusted provider roles,
and seven bounded stages. The first five stages MUST record the recurring
endpoint-resolution, trust-anchor-resolution, and send/receive classes. The
last two MUST make explicit that an unverified decision hand cannot
authenticate, decide, or designate its own verification route and that closure
requires an independently authority-anchored native route.

The closure preflight MUST prohibit automatic request or route chaining,
candidate self-routing, identifiers-as-independence proof, caller-declared
acyclicity as proof, locator-as-resolution, analysis-as-authority, and
persistence of transient artifacts. An active route MUST remain `BLOCKED` on
the same four operational capabilities: the exact out-of-band designation
decision, trust-anchor resolution, endpoint resolution, and receipted
send/receive. It MUST route decision-hand verification, route designation,
exact binding, provider identity and authority, implementation and live
availability, non-circular dependencies, endpoint and recipient identity,
consent, and matched transport claims to eight native evidence obligations.

R141 MUST NOT verify or select a decision hand or route provider, establish
availability, install or execute a provider, resolve an endpoint, authenticate
a recipient or authority seat, make a decision, designate or authorize a route,
contact a human or endpoint, transmit a request, invent sender or receiver
receipts, verify the original provider, admit evidence, resolve or debit
historical owners, persist, mutate, promote, or canonize anything.

R141 MUST allow at most one route, three provider roles per route, seven stages
per route, eight evidence requirements per route, and 524,288 serialized bytes
each for its witness and closure preflight. Producer validation and a separate
exact reconstruction audit that calls no R141 builder or validator MUST reject
R140 boundary substitution and re-signed closure, provider-verification,
authority, decision, designation, endpoint, recipient, contact, transport,
receipt, evidence, persistence, promotion, canon, or mutation overclaims.

R141 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v137 MUST expose three
transient R141 schemas while preserving v136. Manifest v0.141.0 MUST use Earth-
system descriptor V104. R141 remains `EXPERIMENTAL`, and only Mike Tobi may
designate authority, select a route or provider, commit, merge, install,
execute, promote, or declare it `CANON`.

## R128 endpoint-resolver provider-verification request handoff

R128 MUST derive its transient request contract and batch only from the exact
valid R127 contract, preflight, declaration input, and sealed R126 source
boundary. It MUST NOT reopen or duplicate the R125-through-R89 custody graph.
Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider.verification.request.create`.
It MUST NOT claim to implement
`transport.foundation-planet.external-provider-verification.endpoint.resolve`
or
`transport.foundation-planet.external-provider-verification.request.send-receive`.

Exactly one R127 `CONTRACT_COMPATIBLE_UNVERIFIED` binding MAY produce one
request packet. A missing, rejected, or ambiguous binding MUST produce an
empty batch and MUST accept no request identity or time window. An eligible
request MUST bind a caller-supplied request-batch identifier, requester-only
identity, canonical requested and expiry timestamps, and a window no longer
than 300,000 milliseconds. The serialized batch MUST be no larger than
131,072 bytes.

Every packet MUST bind the exact R127 preflight, binding ordinal and digest,
provider declaration index and digest, R126 contract and bundle digests,
resolver specification digest, and the R126 source request-packet and input-
binding replay coverage. The provider identifier, version, class, native
receipt schema, and claimed independent verifier MUST remain caller-supplied
and untrusted or unverified.

Every eligible packet MUST route six independently falsifiable proof
requirements: independent resolver-provider identity and capability authority;
implementation artifact provenance and digest integrity; matched live sender
and receiver availability receipts; independent native-receipt-schema parsing
and held-out validation; matched allowed and denied identity probes; and exact
R126 request-and-binding digest replay with one-digest-drift rejection. These
requirements MUST cover all R127 compatible-binding blockers except the exact
per-request authority and consent seats.

Per-request authority and consent MUST remain an explicit deferred prerequisite
before each later endpoint-resolution execution. A provider declaration,
provider-identity receipt, or R128 verification request MUST NOT grant that
authority or consent. The independent verification recipient and endpoint MUST
remain unresolved, and transport MUST remain `NOT_TRANSMITTED` with no sender
or receiver receipt.

Producer validation and a separate reconstruction audit MUST reject R127 or
R126 substitution, invalid request windows, omitted proof routes, changed
replay coverage, fictional recipient resolution, provider verification,
selection, installation, availability, execution, transport, receiver
acknowledgement, per-request authority, owner/debit closure, admission,
persistence, promotion, canon, or world mutation, including after re-signing.

R128 MUST add no Earth state, system-audit field, migration, discovery,
provider selection, installation, resolver execution, endpoint or human
contact, transport, challenge, persistence, evidence admission, owner/debit
mutation, or admission. Earth engine v75 and system audit v62 MUST remain
unchanged. API v124 MUST expose four transient R128 schemas while preserving
v123. Manifest v0.128.0 MUST use Earth-system descriptor V91. R128 remains
`EXPERIMENTAL`, and only Mike Tobi may select a provider, commit, merge,
install, execute, promote, or declare it `CANON`.

## R129 resolver-provider verification-recipient resolution preflight

R129 MUST derive its transient contract and preflight only from the exact
valid R128 contract, request batch, request options, R127 request source, and
sealed R128 custody. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider.verification.recipient-resolution.preflight.evaluate`.
It MUST NOT claim to implement endpoint resolution or request transport.

The preflight MUST accept at most two caller-supplied endpoint declarations
within a 131,072-byte declaration ceiling and MUST remain within a 262,144-byte
serialized preflight ceiling. Each structurally compatible declaration MUST
bind the exact R128 request packet and digest, candidate provider identifier,
class, and declaration digest, exact claimed independent verifier, and exact
`transport.foundation-planet.external-provider-verification.endpoint.resolve`
capability.

A compatible declaration MUST name a distinct alternate resolver provider.
The candidate provider MUST NOT resolve its own verification recipient, and a
declared dependency on the candidate or the alternate resolver itself MUST be
rejected. Zero declarations MUST leave one eligible request missing; multiple
compatible declarations MUST remain ambiguous. These checks are fail-closed
structural exclusions only: a distinct provider identifier and dependency list
MUST NOT establish independence or operational trust.

Even one compatible declaration MUST remain operationally `BLOCKED` pending
independent alternate-resolver identity and authority, implementation and
availability, non-circular dependency proof, endpoint ownership, verifier
identity, and contact authorization. It MUST NOT resolve an endpoint,
authenticate a recipient, authorize contact, transmit the R128 request, verify
or select the candidate provider, install or execute a resolver, admit evidence,
identify or debit a historical physical source owner, persist, mutate, promote,
or canonize.

Producer validation and a separate reconstruction audit MUST reject source
substitution, request or candidate binding drift, verifier mismatch, unsafe
locators, direct self-resolution, declared circular dependency, invalid time
windows, weakened verification or permission boundaries, ambiguity laundering,
and re-signed claims of independence, resolution, authentication, contact,
transport, provider verification, owner/debit closure, admission, persistence,
promotion, canon, or world mutation.

R129 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v125 MUST expose four
transient R129 schemas while preserving v124. Manifest v0.129.0 MUST use
Earth-system descriptor V92. R129 remains `EXPERIMENTAL`, and only Mike Tobi
may select a provider, commit, merge, install, execute, promote, or declare it
`CANON`.

## R130 verification-recipient trust-bootstrap recursion preflight

R130 MUST derive its transient contract, recursion witness, and closure
preflight only from the exact valid R129 contract, witness, closure preflight,
and sealed R129 custody. Its only new capability MUST be
`analysis.foundation-planet.external-provider-verification.verification-recipient.trust-bootstrap.recursion.detect`.
It MUST NOT claim to implement authority, endpoint resolution, or request
transport.

With no R129 compatible route, the R130 witness and closure preflight MUST be
empty. For one synthetic compatible R129 route, R130 MUST reconstruct exactly
one dependency-class witness with at most five stages. Stages one through four
MUST identify recurrence of the unverified resolver-provider dependency. Stage
five MUST identify the missing out-of-band capability
`authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve`
without claiming that capability is present.

The recurrence MUST be described as
`UNVERIFIED_RESOLVER_PROVIDER_REQUIRES_A_VERIFIER_ROUTE_RESOLVED_BY_ANOTHER_UNVERIFIED_RESOLVER_PROVIDER`.
It MUST NOT be promoted into a claim of a literal artifact-graph cycle or a
claim that every resolver route is recursive. Direct candidate self-resolution,
declared circular dependency, ambiguity, or source substitution rejected by
R129 MUST NOT be laundered into an R130 recursion witness.

Automatic resolver chaining MUST be prohibited. A compatible synthetic route
MUST remain `BLOCKED_RECURSIVE_UNTRUSTED_RESOLVER_PROVIDER_DEPENDENCY` pending
six independently receipted evidence classes: authority designation; exact
verifier-route binding; trust-anchor provenance and revocation; allowed and
denied anchor-identity probes; endpoint ownership and verifier identity; and
per-request authority plus matched transport receipts. The final evidence class
MUST also require
`transport.foundation-planet.external-provider-verification.request.send-receive`.

The projection MUST accept at most one route, five stages, six evidence
requirements, and 262,144 serialized bytes per witness and preflight. Producer
validation and a separate reconstruction audit MUST reject source substitution,
stage drift, missing evidence, weakened authority or transport boundaries,
automatic-chain claims, fictional trust-anchor resolution, fictional closure,
provider verification, owner/debit closure, admission, persistence, promotion,
canon, and world-mutation overclaims.

R130 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v126 MUST expose three
transient R130 schemas while preserving v125. Manifest v0.130.0 MUST use
Earth-system descriptor V93. R130 remains `EXPERIMENTAL`, and only Mike Tobi
may designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.


## R131 verifier-route trust-anchor and transport capability specifications

R131 MUST derive its contract and bundle only from the exact valid R130
contract, recursion witness, closure preflight, and full R130 boundary. Its
only implemented capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport-specification.create`.
It MUST specify, but MUST NOT implement,
`authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve`
and
`transport.foundation-planet.external-provider-verification.request.send-receive`.

The bundle MUST contain exactly two provider-neutral specifications. Each MUST
declare inputs and schemas, outputs and schemas, side effects, permissions and
consent, resource budgets, failure and recovery behavior, compatibility,
verification, and the Mike Tobi / AXM promotion gate. With no current R130
compatible route, the specifications MUST remain available with zero input
bindings. One compatible synthetic route MUST produce exactly one authority
binding and one transport binding.

The authority binding MUST cover the five R130 trust-anchor evidence IDs. Its
specification MUST require Mike Tobi or an authenticated host-governance seat,
exact route/request/declaration/locator/verifier binding, independent anchor
provenance and revocation verification, matched allowed and denied identity
probes, endpoint ownership and verifier identity receipts, and proof that the
candidate and alternate resolvers do not control the anchor. Neither resolver
MUST be able to designate its own trust anchor.

The transport binding MUST depend on the authority capability and MUST cover
the exact per-request contact-authority and matched-transport evidence ID. Its
specification MUST require exact recipient consent or host authorization before
contact; at most one send attempt and one receiver acknowledgement per exact
authority receipt; no automatic retry; matched transaction ID, request ID,
payload digest, recipient identity, sender and receiver authority, validity
window, and replay checks. A sender receipt alone MUST NOT prove delivery, a
receiver receipt alone MUST NOT prove the exact payload, and delivery MUST NOT
prove that the receiver applied or accepted the request.

Native authority, sender, and receiver receipt schemas MUST remain `null` with
status `NOT_DECLARED_UNTIL_PROVIDER_BINDING_AND_INDEPENDENT_REVIEW`. Both
specifications MUST remain `SPECIFIED_NOT_IMPLEMENTED`, with selected,
installed, available, executed, promoted, and canon states false. R129
self-resolution, declared circular dependency, ambiguity, and substituted
source cases MUST NOT become R131 input bindings.

R131 MUST allow at most two specifications, one route, two input bindings,
120,000 ms external runtime, 262,144 bytes per result envelope, and 524,288
serialized bundle bytes. Producer validation and a separate reconstruction
audit MUST reject source substitution, invented native receipt schemas,
weakened authority, consent, retry, receipt-match, budget, recovery,
compatibility, verification, or promotion boundaries, and any fictional
selection, installation, availability, execution, authority, endpoint,
recipient, transport, provider verification, evidence admission, owner/debit,
persistence, promotion, canon, or world-mutation claim.

R131 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v127 MUST expose five
transient R131 schemas while preserving v126. Manifest v0.131.0 MUST use
Earth-system descriptor V94. R131 remains `EXPERIMENTAL`, and only Mike Tobi
may designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.

## R132 verifier-route authority and transport provider binding preflight

R132 MUST derive its contract and preflight only from the exact valid R131
contract, capability-specification bundle, and full R131 boundary. Its only new
capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider-binding.preflight.evaluate`.
It MUST NOT select, trust, install, expose, execute, or promote a provider.

The preflight MUST accept at most four caller-supplied declarations, at most two
per R131 capability, at most two native receipt schemas per declaration,
131,072 serialized bytes per declaration, and 524,288 serialized preflight
bytes. The current empty declaration inventory MUST produce two
`MISSING_PROVIDER_DECLARATION` assessments and no candidate.

Every declaration MUST bind the exact R131 contract and bundle digests, exact
specification ordinal, capability, provider class, and digest, and exact R131
input-binding and result-envelope schemas. Provider identifiers and versions
MUST be bounded and syntactically safe. Declared native schemas MUST use the
capability-specific roles, be unique across the complete declaration set, and
MUST NOT impersonate any generic R131 schema. All native schemas MUST remain
`CALLER_DECLARED_UNVERIFIED`.

An authority-provider declaration MUST describe an independent trust-anchor
authority entrypoint, acknowledge the Mike/authenticated-host authority seat,
prohibit candidate and alternate resolver control, reject self-attestation and
inferred consent, exactly preserve the one-route, one-allowed-probe,
one-denied-probe, 120,000 ms, 262,144-byte, zero-retry budgets, and declare no
authority prerequisite. Its secondary verifier MUST be distinct from the
provider and MUST have no identity, authority, or availability receipt yet.

A transport-provider declaration MUST describe a receipted send/receive
entrypoint, preserve exact per-request authority and recipient consent or host
authorization, the one-attempt, one-acknowledgement, 120,000 ms, 262,144-byte,
zero-retry budgets, and the R131 sender/receiver fail-closed rules. It MUST name
the sole compatible authority-provider candidate as its prerequisite and MUST
be rejected when that prerequisite is missing, self-referential, rejected, or
ambiguous.

One compatible declaration per capability MAY produce two
`PROVIDER_DECLARATION_CONTRACT_COMPATIBLE_UNVERIFIED` candidates. Both MUST
remain caller-supplied and unverified, with selected, installed, available,
executed, authority-established, and transport-performed fields false. More
than one compatible declaration for either capability MUST remain
`AMBIGUOUS_PROVIDER_DECLARATIONS` with no candidate binding and no implicit
selection.

Producer validation and a separate reconstruction audit MUST reject source or
specification substitution, declaration digest or shape drift, schema reuse,
generic-schema impersonation, capability or provider-class mismatch, weakened
implementation, permission, consent, budget, recovery, or verification rules,
self-verification, unresolved authority prerequisites, and re-signed claims of
trust, selection, installation, availability, execution, authority, endpoint,
recipient, contact, transport, provider verification, evidence admission,
owner/debit closure, persistence, promotion, canon, or world mutation.

R132 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v128 MUST expose four
transient R132 schemas while preserving v127. Manifest v0.132.0 MUST use
Earth-system descriptor V95. R132 remains `EXPERIMENTAL`, and only Mike Tobi
may designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.

## R133 verifier-route provider verification request handoff

R133 MUST derive its contract and batch only from the exact valid R132 contract,
preflight, declarations, and full R132 boundary. Its only new capability MUST
be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider.verification.request.create`.
A request MUST NOT verify, select, trust, install, expose, execute, or promote a
provider.

Only exact R132 `CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED` candidates with every
selection, installation, availability, execution, authority, and transport
lifecycle field false MAY produce a request. Missing, rejected, or ambiguous
R132 assessments MUST produce no packet. The current empty R132 declaration and
candidate inventory MUST produce an empty request batch with null request
context and MUST reject invented non-empty request options.

Each eligible authority or transport candidate MUST produce exactly one packet
with six independent blocking proof requirements. Both packet kinds MUST require
independent provider identity, authority, expiry and revocation evidence;
independently obtained implementation provenance and digest integrity; bounded
live availability with matched sender and receiver receipts; and exact R131
contract, bundle, specification, candidate, declaration, prerequisite, and
input-binding replay with one-digest drift rejection.

The authority-provider packet MUST additionally require independent validation
of its sole native authority-receipt schema against held-out valid and
adversarial fixtures plus matched allowed and denied provider-identity probes.
The transport-provider packet MUST instead require independent validation of
both native sender and receiver schemas and a held-out matched receipt-pair test
that rejects single-sided, mismatched, replayed, or receiver-application
overclaims.

The packet MUST retain the declaration's secondary verifier ID only as
`CALLER_SUPPLIED_UNTRUSTED`. Recipient identity, endpoint, authority, and
transport MUST remain unresolved. Every packet MUST name endpoint resolution,
independent verifier-route trust-anchor resolution, and receipted send/receive
as required routing capabilities, and MUST prohibit the candidate provider from
satisfying its own verification route. Sender and receiver receipts MUST remain
null and transport status MUST remain `NOT_TRANSMITTED`.

R133 MUST allow at most two request packets, six proof requirements per packet,
a 300,000 ms request window, zero retries, and 524,288 serialized batch bytes.
Producer validation and a separate reconstruction audit that calls no R133
builder or validator MUST reject R132 custody substitution, request-window or
identifier drift, ambiguity laundering, changed proof routes, and re-signed
claims of recipient trust, delivery, provider verification, selection,
installation, availability, execution, authority, endpoint, evidence admission,
owner/debit closure, persistence, promotion, canon, or world mutation.

R133 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v129 MUST expose four
transient R133 schemas while preserving v128. Manifest v0.133.0 MUST use
Earth-system descriptor V96. R133 remains `EXPERIMENTAL`, and only Mike Tobi
may designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.

## R134 verifier-route provider-verification recipient-route resolution preflight

R134 MUST derive its contract and preflight only from the exact valid R133
contract, request batch, full R133 custody, request options, and bounded
caller-supplied recipient-route declarations. Its only new capability MUST be
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider.verification.recipient-route-resolution.preflight.evaluate`.
The current empty R133 batch MUST produce an empty preflight without invented
route metadata.

Each structurally compatible declaration MUST bind one exact R133 request packet
and candidate plus its claimed untrusted verification recipient. It MUST name
distinct caller-supplied untrusted endpoint-resolver, trust-anchor-authority,
and receipted send/receive transport providers. The transport MUST bind both
other route-provider IDs as prerequisites and MUST bind the authority provider
as its exact prerequisite authority. No route-provider ID or dependency MAY be
the candidate provider. Role collisions, self-dependencies, candidate
dependencies, unsafe locators, invalid windows, permission drift, lifecycle
overclaims, and multiple compatible declarations for one request MUST remain
rejected or ambiguous rather than selected.

A compatible declaration MUST remain compatible-unverified and operationally
`BLOCKED`. It MUST NOT prove route-provider identity or independence, an acyclic
dependency graph, endpoint ownership or resolution, recipient identity,
authority, consent, contact, transport, matched receipts, provider verification,
evidence admission, historical owner/debit closure, or world mutation.

R134 MUST allow at most four declarations, two per request, twelve declared
dependencies, 131,072 serialized bytes per declaration, and 524,288 serialized
preflight bytes. Producer validation and a separate exact reconstruction audit
that calls no R134 builder or validator MUST reject R133 custody substitution,
route or digest drift, ambiguity laundering, and re-signed endpoint, recipient,
authority, contact, transport, provider-verification, evidence, persistence,
promotion, canon, or mutation overclaims.

R134 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v130 MUST expose four
transient R134 schemas while preserving v129. Manifest v0.134.0 MUST use
Earth-system descriptor V97. R134 remains `EXPERIMENTAL`, and only Mike Tobi
may designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.

## R135 verifier-route provider trust-bootstrap recursion guard

R135 MUST derive its contract, witness, and closure preflight only from the
exact valid R134 contract, preflight, declarations, and full R134 custody. Its
only new capability MUST be
`analysis.foundation-planet.external-provider-verification.verifier-route.provider.trust-bootstrap.recursion.detect`.
The current empty R134 compatible-route inventory MUST produce an empty witness
and empty closure preflight.

For each exact R134 compatible-unverified route, R135 MUST preserve the exact
candidate, claimed recipient, locator, endpoint-resolver provider,
trust-anchor-authority provider, and receipted-transport provider. It MUST
witness that all three route providers require independent identity, authority,
implementation, availability, and native evidence before use; verification
requests for those providers require independently resolved recipient routes;
and another unverified three-provider route would re-enter the same dependency
class. It MUST prohibit automatic recursive continuation. It MUST NOT claim a
literal artifact-graph cycle or universal recursion across all external
provider implementations.

Each active route MUST remain blocked on endpoint resolution, verifier-route
trust-anchor authority, and receipted send/receive transport. It MUST expose
exactly seven external evidence obligations: out-of-band route authority;
exact route binding; identity, authority, expiry, and revocation for all three
route providers; implementation integrity and live availability for all three;
an independent non-circular dependency proof; endpoint ownership, recipient
identity, and allowed/denied probes; and per-request contact authority with
matched native sender/receiver receipts.

No witness or closure preflight MAY verify or select a route provider, prove
independence or acyclicity, resolve an endpoint, authenticate a recipient,
establish authority, authorize contact, perform transport, observe a sender or
receiver receipt, verify the original candidate provider, admit evidence,
resolve or debit a historical physical source owner, persist, promote,
canonize, or mutate world state.

R135 MUST allow at most two routes, three provider roles and six stages per
route, seven evidence requirements per route, 524,288 serialized witness bytes,
and 524,288 serialized closure-preflight bytes. Producer validation and a
separate reconstruction audit that calls no R135 builder or validator MUST
reject R134 substitution, topology or evidence-route drift, and re-signed
closure, provider-verification, endpoint, recipient, authority, contact,
transport, receipt, evidence, persistence, promotion, canon, or mutation
overclaims.

R135 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v131 MUST expose three
transient R135 schemas while preserving v130. Manifest v0.135.0 MUST use
Earth-system descriptor V98. R135 remains `EXPERIMENTAL`, and only Mike Tobi
may designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.

## R136 out-of-band verifier-route authority-designation request handoff

R136 MUST derive its contract and request batch only from the exact valid R135
contract, witness, closure preflight, and full R135 boundary. Its only new
implemented capability MUST be
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.request.create`.
The current empty R135 blocked-closure inventory MUST produce an empty request
batch, MUST accept only an empty options object, and MUST invent no request
metadata.

For each exact eligible R135 blocked closure, R136 MAY create one transient
proposal-only packet addressed to the established
`axm-host-authority-review-seat`. Eligible decision-maker labels MAY name Mike
Tobi or an authenticated host-governance seat, but MUST NOT authenticate either,
grant authority, make a decision, or produce a designation receipt. The external
decision capability
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide`
MUST remain a missing capability unless independently implemented and proven.

Each packet MUST preserve the exact R135 route, source request and declaration
digests, candidate, claimed recipient, locator, three route-provider claims,
recurring capability IDs, closure digest, and seven unadmitted R135 external
evidence obligations. It MUST carry exactly five unsatisfied decision criteria:
exact R135/R134 binding; independent authority-seat identity, scope, and denial
probes; candidate and route-provider non-control; preservation of all separate
verification and operational blocks; and bounded expiry, revocation, and
fail-closed denial behavior.

R136 MUST NOT authenticate an authority seat, designate or authorize a route,
verify route providers or dependency acyclicity, resolve an endpoint,
authenticate a recipient, authorize contact, perform transport, observe sender
or receiver receipts, verify the original candidate provider, admit evidence,
resolve or debit a historical physical source owner, persist, promote, canonize,
or mutate world state. The producer MUST contain no network primitive, and the
packet transport state MUST remain `NOT_TRANSMITTED` with null endpoint and
receipts.

R136 MUST allow at most two request packets, five decision criteria and seven
evidence requirements per packet, a 300,000 ms request window, and 524,288
serialized batch bytes. Producer validation and a separate reconstruction audit
that calls no R136 builder or validator MUST reject R135 custody substitution,
identifier or window drift, changed governance scope or evidence routes, and
re-signed authority, designation, endpoint, contact, transport, receipt,
provider-verification, owner/debit, persistence, promotion, canon, or mutation
overclaims.

R136 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v132 MUST expose four
transient R136 schemas while preserving v131. Manifest v0.136.0 MUST use
Earth-system descriptor V99. R136 remains `EXPERIMENTAL`, and only Mike Tobi
may designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.

## R138 out-of-band decision-hand provider-binding preflight

R138 MUST derive its contract and preflight only from the exact valid R137
contract, specification bundle, and full R137 boundary. It MUST expose only
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-binding.preflight.evaluate`.
The actual decision capability MUST remain
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide`.

R138 MUST accept zero to two caller-supplied declarations. The current real
inventory MUST remain empty and MUST yield one missing-declaration assessment,
zero candidates, and the exact blocked-with-no-declarations status. One exact
compatible synthetic declaration MUST remain caller-supplied and unverified;
two exact compatible declarations MUST remain ambiguous with no candidate
binding and no selection.

Each compatible declaration MUST exact-bind the R137 specification, contract,
bundle, input-binding schema, result-envelope schema, provider class,
permissions and consent, resource budget, failure and recovery contract, and
untrusted lifecycle. Its one native decision-receipt schema MUST be unique,
versioned, non-generic, and `CALLER_DECLARED_UNVERIFIED`. The declared provider
identifier MUST differ from every exact current R136 candidate and route-
provider identifier, while the contract MUST state that identifier difference
and caller claims do not prove control or beneficial-ownership independence.

The declaration MUST plan independent exact-digest replay, native receipt-schema
validation, authority-seat identity/scope verification, allowed and denied
identity probes, candidate/route-provider non-control proof, native signature,
key-authority, expiry, and revocation verification, criteria/evidence replay,
implementation integrity, and live availability. All evidence receipts MUST
remain null at preflight time. Self-attestation, eligibility labels, structural
compatibility, or a native schema declaration MUST NOT authenticate authority,
select a hand, establish trust, or authorize operation.

R138 MUST reject R137 substitution, invalid or duplicate provider identity,
generic or reused native schemas, weakened permissions, control declarations,
budgets, recovery, verification, or lifecycle, ambiguity-as-selection, and
re-signed operational overclaims. It MUST allow at most two declarations, one
native schema per declaration, 131,072 bytes per declaration, and 524,288 bytes
for the preflight. The producer MUST contain no network primitive. The audit
MUST independently reconstruct R138 without calling any R138 builder or
validator.

R138 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v134 MUST expose four
transient R138 schemas while preserving v133. Manifest v0.138.0 MUST use
Earth-system descriptor V101. R138 remains `EXPERIMENTAL`, and only Mike Tobi
may accept a declaration, authenticate or designate authority, select a route
or provider, commit, merge, install, execute, promote, or declare it `CANON`.

## R137 out-of-band route-designation decision capability specification

R137 MUST derive its contract and specification bundle only from the exact valid
R136 contract, request batch, full R136 boundary, and request options. Its only
new implemented capability MUST be
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision.specification.create`.
It MUST specify but MUST NOT implement
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide`.

R137 MUST always expose exactly one implementation-neutral `AUTHORITY`
specification. The current empty R136 request inventory MUST produce zero input
bindings. Each active R136 request MUST produce one exact binding carrying the
source contract, batch, packet, route, request window, requested-designation
digest, five decision-criterion digests, and seven external-evidence digests.

The specification MUST define inputs and schemas, result-envelope requirements,
side effects, permissions and consent, resource budgets, failure and recovery,
compatibility, independent verification, lifecycle, and Mike Tobi/AXM promotion
gates. It MUST require authentication of the exact
`axm-host-authority-review-seat`, allowed and denied identity probes, candidate
and all route-provider non-control, and a native decision-receipt signature,
key-authority, expiry, and revocation chain. Eligibility labels and
self-attestation MUST NOT authenticate authority.

The native receipt schema MUST remain null until an authenticated hand binding
and independent review declare it. `CLAIMED_DESIGNATE`, `CLAIMED_DENY`, and
`CLAIMED_UNKNOWN` envelopes MUST remain untrusted on arrival. Denied or unknown,
missing, expired, revoked, partial, or replayed receipts MUST fail closed. A
designation MUST apply only to the exact bound route and MUST NOT verify route
providers, prove dependency acyclicity, resolve an endpoint, authenticate a
recipient, authorize contact or transport, verify the original provider, admit
evidence, resolve or debit historical physical source owners, persist, promote,
canonize, or mutate world state.

R137 MUST allow one specification, at most two input bindings, five criterion
and seven evidence references per binding, 120,000 ms external runtime, 262,144
result-envelope bytes, zero automatic retries, and 524,288 serialized bundle
bytes. Producer validation and a separate exact reconstruction audit that calls
no R137 builder or validator MUST reject R136 custody substitution and re-signed
implementation, authority, decision, designation, route, contact, transport,
receipt, provider-verification, owner/debit, persistence, promotion, canon, or
mutation overclaims.

R137 MUST add no Earth state, system-audit field, or migration. Earth engine v75
and system audit v62 MUST remain unchanged. API v133 MUST expose five transient
R137 schemas while preserving v132. Manifest v0.137.0 MUST use Earth-system
descriptor V100. R137 remains `EXPERIMENTAL`, and only Mike Tobi may designate
authority, select a route or provider, commit, merge, install, execute, promote,
or declare it `CANON`.

## R139 decision-hand provider verification request handoff

R139 MUST derive its contract and batch only from the exact valid R138
contract, preflight, declarations, and full R138 boundary. Its only new
capability MUST be
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.request.create`.
A request MUST NOT verify, trust, select, install, expose, execute, authorize,
or promote a decision hand, authenticate an authority seat, admit a decision
receipt, decide a route designation, or authorize a route.

Only an exact R138 `CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED` candidate with every
selection, installation, availability, execution, authority-authentication,
decision, designation-receipt, and route-authorization field false MAY produce
a request. Missing, rejected, or ambiguous R138 assessments MUST produce no
packet. The current empty real declaration and candidate inventory MUST produce
an empty request batch with null request context and MUST reject invented
non-empty request options.

Each eligible candidate MUST produce exactly one packet with eight independent
blocking proof requirements. Those requirements MUST cover independently
appointed provider identity, authority, non-control, beneficial-ownership
exclusion, expiry and revocation evidence; independently obtained
implementation provenance and digest integrity; bounded non-decision live
availability with matched sender and receiver receipts; independent native
decision-receipt schema validation against held-out valid and adversarial
fixtures; matched allowed and denied decision-maker-seat identity, scope, and
authority probes; held-out native signature, signer-key binding, authority
scope, expiry, and revocation validation; exact R137 contract, bundle,
specification, input-binding plus R138 contract, preflight, candidate, and
declaration digest replay; and exact R136 criterion and evidence replay with
omission, ordering, weakening, and self-proof rejection.

The packet MUST retain the declaration's secondary verifier ID only as
`CALLER_SUPPLIED_UNTRUSTED`. Recipient identity, endpoint, authority, and
transport MUST remain unresolved. It MUST name endpoint resolution, independent
verifier-route trust-anchor resolution, and receipted send/receive as required
routing capabilities, and MUST prohibit the candidate from satisfying its own
verification route. Sender and receiver receipts MUST remain null and
transport status MUST remain `NOT_TRANSMITTED`.

R139 MUST allow at most one request packet, eight proof requirements, a
300,000 ms request window, zero retries, and 524,288 serialized batch bytes.
Producer validation and a separate reconstruction audit that calls no R139
builder or validator MUST reject R138 custody substitution, request-window or
identifier drift, invented metadata for empty custody, changed proof routes,
and re-signed claims of recipient trust, delivery, provider verification,
selection, installation, availability, execution, authority authentication,
decision, designation, endpoint resolution, evidence admission, owner/debit
closure, persistence, promotion, canon, or world mutation.

R139 MUST add no Earth state, system-audit field, or migration. Earth engine
v75 and system audit v62 MUST remain unchanged. API v135 MUST expose four
transient R139 schemas while preserving v134. Manifest v0.139.0 MUST use Earth-
system descriptor V102. R139 remains `EXPERIMENTAL`, and only Mike Tobi may
designate authority, select a provider, commit, merge, install, execute,
promote, or declare it `CANON`.
