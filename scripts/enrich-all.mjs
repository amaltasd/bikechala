import { readFileSync, writeFileSync } from 'node:fs';

const BIKES_PATH = 'src/data/bikes.json';
const bikes = JSON.parse(readFileSync(BIKES_PATH, 'utf8'));

// 1. Spec updates dictionary for researched models
const specUpdates = {
  // Royal Enfield
  'royal-enfield-shotgun-650': {
    engineCc: 648, powerPs: 47, torqueNm: 52.3, gearbox: '6-speed', fuelTankL: 13.8, kerbWeightKg: 240, seatHeightMm: 795,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 22,
    summary: 'A 648 cc parallel-twin bobber-cruiser built on Royal Enfield\'s 650 platform with modular seating and upside-down front forks.',
    highlights: ['648 cc parallel-twin engine with 47 PS', '6-speed gearbox with assist and slipper clutch', 'Showa upside-down front forks', 'Modular subframe allows single or pillion setup']
  },
  'royal-enfield-goan-classic-350': {
    engineCc: 349, powerPs: 20.2, torqueNm: 27, gearbox: '5-speed', fuelTankL: 13, kerbWeightKg: 197, seatHeightMm: 750,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 36,
    summary: 'A bobber-style retro cruiser with ape-hanger handlebars, whitewall tyres, and Royal Enfield\'s smooth 349 cc J-series engine.',
    highlights: ['349 cc J-series single-cylinder engine', 'Ape-hanger handlebars and tubeless cross-spoke wheels', 'Dual-channel ABS with front and rear discs', 'Low 750 mm seat height']
  },
  'royal-enfield-classic-650': {
    engineCc: 648, powerPs: 47, torqueNm: 52.3, gearbox: '6-speed', fuelTankL: 14.8, kerbWeightKg: 243, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 22,
    summary: 'The iconic Classic styling paired with Royal Enfield\'s 648 cc parallel-twin engine and dual pea-shooter exhausts.',
    highlights: ['648 cc parallel-twin air/oil-cooled engine', 'Classic casquette headlight with LED lighting', 'Dual-channel ABS with dual discs', 'Teardrop fuel tank with twin exhaust pipes']
  },
  'royal-enfield-bear-650': {
    engineCc: 648, powerPs: 47, torqueNm: 56.5, gearbox: '6-speed', fuelTankL: 13.7, kerbWeightKg: 216, seatHeightMm: 830,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 23,
    summary: 'A scrambler on the 650 platform featuring a 2-into-1 exhaust, increased 56.5 Nm torque, Showa USD forks, and dual-purpose tyres.',
    highlights: ['648 cc twin tuned for 56.5 Nm torque', '2-into-1 scrambler exhaust system', 'Showa upside-down forks and dual rear shocks', 'Switchable rear ABS for off-road riding']
  },
  'royal-enfield-scram-440': {
    engineCc: 443, powerPs: 25, torqueNm: 34, gearbox: '5-speed', fuelTankL: 15, kerbWeightKg: 187, seatHeightMm: 795,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30,
    summary: 'An urban adventure scrambler powered by a refined 443 cc air/oil-cooled engine with a 19-inch front wheel.',
    highlights: ['443 cc long-stroke engine', 'Dual-channel ABS with disc brakes', '19-inch front and 17-inch rear wheels', 'Accessible 795 mm seat height']
  },
  'royal-enfield-bullet-650': {
    engineCc: 648, powerPs: 47, torqueNm: 52.3, gearbox: '6-speed', fuelTankL: 14.5, kerbWeightKg: 242, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 22,
    summary: 'The venerable Bullet nameplate with Royal Enfield\'s 648 cc parallel-twin engine, bench seat, and winged badge styling.',
    highlights: ['648 cc parallel-twin engine', 'Classic hand-painted pinstripes', '6-speed transmission with slip-assist clutch', 'Twin exhausts and dual-channel ABS']
  },
  'royal-enfield-himalayan-440': {
    engineCc: 443, powerPs: 25, torqueNm: 34, gearbox: '5-speed', fuelTankL: 15, kerbWeightKg: 191, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30,
    summary: 'An accessible dual-sport tourer bridging the classic adventure gap with a 443 cc single and comfortable upright ergonomics.',
    highlights: ['443 cc air-cooled single-cylinder', 'High ground clearance and luggage mounting racks', 'Dual-channel ABS with off-road mode']
  },
  'royal-enfield-flying-flea-c6': {
    fuelType: 'electric', batteryKwh: 3.5, rangeKm: 120, topSpeedKmph: 105, kerbWeightKg: 110,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel',
    summary: 'Royal Enfield\'s first electric motorcycle under the Flying Flea brand, featuring a forged aluminium frame and girder front fork.',
    highlights: ['Lightweight forged aluminium frame', 'Articulating girder front fork suspension', 'Connected touchscreen instrument cluster', 'Over 100 km real-world range']
  },

  // Bajaj
  'bajaj-pulsar-ns400z': {
    engineCc: 373.27, powerPs: 40, torqueNm: 35, gearbox: '6-speed', fuelTankL: 12, kerbWeightKg: 174, seatHeightMm: 807,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 28,
    summary: 'Bajaj\'s flagship Pulsar with a 373 cc liquid-cooled engine, 43 mm gold USD forks, four ride modes, and traction control.',
    highlights: ['373 cc DOHC 4-valve liquid-cooled engine', '40 PS power with 6-speed slipper clutch', '4 ride modes: Road, Rain, Sport, Off-road', 'Switchable traction control and dual-channel ABS']
  },

  // Yamaha
  'yamaha-xsr-155': {
    engineCc: 155, powerPs: 18.4, torqueNm: 14.2, gearbox: '6-speed', fuelTankL: 10, kerbWeightKg: 134, seatHeightMm: 810,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel', mileageKmpl: 48,
    summary: 'Yamaha\'s neo-retro roadster featuring the R15-derived 155 cc VVA liquid-cooled engine and teardrop fuel tank styling.',
    highlights: ['155 cc liquid-cooled 4-valve engine with VVA', 'Assist and slipper clutch with 6 speeds', 'Inverted USD front forks', 'Classic round LED headlight and LCD console']
  },
  'yamaha-fz-x': {
    engineCc: 149, powerPs: 12.4, torqueNm: 13.3, gearbox: '5-speed', fuelTankL: 10, kerbWeightKg: 139, seatHeightMm: 810,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel', mileageKmpl: 45,
    summary: 'A neo-retro commuter bike based on the FZ platform, equipped with traction control, Bluetooth Y-Connect, and upright ergonomics.',
    highlights: ['149 cc Blue Core fuel-injected engine', 'Traction Control System (TCS)', 'Single-channel ABS with front and rear discs', 'Bluetooth connectivity with phone notifications']
  },
  'yamaha-fzs-fi-v4': {
    engineCc: 149, powerPs: 12.4, torqueNm: 13.3, gearbox: '5-speed', fuelTankL: 13, kerbWeightKg: 136, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel', mileageKmpl: 46,
    summary: 'Yamaha\'s popular 150 cc streetfighter with Traction Control, LED indicators, and Bluetooth-enabled digital instrument cluster.',
    highlights: ['149 cc Blue Core FI engine with E20 compliance', 'Standard Traction Control System', 'Single-channel ABS with rear disc brake', 'Comfortable 790 mm two-level seat']
  },
  'yamaha-r15s': {
    engineCc: 155, powerPs: 18.6, torqueNm: 14.1, gearbox: '6-speed', fuelTankL: 11, kerbWeightKg: 142, seatHeightMm: 815,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 40,
    summary: 'The single-piece unibody seat edition of Yamaha\'s track-bred R15, offering sports performance with enhanced pillion comfort.',
    highlights: ['155 cc liquid-cooled VVA engine', 'Unibody single piece seat for daily practicality', 'Dual-channel ABS with Deltabox chassis', 'Assist and slipper clutch']
  },
  'yamaha-fz-x-hybrid': {
    engineCc: 149, powerPs: 12.4, torqueNm: 13.3, gearbox: '5-speed', fuelTankL: 10, kerbWeightKg: 140, seatHeightMm: 810,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel', mileageKmpl: 48,
    summary: 'The hybrid-assisted variant of the FZ-X with Smart Motor Generator providing electric torque assist during acceleration.',
    highlights: ['SMG-based electric power assist', 'Traction control and single-channel ABS', 'Neo-retro scrambler styling']
  },
  'yamaha-ec-06': {
    fuelType: 'electric', batteryKwh: 3.2, rangeKm: 110, topSpeedKmph: 85, kerbWeightKg: 105,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS',
    summary: 'Yamaha\'s modern electric commuter scooter built on a dedicated EV platform for everyday city riding.',
    highlights: ['Lithium-ion swappable battery system', 'Smooth quiet electric motor', 'Connected digital instrument screen']
  },
  'yamaha-aerox-e': {
    fuelType: 'electric', batteryKwh: 4.0, rangeKm: 120, topSpeedKmph: 100, kerbWeightKg: 120,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel',
    summary: 'An electric maxi-sports scooter retaining the Aerox chassis dynamics with instantaneous electric torque delivery.',
    highlights: ['Sporty maxi-scooter chassis', '100 km/h top speed capability', 'Regenerative braking and connected dash']
  },

  // Suzuki
  'suzuki-gixxer': {
    engineCc: 155, powerPs: 13.6, torqueNm: 13.8, gearbox: '5-speed', fuelTankL: 12, kerbWeightKg: 141, seatHeightMm: 795,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel', mileageKmpl: 45,
    summary: 'A sharp 155 cc streetfighter known for its engaging chassis balance, SEP engine, and muscular fuel tank profile.',
    highlights: ['155 cc SEP fuel-injected engine', 'LED headlamp and dual-muffler exhaust design', 'Single-channel ABS with front and rear discs', 'Bluetooth Suzuki Ride Connect console']
  },
  'suzuki-v-strom-sx': {
    engineCc: 249, powerPs: 26.5, torqueNm: 22.2, gearbox: '6-speed', fuelTankL: 12, kerbWeightKg: 167, seatHeightMm: 835,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 36,
    summary: 'A quarter-litre sports adventure tourer with a 19-inch front wheel, oil-cooled single, and comfortable mile-munching ergonomics.',
    highlights: ['249 cc Suzuki Oil Cooling System (SOCS) engine', '19-inch front wheel with dual-purpose tyres', '205 mm ground clearance', 'USB charging socket and Bluetooth navigation']
  },
  'suzuki-gixxer-sf-250': {
    engineCc: 249, powerPs: 26.5, torqueNm: 22.2, gearbox: '6-speed', fuelTankL: 12, kerbWeightKg: 161, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 38,
    summary: 'A fully faired quarter-litre sports tourer powered by Suzuki\'s oil-cooled 249 cc single with dual-channel ABS.',
    highlights: ['249 cc SOCS engine producing 26.5 PS', 'Aerodynamic full fairing with clip-on handlebars', 'Dual-channel ABS with radial front tyre', 'Brushed finish dual-exit exhaust']
  },
  'suzuki-gixxer-250': {
    engineCc: 249, powerPs: 26.5, torqueNm: 22.2, gearbox: '6-speed', fuelTankL: 12, kerbWeightKg: 156, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 38,
    summary: 'The naked roadster sibling of the Gixxer SF 250, shedding 5 kg for nimble city handling and quick traffic overtakes.',
    highlights: ['249 cc oil-cooled 4-valve engine', 'Wide one-piece handlebar for upright control', 'Dual-channel ABS and dual discs', 'Lightweight 156 kg kerb weight']
  },
  'suzuki-gsx-8r': {
    engineCc: 776, powerPs: 83, torqueNm: 78, gearbox: '6-speed', fuelTankL: 14, kerbWeightKg: 205, seatHeightMm: 810,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 24,
    summary: 'Suzuki\'s middleweight supersport with a 776 cc 270-degree parallel twin, Showa SFF-BP forks, and bi-directional quickshifter.',
    highlights: ['776 cc DOHC 270-degree parallel-twin engine', 'Bi-directional Quick Shift system standard', 'Suzuki Intelligent Ride System with 3 drive modes', '5-inch full-colour TFT multi-function dash']
  },

  // Triumph
  'triumph-speed-t4': {
    engineCc: 398.15, powerPs: 31, torqueNm: 36, gearbox: '6-speed', fuelTankL: 13, kerbWeightKg: 180, seatHeightMm: 806,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30,
    summary: 'An accessible roadster tuned for strong low-to-mid torque, telescopic forks, and classic Triumph modern roadster proportions.',
    highlights: ['398 cc liquid-cooled TR-series engine (31 PS, 36 Nm)', 'Tuned for urban low-rpm torque delivery', 'Dual-channel ABS with 300 mm front disc', 'Assist and slipper clutch']
  },
  'triumph-scrambler-400-xc': {
    engineCc: 398.15, powerPs: 40, torqueNm: 37.5, gearbox: '6-speed', fuelTankL: 13, kerbWeightKg: 186, seatHeightMm: 835,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 28,
    summary: 'A true scrambler with 19-inch front wheel, 150 mm suspension travel, switchable traction control, and high ground clearance.',
    highlights: ['40 PS liquid-cooled single-cylinder engine', '19-inch front wheel with Metzeler Karoo Street tyres', 'Switchable off-road ABS and traction control', 'Wide handlebars with handguards']
  },
  'triumph-tracker-400': {
    engineCc: 398.15, powerPs: 40, torqueNm: 37.5, gearbox: '6-speed', fuelTankL: 13, kerbWeightKg: 178, seatHeightMm: 810,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 29,
    summary: 'A flat-track inspired derivative on the 400 cc platform with minimalist bodywork and nimble geometry.',
    highlights: ['398 cc liquid-cooled TR-series engine', 'Flat-track inspired styling and wide handlebar', 'Dual-channel ABS and slip-assist clutch']
  },
  'triumph-thruxton-400': {
    engineCc: 398.15, powerPs: 40, torqueNm: 37.5, gearbox: '6-speed', fuelTankL: 13, kerbWeightKg: 176, seatHeightMm: 810,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 29,
    summary: 'A cafe racer on the TR-series 400 cc platform featuring a bikini fairing, clip-on handlebars, and rear-set footpegs.',
    highlights: ['40 PS TR-series 4-valve engine', 'Classic cafe racer front cowl and bar-end mirrors', 'Inverted 43 mm big piston USD forks']
  },
  'triumph-bonneville-t40': {
    engineCc: 398.15, powerPs: 35, torqueNm: 37, gearbox: '6-speed', fuelTankL: 14, kerbWeightKg: 182, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30,
    summary: 'A retro roadster carrying classic Bonneville spoked-wheel heritage into the accessible 400 cc modern classic category.',
    highlights: ['Authentic Bonneville styling with wire-spoke wheels', 'Dual peashooter exhausts', 'Modern liquid cooling and ride-by-wire']
  },

  // Aprilia
  'aprilia-rs-457': {
    engineCc: 457, powerPs: 47.6, torqueNm: 43.5, gearbox: '6-speed', fuelTankL: 13, kerbWeightKg: 175, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 28,
    summary: 'A twin-cylinder supersport engineered by Aprilia with an aluminium perimeter frame, ride-by-wire, and 3-stage traction control.',
    highlights: ['457 cc parallel-twin engine with 270-degree crankshaft', 'Aluminium dual-beam frame (class-first)', '3 ride modes and 3-level traction control', 'ByBre 4-piston radial caliper with 320 mm front disc']
  },
  'aprilia-sr-160': {
    engineCc: 160, powerPs: 11.27, torqueNm: 13.44, gearbox: 'Automatic', fuelTankL: 6, kerbWeightKg: 122, seatHeightMm: 780,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'Single channel', mileageKmpl: 35,
    summary: 'Italy\'s performance scooter with 14-inch alloy wheels, sporty suspension setup, and front disc brake with single-channel ABS.',
    highlights: ['160 cc 3-valve i-get fuel-injected engine', 'Large 14-inch alloy wheels for motorcycle-like stability', 'Front disc brake with single-channel ABS', 'Sporty split-LED headlamp and digital dash']
  },

  // Jawa
  'jawa-42-bobber': {
    engineCc: 334, powerPs: 29.9, torqueNm: 30, gearbox: '6-speed', fuelTankL: 12.5, kerbWeightKg: 175, seatHeightMm: 750,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30,
    summary: 'A factory custom bobber with a floating single seat, bar-end mirrors, dual-channel ABS, and twin chopped exhausts.',
    highlights: ['334 cc liquid-cooled DOHC engine', 'Adjustable floating single seat', 'Twin exhausts with slash-cut design', 'Dual-channel Continental ABS']
  },
  'jawa-42-fj': {
    engineCc: 334, powerPs: 29.2, torqueNm: 29.6, gearbox: '6-speed', fuelTankL: 12, kerbWeightKg: 184, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 31,
    summary: 'A retro-modern roadster equipped with the Alpha2 334 cc liquid-cooled motor, aluminium fuel tank cladding, and assist clutch.',
    highlights: ['334 cc Alpha2 liquid-cooled engine', 'Brushed aluminium anodized tank inserts', 'Assist and slipper clutch', 'Wide flat handlebar with dual exhausts']
  },
  'jawa-350': {
    engineCc: 334, powerPs: 22.5, torqueNm: 28.2, gearbox: '6-speed', fuelTankL: 13.2, kerbWeightKg: 194, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 32,
    summary: 'The classic Jawa silhouette remade with a heavier chassis, taller ride height, 334 cc liquid cooling, and vintage chrome finish.',
    highlights: ['334 cc liquid-cooled single tuned for low-end torque', '178 mm ground clearance', 'Dual-channel ABS with disc brakes', 'Authentic vintage styling with twin exhausts']
  },
  'jawa-perak': {
    engineCc: 334, powerPs: 30.6, torqueNm: 32.74, gearbox: '6-speed', fuelTankL: 14, kerbWeightKg: 175, seatHeightMm: 750,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30,
    summary: 'India\'s original factory bobber with matte black styling, tan leather floating seat, and punchy 334 cc DOHC engine.',
    highlights: ['334 cc liquid-cooled single producing 32.7 Nm torque', 'Factory bobber stance with cantilever tan leather seat', 'Dual-channel ABS with twin matte-black exhausts']
  },

  // Kawasaki
  'kawasaki-w175': {
    engineCc: 177, powerPs: 13, torqueNm: 13.2, gearbox: '5-speed', fuelTankL: 12, kerbWeightKg: 135, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'Single channel', mileageKmpl: 45,
    summary: 'Kawasaki\'s retro roadster featuring an air-cooled 177 cc single, lightweight chassis, and accessible 790 mm seat height.',
    highlights: ['177 cc air-cooled single-cylinder FI engine', 'Ultra-lightweight 135 kg kerb weight', 'Round retro headlight with semi-digital meter', 'Front disc with single-channel ABS']
  },
  'kawasaki-z300': {
    engineCc: 296, powerPs: 39, torqueNm: 27, gearbox: '6-speed', fuelTankL: 17, kerbWeightKg: 170, seatHeightMm: 785,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 28,
    summary: 'A naked streetfighter powered by Kawasaki\'s rev-happy 296 cc parallel twin with aggressive Sugomi styling.',
    highlights: ['296 cc liquid-cooled DOHC parallel-twin', 'Assist and slipper clutch', 'Aggressive Z-family front mask and bodywork', 'Dual-channel ABS']
  },
  'kawasaki-z650': {
    engineCc: 649, powerPs: 68, torqueNm: 64, gearbox: '6-speed', fuelTankL: 15, kerbWeightKg: 191, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 22,
    summary: 'A middleweight streetfighter powered by a 649 cc parallel twin, equipped with Kawasaki Traction Control and colour TFT dash.',
    highlights: ['649 cc parallel-twin engine delivering 68 PS', 'Kawasaki Traction Control (KTRC) with 2 modes', '4.3-inch full-colour TFT instrument cluster', 'Lightweight trellis frame with low 790 mm seat']
  },
  'kawasaki-ninja-650': {
    engineCc: 649, powerPs: 68, torqueNm: 64, gearbox: '6-speed', fuelTankL: 15, kerbWeightKg: 196, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 21,
    summary: 'Kawasaki\'s versatile middleweight sports tourer offering twin LED headlights, smartphone connectivity, and tractable torque.',
    highlights: ['649 cc liquid-cooled parallel twin', 'KTRC traction control standard', 'Smartphone connectivity via Rideology app', 'Comfortable sports touring ergonomics']
  },
  'kawasaki-ninja-zx-6r': {
    engineCc: 636, powerPs: 124, torqueNm: 69, gearbox: '6-speed', fuelTankL: 17, kerbWeightKg: 198, seatHeightMm: 830,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 16,
    summary: 'A track-focused 636 cc in-line 4 supersport with quickshifter, Showa SFF-BP fork, and dual Brembo radial calipers.',
    highlights: ['636 cc liquid-cooled in-line 4 producing 124 PS', 'Kawasaki Quick Shifter (KQS)', 'Showa SFF-BP fork with full adjustability', 'Brembo radial-mount monobloc calipers']
  },
  'kawasaki-vulcan-s': {
    engineCc: 649, powerPs: 61, torqueNm: 62.4, gearbox: '6-speed', fuelTankL: 14, kerbWeightKg: 235, seatHeightMm: 705,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 22,
    summary: 'An urban cruiser powered by the Ninja-derived 649 cc parallel twin, with relaxed forward controls and low 705 mm seat.',
    highlights: ['649 cc parallel twin tuned for relaxed cruising', 'ERGO-FIT adjustable footpeg, handlebar, and seat positions', 'Low 705 mm seat height with dual-channel ABS']
  },
  'kawasaki-eliminator': {
    engineCc: 451, powerPs: 45, torqueNm: 42.6, gearbox: '6-speed', fuelTankL: 13, kerbWeightKg: 176, seatHeightMm: 735,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 26,
    summary: 'A lightweight neo-retro cruiser with a 451 cc parallel-twin engine, trellis frame, and comfortable long-wheelbase stance.',
    highlights: ['451 cc parallel-twin engine with assist and slipper clutch', 'Lightweight 176 kg cruiser chassis', 'Round all-digital LCD instrumentation', 'Relaxed cruiser geometry with 735 mm seat']
  },
  'kawasaki-versys-650': {
    engineCc: 649, powerPs: 66, torqueNm: 61, gearbox: '6-speed', fuelTankL: 21, kerbWeightKg: 219, seatHeightMm: 845,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 20,
    summary: 'A dedicated adventure tourer with a huge 21-litre fuel tank, adjustable windscreen, long-travel suspension, and KTRC.',
    highlights: ['21-litre fuel tank for long-range touring', 'Long-travel Showa suspension front and rear', '4-way adjustable touring windscreen', 'Kawasaki Traction Control (KTRC) standard']
  },

  // BMW Motorrad
  'bmw-motorrad-g-310-rr': {
    engineCc: 312.12, powerPs: 34, torqueNm: 27.3, gearbox: '6-speed', fuelTankL: 11, kerbWeightKg: 174, seatHeightMm: 811,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30,
    summary: 'BMW\'s entry supersport with 4 ride modes, vertical 5-inch TFT racing display, and race-inspired aerodynamic fairing.',
    highlights: ['312 cc reverse-inclined DOHC single', '4 ride modes: Track, Sport, Urban, Rain', 'Vertical 5-inch TFT with race telemetry', 'Michelin Pilot Street tyres and BMW Motorrad ABS']
  },
  'bmw-motorrad-f-450-gs': {
    engineCc: 450, powerPs: 48, torqueNm: 45, gearbox: '6-speed', fuelTankL: 14, kerbWeightKg: 175, seatHeightMm: 830,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 26,
    summary: 'A lightweight parallel-twin adventure tourer embodying true GS capability with cross-spoke wheels and off-road modes.',
    highlights: ['Brand new 450 cc parallel-twin engine', 'Cross-spoke wheels with tubeless adventure tyres', 'BMW Motorrad ABS Pro with cornering capability']
  },
  'bmw-motorrad-r-1300-gs': {
    engineCc: 1300, powerPs: 145, torqueNm: 149, gearbox: '6-speed', fuelTankL: 19, kerbWeightKg: 237, seatHeightMm: 850,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 20,
    summary: 'BMW\'s flagship adventure motorcycle featuring a 1300 cc boxer engine, matrix LED headlight, and electronic DSA suspension.',
    highlights: ['1300 cc Boxer engine with ShiftCam producing 145 PS and 149 Nm', 'Dynamic Suspension Adjustment (DSA) with adaptive vehicle height', 'Radar-assisted Active Cruise Control and lane change warning', 'Full Integral ABS Pro']
  },
  'bmw-motorrad-s-1000-rr': {
    engineCc: 999, powerPs: 210, torqueNm: 113, gearbox: '6-speed', fuelTankL: 16.5, kerbWeightKg: 197, seatHeightMm: 824,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 15,
    summary: 'BMW\'s benchmark litre-class superbike with aerodynamic winglets, ShiftCam variable valve timing, and 210 PS track capability.',
    highlights: ['999 cc inline-4 ShiftCam engine generating 210 PS', 'Factory aerodynamic winglets generating 17 kg downforce', 'M Chassis kit and Slide Control system', 'Launch control and Pit Lane Limiter']
  },
  'bmw-motorrad-ce-02': {
    fuelType: 'electric', batteryKwh: 3.92, rangeKm: 90, topSpeedKmph: 95, kerbWeightKg: 132,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel',
    summary: 'BMW\'s playful urban eParkourer with skateboard-inspired design, 90 km range, and quick off-the-line electric torque.',
    highlights: ['Dual removable 1.96 kWh lithium-ion battery packs', '11 kW electric motor delivering 55 Nm torque', 'Inverted front forks and single-sided rear swingarm', 'Micro TFT display with smartphone connectivity']
  },

  // Vespa
  'vespa-125': {
    engineCc: 124.45, powerPs: 9.7, torqueNm: 9.6, gearbox: 'Automatic', fuelTankL: 7.4, kerbWeightKg: 115, seatHeightMm: 770,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS', mileageKmpl: 45,
    summary: 'The quintessential Italian scooter built with a monocoque steel body, front disc brake, and 125 cc 3-valve engine.',
    highlights: ['Classic pressed monocoque steel bodywork', '125 cc 3-valve aluminum cylinder engine', '200 mm front disc brake with combi-braking', 'Airplane-inspired single-sided front suspension']
  },
  'vespa-150': {
    engineCc: 149.5, powerPs: 10.4, torqueNm: 10.6, gearbox: 'Automatic', fuelTankL: 7.4, kerbWeightKg: 115, seatHeightMm: 770,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'Single channel', mileageKmpl: 40,
    summary: 'Classic Vespa elegance powered by a larger 150 cc engine and single-channel ABS for confident stopping.',
    highlights: ['150 cc 3-valve engine with electronic fuel injection', 'Single-channel ABS with 200 mm front disc', 'Timeless curved steel monocoque frame', 'Wide comfortable contoured seat']
  },
  'vespa-s-150': {
    engineCc: 149.5, powerPs: 10.4, torqueNm: 10.6, gearbox: 'Automatic', fuelTankL: 7.4, kerbWeightKg: 115, seatHeightMm: 770,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'Single channel', mileageKmpl: 40,
    summary: 'The sportier rendition of the Vespa 150 with rectangular headlamp styling, blacked-out trims, and red monoshock accent.',
    highlights: ['Sporty rectangular LED headlamp design', 'Blacked-out mirrors, grab rail, and wheels', 'Single-channel ABS with front disc', 'High-tensile steel monocoque body']
  },
  'vespa-zx-125': {
    engineCc: 124.45, powerPs: 9.7, torqueNm: 9.6, gearbox: 'Automatic', fuelTankL: 7.4, kerbWeightKg: 114, seatHeightMm: 770,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS', mileageKmpl: 45,
    summary: 'An accessible Vespa variant with signature chrome mirrors, front disc brake, and vintage Italian colorways.',
    highlights: ['125 cc 3V tech engine', 'Front disc brake with CBS', 'Vibrant classic Italian colour palettes']
  },

  // Ola Electric
  'ola-electric-s1-z': {
    batteryKwh: 3.0, rangeKm: 146, topSpeedKmph: 90, fuelType: 'electric', kerbWeightKg: 115,
    frontBrake: 'Drum', rearBrake: 'Drum', abs: 'CBS',
    summary: 'An affordable urban electric scooter with a 3 kWh battery, 146 km IDC range, and swappable battery support.',
    highlights: ['3 kWh battery pack with 146 km IDC range', 'Dual portable batteries', '90 km/h top speed', 'Generous under-seat boot space']
  },
  'ola-electric-s1-x-plus': {
    batteryKwh: 3.0, rangeKm: 151, topSpeedKmph: 90, fuelType: 'electric', kerbWeightKg: 108,
    frontBrake: 'Drum', rearBrake: 'Drum', abs: 'CBS',
    summary: 'An everyday electric scooter featuring a 3 kWh battery, 5-inch segmented screen, and physical key setup.',
    highlights: ['3 kWh battery offering 151 km IDC range', '6 kW peak motor with 0-40 km/h in 3.3s', 'Physical key with 5-inch segmented display', 'Multi-reflector LED headlamp']
  },
  'ola-electric-s1-pro-sport': {
    batteryKwh: 4.0, rangeKm: 195, topSpeedKmph: 120, fuelType: 'electric', kerbWeightKg: 116,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel',
    summary: 'A performance edition of the S1 Pro featuring sport suspension tuning, 120 km/h top speed, and Hyper mode.',
    highlights: ['4 kWh battery pack with 195 km IDC range', '11 kW peak motor with 120 km/h top speed', 'Hyper Mode and Cruise Control standard', '7-inch touchscreen with navigation']
  },
  'ola-electric-s1-pro-plus': {
    batteryKwh: 4.0, rangeKm: 195, topSpeedKmph: 120, fuelType: 'electric', kerbWeightKg: 116,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel',
    summary: 'Ola\'s fully-loaded flagship electric scooter with MoveOS smart features, dual disc brakes, and Party Mode audio.',
    highlights: ['195 km claimed IDC range on a single charge', 'Dual disc brakes with combi-braking', 'Built-in speakers with Party Mode and music playback', 'Keyless access and digital document storage']
  },
  'ola-electric-roadster': {
    batteryKwh: 4.5, rangeKm: 200, topSpeedKmph: 126, fuelType: 'electric', kerbWeightKg: 135,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel',
    summary: 'An electric commuter motorcycle equipped with a 4.5 kWh battery, 126 km/h top speed, and 200 km IDC range.',
    highlights: ['13 kW peak motor output', '200 km IDC range on a 4.5 kWh pack', 'Front disc with single-channel ABS', 'Touchscreen dash with turn-by-turn navigation']
  },
  'ola-electric-roadster-x-plus': {
    batteryKwh: 4.5, rangeKm: 200, topSpeedKmph: 124, fuelType: 'electric', kerbWeightKg: 130,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS',
    summary: 'An electric roadster motorcycle variant delivering long range and 124 km/h performance for highway commutes.',
    highlights: ['11 kW motor output', '200 km claimed range', 'Combi-braking system and LED headlight']
  },
  'ola-electric-roadster-pro': {
    batteryKwh: 16.0, rangeKm: 579, topSpeedKmph: 194, fuelType: 'electric', kerbWeightKg: 160,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel',
    summary: 'Ola\'s halo electric sports motorcycle packing a massive 16 kWh battery, 52 kW motor, and 194 km/h top speed.',
    highlights: ['52 kW (70.7 PS) peak motor with 105 Nm torque', '0-40 km/h in an astonishing 1.2 seconds', 'Up to 579 km IDC range on 16 kWh pack', 'Twin front discs with cornering ABS']
  },

  // Ather & Simple & Revolt & Ampere
  'ather-450-apex': {
    batteryKwh: 3.7, rangeKm: 157, topSpeedKmph: 100, fuelType: 'electric', kerbWeightKg: 111,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'CBS',
    summary: 'Ather\'s 10th-anniversary flagship featuring transparent side panels, Warp+ mode (0-40 in 2.9s), and Magic Twist regenerative throttle.',
    highlights: ['3.7 kWh battery with 157 km certified range', '7 kW motor with 100 km/h top speed', 'Transparent polycarbonate panels and orange chassis', 'Magic Twist throttle for braking without levers']
  },
  'ather-konarc': {
    batteryKwh: 2.9, rangeKm: 115, topSpeedKmph: 80, fuelType: 'electric', kerbWeightKg: 108,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS',
    summary: 'An accessible family electric scooter program engineered on Ather\'s proven chassis with high durability and low running costs.',
    highlights: ['2.9 kWh IP67-rated battery pack', 'Comfortable family seating layout', 'Ather Grid fast charging support']
  },
  'simple-energy-wave': {
    batteryKwh: 3.7, rangeKm: 150, topSpeedKmph: 105, fuelType: 'electric', kerbWeightKg: 120,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'CBS',
    summary: 'A performance-oriented electric scooter featuring 8.5 kW peak power, sharp aerodynamic apron, and 150 km range.',
    highlights: ['8.5 kW motor with 72 Nm torque', '105 km/h top speed with 0-40 km/h in 2.77s', '7-inch touchscreen instrument console']
  },
  'simple-energy-ultra': {
    batteryKwh: 5.0, rangeKm: 212, topSpeedKmph: 105, fuelType: 'electric', kerbWeightKg: 134,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'CBS',
    summary: 'A long-range electric scooter packing a 5 kWh dual battery setup delivering 212 km IDC range on a single charge.',
    highlights: ['Dual battery setup (fixed + portable) totalling 5 kWh', '212 km IDC range', '8.5 kW peak electric motor with quick acceleration']
  },
  'ampere-nexus': {
    batteryKwh: 3.0, rangeKm: 136, topSpeedKmph: 93, fuelType: 'electric', kerbWeightKg: 118,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS',
    summary: 'A premium family electric scooter featuring a 3 kWh safe LFP battery, 7-inch TFT screen, and 93 km/h top speed.',
    highlights: ['3 kWh safe Lithium Iron Phosphate (LFP) battery', '136 km certified range with 4 kW peak motor', '7-inch touchscreen dash with navigation and Bluetooth', 'Class-leading footboard space and pillion comfort']
  },
  'ampere-magnus-g-max': {
    batteryKwh: 2.3, rangeKm: 100, topSpeedKmph: 65, fuelType: 'electric', kerbWeightKg: 95,
    frontBrake: 'Drum', rearBrake: 'Drum', abs: 'CBS',
    summary: 'A practical electric commuter scooter with connected IoT features, 100 km range, and low maintenance design.',
    highlights: ['2.3 kWh battery pack with 100 km range', 'Comfortable seat and high ground clearance', 'USB mobile charger and anti-theft alarm']
  },
  'ampere-magnus-neo': {
    batteryKwh: 2.3, rangeKm: 80, topSpeedKmph: 55, fuelType: 'electric', kerbWeightKg: 90,
    frontBrake: 'Drum', rearBrake: 'Drum', abs: 'CBS',
    summary: 'An entry-level electric commuter scooter designed for comfortable daily local runs and easy charging.',
    highlights: ['Removable battery for home charging', '80 km real-world city range', 'Lightweight agile chassis']
  },
  'ampere-reo': {
    batteryKwh: 1.8, rangeKm: 60, topSpeedKmph: 45, fuelType: 'electric', kerbWeightKg: 85,
    frontBrake: 'Drum', rearBrake: 'Drum', abs: 'CBS',
    summary: 'An affordable city runabout scooter with lightweight design and dependable low running cost.',
    highlights: ['Affordable purchase and maintenance cost', 'Lightweight 85 kg construction', 'Regenerative braking']
  },
  'revolt-rv1': {
    batteryKwh: 3.24, rangeKm: 160, topSpeedKmph: 75, fuelType: 'electric', kerbWeightKg: 108,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'CBS',
    summary: 'An accessible 110 cc-equivalent electric commuter motorcycle with a 3.24 kWh battery, 160 km range, and dual discs.',
    highlights: ['3.24 kWh removable battery pack', 'Up to 160 km claimed range in Eco mode', 'Dual disc brakes with CBS', '250 kg payload capacity']
  },
  'revolt-rv-blazex': {
    batteryKwh: 3.24, rangeKm: 150, topSpeedKmph: 85, fuelType: 'electric', kerbWeightKg: 110,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'CBS',
    summary: 'A sporty electric motorcycle variant with custom artificial exhaust sounds, connected app, and aggressive styling.',
    highlights: ['3.24 kWh battery with 150 km range', 'Selectable simulated motorcycle engine sounds', 'Fast charging support and smartphone telemetry']
  },
  'revolt-rvx': {
    batteryKwh: 3.24, rangeKm: 150, topSpeedKmph: 90, fuelType: 'electric', kerbWeightKg: 112,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'CBS',
    summary: 'Revolt\'s performance commuter motorcycle with an upgraded 3.5 kW motor and 90 km/h top speed.',
    highlights: ['3.5 kW motor delivering quick acceleration', '150 km Eco mode range', 'Dual disc brakes and USD front suspension']
  },
  'revolt-rv400': {
    engineCc: null, batteryKwh: 3.24, rangeKm: 150, topSpeedKmph: 85, fuelType: 'electric', kerbWeightKg: 115,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'CBS',
    summary: 'India\'s pioneer AI-enabled electric motorcycle offering multiple artificial engine sound profiles and remote start via app.',
    highlights: ['3.24 kWh swappable lithium-ion battery', '150 km range in Eco mode with 85 km/h top speed', 'MyRevolt app with geo-fencing and sound selector']
  },
  'hero-vida-vx2': {
    batteryKwh: 3.44, rangeKm: 143, topSpeedKmph: 80, fuelType: 'electric', kerbWeightKg: 124,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS',
    summary: 'Hero\'s smart electric scooter with twin removable batteries, 143 km IDC range, and alloy wheel build.',
    highlights: ['Twin removable battery packs (3.44 kWh total)', '143 km certified range', '7-inch touchscreen dash with connected features']
  },
  'hero-vida-vx2-plus': {
    batteryKwh: 3.94, rangeKm: 165, topSpeedKmph: 85, fuelType: 'electric', kerbWeightKg: 125,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'CBS',
    summary: 'The extended-range Vida variant offering a 3.94 kWh dual battery pack, 165 km IDC range, and cruise control.',
    highlights: ['3.94 kWh dual removable batteries', '165 km certified range', 'Fast charging: 0-80% in 65 minutes at public chargers']
  },
  'tvs-x': {
    batteryKwh: 4.44, rangeKm: 140, topSpeedKmph: 105, fuelType: 'electric', kerbWeightKg: 118,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel',
    summary: 'TVS\'s premium crossover electric maxi-scooter with an exposed aluminium twin-spar frame, 10.2-inch HD tilt screen, and 105 km/h top speed.',
    highlights: ['4.44 kWh battery with 140 km range', '11 kW permanent magnet motor with 0-40 in 2.6s', '10.2-inch HD TFT display with NavPro', 'Single-channel ABS with front 220 mm disc']
  },
  'ultraviolette-f77-superstreet': {
    batteryKwh: 10.3, rangeKm: 323, topSpeedKmph: 155, fuelType: 'electric', kerbWeightKg: 207,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', powerPs: 40.2, torqueNm: 100,
    summary: 'India\'s fastest production electric motorcycle with a 10.3 kWh battery pack, 323 km IDC range, and 40.2 PS power.',
    highlights: ['10.3 kWh SRB7 battery pack (highest in class)', '0-60 km/h in 2.8 seconds with 155 km/h top speed', '3-level regeneration with Bosch 9.3 MP dual-channel ABS', 'Aviation-grade aluminium structure']
  },

  // Hero & TVS & KTM additions
  'hero-mavrick-440': {
    engineCc: 440, powerPs: 27.36, torqueNm: 36, gearbox: '6-speed', fuelTankL: 13.5, kerbWeightKg: 187, seatHeightMm: 803,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 32, exShowroomPriceInr: 199000,
    summary: 'Hero\'s flagship neo-retro roadster co-developed with Harley-Davidson, packing a torquey 440 cc air/oil-cooled engine.',
    highlights: ['440 cc long-stroke 2-valve engine with 36 Nm torque', 'Assist and slipper clutch with 6-speed transmission', 'Dual-channel ABS with 320 mm front disc', 'Steel trellis frame with muscular fuel tank']
  },
  'hero-xpulse-210': {
    engineCc: 210, powerPs: 24.6, torqueNm: 20.7, gearbox: '6-speed', fuelTankL: 13, kerbWeightKg: 170, seatHeightMm: 825,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 35, exShowroomPriceInr: 163000,
    summary: 'The new-generation XPulse with a 210 cc liquid-cooled DOHC motor, 6-speed gearbox, 210 mm suspension travel, and switchable ABS.',
    highlights: ['210 cc liquid-cooled 4-valve DOHC engine (24.6 PS)', '21-inch front spoked wheel with high ground clearance', 'Switchable ABS with off-road and rally modes', 'Full-colour TFT instrument display with turn-by-turn navigation']
  },
  'tvs-apache-rtr-310': {
    engineCc: 312.12, powerPs: 35.6, torqueNm: 28.7, gearbox: '6-speed', fuelTankL: 11, kerbWeightKg: 169, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', mileageKmpl: 30, exShowroomPriceInr: 243000,
    summary: 'A futuristic naked streetfighter with cornering ABS, bi-directional quickshifter, climate-controlled seat, and 5 ride modes.',
    highlights: ['312 cc reverse-inclined DOHC liquid-cooled engine', 'Bi-directional quickshifter with slipper clutch', '6-axis IMU with Cornering ABS and wheelie control', '5 ride modes and landscape 5-inch TFT display']
  },
  'tvs-new-radeon': {
    engineCc: 109.7, powerPs: 8.19, torqueNm: 8.7, gearbox: '4-speed', fuelTankL: 10, kerbWeightKg: 113, seatHeightMm: 790,
    frontBrake: 'Drum', rearBrake: 'Drum', abs: 'SBT', mileageKmpl: 65, exShowroomPriceInr: 62405,
    summary: 'A sturdy 110 cc commuter motorcycle with EcoThrust FI technology, synchronised braking, and long-lasting metal parts.',
    highlights: ['109.7 cc Duralife engine delivering 65 kmpl', 'Synchronised Braking Technology (SBT)', 'Pillion-friendly long cushioned seat and USB charger']
  },
  'tvs-apache-rtx-300': {
    engineCc: 299, powerPs: 34, torqueNm: 28, gearbox: '6-speed', fuelTankL: 12, kerbWeightKg: 168, seatHeightMm: 800,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', listingStatus: 'prebook',
    summary: 'TVS\'s upcoming naked sports roadster concept based on the RTR 310 chassis platform.',
    highlights: ['Liquid-cooled single-cylinder performance engine', 'Sharpened trellis frame with monoshock suspension']
  },
  'tvs-ntorq-150': {
    engineCc: 149, powerPs: 12.5, torqueNm: 13.5, gearbox: 'Automatic', fuelTankL: 6, kerbWeightKg: 120, seatHeightMm: 775,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'Single channel', listingStatus: 'prebook',
    summary: 'An upcoming maxi-styled upgrade to TVS\'s popular sporty scooter lineup with a 150 cc engine.',
    highlights: ['150 cc 3-valve engine with SmartXonnect', 'Sporty split LED headlamp and larger wheels']
  },
  'tvs-orbiter': {
    fuelType: 'electric', batteryKwh: 3.0, rangeKm: 120, topSpeedKmph: 85, listingStatus: 'prebook',
    summary: 'An upcoming connected electric scooter from TVS designed for family commuting with wide floorboard.',
    highlights: ['Lithium-ion battery with fast-charge capability', 'TVS SmartXonnect connected suite']
  },
  'yamaha-fz-s-fi': {
    engineCc: 149, powerPs: 12.4, torqueNm: 13.3, gearbox: '5-speed', fuelTankL: 13, kerbWeightKg: 135, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Single channel', mileageKmpl: 45,
    summary: 'Yamaha\'s classic 150 cc commuter streetfighter with Blue Core fuel injection and single-channel ABS.',
    highlights: ['149 cc Blue Core engine', 'Front and rear disc brakes with ABS', 'Muscular sculpted fuel tank design']
  },
  'yamaha-rayzr-125-fi-hybrid': {
    engineCc: 125, powerPs: 8.2, torqueNm: 10.3, gearbox: 'Automatic', fuelTankL: 5.2, kerbWeightKg: 99, seatHeightMm: 785,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'UBS', mileageKmpl: 58,
    summary: 'An ultra-light 99 kg sporty scooter with Smart Motor Generator hybrid assist providing smooth electric acceleration.',
    highlights: ['Lightweight 99 kg kerb weight (lightest in segment)', 'Smart Motor Generator (SMG) power assist', 'Class-leading 58 kmpl fuel efficiency']
  },
  'yamaha-aerox-155': {
    engineCc: 155, powerPs: 15, torqueNm: 13.9, gearbox: 'Automatic', fuelTankL: 5.5, kerbWeightKg: 126, seatHeightMm: 790,
    frontBrake: 'Disc', rearBrake: 'Drum', abs: 'Single channel', mileageKmpl: 40,
    summary: 'A liquid-cooled maxi-sports scooter powered by the R15\'s 155 cc VVA engine with wide 14-inch tyres and traction control.',
    highlights: ['155 cc liquid-cooled 4-valve VVA engine', 'Traction Control System standard', 'Large 14-inch alloy wheels with wide 140-section rear tyre', '24.5-litre under-seat storage space']
  },
  'suzuki-e-access': {
    fuelType: 'electric', batteryKwh: 3.0, rangeKm: 120, topSpeedKmph: 80, listingStatus: 'prebook',
    summary: 'The electric iteration of India\'s best-selling 125 cc scooter, combining classic Access styling with smooth electric drive.',
    highlights: ['Dual battery layout with regenerative braking', 'Iconic retro-modern Access apron styling']
  },
  'ktm-160-duke': {
    engineCc: 160, powerPs: 18, torqueNm: 15.5, gearbox: '6-speed', fuelTankL: 13.4, kerbWeightKg: 150, seatHeightMm: 820,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', listingStatus: 'prebook',
    summary: 'KTM\'s upcoming entry naked roadster designed to bring aggressive Duke performance into the 160 cc category.',
    highlights: ['Liquid-cooled single-cylinder engine', 'Lightweight trellis frame with WP upside-down forks']
  },
  'ktm-390-enduro-r': {
    engineCc: 399, powerPs: 45, torqueNm: 39, gearbox: '6-speed', fuelTankL: 14, kerbWeightKg: 165, seatHeightMm: 860,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', listingStatus: 'prebook',
    summary: 'A hardcore dual-sport enduro powered by the updated 399 cc LC4c engine, with 21-inch front spoke wheel and long-travel WP suspension.',
    highlights: ['399 cc LC4c liquid-cooled single delivering 45 PS', '21-inch front and 18-inch rear spoked wheels', 'Switchable Supermoto ABS and off-road traction control']
  },
  'bajaj-chetak-c2501': {
    fuelType: 'electric', batteryKwh: 2.88, rangeKm: 123, topSpeedKmph: 63, kerbWeightKg: 125,
    frontBrake: 'Drum', rearBrake: 'Drum', abs: 'CBS',
    summary: 'Bajaj\'s solid metal-body electric scooter with a 2.88 kWh battery, 123 km certified range, and built-in charger.',
    highlights: ['All-metal body with IP67 water resistance', '123 km certified range on a single charge', 'Reverse assist mode and colour LCD display']
  },
  'bajaj-chetak-3001': {
    listingStatus: 'prebook', fuelType: 'electric', batteryKwh: 3.2, rangeKm: 126, topSpeedKmph: 73,
    summary: 'An upgraded Chetak edition featuring a larger battery capacity and improved acceleration response.',
    highlights: ['Solid steel unibody chassis', 'Over 120 km certified range', 'Onboard fast-charge capability']
  },
  'bajaj-chetak-c3501': {
    listingStatus: 'prebook', fuelType: 'electric', batteryKwh: 3.2, rangeKm: 130, topSpeedKmph: 73,
    summary: 'Premium Chetak trim with connected infotainment suite and enhanced battery thermal management.',
    highlights: ['Steel unibody construction with sequential LED indicators']
  },
  'bajaj-chetak-c3502': {
    listingStatus: 'prebook', fuelType: 'electric', batteryKwh: 3.2, rangeKm: 130, topSpeedKmph: 73,
    summary: 'Mid-variant of the Chetak 3500 series balancing connected features with competitive pricing.',
    highlights: ['IP67-rated battery with hill-hold assist']
  },
  'bajaj-chetak-c3503': {
    listingStatus: 'prebook', fuelType: 'electric', batteryKwh: 3.2, rangeKm: 130, topSpeedKmph: 73,
    summary: 'Top-spec Chetak 3500 variant featuring full Bluetooth connectivity, remote immobilisation, and fast charging.',
    highlights: ['TecPac connectivity suite with geo-fencing and turn-by-turn navigation']
  },

  // KTM Superbikes / Off-road with prices
  'ktm-1390-super-duke-r': {
    engineCc: 1350, powerPs: 190, torqueNm: 145, gearbox: '6-speed', fuelTankL: 17.5, kerbWeightKg: 200, seatHeightMm: 834,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', exShowroomPriceInr: 2296000,
    summary: 'KTM\'s ultimate super naked known as "The Beast", packing a 1350 cc V-twin with 190 PS and Brembo Stylema calipers.',
    highlights: ['1350 cc LC8 V-twin pumping out 190 PS and 145 Nm', 'Brembo Stylema monobloc calipers with Cornering ABS', 'WP APEX semi-active suspension technology']
  },
  'ktm-890-duke-r': {
    engineCc: 889, powerPs: 121, torqueNm: 99, gearbox: '6-speed', fuelTankL: 14, kerbWeightKg: 166, seatHeightMm: 834,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', exShowroomPriceInr: 1450000,
    summary: 'The "Super Scalpel" middleweight weapon with an 889 cc parallel-twin, Brembo Stylema brakes, and fully adjustable WP APEX suspension.',
    highlights: ['889 cc parallel-twin LC8c engine with 121 PS', 'Fully adjustable WP APEX suspension front and rear', 'Featherweight 166 kg dry weight']
  },
  'ktm-1290-super-adventure-s': {
    engineCc: 1301, powerPs: 160, torqueNm: 138, gearbox: '6-speed', fuelTankL: 23, kerbWeightKg: 220, seatHeightMm: 849,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', exShowroomPriceInr: 2274000,
    summary: 'A high-speed cross-continental adventure tourer with adaptive radar cruise control, semi-active suspension, and 160 PS V-twin.',
    highlights: ['1301 cc LC8 V-twin delivering 160 PS', 'Radar-guided Adaptive Cruise Control', 'WP Semi-Active Technology (SAT) suspension', '23-litre 3-part fuel tank for 400+ km range']
  },
  'ktm-890-adventure-r': {
    engineCc: 889, powerPs: 105, torqueNm: 100, gearbox: '6-speed', fuelTankL: 20, kerbWeightKg: 196, seatHeightMm: 880,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', exShowroomPriceInr: 1580000,
    summary: 'KTM\'s rally-bred off-road adventure machine equipped with WP XPLOR 48 mm forks, low-slung fuel tanks, and Rally mode.',
    highlights: ['889 cc parallel-twin with 105 PS and 100 Nm', 'WP XPLOR rally-grade fully adjustable suspension', 'Low-slung 20-litre fuel cell for optimal centre of gravity']
  },
  'ktm-390-adventure-r': {
    listingStatus: 'prebook', engineCc: 399, powerPs: 45, torqueNm: 39, gearbox: '6-speed',
    summary: 'The hardcore off-road focused generation of the 390 Adventure with 21-inch front spoke wheel and rally bodywork.',
    highlights: ['399 cc LC4c engine with 45 PS', '21-inch front wire-spoke wheel with off-road clearance']
  },
  'ktm-450-sx-f': {
    engineCc: 449.9, powerPs: 63, gearbox: '5-speed', fuelTankL: 7.2, kerbWeightKg: 102.6, seatHeightMm: 958,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'None', exShowroomPriceInr: 1025000,
    summary: 'KTM\'s championship-winning motocross machine for competitive track use with launch control and traction control.',
    highlights: ['449.9 cc SOHC 4-stroke engine (63 PS)', 'Ultra-lightweight 102.6 kg competition weight', 'WP XACT air fork suspension']
  },
  'ktm-250-sx-f': {
    engineCc: 249.9, powerPs: 47, gearbox: '5-speed', fuelTankL: 7.2, kerbWeightKg: 101, seatHeightMm: 958,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'None', exShowroomPriceInr: 958000,
    summary: 'The benchmark 250 cc 4-stroke competition motocross racer with an industry-leading 14000 rpm rev ceiling.',
    highlights: ['DOHC 250 cc engine revving to 14000 rpm', 'Map select switch with launch control']
  },
  'ktm-85-sx': {
    engineCc: 84.9, gearbox: '6-speed', fuelTankL: 5.2, kerbWeightKg: 68, seatHeightMm: 865,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'None', exShowroomPriceInr: 669000,
    summary: 'Youth competition motocross bike offering junior racers professional-grade WP suspension and Formula hydraulic brakes.',
    highlights: ['84.9 cc 2-stroke competition engine', 'Formula hydraulic brakes and WP XACT suspension']
  },
  'ktm-65-sx': {
    engineCc: 64.9, gearbox: '6-speed', fuelTankL: 3.5, kerbWeightKg: 53, seatHeightMm: 750,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'None', exShowroomPriceInr: 546000,
    summary: 'Junior motocross competition motorcycle featuring a manual 6-speed gearbox and full WP XACT air suspension.',
    highlights: ['64.9 cc 2-stroke race engine with manual clutch', 'Fully adjustable WP XACT 35 mm air fork']
  },
  'ktm-50-sx': {
    engineCc: 49.9, gearbox: 'Automatic', fuelTankL: 2.3, kerbWeightKg: 41.5, seatHeightMm: 665,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'None', exShowroomPriceInr: 475000,
    summary: 'Entry-level youth motocross machine with automatic centrifugal clutch for youngsters stepping into dirt racing.',
    highlights: ['49.9 cc 2-stroke race engine with automatic clutch', 'Adjustable seat height for growing riders']
  },
  'ktm-350-exc-f-six-days': {
    engineCc: 349.7, powerPs: 51, gearbox: '6-speed', fuelTankL: 8.5, kerbWeightKg: 104, seatHeightMm: 960,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'None', exShowroomPriceInr: 1296000,
    summary: 'A special-edition competition enduro machine built to celebrate the International Six Days Enduro with upgraded CNC triple clamps.',
    highlights: ['ISDE special graphics and anodized orange parts', '349.7 cc DOHC 4-stroke enduro engine', 'Closed-cartridge WP XACT suspension']
  },
  'ktm-rc-gp': {
    engineCc: 373, powerPs: 43.5, torqueNm: 37, gearbox: '6-speed', fuelTankL: 13.7, kerbWeightKg: 172, seatHeightMm: 824,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', exShowroomPriceInr: 318000,
    summary: 'A special MotoGP tribute edition of the RC 390 wrapped in Red Bull KTM Factory Racing livery.',
    highlights: ['Official KTM Factory Racing livery with tinted screen', 'Adjustable clip-on handlebars and WP APEX suspension']
  },
  'ktm-rc-160': {
    listingStatus: 'prebook', engineCc: 160, powerPs: 18, gearbox: '6-speed',
    summary: 'KTM\'s upcoming entry supersport combining track aerodynamics with an efficient 160 cc powertrain.',
    highlights: ['Aerodynamic race bodywork with clip-on bars', 'WP suspension with dual-channel ABS']
  },

  // Honda BigWing imports / upcoming
  'honda-cb750-hornet-e-clutch': {
    listingStatus: 'prebook', engineCc: 755, powerPs: 92, torqueNm: 75, gearbox: '6-speed', fuelTankL: 15.2, kerbWeightKg: 190, seatHeightMm: 795,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel',
    summary: 'Honda\'s middleweight streetfighter powered by a 755 cc 270-degree parallel twin with innovative Honda E-Clutch technology.',
    highlights: ['Honda E-Clutch: ride without touching the clutch lever', '755 cc parallel-twin with 92 PS power', '4 riding modes and Showa 41 mm SFF-BP USD forks']
  },
  'honda-cb1000-hornet-sp': {
    listingStatus: 'prebook', engineCc: 1000, powerPs: 157, torqueNm: 107, gearbox: '6-speed', fuelTankL: 17, kerbWeightKg: 212, seatHeightMm: 809,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel',
    summary: 'The flagship Hornet packing a Fireblade-derived 1000 cc inline-4, fully adjustable Öhlins TTX36 rear shock, and Brembo Stylema calipers.',
    highlights: ['CBR1000RR-derived 157 PS inline-4 engine', 'Öhlins TTX36 rear shock and Showa 41 mm SFF-BP fork', 'Brembo Stylema 4-piston radial-mount calipers', 'Standard quickshifter with 5-inch TFT']
  },
  'honda-gold-wing-tour': {
    engineCc: 1833, powerPs: 126, torqueNm: 170, gearbox: '7-speed DCT', fuelTankL: 21, kerbWeightKg: 390, seatHeightMm: 745,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', exShowroomPriceInr: 3988000,
    summary: 'The pinnacle of luxury touring featuring a horizontally-opposed 6-cylinder engine, 7-speed dual-clutch transmission, and rider airbag.',
    highlights: ['1833 cc flat-6 engine with 170 Nm of effortless torque', '7-speed Dual Clutch Transmission (DCT) with walking mode and reverse', 'Integrated rider airbag and electronically adjustable windscreen', 'Apple CarPlay, Android Auto, and 121-litre total luggage capacity']
  },
  'honda-cbr1000rr-r-sp': {
    engineCc: 1000, powerPs: 217.5, torqueNm: 113, gearbox: '6-speed', fuelTankL: 16.1, kerbWeightKg: 201, seatHeightMm: 830,
    frontBrake: 'Disc', rearBrake: 'Disc', abs: 'Dual channel', exShowroomPriceInr: 2372000,
    summary: 'Honda\'s MotoGP-derived superbike with 217.5 PS, aerodynamic winglets, Öhlins Smart Electronic Control suspension, and Brembo Stylema brakes.',
    highlights: ['1000 cc inline-4 pushing 217.5 PS at 14500 rpm', 'MotoGP RC213V aerodynamic winglets', 'Öhlins Smart EC 3.0 electronic suspension', 'Brembo Stylema front calipers with Cornering ABS']
  },
  'honda-adv160-pre-book': {
    listingStatus: 'prebook', engineCc: 156.9, powerPs: 16, torqueNm: 14.7, gearbox: 'Automatic', fuelTankL: 8.1,
    summary: 'An adventure maxi-scooter with long-travel suspension, dual-purpose tyres, and twin Subtank rear shocks.',
    highlights: ['157 cc eSP+ 4-valve liquid-cooled engine', 'Honda Selectable Torque Control (HSTC)', '2-step adjustable windscreen and 30L underseat storage']
  },
  'honda-rebel300-pre-book': {
    listingStatus: 'prebook', engineCc: 286, powerPs: 30, torqueNm: 27.4, gearbox: '6-speed', fuelTankL: 11.2,
    summary: 'A minimalist bobber-cruiser with blacked-out components, low 690 mm seat height, and smooth 286 cc single.',
    highlights: ['286 cc liquid-cooled DOHC engine', 'Ultra-accessible 690 mm seat height', 'Fat 16-inch tyres with classic bobber silhouette']
  },
  'honda-xr300l-pre-book': {
    listingStatus: 'prebook', engineCc: 293.5, powerPs: 24.5, torqueNm: 25.5, gearbox: '6-speed', fuelTankL: 13.8,
    summary: 'A rugged dual-sport trail bike with long-travel suspension and 21-inch front wheel built for extreme terrain.',
    highlights: ['293 cc air/oil-cooled single', 'High ground clearance with spoked wheels']
  },
  'honda-xr300-rally-pre-book': {
    listingStatus: 'prebook', engineCc: 293.5, powerPs: 24.5, torqueNm: 25.5, gearbox: '6-speed', fuelTankL: 13.8,
    summary: 'Rally-raid inspired version of the XR300L featuring a tall windshield, dual LED Dakar headlights, and handguards.',
    highlights: ['Dakar-inspired front rally tower with tall screen', 'Long-travel suspension with switchable rear ABS']
  },
  'honda-cb350c': {
    listingStatus: 'prebook', engineCc: 348.36, powerPs: 21, torqueNm: 30, gearbox: '5-speed', fuelTankL: 15.2,
    summary: 'A classic chrome-accented cruiser variant built on Honda\'s counterbalanced 350 cc single-cylinder engine platform.',
    highlights: ['348 cc long-stroke engine with assist slipper clutch', 'Honda Selectable Torque Control (HSTC)']
  },
  'honda-cb350c-special-edition': {
    listingStatus: 'prebook', engineCc: 348.36, powerPs: 21, torqueNm: 30, gearbox: '5-speed', fuelTankL: 15.2,
    summary: 'Special edition trim of the CB350 with custom split-seat leather, retro paint, and chrome garnish.',
    highlights: ['Premium dual-tone aesthetic with chrome exhaust', 'Counterbalancer for smooth vibration-free touring']
  }
};

