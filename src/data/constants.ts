import { WebsiteType, Feature, FeatureCategory } from '@/types';

export const WEBSITE_TYPES: WebsiteType[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    nameTh: 'อีคอมเมิร์ซ',
    description: 'Online store with product catalog, shopping cart, and checkout',
    descriptionTh: 'ร้านค้าออนไลน์พร้อมแคตตาล็อกสินค้า ตะกร้าสินค้า และระบบชำระเงิน',
    icon: 'ShoppingCart',
    defaultFeatures: ['auth', 'payment', 'admin', 'search', 'responsive', 'seo', 'analytics', 'inventory'],
  },
  {
    id: 'blog',
    name: 'Blog',
    nameTh: 'บล็อก',
    description: 'Content publishing platform with articles and categories',
    descriptionTh: 'แพลตฟอร์มเผยแพร่เนื้อหาพร้อมบทความและหมวดหมู่',
    icon: 'FileText',
    defaultFeatures: ['auth', 'cms', 'search', 'responsive', 'seo', 'comments', 'newsletter'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    nameTh: 'พอร์ตโฟลิโอ',
    description: 'Showcase your work and professional profile',
    descriptionTh: 'แสดงผลงานและโปรไฟล์มืออาชีพของคุณ',
    icon: 'Briefcase',
    defaultFeatures: ['responsive', 'seo', 'contact', 'gallery', 'animations'],
  },
  {
    id: 'saas',
    name: 'SaaS',
    nameTh: 'SaaS',
    description: 'Software as a Service with subscription and user management',
    descriptionTh: 'ซอฟต์แวร์บริการพร้อมระบบสมาชิกและจัดการผู้ใช้',
    icon: 'Cloud',
    defaultFeatures: ['auth', 'payment', 'admin', 'api', 'analytics', 'notification', 'responsive', 'multi-tenant'],
  },
  {
    id: 'landing',
    name: 'Landing Page',
    nameTh: 'แลนดิ้งเพจ',
    description: 'Single page to promote product or service',
    descriptionTh: 'หน้าเดียวเพื่อโปรโมตสินค้าหรือบริการ',
    icon: 'FileBox',
    defaultFeatures: ['responsive', 'seo', 'contact', 'animations', 'analytics'],
  },
];

