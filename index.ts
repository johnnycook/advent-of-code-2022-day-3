import fs from 'fs';
import readline from 'readline';

function splitInHalf(str: string): [string, string] {
  return [str.slice(0, str.length / 2), str.slice(str.length / 2)]
}

// function findMatch([inputStr, ...others]: string[]): string | undefined {
//   let matchedStr = "";

//   // No matches from the previous recursion => nothing to find
//   if(inputStr.length === 0) {
//     return;
//   }

//   const inputSet = new Set();

//   // Populate input Set
//   for(const char of inputStr) {
//     inputSet.add(char);
//   }

//   // Match chars to the Set
//   for(const char of others[0]) {
//     if(inputSet.has(char)) {

//       // Last recursion level
//       if(others.length === 1) {
//         // Return the char immediately, as there's only one. End recursion.
//         return char;
//       }

//       // Not the last recursion level, just add the char to matchedStr
//       matchedStr += char;
//     }
//   }

//   others.shift();

//   return findMatch([matchedStr, ...others])
// }

function findMatchNonRecursive(rucksacks: string[]): string {
  // Initialize matched chars
  let matchedChars = rucksacks[0];

  // Create new Set
  const inputSet = new Set();

  for(let i = 0; i < rucksacks.length -1; i++) {
    // Clear from the previous iteration
    inputSet.clear();

    // Populate with the current matched chars
    for(const char of matchedChars) {
      inputSet.add(char);
    }

     // Reset
     matchedChars = "";

    // Match chars to the Set
    for(const char of rucksacks[i+1]) {
      if(inputSet.has(char)) {
        matchedChars += char;
      }
    }
  }

  return matchedChars;
}

function getPriorityValue(char: string) {
  const code = char.charCodeAt(0);
  if(char.charCodeAt(0) < 97) {
    // 27 - 52
    return code - 38;
  }
  // 1 - 26
  return code - 96;
}

async function sumPriorities() {
  const readStream = fs.createReadStream('input.txt', 'utf-8');
  const rl = readline.createInterface({input: readStream});

  let rucksuckPriorities = 0;
  let groupsPriorities = 0;
  let group: string[] = [];

  rl.on('line', function processLine(line: string) {
    // const match = findMatch(splitInHalf(line)); // The non-recursive is better
    const match = findMatchNonRecursive(splitInHalf(line));
    if(match) {
      rucksuckPriorities += getPriorityValue(match);
    }

    group.push(line);

    if(group.length === 3) {
      // const match = findMatch(group); // The non-recursive is better
      const match = findMatchNonRecursive(group);
      if(match) {
        groupsPriorities += getPriorityValue(match);
      }
      // Reset group
      group = [];
    }
    });

    rl.on('close', function showResults() {
      console.log('Sum of rucksack priorities: ', rucksuckPriorities);
      console.log('Sum of groups priorities: ', groupsPriorities);
    })
  }


sumPriorities();