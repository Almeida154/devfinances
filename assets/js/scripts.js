const Modal = {
  toggle() {
    document.querySelector('.modal-overlay').classList.toggle('active');
  },
};

const newTransactionBtn = document.getElementById('newTransaction');
const cancelTransactionBtn = document.getElementById('cancelTransaction');

newTransactionBtn.onclick = () => Modal.toggle();
cancelTransactionBtn.onclick = () => Modal.toggle();

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('devfinances:transactions')) || [];
  },

  set(transactions) {
    localStorage.setItem(
      'devfinances:transactions',
      JSON.stringify(transactions)
    );
  },
};

const Utils = {
  formatAmount(amount) {
    return Math.round(amount * 100);
  },

  formatDate(date) {
    var splittedDate = date.split('-');
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';
    value = String(value).replace(/\D/g, '');
    value = Number(value) / 100;
    value = value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });

    return signal + value;
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    this.all.push(transaction);
    App.reload();
  },

  remove(index) {
    this.all.splice(index, 1);
    App.reload();
  },

  income() {
    let income = 0;
    this.all.forEach((transaction) => {
      if (transaction.amount > 0) income += transaction.amount;
    });
    return income;
  },

  expense() {
    let expense = 0;
    this.all.forEach((transaction) => {
      if (transaction.amount < 0) expense += transaction.amount;
    });
    return expense;
  },

  total() {
    return this.income() + this.expense();
  },
};

const Form = {
  form: document.querySelector('#form'),

  validateFields() {
    var { description, amount, date } = this.form;
    if (
      [description.value, amount.value, date.value].every(
        (data) => data.trim() !== ''
      )
    ) {
      console.log('OK');
    } else throw new Error('Preencha todos os campos.');
  },

  clearFields() {
    const { description, amount, date } = this.form;
    description.value = '';
    amount.value = '';
    date.value = '';
  },

  formatValues() {
    let { description, amount, date } = this.form;
    amount = Utils.formatAmount(amount.value);
    date = Utils.formatDate(date.value);
    description = description.value;

    return {
      description,
      amount,
      date,
    };
  },

  save(e) {
    try {
      this.validateFields();
      const newTransaction = this.formatValues();
      Transaction.add(newTransaction);
      this.clearFields();
      Modal.toggle();
    } catch (error) {
      alert(error.message);
    }
  },
};

document.querySelector('#form').onsubmit = (e) => {
  e.preventDefault();
  Form.save(e);
};

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addDisplayTransaction(transaction, index) {
    var tr = document.createElement('tr');
    tr.dataset.id = index;
    tr.innerHTML = this.innerHTMLTransaction(transaction);
    tr.childNodes[tr.childNodes.length - 1].childNodes[1].onclick = () =>
      Transaction.remove(index);
    this.transactionsContainer.appendChild(tr);
  },

  updateDisplayBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.income()
    );
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expense()
    );
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearDisplayTransactions() {
    this.transactionsContainer.innerHTML = '';
  },

  innerHTMLTransaction(transaction) {
    var transactionType = transaction.amount > 0 ? 'income' : 'expense';
    var amount = Utils.formatCurrency(transaction.amount);
    return `
        <td class="description">${transaction.description}</td>
        <td class="${transactionType}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img
            src="assets/icons/minus.svg"
            alt="Remover transação"
            />
        </td>`;
  },
};

const App = {
  init() {
    Transaction.all.forEach((transaction, index) =>
      DOM.addDisplayTransaction(transaction, index)
    );

    DOM.updateDisplayBalance();
  },

  reload() {
    DOM.clearDisplayTransactions();
    Storage.set(Transaction.all);
    this.init();
  },
};

App.init();