export const FEATURES: Feature[] = [
  // Authentication
  {
    id: 'auth',
    name: 'Authentication',
    nameTh: 'ระบบยืนยันตัวตน',
    description: 'User login, registration, and session management',
    descriptionTh: 'ระบบเข้าสู่ระบบ ลงทะเบียน และจัดการเซสชัน',
    category: 'authentication',
    defaultFor: ['ecommerce', 'blog', 'saas'],
  },
  {
    id: 'oauth',
    name: 'Social Login',
    nameTh: 'ล็อกอินด้วยโซเชียล',
    description: 'Login with Google, Facebook, etc.',
    descriptionTh: 'เข้าสู่ระบบด้วย Google, Facebook ฯลฯ',
    category: 'authentication',
    defaultFor: ['saas'],
  },
  {
    id: 'rbac',
    name: 'Role-Based Access',
    nameTh: 'การจัดการสิทธิ์',
    description: 'Different permissions for different user roles',
    descriptionTh: 'สิทธิ์การเข้าถึงตามบทบาทผู้ใช้',
    category: 'authentication',
    defaultFor: ['saas'],
  },

  // Payment
  {
    id: 'payment',
    name: 'Payment Gateway',
    nameTh: 'ระบบชำระเงิน',
    description: 'Accept credit cards and online payments',
    descriptionTh: 'รับชำระเงินผ่านบัตรเครดิตและออนไลน์',
    category: 'payment',
    defaultFor: ['ecommerce', 'saas'],
  },
  {
    id: 'subscription',
    name: 'Subscription System',
    nameTh: 'ระบบสมาชิกรายเดือน',
    description: 'Recurring billing and subscription management',
    descriptionTh: 'ระบบเรียกเก็บเงินและจัดการสมาชิกรายเดือน',
    category: 'payment',
    defaultFor: ['saas'],
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    nameTh: 'จัดการสต็อกสินค้า',
    description: 'Track product stock and variants',
    descriptionTh: 'ติดตามสต็อกสินค้าและตัวเลือก',
    category: 'payment',
    defaultFor: ['ecommerce'],
  },

  // Communication
  {
    id: 'chat',
    name: 'Chat System',
    nameTh: 'ระบบแชท',
    description: 'Real-time messaging between users',
    descriptionTh: 'ส่งข้อความแบบเรียลไทม์ระหว่างผู้ใช้',
    category: 'communication',
    defaultFor: [],
  },
  {
    id: 'notification',
    name: 'Notifications',
    nameTh: 'การแจ้งเตือน',
    description: 'Push notifications and email alerts',
    descriptionTh: 'การแจ้งเตือนแบบพุชและอีเมล',
    category: 'communication',
    defaultFor: ['saas'],
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    nameTh: 'จดหมายข่าว',
    description: 'Email subscription and campaigns',
    descriptionTh: 'ระบบสมัครรับข่าวสารและแคมเปญอีเมล',
    category: 'communication',
    defaultFor: ['blog'],
  },
  {
    id: 'contact',
    name: 'Contact Form',
    nameTh: 'แบบฟอร์มติดต่อ',
    description: 'Allow visitors to send messages',
    descriptionTh: 'ให้ผู้เยี่ยมชมส่งข้อความได้',
    category: 'communication',
    defaultFor: ['portfolio', 'landing'],
  },
  {
    id: 'comments',
    name: 'Comments System',
    nameTh: 'ระบบคอมเมนต์',
    description: 'User comments and discussions',
    descriptionTh: 'ความคิดเห็นและการสนทนาของผู้ใช้',
    category: 'communication',
    defaultFor: ['blog'],
  },

  // Admin
  {
    id: 'admin',
    name: 'Admin Dashboard',
    nameTh: 'แดชบอร์ดผู้ดูแล',
    description: 'Backend management interface',
    descriptionTh: 'หน้าจัดการระบบสำหรับผู้ดูแล',
    category: 'admin',
    defaultFor: ['ecommerce', 'saas'],
  },
  {
    id: 'cms',
    name: 'Content Management',
    nameTh: 'จัดการเนื้อหา',
    description: 'Create and manage content easily',
    descriptionTh: 'สร้างและจัดการเนื้อหาได้ง่าย',
    category: 'admin',
    defaultFor: ['blog'],
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    nameTh: 'แดชบอร์ดวิเคราะห์',
    description: 'Track user behavior and metrics',
    descriptionTh: 'ติดตามพฤติกรรมผู้ใช้และตัวชี้วัด',
    category: 'analytics',
    defaultFor: ['ecommerce', 'saas', 'landing'],
  },
  {
    id: 'reports',
    name: 'Reports & Export',
    nameTh: 'รายงานและส่งออก',
    description: 'Generate and export reports',
    descriptionTh: 'สร้างและส่งออกรายงาน',
    category: 'analytics',
    defaultFor: [],
  },

  // UX/UI
  {
    id: 'responsive',
    name: 'Responsive Design',
    nameTh: 'รองรับทุกอุปกรณ์',
    description: 'Works on mobile, tablet, and desktop',
    descriptionTh: 'ใช้งานได้บนมือถือ แท็บเล็ต และคอมพิวเตอร์',
    category: 'ux-ui',
    defaultFor: ['ecommerce', 'blog', 'portfolio', 'saas', 'landing'],
  },
  {
    id: 'search',
    name: 'Search & Filter',
    nameTh: 'ค้นหาและกรอง',
    description: 'Advanced search and filtering',
    descriptionTh: 'ระบบค้นหาและกรองขั้นสูง',
    category: 'ux-ui',
    defaultFor: ['ecommerce', 'blog'],
  },
  {
    id: 'seo',
    name: 'SEO Optimization',
    nameTh: 'ปรับแต่ง SEO',
    description: 'Search engine optimization features',
    descriptionTh: 'ฟีเจอร์เพิ่มประสิทธิภาพ SEO',
    category: 'ux-ui',
    defaultFor: ['ecommerce', 'blog', 'portfolio', 'landing'],
  },
  {
    id: 'multilang',
    name: 'Multi-Language',
    nameTh: 'หลายภาษา',
    description: 'Support multiple languages',
    descriptionTh: 'รองรับหลายภาษา',
    category: 'ux-ui',
    defaultFor: [],
  },
  {
    id: 'darkmode',
    name: 'Dark Mode',
    nameTh: 'โหมดมืด',
    description: 'Light and dark theme support',
    descriptionTh: 'รองรับธีมสว่างและมืด',
    category: 'ux-ui',
    defaultFor: [],
  },
  {
    id: 'animations',
    name: 'Animations',
    nameTh: 'แอนิเมชัน',
    description: 'Smooth transitions and micro-interactions',
    descriptionTh: 'การเปลี่ยนผ่านและปฏิสัมพันธ์ที่ลื่นไหล',
    category: 'ux-ui',
    defaultFor: ['portfolio', 'landing'],
  },
  {
    id: 'gallery',
    name: 'Image Gallery',
    nameTh: 'แกลเลอรี่รูปภาพ',
    description: 'Showcase images with lightbox',
    descriptionTh: 'แสดงรูปภาพพร้อม lightbox',
    category: 'content',
    defaultFor: ['portfolio'],
  },

  // API & Integration
  {
    id: 'api',
    name: 'API Integration',
    nameTh: 'เชื่อมต่อ API',
    description: 'RESTful or GraphQL API endpoints',
    descriptionTh: 'จุดเชื่อมต่อ API แบบ RESTful หรือ GraphQL',
    category: 'admin',
    defaultFor: ['saas'],
  },
  {
    id: 'multi-tenant',
    name: 'Multi-Tenant',
    nameTh: 'หลายองค์กร',
    description: 'Support multiple organizations',
    descriptionTh: 'รองรับหลายองค์กร',
    category: 'admin',
    defaultFor: ['saas'],
  },
];

