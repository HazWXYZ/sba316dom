// ==================================================
// CACHE DOM ELEMENTS
// ==================================================
// REQUIREMENT: Cache at least one element using getElementById (5%)
const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const typeSelect = document.getElementById('type');
const transactionList = document.getElementById('transactionList');
const descError = document.getElementById('descError');
const amountError = document.getElementById('amountError');

// REQUIREMENT: Cache at least one element using querySelector or querySelectorAll (5%)
const totalBalanceEl = document.querySelector('#totalBalance');
const totalIncomeEl = document.querySelector('#totalIncome');
const totalExpenseEl = document.querySelector('#totalExpense');
const filterButtons = document.querySelectorAll('.filter-btn');

// ==================================================
// DATA STORAGE
// ==================================================
let transactions = [];
let currentFilter = 'all';

// ==================================================
// BOM PROPERTIES
// ==================================================
// REQUIREMENT: Use at least two Browser Object Model (BOM) properties or methods (3%)

// BOM Property #1: window.location
console.log('App running on:', window.location.href);
console.log('Protocol:', window.location.protocol);
console.log('Host:', window.location.host);

// BOM Property #2: localStorage (used throughout for data persistence)
// Load transactions from localStorage on page load
window.addEventListener('load', () => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
        try {
            transactions = JSON.parse(saved);
            renderTransactions();
            updateBalances();
            console.log('Loaded transactions from localStorage:', transactions.length);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }
});

// ==================================================
// EVENT LISTENERS
// ==================================================
// REQUIREMENT: Register at least two different event listeners (10%)

// Event Listener #1: Form submit event
transactionForm.addEventListener('submit', handleFormSubmit);

// Event Listener #2: Filter button click events
// REQUIREMENT: Iterate over a collection of elements (10%)
filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
});

// Event Listener #3: Input validation events for DOM-based validation
// REQUIREMENT: DOM event-based validation (5%)
descriptionInput.addEventListener('input', validateDescription);
amountInput.addEventListener('input', validateAmount);

// ==================================================
// FORM VALIDATION FUNCTIONS
// ==================================================
// REQUIREMENT: Include at least one form with HTML attribute validation (5%)
// HTML validation attributes: required, minlength, maxlength, min, step

// REQUIREMENT: Include DOM event-based validation (5%)
function validateDescription(e) {
    const value = e.target.value.trim();
    if (value.length < 3 || value.length > 50) {
        // REQUIREMENT: Modify CSS classes in response to user interaction (5%)
        descriptionInput.classList.add('error');
        descError.classList.add('show');
        return false;
    } else {
        descriptionInput.classList.remove('error');
        descError.classList.remove('show');
        return true;
    }
}

function validateAmount(e) {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value <= 0) {
        amountInput.classList.add('error');
        amountError.classList.add('show');
        return false;
    } else {
        amountInput.classList.remove('error');
        amountError.classList.remove('show');
        return true;
    }
}

// ==================================================
// EVENT HANDLER FUNCTIONS
// ==================================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Additional validation check
    const isDescValid = descriptionInput.value.trim().length >= 3;
    const isAmountValid = parseFloat(amountInput.value) > 0;
    
    if (!isDescValid || !isAmountValid) {
        alert('Please fix the errors before submitting.');
        return;
    }

    // Create transaction object
    const transaction = {
        id: Date.now(),
        description: descriptionInput.value.trim(),
        amount: parseFloat(amountInput.value),
        category: categorySelect.value,
        type: typeSelect.value,
        date: new Date().toLocaleDateString()
    };

    // Add to transactions array
    transactions.push(transaction);
    
    // Save to localStorage (BOM property)
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Update UI
    renderTransactions();
    updateBalances();
    
    // Reset form and validation states
    transactionForm.reset();
    descriptionInput.classList.remove('error');
    amountInput.classList.remove('error');
    descError.classList.remove('show');
    amountError.classList.remove('show');
}

function handleFilterClick(e) {
    const filter = e.target.getAttribute('data-filter');
    currentFilter = filter;
    
    // REQUIREMENT: Modify CSS classes in response to user interaction (5%)
    // Update active button styling
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Re-render transactions with new filter
    renderTransactions();
}

