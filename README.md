# categorizer
A basic text categorizer using ai techniques to determine a best fit category for the given prompt

# How it works
We specifiy categories and data for each category, this is used to best categorize your prompts.

```js
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
    data: ['birds fly high', 'fish swim in water'],
  },
];
```

We then calculate how many times the word was used throughout the categories

```js
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
```
Finally we determine the category your prompt is tied to based on wordcount confidence and if it can not be determined check if possible that we can calculate the possible confidence.

let maxConfidence = -1;
  let categoryForPrompt = null;

  for (const categoryName in categoryConfidence) {
    console.log(categoryConfidence[categoryName]);
    if (categoryConfidence[categoryName] > 3) {
      maxConfidence = categoryConfidence[categoryName];
      categoryForPrompt = categoryName;
      return {
        cat: categoryForPrompt,
        confidence: maxConfidence,
      };
    } else {
      // we want to know if its possible to get the category in which has the similar words used in the prompt, 
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
      // We check if their are any possible categories - if there are any, we want to set them in an object to then be placed inside of a string - we then return them and the confidence
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
          return `Categories your prompt best fit's in ${names},\npossibility confidence: ${possibleconfidence},  actual rating ${categoryConfidence[categoryName]}`;
        }
      return `Insufficient data for the prompt: ${prompt}\n Confidence: ${categoryConfidence[categoryName]}`;
    }
  }

  categoryDetermined = true; // Set the flag to true to prevent further determinations

  return categoryForPrompt;
}
