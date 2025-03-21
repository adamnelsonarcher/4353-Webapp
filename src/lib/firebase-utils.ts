import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { FirebaseUser, FirebaseProfile, FirebaseEvent, FirebaseVolunteerHistory } from '../types/firebase';

export const createUser = async (userData: Omit<FirebaseUser, 'createdAt'>) => {
  const userCollection = collection(db, 'users');
  return await addDoc(userCollection, {
    ...userData,
    createdAt: new Date()
  });
};

export const createProfile = async (profileData: Omit<FirebaseProfile, 'createdAt' | 'updatedAt'>) => {
  const profileCollection = collection(db, 'profiles');
  return await addDoc(profileCollection, {
    ...profileData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const createEvent = async (eventData: Omit<FirebaseEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
  const eventCollection = collection(db, 'events');
  return await addDoc(eventCollection, {
    ...eventData,
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getEventsByOrganizer = async (organizerEmail: string) => {
  const eventCollection = collection(db, 'events');
  const q = query(eventCollection, where('organizerEmail', '==', organizerEmail));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getVolunteerHistory = async (volunteerId: string) => {
  const historyCollection = collection(db, 'volunteerHistory');
  const q = query(historyCollection, where('volunteerId', '==', volunteerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 