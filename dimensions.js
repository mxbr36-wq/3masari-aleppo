/**
 * Quiz dimensions.
 *
 * The order of DIMENSION_KEYS is part of the scoring contract: student vectors
 * and every specialization fingerprint are index-aligned to it, so reordering
 * or inserting a key silently corrupts all results.
 */

export const DIMENSIONS = [
  {
    key: 'anal',
    name: 'التحليل المنطقي',
    icon: 'brain',
    description: 'تفكيك المشكلات، الاستنتاج، بناء الحجج، التفكير النظري'
  },
  {
    key: 'creative',
    name: 'الإبداع والتعبير',
    icon: 'sparkles',
    description: 'إنتاج الأفكار الجديدة، التعبير الفني، الرؤية البصرية، الخيال'
  },
  {
    key: 'comm',
    name: 'التواصل الاجتماعي',
    icon: 'messagesSquare',
    description: 'التفاعل مع الناس، الإصغاء، الإقناع، بناء العلاقات'
  },
  {
    key: 'tech',
    name: 'التقنية والبناء',
    icon: 'cpu',
    description: 'التعامل مع الأجهزة، الأنظمة، البناء اليدوي، الحلول العملية'
  },
  {
    key: 'organize',
    name: 'التنظيم والدقة',
    icon: 'clipboardList',
    description: 'الالتزام بالتفاصيل، النظام، الإجراءات، الإتقان'
  },
  {
    key: 'lead',
    name: 'القيادة والمبادرة',
    icon: 'rocket',
    description: 'اتخاذ القرار، تحمل المسؤولية، المبادرة، إدارة الفرق'
  },
  {
    key: 'care',
    name: 'الرعاية والصحة',
    icon: 'heartHandshake',
    description: 'العطاء، الاهتمام بالآخرين، الصحة، مساعدة المحتاجين'
  }
];

// Fixed order used to build vectors (see note above).
export const DIMENSION_KEYS = DIMENSIONS.map(dimension => dimension.key);

export function getDimension(key) {
  return DIMENSIONS.find(dimension => dimension.key === key) || null;
}

export function getDimensionName(key) {
  return getDimension(key)?.name ?? key;
}
