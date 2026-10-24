import type { Content, I18n } from '@/domain/types';

/**
 * Built-in content, taken from the CV (German academic CV, Aug 2026, and the
 * engineering résumé). Used when Firestore has nothing published yet, and
 * loadable into the admin draft ("Load content from code").
 *
 * Bangla/German are given only where the English matches the reviewed drafts;
 * anything without bn/de falls back to English. Items marked `draft` are
 * placeholders kept for filling in from the admin — they never reach the site.
 */
const T = (en: string, bn?: string, de?: string): I18n => ({ en, ...(bn ? { bn } : {}), ...(de ? { de } : {}) });
const pub = 'published' as const;
const draft = 'draft' as const;
const GH = 'https://github.com/mishad01';

/**
 * Bump to push a new built-in content release: on the owner's next admin
 * sign-in it replaces the draft and is published automatically (one time per
 * version). This overwrites admin edits, so bump only for deliberate content
 * migrations.
 */
export const SEED_VERSION = '2026-10-24-cv';

export const seed: Content = {
  seedVersion: SEED_VERSION,
  profile: {
    displayName: T('Mishad', 'মিশাদ', 'Mishad'),
    fullName: 'Md. Sakif Rahaman Mishad',
    heroRole: T(
      'Full-stack software engineer · Brain Station 23, Dhaka',
      'ফুল-স্ট্যাক সফটওয়্যার ইঞ্জিনিয়ার · ব্রেইন স্টেশন ২৩, ঢাকা',
      'Full-Stack Software Engineer · Brain Station 23, Dhaka',
    ),
    heroPos: T(
      'Full-stack engineer. I ship production mobile apps with Flutter, build the backends behind them — and teach others to do the same.',
      'ফুল-স্ট্যাক ইঞ্জিনিয়ার। ফ্লাটার দিয়ে প্রোডাকশন মোবাইল অ্যাপ বানাই, তার ব্যাকএন্ডও গড়ি — এবং অন্যদের শেখাই।',
      'Full-Stack-Entwickler. Ich liefere produktive Mobile-Apps mit Flutter, baue die Backends dazu – und bringe anderen bei, es auch zu tun.',
    ),
    avail: T(
      'Open to Werkstudent roles in Germany from 2027',
      '২০২৭ থেকে জার্মানিতে ওয়ার্কস্টুডেন্ট পদের জন্য উন্মুক্ত',
      'Offen für Werkstudentenstellen in Deutschland ab 2027',
    ),
    stack: ['Flutter', 'Dart', 'TypeScript', 'Node.js', 'Firebase', 'GraphQL'],
    photos: {},
    nowUpdated: '2026-10-24',
    teachPlatform: 'Ostad',
    teachRole: T('Flutter & AI instructor (part-time)', 'ফ্লাটার ও এআই ইন্সট্রাক্টর (খণ্ডকালীন)', 'Flutter- & KI-Dozent (Teilzeit)'),
    teachTopics: ['Flutter', 'Dart', 'AI integration', 'State management', 'Clean Architecture', 'Firebase', 'REST APIs'],
    achievement: T(
      [
        'ICPC Asia Dhaka Regional — Honorable Mention',
        'Learnathon 3.0 — Runners-up, Flutter stack (500 selected from 3,000+ applicants)',
        '400+ problems solved on LeetCode and Codeforces',
        'Intra-University Programming Contest — Top 10',
        'B.Sc. graduated Cum Laude',
      ].join('\n'),
    ),
  },
  contact: {
    email: 'sakifmishad@gmail.com',
    github: GH,
    linkedin: 'https://linkedin.com/in/[handle]',
    cv: '/cv.pdf',
  },
  now: [
    { id: 'building', status: pub, icon: 'work', tone: 'primary', label: T('Building', 'নির্মাণ', 'Entwickle'), text: T('Production Flutter apps at Brain Station 23 — Shopify commerce and a live stock-trading app.') },
    { id: 'teaching', status: pub, icon: 'school', tone: 'secondary', label: T('Teaching', 'শেখাচ্ছি', 'Lehre'), text: T('The live “App Development with Flutter & AI” course at Ostad.') },
    { id: 'side', status: pub, icon: 'rocket_launch', tone: 'tertiary', label: T('Side project', 'সাইড প্রজেক্ট', 'Nebenprojekt'), text: T('EduBridge — a free, open-source learning platform.', 'এডুব্রিজ — বিনামূল্যের ওপেন-সোর্স লার্নিং প্ল্যাটফর্ম।', 'EduBridge – eine kostenlose Open-Source-Lernplattform.') },
    { id: 'learning', status: pub, icon: 'menu_book', tone: 'secondary', label: T('Learning', 'শিখছি', 'Lerne'), text: T('German (A1, in progress) — getting ready for Germany.', 'জার্মান ভাষা (A1, চলছে) — জার্মানির প্রস্তুতি।', 'Deutsch (A1, in Arbeit) – Vorbereitung auf Deutschland.') },
    { id: 'next', status: pub, icon: 'flight_takeoff', tone: 'primary', label: T('Next', 'পরবর্তী ধাপ', 'Als Nächstes'), text: T('MSc Software Engineering in Germany, Summer 2027.', 'জার্মানিতে এমএসসি সফটওয়্যার ইঞ্জিনিয়ারিং, গ্রীষ্ম ২০২৭।', 'MSc Software Engineering in Deutschland, Sommer 2027.') },
  ],
  experience: [
    {
      id: 'bs23', status: pub, role: T('Software Engineer I', 'সফটওয়্যার ইঞ্জিনিয়ার I', 'Software Engineer I'), org: 'Brain Station 23 PLC', start: '2025-07', end: 'present',
      location: T('Dhaka, Bangladesh', 'ঢাকা, বাংলাদেশ', 'Dhaka, Bangladesch'),
      summary: T('Building and shipping production mobile applications.', 'প্রোডাকশন মোবাইল অ্যাপ তৈরি ও রিলিজ।', 'Entwicklung und Release produktiver Mobile-Apps.'),
      bullets: [
        T('Built scalable data layers over REST (Dio + Retrofit) and GraphQL, integrating the Shopify Storefront API with a custom backend.'),
        T('Applied clean architecture and Riverpod state management across 20+ feature domains.'),
        T('Integrated Firebase Cloud Messaging with deep linking; set up dev / UAT / production environments with Shorebird OTA updates.'),
        T('Managed Android and iOS releases — build configuration, signing and store deployment.'),
      ],
      skills: ['Flutter', 'Dart', 'Riverpod', 'GraphQL', 'REST', 'Firebase', 'Shorebird'],
    },
    {
      id: 'ostad-pt', status: pub, role: T('Flutter & AI Instructor (part-time)', 'ফ্লাটার ও এআই ইন্সট্রাক্টর (খণ্ডকালীন)', 'Flutter- & KI-Dozent (Teilzeit)'), org: 'Ostad Limited', start: '2026-02', end: 'present',
      location: T('Remote'),
      summary: T('Teaching the live “App Development with Flutter & AI” course.'),
      bullets: [
        T('Take learners from fundamentals to production-level Flutter development with real-world AI integration.'),
        T('Structured lessons, hands-on practice and live feedback.'),
      ],
      skills: ['Flutter', 'Dart', 'AI'],
    },
    {
      id: 'learnathon', status: pub, role: T('Apprentice, Learnathon 3.0', 'অ্যাপ্রেন্টিস, লার্নাথন ৩.০', 'Apprentice, Learnathon 3.0'), org: 'Geeky Solutions · sponsored by Brain Station 23', start: '2025-01', end: '2025-04',
      location: T('Bangladesh'),
      summary: T('National apprenticeship programme — 500 selected from 3,000+ applicants.'),
      bullets: [T('Runners-up in the Flutter stack.')],
      skills: ['Flutter'],
    },
    {
      id: 'ostad-ft', status: pub, role: T('Flutter Instructor (full-time)', 'ফ্লাটার ইন্সট্রাক্টর (পূর্ণকালীন)', 'Flutter-Dozent (Vollzeit)'), org: 'Ostad Limited', start: '2024-01', end: '2025-07',
      location: T('Dhaka, Bangladesh', 'ঢাকা, বাংলাদেশ', 'Dhaka, Bangladesch'),
      summary: T('Taught Flutter and Dart to cohorts of students.', 'শিক্ষার্থীদের ফ্লাটার ও ডার্ট শেখানো।', 'Flutter und Dart für Studierendengruppen.'),
      bullets: [],
      skills: ['Flutter', 'Dart'],
    },
    {
      id: 'maverick', status: pub, role: T('Software Developer', 'সফটওয়্যার ডেভেলপার', 'Software Developer'), org: 'Maverick Softwares', start: '2024-01', end: '2024-12',
      location: T('Hybrid'),
      summary: T('Developed and maintained Flutter mobile applications in a hybrid team.'),
      bullets: [
        T('Feature development and bug fixes on an HR platform.'),
        T('Improved app performance through optimisation and efficient state management.'),
      ],
      skills: ['Flutter', 'Dart'],
    },
    { id: 'educc', status: draft, role: T('Sub-Executive'), org: 'EDU Computer Club', start: '', end: '', location: T('Chattogram'), summary: T('[One-line summary]'), bullets: [], skills: [] },
  ],
  projects: [
    { id: 'choice', status: pub, name: T('Choice Legacy'), desc: T('Production Shopify e-commerce app: Storefront API over GraphQL with a custom backend, rich media, FCM push with deep linking, multi-environment builds and OTA updates. Live on Play Store and App Store (client work).'), stack: ['Flutter', 'GraphQL', 'Shopify', 'Firebase', 'Riverpod'], primaryUrl: '', links: [], images: [] },
    { id: 'shanta', status: pub, name: T('Shanta EasyX'), desc: T('Stock-market app for Shanta Securities, a leading Bangladeshi brokerage: real-time market data, portfolio monitoring and instant transactions. Live on both stores (client work).'), stack: ['Flutter', 'REST', 'Clean Architecture'], primaryUrl: '', links: [], images: [] },
    { id: 'edubridge', status: pub, name: T('EduBridge', 'এডুব্রিজ', 'EduBridge'), desc: T('Open-source, community-driven learning platform for Grades 8–12 and IELTS learners in Bangladesh — peer-to-peer video, notes and MCQs in Bengali, with contributor rewards.'), stack: ['Flutter', 'MVVM', 'Supabase', 'PostgreSQL'], primaryUrl: GH, links: [{ type: 'github', url: GH }], images: [] },
    { id: 'kedibe', status: pub, name: T('Ke Dibe?', 'কে দিবে?', 'Ke Dibe?'), desc: T('Bangla Android app that tracks whose turn it is to pay — and who owes treats — in friend groups and office teams.', 'বন্ধুদের দল ও অফিসে কার পালা, কে ট্রিট বাকি রেখেছে — তার হিসাব রাখার বাংলা অ্যান্ড্রয়েড অ্যাপ।', 'Bangla-Android-App, die festhält, wer in Freundeskreisen und Büroteams als Nächstes zahlt oder noch einen Ausgeben schuldet.'), stack: ['Flutter', 'Clean Architecture'], primaryUrl: GH, links: [{ type: 'github', url: GH }], images: [] },
    { id: 'budget-bondhu', status: pub, name: T('Budget Bondhu'), desc: T('Travel and hospitality booking app with discounted hotel, restaurant and resort reservations.'), stack: ['Flutter', 'REST', 'Clean Architecture'], primaryUrl: '', links: [], images: [] },
    { id: 'ai-assistant', status: pub, name: T('AI Image & Chat Assistant'), desc: T('Generative image synthesis and a conversational assistant in a single Flutter client, over third-party model APIs.'), stack: ['Flutter', 'AI APIs'], primaryUrl: '', links: [], images: [] },
    { id: 'social', status: pub, name: T('Social Media App', 'সোশ্যাল মিডিয়া অ্যাপ', 'Social-Media-App'), desc: T('Feed, follow, notifications, image upload and auth, built with an agile flow.'), stack: ['Flutter', 'Firebase'], primaryUrl: GH, links: [{ type: 'github', url: GH }], images: [] },
    { id: 'craftybay', status: pub, name: T('CraftyBay'), desc: T('E-commerce app with wishlist, reviews and payment integration.'), stack: ['Flutter', 'REST', 'GetX'], primaryUrl: GH, links: [{ type: 'github', url: GH }], images: [] },
    { id: 'easymsg', status: pub, name: T('EasyMsg'), desc: T('Encrypted group chat with real-time Firebase messaging.'), stack: ['Flutter', 'Firebase', 'GetX'], primaryUrl: GH, links: [{ type: 'github', url: GH }], images: [] },
    { id: 'firelight', status: pub, name: T('Firelight Sync'), desc: T('IoT home automation: a Flutter client controlling NodeMCU devices over a Firebase realtime backend.'), stack: ['Flutter', 'Firebase', 'IoT'], primaryUrl: GH, links: [{ type: 'github', url: GH }], images: [] },
    { id: 'more', status: pub, name: T('30+ more Flutter projects'), desc: T('Mini and mid-size apps exploring Provider, GetX, Riverpod, Bloc, MVVM and MVC.'), stack: ['Flutter', 'Riverpod', 'Bloc', 'GetX'], primaryUrl: `${GH}?tab=repositories`, links: [{ type: 'github', url: `${GH}?tab=repositories` }], images: [] },
  ],
  classes: [
    { id: 'flutter-ai', status: pub, icon: 'flutter_dash', name: 'App Development with Flutter & AI', level: 'Beginner', weeks: 0, batches: 0, students: '[–]', topics: ['Flutter', 'Dart', 'AI integration'], desc: 'Ostad’s live course: from Flutter fundamentals to production-level apps with real-world AI integration.', modules: ['Dart & Flutter fundamentals', 'Layouts, navigation & state', 'APIs & backend integration', 'AI features in Flutter apps', 'Shipping to production'], outcome: 'A production-ready Flutter app with AI features.' },
    { id: 'state-management', status: draft, icon: 'account_tree', name: 'State Management', level: 'Intermediate', weeks: 4, batches: 2, students: '[70]', topics: ['Provider', 'GetX', 'Bloc'], desc: 'Choosing and applying state management patterns so apps stay predictable as they grow.', modules: ['setState and its limits', 'Provider', 'GetX', 'Bloc / Cubit', 'Comparing trade-offs'], outcome: 'The same app rebuilt with three approaches, with a written comparison.' },
    { id: 'flutter-firebase', status: draft, icon: 'cloud', name: 'Flutter + Firebase', level: 'Intermediate', weeks: 6, batches: 2, students: '[85]', topics: ['Firebase', 'REST APIs', 'Auth'], desc: 'Authentication, Firestore, storage and push notifications wired into a real Flutter app.', modules: ['Firebase setup', 'Authentication', 'Firestore CRUD', 'Storage & images', 'Push notifications', 'Deploy'], outcome: 'A social feed app with login, posts, profiles and image sharing.' },
    { id: 'clean-architecture', status: draft, icon: 'architecture', name: 'Clean Architecture', level: 'Advanced', weeks: 5, batches: 1, students: '[40]', topics: ['Clean Architecture', 'MVVM', 'Testing'], desc: 'Layering, dependency injection and testing for apps that more than one person will maintain.', modules: ['Layers & boundaries', 'Repositories & use cases', 'Dependency injection', 'Unit & widget tests', 'Refactoring a legacy app'], outcome: 'A feature-complete app with a tested domain layer.' },
  ],
  research: [
    { id: 'thesis', status: pub, kind: 'Thesis', venue: 'East Delta University', title: T('MIRNet-based low-light image enhancement with PairLIE-inspired consistency regularization'), summary: T('Brightening dark photos without amplifying noise or colour shifts — a MIRNet backbone with a consistency constraint inspired by PairLIE, evaluated with PSNR and SSIM. Supervised by Md. Sabbir Al Ahsan.'), tags: ['Computer vision', 'Deep learning', 'MIRNet', 'PairLIE', 'PSNR / SSIM'], link: '', image: '' },
    { id: 'paper', status: draft, kind: 'Paper', venue: '[Venue / year]', title: T('[Paper title]'), summary: T('[Two-line abstract in plain language.]'), tags: [], link: '', image: '' },
    { id: 'rproject', status: draft, kind: 'Project', venue: '[Course / lab]', title: T('[Research project title]'), summary: T('[Two-line summary of the question and result.]'), tags: [], link: '', image: '' },
  ],
  education: [
    { id: 'msc', status: pub, tag: T('Upcoming', 'আসছে', 'Geplant'), level: T('MSc Software Engineering', 'এমএসসি সফটওয়্যার ইঞ্জিনিয়ারিং', 'MSc Software Engineering'), inst: 'Germany', result: T('Starting Summer 2027', 'শুরু গ্রীষ্ম ২০২৭', 'Start Sommer 2027'), highlight: true },
    { id: 'bsc', status: pub, tag: T('BSc · 2022 – 2025'), level: T('Computer Science & Engineering', 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং', 'Computer Science & Engineering'), inst: 'East Delta University, Chattogram', result: T('CGPA 3.60 / 4.00 · Cum Laude · 166 credits', 'সিজিপিএ ৩.৬০ / ৪.০০ · কাম লড · ১৬৬ ক্রেডিট', 'CGPA 3,60 / 4,00 · Cum Laude · 166 Credits'), highlight: false },
    { id: 'hsc', status: pub, tag: T('HSC · 2018 – 2020'), level: T('Higher Secondary (Science)', 'উচ্চ মাধ্যমিক (বিজ্ঞান)', 'Higher Secondary (Naturwissenschaften)'), inst: 'Bangladesh Navy School & College, Chattogram', result: T('GPA 5.00 / 5.00', 'জিপিএ ৫.০০ / ৫.০০', 'GPA 5,00 / 5,00'), highlight: false },
    { id: 'ssc', status: pub, tag: T('SSC · 2016 – 2018'), level: T('Secondary (Science)', 'মাধ্যমিক (বিজ্ঞান)', 'Secondary (Naturwissenschaften)'), inst: 'Nasirabad Govt. High School, Chattogram', result: T('GPA 5.00 / 5.00', 'জিপিএ ৫.০০ / ৫.০০', 'GPA 5,00 / 5,00'), highlight: false },
  ],
};
