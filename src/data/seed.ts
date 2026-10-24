import type { Content, I18n } from '@/lib/types';

/**
 * Default content, used when the build has no Firestore access and to seed
 * Firestore from the admin. Bracketed text is placeholder copy.
 */
const T = (en: string, bn?: string, de?: string): I18n => ({ en, ...(bn ? { bn } : {}), ...(de ? { de } : {}) });
const pub = 'published' as const;

export const seed: Content = {
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
    stack: ['Flutter', 'Dart', 'TypeScript', 'Node.js', 'Supabase', 'SQL'],
    portrait: '',
    nowUpdated: '2026-10-20',
    teachPlatform: 'Ostad EdTech',
    teachRole: T('Part-time instructor', 'খণ্ডকালীন ইন্সট্রাক্টর', 'Dozent in Teilzeit'),
    teachTopics: ['Flutter', 'Dart', 'State management', 'Clean Architecture', 'Firebase', 'REST APIs'],
    achievement: T('ICPC Asia Dhaka Regional — Honorable Mention', 'ICPC Asia Dhaka Regional — অনারেবল মেনশন', 'ICPC Asia Dhaka Regional — Ehrenvolle Erwähnung'),
  },
  contact: {
    email: 'hello@example.com',
    github: 'https://github.com/mishad01',
    linkedin: 'https://linkedin.com/in/[handle]',
    cv: '/cv.pdf',
  },
  now: [
    { id: 'building', status: pub, icon: 'work', tone: 'primary', label: T('Building', 'নির্মাণ', 'Entwickle'), text: T('Production Flutter apps at Brain Station 23.', 'ব্রেইন স্টেশন ২৩-এ প্রোডাকশন ফ্লাটার অ্যাপ।', 'Produktive Flutter-Apps bei Brain Station 23.') },
    { id: 'teaching', status: pub, icon: 'school', tone: 'secondary', label: T('Teaching', 'শেখাচ্ছি', 'Lehre'), text: T('Flutter & Dart as an instructor at Ostad.', 'ওস্তাদে ফ্লাটার ও ডার্ট শেখাচ্ছি।', 'Flutter & Dart als Dozent bei Ostad.') },
    { id: 'side', status: pub, icon: 'rocket_launch', tone: 'tertiary', label: T('Side project', 'সাইড প্রজেক্ট', 'Nebenprojekt'), text: T('EduBridge — a free, open-source learning platform.', 'এডুব্রিজ — বিনামূল্যের ওপেন-সোর্স লার্নিং প্ল্যাটফর্ম।', 'EduBridge – eine kostenlose Open-Source-Lernplattform.') },
    { id: 'learning', status: pub, icon: 'menu_book', tone: 'secondary', label: T('Learning', 'শিখছি', 'Lerne'), text: T('[Current learning topic]') },
    { id: 'next', status: pub, icon: 'flight_takeoff', tone: 'primary', label: T('Next', 'পরবর্তী ধাপ', 'Als Nächstes'), text: T('MSc Software Engineering in Germany, Summer 2027.', 'জার্মানিতে এমএসসি সফটওয়্যার ইঞ্জিনিয়ারিং, গ্রীষ্ম ২০২৭।', 'MSc Software Engineering in Deutschland, Sommer 2027.') },
  ],
  experience: [
    { id: 'bs23', status: pub, role: T('Software Engineer (Mobile)', 'সফটওয়্যার ইঞ্জিনিয়ার (মোবাইল)', 'Software Engineer (Mobile)'), org: 'Brain Station 23 PLC', start: '', end: 'present', location: T('Dhaka', 'ঢাকা', 'Dhaka'), summary: T('Building and shipping production mobile applications.', 'প্রোডাকশন মোবাইল অ্যাপ তৈরি ও রিলিজ।', 'Entwicklung und Release produktiver Mobile-Apps.'), bullets: [T('[2–4 impact bullets]')], skills: ['Flutter', 'Dart'] },
    { id: 'ostad', status: pub, role: T('Instructor (part-time)', 'ইন্সট্রাক্টর (খণ্ডকালীন)', 'Dozent (Teilzeit)'), org: 'Ostad EdTech Platform', start: '', end: 'present', location: T('[location]'), summary: T('Teaching Flutter and Dart to cohorts of students.', 'শিক্ষার্থীদের ফ্লাটার ও ডার্ট শেখানো।', 'Flutter und Dart für Studierendengruppen.'), bullets: [T('[2–4 impact bullets]')], skills: ['Flutter', 'Dart'] },
    { id: 'learnathon', status: pub, role: T('Apprentice, Learnathon 3.0', 'অ্যাপ্রেন্টিস, লার্নাথন ৩.০', 'Apprentice, Learnathon 3.0'), org: 'Geeky Solutions · sponsored by Brain Station 23', start: '2025-01', end: '2025-04', location: T('[location]'), summary: T('Apprenticeship programme sponsored by Brain Station 23.', 'ব্রেইন স্টেশন ২৩ স্পনসরড অ্যাপ্রেন্টিসশিপ প্রোগ্রাম।', 'Von Brain Station 23 gesponsertes Apprenticeship-Programm.'), bullets: [T('[2–4 impact bullets]')], skills: [] },
    { id: 'maverick', status: pub, role: T('Software Developer Intern', 'সফটওয়্যার ডেভেলপার ইন্টার্ন', 'Software Developer Intern'), org: 'Maverick Softwares', start: '2024-01', end: '2024-06', location: T('[location]'), summary: T('[One-line summary]'), bullets: [T('[2–4 impact bullets]')], skills: [] },
    { id: 'educc', status: pub, role: T('Sub-Executive', 'সাব-এক্সিকিউটিভ', 'Sub-Executive'), org: 'EDU Computer Club', start: '', end: '', location: T('Chattogram', 'চট্টগ্রাম', 'Chattogram'), summary: T('[One-line summary]'), bullets: [T('[2–4 impact bullets]')], skills: [] },
  ],
  projects: [
    { id: 'kedibe', status: pub, name: T('Ke Dibe?', 'কে দিবে?', 'Ke Dibe?'), desc: T('Bangla Android app that tracks whose turn it is to pay — and who owes treats — in friend groups and office teams.', 'বন্ধুদের দল ও অফিসে কার পালা, কে ট্রিট বাকি রেখেছে — তার হিসাব রাখার বাংলা অ্যান্ড্রয়েড অ্যাপ।', 'Bangla-Android-App, die festhält, wer in Freundeskreisen und Büroteams als Nächstes zahlt oder noch einen Ausgeben schuldet.'), stack: ['Flutter', 'Clean Architecture'], primaryUrl: 'https://github.com/mishad01', links: [{ type: 'github', url: 'https://github.com/mishad01' }, { type: 'playstore', url: 'https://play.google.com' }], images: [{ src: '', alt: 'Ke Dibe? screenshot 1' }, { src: '', alt: 'Ke Dibe? screenshot 2' }, { src: '', alt: 'Ke Dibe? screenshot 3' }] },
    { id: 'edubridge', status: pub, name: T('EduBridge', 'এডুব্রিজ', 'EduBridge'), desc: T('Free, open-source learning platform for Bangladeshi students.', 'বাংলাদেশি শিক্ষার্থীদের জন্য বিনামূল্যের ওপেন-সোর্স লার্নিং প্ল্যাটফর্ম।', 'Kostenlose Open-Source-Lernplattform für Studierende in Bangladesch.'), stack: ['Flutter', 'GetX', 'Supabase', 'PostgreSQL'], primaryUrl: 'https://github.com/mishad01', links: [{ type: 'github', url: 'https://github.com/mishad01' }, { type: 'website', url: 'https://mishad01.github.io' }], images: [{ src: '', alt: 'EduBridge screenshot 1' }, { src: '', alt: 'EduBridge screenshot 2' }] },
    { id: 'social', status: pub, name: T('Social Media App', 'সোশ্যাল মিডিয়া অ্যাপ', 'Social-Media-App'), desc: T('Ostad Pro batch project: login/signup, feed, profile, notifications and image sharing.', 'ওস্তাদ প্রো ব্যাচ প্রজেক্ট: লগইন/সাইনআপ, ফিড, প্রোফাইল, নোটিফিকেশন ও ছবি শেয়ার।', 'Projekt im Ostad-Pro-Batch: Login/Signup, Feed, Profil, Benachrichtigungen und Bildfreigabe.'), stack: ['Flutter', 'Firebase', 'MVVM'], primaryUrl: 'https://github.com/mishad01', links: [{ type: 'github', url: 'https://github.com/mishad01' }, { type: 'youtube', url: 'https://youtube.com' }], images: [{ src: '', alt: 'Social Media App screenshot 1' }, { src: '', alt: 'Social Media App screenshot 2' }, { src: '', alt: 'Social Media App screenshot 3' }] },
    { id: 'choice', status: pub, name: T('Choice Legacy', 'চয়েস লেগাসি', 'Choice Legacy'), desc: T('Shopify-based e-commerce mobile app. Client work — details are limited.', 'শপিফাই-ভিত্তিক ই-কমার্স মোবাইল অ্যাপ। ক্লায়েন্ট প্রজেক্ট — তথ্য সীমিত।', 'Shopify-basierte E-Commerce-Mobile-App. Kundenprojekt – nur begrenzte Details.'), stack: ['Flutter', 'Shopify'], primaryUrl: '', links: [], images: [] },
    { id: 'rn', status: pub, name: T('React Native projects', 'রিয়্যাক্ট নেটিভ প্রজেক্ট', 'React-Native-Projekte'), desc: T('Learning projects in React Native and TypeScript.', 'রিয়্যাক্ট নেটিভ ও টাইপস্ক্রিপ্টে শেখার প্রজেক্ট।', 'Lernprojekte in React Native und TypeScript.'), stack: ['React Native', 'TypeScript'], primaryUrl: 'https://github.com/mishad01', links: [{ type: 'github', url: 'https://github.com/mishad01' }], images: [] },
    ...[6, 7, 8].map((n) => ({ id: `ph${n}`, status: pub, name: T(`[Project name ${n}]`), desc: T('[One-line description of the project.]'), stack: ['Flutter', 'Node.js'], primaryUrl: 'https://github.com/mishad01', links: [{ type: 'github' as const, url: 'https://github.com/mishad01' }], images: [] })),
  ],
  classes: [
    { id: 'flutter-fundamentals', status: pub, icon: 'flutter_dash', name: 'Flutter Fundamentals', level: 'Beginner', weeks: 8, batches: 3, students: '[120]', topics: ['Flutter', 'Dart', 'Widgets'], desc: 'From Dart basics to a working multi-screen app: layouts, navigation, forms and local storage.', modules: ['Dart language essentials', 'Widgets & layout', 'Navigation & routing', 'Forms & validation', 'Local storage', 'Capstone app'], outcome: 'A multi-screen to-do and notes app published as an APK.' },
    { id: 'state-management', status: pub, icon: 'account_tree', name: 'State Management', level: 'Intermediate', weeks: 4, batches: 2, students: '[70]', topics: ['Provider', 'GetX', 'Bloc'], desc: 'Choosing and applying state management patterns so apps stay predictable as they grow.', modules: ['setState and its limits', 'Provider', 'GetX', 'Bloc / Cubit', 'Comparing trade-offs'], outcome: 'The same app rebuilt with three approaches, with a written comparison.' },
    { id: 'flutter-firebase', status: pub, icon: 'cloud', name: 'Flutter + Firebase', level: 'Intermediate', weeks: 6, batches: 2, students: '[85]', topics: ['Firebase', 'REST APIs', 'Auth'], desc: 'Authentication, Firestore, storage and push notifications wired into a real Flutter app.', modules: ['Firebase setup', 'Authentication', 'Firestore CRUD', 'Storage & images', 'Push notifications', 'Deploy'], outcome: 'A social feed app with login, posts, profiles and image sharing.' },
    { id: 'clean-architecture', status: pub, icon: 'architecture', name: 'Clean Architecture', level: 'Advanced', weeks: 5, batches: 1, students: '[40]', topics: ['Clean Architecture', 'MVVM', 'Testing'], desc: 'Layering, dependency injection and testing for apps that more than one person will maintain.', modules: ['Layers & boundaries', 'Repositories & use cases', 'Dependency injection', 'Unit & widget tests', 'Refactoring a legacy app'], outcome: 'A feature-complete app with a tested domain layer.' },
  ],
  research: [
    { id: 'thesis', status: pub, kind: 'Thesis', venue: 'East Delta University', title: T('MIRNet-based low-light image enhancement with PairLIE-inspired consistency regularization'), summary: T('Brightening dark photos without amplifying noise or colour shifts — combining a MIRNet backbone with a consistency constraint inspired by PairLIE.'), tags: ['MIRNet', 'PairLIE', 'Low-light enhancement'], link: '', image: '' },
    { id: 'paper', status: pub, kind: 'Paper', venue: '[Venue / year]', title: T('[Paper title]'), summary: T('[Two-line abstract in plain language.]'), tags: ['[keyword]', '[keyword]'], link: '', image: '' },
    { id: 'rproject', status: pub, kind: 'Project', venue: '[Course / lab]', title: T('[Research project title]'), summary: T('[Two-line summary of the question and result.]'), tags: ['[keyword]', '[keyword]'], link: '', image: '' },
  ],
  education: [
    { id: 'msc', status: pub, tag: T('Upcoming', 'আসছে', 'Geplant'), level: T('MSc Software Engineering', 'এমএসসি সফটওয়্যার ইঞ্জিনিয়ারিং', 'MSc Software Engineering'), inst: 'Germany', result: T('Starting Summer 2027', 'শুরু গ্রীষ্ম ২০২৭', 'Start Sommer 2027'), highlight: true },
    { id: 'bsc', status: pub, tag: T('BSc'), level: T('Computer Science & Engineering', 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং', 'Computer Science & Engineering'), inst: 'East Delta University, Chattogram', result: T('CGPA 3.60 / 4.00 · Cum Laude', 'সিজিপিএ ৩.৬০ / ৪.০০ · কাম লড', 'CGPA 3,60 / 4,00 · Cum Laude'), highlight: false },
    { id: 'hsc', status: pub, tag: T('HSC'), level: T('Higher Secondary (Science)', 'উচ্চ মাধ্যমিক (বিজ্ঞান)', 'Higher Secondary (Naturwissenschaften)'), inst: 'Bangladesh Navy College, Chattogram', result: T('GPA 5.00 / 5.00', 'জিপিএ ৫.০০ / ৫.০০', 'GPA 5,00 / 5,00'), highlight: false },
    { id: 'ssc', status: pub, tag: T('SSC'), level: T('Secondary (Science)', 'মাধ্যমিক (বিজ্ঞান)', 'Secondary (Naturwissenschaften)'), inst: 'Nasirabad Government High School, Chattogram', result: T('GPA 5.00 / 5.00', 'জিপিএ ৫.০০ / ৫.০০', 'GPA 5,00 / 5,00'), highlight: false },
  ],
};
