import json
import os

models_data = [
    {
        "id": "1964-mustang",
        "name": "1964 1/2 Mustang 289",
        "gen": "Gen 1 (1964-1973)",
        "specs": "4.7L V8 • 210 HP • $2,368",
        "accent": "#e60028",
        "body_color": "#c4152a",
        "stripe": "#ffffff"
    },
    {
        "id": "1969-boss-429",
        "name": "1969 Boss 429",
        "gen": "Gen 1 (1964-1973)",
        "specs": "7.0L Semi-Hemi V8 • 375 HP • $4,798",
        "accent": "#ff2a4b",
        "body_color": "#121215",
        "stripe": "#ff2a4b"
    },
    {
        "id": "1974-mustang-ii",
        "name": "1974 Mustang II King Cobra",
        "gen": "Gen 2 (1974-1978)",
        "specs": "4.9L V8 • 140 HP • $3,134",
        "accent": "#f59e0b",
        "body_color": "#b45309",
        "stripe": "#fbbf24"
    },
    {
        "id": "1987-fox-body",
        "name": "1987 Fox Body GT 5.0",
        "gen": "Gen 3 (1979-1993)",
        "specs": "5.0L High Output V8 • 225 HP • $11,853",
        "accent": "#e60028",
        "body_color": "#991b1b",
        "stripe": "#e2e8f0"
    },
    {
        "id": "1993-svt-cobra",
        "name": "1993 SVT Cobra",
        "gen": "Gen 3 (1979-1993)",
        "specs": "5.0L Cobra GT-40 V8 • 235 HP • $18,505",
        "accent": "#06b6d4",
        "body_color": "#0e7490",
        "stripe": "#38bdf8"
    },
    {
        "id": "1999-new-edge-cobra",
        "name": "1999 SVT Cobra New Edge",
        "gen": "Gen 4 (1994-2004)",
        "specs": "4.6L DOHC 32V V8 • 320 HP • $27,995",
        "accent": "#e60028",
        "body_color": "#1e293b",
        "stripe": "#e60028"
    },
    {
        "id": "2003-terminator-cobra",
        "name": "2003 SVT Terminator Cobra",
        "gen": "Gen 4 (1994-2004)",
        "specs": "4.6L Supercharged V8 • 390 HP • $34,750",
        "accent": "#ff1a3d",
        "body_color": "#09090b",
        "stripe": "#ff2a4b"
    },
    {
        "id": "2005-mustang-gt",
        "name": "2005 S197 GT",
        "gen": "Gen 5 (2005-2014)",
        "specs": "4.6L 3-Valve V8 • 300 HP • $24,995",
        "accent": "#e60028",
        "body_color": "#b91c1c",
        "stripe": "#f8fafc"
    },
    {
        "id": "2013-shelby-gt500",
        "name": "2013 Shelby GT500 200+ MPH",
        "gen": "Gen 5 (2005-2014)",
        "specs": "5.8L Trinity SC V8 • 662 HP • $54,200",
        "accent": "#3b82f6",
        "body_color": "#1e3a8a",
        "stripe": "#ffffff"
    },
    {
        "id": "2015-mustang-gt",
        "name": "2015 S550 GT 50th Anniv",
        "gen": "Gen 6 (2015-2023)",
        "specs": "5.0L Coyote Gen 2 V8 • 435 HP • $32,125",
        "accent": "#e60028",
        "body_color": "#7f1d1d",
        "stripe": "#e2e8f0"
    },
    {
        "id": "2016-shelby-gt350",
        "name": "2016 Shelby GT350 Flat-Plane",
        "gen": "Gen 6 (2015-2023)",
        "specs": "5.2L Voodoo FPC V8 • 526 HP • $47,795",
        "accent": "#f43f5e",
        "body_color": "#f8fafc",
        "stripe": "#1d4ed8"
    },
    {
        "id": "2024-dark-horse",
        "name": "2024 Dark Horse S650",
        "gen": "Gen 7 (2024-Present)",
        "specs": "5.0L Coyote Gen 4 V8 • 500 HP • $59,270",
        "accent": "#6366f1",
        "body_color": "#181829",
        "stripe": "#818cf8"
    }
]

images_dir = "assets/images/placeholders"
os.makedirs(images_dir, exist_ok=True)

