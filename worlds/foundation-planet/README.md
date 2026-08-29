# AXM Foundation Planet: Caelus

Caelus is the large-world sibling of the AXM Living Globe. Its logical radius is 6,371 km, close to an Earth-scale terrestrial planet. It is intended to become the neutral ground planet beneath many future games. It does not replace the original Living Globe and does not give any game ownership of world state.

Open `/worlds/foundation-planet/` through the Workshop server. Run `node worlds/foundation-planet/selftest.js` before promotion.

## First serious rung

- deterministic planet-scale terrain with continents, ocean basins and mountain systems;
- physically meaningful latitude, longitude, elevation, temperature, moisture, day, year and planet-radius values;
- orbital exploration and a separate streamed 120 × 120 km local surface scale;
- climate-derived ocean, coast, desert, savanna, grassland, forest, rainforest, taiga, tundra, alpine and ice biomes;
- fourteen deterministic tectonic plate provinces with convergent, divergent and transform boundaries;
- coordinate-level crust age, bedrock, soil depth, precipitation and erosion-risk data;
- a planet-anchored 2.5 km drainage grid streamed through buffered canonical tiles, with catchment area, runoff, discharge, river order, width, depth and inland sinks;
- surface-rendered river reaches, lakes, exposed geology and orbital plate-boundary survey points;
- replaceable temperate, verdant, arid, glacial and barren condition profiles;
- independent hydrology, atmosphere, cloud, weather, vegetation, fauna and decomposer layers;
- one master control for all living layers;
- hierarchical local ecology: regional populations across 120 km and individual organisms in a 3 km focus sector;
- deterministic local vegetation and fauna populations streamed for the current sector;
- a versioned 96-entry species catalog spanning 33 producer, 47 animal and 16 decomposer archetypes;
- terrestrial, freshwater, coastal, marine and deep-marine realm occupancy with salinity, water-depth and freshwater-dependency envelopes;
- habitat envelopes, trophic roles, diet, mass, social structure, locomotion, activity, maturity, lifespan, reproduction, life strategy and keystone-role declarations;
- deterministic local community assembly and time-of-day fauna activity;
- regional producer biomass, animal carrying-capacity and decomposer-activity estimates beneath the visible individual tier;
- declared food-web links with herbivore pressure, predator support and resilience signals;
- browser-local continuity for location, time, profile, view and living age;
- a read-only `window.AXMFoundationPlanet` contract and selected-snapshot seam;
- an optional isolated named-world host contract with exact-revision writes, bounded journals, recovery snapshots and canonical sector subscriptions;
- a deterministic fixed-step authority kernel that accepts bounded controller intent and owns multiplayer movement.
- sparse stateful land and ocean columns with conserved water and surface-energy ledgers, soil layers, aquifers, snow and sea ice.
- persistent surface, root-zone, deep-soil and groundwater sensible-heat owners with paired internal water/heat transfers and owner-backed runoff generation.
- canonical neighboring-cell transport for atmospheric moisture and heat, groundwater, ocean freshwater and ocean mixed-layer heat.
- finite clay, silt, sand and gravel ownership with receipted runoff, river-bed and coastal sediment routing across the loaded domain.
- persistent loaded-reach floodplain water, chemistry, suspended grains and deposits with receipted bankfull overflow and finite return flow.
- persistent floodplain live, standing-dead and litter carbon/nitrogen partitioned from loaded land-cell biomass by exact paired receipts.
- persistent floodplain plant phosphorus and live tissue water drawn from the local floodplain through exact uptake receipts, with mortality water returned to the same reservoir.

## Rungs 2–3: physical history and ecological scale

The second and third rungs add deterministic plate provinces, bedrock, soils, erosion signals, watershed drainage, visible freshwater, a versioned species catalog, local community assembly and a statistical regional food web beneath the visible individual tier. `Follow water` relocates a surface expedition to the nearest computed river reach. Physical geology/hydrology and all living tiers remain independently controllable.

## Rung 4: seasons, weather and persistent ecology

Axial tilt and latitude now drive season, solar declination, daylight and seasonal temperature. Deterministic local weather cells expose pressure, wind, humidity, cloud, precipitation type and intensity, snowpack, drought, lightning and fire risk. Loaded regional populations advance with births, natural mortality, predation pressure, carrying capacity and migration. Up to 100 visited sector-dynamics records persist in the browser save, including fires, recovery and explicitly governed intervention history.

## Rung 5: ecological breadth and marine expeditions

The catalog now spans 96 archetypes across land, freshwater and ocean food webs. Regional populations track juvenile, adult and senescent cohorts using catalog maturity, lifespan and reproduction strategy, while community diagnostics report only the realms occupied at the current coordinate. `Survey ocean` deploys directly into a productive marine sector with water-specific survey metrics, nearby swimming fauna, primary producers and decomposer activity. The master Life control makes every terrestrial and marine living tier dormant without pausing physical water, atmosphere or geology.

## Rung 6: continuous water, physics coordinates and revisioned state

Hydrology now samples a planet-anchored global grid through buffered canonical tiles. A river reach owns one stable `hydro-reach:v2:<grid-x>:<grid-z>` identity, canonical endpoints and a downstream reach link, regardless of which overlapping expedition sector requests it. Loaded sectors report explicit edge handoffs instead of silently terminating water at the render boundary. Catchment area, runoff, discharge, width, depth and stream order remain procedural approximations; depression filling was future work at this rung, while Rung 36 later adds finite loaded-domain sediment transport without claiming resolved channel morphology.

Every loaded sector also publishes a right-handed meter-scale floating-origin frame with east, radial-up and north axes, latitude-sensitive radial gravity, collision intentions and exact canonical/local coordinate transforms. The current explorer uses an accelerated kinematic ground/swim controller; a general rigid-body engine is deliberately not claimed.

Browser persistence is now a versioned v2 world-state envelope with lineage identity, monotonically increasing revision, parent revision, checksum, compact event journal and optimistic-concurrency rejection. Existing v1 saves migrate without deletion. This local envelope is not authoritative multiplayer state; Rung 7 adds the explicit service boundary that can host the same identity.

## Rung 7: optional authoritative host and multiplayer movement

The Workshop Living World service can now host multiple isolated named world lineages while preserving its original `living-globe` compatibility slot. Caelus uses `world.axm.foundation-planet`, its unchanged seed and its browser lineage when generating an explicit `axm.living-world.create/v1` bootstrap. The host owns expected-revision writes, bounded change journals, snapshots and guarded restore. Cross-world mutation, lineage transfer, ownership transfer, silent reset and secret-like state are refused.

`window.AXMFoundationPlanet` exposes read-only host status plus proposal builders for bootstrap, world patches and canonical sector subscriptions. Merely opening Caelus never creates or mutates hosted state. The browser continues with local revisioned persistence until a matching lineage has been created through the permission-gated Living World service.

The new fixed-step authority kernel binds controller seats to at most eight participants by default, rejects replayed input sequences and turns bounded movement intent into canonical latitude/longitude/elevation. Clients cannot submit position or collision truth. The kernel emits participant upserts as proposals; only the Living World service may commit them. This establishes real authoritative movement and transport seams without claiming that a multiplayer session is currently running.

## Rung 8: stateful water, ground and surface energy

Visited 0.25-degree Earth-system cells now retain physical state instead of regenerating every environmental value from the coordinate. Land cells carry ponded water, snow-water equivalent, root-zone and deep-soil reservoirs, aquifer storage, water-table depth, soil freeze and surface temperature. Their daily flux path includes rain, snow, melt, infiltration, evaporation, transpiration, percolation, recharge, capillary rise, surface runoff and baseflow. Turning Life off removes transpiration while leaving the abiotic water cycle active.

Ocean cells carry mixed-layer depth, temperature, heat content, freshwater anomaly, salinity and thermodynamic sea ice. Local water and energy ledgers expose numerical residuals, and the tests require them to close across wet, dry, snow, melt and ocean cases. Current runoff and baseflow modulate streamed river discharge without changing stable reach IDs or canonical long-term discharge. The sparse column cache persists in the revisioned browser envelope and refuses backward time.

At this rung the surface columns were locally conservative but not a global circulation model; lateral atmospheric moisture, ocean currents and neighboring aquifer exchange were still prescribed boundary forcing. Rung 9 replaces the loaded-neighbor portion of that forcing with explicit transport.

## Rung 9: conservative neighboring-cell transport

The active expedition now synchronizes a 3 Ã— 3 domain of canonical 0.25-degree cells. Loaded cardinal neighbors exchange atmospheric moisture and sensible heat, land aquifers exchange groundwater according to hydraulic head, and ocean neighbors mix freshwater anomaly and mixed-layer heat. Every transfer is derived from the pre-step graph and applied simultaneously, making the result independent of caller ordering.

Conservation is area weighted on the sphere: one millimeter in a high-latitude cell is not treated as the same water volume as one millimeter near the equator. Receipts report transferred kilograms and joules plus residuals. Missing neighbors remain explicit unresolved boundaries, and stale-time or mixed-profile edges refuse exchange rather than leaking state. Transport clocks and receipts survive browser save/restore independently for each condition profile.

This is still sparse local-to-regional transport, not global atmospheric or ocean circulation. Atmospheric moisture transport is not yet closed into local precipitation and evaporation, and there are no long-range pressure waves, resolved winds, river-to-ocean routing, ocean gyres or three-dimensional aquifers yet.

## Rung 10: closed atmospheric water and receipted runoff

Atmospheric precipitable water is now a real reservoir in every Earth-system column. Rain and snow withdraw from it, moisture-starved storms are supply limited, and evaporation plus transpiration return surface water to the same atmosphere. Deterministic weather relaxation remains a visible signed boundary-convergence term rather than hidden mass creation. The local ledger now closes atmosphere, surface, snow, soil, aquifer, runoff queue, ocean and sea ice together.

Land runoff and baseflow no longer disappear at the edge of the local column. They enter a persistent routing queue. Each transport step advances the pre-step queue toward the steepest lower loaded cardinal neighbor, one cell per step; land keeps the incoming channel water in its queue while a coastal ocean receives the exact area-weighted freshwater mass and updates salinity. If no lower downstream neighbor is loaded, the water remains queued and the receipt explains the unresolved boundary.

This closes the local-to-neighbor water path without pretending the sparse 0.25-degree graph is already the complete river network. The next bridge must reconcile these routing queues with the finer stable `hydro-reach:v2` drainage topology, including explicit downstream continuation outside the active 3 Ã— 3 domain.

## Rung 11: persistent basin and ocean-mouth bridge

The coarse Earth-system grid and fine canonical drainage grid now exchange water through a typed transport seam. A land-cell runoff queue enters one deterministic main reach only when a paired inlet receipt records the same kilogram debit at the Earth cell and credit at the reach. Reach storage is persistent, condition-profile isolated and keyed by the stable `hydro-reach:v2` identity rather than by disposable render coordinates.

Loaded reaches advance from the same pre-step state, so a pulse cannot teleport through several channels in one invocation. Reach-to-reach transfers retain exact source and receiver IDs. An ocean outlet delivers freshwater only when the canonical ocean Earth cell containing its mouth is loaded; the mouth receipt, river-storage debit and ocean freshwater credit close one mass ledger. Missing downstream reaches, unloaded sectors and unloaded mouth cells retain the water in channel storage and publish a typed boundary receipt.

The coarse topographic Earth-cell route remains as a fallback for queued water that has no loaded canonical river inlet. Rung 11 is therefore a conservative loaded-basin bridge, not a claim that every global basin is continuously active. At that rung, a planet-wide depression-filled graph, endorheic spill behavior and floodplains remained later work. Rung 36 later adds finite grain routing and Rung 37 bounded floodplain exchange through this bridge, while resolved channel morphology remains unsolved.

## Rung 12: loaded pressure mass and tangent momentum

Surface pressure now has a transported physical meaning: it represents dry-air column mass over each loaded spherical cell. A typed sender/receiver receipt moves that mass down a loaded pressure difference and carries the donor's eastward and northward momentum with it. Transfers use the same pre-step graph and simultaneous application as the water and heat paths, so caller ordering cannot choose the result.

Pressure-gradient wind forcing is bounded and separately receipted. The momentum ledger accounts for the exact applied eastward/northward impulse before checking its numerical residual, and one shared limiter keeps every resulting wind at or below 90 m/s without silently clipping individual cells. The live weather readout now uses the carried Earth-column pressure and vector wind; procedural synoptic values remain named boundary-forcing targets.

At Rung 12 this was a loaded-domain tangent-momentum model without planetary rotation. It still had no vertical layers, global-angular-momentum solve, pressure-wave propagation across unloaded cells, turbulence closure or scientific forecast authority; Rung 13 adds the bounded Coriolis and energy terms below without erasing those limits.

## Rung 13: planetary rotation and atmospheric kinetic energy

Every loaded atmospheric column now receives a typed latitude-aware Coriolis rotation. The deflection uses the planet's declared 86,400-second rotation period, turns opposite ways across the equator and rotates the tangent wind vector exactly, so it changes direction without inventing wind speed or kinetic energy. The resulting eastward and northward impulses are recorded as exchange with planetary rotation rather than mislabeled as internal neighbor transport.

Atmospheric kinetic energy now has its own ledger. Moving dry air carries donor momentum; mixing different winds may dissipate kinetic energy and records that loss. Pressure impulses record their work, Coriolis records its near-zero numerical work, and the final stored vector closes against those terms. The live console exposes local rotation per step, mixing dissipation and the residual.

This still is not a global circulation or angular-momentum solver. There are no vertical pressure levels, resolved convection, turbulence closure, jet-stream continuity across unloaded cells or two-way solid-planet spin response.

## Rung 14: cloud liquid and atmospheric moist enthalpy

Atmospheric water is now split into transported vapor and bounded cloud liquid. Each local step emits a typed receipt for condensation, cloud evaporation and cloud-liquid precipitation. Condensation warms the single atmospheric layer, cloud evaporation cools it, and long steps can repeat bounded condensation-to-precipitation subcycles without ever holding more than the declared instantaneous cloud-water limit. Precipitation still cannot exceed the water actually available above the minimum vapor reservoir.

The atmospheric energy ledger now follows sensible heat plus vapor latent energy. It exposes diagnostic boundary enthalpy, exact internal phase exchange, surface latent input and the final numerical residual. Neighbor transport moves vapor and cloud liquid separately and closes their combined water plus moist enthalpy across the loaded graph. The live console exposes the local phase receipt and moist-enthalpy closure.

This is a conservative single-layer bulk parameterization, not resolved cloud droplets or ice crystals, aerosols, convective towers, vertical pressure levels, radar-quality precipitation or a scientific forecasting model.

## Rung 15: boundary layer and free troposphere

The atmospheric column now persists two hydrostatically partitioned reservoirs: a 25% pressure-thickness boundary layer and a 75% free troposphere referenced at 4.5 km. Each layer owns temperature, vapor and bounded cloud liquid. Upper-air condensation and cloud evaporation have a separate typed receipt and return latent heat to the free-troposphere sensible-energy reservoir; upper condensate does not directly bypass the boundary precipitation path.

A bounded lapse-rate response now exchanges sensible heat, vapor and cloud liquid between the layers. It applies equal gross dry-air parcel exchange, so neither layer silently gains dry mass, and records the exchange fraction, gross mass, tracer direction, lapse rate and numerical closure in a typed receipt. Water and two-layer moist enthalpy close across the exchange. Existing one-layer v7 saves migrate by partitioning their stored vapor and condensate without creating or deleting water.

Loaded-neighbor atmospheric transport remains a boundary-layer process at this rung, while eastward/northward wind remains column-mean momentum. This is not resolved three-dimensional convection, buoyancy or gravitational-potential work, cloud microphysics, upper-air horizontal transport, turbulence closure, a global circulation model or a scientific forecast.

## Rung 16: independent upper-air transport and geopotential receipts

Loaded boundary-layer and free-troposphere air now travel as independently conserved dry-mass reservoirs. Each layer owns its wind vector and carries vapor, cloud liquid and sensible enthalpy with the moving dry-air parcel; bounded mixing remains separately receipted. Pressure-gradient impulses, Coriolis rotation, tangent momentum and kinetic-energy closure are reported per layer as well as for the combined loaded atmosphere. The hydrostatic pressure partition may now evolve instead of being reset to 25/75 after every step.

Terrain-following transport now records the gravitational potential energy carried between representative layer heights and the exact adjustment work required at the destination. Vertical exchange records equal gross upward and downward geopotential transfers plus independently closed eastward and northward momentum. Existing v8/two-layer saves migrate without inventing upper-air shear or changing stored water.

These receipts expose the energetic boundary honestly; they do not yet solve buoyancy conversion or three-dimensional gravity work. The loaded graph remains a sparse bulk atmosphere rather than a continuous global circulation, angular-momentum, convection, turbulence, cloud-microphysics or scientific forecasting model.

## Rung 17: buoyant overturning and convective kinetic energy

The two-layer vertical exchange is now an explicit closed overturning loop: every dry-air updraft has an equal compensating downdraft, so a local convective step cannot manufacture net layer mass. A lifted parcel uses vapor- and cloud-adjusted virtual temperature to diagnose positive buoyancy only when the lapse rate is supercritical. Bounded buoyancy work converts moist sensible enthalpy into a persistent column convective-kinetic-energy reservoir and a diagnostic vertical-velocity proxy.

Stored convective kinetic energy decays on a declared time scale and returns to sensible heat. Horizontal momentum lost through vertical parcel mixing is likewise thermalized rather than deleted. The v2 vertical receipt closes water, eastward/northward momentum, horizontal kinetic energy, convective kinetic energy, moist-enthalpy mechanical conversion, equal gross pressure/geopotential work and their combined resolved energy. Existing v9 saves migrate with an empty convective reservoir and invalidate the accidentally mis-versioned R16 v1 vertical receipt instead of laundering it into the corrected lineage.

This resolves buoyancy conversion only inside the bounded two-reservoir parameterization. It is not a resolved cloud plume, downdraft shaft, vertical velocity field, entrainment profile, pressure-coordinate circulation, turbulence closure or three-dimensional convection model.

## Rung 18: persisted pressure-coordinate atmosphere

Each Earth-system cell now owns eight bottom-to-top pressure-thickness layers. Every native layer
persists dry-air mass, temperature, vapor water, cloud liquid, eastward/northward momentum and the
derived sensible, latent, kinetic and geopotential-energy terms. Contiguous interface pressures and
terrain-following interface heights are rebuilt with the hypsometric relation using each layer's
virtual temperature. The highest layer closes the remaining column pressure against a declared
0.1 hPa geometry floor, avoiding an infinite model-top height while retaining the complete dry-air
mass.

The existing boundary-layer and free-troposphere fields are now an explicit compatibility projection:
two native lower layers aggregate into the boundary band and six aggregate into the free band. Local
phase change, vertical overturning and loaded horizontal transport still act on those two aggregates;
after each forcing step a typed reconciliation receipt maps the changed pressure, vapor, cloud,
temperature and tangent momentum back into the eight layers. Pressure-layer masses and reservoirs
match the aggregate targets while the finer vertical temperature anomalies persist. If native wind
shear would violate the 90 m/s contract, its anomalies are reduced coherently around the requested
band mean so aggregate momentum still closes.

Existing v10 saves migrate into the eight-level schema without changing surface pressure,
atmospheric water, two-band moist enthalpy or tangent momentum. Existing v11 saves restore exactly,
including the native profile digest and its latest reconciliation receipt. This rung establishes a
real persistent vertical coordinate, but native pressure-level phase change, vertical transport,
entrainment and lateral advection remain future work; it does not claim that duplicating current
two-band forcing across a finer state is already pressure-level dynamics.

## Rung 19: native pressure-level thermodynamics and descent

Local atmospheric thermodynamics now run on all eight pressure levels. Each level derives its own
saturation capacity from dry-air mass, center pressure and temperature, persists bounded cloud liquid,
and emits a typed vapor/cloud/latent-heat receipt. Long storms can use bounded condensation/fallout
subcycles, while every upper-level precipitation source names every crossed native interface and an
exact surface credit. The established two-band phase receipts remain compatibility summaries for UI
and older consumers; they no longer drive the actual phase calculation.

All seven adjacent native interfaces now exchange equal gross dry-air parcels plus sensible heat,
vapor, cloud liquid and tangent momentum. Momentum-mixing kinetic loss is returned to native sensible
heat. A composite receipt closes native water, moist enthalpy, eastward/northward momentum, horizontal
kinetic energy and resolved energy and contains the eight phase receipts, seven exchange receipts and
all precipitation-descent routes. Engine v12 persists this evidence; v11 snapshots migrate without
inventing a receipt for work they never ran.

This is a genuine native-thermodynamics rung, not the end of atmospheric work. Loaded horizontal
advection and the bounded buoyancy/convective-kinetic-energy core still operate through the two-band
compatibility seam, so the broad `pressureLevelDynamicsResolved` claim stays false. Resolved vertical
momentum, entrainment, turbulence, aerosol/droplet/ice microphysics, three-dimensional convection and
scientific forecast authority remain later rungs.

## Rung 20: native eight-level horizontal atmosphere

Loaded cardinal neighbors now exchange dry air independently across all eight persisted pressure
levels. Each level combines bounded pressure-gradient and tangent-wind/Courant transport, and its dry
air carries native vapor, cloud liquid, absolute sensible enthalpy and tangent momentum. Separate
native mixing receipts cover those tracers, while pressure-gradient impulses, latitude-aware Coriolis
rotation and terrain-following geopotential adjustment are recorded at the same level resolution.

The typed domain receipt contains eight ordered conservation ledgers plus exact sender debit and
receiver credit for every routed quantity. Water, moist enthalpy, eastward/northward momentum,
horizontal kinetic energy, geopotential energy and resolved energy close after their named forcing,
mixing and geometry terms. Every destination column persists a compact local receipt tied to the
domain digest. The lower-two and upper-six UI fields are now projections of the transported native
state. Their lost within-band kinetic and height variance is explicitly receipted rather than
misreported as physical loss.

Engine v13 preserves that lineage; v12 snapshots migrate with native-horizontal truth false unless a
valid receipt actually exists. The broad `pressureLevelDynamicsResolved` claim remains false because
the buoyancy and convective-kinetic-energy core is still the bounded two-band compatibility model.
Continuous unloaded-cell circulation, a global angular-momentum solve, resolved vertical momentum,
entrainment, turbulence and scientific forecast authority remain later work.

## Rung 21: native pressure-interface convection

The last two-band physics dependency has been removed from local atmospheric stepping. All seven
pressure interfaces now own persistent convective kinetic energy, a bounded updraft velocity and an
exact compensating downdraft momentum. Each interface lifts the lower parcel through its actual
hypsometric separation, compares virtual temperature with the adjacent ambient layer, and converts
only bounded positive buoyancy work from sensible heat into its own kinetic reservoir. Stable motion
decays on the declared time scale and returns the lost kinetic energy to the two adjacent layers.

The v2 native dynamics receipt and its seven typed buoyancy/interface receipts record pressure and
geopotential conversion, equal-gross dry-air exchange, bulk entrainment/detrainment, water tracers,
tangent momentum, vertical momentum, horizontal and convective kinetic energy, thermalization and
resolved-energy residuals. The v3 vertical receipt remains a compatibility projection for older UI
consumers; it no longer runs a second two-band physical process. `pressureLevelDynamicsResolved` is
therefore true for a column only after that native local step has actually produced valid evidence.

Engine v14 persists the seven interface reservoirs. A v13 save maps its old two-band convective
energy onto the exact boundary/free interface, invalidates obsolete v1/v2 dynamics receipts, and does
not claim that native interface work occurred before the next real step. This is still a bounded bulk
column parameterization—not a resolved three-dimensional plume, turbulence closure, cloud
microphysics, global circulation model or scientific forecast.

## Rung 22: native mixed-phase clouds and typed precipitation

All eight pressure levels now persist cloud liquid and cloud ice independently. Saturation blends
over water and ice, while condensation, deposition, evaporation, sublimation, cloud freezing and
cloud melting exchange vaporization and fusion energy with the exact native layer. The declared
moist-enthalpy convention uses liquid as the phase reference, adds vapor latent energy and subtracts
cloud-ice fusion energy, so internal phase changes close without hidden heat.

Precipitation routes now carry rain and snow as typed mass. A falling route visits every crossed
native interface; snow can melt in a warm receiving layer and rain can refreeze in a cold one, with
the fusion heat applied to that layer and recorded in the route. Land snowpack, ocean rain/snow
fluxes and visible weather phase consume the physical surface result instead of reclassifying total
precipitation from a temperature label. Cloud ice is also a native tracer in adjacent vertical and
loaded horizontal transport.

Engine v15 migrates v14 liquid-only saves by adding explicit zero-valued ice reservoirs without
inventing mixed-phase history. The v3 dynamics receipt, v2 phase and descent receipts, v2 native
horizontal receipt and v5 Earth transport receipt close mixed-phase water and fusion-aware energy.
This remains bounded bulk microphysics: individual droplets, crystals, aerosols, collision and
coalescence are deliberately not claimed.

## Rung 23: mixed-phase radiation and persistent frozen-surface feedback

The native cloud reservoirs now alter the surface-energy path. Each of the eight pressure levels
contributes its independent liquid and ice water path to a broadband shortwave optical depth and
longwave emissivity. The resulting v1 radiation receipt records top-of-atmosphere forcing, clear and
cloudy transmissivity, absorbed surface sunlight, upward/downward infrared, mixed-phase cloud forcing
and the dynamic surface albedo. A held clear/cloudy test proves that this is causal: native condensate
changes both absorbed sunlight and the surface heat tendency under otherwise identical forcing.

Land snow now persists an age that darkens its albedo between fresh snowfall events. Ocean cells retain
snow on the sea-ice fraction separately from liquid seawater, use salinity to derive the local freezing
point, and derive ice concentration/thickness from conserved ice water equivalent. Snowmelt,
sublimation, ice growth and ice melt enter a v1 cryosphere phase receipt. The surface-energy ledger uses
liquid water as its reference and includes the exact fusion storage change plus the phase enthalpy of
incoming snow; frozen water therefore cannot change phase for free.

Engine v16 migrates v15 columns with explicit zero-age/no-receipt defaults and does not invent prior
radiation or fusion evidence. This is a bounded broadband and thermodynamic treatment, not spectral
radiative transfer, resolved snow grains, brine pockets, leads, ridging, dynamic sea-ice motion or a
scientific climate model.

## Rung 24: persistent land ecology and coupled carbon-water feedback

Land columns now contain a persistent ecology checkpoint instead of reconstructing vegetation from a
biome label on every frame. Nine bounded functional types derive canopy cover, leaf area, height, root
depth, roughness and canopy albedo from the canonical biome and climate. Carbon is retained in living
biomass, litter, soil organic matter and a local exchangeable atmospheric proxy. Nitrogen is retained
in living, litter, organic-soil and mineral pools.

Each real Earth-system step records absorbed-light gross primary production, nitrogen-limited retained
growth, autotrophic and heterotrophic respiration, litterfall, humification, mineralization and uptake.
The v1 land-ecology flux receipt closes both local carbon and nitrogen exactly. Plant water demand is
derived from the active canopy and roots; canopy and litter shade bare-soil evaporation. Canopy cover
also alters surface albedo, while canopy height alters aerodynamic roughness and sensible exchange.
These are therefore physical feedbacks, not display-only vegetation statistics.

Turning Life off freezes every ecology pool and produces a dormant zero-flux receipt while abiotic
water, atmosphere, radiation and cryosphere organs continue. Engine v17 migrates v16 columns with an
empty ecology checkpoint and no fabricated historic receipt; the first subsequent physical step seeds
and advances the organ from the column's real sample. This remains a bounded functional-type model
with a local carbon proxy—not individual plants, species succession, mechanistic photosynthesis,
globally mixed atmospheric CO2, nutrient transport, or a scientific Earth-system model.

## Rung 25: persistent ocean ecology and mixed-layer biogeochemistry

Ocean columns now retain dissolved inorganic and organic carbon, phytoplankton, zooplankton,
detritus, dissolved and biological nitrogen and phosphorus, and dissolved oxygen beside local
exchangeable atmospheric carbon and oxygen proxies. Light, temperature, sea ice, nitrogen and
phosphorus limit marine primary production. Grazing, mortality, oxygen-limited respiration and
remineralization return matter through the mixed layer, while chlorophyll, euphotic depth, oxygen
saturation and hypoxia are derived from the persistent reservoirs.

The v1 marine flux receipt independently closes carbon, nitrogen, phosphorus and the declared oxygen
flux ledger. Turning Life off freezes plankton, marine organic carbon and nutrients but keeps physical
air-sea C/O2 exchange active. Loaded ocean neighbors simultaneously mix fourteen dissolved,
plankton and detrital pools with area-weighted element conservation and typed donor/receiver receipts.
Loaded river mouths add explicit parameterized dissolved C/N/P/O2 concentrations beside freshwater;
this is deliberately not a claim that upstream river chemistry reservoirs already exist.

Engine v18 migrates v17 ocean columns through an empty checkpoint without inventing plankton or prior
flux evidence, then initializes the organ on the first real step. The local atmospheric gases are not
globally mixed, transport covers loaded surface neighbors rather than 3D currents, and plankton are
bulk functional pools rather than resolved organisms or mechanistic biochemistry.

## Rung 26: persistent river chemistry and exact ocean delivery

Canonical river reaches now retain dissolved inorganic and organic carbon, inorganic nitrogen and
phosphorus, and dissolved oxygen beside their water storage. A land-to-reach inlet adds a typed,
explicitly parameterized headwater chemistry boundary. Every loaded reach-to-reach move derives water
and solutes from the same pre-step state and records equal sender debit and receiver credit, so newly
received material cannot jump across multiple reaches in one invocation.