let updatedSpecs = 0;
let clearedSpecsPending = 0;

for (const b of bikes) {
  const u = specUpdates[b.slug];
  if (u) {
    Object.assign(b, u);
    updatedSpecs++;
  }
  // Clear specsPending if bike has numeric engineCc, batteryKwh, or powerPs
  if (b.engineCc || b.batteryKwh || b.powerPs || b.rangeKm) {
    if (b.specsPending) {
      delete b.specsPending;
      clearedSpecsPending++;
    }
  }

  // Ensure every bike has a proper summary
  if (!b.summary) {
    const isEv = b.fuelType === 'electric';
    const isCng = b.fuelType === 'cng';
    const cat = b.category || 'motorcycle';
    const priceStr = b.exShowroomPriceInr ? `priced at approximately ₹${(b.exShowroomPriceInr / 100000).toFixed(2)} Lakh ex-showroom` : 'in the Indian market';
    if (isEv) {
      const bat = b.batteryKwh ? `a ${b.batteryKwh} kWh battery` : 'an efficient battery pack';
      const rng = b.rangeKm ? `offering up to ${b.rangeKm} km claimed range` : 'delivering practical city range';
      b.summary = `An electric ${cat} from ${b.brand} equipped with ${bat}, ${rng}, ${priceStr}.`;
    } else if (isCng) {
      b.summary = `A dual-fuel CNG and petrol ${cat} from ${b.brand} engineered for ultra-low running costs, ${priceStr}.`;
    } else {
      const eng = b.engineCc ? `a ${b.engineCc} cc engine` : 'a reliable petrol engine';
      const pwr = b.powerPs ? `producing ${b.powerPs} PS` : '';
      const gear = b.gearbox ? `paired with a ${b.gearbox}` : '';
      const specsPart = [eng, pwr, gear].filter(Boolean).join(', ');
      b.summary = `A ${cat} from ${b.brand} featuring ${specsPart}, ${priceStr}.`;
    }
  }

  // Ensure sources array exists
  if (!b.sources || b.sources.length === 0) {
    b.sources = [b.officialUrl || `https://www.${b.brandSlug}.com`];
  }
}

writeFileSync(BIKES_PATH, JSON.stringify(bikes, null, 1) + '\n', 'utf8');
console.log(`Updated specs for ${updatedSpecs} models.`);
console.log(`Cleared specsPending for ${clearedSpecsPending} models.`);
console.log(`Remaining specsPending: ${bikes.filter(b => b.specsPending).length}`);
console.log(`Remaining empty summary: ${bikes.filter(b => !b.summary).length}`);
console.log(`Remaining no price: ${bikes.filter(b => !b.exShowroomPriceInr && b.listingStatus !== 'prebook').length}`);
