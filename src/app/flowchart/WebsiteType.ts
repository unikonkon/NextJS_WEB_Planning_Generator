// ===========================================
// Base Types
// ===========================================

type WebsiteType = 'ecommerce' | 'blog' | 'portfolio' | 'saas' | 'landing';

type Priority = 'required' | 'recommended' | 'optional';
type Complexity = 'low' | 'medium' | 'high';

interface FeatureDetail {
  name: string;
  description: string;
  priority: Priority;
  complexity: Complexity;
  components: string[];
  dataModels?: string[];
  integrations?: string[];
  pages?: string[];
}

// ===========================================
// E-COMMERCE FEATURES
// ===========================================

interface EcommerceFeatures {
  core: {
    productCatalog: FeatureDetail;
    shoppingCart: FeatureDetail;
    checkout: FeatureDetail;
    authentication: FeatureDetail;
    orderManagement: FeatureDetail;
    inventory: FeatureDetail;
    search: FeatureDetail;
    wishlist: FeatureDetail;
    reviews: FeatureDetail;
    coupons: FeatureDetail;
  };
  advanced: {
    multiCurrency: FeatureDetail;
    shipping: FeatureDetail;
    notifications: FeatureDetail;
    adminDashboard: FeatureDetail;
    recommendations: FeatureDetail;
  };
}

