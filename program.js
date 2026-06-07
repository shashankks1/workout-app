const PROGRAM = {
  sequence: ['push', 'quad', 'pull', 'hinge'],

  days: {
    push: {
      id: 'push',
      name: 'Upper Push',
      tag: 'Chest · Shoulders · Triceps',
      patellaStrap: false,
      exercises: [
        { id: 'db-bench',           name: 'Dumbbell Bench Press',             sets: 4, repsTarget: '10–12', rest: 90, note: 'Elbows at 45° to body, not flared.' },
        { id: 'db-shoulder-press',  name: 'Seated DB Shoulder Press',         sets: 3, repsTarget: '10–12', rest: 75, note: "Seated. Don't force range past ears." },
        { id: 'incline-db-press',   name: 'Incline DB Press (30–45°)',        sets: 3, repsTarget: '10–12', rest: 75, note: '' },
        { id: 'cable-lateral-raise',name: 'Cable Lateral Raise',              sets: 3, repsTarget: '12–15', rest: 60, note: 'Light weight. Control is the point.' },
        { id: 'cable-pushdown',     name: 'Cable Tricep Pushdown (rope)',     sets: 3, repsTarget: '12–15', rest: 60, note: '' },
        { id: 'overhead-tricep',    name: 'Overhead Tricep Extension (cable)',sets: 2, repsTarget: '12',    rest: 60, note: '' }
      ],
      finisher: { name: 'Cybex bike — moderate effort', duration: 10 }
    },

    quad: {
      id: 'quad',
      name: 'Lower — Quad Focus',
      tag: 'Quads · Glutes · Calves · Core',
      patellaStrap: true,
      exercises: [
        { id: 'leg-press',      name: 'Leg Press',                   sets: 4, repsTarget: '12',       rest: 90, note: 'Start light. No locking knees at top.' },
        { id: 'goblet-squat',   name: 'Goblet Squat (dumbbell)',     sets: 3, repsTarget: '12',       rest: 75, note: 'Dumbbell at chest, heels slightly wider than hips.' },
        { id: 'walking-lunges', name: 'Walking Lunges (dumbbells)',  sets: 3, repsTarget: '10 / leg', rest: 75, note: '' },
        { id: 'leg-extension',  name: 'Leg Extension (machine)',     sets: 3, repsTarget: '15',       rest: 60, note: 'Light-moderate weight only, slow descent.' },
        { id: 'calf-raise-1',   name: 'Standing Calf Raise',        sets: 3, repsTarget: '15–20',    rest: 60, note: '3-second slow descent.' },
        { id: 'plank',          name: 'Plank',                       sets: 3, repsTarget: '30–45 sec',rest: 45, note: '', bodyweight: true }
      ],
      finisher: { name: 'Cybex bike — steady pace', duration: 10 }
    },

    pull: {
      id: 'pull',
      name: 'Upper Pull',
      tag: 'Back · Biceps · Rear Delts',
      patellaStrap: false,
      exercises: [
        { id: 'db-row',          name: 'Single-Arm Dumbbell Row',          sets: 4, repsTarget: '10 / arm', rest: 90, note: "Don't rotate torso. Right arm sets the weight." },
        { id: 'lat-pulldown',    name: 'Lat Pulldown (cable, wide grip)',  sets: 3, repsTarget: '12',       rest: 75, note: 'Pull to upper chest, never behind neck.' },
        { id: 'seated-cable-row',name: 'Seated Cable Row',                 sets: 3, repsTarget: '12',       rest: 75, note: '' },
        { id: 'face-pull',       name: 'Face Pull (cable, rope)',          sets: 3, repsTarget: '15',       rest: 60, note: 'Mandatory for shoulder health. Light, slow, controlled.' },
        { id: 'bicep-curl',      name: 'Dumbbell Bicep Curl',             sets: 3, repsTarget: '12',       rest: 60, note: 'Right arm lighter is fine.' },
        { id: 'hammer-curl',     name: 'Hammer Curl',                     sets: 2, repsTarget: '12',       rest: 60, note: '' }
      ],
      finisher: { name: 'Cybex bike — moderate effort', duration: 10 }
    },

    hinge: {
      id: 'hinge',
      name: 'Lower — Hip Hinge',
      tag: 'Hamstrings · Glutes · Core',
      patellaStrap: true,
      exercises: [
        { id: 'rdl',                  name: 'Romanian Deadlift (barbell)',       sets: 4, repsTarget: '10',       rest: 90, note: 'Hinge at hips, flat back, bar close to legs.' },
        { id: 'hip-thrust',           name: 'Hip Thrust (barbell or dumbbell)', sets: 3, repsTarget: '12',       rest: 75, note: 'Upper back on bench, drive through heels.' },
        { id: 'leg-curl',             name: 'Leg Curl (machine)',               sets: 3, repsTarget: '12',       rest: 60, note: '' },
        { id: 'bulgarian-split-squat',name: 'Bulgarian Split Squat',            sets: 3, repsTarget: '8 / leg',  rest: 75, note: 'Rear foot on bench. Bodyweight only Wks 1–2.' },
        { id: 'calf-raise-2',         name: 'Standing Calf Raise',              sets: 3, repsTarget: '15–20',    rest: 60, note: '3-second slow descent.' },
        { id: 'dead-bug',             name: 'Dead Bug',                         sets: 3, repsTarget: '8 / side', rest: 45, note: 'Lower back flat to floor throughout.', bodyweight: true }
      ],
      finisher: { name: 'Cybex bike — moderate effort', duration: 10 }
    }
  }
};
