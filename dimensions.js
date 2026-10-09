/**

 * dimensions.js

 * 

 * تعريف الأبعاد السبعة المستخدمة في اختبار "مساري"

 * كل بعد له:

 * - key: المفتاح بالإنجليزية (يُستخدم في الكود والحسابات)

 * - name: الاسم العربي (يظهر للطالب)

 * - icon: الأيقونة (تظهر في الرسم البياني)

 * - description: وصف مختصر للبعد

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



/**

 * قائمة مفاتيح الأبعاد بالترتيب الثابت

 * تُستخدم في حسابات Cosine Similarity

 * ⚠️ مهم: الترتيب يجب أن يكون ثابتاً

 */

export const DIMENSION_KEYS = [

  'anal',

  'creative',

  'comm',

  'tech',

  'organize',

  'lead',

  'care'

];



/**

 * إرجاع بُعد كامل حسب مفتاحه

 */

export function getDimension(key) {

  return DIMENSIONS.find(d => d.key === key) || null;

}



/**

 * إرجاع اسم البعد بالعربية حسب مفتاحه

 */

export function getDimensionName(key) {

  const dim = getDimension(key);

  return dim ? dim.name : key;

}