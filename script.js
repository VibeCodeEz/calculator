// Global variables
let memory = 0;
let isDegreeMode = false;
let lastResult = null;
let currentTheme = 'dark';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Theme buttons
  document.getElementById('theme-dark').addEventListener('click', () => setTheme('dark'));
  document.getElementById('theme-light').addEventListener('click', () => setTheme('light'));
  
  // Mode buttons
  document.getElementById('basic-mode').addEventListener('click', () => setMode('basic'));
  document.getElementById('scientific-mode').addEventListener('click', () => setMode('scientific'));
  
  // Degree/Radian buttons
  document.getElementById('rad-mode').addEventListener('click', () => setAngleMode('rad'));
  document.getElementById('deg-mode').addEventListener('click', () => setAngleMode('deg'));
  
  // Add animation to all buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
      this.classList.add('btn-animation');
      setTimeout(() => {
        this.classList.remove('btn-animation');
      }, 200);
    });
  });
});

// Theme switcher
function setTheme(theme) {
  currentTheme = theme;
  
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.getElementById('theme-light').classList.add('active');
    document.getElementById('theme-dark').classList.remove('active');
  } else {
    document.body.classList.remove('light-theme');
    document.getElementById('theme-dark').classList.add('active');
    document.getElementById('theme-light').classList.remove('active');
  }
}

// Mode switcher
function setMode(mode) {
  if (mode === 'basic') {
    document.getElementById('basic-buttons').classList.add('active');
    document.getElementById('scientific-buttons').classList.remove('active');
    document.getElementById('basic-mode').classList.add('active');
    document.getElementById('scientific-mode').classList.remove('active');
  } else {
    document.getElementById('scientific-buttons').classList.add('active');
    document.getElementById('basic-buttons').classList.remove('active');
    document.getElementById('scientific-mode').classList.add('active');
    document.getElementById('basic-mode').classList.remove('active');
  }
}

// Angle mode switcher
function setAngleMode(mode) {
  if (mode === 'deg') {
    isDegreeMode = true;
    document.getElementById('deg-mode').classList.add('active');
    document.getElementById('rad-mode').classList.remove('active');
  } else {
    isDegreeMode = false;
    document.getElementById('rad-mode').classList.add('active');
    document.getElementById('deg-mode').classList.remove('active');
  }
}

// Basic calculator functions
function append(value) {
  const display = document.getElementById('display');
  
  // Handle special cases for better usability
  if (display.value === 'Error' || display.value === 'Infinity' || display.value === 'NaN') {
    display.value = '';
  }
  
  // If the last calculation was performed, clear the display for a new calculation
  if (lastResult !== null && ['+', '-', '*', '/', '**', '('].indexOf(value) === -1) {
    if (!'0123456789.'.includes(value)) {
      display.value = lastResult;
    } else {
      display.value = '';
      lastResult = null;
    }
  }
  
  // Handle constants like PI and E better
  if (value === 'Math.PI') {
    display.value += 'π';
    return;
  } else if (value === 'Math.E') {
    display.value += 'e';
    return;
  }
  
  display.value += value;
}

function clearDisplay() {
  document.getElementById('display').value = '';
  document.getElementById('history').textContent = '';
  lastResult = null;
}

function deleteLast() {
  const display = document.getElementById('display');
  display.value = display.value.slice(0, -1);
}

function toggleSign() {
  const display = document.getElementById('display');
  if (display.value !== '') {
    // Try to evaluate first to handle expressions
    try {
      let value = evaluateExpression(display.value);
      display.value = (-value).toString();
    } catch (e) {
      // If evaluation fails, just add a negative sign at the beginning
      if (display.value.charAt(0) === '-') {
        display.value = display.value.substring(1);
      } else {
        display.value = '-' + display.value;
      }
    }
  }
}

function percentage() {
  const display = document.getElementById('display');
  try {
    let value = evaluateExpression(display.value);
    display.value = (value / 100).toString();
  } catch (e) {
    display.value = 'Error';
  }
}