// ==================================================
// RENDER FUNCTIONS
// ==================================================
function renderTransactions() {
    // Clear list
    transactionList.innerHTML = '';
    
    // Filter transactions based on current filter
    let filteredTransactions = transactions;
    if (currentFilter !== 'all') {
        filteredTransactions = transactions.filter(t => t.type === currentFilter);
    }
    
    // Show empty state if no transactions
    if (filteredTransactions.length === 0) {
        // REQUIREMENT: Create element using createElement (5%)
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        // REQUIREMENT: Modify innerHTML (10%)
        emptyDiv.innerHTML = '<p>No transactions to display.</p>';
        // REQUIREMENT: Use appendChild (5%)
        transactionList.appendChild(emptyDiv);
        return;
    }
    
    // REQUIREMENT: Use DocumentFragment for templated content (2%)
    const fragment = document.createDocumentFragment();
    
    // REQUIREMENT: Iterate over collection of elements (10%)
    filteredTransactions.forEach(transaction => {
        const li = createTransactionElement(transaction);
        fragment.appendChild(li);
    });
    
    transactionList.appendChild(fragment);
}

// REQUIREMENT: Multiple requirements demonstrated in this function
function createTransactionElement(transaction) {
    // REQUIREMENT: Create element using createElement (5%)
    const li = document.createElement('li');
    li.className = `transaction-item ${transaction.type}`;
    
    // REQUIREMENT: Modify at least one attribute (3%)
    li.setAttribute('data-id', transaction.id);
    
    // Create transaction details div
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'transaction-details';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'transaction-name';
    // REQUIREMENT: Modify text content (10%)
    nameDiv.textContent = transaction.description;
    
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'transaction-category';
    categoryDiv.textContent = `${transaction.category} • ${transaction.date}`;
    
    // REQUIREMENT: Use appendChild to add elements (5%)
    detailsDiv.appendChild(nameDiv);
    detailsDiv.appendChild(categoryDiv);
    
    // Create amount span
    const amountSpan = document.createElement('span');
    amountSpan.className = `transaction-amount ${transaction.type}`;
    const sign = transaction.type === 'income' ? '+' : '-';
    amountSpan.textContent = `${sign}$${transaction.amount.toFixed(2)}`;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTransaction(transaction.id);
    
    // REQUIREMENT: Parent-child relationships demonstrated
    li.appendChild(detailsDiv);
    li.appendChild(amountSpan);
    li.appendChild(deleteBtn);
    
    return li;
}

function deleteTransaction(id) {
    // Remove from array
    transactions = transactions.filter(t => t.id !== id);
    
    // Update localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Re-render and update balances
    renderTransactions();
    updateBalances();
}

// ==================================================
// UPDATE BALANCE DISPLAY
// ==================================================
function updateBalances() {
    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const balance = income - expense;
    
    // REQUIREMENT: Modify text content in response to user interaction (10%)
    totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
    totalBalanceEl.textContent = `$${balance.toFixed(2)}`;
    
    // REQUIREMENT: Modify style property in response to user interaction (5%)
    // Change balance color based on positive/negative/zero
    if (balance < 0) {
        totalBalanceEl.style.color = '#dc3545'; // Red for negative
    } else if (balance > 0) {
        totalBalanceEl.style.color = '#28a745'; // Green for positive
    } else {
        totalBalanceEl.style.color = '#667eea'; // Purple for zero
    }
}

// ==================================================
// PARENT-CHILD-SIBLING NAVIGATION DEMONSTRATION
// ==================================================
// REQUIREMENT: Use parent-child-sibling relationship to navigate between elements (5%)
function demonstrateNavigation() {
    const form = document.getElementById('transactionForm');
    
    // Navigate to children
    const firstChild = form.firstElementChild; // First form-row
    const lastChild = form.lastElementChild;   // Submit button
    
    // Navigate to parent
    const formParent = form.parentNode; // The form-section div
    
    // Navigate to siblings (if form had siblings)
    const nextSibling = form.nextElementSibling;
    const prevSibling = form.previousElementSibling;
    
    console.log('=== DOM Navigation Demo ===');
    console.log('Form element:', form);
    console.log('First child:', firstChild);
    console.log('Last child:', lastChild);
    console.log('Parent node:', formParent);
    console.log('Next sibling:', nextSibling);
    console.log('Previous sibling:', prevSibling);
    console.log('========================');
}

// Run navigation demo on load
demonstrateNavigation();