At a loaded ocean mouth, the v2 receipt removes the exact persistent C/N/P/O2 pools from the river and
credits those exact quantities into the receiving marine mixed layer. River-only, ocean-only and
combined ledgers are separately checked. Unloaded downstream handoffs retain both water and chemistry.
A v1 water-only basin snapshot migrates with an explicit empty chemistry checkpoint rather than
inventing historical solutes.

The upstream land-runoff concentrations remain a declared boundary: land ecology does not yet own and
debit complete C/N/P/O2 export reservoirs. At that rung, in-channel reactions, sediment, floodplains and a global
always-loaded basin network remain later work.

## Rung 27: persistent estuary processing

Loaded ocean mouths are now persistent material processors rather than transparent pipes. The v1
estuary organ consumes oxygen while converting a bounded fraction of dissolved organic carbon into
dissolved inorganic carbon, retains organic carbon, nitrogen and phosphorus in persistent sediment,
and exposes oxygen-sensitive denitrification as a named nitrogen-gas boundary. The ocean receives
only the remaining dissolved material, while the full river sender debit is partitioned exactly among
ocean credit, estuary storage, nitrogen loss and oxygen consumption.

River-only, estuary-only, ocean-only and combined C/N/P/O2 receipts close independently. Basin v2
snapshots migrate to v3 with explicit empty estuary storage rather than invented historical sediment.
The implementation is a bounded bulk reactor: it does not resolve tides, salinity wedges, sediment
resuspension, coastal currents or an atmospheric gas receiver for the declared gas terms.

## Rung 28: persistent deep ocean and biological carbon export

Ocean ecology v2 now carries a persistent deep-water organ below the mixed layer. Signed dissolved
DIC, DOC, inorganic nitrogen, phosphorus and oxygen exchange follows surface/deep concentration
gradients. Mixed-layer detritus sinks with its C/N/P composition, deep remineralization returns it to
dissolved pools only while oxygen is available, and a small fraction moves into persistent seafloor
organic burial. One typed receipt closes the mixed layer and interior together.

New ocean columns initialize bounded deep reservoirs from their canonical ocean sample. Existing v18
mixed-layer snapshots migrate into engine v19 with an explicit empty deep checkpoint, never invented
historical interior matter. Life-off continues physical dissolved exchange but freezes sinking,
remineralization and burial. This is not a 3D ocean-current solver: gyres, overturning water masses,
eddies, bathymetric flow and continuous unloaded-cell circulation remain future organs.

## Rung 29: atmosphere-owned local biosphere gases

Each sparse Earth-system column now owns persistent local carbon-dioxide carbon, oxygen and
nitrogen-gas reservoirs. Land and ocean ecology continue to expose their previous atmospheric fields
for compatibility, but those values are exact mirrors of the atmosphere-owned state rather than
duplicate stores. A typed atmosphere-biosphere receipt records land or ocean exchange and closes C/O2
around every step. Engine v19 saves migrate into v20 by adopting the existing proxy once, with an
explicit checkpoint and no fabricated historical flux.

At loaded ocean mouths, estuary denitrification now has a real persistent receiver. Basin v4 nests an
atmospheric boundary-input receipt inside the mouth receipt, credits nitrogen to the receiving coastal
column, and includes that reservoir in the coupled river/estuary/ocean/atmosphere nitrogen ledger.
Oxygen consumption remains a named estuary reaction term. Atmospheric gases are still local: there is
no horizontal gas transport, global mixing, full atmospheric chemistry or scientific composition
model yet.

## Rung 30: deterministic runtime integrity and handoff

`axm.foundation-planet.system-audit/v1` condenses the major cross-organ claims into a read-only
machine-verifiable report. It checks the current Earth-column lineage, eight-layer/seven-interface
pressure shape, local water and energy residuals, atmosphere-owned gas truth, atmosphere-biosphere
receipt, exact ecology mirrors, deep-ocean lineage, and—when supplied—the latest loaded transport and
basin receipts. Optional seams that have not produced a receipt are reported as unobserved rather than
silently passed.

The browser exposes the report through `AXMFoundationPlanet.audit()` and the streaming diagnostics.
Tests prove both directions: a healthy live-shaped state passes, while a deliberately corrupted
atmosphere/ecology mirror fails at the named check. The audit mutates nothing and does not convert the
procedural model into scientific authority; it is a compact trust and handoff seam for later games,
world organs and AI stewards.

## Rung 31: loaded atmospheric gas transport

Atmosphere-owned carbon-dioxide carbon, oxygen and nitrogen gas now ride the same typed native dry-air
mass routes used by the eight pressure levels. Every gas route names its parent dry-air transfer,
sender, receiver, native level and carried mass. All routes are derived from one pre-transport state and
committed simultaneously, so reversing caller order produces the same state and digest. The domain
receipt closes area-weighted C/O2/N2 mass, while per-column receipts retain incoming, outgoing and final
reservoir lineage. Land and ocean ecology gas fields remain exact compatibility mirrors of the
atmosphere owner after transport.

Engine v20 and atmosphere-gas state v1 snapshots migrate to engine v21/state v2 without inventing a
historical route. Transport step v7 integrates the gas receipt with the existing native dry-air route
ledger and exposes its conservation result to the runtime audit and browser diagnostics. This is sparse
transport between loaded canonical neighbors with explicit unloaded boundaries. It is not global
mixing, continuous circulation through unloaded cells, resolved atmospheric chemistry or a scientific
composition model.

## Rung 32: eight-level atmospheric composition

Carbon-dioxide carbon, oxygen and nitrogen gas are now persistent reservoirs in each of the eight
native pressure layers rather than one whole-column amount copied onto every horizontal route. Land,
ocean and estuary exchange enters through native layer 0. The local dynamics step consumes the same
seven adjacent dry-air exchange receipts already produced by the pressure organ and conservatively
mixes each gas across the named lower/upper interface. A typed vertical receipt retains initial and
final layer inventories, per-interface net material, throughput and exact C/O2/N2 closure.

Horizontal routes now sample the sender's pre-transport composition at the route's own native level.
The domain receipt contains eight ordered conservation ledgers and explicitly records that no
whole-column average was used. Engine v21/state v2 snapshots migrate to engine v22/state v3 by
partitioning their exact bulk reservoirs according to persisted pressure-layer dry-air fractions; this
is a migration checkpoint, not fabricated historical vertical or horizontal transport. Transport step
v8 and route/local receipt v2 provide the new lineage. The eight layers remain bounded bulk composition
reservoirs, not molecular diffusion, reaction chemistry, three-dimensional plumes, circulation through
unloaded cells, global mixing or a scientific atmospheric-composition model.

## Rung 33: atmosphere-owned CO2 radiative feedback

The persistent carbon inventory now affects the surface-energy path. A replaceable
`atmosphere-co2-radiation` organ reads all eight typed gas layers together with their native pressure
thicknesses and temperatures. It derives a concentration and bounded grey optical depth for each
path, integrates each layer's temperature-dependent downward-longwave contribution through the
layers below it, and compares that result with a 420 ppm reference using the same temperature profile.
The comparison is exactly neutral for a true 420 ppm fixture, responds monotonically above and below
that reference, and distinguishes equal total carbon placed in warm low air from carbon placed in cold
high air.

`surface-radiation-receipt/v2` nests the complete eight-layer CO2 receipt. Its cloud-overlap mask and
bounded surface adjustment enter the existing closed surface-energy ledger, so the result changes
heat storage rather than merely appearing as a diagnostic. The runtime exposes native ppm, signed
longwave adjustment and observed layer count. Engine v22 snapshots migrate to v23 by invalidating old
v1 radiation receipts; the first real post-migration step earns v2 evidence instead of having it
fabricated during restore.

This is a deliberately modest causality rung, not a spectral or line-by-line radiative-transfer solver.
The calibration is a bounded broadband grey-gas proxy, cloud overlap is bulk-parameterized, and no
scientific climate accuracy is claimed. Radiation consumes the atmosphere-owned profile present at
the start of a local step; biosphere and transport changes therefore affect the following local
radiation step.

## Rung 34: finite soil-water and runoff biogeochemistry

Land runoff chemistry is no longer created at a river inlet from a concentration formula. Every new
land column owns finite dissolved inorganic and organic carbon, inorganic nitrogen, inorganic
phosphorus and dissolved oxygen in its soil-water organ. A wet local step mobilizes a bounded fraction
from those persistent donors into a persistent runoff-biogeochemistry queue using the same generated
runoff event. The soil debit and queue credit close per pool; a dry step exports nothing.

Loaded topographic routing moves the same fraction of queued C/N/P/O2 as queued water. A land receiver
gets an area-weighted queue credit, while a loaded coastal ocean gets an exact dissolved-pool credit.
Canonical basin capture likewise debits the Earth cell's queue before crediting its persistent river
reach, and both sides carry one transfer identity. Basin v5 therefore treats land runoff chemistry as
an internal reservoir in the river/estuary/ocean/atmosphere ledger instead of subtracting an external
headwater boundary.

Engine v23 saves migrate to v24 with explicit empty soil and runoff checkpoints. The first real local
step establishes a declared canonical soil initial condition but exports no historical material; only
a following genuine runoff step may mobilize it. Old transport and basin receipts are invalidated
rather than relabeled as sender-debit evidence. This remains bounded bulk soil-water chemistry—not
mechanistic weathering, sorption, redox kinetics, soil horizons, pore flow or a scientific watershed
model.

## Rung 35: renderer-independent experience membrane

Caelus can now seal the currently loaded sector into
`axm.foundation-planet.experience-sector-capsule/v1`. The capsule is a deterministic, renderer-free
projection of canonical coordinates, environment, active layers, physics frame, loaded hydrology,
Earth-system state and regional ecology. Its world lineage, source revision, save checksum and six
component digests feed one capsule digest. Reordering set-like rivers, lakes, handoffs or species cannot
change the result; changing a semantic field does. A changed component under an old digest is refused.

`axm.foundation-planet.experience-lease/v1` makes three different relationships explicit. An observer
may receive structured state but cannot propose world actions. A player may create a typed
`axm.foundation-planet.world-action-proposal/v1`, but the proposal carries no apply or reset authority
and binds itself to the source revision for governed review. A sandbox may fork a complete detached
candidate in which creative mutation is permitted, but that candidate cannot write back, promote
itself or become canonical planet state. Every intent is actor-, lease-, capsule- and sequence-bound;
stale or replayed sequences are refused.

`axm.foundation-planet.experience-protocol-audit/v1` verifies capsule and component digests, the
authority membrane, lease lineage, intent receipts, unapplied proposals and sandbox detachment without
mutating Caelus. API v31 exposes capture, lease, dispatch and audit functions. This is preparation for
future Mirror, Holodeck and Experiment World brokers, not a claim that any of them is connected. Actual
writeback or automatic integration remains a deliberate human-governed checkpoint.

## Rung 36: finite geomorphic sediment cycle

Land no longer exports an unowned erosion-rate fiction. Each canonical land column owns a finite
`axm.foundation-planet.surface-sediment-state/v1` inventory split into clay, silt, sand and gravel.
Soil depth, substrate texture and bulk density establish the declared initial material. Surface
runoff, rain impact, slope proxy, canopy/litter protection and freeze state mobilize only a bounded
fraction. The exact surface debit credits a persistent
`axm.foundation-planet.runoff-sediment-queue/v1`; dry steps export zero and an exhausted grain donor
cannot go negative.

Loaded topographic transport moves sediment with the exact routed water fraction. Land receivers get
area-weighted queue credits, while loaded ocean receivers gain persistent suspended and deposited
coastal material. Canonical basin inlet v5 debits the same land queue before crediting persistent
river suspended load. Basin engine v6 routes that load from the pre-step reach state, partitions each
grain between persistent river-bed deposit and downstream export, retains all material at unloaded
handoffs, and grain-selectively credits a loaded coast at a river mouth. Clay remains more mobile;
sand and gravel settle more readily. Every surface, neighbor, river and coast seam carries paired
typed receipts and a per-grain conservation ledger.

Earth engine v24 and basin v5 snapshots migrate with explicit empty sediment checkpoints and no
invented historical erosion. The first land step after migration establishes finite ownership but
exports nothing. Old transport and basin receipts are invalidated instead of being relabeled as
current sediment evidence. The renderer-independent experience capsule now preserves surface,
runoff and coastal sediment state for future observer/player/game layers, and API v32 exposes the
organ description and complete state.

This is a finite, persistent geomorphic material cycle—not a scientific erosion or landscape
evolution solver. Erosion and deposition are bounded bulk parameterizations. Mechanistic soil
formation, abrasion, entrainment thresholds, channel cross-section evolution, bank migration,
delta geometry, resolved coastal morphodynamics and a continuously active global sediment network
remain explicit gaps. Rung 37 below supersedes only the absence of bounded loaded-reach floodplain
exchange; it does not claim resolved inundation hydraulics.

## Rung 37: persistent conservative floodplains

Loaded canonical reaches now own `axm.foundation-planet.floodplain-state/v1`. The state persists
overbank water, dissolved C/N/P/O2 chemistry, suspended clay/silt/sand/gravel and deposited mineral
material beside—not inside—the channel reservoirs. Reach length, width and depth form an explicit
parameterized bankfull storage threshold. Water above that threshold can cross into floodplain
storage, while a bounded recession timescale can return only water, chemistry and suspended grains
the floodplain actually owns.

`axm.foundation-planet.floodplain-exchange-receipt/v1` records both directions, the exact bankfull
control, grain-selective overbank entrainment, grain-selective settling and combined water, chemistry
and per-grain residuals. Coarse grains settle more readily; persistent deposits do not disappear when
the reach leaves the loaded sector. Basin engine v7 includes floodplain reservoirs in the same coupled
water, chemistry and sediment ledgers as channel, runoff, coast and estuary storage. Unloaded reach
receipts name retained floodplain water and mineral mass.

Basin v6 snapshots migrate through explicit empty floodplain checkpoints. Their first current step
cannot invent historical flooding or deposits, and old basin receipts are discarded instead of being
relabelled as observed floodplain evidence. The read-only system audit independently validates every
floodplain receipt, and API v33 exposes compact floodplain state to the interface and governed
experience capsule.

This is a bounded reach-scale storage organ, not a two-dimensional inundation solver or scientific
flood forecast. It does not rasterize water depth across terrain, resolve levees and bank failure,
erode channel banks, remobilize old deposits, couple vegetation succession to flooding, or advance
unloaded reaches continuously.

## Rung 38: persistent flood-pulse memory and habitat potential

Every persisted reach now also owns
`axm.foundation-planet.floodplain-habitat-state/v1`. This read-only observer
remembers genuinely observed wet and dry days, consecutive wet and dry
spells, flood-pulse count, fraction-weighted inundation exposure, a rolling
30-day hydroperiod, peak inundation and newly observed deposits. Dissolved
C/N/P and fine deposits provide bounded fertility signals; the observer never
debits, credits or otherwise mutates the floodplain material state it reads.

`axm.foundation-planet.floodplain-habitat-receipt/v1` binds every memory
transition to the exact floodplain-exchange digest and before/after material
digests. It projects a normalized five-part potential mosaic: open water,
mudflat, reed/sedge, wet meadow and riparian woodland. Basin engine v8
persists this memory, retains it across unloaded handoffs, produces
reach-order-invariant receipts and migrates v7 snapshots through an explicit
checkpoint. The checkpoint records current water and deposit baselines but
adds no historical days or flood pulses. The system audit independently
checks normalization, observer purity, memory monotonicity and truth
boundaries. API v34, the live diagnostics and experience capsules expose the
compact result.

These fractions describe habitat potential, not living vegetation. Rung 38
does not create plant biomass, species occupancy, population abundance,
succession, competition, mortality, seed dispersal, resolved wetland
topography or scientific wetland forecasts. A later ecology organ may consume
this potential through its own finite populations and receipts; it must not
retroactively relabel this observer as those populations.

## Rung 39: bounded flood-event chronicle

Every persisted reach now owns
`axm.foundation-planet.flood-event-history-state/v1` beside its material
floodplain and habitat-potential memory. The organ observes the exact current
floodplain-exchange receipt and records genuine event start, continuation and
completion boundaries. Each event retains wet duration, observation count,
peak water, peak inundated fraction, fraction-weighted inundation exposure,
overbank and return water, dissolved C/N/P/O2 payload, typed overbank grains
and typed deposited grains. It never owns or mutates those material pools.

Completed events enter a deterministic archive bounded to the most recent 32
events per reach. Lifetime completion and eviction counts, mean completed
duration, mean recurrence interval and historical peaks remain compact
statistics when older detail is evicted. Basin engine v9 binds every
`axm.foundation-planet.flood-event-transition-receipt/v1` to the exact
floodplain-exchange digest, includes event state in snapshot/restore and
unloaded-reach retention, and remains invariant to caller reach order. The
read-only audit independently rejects material mutation, broken lifecycle
claims, mismatched exchange lineage and archives beyond the declared bound.
API v35 and experience capsules expose a compact semantic projection.

Basin v8 snapshots migrate with an empty event checkpoint. If the material is
already wet, the organ waits for a genuine dry boundary before allowing a new
event to begin; it never converts an unknown pre-migration wet spell into
invented history. This is a loaded-reach disturbance chronicle, not resolved
hydraulics, a continuously simulated global river history, a scientific flood
frequency model or a forecast. Event completion is recorded at the first dry
observation while event duration counts only observed wet intervals.

## Rung 40: persistent functional-guild floodplain succession

Every persisted reach now also owns
`axm.foundation-planet.floodplain-succession-state/v1`. Five functional guilds
— aquatic pioneers, mudflat annuals, reed/sedge, wet meadow and riparian
woodland — carry finite seed banks plus juvenile and mature cover. Their daily
transition includes explicit local seed production, parameterized external
seed rain, germination, seed decay, recruitment, maturation, ordinary
mortality, flood-caused mortality and competition. Proposed cover is
deterministically limited to 0.98, leaving an explicit bare fraction rather
than silently overfilling the reach.

Every `axm.foundation-planet.floodplain-succession-receipt/v1` binds the
living transition to the exact habitat-memory and flood-event receipts it
consumed. Per-guild seed and cover ledgers expose their before, input, loss and
after terms; the system audit independently checks both closure and the cover
capacity. Flood tolerance changes disturbance mortality by guild, while a
completed event can increase bounded recovery seed rain. Turning Life off
freezes demography and seed banks without deleting history.

Basin engine v10 persists and streams the community, retains its summary at
unloaded boundaries, and keeps state and receipts invariant to caller reach
order. A v9 snapshot receives an empty migration checkpoint: its first step
adds no cover, seeds or living history. API v36, live diagnostics and governed
experience capsules expose the compact semantic state.

This is genuine functional-guild community state, but it is not plant biomass
material ownership, species occupancy, resolved individuals, mechanistic
plant biochemistry or a scientific succession forecast. External seed rain is
an explicit parameterized boundary. Those stronger claims require their own
future organs and evidence.

## Rung 41: material-backed floodplain plants

Floodplain cover no longer has to imply matter that the planet cannot locate.
Each reach now owns
`axm.foundation-planet.floodplain-plant-matter-state/v1`: live,
standing-dead and litter carbon and nitrogen for the same five functional
guilds. New post-R41 juvenile or mature cover demands a finite material target.
The target is credited only after the reach's deterministic donor Earth cell
debits its existing land-ecology live biomass through
`axm.foundation-planet.land-ecology-subgrid-biomass-debit/v1`. Sender and
receiver receipts carry the same per-guild transfer IDs and the receiver binds
the exact sender digest.

This is a subgrid ownership partition, not a second independent biomass pool.
Every basin step audits loaded land live C/N plus all persistent floodplain
plant C/N before and after transfer. Mortality moves live matter to standing
dead, and a bounded guild-specific fall rate moves standing dead to litter;
neither internal transition creates or deletes C/N. Turning Life off freezes
all plant-matter pools.

Basin engine v11 persists the organ and retains it at unloaded handoffs. A v10
snapshot initializes an explicit migration checkpoint: existing R40 cover is
recorded as a legacy unmaterialized baseline, and the first current step
creates no historical matter. Only genuinely new cover after migration can
claim donor-backed biomass. API v37, the live diagnostic row, the read-only
integrity audit and governed experience capsules expose the compact semantic
state.

Phosphorus and plant water remain unowned here because no compatible plant
reservoir exists to debit. Decomposition, respiration, nutrient uptake,
species occupancy, resolved individuals, mechanistic biochemistry and
scientific biomass calibration also remain explicit future organs rather than
being inferred from C/N bookkeeping.

## Rung 42: jointly resource-limited floodplain plants

The existing floodplain water and dissolved-phosphorus reservoirs now provide
the missing compatible owner. Each reach persists
`axm.foundation-planet.floodplain-plant-resources-state/v1` beside its C/N
matter. The new organ owns live tissue water and live, standing-dead and
litter phosphorus for the five functional guilds; its supported-carbon fields
are non-owning references back to the R41 matter receipt and therefore cannot
double-count carbon.

New cover is now jointly limited by four finite resources. Its proposed C/N
demand is first bounded by the loaded donor land cell, while the same growth
is bounded again by the reach's available floodplain water and dissolved P.
Only the shared minimum can become cover. Exact per-guild uptake IDs connect
the floodplain sender debit to the resource receiver. Mortality retains P in
standing dead, releases live tissue water back to the same local floodplain
under a second paired ID, and later transfers standing-dead P to litter.

Basin engine v12 includes live tissue water in the whole loaded water ledger
and plant P in the coupled runoff/river/floodplain/estuary/ocean phosphorus
ledger. Its independent audit checks both sender and receiver schemas,
digests, IDs, guild flows, pool closure and non-owning carbon references. Life
off freezes the organ, unloaded reaches retain it, and forward/reverse reach
orders must reproduce identical receipts and state.

A v11 save migrates without retroactive nutrient creation: existing R41 C/N
is recorded as an unsupported legacy checkpoint and receives zero P and zero
water on that first observation. R42 does not yet model decomposition into
soil nutrients, root hydraulics, transpiration to the atmosphere,
photosynthetic stoichiometry, species occupancy, individuals or scientific
calibration. API v38 and experience capsules expose the bounded state without
granting write authority.

## Rung 43: resource-backed floodplain detrital return

Standing-dead and litter matter now have a conservative downstream path.
Every reach persists
`axm.foundation-planet.floodplain-decomposition-state/v1`, which owns only
bounded process memory and cumulative observations—not carbon, nitrogen or
phosphorus. The actual material remains owned by the R41 plant-matter organ,
the R42 plant-resource organ, and the local floodplain chemistry receiver.

For each guild and detrital pool, decomposition can use only the smaller of
owned plant carbon and its paired resource-backed carbon reference. This
leaves legacy unsupported matter untouched. Moisture, Life abundance,
guild-specific standing-dead and litter rates, and a one-day maximum step
bound the aggregate transfer. Exact shared transfer IDs connect the plant
C/N debit, supported-C/P debit, and local floodplain dissolved-organic-C plus
inorganic-N/P credit. Independent receipts and the basin audit verify each
schema, digest, ID, quantity and C/N/P residual.

Basin engine v13 persists the organ, includes detrital return in the coupled
material ledgers, remains invariant to caller reach order, and explicitly
receipts the cumulative memory of unloaded reaches. A v12 snapshot receives
an empty migration checkpoint: its first v13 observation performs zero
transfer and invents no historical decomposition. Life off freezes the
process and all three transfer paths. API v39, the live diagnostic row and
renderer-neutral experience capsules expose the compact semantic state.

R43 credits only the existing local floodplain chemistry reservoirs. It does
not claim atmospheric respiration, oxygen consumption, soil delivery,
microbial populations, mechanistic biochemistry or scientific calibration.
Those require compatible persistent receivers and separate evidence-bearing
organs before they can affect the planet.

## Rung 44: oxygen-limited local floodplain respiration

Decomposition-returned dissolved organic carbon now has a separate,
conservative aerobic path. Every reach persists
`axm.foundation-planet.floodplain-respiration-state/v1`, which owns process
memory only. Its plan may consume only local floodplain-owned dissolved
organic C and dissolved O2. The paired
`axm.foundation-planet.floodplain-aerobic-mineralization-receipt/v1` debits
that DOC, credits exactly equal dissolved inorganic C to the same floodplain,
and debits O2 at the declared bulk ratio of 32/12 kg O2 per kg C.

Finite local oxygen caps the reaction before chemistry is touched. The
receipt closes the DOC debit, DIC credit, total carbon and O2 debit, while
`axm.foundation-planet.floodplain-respiration-receipt/v1` binds the exact
chemistry digest into persistent observed, dormant and oxygen-limited process
memory. Life off produces zero reaction and freezes the process. Basin engine
v14 includes the oxygen sink in its coupled ledger, preserves caller-order
invariance and explicitly receipts respiration memory retained by unloaded
reaches. A v13 snapshot gains an empty checkpoint whose first v14 step moves
no C or O2 and invents no history. API v40, the live diagnostic row and
renderer-neutral experience capsules expose the state without write
authority.

R44 is a bounded aerobic mineralization organ, not a microbial ecosystem or
scientific soil-water respiration model. It has no atmosphere exchange,
anaerobic pathway, microbial populations, resolved enzyme or redox chemistry,
temperature calibration, soil receiver or scientific calibration claim.

## Rung 45: paired floodplain-atmosphere gas exchange

Loaded floodplains can now exchange material with the already authoritative
eight-layer atmosphere without either owner reaching through the other. Every
reach persists `axm.foundation-planet.floodplain-gas-exchange-state/v1`, a
process-memory organ that owns no carbon or oxygen. It proposes bounded DIC
evasion and oxygen-deficit reaeration, then requires two receipts carrying the
same exchange ID before it can record an observed transition.

`axm.foundation-planet.floodplain-gas-exchange-receipt/v1` debits only local
floodplain dissolved inorganic carbon and credits only local dissolved oxygen.
`axm.foundation-planet.atmosphere-floodplain-gas-exchange-receipt/v1` performs
the opposite sides against native atmosphere layer 0: an exact CO2-carbon
credit and an exact oxygen debit. It refuses surface-layer oxygen overdraw.
The basin v15 ledger verifies both owners, quantities, IDs, digests and four
independent C/O2 residuals; the existing river/floodplain coupled material
ledger also includes the declared cross-owner transfer. The native atmosphere
owner declares a 0.001 kg absolute floating-point bound because the receipt
subtracts tiny local fluxes from planet-cell gas reservoirs; larger residuals
still fail independently of the basin's separate per-identity coupled
aggregate policy.

The exchange is physical and therefore continues when Life is disabled. A v14
save gains zero-history process memory, and its first v15 observation moves no
material. Missing loaded atmosphere produces an explicit zero-transfer process
receipt rather than a fabricated air reservoir. Caller order remains
deterministic, unloaded reach memory is retained, API v41 exposes the live
diagnostic, and renderer-independent experience capsules carry the compact
state without granting mutation authority.

R45 uses bounded exchangeable-DIC and oxygen-saturation proxies. It is not a
bidirectional Henry-law solver, resolved wind/wave or air-water turbulence,
carbonate speciation model, global atmosphere, calibrated reaeration model or
scientific gas-flux claim.

## Rung 46: temperature-aware two-way floodplain carbon exchange

Floodplain and atmosphere owners now support either direction of CO2-carbon
transfer without converting their paired membrane into shared mutable state.
`axm.foundation-planet.floodplain-gas-exchange-state/v2` compares the bounded
exchangeable fraction of local floodplain DIC with a temperature-adjusted
aqueous CO2-carbon equilibrium target derived from the native surface
atmosphere layer's local CO2 ppm proxy. A positive gradient evades carbon to
air; a negative gradient invades the water. The two directions are mutually
exclusive in one transition.

The target uses an explicit reference solubility proxy of 0.167 mg carbon per
litre at 420 ppm and 25 C, adjusted by the local CO2 proxy and a bounded
temperature factor. It does not relabel total DIC as dissolved CO2. The
floodplain owner caps evasion by its actual DIC, while the atmosphere owner
caps invasion by actual layer-0 CO2 carbon and refuses overdraw before
mutation. Oxygen-deficit reaeration remains the paired one-way oxygen path.

Both owner receipts and the process receipt advance to v2. Basin engine v16
verifies the exact exchange ID, exclusive direction, native layer, quantities,
digests and carbon/O2 residuals. A v15 save preserves prior observed and
cumulative evasion/reaeration memory, initializes cumulative invasion to zero,
and requires one zero-transfer checkpoint before the new direction becomes
active. Unloaded reaches retain all three cumulative fluxes. API v42, the live
diagnostic and renderer-independent experience capsules expose this semantic
state without granting mutation authority.

R46 closes the artificial one-way carbon boundary, but it is still a bounded
concentration-gradient parameterization. It is not a full Henry-law or
carbonate-speciation solver, has no pH or alkalinity state, and does not resolve
wind, waves, bubbles, turbulence, barometric pressure or salinity corrections.
Those remain separate realism rungs and scientific-calibration boundaries.

## Rung 47: oxygen-gated floodplain denitrification

Floodplain chemistry now has a bounded anaerobic nitrogen-loss path beside
the existing aerobic DOC mineralization. After aerobic respiration, the
denitrification plan reads floodplain-owned DOC, dissolved inorganic nitrogen
and dissolved oxygen. Activity rises only below a declared 2 mg/L oxygen
threshold, remains limited by living abundance and wetness, and can consume at
most a parameterized reactive nitrate-equivalent fraction of the DIN pool.
The default fraction is 0.5; this is deliberately not a claim that all DIN is
nitrate or that nitrate speciation has been resolved.