export const FEATURE_CATEGORIES: { id: FeatureCategory; name: string; nameTh: string }[] = [
  { id: 'authentication', name: 'Authentication', nameTh: 'ยืนยันตัวตน' },
  { id: 'payment', name: 'Payment & Commerce', nameTh: 'ชำระเงินและการค้า' },
  { id: 'communication', name: 'Communication', nameTh: 'การสื่อสาร' },
  { id: 'admin', name: 'Admin & Backend', nameTh: 'ผู้ดูแลและระบบหลังบ้าน' },
  { id: 'analytics', name: 'Analytics', nameTh: 'วิเคราะห์ข้อมูล' },
  { id: 'ux-ui', name: 'UX/UI', nameTh: 'ประสบการณ์ผู้ใช้' },
  { id: 'content', name: 'Content', nameTh: 'เนื้อหา' },
];

export const TARGET_AUDIENCES = [
  { id: 'b2c', name: 'B2C - General Consumers', nameTh: 'B2C - ผู้บริโภคทั่วไป' },
  { id: 'b2b', name: 'B2B - Businesses', nameTh: 'B2B - ธุรกิจ' },
  { id: 'b2b2c', name: 'B2B2C - Both', nameTh: 'B2B2C - ทั้งสองกลุ่ม' },
  { id: 'enterprise', name: 'Enterprise', nameTh: 'องค์กรขนาดใหญ่' },
  { id: 'startup', name: 'Startups & SMEs', nameTh: 'สตาร์ทอัพและ SMEs' },
  { id: 'developer', name: 'Developers', nameTh: 'นักพัฒนา' },
  { id: 'creative', name: 'Creative Professionals', nameTh: 'มืออาชีพด้านครีเอทีฟ' },
  { id: 'education', name: 'Education', nameTh: 'การศึกษา' },
];

export const BUDGET_RANGES = {
  min: 10000,
  max: 5000000,
  step: 10000,
  currency: {
    en: 'THB',
    th: 'บาท',
  },
};

export const TIMELINE_OPTIONS = [
  { id: '1month', name: '1 Month', nameTh: '1 เดือน', weeks: 4 },
  { id: '2months', name: '2 Months', nameTh: '2 เดือน', weeks: 8 },
  { id: '3months', name: '3 Months', nameTh: '3 เดือน', weeks: 12 },
  { id: '6months', name: '6 Months', nameTh: '6 เดือน', weeks: 24 },
  { id: '12months', name: '12 Months', nameTh: '12 เดือน', weeks: 48 },
  { id: 'custom', name: 'Custom', nameTh: 'กำหนดเอง', weeks: 0 },
];

export const DEFAULT_PROJECT_DETAILS = {
  websiteType: null,
  selectedFeatures: [],
  targetAudience: '',
  budgetRange: [100000, 500000] as [number, number],
  timeline: '3months',
  additionalInfo: '',
  outputLanguage: 'th' as const,
  projectName: '',
};

// Helper function to get default features for a website type
export function getDefaultFeaturesForType(typeId: string): string[] {
  const websiteType = WEBSITE_TYPES.find(t => t.id === typeId);
  return websiteType?.defaultFeatures || [];
}

// Helper function to format budget
export function formatBudget(amount: number, lang: 'en' | 'th' = 'th'): string {
  const formatted = new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US').format(amount);
  return lang === 'th' ? `${formatted} บาท` : `${formatted} THB`;
}