const ecommerceFeatures: EcommerceFeatures = {
  core: {
    productCatalog: {
      name: 'Product Catalog',
      description: 'ระบบจัดการและแสดงสินค้าทั้งหมด',
      priority: 'required',
      complexity: 'medium',
      components: [
        'ProductCard',
        'ProductGrid',
        'ProductDetail',
        'CategoryNav',
        'ProductImage',
        'PriceDisplay',
        'StockBadge',
        'ProductVariants'
      ],
      dataModels: [
        'Product { id, name, slug, description, price, comparePrice, images[], category, tags[], variants[], sku, stock, status }',
        'Category { id, name, slug, parentId, image, description }',
        'ProductVariant { id, productId, name, sku, price, stock, attributes[] }'
      ],
      pages: [
        '/products',
        '/products/[slug]',
        '/category/[slug]'
      ]
    },
    shoppingCart: {
      name: 'Shopping Cart',
      description: 'ตะกร้าสินค้าสำหรับเก็บสินค้าก่อนชำระเงิน',
      priority: 'required',
      complexity: 'medium',
      components: [
        'CartIcon',
        'CartDrawer',
        'CartItem',
        'CartSummary',
        'QuantitySelector',
        'RemoveItemButton',
        'CartEmpty',
        'ContinueShopping'
      ],
      dataModels: [
        'Cart { id, userId, items[], subtotal, discount, total, createdAt, updatedAt }',
        'CartItem { id, cartId, productId, variantId, quantity, price, total }'
      ],
      integrations: [
        'LocalStorage (guest)',
        'Database (logged in)',
        'Zustand/Redux state'
      ],
      pages: ['/cart']
    },
    checkout: {
      name: 'Checkout & Payment',
      description: 'ระบบชำระเงินและสรุปคำสั่งซื้อ',
      priority: 'required',
      complexity: 'high',
      components: [
        'CheckoutForm',
        'ShippingAddressForm',
        'BillingAddressForm',
        'PaymentMethodSelector',
        'OrderSummary',
        'PaymentForm',
        'OrderConfirmation',
        'CheckoutSteps'
      ],
      dataModels: [
        'Order { id, userId, items[], shippingAddress, billingAddress, paymentMethod, paymentStatus, subtotal, shipping, tax, discount, total, status, createdAt }',
        'Address { id, userId, fullName, phone, address, city, province, postalCode, country, isDefault }',
        'Payment { id, orderId, method, transactionId, amount, status, paidAt }'
      ],
      integrations: [
        'Stripe',
        'PayPal',
        'PromptPay',
        '2C2P',
        'Omise'
      ],
      pages: [
        '/checkout',
        '/checkout/shipping',
        '/checkout/payment',
        '/checkout/confirmation',
        '/order/[id]/success'
      ]
    },
    authentication: {
      name: 'User Authentication',
      description: 'ระบบสมัครสมาชิก เข้าสู่ระบบ และจัดการบัญชี',
      priority: 'required',
      complexity: 'medium',
      components: [
        'LoginForm',
        'RegisterForm',
        'ForgotPasswordForm',
        'ResetPasswordForm',
        'UserMenu',
        'AccountSidebar',
        'ProfileForm',
        'ChangePasswordForm',
        'SocialLoginButtons'
      ],
      dataModels: [
        'User { id, email, password, firstName, lastName, phone, avatar, role, emailVerified, createdAt }',
        'Session { id, userId, token, expiresAt }',
        'PasswordReset { id, userId, token, expiresAt }'
      ],
      integrations: [
        'NextAuth.js',
        'JWT',
        'OAuth (Google, Facebook, Line)',
        'Email verification'
      ],
      pages: [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/account',
        '/account/profile',
        '/account/addresses',
        '/account/orders'
      ]
    },
    orderManagement: {
      name: 'Order Management',
      description: 'ระบบจัดการและติดตามคำสั่งซื้อ',
      priority: 'required',
      complexity: 'medium',
      components: [
        'OrderList',
        'OrderCard',
        'OrderDetail',
        'OrderStatus',
        'OrderTimeline',
        'OrderItems',
        'TrackingInfo',
        'ReorderButton',
        'CancelOrderButton'
      ],
      dataModels: [
        'Order (extended) { trackingNumber, shippedAt, deliveredAt, cancelledAt, cancelReason, notes }',
        'OrderStatusHistory { id, orderId, status, note, createdAt, createdBy }'
      ],
      pages: [
        '/account/orders',
        '/account/orders/[id]',
        '/track/[orderNumber]'
      ]
    },
    inventory: {
      name: 'Inventory Management',
      description: 'ระบบจัดการสต็อกสินค้า',
      priority: 'required',
      complexity: 'medium',
      components: [
        'StockIndicator',
        'LowStockAlert',
        'OutOfStockBadge',
        'BackInStockNotify',
        'StockQuantityDisplay'
      ],
      dataModels: [
        'Inventory { id, productId, variantId, quantity, reservedQty, availableQty, lowStockThreshold }',
        'StockMovement { id, productId, type, quantity, reason, reference, createdAt }',
        'BackInStockSubscription { id, productId, email, notified, createdAt }'
      ],
      integrations: [
        'Real-time stock sync',
        'Email notifications'
      ]
    },
    search: {
      name: 'Product Search & Filters',
      description: 'ระบบค้นหาและกรองสินค้า',
      priority: 'required',
      complexity: 'medium',
      components: [
        'SearchBar',
        'SearchModal',
        'SearchResults',
        'SearchSuggestions',
        'FilterSidebar',
        'PriceRangeFilter',
        'CategoryFilter',
        'ColorFilter',
        'SizeFilter',
        'SortDropdown',
        'ActiveFilters',
        'NoResults'
      ],
      dataModels: [
        'SearchQuery { query, filters, sort, page, limit }',
        'SearchResult { products[], total, facets[] }',
        'SearchHistory { id, userId, query, createdAt }'
      ],
      integrations: [
        'Algolia',
        'Meilisearch',
        'Elasticsearch',
        'PostgreSQL Full-text'
      ],
      pages: ['/search', '/search?q=[query]']
    },
    wishlist: {
      name: 'Wishlist / Favorites',
      description: 'รายการสินค้าที่ชอบ/อยากได้',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'WishlistButton',
        'WishlistIcon',
        'WishlistPage',
        'WishlistItem',
        'MoveToCartButton',
        'ShareWishlistButton'
      ],
      dataModels: [
        'Wishlist { id, userId, productIds[], createdAt }',
        'WishlistItem { id, wishlistId, productId, addedAt }'
      ],
      pages: ['/wishlist', '/account/wishlist']
    },
    reviews: {
      name: 'Product Reviews & Ratings',
      description: 'ระบบรีวิวและให้คะแนนสินค้า',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'StarRating',
        'ReviewList',
        'ReviewCard',
        'ReviewForm',
        'RatingSummary',
        'ReviewImages',
        'HelpfulButton',
        'ReviewFilter',
        'VerifiedBadge'
      ],
      dataModels: [
        'Review { id, productId, userId, orderId, rating, title, content, images[], helpful, verified, status, createdAt }',
        'ReviewHelpful { id, reviewId, userId, isHelpful }'
      ],
      pages: ['/products/[slug]#reviews']
    },
    coupons: {
      name: 'Discount Codes & Coupons',
      description: 'ระบบส่วนลดและคูปอง',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'CouponInput',
        'AppliedCoupon',
        'CouponBanner',
        'DiscountBadge',
        'CouponList'
      ],
      dataModels: [
        'Coupon { id, code, type, value, minPurchase, maxDiscount, usageLimit, usedCount, startDate, endDate, applicableProducts[], applicableCategories[], status }',
        'CouponUsage { id, couponId, userId, orderId, discount, usedAt }'
      ]
    }
  },
  advanced: {
    multiCurrency: {
      name: 'Multi-currency & Multi-language',
      description: 'รองรับหลายสกุลเงินและหลายภาษา',
      priority: 'optional',
      complexity: 'high',
      components: [
        'CurrencySelector',
        'LanguageSwitcher',
        'LocalizedPrice',
        'CurrencyConverter'
      ],
      dataModels: [
        'Currency { code, symbol, exchangeRate, isDefault }',
        'Translation { key, locale, value }'
      ],
      integrations: [
        'next-intl',
        'i18next',
        'Currency API',
        'Locale detection'
      ]
    },
    shipping: {
      name: 'Shipping Calculator',
      description: 'ระบบคำนวณค่าจัดส่ง',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'ShippingCalculator',
        'ShippingMethodSelector',
        'DeliveryEstimate',
        'ShippingZoneDisplay'
      ],
      dataModels: [
        'ShippingMethod { id, name, carrier, estimatedDays, price, freeAbove }',
        'ShippingZone { id, name, countries[], regions[], methods[] }',
        'ShippingRate { id, zoneId, methodId, minWeight, maxWeight, price }'
      ],
      integrations: [
        'Thailand Post API',
        'Kerry Express',
        'Flash Express',
        'J&T Express',
        'DHL'
      ]
    },
    notifications: {
      name: 'Email & Push Notifications',
      description: 'ระบบแจ้งเตือนทาง Email และ Push',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'NotificationBell',
        'NotificationDropdown',
        'NotificationList',
        'NotificationSettings'
      ],
      dataModels: [
        'Notification { id, userId, type, title, message, data, read, createdAt }',
        'EmailTemplate { id, name, subject, body, variables[] }',
        'NotificationPreference { userId, emailOrders, emailPromo, pushEnabled }'
      ],
      integrations: [
        'SendGrid',
        'Resend',
        'AWS SES',
        'Firebase FCM',
        'OneSignal'
      ]
    },
    adminDashboard: {
      name: 'Admin Dashboard & Analytics',
      description: 'แดชบอร์ดสำหรับผู้ดูแลระบบ',
      priority: 'required',
      complexity: 'high',
      components: [
        'AdminLayout',
        'AdminSidebar',
        'DashboardStats',
        'SalesChart',
        'RevenueChart',
        'TopProducts',
        'RecentOrders',
        'CustomerStats',
        'DataTable',
        'ExportButton'
      ],
      dataModels: [
        'DashboardStats { totalSales, totalOrders, totalCustomers, averageOrderValue, conversionRate }',
        'SalesReport { period, revenue, orders, products[] }',
        'ActivityLog { id, userId, action, entity, entityId, data, createdAt }'
      ],
      pages: [
        '/admin',
        '/admin/products',
        '/admin/orders',
        '/admin/customers',
        '/admin/analytics',
        '/admin/settings'
      ]
    },
    recommendations: {
      name: 'Product Recommendations',
      description: 'ระบบแนะนำสินค้า',
      priority: 'optional',
      complexity: 'high',
      components: [
        'RecommendedProducts',
        'RecentlyViewed',
        'FrequentlyBoughtTogether',
        'SimilarProducts',
        'PersonalizedSection'
      ],
      dataModels: [
        'ProductView { id, productId, userId, sessionId, viewedAt }',
        'Recommendation { userId, productIds[], algorithm, score }',
        'ProductAssociation { productId, relatedProductId, type, strength }'
      ],
      integrations: [
        'ML Model',
        'Collaborative filtering',
        'Content-based filtering'
      ]
    }
  }
};

