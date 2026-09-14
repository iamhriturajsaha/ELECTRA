/**
 * @module analytics
 * @description Typed wrapper around Google Analytics sendGAEvent for
 * consistent, structured event tracking across the Electra platform.
 *
 * All events follow the GA4 recommended event schema:
 *   category → event_category param
 *   action   → event name
 *   label    → event_label param (optional)
 *   value    → value param (optional)
 */

import { sendGAEvent } from "@next/third-parties/google";

/** Supported Electra analytics event categories */
export type EventCategory =
  | "quiz"
  | "calendar"
  | "voter_id"
  | "location"
  | "chat"
  | "auth";

/**
 * Tracks a user interaction event with Google Analytics.
 *
 * @param category - The high-level feature area (e.g. "quiz", "chat")
 * @param action   - The specific action taken (e.g. "completed", "added_event")
 * @param label    - Optional context label (e.g. question text, city name)
 * @param value    - Optional numeric value (e.g. score, answer index)
 */
export function trackEvent(
  category: EventCategory,
  action: string,
  label?: string,
  value?: number
): void {
  sendGAEvent("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}
