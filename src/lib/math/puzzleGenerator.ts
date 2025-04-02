interface MathPuzzle {
  question: string;
  answer: number;
  difficulty: "easy" | "medium" | "hard";
}

const generateNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const roundToDecimals = (num: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

const operators = ["+", "-", "*", "/"];
const quantumOperators = ["√", "^2", "log", "!"];

const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

const generateNormalPuzzle = (
  difficulty: "easy" | "medium" | "hard"
): MathPuzzle => {
  let a: number, b: number, operator: string;

  switch (difficulty) {
    case "easy":
      a = generateNumberInRange(1, 20);
      b = generateNumberInRange(1, 20);
      operator = operators[generateNumberInRange(0, 1)]; // Only + and -
      break;
    case "medium":
      a = generateNumberInRange(10, 50);
      b = generateNumberInRange(2, 12);
      operator = operators[generateNumberInRange(0, 2)]; // +, -, and *
      break;
    case "hard":
      a = generateNumberInRange(20, 100);
      b = generateNumberInRange(2, 20);
      operator = operators[generateNumberInRange(0, 3)]; // All operators
      break;
    default:
      throw new Error("Invalid difficulty");
  }

  let answer: number;
  switch (operator) {
    case "+":
      answer = a + b;
      break;
    case "-":
      answer = a - b;
      break;
    case "*":
      answer = a * b;
      break;
    case "/":
      // Ensure division results in a whole number
      answer = b;
      a = answer * generateNumberInRange(1, 10);
      break;
    default:
      throw new Error("Invalid operator");
  }

  return {
    question: `Solve: ${a} ${operator} ${b}`,
    answer,
    difficulty,
  };
};

const generateQuantumPuzzle = (
  difficulty: "easy" | "medium" | "hard"
): MathPuzzle => {
  let num: number, operator: string;

  switch (difficulty) {
    case "easy":
      num = generateNumberInRange(2, 10);
      operator = quantumOperators[generateNumberInRange(0, 1)]; // √ and ^2
      break;
    case "medium":
      num = generateNumberInRange(5, 15);
      operator = quantumOperators[generateNumberInRange(0, 2)]; // √, ^2, and log
      break;
    case "hard":
      num = generateNumberInRange(3, 8);
      operator = quantumOperators[generateNumberInRange(0, 3)]; // All quantum operators
      break;
    default:
      throw new Error("Invalid difficulty");
  }

  let answer: number;
  let question: string;

  switch (operator) {
    case "√":
      answer = num;
      question = `Find x: x² = ${num * num}`;
      break;
    case "^2":
      question = `Calculate: ${num}²`;
      answer = num * num;
      break;
    case "log":
      answer = num;
      question = `Solve for x: 2^x = ${Math.pow(2, num)}`;
      break;
    case "!":
      question = `Calculate: ${num}!`;
      answer = factorial(num);
      break;
    default:
      throw new Error("Invalid quantum operator");
  }

  return {
    question,
    answer,
    difficulty,
  };
};

export const generateMathPuzzle = (
  isQuantum: boolean,
  score: number = 0
): MathPuzzle => {
  // Determine difficulty based on score
  let difficulty: "easy" | "medium" | "hard";

  if (score < 300) difficulty = "easy";
  else if (score < 700) difficulty = "medium";
  else difficulty = "hard";

  return isQuantum
    ? generateQuantumPuzzle(difficulty)
    : generateNormalPuzzle(difficulty);
};
