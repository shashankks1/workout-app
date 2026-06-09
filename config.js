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
    // ── Upper Body ────────────────────────────────────────────────────────────
    'db-bench':            'M0tN99QgPyU', // Flat DB Bench Press | Perfect Form in 30 Seconds
    'db-shoulder-press':   'WKEl69bIGus', // Seated DB Shoulder Press | Perfect Form in 30 Seconds
    'incline-db-press':    'IyjIiR9-kBk', // Incline DB Chest Press — Short tutorial
    'cable-lateral-raise': 'ZZYpkGiPcgk', // Cable Lateral Raise — How to PROPERLY (Short)
    'face-pull':           'm_dfOvtwPpg', // Cable Rope Face Pulls — Proper Form (Short)
    'cable-pushdown':      'v2fMq8RjNBw', // Tricep Rope Pushdown — Short tutorial
    'overhead-tricep':     'NTk0Igxqcsk', // Overhead Cable Triceps Extension — The PERFECT (Short)

    // ── Core & Posterior Chain ────────────────────────────────────────────────
    'hip-thrust':           'W86oVlnLqY4', // Barbell Hip Thrust — Perfect Set Up (Short)
    'rdl':                  'OVd1pq1cAvE', // Barbell RDL Tutorial (Short)
    'back-extension':       'P489_62b8JU', // How to use the Back Extension Machine (Short)
    'cable-pull-through':   '9ujrbKo1Hw8', // Cable Pull-Through Technique Tips (Short)
    'plank':                'hoeNgjheDHk', // How to Do a Plank (Short)
    'dead-bug':             'wCg6qs5L3-U', // Dead Bug Exercise Tutorial (Short)
    'side-plank':           'sH5PiIUjDW8', // Side Plank Correct Technique (Short)

    // ── Legs ──────────────────────────────────────────────────────────────────
    'leg-press':            'nDh_BlnLCGc', // Leg Press — Perfect Technique (Short)
    'goblet-squat':         '0OWbS1WiUGU', // Goblet Squat — Proper Form (Short)
    'walking-lunges':       'jmkd8o_2A6Y', // Walking Dumbbell Lunges — Quick Form Points (Short)
    'leg-extension':        'Tae3aeJe5Ks', // Leg Extension Form Guide (Short)
    'leg-curl':             'xdbEG3xGLI8', // Seated Leg Curl Tips — The PERFECT (Short)
    'calf-raise-1':         '8sT7Ne3Kzwc', // Standing Calf Raise Tutorial (Short)
    'bulgarian-split-squat':'o7yFuIR9XVU', // Bulgarian Split Squats Made Easy (Short)

    // ── Upper Pull ────────────────────────────────────────────────────────────
    'db-row':              'aFtWSOruuhs', // Single Arm Rows — Exercise Tutorial (Short)
    'lat-pulldown':        '02Qci1-0Aao', // Wide Grip Lat Pulldown — How To (Short)
    'seated-cable-row':    '8QuMq1GMMng', // Seated Cable Row — PROPERLY (Short)
    'bicep-curl':          'YgHnvJQkfhc', // Standing DB Bicep Curls — Proper Form (Short)
    'hammer-curl':         'NyW2fT2gQhM', // Hammer Curls — Do's and Don'ts (Short)

    // ── Warmup moves ─────────────────────────────────────────────────────────
    'arm-circles':        'RN40wyH6x9o', // How To Do Arm Circles Properly (Short)
    'shoulder-rolls':     'A7kgx8gGmPA', // Shoulder Roll (Short)
    'band-pull-apart':    'qi2y-eI_kuI', // How to do a Band Pull Apart (Short)
    'cat-cow':            'MSBOBAIeLqI', // Cat Cow Exercise (Short)
    'wrist-circles':      'hIFZobrkuC8', // A Quick & Simple Wrist Warm-Up (Short)
    'childs-pose':        'CHk_NNL5cQU', // Childs Pose Stretch (Short)
    'glute-bridge-bw':    'X_IGw8U_e38', // How to do Glute Bridges with Perfect Form (Short)
    'hip-flexor-stretch': '41ReSOu0dh4', // Kneeling Hip Flexor Stretch (Short)
    'ankle-circles':      'xVUWt-Or5ks', // How to Do Ankle Circles Mobility Warm-Up (Short)
    'bird-dog-bw':        'LWdKrBi9Lks', // How to PROPERLY Do Bird Dogs (Short)
    'bw-squat':           'Qgpxx1Bxmgs', // Bodyweight Squat Tutorial (Short)
    'leg-swings':         '5uFNVJn2It0', // Quick and Effective Dynamic Leg Warm Up (Short)
    'hip-circles':        'OqR7Tl6SPLQ', // Standing Hip Circles (Short)
    'walking-lunges-bw':  'jmkd8o_2A6Y', // Walking Lunges — form reference (Short)
    'lat-stretch':        'y5kPhgcdSvo', // Cable Lat Stretchers (Short)
    'dead-hang':          '6w0d3mfz25o'  // How To Dead Hang | Jeff Nippard (Short)
  }
};
