/**
 * roleRedirect utility
 *
 * Placeholder.
 * Will be implemented during frontend-backend integration phase.
 */
export default function roleRedirect(role) {
  if (role === 'admin') return '/admin/users';
  if (role === 'organiser') return '/organiser';
  return '/';
}
