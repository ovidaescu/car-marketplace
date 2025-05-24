const queueOperation = (operation) => {
  const queuedOperations = JSON.parse(localStorage.getItem('crudQueue')) || [];
  queuedOperations.push(operation);
  localStorage.setItem('crudQueue', JSON.stringify(queuedOperations));
};