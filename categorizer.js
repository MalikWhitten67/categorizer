let time = performance.now();
// given category name and data in which we supply to the categorizer to use
let categories = [
  {
    name: 'test',
    data: [
      'my dog is cool',
      'my dog is nice',
      'flying cars are the new wave',
      'tesla keeps improving self driving',
      'word pairs suck',
      'emojis are a better representable way of writing text messages',
      'my dog got stuck in the cars window',
      'cats are cool',
      'cats are better than dogs',
    ],
  },
  {
    name: 'other',
    data: [
      'birds fly high',
      'fish swim in water',
      'walmart has good selective items',
      'coffee is worse than drinking soda',
      'headaches suck stop overthinking',
      'categorizer prompts are time consuming sob sobbering crying hearting lol laughing out loud',
    ],
  },
];

// Initialize an object to store word counts for each category
let wordCounts = {};

categories.forEach((category) => {
  wordCounts[category.name] = {}; // Initialize the category-specific word count object

  category.data.forEach((sentence) => {
    let words = sentence.split(' ');
    words.forEach((word) => {
      word = word.toLowerCase(); // Convert the word to lowercase for case-insensitivity

      if (wordCounts[category.name][word]) {
        wordCounts[category.name][word]++;
      } else {
        wordCounts[category.name][word] = 1;
      }
    });
  });
});

let categoryDetermined = false; // Flag to ensure category determination happens only once

function determineCategory(prompt) {
  if (categoryDetermined) return null; // Return null if already determined

  let words = prompt.split(' ');

  let categoryConfidence = {};

  categories.forEach((category) => {
    categoryConfidence[category.name] = 0;
  });

  words.forEach((w) => {
    w = w.toLowerCase(); // Convert the word to lowercase for consistency

    categories.forEach((category) => {
      if (wordCounts[category.name][w]) {
        // detrmine confidence based on how many times the word was stored
        categoryConfidence[category.name] += wordCounts[category.name][w];
      }
    });
  });

  let maxConfidence = -1;
  let categoryForPrompt = null;

  for (const categoryName in categoryConfidence) {
    if (
      categoryConfidence[categoryName] >= 5 &&
      categoryConfidence[categoryName] >= maxConfidence
    ) {
      maxConfidence = categoryConfidence[categoryName];
      categoryForPrompt = categoryName;
      return {
        cat: categoryForPrompt,
        confidence: maxConfidence,
        tokens: {
          count: categoryConfidence[categoryName],
          token_words: words,
        },
      };
    } else {
      let possiblecat = [];
      let possibleconfidence = 0;
      words.forEach((w) => {
        w = w.toLowerCase();
        if (!wordCounts[w] || wordCounts[w] > 0) {
          wordCounts[w] = 0;

          categories.forEach((c) => {
            let data = c.data;
            wordCounts[c.name][w]
              ? (possibleconfidence += wordCounts[c.name][w])
              : null;
            // we check if category has the word in its dataset if so we can find a best returned response
            if (data.find((wr) => wr.includes(w))) {
              possiblecat.push(c);
            }
          });
        }
      });
      if (possiblecat.length > 0) {
        let called = {};
        possiblecat.forEach((category) => {
          !called[category.name] ? (called[category.name] = '') : null;
        });

        if (Object.keys(called).length > 1) {
          let names = '';
          Object.keys(called).forEach((k) => {
            names += ' ' + '{' + k + '}';
          });
          return `Categories your prompt best fit's in ${names},\npredicted confidence: ${possibleconfidence},  accurate confidence: ${categoryConfidence[categoryName]}`;
        }
        return `Insufficient data for the prompt: ${prompt}\n Confidence: ${categoryConfidence[categoryName]}`;
      }
    }
  }

  categoryDetermined = true; // Set the flag to true to prevent further determinations

  return categoryForPrompt;
}

// Example usage
const prompt = 'dogs are cool';
console.log(determineCategory(prompt));

console.log(
  `\nTotal elapsed time taken: ${Math.round(performance.now() - time)}ms`
);
