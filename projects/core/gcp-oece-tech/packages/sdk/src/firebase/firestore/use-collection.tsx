// src/firebase/firestore/use-collection.tsx
import { useState, useEffect } from 'react';
import { collection, onSnapshot, QueryConstraint, query } from 'firebase/firestore';
import { db } from '../config';

export function useCollection(path: string, ...queryConstraints: QueryConstraint[]) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        // Silently fail or set error if DB is critical
        return;
    }

    try {
        const ref = collection(db, path);
        const q = query(ref, ...queryConstraints);
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setData(docs);
          setLoading(false);
        }, (err) => {
            console.error("Firestore Error:", err);
            setError(err);
            setLoading(false);
        });
    
        return () => unsubscribe();
    } catch (e: any) {
        setError(e);
        setLoading(false);
    }
  }, [path]);

  return { data, loading, error };
}
