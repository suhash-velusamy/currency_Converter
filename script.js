// Currency options with flags (using emoji flags for simplicity)
const currencies = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
];

// DOM elements
let fromSelect, toSelect, amountInput, resultElement, convertBtn, swapBtn;

// Initialize the application
function init() {
  fromSelect = document.getElementById('from');
  toSelect = document.getElementById('to');
  amountInput = document.getElementById('amount');
  resultElement = document.getElementById('result');
  convertBtn = document.querySelector('button');
  swapBtn = document.getElementById('swap-btn');

  populateDropdowns();
  setupEventListeners();
}

// Populate currency dropdowns
function populateDropdowns() {
  currencies.forEach(currency => {
    const option1 = createOptionElement(currency);
    const option2 = createOptionElement(currency);
    
    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });
  
  // Set default values
  fromSelect.value = 'USD';
  toSelect.value = 'INR';
}

// Create option element for select dropdown
function createOptionElement(currency) {
  const option = document.createElement('option');
  option.value = currency.code;
  option.textContent = `${currency.flag} ${currency.code} - ${currency.name}`;
  return option;
}

// Set up event listeners
function setupEventListeners() {
  if (swapBtn) {
    swapBtn.addEventListener('click', swapCurrencies);
  }
  
  if (convertBtn) {
    convertBtn.addEventListener('click', convertCurrency);
  }
  
  // Also allow conversion on Enter key press
  amountInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      convertCurrency();
    }
  });
}

// Swap the 'from' and 'to' currencies
function swapCurrencies() {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
  
  // Add animation
  swapBtn.style.transform = 'rotate(180deg)';
  setTimeout(() => {
    swapBtn.style.transform = 'rotate(0)';
  }, 300);
  
  // Convert immediately after swap if there's an amount
  if (amountInput.value) {
    convertCurrency();
  }
}

// Main conversion function
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;
  
  // Validate input
  if (!validateInput(amount)) return;
  
  // Show loading state
  showLoading(true);
  
  try {
    const exchangeRate = await getExchangeRate(from, to);
    displayResult(amount, from, to, exchangeRate);
  } catch (error) {
    displayError(error);
  } finally {
    // Reset button
    showLoading(false);
  }
}

// Validate user input
function validateInput(amount) {
  if (isNaN(amount)) {
    displayError('Please enter a valid number');
    return false;
  }
  
  if (amount <= 0) {
    displayError('Amount must be greater than zero');
    return false;
  }
  
  return true;
}

// Show/hide loading state
function showLoading(show) {
  if (show) {
    const loader = document.createElement('span');
    loader.className = 'loader';
    convertBtn.textContent = '';
    convertBtn.appendChild(loader);
    convertBtn.disabled = true;
  } else {
    convertBtn.innerHTML = 'Convert';
    convertBtn.disabled = false;
  }
}

// Display conversion result
function displayResult(amount, from, to, exchangeRate) {
  const convertedAmount = (amount * exchangeRate).toFixed(2);
  const fromCurrency = currencies.find(c => c.code === from);
  const toCurrency = currencies.find(c => c.code === to);
  
  resultElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
      <span style="font-size: 24px;">${fromCurrency.flag}</span>
      <span>${amount.toLocaleString()} ${from} =</span>
      <span style="font-size: 24px;">${toCurrency.flag}</span>
      <span style="color: var(--primary); font-weight: 700;">${convertedAmount} ${to}</span>
    </div>
    <div style="margin-top: 8px; font-size: 14px; color: var(--gray);">
      1 ${from} = ${exchangeRate.toFixed(6)} ${to}<br>
      1 ${to} = ${(1/exchangeRate).toFixed(6)} ${from}
    </div>
    <div style="margin-top: 4px; font-size: 12px; color: var(--gray); font-style: italic;">
      Rates last updated: ${new Date().toLocaleString()}
    </div>
  `;
  
  resultElement.style.display = 'block';
  resultElement.style.color = '#212529';
  resultElement.style.borderLeftColor = '#4361ee';
}

// Display error message
function displayError(message) {
  resultElement.textContent = typeof message === 'string' ? message : 'Error converting currency. Please try again.';
  resultElement.style.display = 'block';
  resultElement.style.color = '#dc3545';
  resultElement.style.borderLeftColor = '#dc3545';
  
  if (typeof message !== 'string') {
    console.error(message);
  }
}

// Get exchange rate (mock API)
async function getExchangeRate(from, to) {
  // Updated with realistic exchange rates (as of 2023)
  const mockRates = {
    USD: { 
      EUR: 0.92, 
      GBP: 0.79, 
      JPY: 150.25, 
      AUD: 1.52, 
      CAD: 1.36, 
      CHF: 0.88, 
      CNY: 7.15, 
      INR: 83.50,
      BRL: 4.92 
    },
    INR: {
      USD: 0.012,  // 1 INR = 0.012 USD
      EUR: 0.011,
      GBP: 0.0095,
      JPY: 1.80,
      AUD: 0.018,
      CAD: 0.016,
      CHF: 0.0105,
      CNY: 0.086,
      BRL: 0.059
    },
    EUR: {
      USD: 1.09,
      INR: 89.75,
      GBP: 0.86,
      JPY: 163.30,
      AUD: 1.65,
      CAD: 1.48,
      CHF: 0.96,
      CNY: 7.77,
      BRL: 5.35
    },
    // Add more currencies as needed...
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  // Check if we have a direct rate
  if (mockRates[from] && mockRates[from][to]) {
    return mockRates[from][to];
  } 
  // Check if we have an inverse rate
  else if (mockRates[to] && mockRates[to][from]) {
    return 1 / mockRates[to][from];
  } 
  // Fallback: try to find a path through USD
  else if (from !== 'USD' && to !== 'USD' && mockRates[from] && mockRates[from]['USD'] && mockRates['USD'] && mockRates['USD'][to]) {
    return mockRates[from]['USD'] * mockRates['USD'][to];
  }
  // Final fallback
  else {
    return 1.5;
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);