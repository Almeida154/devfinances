const Modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active');
  },
};

const newTransactionBtn = document.getElementById('newTransaction');
const cancelTransactionBtn = document.getElementById('cancelTransaction');

newTransactionBtn.onclick = () => Modal.open();
cancelTransactionBtn.onclick = () => Modal.close();