// ===========================================
// BLOG FEATURES
// ===========================================

interface BlogFeatures {
  core: {
    postManagement: FeatureDetail;
    categories: FeatureDetail;
    editor: FeatureDetail;
    comments: FeatureDetail;
    search: FeatureDetail;
    authorProfiles: FeatureDetail;
    socialShare: FeatureDetail;
    seo: FeatureDetail;
    rss: FeatureDetail;
    readingTime: FeatureDetail;
  };
  advanced: {
    newsletter: FeatureDetail;
    relatedPosts: FeatureDetail;
    tableOfContents: FeatureDetail;
    darkMode: FeatureDetail;
    progressIndicator: FeatureDetail;
  };
}

const blogFeatures: BlogFeatures = {
  core: {
    postManagement: {
      name: 'Post Management',
      description: 'ระบบจัดการบทความ CRUD',
      priority: 'required',
      complexity: 'medium',
      components: [
        'PostList',
        'PostCard',
        'PostDetail',
        'PostHeader',
        'PostContent',
        'PostFooter',
        'FeaturedPost',
        'PostGrid',
        'PostPagination'
      ],
      dataModels: [
        'Post { id, slug, title, excerpt, content, coverImage, author, category, tags[], status, publishedAt, createdAt, updatedAt, views }',
        'PostStatus: draft | published | scheduled | archived'
      ],
      pages: [
        '/',
        '/blog',
        '/blog/[slug]',
        '/admin/posts',
        '/admin/posts/new',
        '/admin/posts/[id]/edit'
      ]
    },
    categories: {
      name: 'Categories & Tags',
      description: 'ระบบหมวดหมู่และแท็ก',
      priority: 'required',
      complexity: 'low',
      components: [
        'CategoryList',
        'CategoryBadge',
        'TagCloud',
        'TagBadge',
        'CategoryFilter',
        'BreadcrumbNav'
      ],
      dataModels: [
        'Category { id, name, slug, description, image, postCount }',
        'Tag { id, name, slug, postCount }'
      ],
      pages: [
        '/category/[slug]',
        '/tag/[slug]'
      ]
    },
    editor: {
      name: 'Rich Text Editor',
      description: 'เครื่องมือแก้ไขบทความ',
      priority: 'required',
      complexity: 'high',
      components: [
        'RichTextEditor',
        'MarkdownEditor',
        'EditorToolbar',
        'ImageUploader',
        'CodeBlock',
        'EmbedBlock',
        'PreviewPane'
      ],
      dataModels: [
        'EditorContent { type, content, formatting }',
        'Media { id, url, type, alt, caption, uploadedBy, createdAt }'
      ],
      integrations: [
        'TipTap',
        'Slate',
        'MDX',
        'Cloudinary',
        'AWS S3'
      ]
    },
    comments: {
      name: 'Comments System',
      description: 'ระบบแสดงความคิดเห็น',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'CommentSection',
        'CommentForm',
        'CommentList',
        'CommentItem',
        'CommentReply',
        'CommentCount',
        'LikeButton',
        'ReportButton'
      ],
      dataModels: [
        'Comment { id, postId, userId, parentId, content, likes, status, createdAt }',
        'CommentLike { id, commentId, userId }',
        'CommentReport { id, commentId, userId, reason, status }'
      ],
      integrations: [
        'Native comments',
        'Disqus',
        'Giscus (GitHub)',
        'Utterances'
      ]
    },
    search: {
      name: 'Search Functionality',
      description: 'ระบบค้นหาบทความ',
      priority: 'required',
      complexity: 'medium',
      components: [
        'SearchBar',
        'SearchModal',
        'SearchResults',
        'SearchHighlight',
        'NoResults'
      ],
      dataModels: [
        'SearchIndex { postId, title, content, tags, category }',
        'SearchQuery { query, filters, results[] }'
      ],
      integrations: [
        'Algolia',
        'Fuse.js',
        'Pagefind',
        'Full-text search'
      ],
      pages: ['/search']
    },
    authorProfiles: {
      name: 'Author Profiles',
      description: 'หน้าโปรไฟล์ผู้เขียน',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'AuthorCard',
        'AuthorBio',
        'AuthorAvatar',
        'AuthorPosts',
        'AuthorSocials',
        'AuthorStats'
      ],
      dataModels: [
        'Author { id, name, slug, bio, avatar, email, website, social, postCount, createdAt }'
      ],
      pages: ['/author/[slug]']
    },
    socialShare: {
      name: 'Social Media Sharing',
      description: 'ปุ่มแชร์โซเชียลมีเดีย',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'ShareButtons',
        'ShareModal',
        'CopyLinkButton',
        'ShareCount'
      ],
      integrations: [
        'Twitter/X',
        'Facebook',
        'LinkedIn',
        'Line',
        'WhatsApp',
        'Native Share API'
      ]
    },
    seo: {
      name: 'SEO Optimization',
      description: 'การปรับแต่ง SEO',
      priority: 'required',
      complexity: 'medium',
      components: [
        'MetaTags',
        'OpenGraph',
        'TwitterCard',
        'JsonLd',
        'Sitemap',
        'Robots'
      ],
      dataModels: [
        'SEOMeta { title, description, keywords, ogImage, canonical }',
        'StructuredData { @type, headline, author, datePublished, image }'
      ],
      integrations: [
        'next-seo',
        'Google Search Console',
        'Schema.org'
      ]
    },
    rss: {
      name: 'RSS Feed',
      description: 'RSS Feed สำหรับ subscribers',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'RSSLink',
        'FeedIcon'
      ],
      dataModels: [
        'RSSItem { title, link, description, pubDate, author, guid }'
      ],
      pages: ['/feed.xml', '/rss.xml', '/atom.xml']
    },
    readingTime: {
      name: 'Reading Time Estimation',
      description: 'แสดงเวลาอ่านโดยประมาณ',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'ReadingTime',
        'WordCount'
      ],
      dataModels: [
        'ReadingStats { wordCount, readingTime, difficulty }'
      ]
    }
  },
  advanced: {
    newsletter: {
      name: 'Newsletter Subscription',
      description: 'ระบบสมัครรับข่าวสาร',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'NewsletterForm',
        'SubscribeModal',
        'UnsubscribeForm',
        'NewsletterBanner',
        'DoubleOptIn'
      ],
      dataModels: [
        'Subscriber { id, email, status, subscribedAt, unsubscribedAt }',
        'Newsletter { id, subject, content, sentAt, stats }'
      ],
      integrations: [
        'Mailchimp',
        'ConvertKit',
        'Buttondown',
        'Resend'
      ]
    },
    relatedPosts: {
      name: 'Related Posts',
      description: 'บทความที่เกี่ยวข้อง',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'RelatedPosts',
        'RelatedPostCard',
        'YouMayAlsoLike'
      ],
      dataModels: [
        'PostRelation { postId, relatedPostId, score, type }'
      ]
    },
    tableOfContents: {
      name: 'Table of Contents',
      description: 'สารบัญบทความ',
      priority: 'optional',
      complexity: 'medium',
      components: [
        'TableOfContents',
        'TOCItem',
        'FloatingTOC',
        'StickyTOC'
      ],
      dataModels: [
        'TOCItem { id, title, level, slug }'
      ]
    },
    darkMode: {
      name: 'Dark/Light Mode',
      description: 'สลับธีมมืด/สว่าง',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'ThemeToggle',
        'ThemeProvider'
      ],
      integrations: [
        'next-themes',
        'CSS variables',
        'Tailwind dark mode'
      ]
    },
    progressIndicator: {
      name: 'Reading Progress Indicator',
      description: 'แถบแสดงความคืบหน้าการอ่าน',
      priority: 'optional',
      complexity: 'low',
      components: [
        'ReadingProgress',
        'ProgressBar',
        'ScrollToTop'
      ]
    }
  }
};

