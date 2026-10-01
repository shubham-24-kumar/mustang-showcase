# 🐎 Ford Mustang Showcase (1964–Present)

An interactive, responsive single-page web experience commemorating six decades of the legendary American pony car. Built with semantic HTML5, modern CSS3 (dark theme with crimson and brushed chrome accents), vanilla JavaScript ES6+, and GSAP (GreenSock Animation Platform) with ScrollTrigger.

---

## 📁 Project Directory Structure

```plaintext
mustang-showcase/
├── index.html                   # Core single-page application structure & semantic markup
├── models.json                  # Canonical dataset of Mustang generations, specs, audio & pricing
├── README.md                    # Project documentation & Launch Price Verification Audit
└── assets/
    ├── css/
    │   ├── variables.css        # Color tokens (reds, dark metallics, chrome gradients), typography, spacing
    │   ├── main.css             # Base styles, reset, container utilities, custom scrollbar
    │   ├── hero.css             # Fullscreen hero layout, parallax layers, stats ticker
    │   ├── timeline.css         # 1964-to-present timeline layout, generation progress scrub
    │   ├── cards.css            # Dynamic model cards, filter/sort controls, spec tags
    │   ├── sound.css            # Sound section, audio player, canvas waveform visualizer, tachometer
    │   └── compare.css          # Side-by-side vehicle comparison matrix, stat delta bars
    ├── js/
    │   ├── app.js               # Entry point: bootstrapping modules & GSAP ScrollTrigger init
    │   ├── data-loader.js       # Asynchronous fetch & validation for models.json
    │   ├── timeline.js          # Interactive generation timeline navigation & scrub
    │   ├── model-cards.js       # Dynamic rendering, filtering (generation/category) & sorting
    │   ├── audio-visualizer.js  # Web Audio API engine: real audio playback, canvas waveform & synth fallback
    │   ├── compare.js           # Side-by-side vehicle comparison engine & stat winner highlighting
    │   └── animations.js        # GSAP animations: hero reveal, scroll triggers, card hover glows
    ├── data/
    │   └── models.json          # Mirrored copy of dataset for asset organization
    ├── images/                  # Vehicle image placeholders (WebP/SVG)
    │   ├── 1964-mustang.webp
    │   ├── 1969-boss-429.webp
    │   ├── 1974-mustang-ii.webp
    │   ├── 1987-fox-body.webp
    │   ├── 1993-svt-cobra.webp
    │   ├── 1999-new-edge-cobra.webp
    │   ├── 2003-terminator-cobra.webp
    │   ├── 2005-mustang-gt.webp
    │   ├── 2013-shelby-gt500.webp
    │   ├── 2015-mustang-gt.webp
    │   ├── 2016-shelby-gt350.webp
    │   └── 2024-dark-horse.webp
    └── audio/                   # Exhaust roar audio placeholders (MP3)
        ├── 1964-mustang-289.mp3
        ├── 1969-boss-429.mp3
        ├── 1974-mustang-ii.mp3
        ├── 1987-mustang-50.mp3
        ├── 1993-svt-cobra.mp3
        ├── 1999-svt-cobra.mp3
        ├── 2003-terminator-cobra.mp3
        ├── 2005-mustang-gt.mp3
        ├── 2013-shelby-gt500.mp3
        ├── 2015-mustang-gt.mp3
        ├── 2016-shelby-gt350.mp3
        └── 2024-dark-horse.mp3
```

---

## 🔍 Launch Price Verification Audit

Automotive launch prices from period literature, dealer window stickers (Monroney labels), and marketing collateral often differ significantly due to:
1. **Base Standard Engine vs Optioned V8**: Base MSRPs usually reflect entry 6-cylinder models, whereas enthusiasts associate models with V8 trims.
2. **Body Styles**: Hardtop coupes vs fastbacks vs convertibles vary by $300 to $5,000+ depending on the decade.
3. **Mandatory Fees**: Destination charges, freight, gas-guzzler taxes (PZEV/EPA), and dealer markup (ADM).
4. **Inflation Shift**: A $2,368 car in 1964 equates to approximately $23,500+ in modern purchasing power.

The table below lists each model included in `models.json`, its current listed launch price, and the specific historical figures requiring verification:

