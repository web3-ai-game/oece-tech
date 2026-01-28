// src/firebase/firestore/use-doc.tsx
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config';

export function useDoc(path: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }

    try {
        const ref = doc(db, path);
        const unsubscribe = onSnapshot(ref, (snapshot) => {
          if (snapshot.exists()) {
              setData({ id: snapshot.id, ...snapshot.data() });
          } else {
              setData(null);
          }
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
