import { useAccessControl } from '../../hooks/useAccessControl';

export default function AccessGated({ permission, children, fallback = null }) {
  const access = useAccessControl();

  if (!access.can(permission)) {
    return fallback;
  }

  return children;
}