// ===========================================
// PORTFOLIO FEATURES
// ===========================================

interface PortfolioFeatures {
  core: {
    projectGallery: FeatureDetail;
    aboutSection: FeatureDetail;
    skills: FeatureDetail;
    contactForm: FeatureDetail;
    resumeDownload: FeatureDetail;
    imageGallery: FeatureDetail;
    projectDetails: FeatureDetail;
    socialLinks: FeatureDetail;
    testimonials: FeatureDetail;
    timeline: FeatureDetail;
  };
  advanced: {
    caseStudies: FeatureDetail;
    blogIntegration: FeatureDetail;
    animations: FeatureDetail;
    filtering: FeatureDetail;
    darkMode: FeatureDetail;
  };
}

const portfolioFeatures: PortfolioFeatures = {
  core: {
    projectGallery: {
      name: 'Project Showcase Gallery',
      description: 'แกลเลอรีแสดงผลงาน',
      priority: 'required',
      complexity: 'medium',
      components: [
        'ProjectGrid',
        'ProjectCard',
        'ProjectThumbnail',
        'ProjectOverlay',
        'FeaturedProject',
        'ProjectCategory'
      ],
      dataModels: [
        'Project { id, slug, title, description, thumbnail, images[], category, tags[], technologies[], liveUrl, githubUrl, featured, order, createdAt }'
      ],
      pages: ['/projects', '/work']
    },
    aboutSection: {
      name: 'About Me / Bio Section',
      description: 'ส่วนแนะนำตัวเอง',
      priority: 'required',
      complexity: 'low',
      components: [
        'AboutHero',
        'BioSection',
        'ProfilePhoto',
        'PersonalStatement',
        'Highlights',
        'FunFacts'
      ],
      dataModels: [
        'Profile { name, title, bio, shortBio, photo, location, email, availability }'
      ],
      pages: ['/about', '/#about']
    },
    skills: {
      name: 'Skills & Technologies',
      description: 'แสดงทักษะและเทคโนโลยี',
      priority: 'required',
      complexity: 'low',
      components: [
        'SkillsGrid',
        'SkillCard',
        'SkillBar',
        'SkillIcon',
        'TechStack',
        'SkillCategory'
      ],
      dataModels: [
        'Skill { id, name, icon, level, category, yearsOfExperience }',
        'SkillCategory: frontend | backend | database | devops | design | tools'
      ],
      pages: ['/#skills', '/skills']
    },
    contactForm: {
      name: 'Contact Form',
      description: 'แบบฟอร์มติดต่อ',
      priority: 'required',
      complexity: 'medium',
      components: [
        'ContactForm',
        'FormInput',
        'FormTextarea',
        'SubmitButton',
        'SuccessMessage',
        'ContactInfo'
      ],
      dataModels: [
        'ContactMessage { id, name, email, subject, message, status, createdAt }'
      ],
      integrations: [
        'Resend',
        'SendGrid',
        'Formspree',
        'Netlify Forms',
        'Google reCAPTCHA'
      ],
      pages: ['/contact', '/#contact']
    },
    resumeDownload: {
      name: 'Resume/CV Download',
      description: 'ดาวน์โหลด Resume',
      priority: 'required',
      complexity: 'low',
      components: [
        'ResumeButton',
        'DownloadLink',
        'ResumePreview'
      ],
      dataModels: [
        'Resume { url, version, lastUpdated }'
      ]
    },
    imageGallery: {
      name: 'Responsive Image Gallery',
      description: 'แกลเลอรีรูปภาพ Responsive',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'ImageGallery',
        'LightboxModal',
        'ImageSlider',
        'GalleryThumbnails',
        'ZoomableImage'
      ],
      integrations: [
        'Lightbox',
        'Swiper',
        'PhotoSwipe',
        'Next/Image'
      ]
    },
    projectDetails: {
      name: 'Project Detail Pages',
      description: 'หน้ารายละเอียดโปรเจค',
      priority: 'required',
      complexity: 'medium',
      components: [
        'ProjectHero',
        'ProjectInfo',
        'ProjectGallery',
        'TechUsed',
        'ProjectLinks',
        'ProjectNavigation',
        'ProjectMeta'
      ],
      dataModels: [
        'ProjectDetail { ...Project, challenge, solution, results, testimonial, duration, role, team }'
      ],
      pages: ['/projects/[slug]']
    },
    socialLinks: {
      name: 'Social Links Integration',
      description: 'ลิงก์โซเชียลมีเดีย',
      priority: 'required',
      complexity: 'low',
      components: [
        'SocialLinks',
        'SocialIcon',
        'SocialBar'
      ],
      dataModels: [
        'SocialLink { platform, url, icon }',
        'Platforms: github | linkedin | twitter | instagram | dribbble | behance | youtube'
      ]
    },
    testimonials: {
      name: 'Testimonials',
      description: 'คำรับรองจากลูกค้า/เพื่อนร่วมงาน',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'TestimonialSection',
        'TestimonialCard',
        'TestimonialSlider',
        'TestimonialQuote'
      ],
      dataModels: [
        'Testimonial { id, name, role, company, avatar, content, rating, projectId }'
      ]
    },
    timeline: {
      name: 'Work Experience Timeline',
      description: 'ไทม์ไลน์ประสบการณ์การทำงาน',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'Timeline',
        'TimelineItem',
        'TimelineDate',
        'TimelineContent',
        'TimelineIcon'
      ],
      dataModels: [
        'Experience { id, company, role, startDate, endDate, description, achievements[], logo, current }',
        'Education { id, school, degree, field, startDate, endDate, gpa, achievements[] }'
      ],
      pages: ['/#experience', '/experience']
    }
  },
  advanced: {
    caseStudies: {
      name: 'Case Studies',
      description: 'กรณีศึกษาโปรเจคแบบละเอียด',
      priority: 'optional',
      complexity: 'high',
      components: [
        'CaseStudyLayout',
        'ProblemSection',
        'SolutionSection',
        'ProcessSection',
        'ResultsSection',
        'MetricsDisplay',
        'BeforeAfter'
      ],
      dataModels: [
        'CaseStudy { ...ProjectDetail, problem, process[], metrics[], lessons, beforeAfter }'
      ],
      pages: ['/case-studies/[slug]']
    },
    blogIntegration: {
      name: 'Blog Integration',
      description: 'บูรณาการบล็อกในพอร์ตโฟลิโอ',
      priority: 'optional',
      complexity: 'medium',
      components: [
        'BlogPreview',
        'LatestPosts',
        'BlogLink'
      ],
      pages: ['/blog']
    },
    animations: {
      name: 'Animated Transitions',
      description: 'แอนิเมชันและทรานซิชัน',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'AnimatedSection',
        'PageTransition',
        'ScrollAnimation',
        'HoverEffects',
        'LoadingAnimation'
      ],
      integrations: [
        'Framer Motion',
        'GSAP',
        'AOS',
        'React Spring',
        'Lottie'
      ]
    },
    filtering: {
      name: 'Project Filtering',
      description: 'กรองโปรเจคตามหมวดหมู่',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'FilterTabs',
        'FilterButtons',
        'AnimatedFilter'
      ]
    },
    darkMode: {
      name: 'Dark/Light Mode',
      description: 'สลับธีมมืด/สว่าง',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'ThemeToggle',
        'ThemeProvider'
      ],
      integrations: [
        'next-themes',
        'CSS variables'
      ]
    }
  }
};