for m in models_data:
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad-{m['id']}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0e"/>
      <stop offset="50%" stop-color="#14141d"/>
      <stop offset="100%" stop-color="#08080a"/>
    </linearGradient>
    <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="35%" stop-color="#d4d4d8"/>
      <stop offset="60%" stop-color="#71717a"/>
      <stop offset="100%" stop-color="#e4e4e7"/>
    </linearGradient>
    <linearGradient id="carBody-{m['id']}" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="{m['body_color']}"/>
      <stop offset="50%" stop-color="{m['accent']}"/>
      <stop offset="100%" stop-color="#0f0f14"/>
    </linearGradient>
    <linearGradient id="glowGrad-{m['id']}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{m['accent']}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
  </defs>

  <!-- Dark Atmospheric Backdrop -->
  <rect width="900" height="500" fill="url(#bgGrad-{m['id']})"/>
  <ellipse cx="450" cy="280" rx="360" ry="120" fill="url(#glowGrad-{m['id']})" filter="url(#blurFilter)"/>

  <!-- Technical Grid Lines -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    <line x1="50" y1="100" x2="850" y2="100"/>
    <line x1="50" y1="200" x2="850" y2="200"/>
    <line x1="50" y1="300" x2="850" y2="300"/>
    <line x1="50" y1="400" x2="850" y2="400"/>
    <line x1="200" y1="50" x2="200" y2="450"/>
    <line x1="450" y1="50" x2="450" y2="450"/>
    <line x1="700" y1="50" x2="700" y2="450"/>
  </g>

  <!-- Speed Track / Ground Reflection -->
  <ellipse cx="450" cy="415" rx="380" ry="25" fill="#000000" opacity="0.8"/>
  <line x1="100" y1="420" x2="800" y2="420" stroke="{m['accent']}" stroke-width="2" opacity="0.6" stroke-dasharray="16 12"/>

  <!-- Sleek Muscle Coupe Silhouette -->
  <!-- Main Body Shell -->
  <path d="M 120,380 C 135,340 180,310 240,290 C 310,265 420,240 540,250 C 660,260 740,310 780,380 Z" 
        fill="url(#carBody-{m['id']})" stroke="#3f3f46" stroke-width="2"/>
  
  <!-- Cabin & Glass Greenhouse -->
  <path d="M 280,285 C 330,240 430,215 520,225 C 570,230 630,255 670,285 Z" 
        fill="#09090b" stroke="#52525b" stroke-width="1.5" opacity="0.95"/>
  <path d="M 330,280 C 365,245 440,230 510,235 C 550,240 595,260 625,280 Z" 
        fill="#18181b" opacity="0.7"/>

  <!-- Dual Racing Stripes -->
  <path d="M 430,220 L 442,220 L 436,380 L 424,380 Z" fill="{m['stripe']}" opacity="0.85"/>
  <path d="M 454,220 L 466,220 L 460,380 L 448,380 Z" fill="{m['stripe']}" opacity="0.85"/>

  <!-- Front & Rear Aerodynamics -->
  <path d="M 115,380 L 220,380 L 210,395 L 110,395 Z" fill="#18181b" stroke="{m['accent']}" stroke-width="1"/>
  <path d="M 680,380 L 785,380 L 795,395 L 690,395 Z" fill="#18181b" stroke="{m['accent']}" stroke-width="1"/>
  <!-- Rear Spoiler Wing -->
  <path d="M 730,290 L 785,275 L 780,285 L 725,300 Z" fill="#27272a" stroke="{m['accent']}" stroke-width="1.5"/>

  <!-- Wheels & Chrome Rims -->
  <!-- Front Wheel -->
  <g transform="translate(230, 385)">
    <circle cx="0" cy="0" r="50" fill="#09090b" stroke="#27272a" stroke-width="6"/>
    <circle cx="0" cy="0" r="42" fill="#18181b" stroke="url(#chromeGrad)" stroke-width="3"/>
    <circle cx="0" cy="0" r="18" fill="#09090b" stroke="{m['accent']}" stroke-width="3"/>
    <!-- Rim Spokes -->
    <line x1="-36" y1="0" x2="36" y2="0" stroke="url(#chromeGrad)" stroke-width="2.5"/>
    <line x1="0" y1="-36" x2="0" y2="36" stroke="url(#chromeGrad)" stroke-width="2.5"/>
    <line x1="-25" y1="-25" x2="25" y2="25" stroke="url(#chromeGrad)" stroke-width="2.5"/>
    <line x1="-25" y1="25" x2="25" y2="-25" stroke="url(#chromeGrad)" stroke-width="2.5"/>
  </g>

  <!-- Rear Wheel -->
  <g transform="translate(670, 385)">
    <circle cx="0" cy="0" r="50" fill="#09090b" stroke="#27272a" stroke-width="6"/>
    <circle cx="0" cy="0" r="42" fill="#18181b" stroke="url(#chromeGrad)" stroke-width="3"/>
    <circle cx="0" cy="0" r="18" fill="#09090b" stroke="{m['accent']}" stroke-width="3"/>
    <!-- Rim Spokes -->
    <line x1="-36" y1="0" x2="36" y2="0" stroke="url(#chromeGrad)" stroke-width="2.5"/>
    <line x1="0" y1="-36" x2="0" y2="36" stroke="url(#chromeGrad)" stroke-width="2.5"/>
    <line x1="-25" y1="-25" x2="25" y2="25" stroke="url(#chromeGrad)" stroke-width="2.5"/>
    <line x1="-25" y1="25" x2="25" y2="-25" stroke="url(#chromeGrad)" stroke-width="2.5"/>
  </g>

  <!-- Headlight & Taillight Beams -->
  <polygon points="120,340 50,330 50,370 120,360" fill="#ffffff" opacity="0.25" filter="url(#blurFilter)"/>
  <polygon points="780,335 840,325 840,365 780,355" fill="{m['accent']}" opacity="0.35" filter="url(#blurFilter)"/>

  <!-- Typography / Model Badge Overlays -->
  <text x="450" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="28" fill="url(#chromeGrad)" text-anchor="middle" letter-spacing="3">{m['name'].upper()}</text>
  <text x="450" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="14" fill="{m['accent']}" text-anchor="middle" letter-spacing="4">{m['gen'].upper()}</text>
  <text x="450" y="132" font-family="monospace" font-weight="600" font-size="13" fill="#a1a1aa" text-anchor="middle" letter-spacing="1">{m['specs']}</text>
</svg>
'''
    with open(f"{images_dir}/{m['id']}.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)

print(f"Generated {len(models_data)} SVG placeholders successfully.")
