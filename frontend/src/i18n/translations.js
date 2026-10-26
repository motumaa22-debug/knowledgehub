/**
 * KnowledgeHub Multilingual Dictionary
 * Languages:
 *  - en: English
 *  - om: Afaan Oromoo
 *  - am: አማርኛ (Amharic)
 */

export const supportedLanguages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'om', name: 'Afaan Oromoo', native: 'Afaan Oromoo', flag: '🌳' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
];

export const translations = {
  // Navigation & Branding
  nav: {
    brandSubtitle: {
      en: 'Digital Knowledge Library',
      om: 'Kuusaa Beekumsaa Dijitaalaa',
      am: 'የዲጂታል እውቀት ቤተ-መጻሕፍት',
    },
    home: {
      en: 'Home',
      om: 'Fuula Duraa',
      am: 'ዋና ገጽ',
    },
    browse: {
      en: 'Browse Library',
      om: 'Kuusaa Dubbisaa',
      am: 'ቤተ-መጻሕፍት',
    },
    translate: {
      en: 'Translate Studio',
      om: 'Hojii Hiikkaa',
      am: 'የትርጉም ማዕከል',
    },
    contribute: {
      en: 'Contribute Work',
      om: 'Gumaachi',
      am: 'አበርክት',
    },
    adminPanel: {
      en: 'Admin Panel',
      om: 'Kutaa Bulchiinsaa',
      am: 'የአስተዳዳሪ ክፍል',
    },
    mySubmissions: {
      en: 'My Submissions',
      om: 'Waan Ani Erge',
      am: 'የእኔ ሥራዎች',
    },
    login: {
      en: 'Sign In',
      om: 'Seensa',
      am: 'ግባ',
    },
    register: {
      en: 'Join Community',
      om: 'Galmaa\'i',
      am: 'ተመዝገብ',
    },
    logout: {
      en: 'Sign Out',
      om: 'Ba\'i',
      am: 'ውጣ',
    },
    switchLanguage: {
      en: 'Language',
      om: 'Afaan',
      am: 'ቋንቋ',
    },
    forgotPassword: {
      en: 'Forgot Password?',
      om: 'Jecha Icchitii Irraanfattee?',
      am: 'የይለፍ ቃል ረሱ?',
    },
  },

  // Hero Section
  hero: {
    pill: {
      en: '✨ Heritage & Modern Knowledge Collective',
      om: '✨ Dhaala fi Beekumsa Ammayyaa Gamtaa',
      am: '✨ የቅርስ እና የዘመናዊ እውቀት ማዕከል',
    },
    titleStart: {
      en: 'Preserve, Discover & Translate',
      om: 'Eegi, Qoradhu fi Hiiki',
      am: 'ጠብቅ፣ ፈልግ እና ተርጉም',
    },
    titleGradient: {
      en: 'Human Knowledge',
      om: 'Beekumsa Ilma Namaa',
      am: 'የሰውን ልጅ እውቀት',
    },
    subtitle: {
      en: 'A multilingual digital library dedicated to books, classical poetry, traditional proverbs, and philosophical works across Afaan Oromoo, English, and Amharic.',
      om: 'Kuusaa dijitaalaa afaan hedduu kitaabota, walaloowwan durii, mammaaksota aadaa fi barreeffamoota falaasamaa Afaan Oromoo, Ingiliffaa fi Amaaraatiif qophaa\'e.',
      am: 'በአፋን ኦሮሞ፣ በእንግሊዝኛ እና በአማርኛ የተዘጋጁ መጻሕፍትን፣ ጥንታዊ ግጥሞችን፣ ምሳሌያዊ አነጋገሮችን እና የፍልስፍና ሥራዎችን የያዘ ባለብዙ ቋንቋ የዲጂታል ቤተ-መጻሕፍት።',
    },
    exploreBtn: {
      en: 'Explore Collection',
      om: 'Kuusaa Sakatta\'i',
      am: 'ስብስቡን አስስ',
    },
    translateBtn: {
      en: 'Open Translate Studio',
      om: 'Gara Hojii Hiikkaatti',
      am: 'የትርጉም ማዕከልን ክፈት',
    },
    contributeBtn: {
      en: 'Submit Literature',
      om: 'Barreeffama Galchi',
      am: 'ጽሑፍ አስገባ',
    },
  },

  // Search & Filters
  search: {
    placeholder: {
      en: 'Search books, proverbs, poems, or authors across all languages...',
      om: 'Kitaabota, mammaaksota, walaloowwan ykn barreessitoota barbaadi...',
      am: 'መጻሕፍት፣ ምሳሌያዊ አነጋገሮች፣ ግጥሞች ወይም ደራሲያን ፈልግ...',
    },
    searchBtn: {
      en: 'Search',
      om: 'Barbaadi',
      am: 'ፈልግ',
    },
    clearBtn: {
      en: 'Clear',
      om: 'Haqi',
      am: 'አጽዳ',
    },
    allCategories: {
      en: 'All Resources',
      om: 'Kuusaawwan Hunda',
      am: 'ሁሉንም ስብስቦች',
    },
    filterBy: {
      en: 'Filter by category:',
      om: 'Gosaan fooyi:',
      am: 'በዓይነት ለይ:',
    },
    showingResults: {
      en: 'Showing',
      om: 'Kan agarsiisu',
      am: 'የቀረበው',
    },
    itemsFound: {
      en: 'archival items found',
      om: 'qabiyyeewwan argaman',
      am: 'የተገኙ ጽሑፎች',
    },
    noItemsFound: {
      en: 'No matching items found',
      om: 'Wanti walsimu hin argamne',
      am: 'ተዛማጅ ጽሑፍ አልተገኘም',
    },
    tryRefining: {
      en: 'Try refining your search terms or selecting a different category.',
      om: 'Jecha barbaaddan fooyyessaa ykn gosa biraa filadhaa.',
      am: 'እባክዎን የፍለጋ ቃላትዎን ይቀይሩ ወይም ሌላ ዓይነት ይምረጡ።',
    },
  },

  // Categories
  categories: {
    books: {
      en: 'Books (PDF)',
      om: 'Kitaabota (PDF)',
      am: 'መጻሕፍት (PDF)',
    },
    proverbs: {
      en: 'Traditional Proverbs',
      om: 'Mammaaksota Oromoo fi Aadaa',
      am: 'ምሳሌያዊ አነጋገሮች',
    },
    poems: {
      en: 'Classical Poems',
      om: 'Walaloowwan Durii',
      am: 'ግጥሞች',
    },
    fiction: {
      en: 'Fiction & Short Stories',
      om: 'Asoosama fi Seenaawwan',
      am: 'ልብ-ወለድ እና አጫጭር ታሪኮች',
    },
  },

  // Content Details & Reader
  reader: {
    backToLibrary: {
      en: '← Back to Library',
      om: '← Gara Kuusaatti Deebi\'i',
      am: '← ወደ ቤተ-መጻሕፍት ተመለስ',
    },
    originalAuthor: {
      en: 'Attributed to / Author',
      om: 'Kan Barreesse / Abbaa Hojii',
      am: 'ደራሲ / ባለቤት',
    },
    contributedBy: {
      en: 'Contributed by',
      om: 'Kan Gumaache',
      am: 'ያበረከተው ሰው',
    },
    readPdf: {
      en: '📖 Read Complete PDF Document',
      om: '📖 Kitaaba PDF Guutuu Dubbisi',
      am: '📖 ሙሉውን የPDF መጽሐፍ አንብብ',
    },
    downloadPdf: {
      en: '📥 Download PDF Document',
      om: '📥 Kitaaba PDF Buufadhu',
      am: '📥 የPDF ሰነዱን አውርድ',
    },
    pdfNotice: {
      en: 'This document is safely stored in the library repository. You can read it directly in your browser or download it to your device.',
      om: 'Barreeffamni kun kuusaa keessatti amansiisummaan kuufameera. Kallattiin dubbisuu ykn buufachuu dandeessu.',
      am: 'ይህ ሰነድ በቤተ-መጻሕፍቱ ማከማቻ ውስጥ በደህንነት ተቀምጧል። በቀጥታ ማንበብ ወይም ማውረድ ይችላሉ።',
    },
    translateTitle: {
      en: 'Translate this Work',
      om: 'Barreeffama Kana Hiiki',
      am: 'ይህንን ጽሑፍ ተርጉም',
    },
    translateSubtitle: {
      en: 'Translate text between Afaan Oromoo, English, and Amharic in real time.',
      om: 'Barreeffama kana Afaan Oromoo, Ingiliffaa fi Amaara gidduutti kallattiin hiikaa.',
      am: 'ይህንን ጽሑፍ በአፋን ኦሮሞ፣ በእንግሊዝኛ እና በአማርኛ መካከል በቀጥታ ይተርጉሙ።',
    },
    translating: {
      en: 'Translating across languages...',
      om: 'Afaanota gidduutti hiikamaa jira...',
      am: 'ወደ ተመረጠው ቋንቋ በመተርጎም ላይ...',
    },
    viewOriginal: {
      en: 'View Original Text',
      om: 'Barreeffama Jalqabaa Ilaali',
      am: 'ዋናውን ጽሑፍ ተመልከት',
    },
    viewTranslation: {
      en: 'View Translation',
      om: 'Hiikaa Ilaali',
      am: 'ትርጉሙን ተመልከት',
    },
  },

  // Translate Studio Page
  translateStudio: {
    badge: {
      en: '🌐 Trilingual Translation Studio',
      om: '🌐 Hojii Hiikkaa Afaan Sadii',
      am: '🌐 የሦስት ቋንቋዎች የትርጉም ማዕከል',
    },
    title: {
      en: 'Afaan Oromoo • English • Amharic Translation',
      om: 'Hiikkaa Afaan Oromoo • Ingiliffaa • Amaaraa',
      am: 'የአፋን ኦሮሞ • የእንግሊዝኛ • የአማርኛ ትርጉም',
    },
    subtitle: {
      en: 'Seamless two-way and three-way translation powered by multi-engine neural systems with cultural idiom adaptation.',
      om: 'Afaanota sadeen gidduutti kallattii fi amansiisummaan akka aadaa fi qooqaatti hiikaa.',
      am: 'በሦስቱም ቋንቋዎች መካከል የባህል እና የይዘት ትክክለኛነትን የጠበቀ የቀጥታ ትርጉም አገልግሎት።',
    },
    sourceLang: {
      en: 'From Language',
      om: 'Afaan Irraa',
      am: 'መነሻ ቋንቋ',
    },
    targetLang: {
      en: 'To Language',
      om: 'Afaan Gara',
      am: 'መዳረሻ ቋንቋ',
    },
    swapTooltip: {
      en: 'Swap languages',
      om: 'Afaanota waljijjiiri',
      am: 'ቋንቋዎችን አቀያይር',
    },
    inputPlaceholder: {
      en: 'Type, paste, or pick a cultural phrase below to translate...',
      om: 'Jecha, mammaaksa ykn hima hiikuu barbaaddan asitti barreessaa...',
      am: 'ለመተርጎም የሚፈልጉትን ቃል፣ ምሳሌያዊ አነጋገር ወይም ጽሑፍ እዚህ ይጻፉ...',
    },
    outputPlaceholder: {
      en: 'Translation will appear here instantly...',
      om: 'Hiikaan kallattiin asirratti mul\'ata...',
      am: 'ትርጉሙ እዚህ ላይ ወዲያውኑ ይታያል...',
    },
    translateBtn: {
      en: 'Translate Text',
      om: 'Hiiki',
      am: 'ተርጉም',
    },
    copyBtn: {
      en: 'Copy to Clipboard',
      om: 'Waraabi',
      am: 'ቅዳ',
    },
    copied: {
      en: 'Copied!',
      om: 'Waraabameera!',
      am: 'ተቀድቷል!',
    },
    listenBtn: {
      en: 'Listen / Pronounce',
      om: 'Dhaggeeffadhu',
      am: 'አድምጥ',
    },
    clearBtn: {
      en: 'Clear All',
      om: 'Haqi',
      am: 'አጽዳ',
    },
    samplesTitle: {
      en: 'Popular Cultural Phrases & Proverbs to Try:',
      om: 'Mammaaksota fi Jechoota Filataman:',
      am: 'ለመሞከር የተመረጡ ምሳሌያዊ አነጋገሮች እና አባባሎች:',
    },
  },

  // Membership Access Control
  membership: {
    requiredBadge: {
      en: '🔒 Members Only',
      om: '🔒 Miseensota Qofaaf',
      am: '🔒 ለአባላት ብቻ',
    },
    accessRequiredTitle: {
      en: 'Member Registration Required',
      om: 'Galmee Miseensummaa Barbaachisa',
      am: 'የአባልነት ምዝገባ ያስፈልጋል',
    },
    accessRequiredMsg: {
      en: 'To protect intellectual property and community literature, full document reading and PDF downloads are exclusively reserved for registered members.',
      om: 'Qabiyyee seenaa fi kitaabota eeguuf, barreeffama guutuu dubbisuu fi PDF buufachuun miseensota galmaa\'aniif qofa hayyamama.',
      am: 'የጽሑፍ ባለቤትነትን እና የቤተ-መጻሕፍቱን ይዘት ለመጠበቅ፣ ሙሉ ሰነዶችን ማንበብ እና PDF ማውረድ ለተመዘገቡ አባላት ብቻ የተፈቀደ ነው።',
    },
    signInToRead: {
      en: 'Sign In to Access',
      om: 'Seenaa Dubbisaa',
      am: 'ገብተው ያንብቡ',
    },
    registerFree: {
      en: 'Register for Free &rarr;',
      om: 'Bilisaan Galmaa\'aa &rarr;',
      am: 'በነፃ ይመዝገቡ &rarr;',
    },
    downloadRequiresMember: {
      en: 'Registered members can download this complete PDF document.',
      om: 'Miseensonni galmaa\'an qofti kitaaba PDF kana buufachuu danda\'u.',
      am: 'የተመዘገቡ አባላት ብቻ ይህንን የPDF ሰነድ ማውረድ ይችላሉ።',
    },
    guestBannerNotice: {
      en: '💡 Browsing is open to all visitors. Sign in or register to read full publications, access archives, and download PDFs.',
      om: '💡 Kuusaa daawwachuun nama hundaaf banaadha. Barreeffamoota dubbisuu fi PDF buufachuuf seenuu ykn galmaa\'uu qabdu.',
      am: '💡 ቤተ-መጻሕፍቱን ማሰስ ለሁሉም ክፍት ነው። ሙሉ ጽሑፎችን ለማንበብ እና PDF ለማውረድ እባክዎን ይግቡ ወይም ይመዝገቡ።',
    },
  },

  // Forgot Password / Password Reset Flow
  forgotPassword: {
    badge: {
      en: '🔐 Account Recovery',
      om: '🔐 Deebisanii Argachuu Herregaa',
      am: '🔐 አካውንት ማስመለሻ',
    },
    title: {
      en: 'Reset Your Password',
      om: 'Jecha Icchitii Haaromsi',
      am: 'የይለፍ ቃልዎን ይቀይሩ',
    },
    subtitle: {
      en: 'Enter your registered email address or username. We will send a 4-digit code to securely reset your password.',
      om: 'Imeelii ykn maqaa fayyadamaa galmeessitan galchaa. Koodii lakkoofsa 4 qabu isiniif ergina.',
      am: 'የተመዘገቡበትን ኢሜይል ወይም የተጠቃሚ ስም ያስገቡ። የይለፍ ቃልዎን በደህና ለመቀየር ባለ 4 ዲጂት ኮድ እንልክልዎታለን።',
    },
    step2Title: {
      en: 'Set Your New Password',
      om: 'Jecha Icchitii Haaraa Galchaa',
      am: 'አዲስ የይለፍ ቃል ያዘጋጁ',
    },
    step2Subtitle: {
      en: 'Enter the 4-digit verification code received in your email inbox along with your new password.',
      om: 'Koodii lakkoofsa 4 gara imeelii keessaniitti ergame fi jecha icchitii haaraa galchaa.',
      am: 'ወደ ኢሜይልዎ የተላከውን ባለ 4 ዲጂት ኮድ እና አዲሱን የይለፍ ቃልዎን ያስገቡ።',
    },
    emailLabel: {
      en: 'Registered Email or Username',
      om: 'Imeelii Galmaa\'e ykn Maqaa Fayyadamaa',
      am: 'የተመዘገበ ኢሜይል ወይም የተጠቃሚ ስም',
    },
    sendBtn: {
      en: 'Send 4-Digit Reset Code &rarr;',
      om: 'Koodii Haaromsaa Ergi &rarr;',
      am: 'የመቀየሪያ ኮድ ላክ &rarr;',
    },
    codeLabel: {
      en: '4-Digit Verification Code',
      om: 'Koodii Mirkaneessaa Lakkoofsa 4',
      am: 'ባለ 4 ዲጂት የማረጋገጫ ኮድ',
    },
    newPasswordLabel: {
      en: 'New Password (min 6 characters)',
      om: 'Jecha Icchitii Haaraa (yoo xiqqaate qubee 6)',
      am: 'አዲስ የይለፍ ቃል (ቢያንስ 6 ፊደላት)',
    },
    confirmPasswordLabel: {
      en: 'Confirm New Password',
      om: 'Jecha Icchitii Haaraa Mirkaneessi',
      am: 'አዲሱን የይለፍ ቃል ያረጋግጡ',
    },
    resetBtn: {
      en: 'Reset Password & Sign In &rarr;',
      om: 'Jecha Icchitii Haaromsi & Seeni &rarr;',
      am: 'የይለፍ ቃል ቀይረህ ግባ &rarr;',
    },
    backToLogin: {
      en: 'Back to Sign In',
      om: 'Gara Seensaatti Deebi\'i',
      am: 'ወደ መግቢያ ተመለስ',
    },
    resendCode: {
      en: 'Resend Reset Code',
      om: 'Koodii Irra Deebiin Ergi',
      am: 'ኮዱን በድጋሚ ላክ',
    },
    successTitle: {
      en: 'Password Reset Complete!',
      om: 'Jechi Icchitii Milkaa\'inaan Haaromeera!',
      am: 'የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል!',
    },
    successMsg: {
      en: 'Your password has been securely updated. Redirecting you to your account...',
      om: 'Jechi icchitii keessan amansiisummaan haaromeera. Gara herrega keessaniitti isin ceesisaa jira...',
      am: 'የይለፍ ቃልዎ በሚገባ ተቀይሯል። በቀጥታ ወደ አካውንትዎ እየገባ ነው...',
    },
  },

  // Dedicated Landing Page Experience
  landing: {
    heroBadge: {
      en: '✨ Heritage & Modern Knowledge Collective',
      om: '✨ Dhaala fi Beekumsa Ammayyaa Gamtaa',
      am: '✨ የቅርስ እና የዘመናዊ እውቀት ማዕከል',
    },
    heroHeading: {
      en: 'Empowering Heritage & Knowledge Through Trilingual Learning',
      om: 'Aadaa fi Beekumsa Barumsa Afaan Sadeeniin Gabbisuu',
      am: 'በባለሦስት ቋንቋ ትምህርት ቅርሶችን እና እውቀትን ማጎልበት',
    },
    heroSubheading: {
      en: 'Discover, read, and translate classical books, traditional proverbs, lyrical poetry, and literary fiction across Afaan Oromoo, English, and Amharic with verified community stewardship.',
      om: 'Kitaabota durii, mammaaksota aadaa, walaloowwan fi asoosamoota Afaan Oromoo, Ingiliffaa fi Amaaraa sakatta\'aa, dubbisaa, hiikaa.',
      am: 'በአፋን ኦሮሞ፣ በእንግሊዝኛ እና በአማርኛ የተዘጋጁ መጻሕፍትን፣ ምሳሌያዊ አነጋገሮችን፣ ግጥሞችን እና ልብ-ወለዶችን ያግኙ፣ ያንብቡ እና ይተርጉሙ።',
    },
    getStarted: {
      en: 'Join for Free &rarr;',
      om: 'Bilisaan Seeni &rarr;',
      am: 'በነፃ ይቀላቀሉ &rarr;',
    },
    exploreLibrary: {
      en: 'Browse Catalog &rarr;',
      om: 'Kuusaa Sakatta\'i &rarr;',
      am: 'ቤተ-መጻሕፍቱን አስስ &rarr;',
    },
    stats: {
      readers: {
        en: 'Active Readers & Scholars',
        om: 'Dubbistoota fi Qorattoota',
        am: 'ንቁ አንባቢዎች እና ተመራማሪዎች',
      },
      publications: {
        en: 'Archived Documents & Books',
        om: 'Barreeffamoota fi Kitaabota',
        am: 'የተመዘገቡ ሰነዶች እና መጻሕፍት',
      },
      languages: {
        en: 'Integrated Languages',
        om: 'Afaanota Walitti Qindaa\'an',
        am: 'የተካተቱ ቋንቋዎች',
      },
      freeAccess: {
        en: 'Open Access & Verified',
        om: 'Bilisa fi Mirkanaa\'aa',
        am: 'ነፃ እና የተረጋገጠ',
      },
    },
    pillarsTitle: {
      en: 'Built for Cultural Preservation & Academic Excellence',
      om: 'Aadaa Eeguu fi Qorannoo Barnootaaf Kan Qophaa\'e',
      am: 'ባህልን ለመጠበቅ እና ለአካዳሚክ ዕድገት የተዘጋጀ',
    },
    pillarsSubtitle: {
      en: 'Explore the core technologies and features powering the KnowledgeHub digital ecosystem.',
      om: 'Teknolojiiwwan bu\'uuraa fi tajaajiloota KnowledgeHub dandeessisan sakatta\'aa.',
      am: 'የKnowledgeHub የዲጂታል ሥርዓትን የሚያንቀሳቅሱ ዋና ቴክኖሎጂዎችን እና አገልግሎቶችን ያስሱ።',
    },
    pillar1: {
      title: {
        en: 'Authenticated PDF Vault',
        om: 'Kuusaa Kitaabota PDF Mirkanaa\'aa',
        am: 'የተረጋገጠ የPDF መጻሕፍት ማከማቻ',
      },
      desc: {
        en: 'Read and download high-resolution academic books, manuscripts, and reference guides protected by member-level authentication.',
        om: 'Kitaabota barnootaa, barruulee qorannoo fi qajeelchawwan amansiisummaan dubbisaa fi buufadhaa.',
        am: 'በአባላት ደረጃ የተጠበቁ ከፍተኛ ጥራት ያላቸውን የጥናት መጻሕፍት፣ ሰነዶች እና መመሪያዎችን ያንብቡ እና ያውርዱ።',
      },
    },
    pillar2: {
      title: {
        en: 'Trilingual Neural Translation',
        om: 'Hojii Hiikkaa Afaan Sadii',
        am: 'የሦስት ቋንቋዎች የቀጥታ ትርጉም',
      },
      desc: {
        en: 'Instantly bridge Afaan Oromoo, English, and Amharic with neural multi-engine translation adapted for cultural idioms and proverbs.',
        om: 'Afaan Oromoo, Ingiliffaa fi Amaara gidduutti qooqaa fi aadaa eeguun kallattiin hiikaa.',
        am: 'የቋንቋ ባህልን እና ፈሊጦችን በጠበቀ መልኩ በአፋን ኦሮሞ፣ በእንግሊዝኛ እና በአማርኛ መካከል ወዲያውኑ ይተርጉሙ።',
      },
    },
    pillar3: {
      title: {
        en: 'Indigenous Wisdom Archives',
        om: 'Kuusaa Mammaaksaa fi Aadaa',
        am: 'የባህላዊ ጥበቦች እና ምሳሌዎች ማህደር',
      },
      desc: {
        en: 'Safeguard oral traditions, Oromo proverbs (Mammaaksa), Amharic proverbs, and classical poetic verse for future generations.',
        om: 'Mammaaksota Oromoo, mammaaksota Amaaraa fi walaloowwan durii dhaloota dhufuuf amansiisummaan tursiisaa.',
        am: 'የቃል ቅርሶችን፣ የአፋን ኦሮሞ እና የአማርኛ ምሳሌያዊ አነጋገሮችን እና ጥንታዊ ግጥሞችን ለመጪው ትውልድ ጠብቀው ያቆዩ።',
      },
    },
    pillar4: {
      title: {
        en: 'Community Editorial Review',
        om: 'Mirkaneessa Gumaata Hawaasaa',
        am: 'የማህበረሰብ ጽሑፎች ማረጋገጫ',
      },
      desc: {
        en: 'Contribute literature, upload research, and participate in peer-reviewed community publishing with email verification.',
        om: 'Barreeffama galchaa, qorannoo fe\'aa, fi sirna mirkaneessa hawaasaa keessatti hirmaadhaa.',
        am: 'ጽሑፎችን ያበርክቱ፣ ጥናቶችን ይጫኑ እና በታመነ የማህበረሰብ የጽሑፍ ማረጋገጫ ሥርዓት ውስጥ ይሳተፉ።',
      },
    },
    howItWorksTitle: {
      en: 'How KnowledgeHub Works',
      om: 'KnowledgeHub Akkamitti Hojjeta?',
      am: 'KnowledgeHub እንዴት ይሰራል?',
    },
    howItWorksSubtitle: {
      en: 'A seamless journey from guest discovery to verified member research and global cultural contribution.',
      om: 'Daawwannaa irraa gara miseensummaa mirkanaa\'etti fi gumaacha aadaa addunyaatti.',
      am: 'ከቀላል ፍለጋ ጀምሮ እስከ ተረጋገጠ አባልነት እና የባህል አስተዋጽዖ ድረስ የቀለለ ጉዞ።',
    },
    step1: {
      title: {
        en: '1. Discover & Search',
        om: '1. Sakatta\'i fi Barbaadi',
        am: '1. ፈልግ እና አስስ',
      },
      desc: {
        en: 'Browse the open public catalog by domain, filter by language or literary genre, and search instant titles.',
        om: 'Kuusaa banaa hunda sakatta\'aa, afaaniin ykn gosaan fooyyaa, mata dureewwan barbaadaa.',
        am: 'ክፍት ካታሎጉን በዓይነት ያስሱ፣ በቋንቋ ይለዩ እና የሚፈልጉትን ርዕስ በፍጥነት ያግኙ።',
      },
    },
    step2: {
      title: {
        en: '2. Register & Verify Email',
        om: '2. Galmaa\'i fi Imeelii Mirkaneessi',
        am: '2. ይመዝገቡ እና ኢሜይልዎን ያረጋግጡ',
      },
      desc: {
        en: 'Create your free account and receive a 4-digit OTP directly in your email inbox to unlock reading access.',
        om: 'Herrega bilisaa banadhaa, koodii lakkoofsa 4 imeelii keessaniin mirkaneessuun dubbisuu eegalaa.',
        am: 'ነፃ አካውንት ይክፈቱ እና ንባብን ለማስጀመር ወደ ኢሜይልዎ የሚላከውን ባለ 4 ዲጂት ኮድ ያረጋግጡ።',
      },
    },
    step3: {
      title: {
        en: '3. Read, Download & Publish',
        om: '3. Dubbisi, Buufadhu fi Galchi',
        am: '3. ያንብቡ፣ ያውርዱ እና ያሳትሙ',
      },
      desc: {
        en: 'Enjoy full-screen editorial reader layout, download verified PDF books, translate idioms, and submit your works.',
        om: 'Barreeffama guutuu dubbisaa, kitaabota PDF buufadhaa, jechoota hiikaa, hojii keessan gumaachaa.',
        am: 'ሙሉ ጽሑፎችን ያንብቡ፣ የPDF መጻሕፍትን ያውርዱ፣ ቃላትን ይተርጉሙ እና የእርስዎን ሥራዎች ያበርክቱ።',
      },
    },
    wisdomTitle: {
      en: 'Cultural Wisdom Spotlight',
      om: 'Ibsa Beekumsa Aadaa',
      am: 'የባህላዊ ጥበቦች ማዕከል',
    },
    wisdomSubtitle: {
      en: 'Explore timeless proverbs and literature preserved in their original tongue with live translation.',
      om: 'Mammaaksota fi barreeffamoota durii afaan dhalootaatiin eegaman hiikkaa kallattiin qoradhaa.',
      am: 'በዋና ቋንቋቸው የተጠበቁ ድንቅ ምሳሌያዊ አነጋገሮችን እና ጽሑፎችን በቀጥታ ትርጉም ይመልከቱ።',
    },
    testimonialsTitle: {
      en: 'Trusted by Readers, Researchers & Writers',
      om: 'Dubbistoota, Qorattoota fi Barreessitootaan Kan Jaallatame',
      am: 'በአንባቢዎች፣ በተመራማሪዎች እና በጸሐፊዎች የተመሰገነ',
    },
    testimonialsSubtitle: {
      en: 'See what scholars and students say about discovering and archiving knowledge on KnowledgeHub.',
      om: 'Barattoonni fi qorattoonni waa\'ee KnowledgeHub maal akka jedhan dubbisaa.',
      am: 'ተማሪዎች እና ተመራማሪዎች ስለ KnowledgeHub የሰጡትን አስተያየት ይመልከቱ።',
    },
    faqTitle: {
      en: 'Frequently Asked Questions',
      om: 'Gaaffiilee Yeroo Baay\'ee Gaafataman',
      am: 'ተደጋግመው የሚጠየቁ ጥያቄዎች',
    },
    faqSubtitle: {
      en: 'Everything you need to know about reading, downloading, translating, and contributing.',
      om: 'Wanti waa\'ee dubbisuu, buufachuu, hiikuu fi gumaachuu beekuu qabdan hundi as jira.',
      am: 'ስለ ማንበብ፣ ማውረድ፣ መተርጎም እና ማበርከት ማወቅ የሚፈልጉት ነገር ሁሉ።',
    },
    bottomCtaTitle: {
      en: 'Ready to Explore Thousands of Heritage & Digital Books?',
      om: 'Kitaabota Seenaa fi Dijitaalaa Kumaatama Sakatta\'uuf Qophiidhaa?',
      am: 'በሺዎች የሚቆጠሩ ታሪካዊ እና ዲጂታል መጻሕፍትን ለማሰስ ዝግጁ ነዎት?',
    },
    bottomCtaSubtitle: {
      en: 'Join our growing community today. Access full documents, download authenticated PDFs, and contribute to cultural preservation.',
      om: 'Hawaasa keenya har\'a dabalamaa. Barreeffamoota guutuu dubbisaa, PDF buufadhaa, aadaa eegaa.',
      am: 'ዛሬውኑ ማህበረሰባችንን ይቀላቀሉ። ሙሉ ሰነዶችን ያግኙ፣ PDF ያውርዱ እና ባህልን በማቆየት ይሳተፉ።',
    },
    createFreeAccount: {
      en: 'Create Free Account &rarr;',
      om: 'Herrega Bilisaa Bani &rarr;',
      am: 'ነፃ አካውንት ይክፈቱ &rarr;',
    },
    openTranslateStudio: {
      en: '🌐 Open Translate Studio',
      om: '🌐 Hojii Hiikkaa Bani',
      am: '🌐 የትርጉም ማዕከልን ክፈት',
    },
  },

  // Footer
  footer: {
    tagline: {
      en: 'A sanctuary for written heritage, literary expressions, and collective human wisdom.',
      om: 'Iddoo seenaan, aadaa fi beekumsi ilma namaa amansiisummaan itti eegamu.',
      am: 'የጽሑፍ ቅርሶች፣ የባህል ጥበቦች እና የሰው ልጅ እውቀት በክብር የሚጠበቁበት ዓለም።',
    },
    rights: {
      en: 'All rights reserved. Dedicated to open learning.',
      om: 'Mirgi qabiyyee hundaa eegamaadha. Barumsa bilisaatiif kan qophaa\'e.',
      am: 'መብቱ በህግ የተጠበቀ ነው። ለነፃ ትምህርት የቀረበ።',
    },
  },
};

export default translations;