// ===========================================
// SAAS FEATURES
// ===========================================

interface SaaSFeatures {
  core: {
    authentication: FeatureDetail;
    billing: FeatureDetail;
    pricing: FeatureDetail;
    dashboard: FeatureDetail;
    teamManagement: FeatureDetail;
    rbac: FeatureDetail;
    api: FeatureDetail;
    analytics: FeatureDetail;
    settings: FeatureDetail;
    onboarding: FeatureDetail;
  };
  advanced: {
    adminPanel: FeatureDetail;
    auditLogs: FeatureDetail;
    webhooks: FeatureDetail;
    notifications: FeatureDetail;
    helpCenter: FeatureDetail;
    featureFlags: FeatureDetail;
    multiTenancy: FeatureDetail;
  };
}

const saasFeatures: SaaSFeatures = {
  core: {
    authentication: {
      name: 'User Authentication',
      description: 'ระบบยืนยันตัวตนแบบครบวงจร',
      priority: 'required',
      complexity: 'high',
      components: [
        'LoginForm',
        'RegisterForm',
        'ForgotPassword',
        'ResetPassword',
        'EmailVerification',
        'MFASetup',
        'MFAVerify',
        'SocialLogin',
        'MagicLinkForm',
        'SessionManager'
      ],
      dataModels: [
        'User { id, email, passwordHash, firstName, lastName, avatar, emailVerified, mfaEnabled, mfaSecret, provider, createdAt }',
        'Session { id, userId, token, device, ip, expiresAt, lastActiveAt }',
        'MagicLink { id, email, token, expiresAt, usedAt }'
      ],
      integrations: [
        'NextAuth.js',
        'Clerk',
        'Auth0',
        'Supabase Auth',
        'Firebase Auth',
        'TOTP (Google Authenticator)',
        'Passkeys/WebAuthn'
      ],
      pages: [
        '/login',
        '/register',
        '/verify-email',
        '/forgot-password',
        '/reset-password',
        '/mfa/setup',
        '/mfa/verify'
      ]
    },
    billing: {
      name: 'Subscription & Billing',
      description: 'ระบบสมัครสมาชิกและเรียกเก็บเงิน',
      priority: 'required',
      complexity: 'high',
      components: [
        'PricingTable',
        'PlanSelector',
        'CheckoutForm',
        'PaymentMethodForm',
        'BillingHistory',
        'InvoiceList',
        'InvoiceDetail',
        'UpgradeModal',
        'CancelSubscription',
        'UsageDisplay'
      ],
      dataModels: [
        'Plan { id, name, slug, price, interval, features[], limits, stripePriceId }',
        'Subscription { id, userId, orgId, planId, status, currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd, stripeSubscriptionId }',
        'Invoice { id, subscriptionId, amount, status, paidAt, invoiceUrl, stripeInvoiceId }',
        'PaymentMethod { id, userId, type, last4, expiryMonth, expiryYear, isDefault, stripePaymentMethodId }'
      ],
      integrations: [
        'Stripe Billing',
        'Paddle',
        'LemonSqueezy',
        'Chargebee'
      ],
      pages: [
        '/pricing',
        '/checkout',
        '/billing',
        '/billing/invoices',
        '/billing/payment-methods'
      ]
    },
    pricing: {
      name: 'Pricing Plans & Tiers',
      description: 'หน้าแสดงแผนราคา',
      priority: 'required',
      complexity: 'medium',
      components: [
        'PricingSection',
        'PricingCard',
        'FeatureList',
        'FeatureComparison',
        'PricingToggle',
        'PopularBadge',
        'CTAButton',
        'FAQSection'
      ],
      dataModels: [
        'PricingTier { name, monthlyPrice, yearlyPrice, features[], highlighted, cta }',
        'FeatureComparison { feature, free, pro, enterprise }'
      ],
      pages: ['/pricing']
    },
    dashboard: {
      name: 'User Dashboard',
      description: 'แดชบอร์ดหลักสำหรับผู้ใช้',
      priority: 'required',
      complexity: 'high',
      components: [
        'DashboardLayout',
        'Sidebar',
        'TopNav',
        'StatsCards',
        'ChartWidget',
        'ActivityFeed',
        'QuickActions',
        'RecentItems',
        'ProgressWidget'
      ],
      dataModels: [
        'DashboardWidget { id, type, title, data, position, size }',
        'UserStats { userId, metrics[], period }'
      ],
      pages: ['/dashboard', '/app']
    },
    teamManagement: {
      name: 'Team/Organization Management',
      description: 'ระบบจัดการทีมและองค์กร',
      priority: 'required',
      complexity: 'high',
      components: [
        'TeamList',
        'TeamMemberCard',
        'InviteMemberModal',
        'RoleSelector',
        'TeamSettings',
        'PendingInvites',
        'RemoveMemberModal',
        'TransferOwnership'
      ],
      dataModels: [
        'Organization { id, name, slug, logo, ownerId, plan, createdAt }',
        'TeamMember { id, orgId, userId, role, invitedBy, joinedAt }',
        'Invitation { id, orgId, email, role, token, expiresAt, acceptedAt }'
      ],
      pages: [
        '/settings/team',
        '/settings/team/invite',
        '/invite/[token]'
      ]
    },
    rbac: {
      name: 'Role-Based Access Control',
      description: 'ระบบจัดการสิทธิ์ตามบทบาท',
      priority: 'required',
      complexity: 'high',
      components: [
        'RoleManager',
        'PermissionMatrix',
        'RoleCard',
        'PermissionToggle',
        'AccessDenied',
        'ProtectedRoute'
      ],
      dataModels: [
        'Role { id, name, description, permissions[], isDefault, isCustom }',
        'Permission { id, resource, action, description }',
        'UserRole { userId, orgId, roleId }',
        'DefaultRoles: owner | admin | member | viewer'
      ]
    },
    api: {
      name: 'API Integration',
      description: 'ระบบ API สำหรับ integration',
      priority: 'required',
      complexity: 'high',
      components: [
        'APIKeyManager',
        'APIKeyCard',
        'GenerateKeyModal',
        'APIDocsLink',
        'UsageStats',
        'RateLimitDisplay'
      ],
      dataModels: [
        'APIKey { id, userId, orgId, name, keyHash, prefix, permissions[], lastUsedAt, expiresAt, createdAt }',
        'APIUsage { keyId, endpoint, method, statusCode, responseTime, timestamp }'
      ],
      pages: [
        '/settings/api',
        '/settings/api/keys',
        '/docs/api'
      ]
    },
    analytics: {
      name: 'Usage Analytics & Metrics',
      description: 'ระบบวิเคราะห์การใช้งาน',
      priority: 'required',
      complexity: 'high',
      components: [
        'AnalyticsDashboard',
        'UsageChart',
        'MetricCard',
        'TrendIndicator',
        'DateRangePicker',
        'ExportReport'
      ],
      dataModels: [
        'UsageMetric { id, orgId, metric, value, date }',
        'AnalyticsEvent { id, userId, event, properties, timestamp }',
        'Report { id, type, dateRange, data, generatedAt }'
      ],
      integrations: [
        'PostHog',
        'Mixpanel',
        'Amplitude',
        'Custom analytics'
      ],
      pages: ['/analytics', '/reports']
    },
    settings: {
      name: 'Settings & Preferences',
      description: 'การตั้งค่าระบบและผู้ใช้',
      priority: 'required',
      complexity: 'medium',
      components: [
        'SettingsLayout',
        'SettingsSidebar',
        'ProfileSettings',
        'SecuritySettings',
        'NotificationSettings',
        'AppearanceSettings',
        'IntegrationSettings'
      ],
      dataModels: [
        'UserPreferences { userId, theme, language, timezone, notifications }',
        'OrgSettings { orgId, name, logo, domain, features }'
      ],
      pages: [
        '/settings',
        '/settings/profile',
        '/settings/security',
        '/settings/notifications',
        '/settings/appearance'
      ]
    },
    onboarding: {
      name: 'Onboarding Flow',
      description: 'ขั้นตอนแนะนำผู้ใช้ใหม่',
      priority: 'required',
      complexity: 'medium',
      components: [
        'OnboardingWizard',
        'StepIndicator',
        'WelcomeStep',
        'ProfileSetupStep',
        'TeamSetupStep',
        'IntegrationStep',
        'CompletionStep',
        'OnboardingChecklist',
        'ProductTour'
      ],
      dataModels: [
        'OnboardingProgress { userId, currentStep, completedSteps[], skippedSteps[], completedAt }',
        'OnboardingStep { id, title, description, required }'
      ],
      integrations: [
        'Shepherd.js',
        'Intro.js',
        'React Joyride'
      ],
      pages: [
        '/onboarding',
        '/onboarding/profile',
        '/onboarding/team',
        '/onboarding/complete'
      ]
    }
  },
  advanced: {
    adminPanel: {
      name: 'Admin Panel',
      description: 'แผงควบคุมสำหรับ Super Admin',
      priority: 'required',
      complexity: 'high',
      components: [
        'AdminLayout',
        'AdminSidebar',
        'UserManagement',
        'OrgManagement',
        'SystemStats',
        'ConfigPanel',
        'ImpersonateUser'
      ],
      dataModels: [
        'AdminLog { id, adminId, action, targetType, targetId, data, createdAt }',
        'SystemConfig { key, value, type, description }'
      ],
      pages: [
        '/admin',
        '/admin/users',
        '/admin/organizations',
        '/admin/config'
      ]
    },
    auditLogs: {
      name: 'Audit Logs',
      description: 'บันทึกการกระทำในระบบ',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'AuditLogList',
        'AuditLogItem',
        'AuditLogFilter',
        'AuditLogDetail',
        'ExportLogs'
      ],
      dataModels: [
        'AuditLog { id, orgId, userId, action, resource, resourceId, changes, ip, userAgent, createdAt }'
      ],
      pages: ['/settings/audit-logs']
    },
    webhooks: {
      name: 'Webhooks',
      description: 'ระบบ Webhook สำหรับ integration',
      priority: 'recommended',
      complexity: 'high',
      components: [
        'WebhookList',
        'WebhookForm',
        'WebhookEvents',
        'WebhookLogs',
        'TestWebhook',
        'SecretManager'
      ],
      dataModels: [
        'Webhook { id, orgId, url, events[], secret, active, createdAt }',
        'WebhookDelivery { id, webhookId, event, payload, response, statusCode, duration, createdAt }'
      ],
      pages: ['/settings/webhooks']
    },
    notifications: {
      name: 'Notification System',
      description: 'ระบบแจ้งเตือนครบวงจร',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'NotificationBell',
        'NotificationDropdown',
        'NotificationList',
        'NotificationItem',
        'NotificationSettings',
        'PushPrompt'
      ],
      dataModels: [
        'Notification { id, userId, type, title, message, data, read, createdAt }',
        'NotificationPreference { userId, channel, types[], enabled }'
      ],
      integrations: [
        'Firebase FCM',
        'OneSignal',
        'Pusher',
        'Email',
        'Slack',
        'In-app'
      ]
    },
    helpCenter: {
      name: 'Help Center & Documentation',
      description: 'ศูนย์ช่วยเหลือและเอกสาร',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'HelpSearch',
        'ArticleList',
        'ArticleContent',
        'CategoryNav',
        'FeedbackWidget',
        'ContactSupport',
        'ChatWidget'
      ],
      dataModels: [
        'HelpArticle { id, title, slug, content, category, tags[], views, helpful, createdAt }',
        'SupportTicket { id, userId, subject, message, status, priority, assignee, createdAt }'
      ],
      integrations: [
        'Intercom',
        'Zendesk',
        'Crisp',
        'Help Scout'
      ],
      pages: ['/help', '/help/[slug]', '/docs']
    },
    featureFlags: {
      name: 'Feature Flags',
      description: 'ระบบเปิด/ปิด Feature',
      priority: 'optional',
      complexity: 'medium',
      components: [
        'FeatureFlagManager',
        'FlagToggle',
        'RolloutConfig',
        'FeatureGate'
      ],
      dataModels: [
        'FeatureFlag { id, key, name, description, enabled, rolloutPercentage, targetedUsers[], targetedOrgs[] }'
      ],
      integrations: [
        'LaunchDarkly',
        'Flagsmith',
        'PostHog',
        'Custom implementation'
      ]
    },
    multiTenancy: {
      name: 'Multi-tenancy',
      description: 'รองรับหลาย Organization แยกข้อมูล',
      priority: 'required',
      complexity: 'high',
      components: [
        'OrgSwitcher',
        'TenantContext',
        'DataIsolation'
      ],
      dataModels: [
        'Tenant { id, name, slug, settings, database }',
        'TenantUser { tenantId, userId, role }'
      ]
    }
  }
};

