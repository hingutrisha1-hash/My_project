// Simple calculator logic (inspired by MDN pattern)
const display = document.getElementById('display');
const historyEl = document.getElementById('history');
const buttons = document.querySelector('.buttons');

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  lastExpression: ''
};

function updateDisplay() {
  display.textContent = calculator.displayValue;
  historyEl.textContent = calculator.lastExpression || '';
}

function inputDigit(digit) {
  if (calculator.waitingForSecondOperand) {
    calculator.displayValue = digit === '.' ? '0.' : digit;
    calculator.waitingForSecondOperand = false;
  } else {
    if (digit === '.' && calculator.displayValue.includes('.')) return;
    calculator.displayValue = calculator.displayValue === '0' && digit !== '.' ? digit : calculator.displayValue + digit;
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(calculator.displayValue);
  if (calculator.operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (calculator.firstOperand == null && !Number.isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (calculator.operator) {
    const result = performCalculation(calculator.operator, calculator.firstOperand, inputValue);
    calculator.displayValue = `${result}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;

  // store pretty expression for history
  calculator.lastExpression = `${calculator.firstOperand} ${calculator.operator}`;
}

function performCalculation(operator, a, b) {
  switch (operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Error' : a / b;
  }
  return b;
}

function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
  calculator.lastExpression = '';
}

function deleteDigit() {
  if (calculator.waitingForSecondOperand) return;
  if (calculator.displayValue.length === 1) {
    calculator.displayValue = '0';
  } else {
    calculator.displayValue = calculator.displayValue.slice(0, -1);
  }
}

function toggleSign() {
  if (calculator.displayValue === '0') return;
  if (calculator.displayValue.startsWith('-')) {
    calculator.displayValue = calculator.displayValue.slice(1);
  } else {
    calculator.displayValue = '-' + calculator.displayValue;
  }
}

buttons.addEventListener('click', event => {
  const target = event.target;
  if (!target.matches('button')) return;

  if (target.dataset.digit !== undefined) {
    inputDigit(target.dataset.digit);
    updateDisplay();
    return;
  }

  const action = target.dataset.action;
  switch (action) {
    case 'clear':
      resetCalculator();
      updateDisplay();
      break;
    case 'delete':
      deleteDigit();
      updateDisplay();
      break;
    case 'toggle-sign':
      toggleSign();
      updateDisplay();
      break;
    case '=':
      if (calculator.operator && !calculator.waitingForSecondOperand) {
        // evaluate
        const inputValue = parseFloat(calculator.displayValue);
        const result = performCalculation(calculator.operator, calculator.firstOperand, inputValue);
        calculator.lastExpression = `${calculator.firstOperand} ${calculator.operator} ${inputValue} =`;
        calculator.displayValue = `${result}`;
        calculator.firstOperand = null;
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
        updateDisplay();
      }
      break;
    default:
      // operators (+ - * /)
      handleOperator(action);
      updateDisplay();
      break;
  }
});

// initialize
updateDisplay();