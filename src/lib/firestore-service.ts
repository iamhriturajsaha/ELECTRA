/**
 * @module firestore-service
 * @description Typed Firestore service layer for the Electra platform.
 * Centralizes all database operations: quiz scores, chat logs, location
 * searches, and user activity — providing a single source of truth for
 * Google Firestore interactions.
 */

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

/** Shape of a quiz result stored in Firestore */
export interface QuizResult {
  score: number;
  totalQuestions: number;
  rank: string;
  completedAt?: ReturnType<typeof serverTimestamp>;
}

/** Shape of a location search event */
export interface LocationSearchEvent {
  query: string;
  resultsFound: number;
  timestamp?: ReturnType<typeof serverTimestamp>;
}

/** Shape of a calendar sync event */
export interface CalendarSyncEvent {
  eventName: string;
  eventDate: string;
  timestamp?: ReturnType<typeof serverTimestamp>;
}

/**
 * Saves a completed quiz result to the Firestore `quiz_results` collection.
 *
 * @param result - The quiz result to persist.
 * @returns The Firestore document reference ID.
 */
export async function saveQuizResult(result: QuizResult): Promise<string> {
  const docRef = await addDoc(collection(db, "quiz_results"), {
    ...result,
    completedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Fetches the top N quiz results from Firestore ordered by score descending.
 *
 * @param topN - Maximum number of results to retrieve (default: 10).
 * @returns Array of quiz result documents.
 */
export async function getTopQuizResults(
  topN = 10
): Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const q = query(
    collection(db, "quiz_results"),
    orderBy("score", "desc"),
    limit(topN)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs;
}

/**
 * Logs a location search event to Firestore for analytics.
 *
 * @param event - The search event details.
 */
export async function logLocationSearch(
  event: LocationSearchEvent
): Promise<void> {
  await addDoc(collection(db, "location_searches"), {
    ...event,
    timestamp: serverTimestamp(),
  });
}

/**
 * Logs a Google Calendar sync event to Firestore for analytics.
 *
 * @param event - The calendar event details.
 */
export async function logCalendarSync(
  event: CalendarSyncEvent
): Promise<void> {
  await addDoc(collection(db, "calendar_syncs"), {
    ...event,
    timestamp: serverTimestamp(),
  });
}