// ===========================================
// LANDING PAGE FEATURES
// ===========================================

interface LandingFeatures {
  core: {
    hero: FeatureDetail;
    features: FeatureDetail;
    socialProof: FeatureDetail;
    pricing: FeatureDetail;
    faq: FeatureDetail;
    contactForm: FeatureDetail;
    cta: FeatureDetail;
    responsive: FeatureDetail;
    seo: FeatureDetail;
    analytics: FeatureDetail;
  };
  advanced: {
    abTesting: FeatureDetail;
    animations: FeatureDetail;
    videoBackground: FeatureDetail;
    countdown: FeatureDetail;
    liveChat: FeatureDetail;
  };
}

const landingFeatures: LandingFeatures = {
  core: {
    hero: {
      name: 'Hero Section',
      description: 'ส่วนหัวหน้าเว็บแบบโดดเด่น',
      priority: 'required',
      complexity: 'medium',
      components: [
        'HeroSection',
        'Headline',
        'Subheadline',
        'HeroCTA',
        'HeroImage',
        'HeroVideo',
        'BackgroundPattern',
        'TrustBadges'
      ],
      dataModels: [
        'HeroContent { headline, subheadline, ctaText, ctaLink, image, video }'
      ]
    },
    features: {
      name: 'Features/Benefits Section',
      description: 'แสดงคุณสมบัติและประโยชน์',
      priority: 'required',
      complexity: 'low',
      components: [
        'FeaturesSection',
        'FeatureCard',
        'FeatureIcon',
        'FeatureGrid',
        'FeatureList',
        'BenefitItem'
      ],
      dataModels: [
        'Feature { id, icon, title, description, image }',
        'Benefit { id, title, description, stat }'
      ]
    },
    socialProof: {
      name: 'Social Proof',
      description: 'หลักฐานความน่าเชื่อถือ',
      priority: 'required',
      complexity: 'low',
      components: [
        'TestimonialSection',
        'TestimonialCard',
        'TestimonialSlider',
        'ClientLogos',
        'StatsSection',
        'StatCard',
        'ReviewStars',
        'CaseStudyPreview'
      ],
      dataModels: [
        'Testimonial { id, name, role, company, avatar, content, rating }',
        'Stat { label, value, suffix, prefix }',
        'ClientLogo { name, logo, url }'
      ]
    },
    pricing: {
      name: 'Pricing Section',
      description: 'ส่วนแสดงราคา',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'PricingSection',
        'PricingCard',
        'PricingToggle',
        'FeatureList',
        'PopularBadge',
        'PricingCTA'
      ],
      dataModels: [
        'PricingPlan { name, monthlyPrice, yearlyPrice, features[], highlighted, ctaText }'
      ]
    },
    faq: {
      name: 'FAQ Section',
      description: 'คำถามที่พบบ่อย',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'FAQSection',
        'FAQAccordion',
        'FAQItem',
        'FAQSearch'
      ],
      dataModels: [
        'FAQ { id, question, answer, category, order }'
      ]
    },
    contactForm: {
      name: 'Contact/Lead Capture Form',
      description: 'แบบฟอร์มติดต่อและเก็บ Lead',
      priority: 'required',
      complexity: 'medium',
      components: [
        'ContactForm',
        'LeadForm',
        'NewsletterForm',
        'FormInput',
        'FormSelect',
        'SubmitButton',
        'SuccessMessage'
      ],
      dataModels: [
        'Lead { id, name, email, company, phone, message, source, createdAt }',
        'FormSubmission { id, formId, data, ip, createdAt }'
      ],
      integrations: [
        'HubSpot',
        'Mailchimp',
        'Resend',
        'Google Sheets',
        'Airtable',
        'Zapier'
      ]
    },
    cta: {
      name: 'Call-to-Action Buttons',
      description: 'ปุ่มกระตุ้นการกระทำ',
      priority: 'required',
      complexity: 'low',
      components: [
        'PrimaryButton',
        'SecondaryButton',
        'CTASection',
        'FloatingCTA',
        'StickyCTA'
      ],
      dataModels: [
        'CTA { text, link, variant, icon }'
      ]
    },
    responsive: {
      name: 'Mobile Responsive',
      description: 'รองรับทุกขนาดหน้าจอ',
      priority: 'required',
      complexity: 'medium',
      components: [
        'ResponsiveContainer',
        'MobileMenu',
        'HamburgerIcon',
        'ResponsiveImage',
        'ResponsiveGrid'
      ]
    },
    seo: {
      name: 'SEO Optimization',
      description: 'การปรับแต่ง SEO',
      priority: 'required',
      complexity: 'medium',
      components: [
        'MetaTags',
        'OpenGraph',
        'TwitterCard',
        'JsonLd',
        'Sitemap',
        'Robots'
      ],
      dataModels: [
        'SEOMeta { title, description, keywords, ogImage, canonical }',
        'StructuredData { @type, name, description, url }'
      ],
      integrations: [
        'next-seo',
        'Google Search Console',
        'Schema.org'
      ]
    },
    analytics: {
      name: 'Analytics Integration',
      description: 'ระบบวิเคราะห์ผู้เข้าชม',
      priority: 'required',
      complexity: 'low',
      components: [
        'AnalyticsProvider',
        'ConversionTracker',
        'EventTracker'
      ],
      integrations: [
        'Google Analytics 4',
        'Google Tag Manager',
        'Mixpanel',
        'PostHog',
        'Plausible',
        'Hotjar',
        'Microsoft Clarity'
      ]
    }
  },
  advanced: {
    abTesting: {
      name: 'A/B Testing Ready',
      description: 'ระบบทดสอบ A/B',
      priority: 'optional',
      complexity: 'high',
      components: [
        'ABTestProvider',
        'Variant',
        'ExperimentTracker'
      ],
      dataModels: [
        'Experiment { id, name, variants[], traffic, status, startDate, endDate }',
        'Variant { id, name, weight, conversions, views }',
        'ExperimentResult { experimentId, variantId, userId, converted, timestamp }'
      ],
      integrations: [
        'Google Optimize',
        'Optimizely',
        'VWO',
        'PostHog',
        'Statsig'
      ]
    },
    animations: {
      name: 'Animated Scroll Effects',
      description: 'แอนิเมชันเมื่อเลื่อนหน้า',
      priority: 'recommended',
      complexity: 'medium',
      components: [
        'ScrollAnimation',
        'FadeIn',
        'SlideIn',
        'ParallaxSection',
        'CountUpAnimation',
        'TypewriterText'
      ],
      integrations: [
        'Framer Motion',
        'GSAP',
        'AOS',
        'Lenis'
      ]
    },
    videoBackground: {
      name: 'Video Background/Demo',
      description: 'วิดีโอพื้นหลังและ Demo',
      priority: 'optional',
      complexity: 'medium',
      components: [
        'VideoBackground',
        'VideoPlayer',
        'DemoModal',
        'VideoThumbnail',
        'PlayButton'
      ],
      integrations: [
        'YouTube Embed',
        'Vimeo',
        'Loom',
        'HTML5 Video'
      ]
    },
    countdown: {
      name: 'Countdown Timer',
      description: 'นาฬิกานับถอยหลัง',
      priority: 'optional',
      complexity: 'low',
      components: [
        'CountdownTimer',
        'CountdownDigit',
        'UrgencyBanner'
      ],
      dataModels: [
        'CountdownConfig { targetDate, expiredMessage, showDays, showHours }'
      ]
    },
    liveChat: {
      name: 'Live Chat Widget',
      description: 'วิดเจ็ตแชทสด',
      priority: 'recommended',
      complexity: 'low',
      components: [
        'ChatWidget',
        'ChatBubble',
        'ChatWindow'
      ],
      integrations: [
        'Intercom',
        'Crisp',
        'Drift',
        'Tidio',
        'HubSpot Chat',
        'Zendesk Chat'
      ]
    }
  }
};

// ===========================================
// COMPLETE WEBSITE FEATURES TYPE
// ===========================================

interface CompleteWebsiteFeatures {
  ecommerce: EcommerceFeatures;
  blog: BlogFeatures;
  portfolio: PortfolioFeatures;
  saas: SaaSFeatures;
  landing: LandingFeatures;
}

const websiteFeatures: CompleteWebsiteFeatures = {
  ecommerce: ecommerceFeatures,
  blog: blogFeatures,
  portfolio: portfolioFeatures,
  saas: saasFeatures,
  landing: landingFeatures
};

export {
  websiteFeatures,
  ecommerceFeatures,
  blogFeatures,
  portfolioFeatures,
  saasFeatures,
  landingFeatures
};

export type {
  WebsiteType,
  FeatureDetail,
  Priority,
  Complexity,
  CompleteWebsiteFeatures,
  EcommerceFeatures,
  BlogFeatures,
  PortfolioFeatures,
  SaaSFeatures,
  LandingFeatures
};