A more robust solution involves using a separate counter field to manage versioning and detect potential conflicts, ensuring data consistency.

```javascript
const db = firebase.firestore();
const docRef = db.collection('myCollection').doc('myDoc');

db.runTransaction(async transaction => {
  const docSnapshot = await transaction.get(docRef);
  if (!docSnapshot.exists) {
    throw new Error('Document does not exist!');
  }

  const currentVersion = docSnapshot.data().version || 0;
  const updatedData = {
    updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    version: currentVersion + 1
  };

  const updatedSnapshot = await transaction.get(docRef);
  if (updatedSnapshot.data().version !== currentVersion) {
      throw new Error('Concurrent update detected');
  }

  transaction.update(docRef, updatedData);
  return updatedData;
}).then(() => {
  console.log('Transaction successfully committed!');
}).catch(error => {
  console.error('Transaction failed:', error);
});
```
This approach uses a `version` field to ensure that concurrent updates are detected and handled properly, preventing potential data inconsistencies.