import posthog from 'posthog-js';

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  'phc_tqgZpHfSKxvbLP8Bh6JJaoV8oB7uoeZwkBVzxToerKbf';

const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let isPostHogInitialized = false;

/**
 * Centrally initialize PostHog once on the client side.
 */
export function initPostHog(): void {
  if (typeof window === 'undefined') return;

  if (!isPostHogInitialized) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: '2026-05-30',
      capture_pageview: false, // Handled explicitly on navigation to avoid duplicates in Next.js App Router
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: false,
    });
    isPostHogInitialized = true;
  }
}

/**
 * Generic safe event tracker
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;

  try {
    if (!isPostHogInitialized) {
      initPostHog();
    }
    posthog.capture(eventName, properties);
  } catch (err) {
    console.warn(`[PostHog] Failed to track event "${eventName}":`, err);
  }
}

/* =========================================================================
   Dedicated Portfolio Action Event Trackers
   ========================================================================= */

/**
 * Track when resume is clicked / opened
 */
export function trackResumeClicked(properties?: {
  location?: string;
  url?: string;
}): void {
  trackEvent('resume_clicked', {
    location: properties?.location || 'unknown',
    url: properties?.url,
  });
}

/**
 * Track when GitHub profile or repository is clicked
 */
export function trackGithubClicked(properties?: {
  project_name?: string;
  location?: string;
  url?: string;
}): void {
  trackEvent('github_clicked', {
    project_name: properties?.project_name,
    location: properties?.location || 'unknown',
    url: properties?.url,
  });
}

/**
 * Track when email address or email link is clicked
 */
export function trackEmailClicked(properties?: {
  email?: string;
  location?: string;
}): void {
  trackEvent('email_clicked', {
    email: properties?.email || 'divyanshutiwari281@gmail.com',
    location: properties?.location || 'unknown',
  });
}

/**
 * Track when a project card is viewed by the user.
 * Must include project name as an event property.
 */
export function trackProjectViewed(
  projectName: string,
  properties?: {
    project_id?: string;
    category?: string;
    [key: string]: any;
  }
): void {
  trackEvent('project_viewed', {
    project_name: projectName,
    ...properties,
  });
}

/**
 * Track when project live demo link is clicked
 */
export function trackProjectDemoClicked(
  projectName: string,
  url?: string
): void {
  trackEvent('project_demo_clicked', {
    project_name: projectName,
    url,
  });
}

/**
 * Track when LeetCode profile link is clicked
 */
export function trackLeetcodeClicked(properties?: {
  location?: string;
  url?: string;
}): void {
  trackEvent('leetcode_clicked', {
    location: properties?.location || 'unknown',
    url: properties?.url,
  });
}

/**
 * Track when StrataScratch profile link is clicked
 */
export function trackStratascratchClicked(properties?: {
  location?: string;
  url?: string;
}): void {
  trackEvent('stratascratch_clicked', {
    location: properties?.location || 'unknown',
    url: properties?.url,
  });
}

/**
 * Track when contact links (LinkedIn, Twitter, Email) are clicked
 */
export function trackContactClicked(properties?: {
  channel?: string;
  location?: string;
  url?: string;
}): void {
  trackEvent('contact_clicked', {
    channel: properties?.channel || 'general',
    location: properties?.location || 'unknown',
    url: properties?.url,
  });
}

/**
 * Track when Twitter/X follow alert is shown
 */
export function trackTwitterFollowAlertShown(): void {
  trackEvent('twitter_follow_alert_shown');
}

/**
 * Track when Twitter/X follow alert is clicked
 */
export function trackTwitterFollowClicked(): void {
  trackEvent('twitter_follow_clicked');
}

export default posthog;
