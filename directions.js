/**
 * Career directions: the five groups that specializations roll up into.
 *
 * `key` must match the `direction` field in specializations.js and the keys of
 * DIRECTION_CALIBRATION in scoring.js. `color` is only used by result charts.
 */

export const DIRECTIONS = {
  health: {
    key: 'health',
    name: 'الصحة والعلوم الطبية',
    icon: 'stethoscope',
    color: '#E91E63',
    description: 'التخصصات التي تهتم بصحة الإنسان والحيوان والعلوم الطبية'
  },
  engineering: {
    key: 'engineering',
    name: 'الهندسة والتقنية',
    icon: 'hardHat',
    color: '#2196F3',
    description: 'التخصصات الهندسية والتقنية والعلوم التطبيقية'
  },
  business: {
    key: 'business',
    name: 'الاقتصاد والإدارة',
    icon: 'briefcase',
    color: '#FF9800',
    description: 'التخصصات المالية والإدارية والاقتصادية'
  },
  humanities: {
    key: 'humanities',
    name: 'الإنسان والمجتمع',
    icon: 'usersRound',
    color: '#4CAF50',
    description: 'التخصصات التي تهتم بالإنسان والمجتمع والقانون'
  },
  culture: {
    key: 'culture',
    name: 'الثقافة والفنون',
    icon: 'palette',
    color: '#9C27B0',
    description: 'التخصصات الأدبية والفنية والثقافية'
  }
};

export const DIRECTION_KEYS = Object.keys(DIRECTIONS);

export function getDirection(key) {
  return DIRECTIONS[key] || null;
}

export function getDirectionName(key) {
  return getDirection(key)?.name ?? key;
}