// Scientific calculator functions
function calculateFunction(func) {
  const display = document.getElementById('display');
  let value;
  
  try {
    value = evaluateExpression(display.value);
    
    switch (func) {
      case 'sqrt':
        if (value < 0) throw new Error('Cannot calculate square root of a negative number');
        value = Math.sqrt(value);
        display.value = value;
        break;
      case 'sin':
        value = isDegreeMode ? Math.sin(value * Math.PI / 180) : Math.sin(value);
        display.value = value;
        break;
      case 'cos':
        value = isDegreeMode ? Math.cos(value * Math.PI / 180) : Math.cos(value);
        display.value = value;
        break;
      case 'tan':
        value = isDegreeMode ? Math.tan(value * Math.PI / 180) : Math.tan(value);
        display.value = value;
        break;
      case 'asin':
        if (value < -1 || value > 1) throw new Error('Domain error');
        value = isDegreeMode ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
        display.value = value;
        break;
      case 'acos':
        if (value < -1 || value > 1) throw new Error('Domain error');
        value = isDegreeMode ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
        display.value = value;
        break;
      case 'atan':
        value = isDegreeMode ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
        display.value = value;
        break;
      case 'log':
        if (value <= 0) throw new Error('Cannot calculate logarithm of a non-positive number');
        value = Math.log10(value);
        display.value = value;
        break;
      case 'ln':
        if (value <= 0) throw new Error('Cannot calculate natural logarithm of a non-positive number');
        value = Math.log(value);
        display.value = value;
        break;
      case 'x2':
        value = Math.pow(value, 2);
        display.value = value;
        break;
      case 'x3':
        value = Math.pow(value, 3);
        display.value = value;
        break;
      case '1/x':
        if (value === 0) throw new Error('Cannot divide by zero');
        value = 1 / value;
        display.value = value;
        break;
      case 'abs':
        value = Math.abs(value);
        display.value = value;
        break;
      case '10^x':
        value = Math.pow(10, value);
        display.value = value;
        break;
    }
    
    updateHistory(`${func}(${display.value}) = ${value}`);
    lastResult = value;
    
  } catch (e) {
    display.value = 'Error';
    console.error(e);
  }
}

// Memory functions
function memoryClear() {
  memory = 0;
  document.getElementById('memory-indicator').classList.add('hidden');
}

function memoryRecall() {
  document.getElementById('display').value = memory;
}

function memoryAdd() {
  try {
    const display = document.getElementById('display');
    const value = evaluateExpression(display.value);
    memory += value;
    document.getElementById('memory-indicator').classList.remove('hidden');
  } catch (e) {
    document.getElementById('display').value = 'Error';
  }
}

function memorySubtract() {
  try {
    const display = document.getElementById('display');
    const value = evaluateExpression(display.value);
    memory -= value;
    document.getElementById('memory-indicator').classList.remove('hidden');
  } catch (e) {
    document.getElementById('display').value = 'Error';
  }
}

// Helper function to evaluate expressions safely
function evaluateExpression(expr) {
  // Replace π and e with their respective values
  expr = expr.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
  
  // Handle factorial operator
  if (expr.includes('!')) {
    const parts = expr.split('!');
    const num = evaluateExpression(parts[0]);
    
    if (num < 0 || !Number.isInteger(num)) throw new Error('Factorial is only defined for non-negative integers');
    
    const result = factorial(num);
    return result * (parts[1] ? evaluateExpression(parts[1]) : 1);
  }
  
  // Use Function constructor instead of eval for better security
  try {
    return Function('"use strict"; return (' + expr + ')')();
  } catch (e) {
    throw new Error('Invalid expression');
  }
}

// Factorial implementation
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity; // JavaScript can't represent larger factorials accurately
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Main calculation function
function calculate() {
  const display = document.getElementById('display');
  const expression = display.value;
  
  if (expression === '') return;
  
  try {
    // Save the expression to history
    updateHistory(expression);
    
    // Handle special constants
    let processedExpr = expression.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
    
    // Handle factorial operator if present
    if (processedExpr.includes('!')) {
      display.value = evaluateExpression(processedExpr);
    } else {
      // Evaluate the expression
      display.value = evaluateExpression(processedExpr);
    }
    
    // Store this result for potential use in the next calculation
    lastResult = parseFloat(display.value);
    
  } catch (e) {
    display.value = 'Error';
    console.error(e);
  }
}

// Update calculation history
function updateHistory(expression) {
  const history = document.getElementById('history');
  history.textContent = expression;
}