The local reaction converts equal DOC carbon to DIC and consumes 14/15 kg N
per kg C, producing the same nitrogen mass as N2-N. A typed floodplain receipt
debits DOC and DIN and credits DIC. Under the same exact transfer ID, a typed
atmosphere boundary receipt credits that N2 to native atmosphere layer 0. The
process receipt binds both owner digests and refuses an active transition when
the matching atmosphere cell is unavailable. Carbon, reaction nitrogen,
cross-owner nitrogen and both owner ledgers are independently audited.

Basin engine v17 persists the process memory, retains it at unloaded reaches,
freezes it with Life off, and migrates v16 saves through one zero-transfer,
zero-history checkpoint. API v43, the live text diagnostic and the
renderer-independent experience capsule expose the compact state without
granting mutation authority.

R47 is an explicit deterministic stoichiometric parameterization. It does not
resolve nitrate/ammonium speciation, microbial populations, redox chemistry,
pH, alkalinity, nitrous oxide, sediment porewater transport or scientific
calibration.

## Rung 48: temperature-responsive floodplain denitrification

Denitrification activity now responds to the loaded Earth-system surface
temperature through a declared water-temperature proxy. The process applies a
bounded Q10-style multiplier to the existing wetness, anoxia and living
activity controls: `Q10^((temperature - reference) / 10)`, with default Q10 2,
reference 20 °C and a final factor bounded to 0.05–4. The compact v2 process
memory records temperature-constrained days and the last proxy temperature,
reference, Q10 and bounded response factor.

Material authority does not change. Floodplain chemistry still owns DOC, DIN
and DIC; native atmosphere layer 0 still owns received nitrogen gas; and the
existing paired v1 reaction and atmosphere boundary receipts still move the
material. The v2 process receipt binds those owner receipts while exposing the
temperature response and truth boundary. Basin engine v18 migrates v17 state
by preserving observation and cumulative-reaction history, initializing only
new temperature history to zero, and requiring one zero-transfer checkpoint.
API v44 and the renderer-independent experience capsule expose the result.

Surface temperature is only a forcing proxy: Caelus does not yet persist
floodplain water temperature, resolve freeze/thaw or use Arrhenius kinetics.
The Q10 value and bounds are configurable model parameters, not calibrated
denitrification-rate claims.

## Rung 49: persistent nitrate and ammonium ownership

River and floodplain chemistry now own nitrate-N and ammonium-N as separate
persistent material pools. Aggregate dissolved inorganic nitrogen remains an
exact compatibility sum of those two owners; it is no longer the only
nitrogen reservoir. Generic land-runoff DIN is partitioned at the receiving
river boundary with an explicit configurable nitrate fraction (0.5 by
default). That partition is a declared model parameter, never a measured
speciation claim.

Reach routing and bankfull floodplain exchange carry both species with the
same exact water fraction and independently close their ledgers. Resource-
backed plant detrital nitrogen returns to the floodplain ammonium pool.
Temperature-responsive denitrification now reads and consumes owned nitrate
only, leaves ammonium unchanged, and binds that nitrate debit to the existing
DOC/DIC and native-atmosphere nitrogen-gas owner receipts. The runtime audit
checks both species, their aggregate compatibility sum, owner lineage and
cross-boundary conservation.

River chemistry state v3, floodplain state and exchange receipt v2,
denitrification state and process receipt v3, and basin engine v19 carry the
new contract. A v18 basin snapshot retains total DIN and cumulative reaction
history, initializes legacy aggregate DIN 50/50 as an explicit model
initialization, drops legacy receipts, and requires one zero-transfer v19
migration checkpoint. API v45 and renderer-independent experience capsules
project the owned species read-only.

