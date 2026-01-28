'use client';

// Re-export specific hooks and utilities
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

// Note: 'provider' is likely missing or not needed in this simplified setup.
// We are initializing firebase in ./config.ts
