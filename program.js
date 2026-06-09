const PROGRAM = {
  // Day 4 of every 5-day cycle rotates through these in order
  rotationPool: ['pull', 'core', 'legs'],

  days: {
    upper: {
      id: 'upper',
      name: 'Upper Body',
      tag: 'Chest · Shoulders · Triceps',
      patellaStrap: false,
      warmup: [
        { id: 'arm-circles',    move: 'Arm Circles',                                detail: '20 forward, 20 backward' },
        { id: 'shoulder-rolls', move: 'Shoulder Rolls',                              detail: '15 each direction' },
        { id: 'band-pull-apart',move: 'Band Pull-Apart (or face pull, very light)',  detail: '2 × 15', note: 'Activates rear delts before pressing.' },
        { id: 'cat-cow',        move: 'Cat-Cow',                                    detail: '10 slow reps' },
        { id: 'wrist-circles',  move: 'Wrist Circles',                              detail: '20 each direction', note: 'Right elbow — warm it up before any pressing.' },
        { id: 'chest-opener',   move: 'Chest Opener',                               detail: '30 sec', note: 'Hands behind head, open elbows wide, breathe.' }
      ],
      exercises: [
        { id: 'db-bench',            name: 'Dumbbell Bench Press',              sets: 4, repsTarget: '10–12', rest: 90, note: 'Elbows at 45° to body, not flared.' },
        { id: 'db-shoulder-press',   name: 'Seated DB Shoulder Press',          sets: 3, repsTarget: '10–12', rest: 75, note: "Seated. Don't force range past ears." },
        { id: 'incline-db-press',    name: 'Incline DB Press (30–45°)',         sets: 3, repsTarget: '10–12', rest: 75, note: '' },
        { id: 'cable-lateral-raise', name: 'Cable Lateral Raise',               sets: 3, repsTarget: '12–15', rest: 60, note: 'Light weight. Control is the point.' },
        { id: 'face-pull',           name: 'Face Pull (cable, rope)',            sets: 3, repsTarget: '15',    rest: 60, note: 'Mandatory every upper day. Protects shoulders.' },
        { id: 'cable-pushdown',      name: 'Cable Tricep Pushdown (rope)',      sets: 3, repsTarget: '12–15', rest: 60, note: '' },
        { id: 'overhead-tricep',     name: 'Overhead Tricep Extension (cable)', sets: 2, repsTarget: '12',    rest: 60, note: '' }
      ],
      finisher: { name: 'Cybex bike — moderate effort', duration: 10 }
    },

    core: {
      id: 'core',
      name: 'Core & Posterior Chain',
      tag: 'Lower Back · Glutes · Core · Pelvic Stability',
      patellaStrap: false,
      warmup: [
        { id: 'cat-cow',             move: 'Cat-Cow',                       detail: '10 slow reps', note: 'Warm the spine before any loaded work.' },
        { id: 'childs-pose',         move: "Child's Pose",                   detail: '30 sec' },
        { id: 'glute-bridge-bw',     move: 'Glute Bridge (bodyweight)',      detail: '2 × 15', note: 'Drive through heels, squeeze glutes at top.' },
        { id: 'hip-flexor-stretch',  move: 'Hip Flexor Stretch (kneeling)',  detail: '30 sec each side' },
        { id: 'ankle-circles',       move: 'Ankle Circles',                  detail: '20 each direction per ankle', note: 'Right ankle especially.' },
        { id: 'bird-dog-bw',         move: 'Bird Dog (slow)',                detail: '1 × 8 each side', note: 'Lower back braced throughout.' }
      ],
      exercises: [
        { id: 'hip-thrust',        name: 'Hip Thrust (barbell or dumbbell)', sets: 4, repsTarget: '12',               rest: 75, note: 'Upper back on bench, drive through heels, full glute squeeze at top.' },
        { id: 'rdl',               name: 'Romanian Deadlift',                sets: 3, repsTarget: '10',               rest: 90, note: 'Hinge at hips, soft knees. Feel the hamstring stretch at the bottom.' },
        { id: 'back-extension',    name: 'Back Extension (hyperextension)',  sets: 3, repsTarget: '15',               rest: 60, note: 'Bodyweight. Control the descent. Squeeze glutes and lower back at top.', bodyweight: true },
        { id: 'cable-pull-through',name: 'Cable Pull-Through',               sets: 3, repsTarget: '15',               rest: 60, note: 'Rope between legs, hip hinge. Squeeze glutes hard at the top.' },
        { id: 'plank',             name: 'Plank',                            sets: 3, repsTarget: '30–45 sec',        rest: 45, note: "Posterior pelvic tilt — don't let hips sag or pike.", bodyweight: true },
        { id: 'dead-bug',          name: 'Dead Bug',                         sets: 3, repsTarget: '8 / side',         rest: 45, note: 'Lower back flat to floor throughout. Slow and controlled.', bodyweight: true },
        { id: 'side-plank',        name: 'Side Plank',                       sets: 2, repsTarget: '20–30 sec / side', rest: 45, note: '', bodyweight: true }
      ],
      finisher: { name: 'Cybex bike — easy pace', duration: 10 }
    },

    legs: {
      id: 'legs',
      name: 'Legs',
      tag: 'Quads · Hamstrings · Calves',
      patellaStrap: true,
      warmup: [
        { id: 'bw-squat',          move: 'Bodyweight Squat',             detail: '2 × 15', note: 'Slow controlled descent. Feel the knee tracking.' },
        { id: 'leg-swings',        move: 'Leg Swings (forward / back)',  detail: '10 each leg' },
        { id: 'leg-swings',        move: 'Leg Swings (side to side)',    detail: '10 each leg' },
        { id: 'hip-circles',       move: 'Hip Circles',                  detail: '20 each direction' },
        { id: 'ankle-circles',     move: 'Ankle Circles',                detail: '20 each direction per ankle', note: 'Right ankle especially.' },
        { id: 'walking-lunges-bw', move: 'Walking Lunges (bodyweight)',  detail: '10 steps', note: 'Knee tracks over toes — slow.' },
        { id: 'leg-press',         move: 'Light Leg Press (warmup set)', detail: '1 × 15 at 50% working weight', note: 'Before loading up.' }
      ],
      exercises: [
        { id: 'leg-press',             name: 'Leg Press',                   sets: 4, repsTarget: '12',       rest: 90, note: 'No locking knees at top. Patella strap on.' },
        { id: 'goblet-squat',          name: 'Goblet Squat (dumbbell)',     sets: 3, repsTarget: '12',       rest: 75, note: 'Dumbbell at chest, heels slightly wider than hips.' },
        { id: 'walking-lunges',        name: 'Walking Lunges (dumbbells)',  sets: 3, repsTarget: '10 / leg', rest: 75, note: '' },
        { id: 'leg-extension',         name: 'Leg Extension (machine)',     sets: 3, repsTarget: '15',       rest: 60, note: 'Light-moderate weight only. 3-second slow descent.' },
        { id: 'leg-curl',              name: 'Seated Leg Curl',             sets: 3, repsTarget: '12',       rest: 60, note: '' },
        { id: 'calf-raise-1',          name: 'Standing Calf Raise',         sets: 3, repsTarget: '15–20',    rest: 60, note: '3-second slow descent.' },
        { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat',       sets: 3, repsTarget: '8 / leg',  rest: 75, note: 'Rear foot on bench. Bodyweight first 2 weeks — add load slowly.' }
      ],
      finisher: { name: 'Cybex bike — steady pace', duration: 10 }
    },

    pull: {
      id: 'pull',
      name: 'Upper Pull',
      tag: 'Back · Biceps · Rear Delts',
      patellaStrap: false,
      warmup: [
        { id: 'arm-circles',    move: 'Arm Circles',    detail: '20 forward, 20 backward' },
        { id: 'shoulder-rolls', move: 'Shoulder Rolls',  detail: '15 each direction' },
        { id: 'band-pull-apart',move: 'Band Pull-Apart', detail: '2 × 15', note: 'Light cable is fine. Activates rear delts.' },
        { id: 'lat-stretch',    move: 'Lat Stretch',     detail: '30 sec each side', note: 'Hold cable stack or pole, lean away, breathe into the lat.' },
        { id: 'dead-hang',      move: 'Dead Hang',       detail: '20–30 sec', note: 'If pull-up bar available — decompresses the spine.' },
        { id: 'cat-cow',        move: 'Cat-Cow',         detail: '10 reps' }
      ],
      exercises: [
        { id: 'db-row',           name: 'Single-Arm Dumbbell Row',         sets: 4, repsTarget: '10 / arm', rest: 90, note: "Don't rotate torso. Right arm sets the weight." },
        { id: 'lat-pulldown',     name: 'Lat Pulldown (cable, wide grip)', sets: 3, repsTarget: '12',       rest: 75, note: 'Pull to upper chest. Never behind neck.' },
        { id: 'seated-cable-row', name: 'Seated Cable Row',                sets: 3, repsTarget: '12',       rest: 75, note: '' },
        { id: 'face-pull',        name: 'Face Pull (cable, rope)',          sets: 3, repsTarget: '15',       rest: 60, note: 'Mandatory. Shoulder health. Light, slow, controlled.' },
        { id: 'bicep-curl',       name: 'Dumbbell Bicep Curl',             sets: 3, repsTarget: '12',       rest: 60, note: 'Right arm lighter is fine.' },
        { id: 'hammer-curl',      name: 'Hammer Curl',                     sets: 2, repsTarget: '12',       rest: 60, note: '' }
      ],
      finisher: { name: 'Cybex bike — moderate effort', duration: 10 }
    },

    cardio: {
      id: 'cardio',
      name: 'Cardio',
      tag: 'Cybex Bike · Rowing · Walking',
      type: 'cardio',
      patellaStrap: false,
      warmup: [
        { id: 'cardio-start', move: 'Easy start', detail: 'First 5 min at 50% effort', note: "Let your heart rate rise gradually. Don't jump into intensity." }
      ],
      options: [
        { id: 'bike', name: 'Cybex Bike',     duration: '25–30 min', note: 'Zone 2 — you should be able to hold a full sentence while pedaling.' },
        { id: 'row',  name: 'Rowing Machine',  duration: '15–20 min', note: 'Good Zone 2 alternative. Keep stroke rate steady around 22–24 spm.' },
        { id: 'walk', name: 'Brisk Walk',      duration: '40+ min',   note: 'Outside if possible. No running — shin splints.' }
      ],
      exercises: [],
      finisher: null
    }
  }
};
