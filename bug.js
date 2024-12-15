The following code snippet demonstrates an uncommon error in Firebase when dealing with server timestamps and transactions.  It attempts to update a document's timestamp field within a transaction, but due to a subtle interaction with the server timestamp's internal handling, it might fail to accurately reflect the intended update time.

```javascript
const db = firebase.firestore();
const docRef = db.collection('myCollection').doc('myDoc');

db.runTransaction(async transaction => {
  const docSnapshot = await transaction.get(docRef);
  if (!docSnapshot.exists) {
    throw new Error('Document does not exist!');
  }

  const updatedData = {
    updated_at: firebase.firestore.FieldValue.serverTimestamp()
  };
  transaction.update(docRef, updatedData);
  return updatedData;
}).then(() => {
  console.log('Transaction successfully committed!');
}).catch(error => {
  console.error('Transaction failed:', error);
});
```