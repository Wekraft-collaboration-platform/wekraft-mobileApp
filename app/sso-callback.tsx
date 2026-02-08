

// Clerk OAuth requires a dedicated callback route.
// This screen exists only to receive the SSO redirect
// and allow the app's auth listeners to finalize the session.
// No UI, no logic, no side effects.

export default function SsoCallback() {
  return null
}