R49 does not add nitrite, nitrification, pH or alkalinity. Nitrification is a
future reaction rung because it must debit oxygen and represent its associated
alkalinity demand rather than silently relabel ammonium as nitrate; see the
[EPA Nutrient Control Design Manual](https://www.epa.gov/sites/production/files/2019-08/documents/nutrient_control_design_manual.pdf).

## Rung 50: oxygen-ledgered floodplain nitrification

Floodplain chemistry now performs an explicit aerobic ammonium-to-nitrate
reaction. Every transition debits the owned ammonium-N pool, credits the owned
nitrate-N pool by the same mass, and debits owned dissolved oxygen at 4.57 kg
O2 per kg N. The local reaction receipt independently closes ammonium debit,
nitrate credit, total-DIN conservation, dissolved-oxygen debit and oxygen
stoichiometry. A persistent process organ binds that owner receipt to aerobic
availability, wetness, Life, a bounded first-order rate and the existing
surface-temperature proxy with a parameterized Q10 response. Only dissolved
oxygen above the configured aerobic minimum is reactive, so an oxygen-limited
step can approach but not silently cross that threshold.

The same receipt records 7.14 kg CaCO3-equivalent alkalinity demand per kg N as
an explicit diagnostic. It does not debit a material alkalinity reservoir or
feed pH because Caelus does not yet own those pools. Both factors follow the
[EPA Nutrient Control Design Manual](https://www.epa.gov/sites/default/files/2019-08/documents/nutrient_control_design_manual.pdf).
The reaction is a declared one-step ammonium-to-nitrate approximation; nitrite,
nitrifier populations, floodplain water-temperature memory and calibrated
kinetics remain unresolved.

Floodplain state v3, nitrification state and process receipt v1, and basin
engine v20 carry the contract. Basin nitrogen and oxygen ledgers include the
reaction, the system audit validates typed and digest-bound process evidence,
unloaded reach memory is retained, and Life-off freezes the biological
reaction. A v19 basin snapshot preserves all existing material and process
history, adds empty nitrification memory, drops legacy receipts, and requires
one typed zero-reaction checkpoint. API v46 and renderer-independent
experience capsules expose compact read-only nitrification truth.

## Rung 51: end-to-end alkalinity ownership

This rung supersedes R50 only where R50 labelled alkalinity demand as a
non-material diagnostic. Pre-R51 diagnostic history remains separately exposed
and is never relabelled as an owner debit.

Caelus now owns acid-neutralizing capacity as kilograms of CaCO3 equivalent
from dissolved soil water through the runoff queue, canonical rivers,
floodplains, estuaries and the ocean mixed layer. New canonical soil state uses
a deterministic lithology-responsive initial condition; new canonical ocean
state uses a 2,300 micromole/kg open-ocean reference at salinity 35. These are
model initial conditions, not observations. Exact receipts carry alkalinity
with the same water fractions and transfer IDs as C/N/P/O2, including loaded
neighbor runoff, reach routing, bankfull exchange, estuary passage, river-mouth
delivery and mixed-layer neighbor transport.

Floodplain nitrification now consumes the owned pool at 7.14 kg CaCO3
equivalent per kg ammonium-N converted and becomes alkalinity-limited before an
overdraft. Floodplain and estuary denitrification generate 3.57 kg CaCO3
equivalent per kg nitrate-N converted to nitrogen gas. These factors follow the
[EPA Nutrient Control Design Manual](https://www.epa.gov/sites/default/files/2019-08/documents/nutrient_control_design_manual.pdf)
and EPA's [Municipal Nutrient Removal Technologies report](https://www.epa.gov/sites/default/files/2019-08/documents/municipal_nutrient_removal_technologies_vol_i.pdf).
The interpretation follows the USGS definition of
[alkalinity and acid-neutralizing capacity](https://www.usgs.gov/publications/chapter-a6-section-66-alkalinity-and-acid-neutralizing-capacity),
while the ocean reference follows NOAA's
[CO2 system calculation guidance](https://www.ncei.noaa.gov/access/ocean-carbon-acidification-data-system/oceans/co2rprt.html).

Soil/runoff state v2, river chemistry v4, floodplain state v4,
denitrification state v4, nitrification state v2, estuary state v2 and ocean
ecology state v3 carry the material contract. Basin engine v21 closes dedicated
soil, runoff, river, floodplain, estuary, ocean and coupled residuals; the
read-only system audit exposes a separate end-to-end alkalinity check. Restored
pre-R51 snapshots preserve every previous pool and reaction history but add
zero alkalinity with explicit migration checkpoints rather than inventing past
chemistry. API v47 and experience capsules project the ledger read-only.

Alkalinity is not pH. At the R51 checkpoint Caelus did not resolve carbonate
species, dissolved-inorganic-carbon equilibrium, buffering feedbacks,
deep-ocean alkalinity exchange, measured concentrations or calibrated
watershed chemistry. R51 is a conservative capacity ledger with declared bulk
reaction stoichiometry.

## Rung 52: mixed-layer/deep-ocean alkalinity ownership

Caelus now extends the same CaCO3-equivalent capacity owner into the persistent
deep ocean. `axm.foundation-planet.deep-ocean-state/v2` owns dissolved deep
alkalinity, and `axm.foundation-planet.deep-ocean-exchange-receipt/v2` moves one
signed amount between the mixed layer and that deep owner using the existing
bounded concentration-gradient exchange depth. The sender is debited and the
receiver is credited in one commit; the receipt closes the combined
mixed-plus-deep residual. Physical exchange continues while Life is off, while
particle export, remineralization and burial retain their prior Life boundary.

New canonical deep-ocean state uses the same declared salinity-scaled 2,300
micromole/kg open-ocean reference as the mixed layer. This is a parameterized
initial condition, not a local observation. Treating total alkalinity as a
conservative mixing quantity follows NOAA PMEL's
[seawater carbonate-system guidance](https://www.pmel.noaa.gov/co2/files/dickson_thecarbondioxidesysteminseawater_equilibriumchemistryandmeasurementspp17-40.pdf);
NOAA NCEI's
[Guide to Best Practices for Ocean CO2 Measurements](https://www.ncei.noaa.gov/access/ocean-carbon-acidification-data-system/oceans/Handbook_2007/Guide_all_in_one.pdf)
defines the larger measurement and carbonate-system boundary that Caelus does
not claim to implement.

Ocean ecology state/flux v4 includes the deep owner in total alkalinity and
publishes the signed vertical amount beside its residual. Earth-system engine
v27 persists that lineage. The read-only system audit v2 adds a dedicated
`mixed-deep-ocean-alkalinity-ledger` check, and API v48 plus renderer-independent
experience capsules project the current owners and receipt without mutation
authority.

Restoring an R51 deep-ocean v1 checkpoint preserves its C/N/P/O2 reservoirs and
the already-owned mixed-layer alkalinity exactly, adds zero deep alkalinity,
marks an explicit migration checkpoint, and invalidates the obsolete vertical
receipt. It does not reconstruct historical deep alkalinity. Only a genuine
post-migration step can earn the v2 exchange evidence.

R52 still does not solve carbonate, bicarbonate, borate or minor acid-base
species; derive pH; equilibrate DIC and alkalinity; model calcium-carbonate
precipitation or dissolution; assimilate measured total alkalinity; resolve
benthic or hydrothermal alkalinity reactions; or claim three-dimensional ocean
circulation. The vertical exchange remains a bounded local bulk
parameterization.

### R52 continuity repair after the workspace move

Basin routing engine v22 adds a restore-only clock-alignment checkpoint for
browser saves whose committed Earth-transport clock and basin-routing clock
were persisted at different instants. On the first restored synchronization,
the committed Earth clock is authoritative: reach, floodplain, estuary,
sediment and chemistry material are preserved exactly; the basin clock is
aligned; and the stale latest routing receipt is invalidated. The checkpoint
records both prior clocks and the delta.

This is a one-shot state-continuity migration, not a material replay. It does
not reconstruct unobserved river transfers or claim that the intervening
period was simulated. Fresh state cannot invoke it, and a later clock mismatch
still throws. The step receipt remains v21 because the routing/material
contract itself did not change. API v48 exposes the checkpoint through
read-only `basinRoutingStatus()`.

The D-hosted live save also crossed the browser's raw `localStorage` quota at
about 5.69 million payload characters. World-state v2 commits are therefore
transactional: the in-memory revision changes only after storage accepts the
new envelope. When the readable JSON envelope does not fit, the same
checksummed envelope is stored through the explicit lossless
`lzw-uint16-base64` fallback and validated normally after decompression.
Compression is a storage encoding, not encryption. If both writes fail, the
prior revision remains authoritative and the UI/console report `SAVE FAILED`
instead of silently displaying an unpersisted revision.

## Rung 53: bounded mixed-layer carbonate equilibrium

Caelus now derives a read-only mixed-layer carbonate diagnostic from the
persistent dissolved-inorganic-carbon, CaCO3-equivalent total-alkalinity and
dissolved-inorganic-phosphorus owners plus mixed-layer depth, temperature and
salinity. The observer solves total-scale pH by a deterministic bracketed
alkalinity root and publishes CO2-star, bicarbonate and carbonate. Their sum
must reconstruct the input DIC; phosphate species must reconstruct the input
phosphorus; and the calculated alkalinity residual must close within the
declared tolerance. No carbon, phosphorus or alkalinity is created, moved or
owned by the diagnostic.
Depth is converted to solution mass with the declared 1,000 kg/m3 reference
density already used by the mixed-layer initialization; this is not a measured
or TEOS-10 density calculation.

The constant set is explicit: Lueker et al. (2000) carbonic-acid constants,
Dickson (1990) boric acid, Millero (1995) water and phosphoric-acid constants,
and the Lee et al. (2010) boron-to-salinity relationship, all at surface
pressure on the total hydrogen-ion scale. NOAA NCEI recommends the Lueker set
for open-ocean salinity 19–43 and 2–35 °C; Caelus therefore returns a typed
`OUTSIDE_CONSTANT_VALIDITY` non-solution outside that envelope instead of
clamping the water into it. See NOAA NCEI's
[OCADS carbonate-system guidance](https://www.ncei.noaa.gov/products/ocean-carbon-acidification-data-system),
the official
[Guide to Best Practices for Ocean CO2 Measurements](https://www.nodc.noaa.gov/media/pdf/oceanacidification/Dicksonetal2007_guide_all_in_one.pdf),
and the primary
[Lueker et al. study](https://doi.org/10.1016/S0304-4203(00)00022-0).

Ocean ecology state/flux v5 carries the current diagnostic and its source-owner
binding. Earth-system engine v28 migrates v27 columns by recomputing this
present-state observer while preserving all material owners and compatible
transport receipts. System audit v3 adds
`mixed-layer-carbonate-diagnostic`; API v49 and the live `Marine carbonate / pH`
row expose the same read-only result. The diagnostic is EXPERIMENTAL and its
parameterized DIC and alkalinity inputs are not observations.

R53 does not include dissolved silicate, fluoride, sulfide or ammonia alkalinity; deep
pressure corrections; deep-ocean pH; calcium ownership or calcite/aragonite
saturation; precipitation/dissolution kinetics; observation assimilation; or
pH feedback on biology and reactions. Those omissions stay machine-readable
in every diagnostic and audit result.

## Rung 54: carbonate-informed air-sea carbon exchange

R54 replaces the old empirical target-DIC carbon exchange with a pure
`axm.foundation-planet.air-sea-carbon-exchange-proposal/v1`. Before any owner
move, the proposal requires a solved R53 diagnostic whose DIC, alkalinity,
phosphorus, depth, temperature and salinity sources match the current ocean
state. It compares that diagnostic's actual CO2-star with the atmospheric
equilibrium CO2-star. A stale, unavailable or out-of-envelope diagnostic
produces a typed zero-carbon-flux result; oxygen exchange remains a separate
physical path.

The atmospheric side reuses the atmosphere-owned carbon compatibility mirror
as a dry-air ppm proxy, not a measurement. Seawater vapor pressure converts it
to wet-air pCO2. The [Weiss (1974) primary
paper](https://doi.org/10.1016/0304-4203(74)90015-2) supplies CO2 solubility
`K0` and the virial `B` term; the cross-virial correction and wet-air
construction follow NOAA NCEI's [NDP-047 calculation
procedure](https://www.ncei.noaa.gov/access/ocean-carbon-acidification-data-system/oceans/ndp_047/datacalc047.html).
The held 25 °C, salinity-35 value `ln(K0) = -3.5617` is checked against the
official [Guide to Best Practices for Ocean CO2
Measurements](https://www.ncei.noaa.gov/access/ocean-carbon-acidification-data-system/oceans/Handbook_2007/Guide_all_in_one.pdf).

Actual minus equilibrium CO2-star determines direction. Wind, open water and
duration supply the existing bounded bulk relaxation fraction; the proposal
converts the relaxed concentration difference through the declared 1,000
kg/m3 reference water mass and carbon molar mass. One signed amount is then
applied as an exactly paired atmosphere-to-DIC owner move, bounded by sender
availability. The receipt records the source diagnostic, wet and dry pressure,
pCO2, fCO2, solubility, disequilibrium, unbounded proposal, bounded proposal
and applied amount. System audit v4 recomputes those values and fails corrupted
fugacity, direction, bounds, owner application or carbon closure evidence.

Ocean ecology state/flux v6 migrates v5 without changing any C/N/P/O2 or
alkalinity owner and discards the old empirical v5 flux receipt. Earth-system
engine v29 migrates v28 while retaining compatible transport receipts. API v50
adds read-only `airSeaCarbonExchange()` and the live
`Air-sea CO2 equilibrium` row. R54 remains **EXPERIMENTAL**: there is no
measured atmospheric/ocean pCO2, measured ocean skin temperature, cool-skin or
warm-layer correction, scientifically calibrated piston velocity, or
species-resolved pH response. It is a bounded local process model, not a
scientific air-sea flux product.

## Rung 55: native phase-change thermal headroom

R55 repairs a preserved long-run atmosphere-energy failure without creating a
new material owner. Native condensation, deposition, evaporation, sublimation,
freezing and melting now ask the pure
`axm.foundation-planet.atmosphere-phase-thermal-envelope/v1` helper how much
latent heating or cooling fits between -120 and 70 °C before any water changes
phase. The supported mass moves with its full latent heat; unsupported requested
mass remains in its source phase. The pressure-column normalizer therefore no
longer has to silently discard heat after a material move.

Pressure dynamics v4 and its layer/precipitation and compatibility phase v3
receipts expose the number of thermal limits, the largest rejected request,
the declared envelope, and water/moist-enthalpy closure. Engine v30 migrates
v29 by preserving material, temperature and momentum owners, discarding legacy
phase receipts, and installing a neutral present-state atmosphere-energy
checkpoint. Audit v5 independently rejects out-of-envelope layers and malformed
native phase ledgers. API v51 shows the limit count and retained source-phase
mass in the existing `Cloud phase change` diagnostic.

The repair is **WORKING** within its held scope: the exact R54 ocean
counterexample reaches its old day-343 trigger during a 365-day run while the
maximum whole-atmosphere residual remains 0.005901 J/m², and a 432-step sweep
across 36 land/ocean locations and all condition profiles remains below
0.006682 J/m². This is not resolved cloud microphysics, upper-atmosphere
radiative chemistry, calibrated convection or a scientific forecast.

One distinct extreme stress remains **BROKEN** and is not hidden by R55: a
365-day land column under the same constant wet-storm boundary forcing reaches
a 207,978.797706 J/m² whole-atmosphere residual even though its native pressure
receipt itself closes below 0.00001 J/m². That separate compatibility/column
ledger failure remains counterevidence for a later repair; R55 does not claim
arbitrary long-run forcing closure.

## Rung 56: requested versus applied boundary energy

R56 resolves that preserved R55 counterexample without subtracting the observed
residual or expanding the native temperature envelope. The root cause was the
prescribed two-band boundary target requesting cooling that would place the
highest native pressure layer below -120 °C. Native reconciliation correctly
retained the layer at the declared minimum, but the whole-atmosphere ledger was
still charging the unachievable requested cooling instead of the energy change
actually applied to the authoritative eight-level column.

The typed
`axm.foundation-planet.atmosphere-boundary-energy-receipt/v1` now retains the
compatibility request, authoritative native initial and final moist enthalpy,
applied boundary change, initial/final compatibility projection adjustments,
and their explicit native-envelope reconciliation. The ledger charges the
applied native boundary energy while preserving the refused request as evidence.
It does not zero a checkpoint or claim that the boundary parameterization is a
scientific atmosphere model.

Engine v31 migrates v30 by preserving material, temperature and momentum owners
and valid R55 phase evidence while discarding unsupported historical R56
boundary-energy evidence into a labelled present-state checkpoint. Audit v6
independently checks the receipt identities, its embedded budget copy, envelope
limit evidence and the final water/surface/atmosphere ledgers. API v52 shows the
boundary-envelope energy beside the existing moist-enthalpy residual.

The repair is **WORKING** in its held scope. The exact 365-day constant wet-land
replay first encounters boundary-envelope reconciliation on day 215, retains a
maximum 207,978.793070 J/m² refused cooling adjustment, and keeps the maximum
whole-atmosphere residual to 0.006005 J/m². R55's original observation remains
part of the evidence trail; R56 changes its status from an unexplained
compatibility-ledger failure to an explicit requested-versus-applied boundary
receipt. This is still a bounded local process model, not a global circulation
model, scientific forecast, or calibrated upper-atmosphere boundary solver.

## Rung 57: scale-aware land subgrid mass closure

R57 resolves the intermittent live `basin-routing-receipt` and
`floodplain-plant-matter-receipts` failures that survived for an entire model
step. The land-to-floodplain debit compared carbon and nitrogen residuals with
a fixed 0.000001 kg (one milligram) limit even when its recorded operands were
tens or hundreds of billions of kilograms. Binary floating-point spacing at
that scale can be several milligrams, so an otherwise conservative debit could
be falsely marked open and then invalidate the basin receipt that carried it.

`axm.foundation-planet.land-ecology-subgrid-biomass-debit/v2` preserves the
measured carbon and nitrogen residuals and declares a reproducible numeric
policy: the greater of the one-milligram floor or eight IEEE-754 epsilon steps
at the largest recorded operand magnitude. System audit v7 recomputes that
bound from the receipt operands; a sender cannot inflate its own tolerance.
Basin engine v23 accepts only this current evidence. Its v22 migration retains
basin owners and clocks but discards the older v21 sender receipt rather than
promoting unsupported history.

The repair is **WORKING** within its held numeric scope. A deterministic
48-case Earth-cell sweep changed from 11 false failures to none; the largest
measured residue was 0.000061035 kg and the largest bound utilization was
11.9%. In the live browser, 48 repeated observations spanning two complete
model steps stayed at 26 pass / 0 fail / 4 not applicable. API v53 shows the
maximum sender residue and its independently auditable bound in milligrams.
This is a bounded floating-point accounting policy, not arbitrary-precision
arithmetic, ecological calibration or proof over every possible planet state.

## Rung 58: scale-aware floodplain plant-resource mass closure

R58 applies the same evidence discipline to the persistent floodplain plant
phosphorus and tissue-water owner. Its v1 transition receipt used a fixed
0.0000001 kg comparison for supported carbon, phosphorus and live tissue water.
At Earth-cell reservoir scale, an exactly conservative mortality transfer can
leave a representational residue larger than that floor; a 10-billion-kilogram
tissue-water fixture records 0.000000476837 kg and was therefore falsely marked
open.

`axm.foundation-planet.floodplain-plant-resources-receipt/v2` records the before,
transfer and after operands for every guild and for the aggregate receipt. Each
of the three material channels receives its own reproducible bound: the greater
of the 0.0000001 kg floor or eight IEEE-754 epsilon steps at the largest operand
magnitude in that channel. The measured residue remains visible. System audit
v8 independently recomputes every guild and aggregate identity and rejects an
inflated receipt-supplied tolerance. Basin engine v24 preserves v23 owners and
clocks but discards its older step-v22 receipt rather than inventing v2
plant-resource evidence.

The repair is **WORKING** within its held numeric scope. In a 150-case bounded
Earth-cell sweep, five conservative transitions exceeded the former fixed
floor and none exceeded the derived per-channel bound; the largest measured
residue was 0.000000476837 kg and maximum bound utilization was 3.36%. A wider
250-case adversarial representation sweep found 20 former fixed-floor failures
and no derived-bound failures. API v54 publishes the live maximum plant-resource
residue and bound. This does not claim arbitrary-precision accounting,
scientific plant calibration, or proof over every planet state.

## Rung 59: scale-aware floodplain plant-matter mass closure

R59 applies the same measured-residual policy to the persistent floodplain
plant carbon and nitrogen transition. Its v1 receipt judged each guild and the
aggregate owner against a fixed 0.0000001 kg limit. Large live,
standing-dead and litter pools can conserve material while ordinary binary
floating-point evaluation leaves a larger representational residue, so the
former comparison could falsely open the basin truth boundary.

`axm.foundation-planet.floodplain-plant-matter-receipt/v2` now records the
before, land-credit and after operands for carbon and nitrogen separately in
every guild and in the aggregate transition. The typed
`axm.foundation-planet.floodplain-plant-matter-mass-closure-policy/v1` bounds
each channel by the greater of the 0.0000001 kg floor or eight IEEE-754 epsilon
steps at its largest recorded operand. The measured residue is preserved.
System audit v9 independently recomputes the identities and bounds and rejects
an inflated receipt-supplied tolerance. Basin engine v25 retains v24 profiles,
material owners and clocks but discards its step-v23 evidence rather than
claiming that old evidence satisfies the v2 receipt contract.

The repair is **WORKING** within its held numeric scope. A deterministic
250-case standing-dead/litter representation sweep changed from 22 false
fixed-floor failures to no derived-bound failures. Its largest measured
residue was 0.000030517578 kg and maximum bound utilization was 12.19%.
API v55 publishes the live maximum plant-matter residue and bound beside the
land sender evidence. This does not claim arbitrary-precision accounting,
scientific plant calibration, or proof over every possible planet state.

## Rung 60: scale-aware floodplain detrital-return receiver closure

R60 repairs the persistent floodplain chemistry receiver at the other side of
resource-backed plant decomposition. The former v2 credit receipt compared its
aggregate carbon, total nitrogen, ammonium nitrogen and phosphorus identities
against fixed absolute floors. Large existing chemistry pools can conserve a
valid detrital credit while normal binary floating-point evaluation leaves a
larger measured residue, falsely opening the receiver boundary even though the
plant-matter sender, plant-resource sender and decomposition handoff remain
closed.

`axm.foundation-planet.floodplain-detrital-return-credit/v3` records separate
carbon, total-nitrogen, ammonium, unchanged-nitrate and phosphorus identities.
The typed
`axm.foundation-planet.floodplain-detrital-return-mass-closure-policy/v1`
derives each bound from that channel's recorded before, credit and after
operands using eight IEEE-754 epsilon steps, with the prior absolute floor as a
minimum. The receipt retains every measured residue and has no free-form
tolerance authority. System audit v10 independently recomputes the identities,
bounds, maximum residue and utilization, and rejects an inflated declared
bound. Basin engine v26 preserves v25 profiles, owners and clocks but discards
step-v24 evidence rather than relabelling the old receiver receipt as v3.

The repair is **WORKING** within its held numeric scope. A deterministic
250-case receiver representation sweep changed from 35 fixed-floor false
failures to no derived-bound failures. Its largest measured residue was
0.000164031982 kg and maximum bound utilization was 33.2%. API v56 publishes
the live maximum receiver residue and derived bound in milligrams. This does
not claim arbitrary-precision accounting, scientific decomposition
calibration, or proof over every possible planet state.

## Rung 61: scale-aware floodplain reaction receiver closure

R61 extends the same measured-residual discipline to the four persistent
floodplain chemistry reaction receivers: aerobic DOC mineralization,
denitrification, nitrification and bidirectional floodplain gas exchange. Their
former receipts applied fixed absolute comparisons to carbon, nitrogen,
ammonium, oxygen and alkalinity identities. At large stored-pool scales, a
conservative reaction could therefore retain an ordinary binary
floating-point residue above the fixed floor and falsely open the process and
basin truth boundaries.

The typed
`axm.foundation-planet.floodplain-reaction-mass-closure-policy/v1` derives a
separate bound for every recorded identity from that identity's own operands:
the greater of its declared material-channel floor or eight IEEE-754 epsilon
steps at the largest operand magnitude. Aerobic mineralization receipt v2,
denitrification reaction receipt v4, nitrification reaction receipt v3 and
floodplain gas-exchange receipt v3 retain the measured identities, per-identity
bounds, maximum residue and utilization. Their immediate process wrappers use
the same policy for plan-to-owner comparisons instead of reintroducing a fixed
threshold. System audit v11 independently reconstructs every identity and
rejects an inflated receipt-supplied bound. Basin engine v27 preserves v26
profiles, owners and clocks but discards step-v25 evidence rather than
inventing current reaction evidence.

The repair is **WORKING** within its held numeric scope. A deterministic
240-case sweep across all four reaction families changed from 54 fixed-floor
false failures to no derived-bound failures. Its largest measured residue was
0.00048828125 kg and maximum derived-bound utilization stayed below 11%. API
v57 publishes the live aggregate and per-reaction maximum residue, bound and
utilization. The atmosphere-side gas owner retains its separate existing
contract. R61 does not claim arbitrary-precision accounting, calibrated
reaction kinetics, mechanistic microbial ecology or proof over every possible
planet state.

## Rung 62: scale-aware atmosphere gas-exchange owner closure

R62 repairs the separate native-atmosphere owner used by paired floodplain gas
exchange. That owner mutates per-square-meter native-layer reservoirs but proves
its carbon and oxygen identities after scaling them to the receiving area's
total kilograms. Its former fixed 0.001 kg comparison could therefore reject a
conservative move solely because ordinary binary floating-point residue grows
with a very large operand scale.

`axm.foundation-planet.atmosphere-floodplain-gas-exchange-mass-closure-policy/v1`
now derives carbon and oxygen bounds independently as the greater of the
existing 0.001 kg material floor or eight IEEE-754 epsilon steps at the largest
recorded total-kilogram operand. Atmosphere gas-exchange receipt v3 records the
before, credit, debit and after operands, measured residuals, per-identity
bounds, maximum residual and utilization. Atmosphere state v4 and gas-process
state/receipt v3 preserve material and cumulative process memory while dropping
older receipts rather than relabelling them. Basin engine v28 and step v27 bind
the new owner evidence, and system audit v12 reconstructs both identities and
rejects inflated receipt-supplied bounds.

The repair is **WORKING** within its held numeric scope. A deterministic
105-case sweep across seven receiving-area scales, five exchange fractions and
three transfer directions changed from 23 fixed-floor false failures to no
derived-bound failures. The deliberately extreme sweep retained a largest
measured residue of 262,144 kg while maximum derived-bound utilization stayed
below 12%. API v58 publishes separate live water-owner and atmosphere-owner
residue/bound telemetry. R62 does not claim arbitrary-precision accounting,
scientific gas-transfer calibration, a resolved air-water interface, proof over
every possible planet state, promotion or canonization.

## Rung 63: scale-aware geomorphic sediment transfer closure

R63 repairs the five persistent absolute-kilogram transfer owners in the
finite geomorphic sediment cycle: runoff sender debit, runoff receiver credit,
river input credit, river route sender/bed partition, and coastal input
partition. Their former fixed 0.0000001 kg comparison could reject a
conservative transfer once area conversion or a large persistent reservoir
made ordinary binary floating-point residue exceed that fixed floor.

`axm.foundation-planet.geomorphic-sediment-transfer-mass-closure-policy/v1`
now derives a separate clay, silt, sand and gravel bound for every identity as
the greater of the existing 0.0000001 kg floor or eight IEEE-754 epsilon steps
at that identity and grain's largest recorded operand. Runoff queue, river and
coastal state plus their transfer receipts advance to v2. Each receipt retains
the unrounded operands, measured residuals, derived per-grain bounds, maximum
residual and maximum utilization. River routes additionally prove the
persistent bed credit and requested-load partition; coastal credits prove the
input partition. Surface erosion remains on its separate kg/m2 ledger.

Earth engine v32, transport step v12, basin engine v29 and basin step v28 carry
the current evidence. Their migrations preserve owned mineral reservoirs,
cumulative movement and clocks while dropping older fixed-threshold receipts;
they never manufacture historical numeric closure. System audit v13
independently reconstructs every sediment identity and declared bound, so an
inflated receipt-supplied tolerance fails even when its measured residue is
unchanged. API v59 publishes the typed policy plus aggregate measured residual,
bound and utilization telemetry.

The repair is **WORKING** within its held numeric scope. A deterministic
150-case discovery sweep across six scales, five fractions and all five owner
families changed from 72 fixed-floor false failures to no derived-bound
failures. It preserved a largest measured residual of 136,445,952 kg while the
worst bound utilization remained below 7.5%. The maintained self-test repeats
150 cross-family cases, includes the bed and coastal partition identities, and
rejects tolerance inflation. R63 does not claim arbitrary-precision
accounting, scientific erosion or transport calibration, resolved channel or
coastal morphodynamics, a continuously active global sediment network, proof
over every possible planet state, promotion or canonization.

## Rung 64: scale-aware coupled basin aggregate closure

R64 replaces the coupled basin ledger's fixed one-kilogram-only decision with
`axm.foundation-planet.basin-aggregate-mass-closure-policy/v1`. The retained
one-kilogram floor still catches material imbalance at ordinary scales, while
each of the twelve water, chemistry, plant-matter and grain-sediment identities
may derive a larger IEEE-754 bound only from the sum of its own unrounded signed
kilogram operands. Measured residuals are preserved; they are never zeroed,
clamped or synthesized from the bound.

Basin engine v30 and step receipt v29 record those operands, residuals,
per-identity bounds, closure results and aggregate maximum residual, bound and
utilization. The v29-to-v30 migration preserves reach-owned material and clocks
but discards v28 receipts instead of inventing R64 evidence. System audit v14
independently reconstructs every signed sum and bound and rejects altered
operands or tolerance inflation. API v60 exposes the typed policy and live
aggregate telemetry, including the visible River-routing residual-versus-bound
diagnostic.

The repair is **WORKING** within that numeric scope. Its deterministic 150-case
reproduction spans all twelve operand-count shapes: all 150 mathematically
zero planetary-scale sums fail the old fixed one-kilogram decision, while all
150 close under the derived policy with their measured binary residue intact.
R64 does not claim arbitrary-precision accounting, proof over every planet
state, a continuously active global basin network, scientific calibration,
promotion or canonization.

## Rung 65: scale-aware channel–floodplain exchange closure

R65 repairs the immediate material-owner boundary between each loaded river
reach and its persistent floodplain reservoir. The earlier exchange receipt
decided water closure with a fixed one-kilogram cutoff and every dissolved
chemistry and grain-sediment identity with a fixed 0.000001 kg cutoff. At
planetary owner scales, an exactly conservative exchange could therefore leave
an ordinary binary floating-point residue beyond its fixed floor and falsely
open the floodplain and basin truth boundaries.

`axm.foundation-planet.floodplain-exchange-receipt/v4` now carries
`axm.foundation-planet.floodplain-exchange-mass-closure/v1` under the typed
`axm.foundation-planet.floodplain-exchange-mass-closure-policy/v1`. Exactly
twelve identities are retained: water; total carbon and nitrogen; nitrate and
ammonium; phosphorus, oxygen and alkalinity; and clay, silt, sand and gravel.
Each identity records its unrounded signed channel/floodplain owner operands,
measured residual, derived bound and utilization. The bound is the greater of
the former identity-specific floor or eight IEEE-754 epsilon steps at the sum
of that identity's absolute operands. It cannot borrow scale from another
identity or choose a larger free-form tolerance.

Basin engine v31 and step v30 require current exchange evidence while preserving
all v30 material owners and clocks and discarding old step-v29 receipts. Current
floodplain state retains its water, chemistry, mineral reservoirs and cumulative
history while normalization drops a stored v3 exchange receipt without
inventing a transfer checkpoint. System audit v15 independently reconstructs
all twelve signed sums, bounds and aggregate maxima and rejects either tolerance
inflation or an altered recorded operand. API v61 exposes the policy plus live
maximum residual, bound, utilization and visible River-routing diagnostics.

The repair is **WORKING** within this numeric scope. A deterministic 150-case
representation sweep across all twelve operand shapes changed from 150
fixed-floor false failures to no derived-bound failures. It preserved a largest
measured residue of 3.25 kg; the largest derived bound was 32,768 kg and maximum
utilization was 2.5390625%. R65 does not claim arbitrary-precision accounting,
proof over every planet state, resolved inundation hydraulics, scientific flood
calibration, promotion or canonization.

## Rung 66: persistent floodplain water temperature and sensible heat

R66 replaces three independent same-step surface-temperature proxies with one
persistent per-reach floodplain thermal owner. Each reach now retains water
temperature, tracked water mass, sensible heat, observed wet/dry time,
cumulative net-advected heat and cumulative parameterized boundary heat. The
same exact transition-receipt digest and final temperature feed floodplain
denitrification, nitrification and bidirectional gas exchange.

`axm.foundation-planet.floodplain-thermal-receipt/v1` carries
`axm.foundation-planet.floodplain-thermal-energy-closure/v1` under the typed
`axm.foundation-planet.floodplain-thermal-energy-closure-policy/v1`. The
receipt reconciles net water-owner change into modeled inflow or proportional
outflow sensible heat, applies the explicit surface-boundary relaxation term,
and records the five signed joule operands, measured residual, derived bound
and utilization. The bound is the greater of one joule or eight IEEE-754
epsilon steps at the sum of the absolute unrounded operands; it cannot be
inflated by the receipt.

Basin engine v32 and step v31 preserve every v31 material, chemistry,
biological, clock and cumulative owner while adding only an empty one-shot
thermal checkpoint. The first R66 step observes current floodplain water and
initializes current heat, but explicitly refuses to reconstruct historical
heat or claim historical closure. Old step-v30 evidence is discarded rather
than relabelled. System audit v16 independently reconstructs water change,
energy terms, signed operands, policy bound, summary maxima and the exact
thermal receipt binding of all three consumers. API v62 and the Floodplain
thermal owner diagnostic expose water-weighted mean temperature, receipt count,
maximum residual, maximum bound and maximum bound utilization.

The repair is **WORKING** within this declared scope. Direct tests cover wet
thermal inertia, net inflow and outflow heat, dry persistence, migration and
150 planetary-scale floating-point fixtures that the old fixed one-joule
decision would reject. Adversarial tests reject tolerance inflation, altered
energy operands and altered consumer digests. R66 still does not resolve
channel-water temperature, debit the atmosphere or soil energy owner for the
parameterized external boundary term, model freeze–thaw or latent heat, claim
scientific calibration, promote itself or canonize the branch.

## Rung 67: persistent loaded-river temperature and sensible heat

R67 replaces the remaining same-step channel-temperature proxy with one
persistent thermal owner per materialized loaded canonical river reach. Loaded
reach definitions without a materialized water-owner state remain explicit in
the receipt count and do not receive invented thermal history. Each owner retains
water temperature, tracked channel water, sensible heat, wet/dry observation
time and cumulative land-inlet, reach-inlet, reach-outflow, net-floodplain and
parameterized boundary heat. Runoff-to-river, reach-to-reach and river-mouth
water moves carry the exact transfer ID, unrounded water, source temperature
and sensible heat used by both the sender and receiver ledgers.

`axm.foundation-planet.river-thermal-receipt/v1` binds an independently
digestible `river-thermal-pre-route-projection/v1`, typed
`river-thermal-transfer/v1` records and
`river-thermal-energy-closure/v1` under the typed scale-aware policy. The
eight signed joule operands are final heat, negative initial heat, heat sent
to the floodplain, negative heat returned from the floodplain, negative land
and reach inlet heat, reach or mouth outflow heat and negative external
boundary heat. The decision bound is the greater of one joule or eight
IEEE-754 epsilon steps at the sum of the absolute unrounded operands.

Floodplain thermal state and receipt v2 now separate exact net channel exchange
from local plant-water owner adjustments. Channel-to-floodplain water uses the
prior persistent river temperature; return water uses the prior persistent
floodplain temperature. Local water changes remain thermally reconciled but
cannot masquerade as channel exchange. On the one pre-R67 migration step, the
current material owner is initialized from the surface boundary and explicitly
claims no historical heat closure. Basin engine v33, step v32, system audit
v17, API v63, experience capsules and the River thermal owner diagnostic expose
the owner and evidence read-only.

The repair is **WORKING** within its materialized loaded-owner scope. Direct tests cover
migration, thermal inertia, exact inlet/outflow advection and 150
planetary-scale numeric fixtures. Runtime and adversarial tests independently
recompute water and heat terms, projection lineage, transfer bindings, policy
bounds and floodplain source temperature, rejecting inflated tolerances,
altered operands and detached transfer digests. R67 does not instantiate every
loaded graph definition, create a global unloaded river thermal network, debit the runoff source or external
atmosphere/soil heat owners, credit an ocean thermal receiver, resolve gross
counterflow, freeze-thaw or latent heat, claim scientific calibration, promote
itself or canonize the branch.

## Rung 68: exact loaded ocean-mouth mixed-layer heat credit

R68 closes the remaining loaded river-mouth sensible-heat seam. When the
canonical mouth cell is loaded, the exact unrounded `river-to-ocean-mouth`
transfer already debited from the persistent river thermal owner is now
credited to the existing ocean mixed-layer heat owner. The credit changes the
persistent `heatContentJm2`, `mixedLayerTemperatureC` and surface temperature;
it does not create a second ocean reservoir or change the declared mixed-layer
depth.

`axm.foundation-planet.ocean-mouth-thermal-receipt/v1` binds the mouth transfer
ID, source reach, destination cell, river water/temperature/heat terms, receiver
area, fixed-depth heat capacity, initial and final owner terms, and a digest.
Its `ocean-mouth-thermal-energy-closure/v1` records final heat, negative initial
heat and negative river input heat. The typed policy derives the decision bound
as the greater of one joule or eight IEEE-754 epsilon steps at the sum of the
absolute unrounded operands; the measured residual and utilization remain
visible evidence.

Basin engine v34 accepts v33 owner state unchanged and discards step-v32
evidence rather than relabelling it as an observed ocean receiver credit.
System audit v18 independently recomputes the river heat, mixed-layer capacity,
owner terms, signed operands, residual, scale-aware bound, digest and outer
transfer binding. API v64 and the Ocean-mouth heat credit diagnostic expose the
receipt count, maximum residual, maximum bound, utilization and audit verdict
read-only.

The repair is **WORKING** within the loaded fixed-depth mixed-layer scope.
Direct and routed tests cover exact owner change, persistence, 150
planetary-scale floating-point fixtures and independent audit acceptance.
Adversarial tests reject inflated tolerances, altered operands, detached
receiver digests and forged heat capacity. R68 does not resolve river-water
displacement, mixed-layer entrainment, vertical or three-dimensional ocean
circulation, freeze-thaw, latent heat, global unloaded routing or scientific
calibration, and it does not promote or canonize the branch.

## Rung 69: Life-off plant-resource lineage continuity

R69 repairs an evidence discontinuity exposed by disabling Life between basin
steps. Basin routing already emitted typed, zero-transfer floodplain plant
resource debit and water-return receipts, but the dormant and migration paths
discarded their digests when constructing the nested plant-resource receipt.
Material remained conservative while the exact receipt lineage was therefore
reported open.

`axm.foundation-planet.floodplain-plant-resources-receipt/v3` retains both
typed no-op receipt digests during Life-disabled dormancy and the one-step
legacy-resource migration. Transfer ID arrays stay empty, uptake and water
return stay zero, and every phosphorus and tissue-water pool remains frozen.
The change binds evidence that the basin already produced; it does not invent
a sender, receiver, transfer or material flow.

Basin engine v35 accepts v34 owner state unchanged and discards step-v33
evidence rather than relabelling it as the v3 lineage contract. System audit
v19 independently requires the nested digests to match the corresponding
typed no-op receipts. API v65 exposes the versioned contract read-only. Direct
tests cover migration and dormancy, while a persisted enabled-to-Life-disabled
basin step proves both the basin truth boundary and plant-resource audit remain
closed. R69 does not change Life-off ecology, resource quantities, scientific
calibration, unloaded routing, promotion or canonization.

## Rung 70: scale-aware ocean boundary-input mass closure

The persisted enabled-to-Life-disabled fixture from R69 exposed a separate
numerical evidence defect at the loaded river-to-ocean boundary. The ocean
receiver accepted 273.170976 kg-CaCO3-equivalent into a
498,016,560.722-square-metre owner and retained a measured
-0.000000148 kg credit residual. The earlier alkalinity audit used a fixed
0.0000001 kg cutoff, so that honest IEEE-754 representation residue made the
route fail even though the inlet, reaction, aggregate and truth ledgers all
closed.

`axm.foundation-planet.ocean-ecology-river-input-receipt/v3` and the matching
runoff-input v3 receipt now carry
`axm.foundation-planet.ocean-ecology-boundary-input-mass-closure/v1`. Carbon,
nitrogen, phosphorus, oxygen and alkalinity each retain three unrounded signed
kilogram operands: final receiver owner, negative initial receiver owner and
negative boundary input. The typed policy derives each bound as the greater of
0.000000001 kg or eight IEEE-754 epsilon steps at the sum of the absolute
operands. Measured residuals and utilization remain visible; receipt truth is
green only when every material identity closes.

Ocean-mouth receipt v10 binds that receiver evidence to the exact outer
transfer ID. Basin engine v36 preserves v35 material owners and clocks but
discards step-v34 evidence rather than relabelling it as the new closure
contract. System audit v20 independently recomputes every operand identity,
residual, bound, utilization, summary and transfer binding, and rejects both
inflated tolerances and detached receiver IDs. API v66 exposes the live receipt
count, maximum residual, maximum bound, utilization, route verdict and policy.
The restored Life-off basin now passes the complete read-only audit rather than
retaining the R69 alkalinity counterevidence.

R70 bounds floating-point representation; it does not hide or clamp residuals,
create ocean material, introduce arbitrary-precision arithmetic, resolve
carbonate chemistry or pH, add unloaded global routing, claim scientific
calibration, promote or canonize the branch.

## Rung 71: persistent runoff temperature and sensible-heat ownership

Runoff water no longer reaches loaded land, river or ocean receivers through a
freshly parameterized temperature at each boundary. Every land column now owns
`axm.foundation-planet.runoff-thermal-queue/v1` beside its persistent runoff
water queue. The owner retains tracked water, water temperature, sensible heat,
cumulative generation/debit/credit totals and digest-bound generation and
transfer receipts. Surface runoff and baseflow credit the queue at their
declared parameterized temperatures; the generation receipt closes water and
energy with the same operand-scale IEEE-754 policy used by the loaded river
thermal organ.

Earth transport v13 debits exactly the routed water fraction from the sender's
thermal queue. A loaded land receiver credits the same transfer ID, kilograms,
temperature and joules to its own queue. A direct loaded-ocean route instead
credits the existing fixed-depth mixed-layer heat owner and records the exact
initial owner, input heat, final owner, measured residual and derived bound.
The runoff-water and runoff-heat residuals are kept as separate measured
identities; ocean heat is not created a second time.

Runoff sender/receiver water identity uses the greater of a 0.000001 kg floor
or eight IEEE-754 epsilon steps at the sum of the absolute unrounded signed
operands. Receipts preserve the measured residual and derived bound; a fixed
absolute threshold alone is not treated as evidence at planetary operand
scales. Live hardening also routes the existing floodplain thermal v2 water
owner change through the same scale-aware rule. System audit v21 recomputes
both policies independently and rejects an inflated energy or water bound.

At canonical basin capture, inlet receipt v9 debits the Earth-cell runoff
thermal owner before the corresponding runoff water leaves that cell. River
thermal transfer v2 carries the sender-debit digest, declares persistent rather
than parameterized inlet temperature, and credits the exact water and sensible
heat into river thermal receipt v2. Basin engine v37 and step v36 require that
binding independently of producer truth flags. Earth engine v33 initializes an
older v32 column's current queue without reconstructing pre-R71 heat history;
basin v37 accepts v36 owner state and does not relabel older receipts as R71
evidence.

System audit v21 independently recomputes queue generation, transfer and ocean
credit energy, verifies water-owner binding, checks digests across Earth
transport and basin capture, and rejects detached IDs, inflated tolerances or
altered operands. API v67 exposes the live queue summary, typed closure policy
and full receipts read-only.

R71 does not claim resolved soil or groundwater thermal owners. The surface
runoff and baseflow source temperatures remain explicit parameterized boundary
inputs, so their upstream heat owners are not debited. It also does not add
latent heat, freeze/thaw routing, scientific calibration, unloaded global
routing, promotion or canonization.

## Rung 72: persistent land-hydrology thermal ownership

Each loaded land column now owns water temperature and sensible heat separately
for surface ponding, root-zone water, deep-soil water and groundwater. The R72
step receipt moves heat with infiltration, percolation and recharge, preserves
the unrounded water and energy operands plus their measured residuals, and
derives scale-aware numerical bounds rather than relying on green booleans.

Surface runoff and baseflow now debit those exact owners before the R71 runoff
thermal queue receives the same water, temperature and joules. The generation
receipt binds the source step digest and owner IDs. Loaded groundwater exchange
also carries groundwater sensible heat on the same area-weighted routes and
records sender/receiver owner bindings in Earth transport v14.

Earth engine v34 migrates a v33 save by preserving every current hydrology water
owner and creating only an explicit current-state thermal checkpoint. It does
not reconstruct prior heat or invent prior transfer receipts. System audit v22
independently recomputes land owner binding, water/energy closure, runoff-source
debit and groundwater heat transport. API v68 exposes the state, description,
typed closure policy and `source-owned` runtime diagnostic read-only.

Precipitation still has no debited atmosphere thermal sender, evaporation has no
credited atmosphere thermal receiver, and freeze/thaw, latent heat, subsurface
conduction, geothermal forcing, scientific calibration and unloaded global
behavior remain unresolved. R72 is not promotion or canonization.

## Rung 73: liquid-water atmosphere-land thermal ownership

R73 closes the previously unresolved sensible-heat boundary for liquid water
only. Each loaded land step now emits
`axm.foundation-planet.atmosphere-land-liquid-water-thermal-receipt/v1`.
Liquid rainfall debits the native lowest atmosphere layer's dry-air
sensible-heat owner and credits the land surface-water thermal owner. Liquid
surface evaporation, bare-soil evaporation and transpiration debit the land
surface/root thermal owners and credit that same native atmosphere owner.

The receipt is bound to the exact native pressure-dynamics receipt and R72 land
thermal receipt. It preserves paired transfer IDs, temperatures, water amounts,
unrounded sensible-heat operands, measured residuals and scale-aware numerical
bounds for both the native owner and complete native moist-enthalpy adjustment.
Transfers that exceed the native `-120 C` to `70 C` envelope are refused rather
than clipped or partially applied. Earth engine v35 migrates v34 state without
inventing a historical boundary receipt; system audit v23 independently
recomputes lineage, physics, closure bounds, owner state and budget binding.
API v69 exposes the receipt and closure-policy descriptions read-only.

This is deliberately not a claim that all precipitation or evaporation heat is
closed. In R73, snowfall, snowmelt and sublimation sensible-heat ownership
remained unresolved. This organ does not model latent heat, resolved droplet
thermodynamics, scientific calibration or unloaded global behavior. R73 is
EXPERIMENTAL, not promotion or canonization.

## Rung 74: persistent land-snow sensible-heat ownership

Each loaded land column now persists a typed snow sensible-heat owner beside its
snow-water-equivalent owner. Snow temperature is a bounded native lowest-layer
proxy, not resolved flake or snow-grain thermodynamics. The R74 step receipt
mixes incoming snowfall into that owner, removes heat with snowmelt and
sublimation, and preserves unrounded water/energy operands, measured residuals
and scale-aware numerical bounds.

Snowfall now pairs a native atmosphere sensible-heat debit with the persistent
snowpack credit. Sublimation pairs the snowpack debit with a native atmosphere
credit. Both atmosphere transfers are chained after the exact R73 native owner,
closed again against native moist enthalpy, and included in the complete
atmosphere energy budget. The independent system audit v24 recomputes state,
source digests, water-temperature heat, both snow closures, the R73-to-R74 owner
chain, atmosphere closures and budget binding.

Snowmelt debits the snowpack's signed sensible heat, but the existing liquid
receiver enters the land hydrology owner at `0 C`. R74 therefore records the
required cold-content warming and keeps both its energy source and the exact
liquid receiver credit false. It does not invent that missing owner, model
latent heat, resolve snow microphysics, claim scientific calibration or claim
unloaded global behavior.

Earth engine v36 accepts v35 state by preserving all prior atmosphere, liquid
land-water and runoff thermal owners and the exact R73 receipt. It initializes
only the current snow owner as a no-history checkpoint. API v70 exposes the
state, receipt and closure-policy descriptions read-only. R74 remains
EXPERIMENTAL; it is not promotion, canonization or a global climate claim.

## Rung 75: snowmelt cold-content source and zero-Celsius liquid credit

R75 closes the bounded downstream gap that R74 deliberately left open. The
existing land surface sensible-heat owner now pays the exact energy required to
warm the removed subzero snow from its carried temperature to `0 C`. That debit
is a distinct negative term in
`axm.foundation-planet.surface-energy-ledger/v1`; the surface ledger still
separately carries radiative/turbulent flux, explicit boundary heat,
precipitation phase input and cryosphere phase storage.

`axm.foundation-planet.land-snowmelt-cold-content-receipt/v1` binds the exact
R74 snow-step digest, R72 land-hydrology digest, cryosphere phase receipt and
surface-energy step. Its receiver transition starts with the negative sensible
heat carried by the removed snow, credits the equal positive warming energy,
and ends with the same meltwater in the persistent land surface-water owner at
exactly `0 C` and therefore zero sensible heat relative to that reference. The
source debit, receiver transition and complete surface-energy ledger each keep
unrounded signed operands, measured residuals and the established scale-aware
one-joule/eight-ULP bound.

Fusion is not counted again. The existing cryosphere phase receipt remains the
sole owner of the snowmelt latent-heat term; R75 only binds its digest and keeps
`latentHeatModeledByThisOrgan` false. The R74 atmosphere/snow receipt likewise
continues to state its own downstream flags as false. R75 proves the subsequent
handoff without rewriting that earlier receipt.

Earth engine v37 accepts v36 state by preserving the exact R74 snow,
atmosphere and land-hydrology owners and receipts, then adds only a no-history
R75 checkpoint. The first subsequent land step creates current evidence.
System audit v25 independently recomputes all source digests, water and
temperature bindings, surface-owner heat, the three closures and latent/sensible
separation. API v71 exposes the receipt and closure policy read-only.

R75 does not resolve snow conduction, snow grains, meltwater percolation through
snow, latent heat beyond the existing cryosphere ledger, scientific calibration
or unloaded global behavior. It remains EXPERIMENTAL and is not promotion or
canonization.

## Rung 76: paired land surface-snow sensible-heat ownership

R76 gives the existing land surface and persistent R74 snow thermal owners one
explicit bidirectional sensible-heat exchange. For each bounded loaded-land
step, a digest-bound proposal evaluates their temperature difference with the
two existing heat capacities and a declared `2.5 day` bulk response timescale.
The signed transfer is positive into snow and is capped so the snow owner stays
inside its existing `-80 C` through `0 C` envelope.

The exact same signed joules appear as an export or import in
`axm.foundation-planet.surface-energy-ledger/v1` and as the opposite owner move
in `axm.foundation-planet.land-surface-snow-thermal-receipt/v1`. The paired
transfer, persistent snow owner and complete surface-energy ledger retain
unrounded operands, measured residuals and the established scale-aware
one-joule/eight-ULP bound. Snow water is unchanged by this organ. Snowmelt mass
and fusion latent heat remain owned by the existing cryosphere and R75 paths.

R74 evidence is not rewritten after R76 changes the current snow owner. The
independent audit instead verifies the exact chain from the R74 final owner to
the R76 initial owner and then to the current R76 final owner. It also
recomputes the bulk proposal, source digests, signed surface ledger entry and
all three closures. Re-signed detached proposals, owner changes, ledger
changes, inflated tolerances and fabricated conduction or fusion claims fail.

Earth engine v38 accepts v37 state while preserving the exact R75 and R74
owners and receipts. It adds only a no-history R76 checkpoint; the first later
land step earns current exchange evidence. System audit v26 and API v72 expose
the new receipt and policy read-only.

This is a parameterized two-owner bulk response, not resolved snow conduction,
snow-layer physics, phase change, snowmelt production, scientific calibration
or unloaded global behavior. R76 remains EXPERIMENTAL and is not promotion or
canonization.

## Rung 77: paired land surface-root-zone-water sensible-heat ownership

R77 gives the existing land surface and persistent R72 root-zone-water thermal
owners one explicit bidirectional sensible-heat exchange. For each bounded
loaded-land step, a digest-bound proposal evaluates their temperature
difference with the two declared heat capacities and a `4 day` bulk response
timescale. The signed transfer is positive into root-zone water and is capped
before application so the liquid-water owner remains within `-2 C` through
`45 C`.

The same signed joules appear in
`axm.foundation-planet.surface-energy-ledger/v1` and as an equal-and-opposite
root-zone-owner move in
`axm.foundation-planet.land-surface-root-zone-thermal-receipt/v1`. The paired
transfer, persistent root-zone-water owner and complete surface-energy ledger
preserve unrounded operands, measured residuals and the established scale-aware
one-joule/eight-ULP bound. Root-zone water mass is unchanged by this organ.

The independent audit verifies the exact R72-final to R77-initial to
R77-final/current owner chain. It also recomputes the bulk proposal, source
digests, R76 handoff, signed surface-ledger term and all three closures.
Re-signed detached proposals, owner changes, ledger changes, inflated
tolerances and fabricated conduction or deeper-water claims fail.

Earth engine v39 accepts v38 state while preserving the exact R76, R75 and
land-hydrology owners and receipts. It adds only a no-history R77 checkpoint;
the first later land step earns current exchange evidence. System audit v27
and API v73 expose the receipt and policy read-only.

The surface capacity already includes a prescribed soil-depth contribution, so
R77 deliberately does not create a second generic solid-soil heat owner. It is
a parameterized surface/root-zone-water bulk response, not resolved soil
conduction, deep-soil or groundwater heat exchange, phase change, geothermal
forcing, scientific calibration or unloaded global behavior. Those upstream
thermal owners remain unresolved and undebited. R77 remains EXPERIMENTAL and
is not promotion or canonization.

## Rung 78: paired root-zone/deep-soil-water sensible-heat ownership

R78 gives the persistent R72 root-zone-water and deep-soil-water thermal
owners one explicit bidirectional sensible-heat exchange. For each bounded
loaded-land step, a digest-bound proposal evaluates their temperature
difference with the joint liquid-water heat capacity and a declared `12 day`
bulk response timescale. The signed transfer is positive into deep-soil water
and is capped before application so both liquid-water owners remain within
`-2 C` through `45 C`.

`axm.foundation-planet.land-root-deep-water-thermal-receipt/v1` records equal
and opposite owner entries. Its paired, root-zone, deep-soil and combined
closures preserve unrounded operands, measured residuals and the established
scale-aware one-joule/eight-ULP bound. Neither water owner changes mass.

The independent audit verifies the exact R72-final/R77-final to R78-initial to
R78-final/current owner chain. It recomputes the proposal, both temperature
envelopes, source digests, signed owner entries and all four closures. Held
cases exercise both heat directions. Unsigned proposals, detached current
owners, inflated tolerances, re-signed detached proposals and fabricated
solid-soil or groundwater claims fail.

Earth engine v40 accepts v39 state while preserving exact R77, R76, R75 and
land-hydrology evidence. It adds only a no-history R78 checkpoint; the first
later land step earns current exchange evidence. System audit v28 and API v74
expose the receipt and policy read-only. Older v38 evidence remains accepted
without being relabelled as R78 history.

R78 exchanges heat only between the already persistent liquid-water owners. It
does not create a solid-soil heat reservoir or claim resolved soil conduction,
groundwater heat exchange, phase change, geothermal forcing, scientific
calibration or unloaded global behavior. The upstream groundwater and
solid-soil source-heat owners remain unresolved and undebited. R78 remains
EXPERIMENTAL and is not promotion or canonization.

## Rung 79: paired deep-soil/groundwater-water sensible-heat ownership

R79 gives the persistent R72 deep-soil-water and groundwater-water thermal
owners one explicit bidirectional sensible-heat exchange. For each bounded
loaded-land step, a digest-bound proposal evaluates their temperature
difference with the joint liquid-water heat capacity and a declared `30 day`
bulk response timescale. The signed transfer is positive into groundwater
water and is capped before application so both liquid-water owners remain
within `-2 C` through `45 C`.

`axm.foundation-planet.land-deep-groundwater-water-thermal-receipt/v1`
records equal-and-opposite owner entries. Its paired, deep-soil, groundwater
and combined closures preserve unrounded operands, measured residuals and the
established scale-aware one-joule/eight-ULP bound. Neither water owner changes
mass.

The independent audit verifies the exact R72-final/R78-final to R79-initial to
R79-final owner chain. When exact-current loaded groundwater transport follows
R79, it additionally verifies R79-final to transport-initial and
transport-final to current. A digest-valid older transport receipt whose
initial owner does not equal the R79 final owner is not accepted as downstream
authority. Held cases exercise both heat directions. Unsigned proposals,
detached current owners, inflated tolerances, re-signed detached proposals and
fabricated solid-soil, aquifer-conduction or geothermal claims fail.

Earth engine v41 accepts v40 state while preserving exact R78, R77, R76, R75
and land-hydrology evidence. It adds only a no-history R79 checkpoint; the
first later land step earns current exchange evidence. System audit v29 and
API v75 expose the receipt and policy read-only.

R79 exchanges heat only between already persistent liquid-water owners. It
does not create a solid-soil heat reservoir or claim resolved soil or aquifer
conduction, phase change, geothermal forcing, scientific calibration or
unloaded global behavior. It remains EXPERIMENTAL and is not promotion or
canonization.

## Why there are two render scales

A real-scale planet cannot render individual trees and a globe-sized continent mesh in one stable coordinate space. Caelus keeps one global latitude/longitude truth and renders it through two views:

1. Orbital view samples the complete planet into a bounded globe representation.
2. Surface view streams a local tangent sector in kilometers around the active expedition.

Games can eventually request smaller, higher-detail sectors without changing the global coordinate or terrain model. Distant populations can remain statistical; nearby populations can become individual simulated organisms.

## Living Globe knowledge carried forward

The original globe established seeded randomness, growth clocks, organism condition, crowding pressure, mortality boundaries, local persistence, a true day/night relationship and world-owned state. This foundation keeps those principles, but treats naturally occurring populations as deterministic sector data rather than permanent objects around one tiny sphere. Planting, chopping, fire and other interventions belong in a governed world-action adapter; they are not silently granted to every game.

## Controls

- Orbital: drag to rotate, wheel to change altitude, double-click a location to deploy.
- Surface: click the world to capture the mouse, use W/A/S/D to move, look with the mouse or arrow keys, hold Shift for fast traversal, and press Escape to release the cursor. If pointer lock is unavailable, click-drag remains available. Mouse look follows the conventional direction: right turns right and up looks up.
- Use **Find viable land** or **Relocate expedition** to stream another habitable sector.
- Use **Follow water** for a computed river reach or **Survey ocean** for a productive marine sector.
- Use the left console to change condition profiles and toggle systems independently.

## Extension rules

- The global coordinate model and world seed are world-owned foundation state.
- Games attach as rulesets or governed adapters. They may not own or reset the planet.
- Condition profiles alter climate, water and habitability without replacing planet identity.
- Earth-system columns keep condition-specific water and heat history while preserving the same coordinate and world lineage.
- The species catalog adds organisms by habitat requirements and behavior modules; species are no longer hard-coded into the renderer.
- Global simulation should remain hierarchical: planet statistics → regional populations → local individuals.
- Physics attaches at the active-sector scale through the v1 floating-origin frame. A future rigid-body engine must not require simulating the whole planet as one scene.
- Multiplayer controllers emit bounded `axm.controller-input/v1` intent. The host authority kernel owns canonical movement and the Living World service owns persistence.
- Named-world creation and attachment are explicit permission-gated operations; the planet never silently promotes browser state into shared truth.

See `docs/FOUNDATION_CONTRACT.md` for the coordinate, layer and future adapter contract.

## Honest limits

This is an exploratory procedural world model, not a scientific Earth simulator. Terrain, climate, tectonics, drainage and ecology are plausible abstractions. The loaded river network has persistent cross-scale routing, ocean-mouth receipts, a finite clay/silt/sand/gravel material cycle and conservative reach-scale floodplain storage, but no global depression filling, endorheic spill rules, resolved two-dimensional inundation, levee or bank-failure dynamics, resolved channel/coastal morphodynamics or continuously active global sediment network. Groundwater exchanges between loaded neighbors but has no three-dimensional aquifer geometry, plate provinces are not a full crustal dynamics solver, and soils have no chemistry horizons yet. Loaded atmosphere cells persist eight pressure levels with per-level dry-air mass, water tracers, sensible heat, tangent momentum, kinetic energy and hydrostatic geometry plus seven pressure-interface convective-energy and compensating-momentum states. Native level saturation, phase change, cloud reservoirs, precipitation descent, adjacent vertical exchange, interface buoyancy and loaded lateral transport are implemented and receipted. Atmosphere-owned C/O2/N2 state closes biosphere exchange, receives estuary nitrogen and is conservatively carried across loaded native dry-air routes, but it has no global mixing, continuous unloaded-cell circulation or resolved atmospheric chemistry. Paired floodplain-atmosphere exchange now moves CO2 carbon in either concentration-gradient direction and reaerates oxygen, but it remains a bounded temperature-aware proxy without pH, alkalinity, carbonate speciation, resolved turbulence or scientific calibration. Horizontal terrain adjustment and bounded interface overturning expose geopotential, pressure, buoyancy and kinetic-conversion work rather than hiding it. Native liquid/ice cloud paths drive bounded broadband shortwave/longwave feedback, and native-layer CO2 now adds a reference-relative, temperature-path-aware grey-gas adjustment to the surface ledger; aged land snow, snow on sea ice, sea-ice mass and surface fusion energy persist. This is not spectral, line-by-line or scientifically validated radiative transfer and does not resolve droplet/crystal size distributions, snow grains, brine, leads, ridging or dynamic ice motion. The atmosphere still has no global angular-momentum solve, resolved three-dimensional plumes, continuous unloaded-cell upper-air circulation, resolved aerosol/droplet/ice microphysics, turbulence closure, global circulation or ocean-current solver. There is also no general rigid-body engine, automatically running shared host, active multiplayer session, complete species catalog, individual animal AI or interiors yet. The host and controller paths are explicit contracts and tested local services, not an always-on production world.

## Rung 80: groundwater-water/aquifer-matrix thermal exchange

R80 adds a persistent parameterized aquifer-mineral-matrix sensible-heat owner
that is separate from the land-surface owner. After R79 establishes the
current groundwater-water owner, a digest-bound `90 day` bulk response applies
one equal-and-opposite heat transfer between groundwater water and the matrix.
The receipt independently closes the paired transfer, both owner ledgers, and
their combined energy. It moves no water and changes no matrix geometry.

Earth engine v42 preserves exact v41/R79 evidence and initializes the new
matrix from current groundwater temperature with an explicit no-history
checkpoint. System audit v30 and API v76 expose the R80 state, receipt, closure
policy, and lineage read-only. This remains a bounded parameterization, not
resolved aquifer conduction, geothermal forcing, phase change, scientific
calibration, or unloaded-global behavior. R80 remains `EXPERIMENTAL` and is
not a promotion or CANON decision.

## Rung 81: deep-soil-water/deep-subsurface-matrix thermal exchange

R81 adds a persistent parameterized deep-subsurface mineral-matrix
sensible-heat owner below the existing soil-depth land-surface owner and above
the R80 aquifer-matrix owner. Its explicit interval begins at `soilDepthM`,
uses a bounded `0.5 m` through `8 m` modeled thickness derived from the
available non-overlapping gap, and records its separation from the aquifer
matrix. The capacity uses the declared `2e6 J m-3 K-1` solid volumetric heat
capacity and a porosity-derived solid fraction. These are model parameters,
not measurements or calibration.

After R79 establishes the current deep-soil-water owner, a digest-bound
`45 day` bulk response applies one equal-and-opposite heat transfer between
that water owner and the new matrix. The exchange moves no water and changes
no owner geometry. Four scale-aware closures independently cover the paired
transfer, both owners, and their combined energy.

Earth engine v43 preserves exact v42/R80 and earlier evidence while creating
the R81 matrix at current deep-soil-water temperature as an explicit
no-history checkpoint. System audit v31 and API v77 expose the state, receipt,
closure policy, geometry, and lineage read-only. The independent audit
recomputes the interval rather than trusting the producer and rejects overlap,
detached owners, malformed lineage, changed water mass, changed geometry,
inflated closure bounds, and fabricated scope claims.

R81 is a bounded two-owner bulk response. It does not resolve subsurface heat
conduction, add geothermal forcing, model phase change, claim scientific
calibration, or claim behavior outside loaded land columns. It remains
`EXPERIMENTAL`; tests do not promote it or make it `CANON`.

## Rung 82: land-surface/deep-subsurface-matrix interface exchange

R82 connects the existing land-surface sensible-heat owner to R81's persistent
deep-subsurface mineral-matrix owner across their exact shared boundary at
clamped `soilDepthM`. A digest-bound `21 day` bulk response applies one
equal-and-opposite heat transfer after the current R81 step. It creates no new
material reservoir, changes no owner geometry, and treats neither side as an
external source.

The receipt independently closes the paired transfer, both owner ledgers, and
their combined energy with measured residuals and scale-aware bounds. Its
auditor recomputes the interface and surface capacity, binds the serialized
surface-energy stage and exact R81 final owner, and recognizes the R82 final
matrix as R81's downstream current handoff. Held cases prove both transfer
directions; adversarial cases reject unsigned proposals, detached owners,
noncoincident geometry, inflated tolerances, altered response parameters, and
fabricated scope claims.

Earth engine v44 preserves exact v43/R81 and earlier evidence and both current
owners while adding an explicit R82 no-history checkpoint. System audit v32
and API v78 expose the receipt, policy, interface, and audit read-only. This is
a parameterized interface response, not resolved conduction, geothermal
forcing, phase change, scientific calibration, or unloaded-global behavior.
R82 remains `EXPERIMENTAL`; tests do not promote it or make it `CANON`.

## Rung 83: deep-subsurface/aquifer-matrix thermal exchange

R83 connects the existing R82 deep-subsurface mineral-matrix owner to the
existing R80 aquifer mineral-matrix owner without creating another reservoir.
Their already declared intervals remain separated: the exchange records the
positive gap from the deep owner's lower boundary to the aquifer owner's upper
boundary and changes neither interval nor heat capacity.

Each loaded-land step binds the exact current R82 and R80 receipts, then posts
one signed, equal-and-opposite sensible-heat transfer. Its parameterized bulk
response uses `120 * (1 + separationM / 10)` days, so a wider declared gap
responds more slowly. Four scale-aware closures cover the paired transfer,
both owner ledgers, and their combined energy. The independent audit
recomputes the source digests, geometry, response, owner chain, temperature
envelopes, entries, and closures rather than trusting the producer.

Earth engine v45 preserves exact v44/R82, v43/R81, and v42/R80 evidence and
both current matrix owners while adding an explicit R83 no-history checkpoint.
System audit v33 and API v79 expose the state, receipt, closure policy,
separation, and audit read-only. Held cases prove both transfer directions;
adversarial cases reject unsigned proposals, detached owners, overlapping
geometry, inflated tolerances, altered response parameters, and fabricated
scope claims.

R83 is a distance-aware bulk response between separated owners. It does not
resolve inter-matrix, subsurface, or aquifer conduction; add external or
geothermal heat; model phase change; claim scientific calibration; or claim
behavior outside loaded land columns. It remains `EXPERIMENTAL`; tests do not
promote it or make it `CANON`.

## Rung 84: persistent intervening-vadose-matrix thermal mediation

R84 gives the exact positive mineral interval exposed by R83 its own
persistent sensible-heat owner. The owner begins at the existing
deep-subsurface matrix lower boundary and ends at the existing aquifer-matrix
upper boundary, so both interfaces are coincident and none of the three owner
intervals overlap. Its capacity is the interval thickness times the existing
porosity-derived solid fraction and declared `2e6 J m-3 K-1` solid volumetric
heat capacity.

R83 still executes and remains preserved as source evidence. R84 first posts
the exact opposite of R83's direct deep-to-aquifer transfer, restoring its
pre-R83 deep and aquifer owners, and then applies two simultaneous bulk legs:
deep-subsurface to vadose and vadose to aquifer. The two interface response
times use `75 * (1 + owner-center distanceM / 10)` days. One shared envelope
scale bounds all three owners. Seven scale-aware closures cover the R83
reconciliation, both paired transfers, each owner ledger, and the combined
three-owner energy ledger.

A deterministic scan of 246 loaded land columns found vadose thicknesses from
`11.843599875 m` through `29.84821025 m` and capacities from
`15,633,551.835` through `34,315,743.66 J m-2 K-1`. These are model-geometry
observations, not measurements or scientific calibration.

Earth engine v46 preserves exact v45/R83 and earlier evidence plus both current
matrix owners, then initializes the new owner at the mean current adjacent
matrix temperature with an explicit no-history checkpoint. System audit v34
and API v80 expose the state, receipt, closure policy, and lineage read-only.
Held cases prove both directions at both interfaces. Adversarial cases reject
unsigned proposals, detached owners, changed gap geometry, inexact R83
reversal, double-counting, inflated tolerance, altered distance response, and
fabricated scope claims.

R84 does not move water, add external or geothermal heat, resolve conduction,
model phase change, claim scientific calibration, or claim behavior outside
loaded land columns. The upstream soil/groundwater source-heat owner remains
unresolved and is not debited. R84 remains `EXPERIMENTAL`; tests do not
promote it or make it `CANON`.

## Rung 85: native vadose-matrix thermal mediation

R85 retires the current runtime's R83 direct deep-to-aquifer transfer and the
R84 compensating reversal. Each loaded-land step now binds the exact current
R82 surface/subsurface receipt as the deep-matrix source and the exact current
R80 groundwater/aquifer receipt as the aquifer-matrix source. It computes the
deep-to-vadose and vadose-to-aquifer requests simultaneously from those two
owners and the persistent vadose owner, then applies only the three resulting
owner entries. No current R83 receipt or direct-transfer budget entry is
emitted.

The geometry, capacities, `75 * (1 + owner-center distanceM / 10)` response
times, shared envelope limiter, and bounded scientific nonclaims remain those
declared by R84. Six scale-aware closures cover both paired transfers, each of
the three owner ledgers, and combined three-owner energy. The independent R85
audit recomputes both source digests, geometry, responses, limiter, owner
handoffs, entries, and every closure. Re-signed changed geometry, inflated
tolerances, altered responses, detached owners, and fabricated direct,
external-heat, or calibration claims fail.

Earth engine v47 accepts v46 state without reconstructing heat history. It
preserves the exact current deep, vadose, and aquifer owners; moves intact R83
and R84 receipts into labelled read-only compatibility evidence; clears them
from current receipt and budget authority; and creates an explicit no-history
R85 checkpoint. The first later step earns native evidence. System audit v35
and API v81 expose the current native receipt and legacy compatibility lineage
read-only.

R85 does not move water, add external or geothermal heat, resolve conduction,
model phase change, claim scientific calibration, or claim behavior outside
loaded land columns. R83 and R84 remain historical `EXPERIMENTAL` contracts,
not current runtime paths. R85 remains `EXPERIMENTAL`; tests do not promote it
or make it `CANON`.

## Rung 86: cross-organ three-matrix thermal aggregate

R86 adds one read-only current-step accounting receipt across the persistent
deep-subsurface, vadose, and aquifer matrix owners. It binds the exact R80
groundwater/aquifer, R81 deep-soil/subsurface, R82 surface/subsurface, and R85
native-vadose receipts. Their step ordinals and sequential owner handoffs must
match exactly.

The aggregate treats the R80 aquifer entry and R81/R82 deep-matrix entries as
the only external changes to the three-owner matrix subsystem. R85's three
owner entries close separately as internal transfers. A second scale-aware
closure reconciles final total matrix sensible heat against the three initial
owners and those three external entries. The retired R83 direct transfer and
legacy R83/R84 compatibility evidence are excluded.

The ledger does not mutate physical state. System audit v36 independently
recomputes its four source bindings, owner chain, signed entries, measured
residuals, and one-joule/eight-ULP bounds. Adversarial cases reject detached
owners and source digests, inflated tolerance, retired-transfer counting, and
fabricated physical or scientific authority.

Earth engine v48 preserves exact v47 matrix owners and current R80/R81/R82/R85
evidence while adding only a no-history aggregate checkpoint. The first later
step earns R86 evidence. API v82 exposes the ledger and audit read-only.

R86 adds no heat source or transfer, does not move water, resolve conduction,
geothermal forcing or phase change, claim scientific calibration, resolve or
debit the upstream soil/groundwater source-heat owner, or claim unloaded-global
behavior. It remains `EXPERIMENTAL`; tests do not promote or canonize it.

## Rung 87: consecutive three-matrix thermal continuity

R87 adds a read-only temporal receipt after a loaded land column has produced
two consecutive R86 aggregate receipts. It embeds both intact R86 sources,
requires the earlier final deep-subsurface, vadose, and aquifer owners to equal
the later initial owners exactly, and requires consecutive step ordinals. The
later R80 aquifer entry and R81/R82 deep-matrix entries are the only external
changes counted; its R85 entries remain internal.

One scale-aware closure reconciles all three later final owners against all
three earlier final owners and the three current external entries. The receipt
preserves its measured residual and derives its numeric bound from the same
one-joule/eight-ULP policy as the underlying thermal owner ledgers. The
independent audit recomputes both embedded R86 digests, source bindings, owner
handoff, external/internal classification, closure, persistence, and nonclaims.
Re-signed detached sources or owners, repeated ordinals, inflated bounds, and
fabricated physical or scientific authority fail.

Earth engine v49 accepts v48 state by preserving exact current R86 and all
three owners while adding only an R87 no-history checkpoint. It does not
invent earlier temporal evidence; the first later loaded-land step earns R87.
System audit v37 and API v83 expose the receipt, policy, and audit read-only.

R87 does not mutate physical owners, move water or heat, count retired R83 or
legacy compatibility evidence, add external or geothermal heat, reconstruct
history, resolve conduction or phase change, claim scientific calibration, or
claim unloaded-global behavior. The upstream soil/groundwater source-heat
owner remains unresolved and is not debited. R87 remains `EXPERIMENTAL`;
tests do not promote or canonize it.

## Rung 88: source-complete three-matrix continuity witness

R88 closes the bounded provenance gap left when R87 preserved a previous R86
aggregate after its four current source receipts had rotated away. Each land
step now packages the exact current R80 groundwater/aquifer, R81
deep-soil/subsurface, R82 surface/subsurface, and R85 native-vadose receipts in
one digest-bound source bundle. After two adjacent bundles exist, the R88
witness binds the current R87 receipt and retains both bundles.

Both embedded R86 aggregates are replayed from their own four source receipts:
source bindings and ordinals, sequential owner handoffs, external and internal
entries, initial/final owners, and both scale-aware closures must all match
exactly. This is source-complete at the R80/R81/R82/R85 receipt boundary; it is
not a claim that every ancestor behind those receipts is retained forever.
The window remains exactly two adjacent aggregate-producing steps.

System audit v38 independently recomputes both replays and the current-column
bindings rather than trusting the producer summaries. Re-signed altered source
receipts, bundle digests, replay summaries, or scope claims fail. Earth engine
v50 accepts v49 by preserving exact current R86/R87 and source receipts,
packaging only that already-present current evidence as a checkpoint, and
emitting no R88 witness until the first later step. API v84 exposes the source
bundle, replay, witness, and audit read-only.

R88 does not mutate physical owners, move water or heat, count retired or
legacy evidence, add external or geothermal heat, reconstruct heat history,
resolve conduction or phase change, claim scientific calibration, or claim
unloaded-global behavior. The upstream soil/groundwater source-heat boundary
remains unresolved and undebited where previously declared. R88 remains
`EXPERIMENTAL`; tests do not promote or canonize it.

## Rung 89: expanded matrix source-owner energy closure

R89 uses the exact current R88 source bundle to close the three R80/R81/R82
entries that R86 correctly treated as external to its matrix-only boundary.
The new read-only ledger binds current groundwater-water, deep-soil-water, and
surface sensible-heat counterpart entries to the equal-and-opposite aquifer
and deep-subsurface matrix entries. R85 remains internal to the three matrix
owners.

The receipt retains the six initial and final current-step owners: three
counterpart source owners plus deep-subsurface, vadose, and aquifer matrix
owners. Three paired counterpart closures, the native R85 closure, the
counterpart-to-R86 aggregate closure, and the expanded six-owner closure all
use the established one-joule or eight-ULP scale-aware bound and preserve
their measured residuals.

System audit v39 independently recomputes the exact R88 bundle and R86
bindings, current ordinals, source and matrix entries, sequential owner chain,
all six closures, current-column owners, budget binding, and bounded truth.
Re-signed detached bundles, altered counterpart entries or replayed closures,
inflated tolerances, and fabricated physical or scientific authority fail.

Earth engine v51 accepts v50 while preserving exact current R80/R81/R82/R85,
R86/R87/R88, and all six current owners. It emits no retroactive R89 ledger;
the first later loaded-land step earns one from current evidence. API v85
exposes the schemas and description read-only.

R89 proves current-step counterpart debits and credits only. It does not fund,
resolve, or debit the historical initial matrix-endowment/source-origin
boundary, reconstruct historical heat, mutate physical owners, add heat,
resolve conduction or phase change, add geothermal forcing, claim scientific
calibration, or claim unloaded-global behavior. R89 remains `EXPERIMENTAL`;
tests do not promote or canonize it.

## Rung 90: configured matrix initial-endowment provenance

R90 types the model-origin boundary that R89 intentionally left open. Every
fresh v52 land column now retains one immutable, digest-bound receipt for the
configured initial thermal state of its deep-subsurface, intervening-vadose,
and aquifer matrix owners. The receipt binds the exact column ID, seed, initial
day, substrate, surface-derived deep-matrix temperature, seasonal
aquifer-matrix temperature, and arithmetic-mean vadose temperature.

All three parameterizations and initial owners replay deterministically from
those inputs. The retained total is explicitly a modeled sensible-heat
coordinate relative to zero Celsius. It is not absolute thermodynamic energy,
a historical heat-transfer event, or evidence of a physical source-owner
debit. The receipt contains no transfer entries and no source-owner receipt.

System audit v40 independently recomputes the digest, creation context,
substrate binding, all parameters and initial owners, the vadose adjacent mean,
the modeled total, the configured-boundary classification, and the current
matrix states' immutable geometry and capacity fields. Re-signed changed
source temperatures, detached initial or current parameters, and fabricated
physical-source, debit, transfer, absolute-energy, or calibration claims fail.

Earth engine v52 accepts v51 while preserving exact current R89/R88 evidence,
source owners, and matrix owners. Because v51 did not retain initialization
inputs, migration emits no R90 receipt and records an explicit no-history
checkpoint. Later steps cannot earn genesis evidence retroactively; the R90
audit remains `NOT_APPLICABLE` for that lineage. API v86 exposes the receipt,
boundary schema, and description read-only.

R90 resolves model provenance only. The historical physical source owner for
the configured initial matrix endowment remains unresolved and undebited. R90
does not mutate owners, move or add heat, reconstruct history, resolve
conduction or phase change, add geothermal forcing, claim scientific
calibration, claim absolute thermodynamic energy, or claim unloaded-global
behavior. R90 remains `EXPERIMENTAL`; tests do not promote or canonize it.

## Rung 91: configured genesis-to-first-step matrix continuity

R91 binds the exact immutable R90 configured initial-endowment receipt to the
exact R86 aggregate produced by the first loaded-land runtime step. Its three
configured genesis owners must equal, field for field, the first aggregate's
initial deep-subsurface, vadose, and aquifer matrix owners. The receipt retains
both source receipts, their digests and schemas, the exact owner handoff, and
an empty unreceipted-interval list.

The closure compares the configured and first-step initial modeled
sensible-heat totals with the established one-joule or eight-ULP scale-aware
bound. This is a zero-event continuity proof: it records neither a transfer
nor a state mutation. System audit v41 independently recomputes both source
digests, all bindings and owners, the empty interval, totals, closure,
emission mode, persistence, and nonclaims. Re-signed detached owners, changed
source bindings, inflated tolerances, fabricated interval or transfer entries,
and invented physical or scientific authority fail.

Earth engine v53 accepts v52 with three explicit outcomes. An unstepped v52
column with intact R90 remains awaiting its first aggregate and earns R91 only
on that real first step. A v52 first-step save with exact retained R90 and R86
sources may receive a migration-labelled R91 receipt. A later v52 save that no
longer retains the first aggregate receives a permanent no-history checkpoint;
R91 is not reconstructed later. Current v53 receipts and checkpoints persist
exactly. API v87 exposes the receipt, closure policy, description, and audit
read-only.

R91 does not resolve or debit the historical physical source owner behind the
configured endowment. It does not move or add heat, reconstruct an unobserved
interval, prove a physical transfer, claim absolute thermodynamic energy,
resolve conduction or phase change, add geothermal forcing, claim scientific
calibration, or claim unloaded-global behavior. R91 remains `EXPERIMENTAL`;
tests do not promote or canonize it.

## Rung 92: configured-genesis through first-step expanded owner closure

R92 binds the exact immutable R91 genesis-continuity receipt to the exact R89
expanded six-owner ledger produced by the first loaded-land runtime step. It
requires R91's configured deep-subsurface, vadose, and aquifer matrix owners to
equal the R89 first-step initial matrix owners exactly. The initial
groundwater-water, deep-soil-water, and surface sensible-heat counterpart
owners come from that same first-step R89 ledger.

The resulting read-only graph substitutes the configured matrix genesis for
R89's equal first-step initial matrix owners, retains all six configured/first-
step initial and final owners, and independently closes their modeled sensible
heat with the established one-joule or eight-ULP scale-aware policy. This
extends the exact configured-state boundary through the first runtime step; it
does not claim that the three counterpart owners have their own genesis or
historical initialization provenance. They enter this proof only at the first
runtime step.

System audit v42 independently recomputes both embedded source digests, schema
and context bindings, exact matrix handoff, all six owner totals, measured
residual and derived tolerance, emission mode, persistence, and bounded truth.
Re-signed detached R89 owners, changed source bindings, inflated tolerances,
and fabricated counterpart-genesis, physical-history, mutation, transfer,
conduction, geothermal, calibration, or global claims fail.

Earth engine v54 accepts v53 with three evidence-supported outcomes. An
unstepped v53 lineage remains awaiting its first R89 ledger and earns native
R92 only on the real first step. A v53 first-step save may receive a
migration-labelled receipt only when exact retained R91 and first-step R89
sources support it. A later save without the first R89 ledger receives a
permanent no-history checkpoint. API v88 exposes the schemas, description,
receipt, and audit read-only.

R92 does not fund, resolve, or debit the historical physical source owner of
the configured matrix endowment, and it does not bind historical counterpart
initialization provenance. It does not mutate owners, move or add heat,
reconstruct history, claim absolute thermodynamic energy, resolve conduction
or phase change, add geothermal forcing, claim scientific calibration, or
claim unloaded-global behavior. R92 remains `EXPERIMENTAL`; tests do not
promote or canonize it.

## Rung 93: configured counterpart initial-endowment provenance

R93 closes the model-configuration provenance gap for the three counterpart
owners that R89 first observes at runtime: groundwater water, deep-soil water,
and land-surface sensible heat. Every fresh v55 land column retains one
immutable, digest-bound receipt for their configured initial states. The
receipt binds the exact column ID, seed, initial day, substrate, sample
moisture, ecology freshwater potential, seasonal groundwater temperature,
surface-derived deep-soil temperature, and rounded surface temperature.

The groundwater and deep-soil water amounts replay the same clamped,
six-decimal initialization formulas used by the Earth engine. Their modeled
sensible heat uses the persistent water-owner coordinate and the declared
4,184 J kg-1 K-1 specific heat. The surface owner replays from the existing
parameterized areal heat capacity and rounded initial surface temperature.
The retained total is explicitly modeled sensible heat relative to zero
Celsius, not absolute thermodynamic energy.

System audit v43 independently recomputes the receipt digest, configured
signals, water amounts, three owners, modeled total, creation context,
substrate binding, budget persistence, and every nonclaim. A pristine
unstepped column must still hold the exact initialized owners. If a valid
loaded groundwater-transport receipt has already changed an otherwise
unstepped column, the audit requires that digest-bound transport's final owner
to equal the current groundwater owner instead of falsely treating the column
as pristine. Re-signed changed moisture, detached owners or substrate, and
fabricated first-step, source, debit, transfer, mutation, physical-history,
conduction, geothermal, calibration, or global claims fail.

Earth engine v55 accepts v54 without reconstructing configuration inputs that
v54 did not retain. Migration preserves the current owners, emits no R93
receipt, and records a permanent no-history checkpoint; later steps cannot
earn genesis provenance retroactively. Native receipts and checkpoints
survive exact save and restore. API v89 exposes the receipt, boundary schema,
description, and audit read-only.

R93 proves configured model provenance only. It does not prove the handoff
from these initial counterpart owners into the first runtime step. It does not
resolve or debit historical physical source owners, record a heat transfer,
mutate owners, reconstruct history, claim absolute thermodynamic energy,
resolve conduction or phase change, add geothermal forcing, claim scientific
calibration, or claim unloaded-global behavior. R93 remains `EXPERIMENTAL`;
tests do not promote or canonize it.

## Rung 94: receipted counterpart genesis-to-first-matrix handoff

R94 extends R93 through the first R89 matrix source-owner ledger without
pretending that the raw endpoint owners are equal. They normally are not:
first-step hydrology changes groundwater and deep-soil water, the paired
root/deep and deep/groundwater organs exchange sensible heat, and the surface
energy ledger changes the surface owner before R89 observes those owners.

Every proved handoff retains the exact R93 receipt, the exact step-one R89
ledger, and the exact first-step land-hydrology, surface/snow,
surface/root-zone, root/deep-water, and deep/groundwater-water receipts. The
water-owner chains are field-exact. The surface chain uses the existing
one-joule energy floor and explicit 1e-6 temperature/capacity coordinate
reconciliation because the surface-energy projection is rounded while the
live surface owner retains its unrounded coordinate. Three per-owner closures
apply only the retained interval entries; their measured residuals and
derived scale-aware tolerances are preserved. The normal wet-step fixture
closes at approximately -1.15e-8 J m-2 for groundwater, -3.99e-11 J m-2 for
deep-soil water, and zero for surface sensible heat.

System audit v44 independently re-digests every embedded typed receipt,
checks all source bindings and owner-chain joins, recomputes the interval
entries and three closures, checks persistence, and enforces the nonclaims.
A re-signed R89 endpoint detached from the interval, changed source binding,
unreceipted entry, or fabricated mutation, transfer, combined-six-owner,
physical-history, conduction, geothermal, calibration, or global claim fails.
If an unstepped column's configured counterpart state was manually detached
before its first runtime step, R94 records a no-history checkpoint rather
than crashing the unrelated runtime or inventing continuity; R93's own audit
still exposes that detachment.

Earth engine v56 accepts v55 with evidence-dependent outcomes. An unstepped
v55 save retaining R93 waits for the real first-step interval. A step-one v55
save may receive a migration-labelled R94 receipt only when it retains the
complete valid R93, R89, and interval source set. Later or incomplete saves
receive a permanent no-history checkpoint. Current receipts and checkpoints
survive exact save and restore. API v90 exposes the receipt, closure schemas,
description, and audit read-only.

R94 proves a receipted modeled-owner handoff, not raw endpoint equality. It
does not mutate an owner, perform a new transfer, prove a combined six-owner
graph, resolve or debit historical physical sources, reconstruct heat, claim
absolute thermodynamic energy, resolve conduction or phase change, add
geothermal forcing, claim scientific calibration, or claim unloaded-global
behavior. R94 remains `EXPERIMENTAL`; tests do not promote or canonize it.

## Rung 95: counterpart historical-source evidence requirements

R95 turns the remaining physical-source gap into an exact, inspectable set of
requirements without filling it with invented history. One digest-bound
receipt retains the exact R93 configured counterpart source and declares one
requirement each for groundwater water, deep-soil water, and surface sensible
heat. Every requirement binds its exact configured owner and owner path.

Each requirement names the evidence still needed: a typed persistent source
owner existing before configured endowment, an independent identity and
physical scope, compatible energy coordinates and units, exact sender states
before and after debit, the exact configured receiver, sender/receiver
closure, and declared human or AXM review of the proposed physical meaning.
All three source-owner slots and all three sender-debit slots remain null; all
criteria remain false and all requirements remain `UNRESOLVED`.

System audit v45 independently reconstructs the requirements from the exact
R93 owners, re-digests both receipts, checks attachment and persistence, and
rejects re-signed source rebinding or fabricated candidates, debits,
resolution, mutation, transfer, history, combined graphs, conduction,
geothermal forcing, calibration, or global authority. Earth engine v57 can
derive this missing-evidence ledger from an exact v56 R93 source, labelled as
migration from retained evidence; without R93 it records a permanent
checkpoint. API v91 exposes both schemas and the audit read-only.

R95 declares what proof would be required; it does not provide an admission
path or resolve any source. It does not debit an owner, move heat, reconstruct
history, claim absolute thermodynamic energy, resolve conduction or phase
change, add geothermal forcing, claim scientific calibration, or claim
unloaded-global behavior. R95 remains `EXPERIMENTAL`; Mike Tobi remains the
commit, merge, promotion, and `CANON` gate.

## Rung 96: matrix-endowment historical-source evidence requirement

R96 applies the same honest missing-evidence discipline to R90's configured
deep-subsurface, vadose, and aquifer endowment. It retains the exact R90
receipt and declares one requirement for the whole three-owner endowment
bundle, matching R90's singular historical-source boundary instead of
inventing three source owners or pretending their cardinality is known.

The requirement binds all three exact configured states and their common
thermal coordinate. Its physical-source and sender-debit evidence slots stay
null; all admission criteria stay false; both source-owner and debit-receipt
cardinalities stay unresolved; and its status stays `UNRESOLVED`. The missing
evidence includes prior persistent source state, independent identity and
scope, compatible coordinates, sender pre/post states, allocation to all
three R90 owners, sender/receiver closure, and human or AXM physical-meaning
review.

System audit v46 independently reconstructs that bundle requirement from the
embedded R90 source, checks its digest, attachment, summary, budget
persistence, empty evidence slots, unresolved cardinalities, and nonclaims,
and rejects re-signed source drift or fabricated source, debit, resolution,
mutation, transfer, history, conduction, geothermal forcing, calibration, or
global authority. Earth engine v58 can derive the missing-evidence receipt
from an exact v57 R90 source, labelled as migration from retained evidence;
without R90 it records a permanent checkpoint. API v92 exposes both schemas
and the audit read-only.

R96 defines the proof gap; it does not admit a source, determine source
cardinality, debit an owner, fund the configured endowment, move heat, or
reconstruct history. R96 remains `EXPERIMENTAL`; Mike Tobi remains the commit,
merge, promotion, and `CANON` gate.

## Rung 97: asymmetric historical-source requirements inventory

R97 binds the exact R95 counterpart requirements and the exact R96 matrix-
endowment requirement into one read-only inventory without erasing their
difference. It preserves R96 as one three-owner endowment-bundle requirement
and R95 as three owner-scoped requirement records.

The inventory exposes two source boundaries, six configured-owner references,
four unresolved requirement records, and eight empty evidence slots: four for
historical physical sources and four for sender-debit receipts. It preserves
R96's explicitly unresolved cardinalities and does not reinterpret R95's
three owner-scoped records as proof of three distinct physical sources. It
performs no cross-boundary source or debit cardinality inference.

System audit v47 independently re-digests the inventory and both source
receipts, reconstructs both shapes and the four-record/eight-slot summary,
checks current-column attachment and budget persistence, and rejects source
rebinding, semantic flattening, fabricated evidence or authority, and all
physical-history claims. Earth engine v59 derives a migration-labelled
inventory only from an exact v58 save retaining both R95 and R96; if either is
missing it records a permanent checkpoint. API v93 exposes both inventory
schemas, the description, and the audit read-only.

R97 inventories unresolved proof obligations; it does not admit a source,
supply a debit receipt, fund either configured endowment, determine combined
physical-source cardinality, claim a combined six-owner physical graph,
mutate an owner, move heat, or reconstruct history. R97 remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and `CANON`
gate.

## Rung 98: historical-source evidence readiness

R98 maps each of R97's four exact unresolved requirement records to its seven
machine-readable evidence or authority gaps without changing either source
shape. Across the four records it emits 28 missing acquisition requests for
nine unique capabilities: 24 `EVIDENCE` gaps and four `AUTHORITY` gaps for
physical-meaning review.

Every record remains `BLOCKED` at the capability route and `NOT_READY` for
admission. That typed route reports what outside evidence and authority are
still absent; it does not mark the persistent Foundation Planet goal blocked.
Observed and verified evidence counts, candidate-package count, and
admission-ready count all remain zero. No candidate package, review decision,
or admission authority is created.

System audit v48 independently rebuilds the capability mapping from exact R97
requirements and rejects missing requests, semantic substitutions, fabricated
evidence, candidate or review injection, and physical-history claims. Earth
engine v60 may derive a migration-labelled readiness receipt only from an
exact v59 save retaining R97; without R97 it records a permanent checkpoint.
API v94 exposes the receipt, record, and acquisition-request schemas plus the
description and audit read-only.

R98 is an acquisition contract, not acquired evidence. It does not identify
or admit a historical physical source, supply or verify a sender-debit
receipt, resolve cardinality, fund an endowment, mutate an owner, move heat,
reconstruct history, or claim scientific authority. R98 remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and `CANON`
gate.

## Rung 99: historical-source evidence intake contract

R99 gives R98's 28 missing acquisition requests a typed review-intake
boundary without acquiring any evidence. The exact 24 `EVIDENCE` requests
become untrusted candidate-evidence submission slots. The four `AUTHORITY`
requests become Mike Tobi/AXM review slots and cannot be supplied or
self-attested by a candidate package.

Candidate packages contain caller-claimed metadata and SHA-256 content
digests only. The pure structural assessor checks envelope integrity, exact
contract binding, request identity, and expected evidence shape; it never
loads or executes the referenced content. A complete 24-item package is only
`STRUCTURALLY_COMPLETE_AWAITING_VERIFICATION_AND_AUTHORITY`: its evidence and
physical-meaning verdicts remain `UNKNOWN`, and admission remains
`NOT_AUTHORIZED`. Candidate packages and assessments are not persisted in
world state.

System audit v49 independently rebuilds all 28 slots from exact R98 and
rejects routing substitutions, stored candidates or reviews, false
verification, authority, admission, provenance, history, or material claims.
Earth engine v61 may derive a migration-labelled intake contract only from an
exact v60 save retaining R98; without exact R98 it records a permanent
checkpoint. API v95 exposes the five R99 schemas, description, and pure
candidate-package create/assess helpers.

R99 does not identify or verify a historical physical source, admit a source
or debit receipt, resolve source-owner cardinality, fund an endowment, mutate
an owner, move heat, reconstruct history, or claim scientific authority. R99
remains `EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and
`CANON` gate.

## Rung 100: historical-source evidence artifact integrity

R100 binds the exact R99 intake contract and preserves all 28 routes. Its 24
`EVIDENCE` routes accept transient, caller-supplied inert `Uint8Array` bytes
for exact SHA-256 comparison with the candidate item's claimed content
digest. The four `AUTHORITY` routes remain excluded from byte verification.
Inputs are capped at 4 MiB per artifact and 32 MiB per assessment.

A matching digest produces only `CONTENT_DIGEST_MATCH`: it proves byte
equality with the caller's claim, not observation authenticity, provenance,
physical meaning, or evidence validity. Those verdicts remain `UNKNOWN`, and
admission remains `NOT_AUTHORIZED`. The helper clones bytes before hashing;
it does not parse, execute, persist, admit, or apply their content, and it does
not mutate world state.

System audit v50 independently rebuilds the exact 28-route contract and its
24/4 split, checks current-column attachment, zero persistent counts, resource
bounds, budget persistence, and bounded truth, and rejects route substitution,
stored artifacts or assessments, false verification, authority, admission,
history, or physical claims. Earth engine v62 may derive a migration-labelled
contract only from an exact v61 save retaining R99; without exact R99 it
records a permanent checkpoint. API v96 exposes the five R100 schemas,
description, and async transient digest-comparison helper.

R100 closes only the byte-to-claimed-digest comparison capability. It does
not authenticate an observation, verify provenance, review physical meaning,
verify or admit historical evidence, identify or debit a historical physical
source owner, resolve cardinality, fund an endowment, reconstruct heat, or
claim scientific authority. R100 remains `EXPERIMENTAL`; Mike Tobi remains
the commit, merge, promotion, and `CANON` gate.

## Rung 101: historical-source observation-authenticity requests

R101 binds the exact R100 artifact-integrity contract and preserves all 28
routes. Its 24 `EVIDENCE` routes now declare requests for the missing
`evidence.observation.authenticity.verify` capability. Each request retains the
native claim kind from R98/R99 and supplies a bounded proof plan for one of
three evidence classes: persistence, static structure, or transport. The four
Mike/AXM `AUTHORITY` routes remain excluded and cannot be converted into
candidate-verification routes.

The transient packet builder accepts only an exact R101 contract, a valid and
structurally reviewable R99 candidate package, and the exact matching R100
`PASS` digest-integrity assessment. It then emits
`AWAITING_INDEPENDENT_OBSERVATION_AUTHENTICITY_EVIDENCE`. The packet contains
request metadata and matching R100 receipt digests, not artifact bytes. It
requires an independent verifier and leaves verifier identity, observed
evidence, decision, authenticity, provenance, physical meaning, and admission
empty, `UNKNOWN`, or `NOT_AUTHORIZED` as appropriate.

System audit v51 independently reconstructs the 28-route contract and its
24/4 split, three native proof-plan kinds, exact R100 binding, zero verifier,
evidence, decision, packet-persistence, and admission counts, budget binding,
and bounded truth. It rejects route substitution, weaker proof plans, source
rebinding, stored verifier material, fabricated decisions, and truth
inflation. Earth engine v63 may derive a migration-labelled contract only from
an exact v62 save retaining R100; without exact R100 it records a permanent
checkpoint. API v97 exposes the four R101 schemas, description, and transient
packet builder while retaining the R100 v96 digest-comparison API.

R101 closes only the request-routing and packet-construction contract. No
trusted verifier registry, verifier identity, independent observation record,
verification decision, authenticity, provenance, physical-meaning review,
persistence, admission, historical physical source owner, or debit receipt is
provided. The remaining outcome is therefore still blocked on independent
`evidence.observation.authenticity.verify` evidence and Mike/AXM
`authority.physical-meaning.review`. R101 remains `EXPERIMENTAL`; Mike Tobi
remains the commit, merge, promotion, and `CANON` gate.

## Rung 102: signed authenticity-response integrity

R102 binds the exact R101 request contract and preserves all 28 routes. Its 24
evidence routes accept bounded response envelopes whose claimed proof surface
must match the native request kind: save/restart/reload comparison for
persistence, direct source/schema inspection for static structure, or paired
sender/receiver receipts for transport. The four Mike/AXM authority routes stay
excluded. Each envelope covers every request exactly once, is digest-bound to
the R102 contract and R101 packet, retains only caller-claimed evidence
descriptors, and is capped at 65,536 canonical JSON characters.

The transient verifier checks a detached Ed25519 signature over the exact
canonical envelope with a caller-supplied 32-byte raw public key. `PASS` means
only that this envelope matches this signature under that supplied key. It does
not establish that the key is trusted, belongs to the claimed verifier, was
used independently of the candidate producer, or proves the claimed
observation. The assessment therefore leaves verifier-key trust, identity,
independence, authenticity, provenance, physical meaning, evidence, and
admission `UNKNOWN` or `NOT_AUTHORIZED`; neither inputs nor outputs persist or
mutate the world.

System audit v52 independently rebuilds all routes and zero-material counts
from exact R101 and rejects algorithm substitution, authority-route conversion,
stored responses or assessments, fictional key trust, source rebinding, and
truth inflation. Earth engine v64 may derive a migration-labelled R102 contract
only from an exact v63 save retaining R101; a lineage without exact R101 gets a
permanent checkpoint. API v98 exposes the six schemas, response builder,
canonicalizer, and async detached-signature verifier while preserving the R101
v97 API.

R102 closes only a structural response-envelope and supplied-key signature-
integrity seam. It provides no trusted-key registry, verifier identity or
independence proof, authentic observation, provenance, physical-meaning review,
verified evidence, persistence, candidate admission, historical physical
source owner, or debit receipt. R102 remains `EXPERIMENTAL`; Mike Tobi remains
the commit, merge, promotion, and `CANON` gate.

## Rung 103: verifier-key-binding evidence requests

R103 binds the exact R102 signed-response contract and preserves all 28 routes.
Its 24 evidence routes declare the still-missing `trust.verifier-key.bind`,
`identity.verifier.claim.resolve`, and
`evidence.verifier.independence.verify` capabilities. The four Mike/AXM
authority routes remain excluded. The persisted contract contains no trusted
registry, key binding, identity evidence, independence evidence, decision, or
request packet.

The transient builder accepts only an exact R103 contract, exact R101 request
packet, exact R102 response envelope, and a signature input that produces a
fresh R102 Ed25519 integrity `PASS`. It does not trust a stored assessment.
Each emitted request contains hashes and claimed identifiers, never the raw
public key or signature bytes. Literal equality between the candidate's
claimed producer id and claimed verifier id is explicit counterevidence;
literal inequality is explicitly not proof of independence.

System audit v53 independently reconstructs the 28/24/4 contract from exact
R102 and rejects capability substitution, authority-route conversion, stored
trust or identity material, independence evidence, decisions, source
rebinding, and truth inflation. Earth engine v65 may derive a
migration-labelled R103 contract only from an exact v64 save retaining R102;
without exact R102 it records a permanent checkpoint. API v99 exposes the four
R103 schemas, description, and async transient request builder while preserving
the R102 v98 API.

R103 closes only request routing for evidence that could support later trust,
identity, and independence review. It does not provide a trusted verifier
registry, bind a key, resolve identity, establish independence, authenticate
an observation, verify provenance or physical meaning, persist a decision,
admit a candidate, identify a historical physical source owner, or supply a
debit receipt. R103 remains `EXPERIMENTAL`; Mike Tobi remains the commit,
merge, promotion, and `CANON` gate.

## Rung 104: authority-decision and revocation signature integrity

R104 binds the exact R103 verifier-key-binding request contract and preserves
its 28/24/4 route boundary. The 24 eligible routes now declare local support
for `authority.verifier-key-binding-decision.signature.verify` and
`authority.verifier-key-binding.revocation.verify`, while the required
`authority.host-trust-anchor.provision` capability remains unavailable. The
persisted contract contains no policy, host trust anchor, decision, revocation
snapshot, assessment, binding, identity evidence, or admission state.

Transient callers may describe a contract-wide policy with distinct Ed25519
decision and revocation public-key hashes, bounded policy and artifact windows,
and no private keys. That descriptor is always labelled caller-supplied and
untrusted. A decision envelope must cover every request in the exact transient
R103 packet and may request `BIND`, `HOLD`, or `REJECT`; none of those actions
is applied. A separately signed revocation snapshot may revoke a decision
digest, decision nonce, or verifier-key hash.

The verifier checks both detached signatures, supplied-key hashes, exact source
digests, current policy/decision/revocation windows, authority-key separation
from the claimed verifier key, and revocation hits. A `PASS` means only that
the two transient artifacts are intact under the caller-supplied policy keys.
Host policy authority, verifier binding, identity, independence, observation
authenticity, provenance, physical meaning, evidence verification, and
admission all remain unresolved. Raw keys and signatures and all transient
R104 artifacts remain outside world state; there is no replay ledger.

System audit v54 independently reconstructs the exact R103-bound 28/24/4
contract and rejects route, capability, source, persistence, trust, binding,
authority, and truth inflation. Earth engine v66 may derive a migration-labelled
R104 contract only from an exact v65 save retaining R103; otherwise it records
a permanent checkpoint. API v100 exposes the eight R104 schemas, transient
builders, canonical signing text, verifier, and description while preserving
API v99.

R104 closes only decision-envelope and revocation-snapshot integrity under an
untrusted caller-supplied policy. It does not provision a host trust anchor,
trust the policy, bind a verifier key, resolve identity, establish independence,
authenticate an observation, verify provenance or physical meaning, persist a
decision or replay guard, admit evidence, identify a historical physical source
owner, or supply a debit receipt. R104 remains `EXPERIMENTAL`; Mike Tobi remains
the commit, merge, promotion, and `CANON` gate.

## Rung 105: host-bound trust-anchor provisioning proposal

R105 binds the exact R104 authority-decision integrity contract and preserves
its 28/24/4 route boundary. The 24 eligible routes now declare local support
for `authority.host-trust-anchor.provision.proposal.create`, while the actual
`authority.host-trust-anchor.provision` capability remains unavailable. The
persisted contract contains no host reference, policy, proposal, trust anchor,
host receipt, binding, identity evidence, replay entry, or admission state.

The transient builder accepts an exact R105 contract, its exact transient R104
caller-supplied policy descriptor, a structurally valid named-world host
projection, and a bounded request for the AXM host-authority review seat. It
binds the policy digest and its decision/revocation key hashes plus the claimed
host world id, lineage, revision, digest, and owner label. It carries no raw
key or signature bytes. A validator may also compare the embedded host
reference back to the supplied projection, preventing re-digested revision or
digest rebinding.

The proposal is not a host patch. Its fixed effects say `applyAuthority:
false`, `hostAccepted: false`, `hostTrustAnchorInstalled: false`, zero trusted
bindings, no persistence, and no world mutation. Its status remains
`PENDING_MIKE_TOBI_AXM_HOST_AUTHORITY_DECISION_PROPOSAL_ONLY`; host identity,
host authority, acceptance, provisioning, policy trust, verifier binding, and
admission verdicts remain `UNKNOWN` or `NOT_AUTHORIZED`. The host protocol's
owner, lineage, revision, and digest shape checks do not authenticate the host
or establish authority to install a trust anchor.

System audit v55 independently reconstructs the exact R104-bound 28/24/4
contract and rejects route, capability, source, persistence, host acceptance,
trust-anchor, binding, authority, and truth inflation. Earth engine v67 may
derive a migration-labelled R105 contract only from an exact v66 save retaining
R104; otherwise it records a permanent checkpoint. API v101 exposes the four
R105 schemas, transient builder, validator, and description while preserving
API v100.

R105 closes only creation and structural verification of a host-bound
provisioning proposal. It does not authenticate the host, establish host
authority, obtain acceptance, provision or persist a trust anchor, trust the
policy, bind a verifier key, resolve identity, establish independence,
authenticate an observation, verify provenance or physical meaning, admit
evidence, identify a historical physical source owner, or supply a debit
receipt. R105 remains `EXPERIMENTAL`; Mike Tobi remains the commit, merge,
promotion, and `CANON` gate.

## Rung 106: host provisioning-receipt signature integrity

R106 binds the exact R105 host trust-anchor provisioning proposal contract and
preserves its 28/24/4 route boundary. The 24 eligible routes declare local
support for
`authority.host-trust-anchor.provision.receipt.signature.verify`. The stronger
`authority.host-trust-anchor.provision.receipt.verify` and actual
`authority.host-trust-anchor.provision` capabilities remain unavailable. The
persisted contract contains no host reference, proposal, policy, receipt,
assessment, raw host-authority key, signature, trust anchor, binding, replay
entry, or admission state.

A transient caller may record claimed `PROVISIONED`, `HELD`, or `REJECTED`
receipt content under a caller-supplied Ed25519 host-key hash. The envelope is
bound to exact R106, exact R105 proposal and policy digests, the claimed host
world/lineage/revision/digest reference, the proposal review seat, and a
bounded receipt window wholly inside the proposal window. The claimed host key
must differ from the untrusted policy decision and revocation keys. Raw key and
signature bytes exist only in the transient verifier input.

The verifier checks the detached signature, supplied-key hash, proposal and
receipt windows, host-key separation, source bindings, and nonce separation.
A `PASS` means only that the transient receipt text is intact under that exact
caller-supplied key. Receipt authority, host identity, authority to provision,
acceptance, installation, policy trust, verifier binding, and admission remain
`UNKNOWN`, `UNTRUSTED_CALLER_SUPPLIED`, or `NOT_AUTHORIZED`. Even a signed
`CLAIMED_HOST_TRUST_ANCHOR_PROVISIONED` envelope has fixed actual effects of
false or zero and cannot mutate or persist world state.

System audit v56 independently reconstructs the exact R105-bound 28/24/4
contract and rejects source, route, capability, persistence, authority,
acceptance, installation, trust, binding, admission, and truth inflation.
Earth engine v68 may derive a migration-labelled R106 contract only from an
exact v67 save retaining R105; otherwise it records a permanent checkpoint.
API v102 exposes the five R106 schemas, transient envelope builder, canonical
signing text, verifier, validators, and description while preserving API v101.

R106 closes only detached provisioning-receipt signature integrity under a
caller-supplied unauthenticated host key. It does not verify a governed host
receipt, authenticate the host or signer, establish authority, obtain
acceptance, provision or persist a trust anchor, trust the policy, bind a
verifier key, resolve identity, establish independence, authenticate an
observation, verify provenance or physical meaning, admit evidence, identify a
historical physical source owner, or supply a debit receipt. R106 remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and `CANON`
gate.

## Rung 107: provisioning-receipt signer-key binding request routing

R107 binds the exact R106 provisioning-receipt signature-integrity contract
and preserves its 28/24/4 route boundary. The 24 eligible routes implement
only
`authority.host-trust-anchor.provision.receipt.signer-key.bind.request.create`.
The actual signer-key binding, governed receipt verification, and trust-anchor
provisioning capabilities remain unavailable.

After re-running the exact R106 detached Ed25519 check, a transient R107 packet
creates 24 route-specific requests. Each request binds the claimed signing-key
id and SHA-256 hash to the exact named-world host id, lineage, revision and
digest, proposal id, receipt id, R106 assessment digest, and existing request
binding. A signature-integrity `PASS` is required before requests are emitted.
Raw key and signature bytes are not retained.

The packet contains no host-authority evidence or binding decision. Every
signer-key-binding, receipt-authority, full-receipt, host-identity,
authority-to-provision, acceptance, installation, and admission verdict
remains `UNKNOWN` or `NOT_AUTHORIZED`; actual effects remain false. The packet
and requests are transient and cannot mutate world state.

System audit v57 independently reconstructs the exact R106-bound routes,
capability boundary, zero-material summary, persistence attachment, and truth
boundary. Earth engine v69 may derive a migration-labelled R107 contract only
from an exact v68 save retaining R106; otherwise it records a permanent
checkpoint. API v103 exposes the four R107 schemas, request-packet builder,
validator, and description while preserving API v102.

R107 closes only the request-routing gap. It does not authenticate the named-
world host, bind or trust the claimed receipt-signing key, verify a governed
receipt, accept the proposal, install or persist a trust anchor, trust the
caller-supplied policy, admit evidence, identify a historical physical source
owner, or supply an actual debit receipt. R107 remains `EXPERIMENTAL`; Mike
Tobi remains the commit, merge, promotion, and `CANON` gate.

## Rung 108: provisioning-receipt signer-key binding decision integrity

R108 binds the exact R107 signer-key-binding request contract and preserves
its 28/24/4 route boundary. The 24 eligible routes implement detached Ed25519
signature checks for a binding-decision envelope and a revocation snapshot:

- `authority.host-trust-anchor.provision.receipt.signer-key.binding-decision.signature.verify`
- `authority.host-trust-anchor.provision.receipt.signer-key.binding-decision.revocation.verify`

Actual `authority.host-trust-anchor.provision.receipt.signer-key.bind`,
governed receipt verification, and trust-anchor provisioning remain
unavailable.

A transient caller may provide a bounded policy descriptor containing separate
decision and revocation key hashes, exactly 24 `BIND`, `HOLD`, or `REJECT`
claims covering the R107 requests, and a bounded revocation snapshot. The
policy keys must be distinct from each other and from the claimed receipt-
signing key, preventing the candidate key from certifying its own binding.
Raw keys and signatures exist only in the transient verifier input.

The verifier canonicalizes the decision and revocation artifacts, verifies
both detached signatures, recomputes the supplied key and signature hashes,
checks exact R108/R107/policy bindings, validity windows, key separation, and
revocation by decision digest, decision nonce, or receipt-signer key hash. A
`PASS` means only that these artifacts are intact under the exact caller-
supplied policy keys. The policy remains `UNTRUSTED_CALLER_SUPPLIED`; host
authority evidence authentication, signer-key binding, receipt authority,
full receipt verification, host identity, authority to provision, acceptance,
installation, and admission remain `UNKNOWN` or `NOT_AUTHORIZED`.

Even a valid signed `BIND` claim applies zero bindings. Transient policies,
decisions, revocation snapshots, assessments, raw keys, and signatures are not
persisted, and no world mutation occurs. System audit v58 independently
reconstructs the exact R107-bound contract and rejects route, capability,
persistence, trust, authority, binding, receipt, provisioning, admission, or
truth inflation. Earth engine v70 may derive a migration-labelled R108
contract only from an exact v69 save retaining R107; otherwise it records a
permanent checkpoint. API v104 exposes the eight R108 schemas plus transient
policy, decision, revocation, canonicalization, and verification surfaces
while preserving API v103.

R108 closes only decision-and-revocation signature integrity under an
explicitly untrusted caller policy. It does not authenticate AXM host
governance, bind or trust the claimed receipt-signing key, verify a governed
receipt, accept the proposal, install or persist a trust anchor, admit
evidence, identify a historical physical source owner, or supply an actual
debit receipt. R108 remains `EXPERIMENTAL`; Mike Tobi remains the commit,
merge, promotion, and `CANON` gate.

## Rung 109: host-governance trust-root admission request routing

R109 binds the exact R108 binding-decision integrity contract and preserves
its 28/24/4 route boundary. The 24 eligible routes implement only
`authority.host-governance.trust-root.admission.request.create`. Actual host-
controlled root resolution, policy-key delegation verification, governance
admission decisions, signer-key binding, governed receipt verification, and
trust-anchor provisioning remain unavailable.

The persistent contract declares seven unsatisfied evidence requirements:
host-controlled out-of-band root origin; host identity and scope binding;
decision-key delegation; revocation-key delegation; current non-revoked
delegation state; candidate signer-key separation; and host challenge plus
replay-gated admission. Candidate packets and candidate keys are explicitly
forbidden from supplying or self-asserting the trust root.

A transient builder accepts exact R109/R108/R107 sources and an R108
assessment that structurally reports integrity `PASS`. It routes only exact
unapplied `BIND` entries, excluding `HOLD` and `REJECT`. The request binds the
claimed host and policy-key hashes to a distinct, unconsumed challenge and a
maximum 15-minute window ending inside every R108 validity window. It reports
the source assessment as `REPORTED_PASS_UNTRUSTED`; R109 does not claim to
reverify R108 cryptography.

The request carries no root key or root hash. Every root-resolution,
delegation, host-identity, binding, receipt-verification, and provisioning
verdict remains `UNKNOWN`, and admission remains `NOT_AUTHORIZED`. No request,
governance evidence, trust root, delegation, decision, binding, raw key,
signature, or world mutation is persisted.

System audit v58 additionally reconstructs the exact R108-bound routes and
seven requirements and rejects circular self-trust or capability, evidence,
admission, and effect inflation. Earth engine v71 may derive a migration-
labelled R109 contract only from an exact v70 save retaining R108; otherwise
it records a permanent checkpoint. The v69 R108 migration and v68 R107
compatibility paths remain covered. API v105 exposes the five R109 schemas,
transient request builder, validator, and description while preserving API
v104.

R109 closes only non-circular host-governance request routing. It does not
resolve or authenticate AXM host governance, bind or trust the claimed
receipt-signing key, verify a governed receipt, accept the proposal, install
or persist a trust anchor, admit evidence, identify a historical physical
source owner, or supply an actual debit receipt. R109 remains `EXPERIMENTAL`;
Mike Tobi remains the commit, merge, promotion, and `CANON` gate.

## Rung 142: closure-evidence acquisition request handoff

R142 exact-binds the transient R141 contract, recursion witness, closure
preflight, and inherited boundary. It adds only
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route.trust-bootstrap.closure-evidence-acquisition.request.create`.
The current real R141 compatible-route and blocked-closure inventory is empty,
so the current R142 batch is empty, its request context is null, and invented
request metadata is rejected.

For one synthetic exact R141 blocked closure, R142 produces one bounded,
non-transmitted handoff packet. It carries the same four missing operational
capabilities: out-of-band designation decision, verifier-route trust-anchor
resolution, endpoint resolution, and matched send/receive transport. It also
copies the eight R141 native external evidence obligations and marks every
capability unavailable and unsatisfied and every evidence item unacquired,
unverified, and unadmitted.

The packet may name Mike Tobi or an authenticated host-governance seat only as
eligible handoff coordinators. That label is not authentication, acceptance,
authority, provider-control exclusion, endpoint resolution, consent, contact,
transport, or an acquisition receipt. R142 creates no provider, route,
authority, endpoint, locator, transport channel, scientific provenance, or
fictional receipt, and it cannot create another verification route or continue
the recursive chain automatically.

R142 allows at most one request packet, four capability requirements, eight
evidence requirements, a 300,000 ms request window, and 524,288 serialized
batch bytes. Producer validation and an independent exact-reconstruction audit
that calls no R142 builder or validator reject R141 boundary substitution,
invented empty-custody metadata, out-of-window or extra metadata, and re-signed
authentication, acceptance, evidence, capability, authority, contact,
transport, persistence, promotion, `CANON`, and mutation overclaims.

R142 adds no Earth state, system-audit field, or migration. Earth engine v75
and system audit v62 remain unchanged. API v138 exposes four transient R142
schemas while preserving v137. Manifest v0.142.0 uses Earth-system descriptor
V105. R142 remains `EXPERIMENTAL`; Mike Tobi remains the provider-selection,
authority, commit, merge, installation, execution, promotion, and `CANON` gate.

## Rung 140: decision-hand verification recipient-route preflight

R140 exact-binds the transient R139 contract, request batch, nested custody,
and request options. The current real R139 batch has no packet, so its current
recipient-route preflight is empty. Supplying a route declaration against that
empty batch is rejected rather than treated as a new request or recipient.

For one synthetic exact R139 packet, R140 can structurally assess at most two
caller-supplied route declarations. A compatible declaration must bind the
exact request and decision-hand candidate, keep the claimed secondary verifier
untrusted, and name three distinct untrusted roles: an endpoint resolver, a
trust-anchor authority, and a receipted send/receive transport whose declared
prerequisites bind the first two roles. The decision-hand candidate cannot fill
any route role. Candidate dependency, self-dependency, role collision, unsafe
locator, request or custody substitution, lifecycle or permission overclaim,
and multiple compatible declarations remain blocked.

Structural compatibility does not select or verify a route. Endpoint and
recipient resolution, recipient authentication, trust-anchor authority,
contact authorization, authority decision, route designation, transport,
sender and receiver receipts, provider verification, evidence admission,
historical owner/debit closure, persistence, promotion, and `CANON` all remain
false or absent. The preflight performs no network or host mutation.

R140 allows at most two declarations, two declarations per request, twelve
declared dependencies, 131,072 serialized bytes per declaration, and 524,288
serialized preflight bytes. Producer validation and a separate reconstruction
audit reject re-signed operational claims without calling an R140 builder or
validator from the audit.

R140 adds only
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route-resolution.preflight.evaluate`.
Earth engine v75 and system audit v62 remain unchanged. API v136 exposes four
transient R140 schemas while preserving v135. Manifest v0.140.0 uses Earth-
system descriptor V103. R140 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, route and provider selection, commit, merge, installation,
execution, promotion, and `CANON` gate.

## Rung 141: decision-hand verification-route trust-bootstrap recursion preflight

R141 exact-binds the transient R140 contract, preflight, declarations, and
nested R139 custody. The current real R140 compatible-route inventory is empty,
so its current recursion witness and closure preflight are empty and produce no
operational effect.

For one synthetic exact R140 compatible-but-unverified route, R141 records a
seven-stage dependency-class recurrence. Independently verifying the three
caller-supplied route roles would itself require verification requests whose
recipient routes need the same endpoint-resolution, trust-anchor-resolution,
and receipted send/receive capability classes. The unverified decision hand
cannot authenticate itself or decide and designate its own verification route.
This is deterministic dependency-class analysis, not a claim of a literal
artifact-graph cycle or proof that every external implementation is recursive.

R141 blocks automatic request or route chaining. Its recurring dependency is
the three route capabilities; the outcome remains blocked on the same four
operational capabilities as R140: the exact out-of-band designation decision,
trust-anchor resolution, endpoint resolution, and receipted send/receive. Eight
native evidence obligations cover independent decision-hand verification,
route authority designation, exact binding, route-provider identity and
authority, implementation and availability, non-circular dependencies,
endpoint and recipient proof, consent, and matched transport receipts.

No decision hand or route provider is selected, trusted, installed, available,
or executed. No endpoint or recipient is resolved or authenticated; no
authority decision, route designation, contact, transport, receipt, provider
verification, evidence admission, historical owner/debit closure, persistence,
promotion, `CANON`, or world mutation occurs.

R141 allows at most one route, three provider roles, seven stages, eight
evidence requirements, and 524,288 serialized bytes each for its witness and
closure preflight. Producer validation and a separate reconstruction audit
reject exact-boundary substitution and re-signed closure, verification,
authority, designation, transport, persistence, or mutation overclaims without
calling an R141 builder or validator from the audit.

R141 adds only
`analysis.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route.trust-bootstrap.recursion.detect`.
Earth engine v75 and system audit v62 remain unchanged. API v137 exposes three
transient R141 schemas while preserving v136. Manifest v0.141.0 uses Earth-
system descriptor V104. R141 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, route and provider selection, commit, merge, installation,
execution, promotion, and `CANON` gate.

## Rung 119: anti-recursion trust-bootstrap closure preflight

R119 binds the exact R110-through-R118 contract custody chain and adds only
`analysis.host-governance.trust-bootstrap.recursion.detect`. Its transient
witness identifies the five-stage R114-through-R118 dependency recurrence:
an untrusted caller-policy binding decision requires policy-delegation
verification, whose untrusted signed response needs signer-key binding, whose
binding decision again depends on an untrusted caller policy and the same
unverified delegation capability. This is a recursive authority dependency,
not a claim that the retained artifact graph contains a literal cycle.

The closure preflight is deliberately `BLOCKED`. It names six still-external
host capabilities: registry configuration, trust-root resolution, registry-
response signer-key binding, policy-key delegation verification, delegation-
response signer-key binding, and admission decision. For each it declares the
independently authenticated host receipt needed to close the boundary. Another
caller-policy decision, a signature-integrity pass, or a locally created
request cannot satisfy those requirements or authorize itself.

Producer validation and an independent reconstruction audit bind all nine
source schemas and digests, the 28/24/4 route projection, all five recursion
stages, all six missing capabilities, and the blocked truth boundary. Coverage
rejects re-digested source substitution, missing custody or recursion stages,
fictional `READY` authority, capability substitution, and injected endpoint,
transport, or binding effects. The artifacts are transient and apply no
endpoint discovery, transport, signer binding, admission, persistence, owner
resolution, debit, or world mutation.

Earth engine v75 and system audit v62 remain unchanged. Manifest v0.119.0 uses
Earth-system descriptor V82, and API v115 exposes the three R119 analytical
schemas while preserving v114. R119 remains `EXPERIMENTAL`; Mike Tobi remains
the commit, merge, promotion, and `CANON` gate.

## Rung 120: historical owner/debit admission-readiness preflight

R120 joins the exact persistent R100 artifact-integrity contract to the exact
transient R119 anti-recursion contract, witness, preflight, and R110-through-R118
source chain. It adds only
`analysis.foundation-planet.matrix-thermal.historical-source-owner-debit.admission.readiness.evaluate`.
The transient matrix projects all 28 unresolved historical-source routes: 24
evidence-artifact routes with byte-integrity checking available and four
Mike-Tobi-or-AXM physical-meaning review routes. Every route remains blocked;
zero artifact-integrity receipts, authenticated observations, provenance
verdicts, meaning decisions, resolved owners, verified debits, or admission
decisions are claimed.

The closure report groups the 28 routes behind the exact nine R98
historical-source capability IDs and retains the exact six host-authority gaps
reported by R119. It states the proof surface needed for persistence, static
structure, transport, and taste-or-meaning claims. SHA-256 equality remains
byte integrity only. Candidate self-attestation, locally created requests, and
recursive caller policy remain forbidden substitutes for independently
authenticated evidence or host authority.

R120 adds no Earth field, migration, endpoint discovery, transport,
persistence, owner or debit mutation, admission, promotion, or canonization.
Earth engine v75 and system audit v62 remain unchanged. Manifest v0.120.0 uses
Earth-system descriptor V83, and API v116 exposes the three transient R120
analytical schemas while preserving v115. R120 remains `EXPERIMENTAL`; Mike
Tobi remains the commit, merge, promotion, and `CANON` gate.

## Rung 121: external capability specification bundle

R121 converts the exact R120 blocked readiness bundle into fifteen buildable,
fail-closed provider specifications. Eight cover independently sourced
historical evidence, one reserves physical-meaning judgment for Mike Tobi or an
AXM review seat, and six cover host-governance authority. Together the first
nine specifications cover all 28 historical-source routes.

Each specification declares exact R120 inputs and route-binding digests, a
neutral result-envelope schema, required native proof surfaces, expected
artifact kinds, side-effect limits, permissions and consent, bounded-resource
requirements, failure recovery, compatibility, independent verification, and
Mike's promotion gate. Native provider receipt schemas remain intentionally
undeclared until an external provider supplies them. Every specification stays
`SPEC_REQUIRED`, with `providerInstalled`, `providerAvailable`, `promoted`, and
`canon` all false.

The new capability is
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.specification.create`.
It creates contracts, not providers. A specification or result envelope cannot
authenticate evidence, grant authority, resolve an owner, prove a debit, or
authorize admission.

R121 adds no Earth field, migration, endpoint, transport, provider execution,
persistence, owner/debit mutation, admission, promotion, or canonization. Earth
engine v75 and system audit v62 remain unchanged. Manifest v0.121.0 uses
Earth-system descriptor V84, and API v117 exposes four transient R121 schemas
while preserving v116. R121 remains `EXPERIMENTAL`; Mike Tobi remains the
commit, merge, promotion, and `CANON` gate.

## Rung 122: external capability provider-binding preflight

R122 adds the contract capability
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-binding.preflight`.
It binds bounded caller-supplied provider declarations to the exact R121
contract, specification bundle, capability identifier, specification ordinal,
and specification digest. The current built-in inventory is deliberately
empty, so the current preflight reports all fifteen provider bindings missing.
Contract creation verifies the full R121 source custody once; declaration
assessment then follows the digest-bound R121 receipts without replaying the
entire R100-R121 ancestry for every candidate.

A caller declaration must name its provider class, version, entrypoint kind,
native receipt schema, permission seat, bounded resources, failure behavior,
independent-verification plan, and exact result-envelope compatibility.
Malformed, substituted, over-budget, permission-weakening, self-authorizing,
self-promoting, installed, or available claims are rejected. Duplicate
otherwise-compatible declarations are reported as ambiguous.

Passing that structural check yields `CONTRACT_COMPATIBLE_UNVERIFIED`, never
`READY`. Provider identity, installation, availability, the declared native
schema, authorization or consent, and any later evidence remain independently
unverified. The preflight does not discover providers, resolve endpoints,
transmit requests, execute hands, authenticate evidence, establish host
authority, resolve historical physical source owners, prove debits, or
authorize admission.

R122 adds no Earth field, migration, persistence, or world mutation. Earth
engine v75 and system audit v62 remain unchanged. Manifest v0.122.0 uses
Earth-system descriptor V85, and API v118 exposes four transient R122 schemas
while preserving v117. R122 remains `EXPERIMENTAL`; Mike Tobi remains the
commit, merge, promotion, and `CANON` gate.

## Rung 123: provider-verification request handoff

R123 adds
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.request.create`.
It accepts only exact R122 `CONTRACT_COMPATIBLE_UNVERIFIED` bindings and
creates bounded request packets for the four blockers that R122 preserves:
independent provider identity, matched live-availability sender and receiver
receipts, native receipt-schema validation, and exact authorization or
consent.

The real built-in declaration inventory remains empty, so the current R123
batch contains zero packets. In focused synthetic coverage, fifteen exact
eligible bindings create fifteen request packets, each bound to the R122
preflight, binding digest, declaration digest, claimed provider metadata,
request window, requester, resource ceilings, and the four native proof
routes.

Every recipient remains `UNRESOLVED`, every endpoint is null, and every
packet remains `CREATED_NOT_TRANSMITTED_RECIPIENT_UNRESOLVED`. Sender and
receiver receipts are null. A request cannot prove identity, availability,
schema validity, authority, consent, evidence, ownership, debit, or admission.
Missing, rejected, and ambiguous R122 bindings create no request.

R123 adds no Earth field, migration, endpoint, transport, execution,
persistence, or world mutation. Earth engine v75 and system audit v62 remain
unchanged. Manifest v0.123.0 uses Earth-system descriptor V86, and API v119
exposes four transient R123 schemas while preserving v118. R123 remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and
`CANON` gate.

## Rung 124: provider-verification endpoint-resolution preflight

R124 adds
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.preflight.evaluate`.
It binds caller-supplied endpoint declarations to the exact R123 contract,
request batch, request packet digest, capability, provider ID, provider class,
and bounded request window.

Endpoint declarations use the entrypoint kind already implied by the R122
provider class: a human-review route, host-governance route, or canonical
credential-free HTTPS URI. They must retain untrusted locator and recipient
identity status, declare an independent endpoint-ownership and recipient-
identity verification plan, and grant no permission to contact an endpoint,
human, or host.

A structurally exact declaration is labelled
`ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED`, never `RESOLVED` or `READY`.
Missing, rejected, and duplicate compatible declarations remain respectively
missing, rejected, or ambiguous. The current real R123 batch contains zero
request packets, so the current endpoint preflight is empty. Synthetic
coverage may exercise all fifteen request routes without contacting any
declared locator.

R124 does not implement
`transport.foundation-planet.external-provider-verification.endpoint.resolve`
or the next transport capability
`transport.foundation-planet.external-provider-verification.request.send-receive`.
It performs no DNS or discovery, recipient authentication, contact,
transport, provider verification, persistence, evidence admission,
owner/debit mutation, or world mutation. Earth engine v75 and system audit
v62 remain unchanged. Manifest v0.124.0 uses Earth-system descriptor V87,
and API v120 exposes four transient R124 schemas while preserving v119.
R124 remains `EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion,
and `CANON` gate.

## Rung 125: endpoint-resolution verification-request handoff

R125 adds
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.verification-request.create`.
It converts only exact R124 rows labelled
`ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED` into bounded, inert requests for
five independent proof surfaces: resolver identity and authority, endpoint
ownership or route custody, recipient identity, contact authorization or
consent, and a bounded live challenge with matched sender and receiver
receipts.

The request recipient remains unresolved and challenge material remains
unissued. No request grants authority or consent. No endpoint, human, or host
is contacted, and no transport or receiver receipt is claimed. Missing,
rejected, and ambiguous R124 rows remain counted but cannot create packets.
The current real R124 preflight contains zero endpoint rows, so the current
R125 request batch is empty. Synthetic coverage may create fifteen inert
packets carrying seventy-five proof requirements without resolving or
contacting any declared locator.

R125 still does not implement
`transport.foundation-planet.external-provider-verification.endpoint.resolve`
or
`transport.foundation-planet.external-provider-verification.request.send-receive`.
It performs no provider verification, evidence admission, persistence,
historical-owner or debit resolution, promotion, canonization, or world
mutation. Earth engine v75 and system audit v62 remain unchanged. Manifest
v0.125.0 uses Earth-system descriptor V88, and API v121 exposes four
transient R125 schemas while preserving v120. R125 remains `EXPERIMENTAL`;
Mike Tobi remains the commit, merge, promotion, and `CANON` gate.

## Rung 126: endpoint-resolver capability specification

R126 adds
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-specification.create`.
It supplies the full missing-hand contract for
`transport.foundation-planet.external-provider-verification.endpoint.resolve`:
exact R125 inputs, a versioned result-envelope boundary, side effects,
permissions and consent, resource ceilings, failure recovery, compatibility,
independent verification, and Mike Tobi's promotion gate.

The specification binds every exact R125 request to an inert resolver input.
It requires four independent pre-transport proofs: resolver identity and
authority, endpoint ownership or route custody, recipient identity, and the
exact required-seat contact authorization or consent receipt. The fifth R125
proof—a bounded live challenge with matched sender and receiver receipts—
remains deferred to the still-missing send/receive transport capability.

The current real R125 batch is empty, so the current R126 input-binding array
is empty while the single resolver capability specification remains available.
Synthetic coverage may bind all fifteen R125 request packets without
installing or executing a resolver.

R126 does not declare a native resolver receipt schema, install or make a
resolver available, resolve an endpoint or recipient, authenticate authority,
authorize or perform contact, issue challenge material, transport a request,
verify a provider, admit evidence, persist, resolve historical owners or
debits, promote, canonize, or mutate the world. Earth engine v75 and system
audit v62 remain unchanged. Manifest v0.126.0 uses Earth-system descriptor
V89, and API v122 exposes five transient R126 schemas while preserving v121.
R126 remains `EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion,
installation, execution-authority, and `CANON` gate.

## Rung 127: endpoint-resolver provider-binding preflight

R127 adds
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider-binding.preflight`.
It binds the exact R126 contract and its one endpoint-resolver specification to
at most two bounded caller-supplied provider declarations treated only as
untrusted data.

The current built-in declaration inventory is empty, so the real R127 report
contains one missing resolver-provider binding. A synthetically compatible
declaration can establish only contract compatibility. It remains
`CONTRACT_COMPATIBLE_UNVERIFIED` and operationally `BLOCKED` pending
independent resolver identity and authority, implementation-integrity, live
availability, native-receipt-schema, allowed/denied identity-probe, exact
request/binding replay, and per-request authority/consent receipts. Multiple
compatible declarations are ambiguous and require an explicit single-provider
selection.

R127 does not discover, install, make available, or execute a resolver;
resolve an endpoint or recipient; authenticate authority; authorize or perform
contact; issue challenge material; transport a request; verify a provider;
admit evidence; persist; resolve historical owners or debits; promote,
canonize, or mutate the world. Earth engine v75 and system audit v62 remain
unchanged. Manifest v0.127.0 uses Earth-system descriptor V90, and API v123
exposes four transient R127 schemas while preserving v122. R127 remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, provider-selection,
installation, execution, promotion, and `CANON` gate.

## Rung 128: endpoint-resolver provider-verification request handoff

R128 adds
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider.verification.request.create`.
It binds the exact R127 contract, preflight, declarations, and sealed R126
source boundary. Only one R127 `CONTRACT_COMPATIBLE_UNVERIFIED` binding may
produce a transient request; missing, rejected, or ambiguous bindings produce
an empty request batch.

The current built-in resolver-provider declaration inventory is empty, so the
real R128 batch contains zero packets. A synthetic compatible declaration
produces one untransmitted packet with six independent proof requirements:
resolver identity and authority, implementation integrity, live availability,
native-receipt-schema validation, allowed and denied identity probes, and
exact R126 request-and-binding digest replay. The packet keeps its independent
verification recipient and endpoint unresolved.

Per-request authority and consent are not provider-identity evidence. R128
retains them as a separate prerequisite before every later resolver execution;
neither a provider declaration nor this verification request may satisfy them.
The request is not proof, provider selection, installation, availability,
execution, endpoint resolution, contact, transport, receiver receipt,
historical owner/debit closure, admission, persistence, promotion, canon, or
world mutation. Earth engine v75 and system audit v62 remain unchanged.
Manifest v0.128.0 uses Earth-system descriptor V91, and API v124 exposes four
transient R128 schemas while preserving v123. R128 remains `EXPERIMENTAL`;
Mike Tobi remains the provider-selection, commit, merge, installation,
execution, promotion, and `CANON` gate.

## Rung 129: fail-closed resolver-provider verification-recipient preflight

R129 binds the exact transient R128 contract, request batch, options, R127
custody, and sealed R126 boundary, then evaluates at most two caller-supplied
verification-recipient endpoint declarations. The current real R128 request
batch is empty, so the current R129 preflight is also empty.

For a synthetic eligible R128 request, one structurally compatible declaration
must bind the exact request packet, candidate resolver-provider declaration,
and R128 claimed independent verifier. It may name only a distinct alternate
provider for the same endpoint-resolution capability. Direct use of the
unverified candidate to resolve its own verifier is rejected, as is a declared
alternate route that depends on either the candidate or itself. Multiple
compatible declarations remain ambiguous; none is selected.

A distinct identifier and an omitted dependency are still only caller-supplied
claims. Alternate-resolver independence, implementation and availability,
endpoint ownership, verifier identity, contact authority, transport, and
resolver-provider verification all remain blocked and unverified. R129
performs no DNS or discovery, network or human contact, provider selection,
installation, execution, persistence, evidence admission, owner/debit change,
promotion, canonization, or world mutation. It remains `EXPERIMENTAL`; Mike
Tobi remains the commit, merge, provider-selection, promotion, and `CANON`
gate.

## Rung 130: verification-recipient trust-bootstrap recursion preflight

R130 binds the exact transient R129 contract, witness, and closure preflight.
The current real R129 compatible-route inventory is empty, so the current R130
recursion witness and closure preflight are empty too. No missing route is
fictionally filled.

For a synthetic compatible R129 route, R130 reconstructs one bounded five-stage
dependency-class witness. Stages one through four show the same unverified
resolver-provider requirement recurring whenever another unverified resolver is
introduced to ground the preceding verifier route. Stage five names the missing
out-of-band authority trust-anchor capability; it does not provide that
capability. This witnesses a trust-bootstrap recursion pattern, not a literal
artifact-graph cycle and not a claim that every possible resolver is recursive.

Automatic resolver chaining is prohibited. Closure requires independently
receipted Mike/host-governance authority for the exact trust anchor, identity and
revocation provenance, allowed and denied identity probes, endpoint ownership,
verifier identity, contact authority, and matched request/response transport
receipts. The bounded projection accepts at most one route, five stages, six
evidence requirements, and 262,144 serialized bytes.

R130 adds only the transient analysis capability
`analysis.foundation-planet.external-provider-verification.verification-recipient.trust-bootstrap.recursion.detect`.
It does not add the missing authority capability
`authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve`
or the missing transport capability
`transport.foundation-planet.external-provider-verification.request.send-receive`.
It performs no discovery, selection, resolution, network or human contact,
installation, execution, transport, evidence admission, persistence,
owner/debit change, promotion, canonization, or world mutation.

Earth engine v75 and system audit v62 remain unchanged. API v126 exposes three
transient R130 schemas while preserving v125. Manifest v0.130.0 uses
Earth-system descriptor V93. R130 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 131: trust-anchor authority and receipted-transport specifications

R131 binds the exact transient R130 contract, recursion witness, closure
preflight, and full R130 custody. It emits two provider-neutral missing-hand
specifications: one for
`authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve`
and one for
`transport.foundation-planet.external-provider-verification.request.send-receive`.
The only implemented capability is the specification builder
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport-specification.create`.

The current real R130 route inventory is empty, so both specifications are
available with zero current input bindings. A synthetic compatible R130 route
produces exactly two bindings: the authority binding covers the five trust-
anchor evidence requirements, and the transport binding covers the exact
per-request authority plus matched sender/receiver receipt requirement. R129
self-resolution, circular dependency, and ambiguity exclusions remain empty
and cannot become R131 inputs.

Both specifications declare exact inputs and result envelopes, side-effect and
permission boundaries, resource ceilings, fail-closed recovery, compatibility,
verification, and Mike Tobi promotion gates. Native authority, sender, and
receiver receipt schemas remain deliberately undeclared until a provider
declaration is independently reviewed. The transport specification requires an
authority result before contact, permits one send attempt per exact authority
receipt, prohibits automatic retry, requires matched transaction, request,
payload, recipient, and sender/receiver authority receipts, and does not treat
delivery as proof that the receiver applied or accepted the request.

R131 specifies the two missing capabilities; it does not supply them. No
provider is selected, installed, available, or executed. No trust anchor,
endpoint, recipient, contact authority, transport, provider verification,
evidence admission, historical physical source owner or debit, persistence,
promotion, canonization, or world mutation is produced.

Earth engine v75 and system audit v62 remain unchanged. API v127 exposes five
transient R131 schemas while preserving v126. Manifest v0.131.0 uses
Earth-system descriptor V94. R131 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 132: fail-closed authority and transport provider binding

R132 binds the exact transient R131 contract, two-specification bundle, and
full custody, then evaluates at most four caller-supplied provider declarations:
at most two for trust-anchor authority and two for receipted send/receive
transport. The current real declaration inventory is empty, so both current
assessments are missing and the current preflight is blocked.

A structurally compatible declaration must bind the exact R131 specification,
contract, bundle, input-binding schema, and result-envelope schema. It must
declare provider identity and class, capability-specific native receipt schema
roles, non-mutating execution boundaries, exact permission and consent rules,
budgets, fail-closed recovery, an independent verifier, and an entirely false
operational lifecycle. Native receipt schemas remain caller-supplied and
unverified.

For a synthetic compatible R130 route, one authority and one transport
declaration become two compatible-unverified candidates. The transport
declaration must name the sole compatible authority-provider candidate as its
prerequisite. This is structural composition only: neither candidate is
selected, trusted, installed, available, executed, or authorized.

R132 rejects schema reuse, generic R131 schema impersonation, specification or
capability drift, resolver-controlled authority, weakened consent or permission
boundaries, altered budgets or recovery, self-verification, lifecycle
overclaims, and unresolved transport prerequisites. Multiple compatible
declarations for one capability remain ambiguous; none is selected, and a
transport declaration cannot resolve that ambiguity.

R132 adds only
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider-binding.preflight.evaluate`.
It performs no provider selection, installation, availability check, execution,
trust-anchor resolution, endpoint or recipient authentication, contact,
transport, provider verification, evidence admission, historical owner/debit
closure, persistence, promotion, canonization, or world mutation.

Earth engine v75 and system audit v62 remain unchanged. API v128 exposes four
transient R132 schemas while preserving v127. Manifest v0.132.0 uses
Earth-system descriptor V95. R132 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 133: verifier-route provider verification request handoff

R133 exact-binds the transient R132 contract, provider-binding preflight, full
R132 boundary, and caller-supplied declarations. Only R132 candidates whose
complete lifecycle remains false and whose trust is exactly
`CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED` are request-eligible. The current real
R132 inventory contains no declarations or candidates, so the current R133
batch is empty and accepts no invented request metadata.

A synthetic exact-compatible authority and transport pair produces two
untransmitted request packets with six blocking proof requirements each. Both
request independent identity, authority and revocation, implementation
integrity, bounded live availability with matched receipts, and exact R131
specification/binding/declaration replay. The authority packet additionally
requires independent validation of its native authority receipt schema plus
matched allowed and denied identity probes. The transport packet instead
requires independent validation of both native sender/receiver schemas and a
held-out matched-receipt test that rejects single-sided, mismatched, replayed,
or receiver-application overclaims.

Each declaration's claimed secondary verifier remains caller-supplied and
untrusted. Its recipient identity and endpoint remain unresolved, and the
request explicitly names the still-required endpoint-resolver, trust-anchor
authority, and receipted send/receive capabilities. A candidate may not satisfy
its own verification route. No packet is transmitted and no sender or receiver
receipt is invented.

R133 allows at most two packets, six proof requirements per packet, a five
minute request window, and 524,288 serialized batch bytes. Producer validation
and an independent reconstruction audit reject R132 custody substitution,
unbounded request windows, ambiguity laundering, and re-signed claims of
recipient trust, delivery, verification, selection, installation, availability,
execution, authority, owner/debit closure, evidence admission, persistence,
promotion, or `CANON`.

R133 adds only
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider.verification.request.create`.
It verifies or selects no provider, native schema, authority, endpoint,
recipient, availability, or transport and performs no external contact,
evidence admission, historical owner/debit closure, persistence, promotion,
canonization, or world mutation.

Earth engine v75 and system audit v62 remain unchanged. API v129 exposes four
transient R133 schemas while preserving v128. Manifest v0.133.0 uses
Earth-system descriptor V96. R133 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 134: verifier-route provider-verification recipient-route preflight

R134 exact-binds the transient R133 contract, request batch, full R133 custody,
and request options. The current real R133 batch contains no packets, so the
current R134 preflight is empty and invents no route declaration, provider,
endpoint, recipient, authority, contact, transport, or receipt.

For a synthetic exact-compatible two-request R133 batch, R134 evaluates bounded
caller-supplied route declarations. Each compatible declaration must name three
distinct untrusted roles: an endpoint resolver, an independent trust-anchor
authority, and a receipted send/receive transport whose prerequisites bind the
other two providers. The candidate under verification may fill none of those
roles. Compatible structure remains `CALLER_SUPPLIED_UNVERIFIED`; every route
stays `BLOCKED` pending independent provider identity and authority,
implementation and availability, acyclic-dependency, endpoint-ownership,
recipient-identity, contact-authorization, and matched sender/receiver-receipt
proof.

R134 rejects direct candidate self-routing, provider-role collisions,
candidate or circular dependencies, unsafe locators, request or candidate
substitution, invalid windows, ambiguity, permission drift, lifecycle
overclaims, and resource-ceiling violations. It allows at most four declarations,
two per request, twelve declared dependencies, 131,072 serialized bytes per
declaration, and 524,288 serialized preflight bytes. Producer validation and a
separate exact reconstruction audit call no R134 builder or validator.

R134 adds only
`contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider.verification.recipient-route-resolution.preflight.evaluate`.
It performs no endpoint resolution, recipient authentication, authority
establishment, contact, transport, provider verification, evidence admission,
historical owner/debit closure, persistence, promotion, canonization, or world
mutation.

Earth engine v75 and system audit v62 remain unchanged. API v130 exposes four
transient R134 schemas while preserving v129. Manifest v0.134.0 uses
Earth-system descriptor V97. R134 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 135: verifier-route provider trust-bootstrap recursion guard

R135 exact-binds the transient R134 contract, preflight, declarations, and full
R134 custody. The current real R134 route inventory is empty, so the current
recursion witness and closure preflight are empty and invent no provider,
authority, endpoint, recipient, transport, receipt, or evidence.

For two synthetic exact-compatible R134 routes, R135 witnesses two six-stage
dependency-class recurrences across six unverified route-provider role claims.
The endpoint resolver, trust-anchor authority, and receipted transport must each
be independently verified before use. Creating verification requests for those
providers would itself require independently resolved recipient routes; merely
declaring another unverified three-provider route would re-enter the same
dependency class. R135 therefore prohibits automatic chaining. This is not a
claim of a literal artifact-graph cycle or that every external provider
implementation is recursive.

Each blocked route exposes seven native evidence obligations: out-of-band route
authority designation; exact request/recipient/locator/declaration binding;
identity, authority, expiry, and revocation for all three providers;
implementation integrity and bounded live availability; an independent
non-circular dependency proof; endpoint ownership, recipient identity, and
allowed/denied probes; and exact contact authority plus matched native sender
and receiver receipts. The synthetic case therefore has fourteen obligations,
all unresolved.

R135 adds only
`analysis.foundation-planet.external-provider-verification.verifier-route.provider.trust-bootstrap.recursion.detect`.
It performs no provider verification or selection, endpoint resolution,
recipient authentication, authority establishment, contact, transport,
evidence admission, historical owner/debit closure, persistence, promotion,
canonization, or world mutation. Producer validation and a separate exact
reconstruction audit reject R134 substitution and re-signed operational
overclaims.

R135 allows at most two routes, three provider roles and six stages per route,
seven evidence requirements per route, 524,288 serialized witness bytes, and
524,288 serialized closure-preflight bytes. Earth engine v75 and system audit
v62 remain unchanged. API v131 exposes three transient R135 schemas while
preserving v130. Manifest v0.135.0 uses Earth-system descriptor V98. R135
remains `EXPERIMENTAL`; Mike Tobi remains the authority, provider-selection,
commit, merge, installation, execution, promotion, and `CANON` gate.

## Rung 136: out-of-band verifier-route authority-designation request handoff

R136 exact-binds the transient R135 contract, witness, closure preflight, and
full R135 boundary. The current real R135 blocked-closure inventory is empty,
so the current designation-request batch is empty, accepts only an empty options
object, and invents no request identity, requester, time, provider, endpoint,
authority decision, receipt, or evidence.

For the two-route synthetic R135 case, R136 creates two bounded, untransmitted
proposal-only request packets for the existing `axm-host-authority-review-seat`.
The packets label Mike Tobi or an authenticated host-governance seat as eligible
decision makers, but those labels do not authenticate a person or seat, grant
authority, or make a designation. Each packet preserves its exact R135 route,
candidate, recipient, locator, three route-provider claims, recurring capability
set, closure digest, and seven still-unadmitted evidence obligations.

Each proposal carries five unsatisfied decision criteria: exact R135/R134 route
binding; independent authority-seat identity, scope, and denial probes;
candidate and route-provider non-control; preservation of every separate
provider-verification and operational block; and bounded expiry, revocation,
and fail-closed denial behavior. The request window may not exceed five minutes.
No request is contacted or transmitted, and sender/receiver receipts remain
null.

R136 adds only
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.request.create`.
The required decision capability
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide`
remains absent. R136 does not authenticate an authority seat, designate or
authorize a route, verify route providers or dependency acyclicity, resolve an
endpoint, authenticate a recipient, authorize contact, perform transport,
observe a receipt, verify the original provider, admit evidence, resolve or
debit historical physical source owners, persist, promote, canonize, or mutate
the world. Producer validation and a separate exact reconstruction audit reject
R135 substitution, overlong windows, and re-signed operational overclaims.

R136 allows at most two packets, five decision criteria and seven evidence
requirements per packet, a 300,000 ms request window, and 524,288 serialized
batch bytes. Earth engine v75 and system audit v62 remain unchanged. API v132
exposes four transient R136 schemas while preserving v131. Manifest v0.136.0
uses Earth-system descriptor V99. R136 remains `EXPERIMENTAL`; Mike Tobi remains
the authority, provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 138: out-of-band decision-hand provider-binding preflight

R138 exact-binds the R137 contract, specification bundle, and full R137
boundary. It adds only
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-binding.preflight.evaluate`.
The preflight accepts at most two bounded caller-supplied declarations for the
still-missing
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide`
capability and evaluates structural compatibility without discovering,
selecting, trusting, installing, exposing, or executing a decision hand.

The current real declaration inventory is empty. The current R138 result is
therefore one missing-declaration assessment, zero candidates, and
`OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_BLOCKED_WITH_NO_DECLARATIONS`.
A synthetic exact-compatible declaration remains
`CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED`. Its native authority-decision receipt
schema is caller-declared and untrusted; its independent identity, authority,
non-control, implementation-integrity, and live-availability receipts all
remain null. Two compatible declarations remain ambiguous and none is
selected.

R138 requires exact R137 specification and input-binding custody, a distinct
provider identifier from every current candidate and route-provider identifier,
the R137 permission, budget, recovery, and fail-closed contracts, and plans for
native receipt validation, allowed and denied identity probes, authority-seat
scope, signature/key/expiry/revocation verification, non-control proof, and
criteria/evidence replay. Structural identifier separation and a caller
declaration do not prove beneficial ownership or independence.

R138 rejects R137 substitution, reused or generic native schemas, duplicate or
invalid providers, weakened permission/control/budget/recovery/verification
contracts, lifecycle drift, ambiguity-as-selection, and re-signed authority,
decision, designation, execution, transport, receipt, owner/debit, persistence,
promotion, canon, and mutation overclaims. It permits at most two declarations,
one native schema per declaration, 131,072 serialized bytes per declaration,
and 524,288 serialized preflight bytes. Producer validation and a separate
exact reconstruction audit use no R138 builder or validator from the audit.

Earth engine v75 and system audit v62 remain unchanged. API v134 exposes four
transient R138 schemas while preserving v133. Manifest v0.138.0 uses
Earth-system descriptor V101. R138 remains `EXPERIMENTAL`; Mike Tobi remains
the declaration-acceptance, authority, provider-selection, commit, merge,
installation, execution, promotion, and `CANON` gate.

## Rung 139: decision-hand provider verification request handoff

R139 exact-binds the transient R138 contract, decision-hand provider-binding
preflight, full R138 boundary, and caller-supplied declarations. Only an R138
candidate whose trust is exactly `CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED` and
whose selection, installation, availability, execution, authority, decision,
designation, and route-authorization lifecycle fields remain false is
request-eligible. The current real R138 inventory contains no declaration or
candidate, so the current R139 batch is empty and accepts no invented request
metadata.

One synthetic exact-compatible candidate produces one untransmitted request
packet with eight blocking proof requirements: independent provider identity,
authority, non-control, beneficial-ownership exclusion, and revocation;
independently obtained implementation integrity; bounded non-decision live
availability; native decision-receipt schema validation; allowed and denied
decision-maker-seat identity, scope, and authority probes; native signature,
key, scope, expiry, and revocation validation; exact R137/R138 digest replay;
and exact R136 decision-criteria and evidence replay.

The declaration's claimed secondary verifier remains caller-supplied and
untrusted. Its recipient identity and endpoint remain unresolved. The request
names the still-required endpoint resolver, verifier-route trust-anchor
resolver, and receipted send/receive capabilities. No packet is transmitted,
and no sender, receiver, provider-verification, authority-decision, or route-
designation receipt is invented.

R139 allows at most one packet, eight proof requirements, a five-minute request
window, zero retries, and 524,288 serialized batch bytes. Producer validation
and a separate reconstruction audit reject R138 custody substitution,
unbounded or invented request metadata, changed proof routes, and re-signed
claims of recipient trust, delivery, provider verification, selection,
installation, availability, execution, authority authentication, decision,
designation, owner/debit closure, evidence admission, persistence, promotion,
or `CANON`.

R139 adds only
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.request.create`.
Earth engine v75 and system audit v62 remain unchanged. API v135 exposes four
transient R139 schemas while preserving v134. Manifest v0.139.0 uses Earth-
system descriptor V102. R139 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 137: out-of-band route-designation decision capability specification

R137 exact-binds the transient R136 contract, request batch, full boundary, and
request options. It specifies the one missing authority capability
`authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide`
through a new specification-construction capability:
`contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision.specification.create`.
The specification is not an implementation or a decision hand.

The current real R136 request inventory is empty. R137 therefore exposes one
implementation-neutral authority specification with zero input bindings and
does not invent a request, route, decision maker, receipt, provider, or outcome.
For the two-request synthetic case, two input bindings preserve the exact R136
contract, batch, request packet, route, request window, five decision-criterion
digests, seven evidence-requirement digests, and requested-designation digest.

The specification defines inputs, a versioned result envelope, thirteen required
native decision-receipt fields, five proof surfaces, side-effect boundaries,
permissions, consent, resource budgets, fail-closed recovery, compatibility,
verification, and Mike Tobi/AXM promotion gates. A conforming external hand must
authenticate the exact `axm-host-authority-review-seat`, prove candidate and all
route-provider non-control, produce allowed and denied identity probes, bind a
native signature/key-authority/expiry/revocation chain, and satisfy all five
decision criteria with native evidence. Arriving envelopes remain untrusted.

`DESIGNATE`, `DENY`, and `UNKNOWN` are claimed result codes until independently
verified. Denial and unknown fail closed; missing, expired, revoked, partial, or
replayed receipts cannot designate. A designation would cover only the exact
route and would not verify providers, prove dependency acyclicity, resolve an
endpoint, authenticate a recipient, authorize contact or transport, admit
evidence, or close historical physical source owner/debit obligations.

R137 allows one specification, at most two bindings, five criterion and seven
evidence references per binding, 120,000 ms declared external runtime, 262,144
result-envelope bytes, zero automatic retries, and 524,288 serialized bundle
bytes. Producer validation and a separate exact reconstruction audit reject
R136 substitution and re-signed implementation, authority, decision,
designation, transport, receipt, provider, owner/debit, persistence, promotion,
canon, and mutation overclaims.

Earth engine v75 and system audit v62 remain unchanged. API v133 exposes five
transient R137 schemas while preserving v132. Manifest v0.137.0 uses
Earth-system descriptor V100. R137 remains `EXPERIMENTAL`; Mike Tobi remains the
authority, route/provider-selection, commit, merge, installation, execution,
promotion, and `CANON` gate.

## Rung 115: transient policy-key delegation-verification request preflight

R115 takes the exact transient R114 decision-integrity contract plus the exact
persistent R113 response signer-key binding-request contract and creates one
compact transient projection of the inherited 28 routes, 24 eligible routes,
and four authority-review exclusions. Its sole new capability is request
construction:
`contract.host-governance.policy-key.delegation.verification.request.create`.
It does not implement the host-only delegation verifier.

Given an exact, unapplied R114 `BIND` integrity assessment with no issues, the
builder creates two delegation-verification entries (decision key and
revocation key), six explicit host-evidence requirements, and a short-lived
host-resolved trust-root challenge. The packet binds every R115/R114/R113
source schema and digest, the exact R113 signer-key commitment and governance
scope, and both caller-supplied policy-key commitments. It has no authenticated
endpoint and remains `CREATED_NOT_TRANSMITTED`.

Producer validation and an independent transient audit reject re-digested
scope substitution, fictional delegation or binding effects, failed or
revoked R114 assessments, requests outside the exact source expiry, invented
delivery, and injected raw key material. The candidate policy cannot
self-authorize. Registry configuration, trust-root resolution, delegation
verification, admission, and actual signer-key binding remain external host
authority gaps with verdicts `UNKNOWN` or `NOT_AUTHORIZED`.

R115 adds no Earth state, migration, or persistent system-audit field. Earth
engine v75 and system audit v62 remain unchanged. API v111 exposes the five
R115 schemas, description, and transient request builder while preserving
v110. The focused default-heap Foundation Planet selftest passes 2,500+
assertions. Live browser observation remains `UNKNOWN` under the standing
localhost security-policy boundary; no workaround was attempted.

R115 does not transmit a request, authenticate an endpoint or trust root,
verify policy delegation, authorize admission, bind or trust the response
signer key, configure a registry, persist artifacts, identify or debit
historical physical source owners, establish scientific authority, promote,
or canonize. It remains `EXPERIMENTAL`; Mike Tobi remains the commit, merge,
promotion, and `CANON` gate.

## Rung 116: transient delegation-verification response signature integrity

R116 takes the exact transient R115 request contract together with its exact
R114/R113 custody and creates a compact 28/24/4 response-signature integrity
projection. Its sole new capability is
`integrity.host-governance.policy-key.delegation.verification.response.signature.verify`.
It adds no authority capability.

The transient response envelope binds the exact R116 contract and R115 request,
echoes the exact challenge, preserves both delegated key commitments and scopes,
and may carry two caller-supplied `CLAIMED_VERIFIED`, `CLAIMED_REJECTED`, or
`CLAIMED_UNKNOWN` results with claimed chain and trust-root digests. Those are
claims, not admitted host evidence. The source request remains untransmitted,
the response has no transport receipt, the challenge has no authenticated host
answer or replay receipt, and the claimed response signer remains untrusted.

Detached Ed25519 verification reports only whether canonical response bytes
match the supplied raw key and signature. Even two correctly signed
`CLAIMED_VERIFIED` results leave policy delegation `UNKNOWN`, admission
`NOT_AUTHORIZED`, registry configuration, root resolution, and actual signer-key
binding false or unknown. The assessment retains only SHA-256 commitments and
byte counts, never raw key or signature material.

A separate transient audit independently rebuilds the contract and response,
repeats the Ed25519 verification, and compares the exact assessment. Coverage
rejects capability/truth projection drift, tampered signatures, delegated-scope
or challenge substitution, raw-key injection, out-of-window responses, and
re-digested upgrades from signed claims to delegation authority or admission.

R116 adds no Earth state, system-audit field, migration, persistence, or world
mutation. Earth engine v75 and system audit v62 remain unchanged. API v112
exposes six R116 schemas plus response construction, canonicalization, and
signature verification while preserving v111. The default-heap Foundation
Planet selftest passes 2,500+ assertions.

R116 does not prove request or response transport, authenticate the response
signer, authenticate the challenge, verify replay protection or policy
delegation, decide admission, bind the response signer key, identify or debit
historical physical source owners, establish scientific authority, promote,
or canonize. It remains `EXPERIMENTAL`; Mike Tobi remains the commit, merge,
promotion, and `CANON` gate.

## Rung 118: delegation-response signer-key binding-decision integrity

R118 takes the exact transient R117 request and its exact R116/R115/R114/R113
contract custody into a compact 28/24/4 integrity projection. It adds only
`integrity.host-governance.policy-key.delegation.verification.response.signer-key.binding-decision.signature.verify`
and
`integrity.host-governance.policy-key.delegation.verification.response.signer-key.binding-decision.revocation.verify`.

A caller may supply a bounded policy descriptor, a non-applying `BIND`, `HOLD`,
or `REJECT` decision envelope, a bounded revocation snapshot, and raw Ed25519
verification inputs. R118 verifies detached signatures, policy key commitments,
time windows, exact request key/scope binding, key separation, and revocation.
The resulting assessment retains only SHA-256 commitments and lengths; it does
not persist raw authority keys, signatures, policy, decision, revocation, or
assessment artifacts.

Valid signatures prove only a match to keys in the caller-supplied policy. That
policy remains `UNTRUSTED_CALLER_SUPPLIED`; no host authority is authenticated,
no requested `BIND` action applies a binding, and admission remains
`NOT_AUTHORIZED`. A separate audit binds the assessment to the exact R118/R117
inputs and independently reconstructs the full contract projection.

Focused coverage includes valid decision and revocation signatures, a tampered
decision signature, a validly signed revocation of the exact decision,
re-digested fictional binding/delegation/registry effects, governance-scope
drift, and a decision outside the exact R117 window. The final default-heap
Foundation Planet selftest passed with 2,500+ assertions.

R118 adds no Earth state, system-audit field, migration, persistence, or world
mutation. Earth engine v75 and system audit v62 remain unchanged. API v114
exposes the seven R118 schemas and transient integrity operations while
preserving v113.

R118 does not trust the caller policy, verify its delegation, authenticate the
host or review seat, bind the response signer key, configure a registry, resolve
a trust root, decide admission, identify or debit historical physical source
owners, establish scientific authority, promote, or canonize. It remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and `CANON`
gate.

## Rung 117: delegation-response signer-key binding request routing

R117 takes the exact transient R116 response-signature contract together with
its exact R115/R114/R113 custody and creates a compact 28/24/4 signer-key
binding request projection. Its sole new capability is
`contract.host-governance.policy-key.delegation.verification.response.signer-key.binding.request.create`.
Actual host signer-key binding remains separate and unavailable.

Given the exact R117 contract, R115 request, R116 response envelope, and a valid
R116 signature assessment, the transient builder creates an untransmitted
request. It carries only the assessed public-key SHA-256 commitment, exact
response-envelope digest, claimed response signer, and exact governance scope.
The source signature remains `REPORTED_PASS_UNTRUSTED`; even signed
`CLAIMED_VERIFIED` results remain unauthenticated and produce no delegation,
admission, or binding effect.

A separate audit independently reconstructs the complete contract and packet.
Focused coverage rejects failed signature assessments, response substitution,
key-commitment and governance-scope drift, raw-key injection, fictional
delivery or authority effects, and request expiry outside the exact R115
window. The default-heap Foundation Planet selftest passed with 2,500+
assertions.

R117 adds no Earth state, system-audit field, migration, persistence, or world
mutation. Earth engine v75 and system audit v62 remain unchanged. API v113
exposes three R117 schemas plus transient request construction while preserving
v112. Live browser observation remains outside this code-only seam and is not
claimed.

R117 does not discover or authenticate an endpoint, transmit a request, trust
or bind the response signer, configure a registry, resolve a trust root, verify
policy delegation, decide admission, identify or debit historical physical
source owners, establish scientific authority, promote, or canonize. It remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and `CANON`
gate.

## Rung 113: configuration-response signer-key binding request routing

R113 binds the exact attached R112 contract schema and digest and preserves
its exact 28-route, 24-eligible, four-excluded projection as one compact
digest-bound projection. It adds only
`authority.host-governance.trust-root.registry.configuration.response.signer-key.bind.request.create`.
Actual
`authority.host-governance.trust-root.registry.configuration.response.signer-key.bind`
and `authority.host-governance.trust-root.registry.configure` remain separate,
missing host-authority capabilities.

Given the exact R113 contract, R112 contract, R111 request packet, R112
response envelope, and a valid R112 signature assessment, the transient
builder creates
`RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATED_NOT_TRANSMITTED`. It labels the
source signature verdict `REPORTED_PASS_UNTRUSTED` and carries only the
assessed public-key SHA-256 commitment and claimed response scope. It contains
no raw public key or signature bytes, endpoint, transport receipt, binding
decision, registry configuration, or authority grant.

Producer validation and a separate packet audit reject invalid or substituted
assessments, source substitution, public-key commitment drift, raw-key
injection, fictional delivery/binding/configuration, and request windows beyond
the exact R111 expiry. System audit v62 checks the compact persistent contract.
Earth engine v75 accepts v74 state, migrates R113 only from exact retained R112,
or records a permanent missing-R112 checkpoint. API v109 exposes the three R113
schemas and transient request builder while preserving v108.

The capability scout moves from 7 available / 9 missing to 8 / 8 and remains
`BLOCKED`. R113 does not bind or trust the response signer key, authenticate a
responder or registry origin, configure a registry, resolve a root, verify
delegation, decide admission, bind a provisioning-receipt signer key, verify a
governed receipt, provision a trust anchor, identify or debit historical
physical source owners, establish scientific authority, promote, or canonize.
It remains `EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and
`CANON` gate.

## Rung 112: host registry configuration-response signature integrity

R112 binds the exact attached R111 schema and digest, preserves its 28 routes,
24 eligible routes, and four authority exclusions, and adds only
`integrity.host-governance.trust-root.registry.configuration.response.signature.verify`.
Actual `authority.host-governance.trust-root.registry.configure` remains a
separate missing host-authority capability.

The compact persistent contract declares detached Ed25519 verification with a
32-byte raw public key and a 64-byte signature. A transient response envelope
must bind the exact R112 contract and exact R111 request packet, preserve its
governance domain, world, lineage, and request window, and label its registry,
root commitments, revocation state, responder, and signer key as caller-supplied
and unauthenticated. Root material is represented only by SHA-256 commitments;
the envelope neither configures nor persists a registry.

Producer validation and a separate cryptographic audit repeat canonical
signature verification and reject signature tampering, response substitution,
request substitution, scope drift, authority-field injection, and responses
outside the exact R111 window. Even a valid signature reports only integrity
under the supplied key. Signer trust, responder identity, registry origin,
registry configuration, root resolution, delegation, admission, and all
downstream authority verdicts remain `UNKNOWN` or `NOT_AUTHORIZED`.

System audit v61 checks the compact persistent contract. Earth engine v74
migrates exact v73 R111 state or records a permanent missing-R111 checkpoint.
API v108 exposes five R112 schemas plus transient envelope construction,
canonicalization, and signature verification while preserving v107. No response,
key bytes, signature bytes, or assessment is persisted; no endpoint, transport,
world mutation, physical-owner resolution, scientific authority, promotion, or
canonization is claimed. R112 remains `EXPERIMENTAL`; Mike Tobi remains the
commit, merge, promotion, and `CANON` gate.

## Rung 110: fail-closed trust-root resolution preflight

R110 binds the exact attached R109 schema and digest, preserves its 28 routes,
24 eligible routes, and four authority exclusions, and adds only
`authority.host-governance.trust-root.resolution.preflight`. The compact R110
receipt retains the R109 route projection rather than recursively duplicating
the full earlier lineage; the independent audit binds that projection back to
the attached R109 contract.

The persistent boundary explicitly says that a host-controlled out-of-band
registry is `NOT_CONFIGURED`: it has no identifier, version, or roots, cannot
be supplied by the candidate request, cannot be persisted in Foundation world
state, and has not had its origin authenticated.

Given an exact R109 request and an evaluation time inside its validity window,
the transient builder returns a typed
`BLOCKED_HOST_TRUST_ROOT_REGISTRY_NOT_CONFIGURED` result. It names the missing
host action, keeps root, identity, delegation, binding, receipt, and
provisioning verdicts `UNKNOWN`, and keeps admission `NOT_AUTHORIZED`.
Request-side registry/root injection, expired evaluation, and re-digested fake
configuration or resolution claims are rejected without mutating the world.

System audit v59 independently checks the compact binding, 28/24/4 routes,
empty registry boundary, budget attachment, emission mode, and bounded truth.
Earth engine v72 migrates exact v71 R109 state or records a permanent missing-
R109 checkpoint. API v106 exposes the four R110 schemas and transient
preflight while preserving v105.

R110 does not configure or authenticate a registry, resolve or trust a root,
verify delegations, decide admission, bind a signer key, verify a governed
receipt, provision a trust anchor, identify historical physical source owners,
or supply their debit receipts. It remains `EXPERIMENTAL`; Mike Tobi remains
the commit, merge, promotion, and `CANON` gate.

## Rung 114: transient response signer-key binding-decision integrity

R114 takes the exact persistent R113 response signer-key binding-request
contract as its boundary and creates a compact transient projection of its 28
routes, 24 eligible routes, and four authority-review exclusions. It adds only
detached Ed25519 integrity checks for a host binding decision and its signed
revocation snapshot. A separate transient audit independently reconstructs the
projection and checks the final assessment's exact source bindings and
non-authority verdicts.

The caller must supply separate decision and revocation public-key commitments,
bounded policy validity, one `BIND`, `HOLD`, or `REJECT` decision inside the
exact R113 request window, and a bounded revocation snapshot. Valid signatures
mean only that the canonical bytes match those caller-supplied keys. The policy
is explicitly untrusted: delegation is unverified, admission remains
`NOT_AUTHORIZED`, and even a signed `BIND` decision applies no binding and
configures no registry. Tampered signatures, revoked decisions, scope/key
drift, fabricated effects, and decisions outside the request window fail
closed without mutating the world.

R114 is deliberately not an Earth-state rung. Earth engine v75 and system
audit v62 remain unchanged; there is no R114 migration or persistence claim.
API v110 generates the transient contract only from the currently attached
R113 contract and exposes policy, decision, revocation, canonicalization, and
verification helpers. Raw public keys and signatures are never retained in an
assessment or world state.

Two rejected persistent designs exhausted the default Node heap during the
inherited all-in-one verifier. The final transient coverage runs in a separate
async activation and the unmodified default-heap Foundation Planet selftest
passes. R114 still does not verify policy-key delegation, bind or trust the
response signer key, authenticate the responder or registry origin, configure
a registry, resolve a root, decide admission, verify a governed receipt,
provision a trust anchor, identify or debit historical physical source owners,
establish scientific authority, promote, or canonize. It remains
`EXPERIMENTAL`; Mike Tobi remains the commit, merge, promotion, and `CANON`
gate.

## Rung 111: host registry configuration request routing

R111 binds the exact attached R110 schema and digest, preserves its 28 routes,
24 eligible routes, and four authority exclusions, and adds only
`authority.host-governance.trust-root.registry.configuration.request.create`.
It also makes the previously implicit authority boundary explicit:
`authority.host-governance.trust-root.registry.configure` is distinct from
and required before `authority.host-governance.trust-root.resolve`.

The compact persistent contract declares four unmet host-only requirements:
an authenticated registry descriptor, host-governance scope binding, an
authenticated trust-root set, and registry revocation/version policy. None
may be supplied by a candidate request, and every value remains unprovided
with verdict `UNKNOWN`.

Given exact R111, R110, and R109 sources and a bounded time window, the
transient builder creates
`HOST_REGISTRY_CONFIGURATION_REQUEST_CREATED_NOT_TRANSMITTED`. The packet
contains no registry identifier or version, zero roots, no endpoint, no
transport receipt, and no recipient authentication. It is not persisted and
does not mutate the world.

Producer validation and a separate packet audit reject registry/root/endpoint
injection, expiry beyond R109, re-digested fictional delivery, and fictional
configuration. System audit v60 checks the compact persistent contract. Earth
engine v73 migrates exact v72 R110 state or records a permanent missing-R110
checkpoint. API v107 exposes the four R111 schemas and transient request
builder while preserving v106.

The capability gap is now more precise: request creation is available, while
actual registry configuration plus root resolution and the five downstream
authority capabilities remain unavailable. R111 does not discover an
endpoint, transmit a request, authenticate or configure a registry, resolve a
root, verify delegations, decide admission, bind a signer key, verify a
governed receipt, provision a trust anchor, identify historical physical
source owners, or supply their debit receipts. It remains `EXPERIMENTAL`;
Mike Tobi remains the commit, merge, promotion, and `CANON` gate.
