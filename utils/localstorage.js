const pendingOperationsKey = 'pendingOperations';

export const saveOperationLocally = (operation) => {
  const pendingOperations = JSON.parse(localStorage.getItem(pendingOperationsKey)) || [];
  pendingOperations.push(operation);
  localStorage.setItem(pendingOperationsKey, JSON.stringify(pendingOperations));
};

export const getPendingOperations = () => {
  return JSON.parse(localStorage.getItem(pendingOperationsKey)) || [];
};

export const clearPendingOperations = () => {
  localStorage.removeItem(pendingOperationsKey);
};