| Model | Gen | Listed Launch MSRP | Verification Status | Historical Invoices & Discrepancies to Verify | Recommended Verification Source |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **1964½ Mustang Hardtop** | 1 | `$2,368` | ⚠️ **Needs Verification** | The widely published promotional price was **$2,368** for the base 170 cid Thriftpower inline-6 hardtop. Upgrading to the iconic **289 V8 (F-code/D-code)** with a 4-speed manual brought window stickers to **$2,690 – $2,850**. Convertible base was **$2,614**. | *Ford Media Heritage Archives*, *Standard Catalog of Mustang (Brad Bowling)* |
| **1969 Boss 429** | 1 | `$4,798` | ⚠️ **Needs Verification** | Kar Kraft NASCAR homologation cars varied by production batch. Base 1969 Mustang SportsRoof was ~$2,740; the Boss 429 option package (Code KK) was a $1,208 to $1,800 surcharge, yielding retail invoices between **$4,798 and $4,925**. | *Kar Kraft Production Records*, *Hagerty Historical Valuation Guide* |
| **1974 Mustang II Mach 1** | 2 | `$3,134` | ⚠️ **Needs Verification** | Base 1974 notchback coupe started at **$3,134**. However, the Mach 1 hatchback listed at **$3,674**, and the subsequent V8 King Cobra package (1978) climbed above **$5,300**. Clarify whether base coupe or Mach 1 trim is preferred. | *Motor Trend October 1973 Road Test*, *Ford 1974 Sales Brochure* |
| **1987 Mustang GT 5.0L** | 3 | `$11,853` | ⚠️ **Needs Verification** | Hatchback GT base MSRP was **$11,853** (before destination). The convertible GT debuted at **$15,724**. Significant dealer markups over sticker were recorded across dealerships during the aero nose refresh. | *Car and Driver (April 1987 Comparison)*, *Ford Division Price Lists* |
| **1993 SVT Cobra** | 3 | `$18,505` | ⚠️ **Needs Verification** | Ford SVT listed base coupe MSRP at **$18,505**. With option Package 250A (power equipment, flip-up sunroof, CD player), sticker price rose to **$20,290**. Limited run Cobra R (race model) launched at **$25,692**. | *SVT Official Certificate Records*, *SVTOA Documentation* |
| **1999 SVT Cobra "New Edge"** | 4 | `$27,995` | ⚠️ **Needs Verification** | Base coupe launch was **$27,995**; convertible was **$31,995**. Some early window stickers reflected horsepower recall adjustments and intake manifold updates. | *NHTSA / Ford Customer Satisfaction Service Bulletin 99B27* |
| **2003 SVT Cobra "Terminator"** | 4 | `$34,750` | ⚠️ **Needs Verification** | Coupe launch MSRP started at **$34,750**; convertible launched at **$38,995** (excluding $625 destination and $1,000 gas guzzler tax). Total delivered window price was ~$36,375. | *Iron Fist, Lead Foot (Frank Moriarty)*, *SVTOA Heritage Guide* |
| **2005 Mustang GT (S197)** | 5 | `$24,995` | ⚠️ **Needs Verification** | Base V6 started at **$19,410**. The GT Deluxe coupe MSRP was **$24,995**, while the GT Premium coupe was **$26,330**. Confirm whether Deluxe or Premium sticker should be the reference price. | *Ford Motor Company Press Release (Oct 2004)* |
| **2013 Shelby GT500** | 5 | `$54,200` | ⚠️ **Needs Verification** | Base MSRP was **$54,200**. Adding the SVT Performance Package ($3,495), SVT Track Package ($2,995), and Electronics Package brought real-world delivered stickers to **$64,000+**. | *Shelby American Registry*, *Motor Trend 2013 First Test* |
| **2015 Mustang GT (S550)** | 6 | `$32,125` | ⚠️ **Needs Verification** | Entry V6 started at **$23,800**; 2.3L EcoBoost at **$25,170**; base GT Fastback (300A) was **$32,125**; GT Premium (400A) was **$36,125**. | *Ford Order Guide 2015MY (May 2014)* |
| **2016 Shelby GT350** | 6 | `$47,795` | ⚠️ **Needs Verification** | Base launch MSRP was **$47,795** plus $900 destination and $1,300 gas guzzler tax ($49,995 total). GT350R launched at **$61,295** ($63,495 delivered), with extreme dealer markups reaching $20k+ over MSRP. | *Ford Performance Press Release*, *Car and Driver GT350 First Drive* |
| **2024 Mustang Dark Horse** | 7 | `$59,270` | ⚠️ **Needs Verification** | Base Dark Horse Coupe began at **$59,270** (Dark Horse Premium started at **$63,265**). Destination and delivery added **$1,595**, plus a **$1,300** gas guzzler tax on manual transmission models ($62,165 effective sticker). Base EcoBoost is **$30,920**; base GT is **$42,495**. | *2024 Ford Mustang Order Guide & Window Stickers* |

---

## 🚀 Key Architectural Highlights

1. **GSAP & ScrollTrigger Animation Pipeline**:
   - Hero entrance sequence with split headline text and chrome metallic shimmer.
   - Smooth generation timeline scrub with responsive progress track.
   - Dynamic cards with 3D tilt hover physics and crimson glow borders.

2. **Web Audio API & Synthetic Exhaust Engine**:
   - Includes real-time `<canvas>` audio waveform visualizer.
   - Features a **pure Web Audio API synthesis fallback**: Even when external `.mp3` files are loading or placeholder-only, clicking any model's "Roar" button synthesizes an authentic V8 harmonic rumble at the model's actual idle and peak redline RPM!

3. **Live Side-by-Side Comparison Engine**:
   - Compare any two Mustang models across horsepower, launch price, displacement, acceleration, and power-to-weight ratio.
   - Visual delta bars highlight the winner dynamically with green/crimson gradient accents.

4. **Zero-Build Vanilla Execution**:
   - Runs out of the box in modern browsers without complex bundlers or Node dependencies.
   - Easily served via Python or any static web server:
     ```bash
     python -m http.server 8000
     ```
