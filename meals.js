const MEALS = {
  target: { kcalMin: 1700, kcalMax: 1800, protein: 140, budget: 200 },

  cats: [
    {
      id: 'breakfast',
      label: 'Breakfast',
      tip: 'Boil 6 eggs on Sunday night — they keep in the fridge for 5 days and make every morning faster.'
    },
    {
      id: 'lunch',
      label: 'Lunch',
      tip: 'Make dal and a tomato-onion masala base in bulk twice a week. Most lunches assemble in under 10 min from there.'
    },
    {
      id: 'dinner',
      label: 'Dinner',
      tip: 'Evening gym means dinner is your post-workout meal. Prioritise protein here — eggs, chicken, or soy chunks.'
    },
    {
      id: 'snack',
      label: 'Snacks',
      tip: 'Keep roasted chana + peanuts in a jar. Easiest way to hit protein without cooking anything.'
    }
  ],

  items: [
    // ── BREAKFAST ────────────────────────────────────────────────────────────

    {
      cat: 'breakfast',
      name: 'Masala Omelette + 2 Rotis',
      ingredients: ['4 whole eggs', '2 whole wheat rotis', 'Onion, green chilli, tomato', '1 tsp oil · salt, pepper'],
      protein: 30, kcal: 530, cost: 40, time: 10,
      note: ''
    },
    {
      cat: 'breakfast',
      name: 'Boiled Eggs + Banana + Milk',
      ingredients: ['4 boiled eggs', '1 banana', '300ml whole milk'],
      protein: 35, kcal: 570, cost: 55, time: 0,
      note: 'Zero cooking if eggs are pre-boiled. Fastest high-protein breakfast.'
    },
    {
      cat: 'breakfast',
      name: 'Paneer Bhurji + 2 Rotis',
      ingredients: ['100g paneer (crumbled)', '2 whole wheat rotis', 'Tomato, onion, cumin, coriander', '1 tsp oil'],
      protein: 24, kcal: 520, cost: 55, time: 12,
      note: ''
    },
    {
      cat: 'breakfast',
      name: 'Egg-Poha',
      ingredients: ['60g poha (flattened rice)', '3 whole eggs (scrambled in)', 'Onion, mustard seeds, curry leaves', '1 tsp oil · salt, turmeric'],
      protein: 23, kcal: 480, cost: 35, time: 15,
      note: 'Wash and soak poha for 2 min before cooking. Scramble eggs directly into the pan.'
    },
    {
      cat: 'breakfast',
      name: 'Peanut Butter Roti + Curd',
      ingredients: ['2 whole wheat rotis', '30g peanut butter (2 tbsp)', '200ml curd'],
      protein: 21, kcal: 475, cost: 45, time: 5,
      note: 'Fastest option on busy mornings. Make rotis the night before.'
    },

    // ── LUNCH ────────────────────────────────────────────────────────────────

    {
      cat: 'lunch',
      name: 'Chicken Breast + Rice + Salad',
      ingredients: ['200g raw chicken breast', '100g cooked rice', 'Cucumber, onion, lemon (salad)', '1 tsp oil · jeera, salt, pepper'],
      protein: 50, kcal: 450, cost: 65, time: 25,
      note: 'Marinate in curd + spices 30 min, then pan-fry. Highest protein lunch.'
    },
    {
      cat: 'lunch',
      name: 'Dal + Rice + 3 Fried Eggs',
      ingredients: ['1 katori toor/moong dal (cooked)', '100g cooked rice', '3 whole eggs (fried in ghee)', 'Seasonal sabzi · 1 tsp ghee'],
      protein: 33, kcal: 545, cost: 55, time: 30,
      note: 'Standard home meal with eggs added for protein. Make double dal — use the other half at dinner.'
    },
    {
      cat: 'lunch',
      name: 'Soy Chunk Sabzi + 3 Rotis + Curd',
      ingredients: ['40g soy chunks (dry)', '3 whole wheat rotis', '200ml curd', 'Tomato-onion gravy · spices · 1 tsp oil'],
      protein: 37, kcal: 600, cost: 50, time: 20,
      note: 'Cheapest protein source — ~₹180/kg. Soak soy chunks in hot water for 10 min, squeeze out excess water, then cook.'
    },
    {
      cat: 'lunch',
      name: 'Egg Curry + 2 Rotis',
      ingredients: ['4 boiled eggs (halved)', '2 whole wheat rotis', 'Onion-tomato-curd gravy', 'Spices · 1 tsp oil'],
      protein: 33, kcal: 575, cost: 55, time: 25,
      note: 'Make a large batch of masala base (tomato-onion), refrigerate for 4 days. Assembly then takes 5 min.'
    },
    {
      cat: 'lunch',
      name: 'Paneer Stir Fry + Dal + Roti',
      ingredients: ['100g paneer (cubed)', '0.5 katori dal (cooked)', '2 whole wheat rotis', 'Capsicum, onion, garlic · 1 tsp oil'],
      protein: 28, kcal: 560, cost: 60, time: 15,
      note: ''
    },

    // ── DINNER ───────────────────────────────────────────────────────────────

    {
      cat: 'dinner',
      name: 'Scrambled Eggs + Dal + 2 Rotis',
      ingredients: ['4 whole eggs (scrambled)', '0.5 katori leftover dal', '2 whole wheat rotis', '1 tsp butter · onion, tomato'],
      protein: 33, kcal: 560, cost: 35, time: 10,
      note: 'Fastest dinner on tired days. Uses leftover dal from lunch — no extra cooking.'
    },
    {
      cat: 'dinner',
      name: 'Chicken Stir Fry + 2 Rotis',
      ingredients: ['150g raw chicken breast', '2 whole wheat rotis', 'Capsicum, onion, garlic', 'Soy sauce + spices · 1 tsp oil'],
      protein: 41, kcal: 440, cost: 60, time: 20,
      note: 'Cook on high heat, quick. Good post-workout dinner when you want something light but high protein.'
    },
    {
      cat: 'dinner',
      name: 'Moong Dal Chilla + Curd',
      ingredients: ['100g moong dal (soaked 4 hr, makes 3 chillas)', '200ml curd', 'Onion, green chilli, ginger (in batter)', '1 tsp oil'],
      protein: 29, kcal: 525, cost: 40, time: 20,
      note: 'Soak dal before leaving for the gym. Comes together fast when you get back. Crispy, filling.'
    },
    {
      cat: 'dinner',
      name: 'Rajma + 2 Rotis + 2 Boiled Eggs',
      ingredients: ['100g cooked rajma', '2 whole wheat rotis', '2 boiled eggs', 'Tomato-onion gravy · spices'],
      protein: 30, kcal: 525, cost: 40, time: 30,
      note: 'Pressure cook rajma in a big batch, freeze in portions. Defrost day-of.'
    },
    {
      cat: 'dinner',
      name: 'Soy Chunk + Vegetable Pulao',
      ingredients: ['40g soy chunks (dry)', '80g basmati rice (dry)', 'Mixed veg: peas, carrot, beans', 'Whole spices · 1 tsp oil · 150ml curd on side'],
      protein: 31, kcal: 450, cost: 45, time: 25,
      note: 'One-pot meal. Easy cleanup. Add curd on the side for extra protein and cooling effect.'
    },

    // ── SNACKS ───────────────────────────────────────────────────────────────

    {
      cat: 'snack',
      name: 'Roasted Chana + Peanuts',
      ingredients: ['40g roasted chana', '25g unsalted peanuts'],
      protein: 15, kcal: 295, cost: 20, time: 0,
      note: 'Keep a jar ready at home and at work. Best carry-anywhere snack.'
    },
    {
      cat: 'snack',
      name: '2 Boiled Eggs',
      ingredients: ['2 boiled eggs', 'Salt, pepper, squeeze of lemon'],
      protein: 12, kcal: 140, cost: 14, time: 0,
      note: 'Zero prep if pre-boiled. Boil 6 at once, refrigerate up to 5 days.'
    },
    {
      cat: 'snack',
      name: 'Dahi Bowl',
      ingredients: ['250ml full-fat curd', 'Pinch of salt + jeera, or 1 tsp honey'],
      protein: 9, kcal: 130, cost: 25, time: 0,
      note: 'Cooling, filling, and easy on the stomach. Good mid-afternoon snack.'
    },
    {
      cat: 'snack',
      name: 'Banana + Peanut Butter',
      ingredients: ['1 medium banana', '20g peanut butter (~1.5 tbsp)'],
      protein: 7, kcal: 235, cost: 22, time: 0,
      note: 'Pre-workout snack — eat 45–60 min before the gym for steady energy.'
    },
    {
      cat: 'snack',
      name: 'Milk + 2 Boiled Eggs',
      ingredients: ['300ml whole milk', '2 boiled eggs'],
      protein: 22, kcal: 325, cost: 32, time: 0,
      note: 'Highest protein snack. Good post-workout if dinner is not ready yet.'
    }
  ]
};
