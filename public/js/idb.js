let db;
const request = indexedDB.open('budgettracker', 1);
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('budget_store', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine) {
	console.log('window online');
	checkIndexdb();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['budget_store'], 'readwrite');
  const budgetObjectStore = transaction.objectStore('budget_store');
    budgetObjectStore.add(record);

function checkIndexdb() {
	const transaction = db.transaction('budget_store', 'readwrite');
	const store = transaction.objectStore('budget_store');
	const getAll = store.getAll();
        console.log(getAll);

getAll.onsuccess = function() {
	if (getAll.result.length > 0) {
		fetch('/api/transaction/bulk', {
		    method: 'POST',
				body: JSON.stringify(getAll.result),
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			})
				.then(response => response.json())
				.then(() => {
					const transaction = db.transaction([ 'budget_store' ], 'readwrite');
					const store = transaction.objectStore('budget_store');
					store.clear();
			});
		}
	};
    }

window.addEventListener('online', checkIndexdb);