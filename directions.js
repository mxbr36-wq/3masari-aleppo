/**

 * directions.js

 * 

 * تعريف الاتجاهات الخمسة المستخدمة في اختبار "مساري"

 * كل اتجاه يحتوي على مجموعة تخصصات متقاربة

 * 

 * كل اتجاه له:

 * - key: المفتاح بالإنجليزية (يُستخدم في الكود)

 * - name: الاسم العربي (يظهر للطالب)

 * - icon: الأيقونة

 * - color: اللون (للتمييز البصري في الرسم البياني)

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



/**

 * قائمة مفاتيح الاتجاهات بالترتيب الثابت

 */

export const DIRECTION_KEYS = [

  'health',

  'engineering',

  'business',

  'humanities',

  'culture'

];



/**

 * إرجاع اتجاه كامل حسب مفتاحه

 */

export function getDirection(key) {

  return DIRECTIONS[key] || null;

}



/**

 * إرجاع اسم الاتجاه بالعربية

 */

export function getDirectionName(key) {

  const dir = getDirection(key);

  return dir ? dir.name : key;

}