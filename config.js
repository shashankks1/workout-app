// Video IDs are pre-loaded here (safe to be public).
// The GitHub token is NOT stored here — enter it once in Settings and it saves to your browser.
const CONFIG = {
  github: {
    token: '',
    owner: 'shashankks1',
    repo:  'workout-logs'
  },

  // YouTube Shorts / under-60s videos — one per exercise
  videoIds: {
    // ── Upper Push ────────────────────────────────────────────────────────────
    'db-bench':            'M0tN99QgPyU', // Flat DB Bench Press | Perfect Form in 30 Seconds
    'db-shoulder-press':   'WKEl69bIGus', // Seated DB Shoulder Press | Perfect Form in 30 Seconds
    'incline-db-press':    'IyjIiR9-kBk', // Incline DB Chest Press — Short tutorial
    'cable-lateral-raise': 'ZZYpkGiPcgk', // Cable Lateral Raise — How to PROPERLY (Short)
    'cable-pushdown':      'v2fMq8RjNBw', // Tricep Rope Pushdown — Short tutorial
    'overhead-tricep':     'NTk0Igxqcsk', // Overhead Cable Triceps Extension — The PERFECT (Short)

    // ── Lower Quad ────────────────────────────────────────────────────────────
    'leg-press':           'nDh_BlnLCGc', // Leg Press — Perfect Technique (Short)
    'goblet-squat':        '0OWbS1WiUGU', // Goblet Squat — Proper Form (Short)
    'walking-lunges':      'jmkd8o_2A6Y', // Walking Dumbbell Lunges — Quick Form Points (Short)
    'leg-extension':       'Tae3aeJe5Ks', // Leg Extension Form Guide (Short)
    'calf-raise-1':        '8sT7Ne3Kzwc', // Standing Calf Raise Tutorial (Short)
    'plank':               'hoeNgjheDHk', // How to Do a Plank (Short)

    // ── Upper Pull ────────────────────────────────────────────────────────────
    'db-row':              'aFtWSOruuhs', // Single Arm Rows — Exercise Tutorial (Short)
    'lat-pulldown':        '02Qci1-0Aao', // Wide Grip Lat Pulldown — How To (Short)
    'seated-cable-row':    '8QuMq1GMMng', // Seated Cable Row — PROPERLY (Short)
    'face-pull':           'm_dfOvtwPpg', // Cable Rope Face Pulls — Proper Form (Short)
    'bicep-curl':          'YgHnvJQkfhc', // Standing DB Bicep Curls — Proper Form (Short)
    'hammer-curl':         'NyW2fT2gQhM', // Hammer Curls — Do's and Don'ts (Short)

    // ── Lower Hip Hinge ───────────────────────────────────────────────────────
    'rdl':                  'OVd1pq1cAvE', // Barbell RDL Tutorial (Short)
    'hip-thrust':           'W86oVlnLqY4', // Barbell Hip Thrust — Perfect Set Up (Short)
    'leg-curl':             'xdbEG3xGLI8', // Seated Leg Curl Tips — The PERFECT (Short)
    'bulgarian-split-squat':'o7yFuIR9XVU', // Bulgarian Split Squats Made Easy (Short)
    'calf-raise-2':         '8sT7Ne3Kzwc', // Standing Calf Raise — same as Day 2 (Short)
    'dead-bug':             'wCg6qs5L3-U'  // Dead Bug Exercise Tutorial (Short)
  }
};
