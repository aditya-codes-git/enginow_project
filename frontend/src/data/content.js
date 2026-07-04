import {
  Award,
  BookOpen,
  CalendarCheck,
  FileQuestion,
  HandCoins,
  HelpCircle,
  Lock,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react'

export const blogPosts = [
  {
    slug: 'how-to-choose-the-right-hackathon',
    title: 'How to choose the right hackathon for your team',
    excerpt: 'A practical way to compare themes, timelines, judging criteria, and team fit before you register.',
    category: 'Hackathons',
    author: 'EngiNow Editorial',
    date: 'June 12, 2026',
    readTime: '5 min read',
    hero: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        heading: 'Match the problem track to your strengths',
        body: 'Start with the published themes and ask whether your team can build a believable prototype within the event window. A strong fit usually has a clear user, a reachable dataset or API, and a demo that can be explained in two minutes.',
      },
      {
        heading: 'Read the judging rubric early',
        body: 'Rubrics reveal what the organisers value. If execution and usability carry more weight than novelty, reserve time for polish, testing, and a crisp walkthrough instead of adding another feature at the end.',
      },
      {
        heading: 'Check support and logistics',
        body: 'Look for mentor access, submission rules, communication channels, team-size limits, and prize eligibility. These details decide whether the event will feel focused or chaotic once the clock starts.',
      },
    ],
  },
  {
    slug: 'organiser-checklist-before-publishing',
    title: 'Organiser checklist before publishing an event',
    excerpt: 'The essentials every organiser should verify before an event goes live on EngiNow.',
    category: 'Organisers',
    author: 'EngiNow Operations',
    date: 'June 8, 2026',
    readTime: '4 min read',
    hero: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        heading: 'Make the outcome obvious',
        body: 'Participants should understand what they will build, learn, or compete for without needing to message the organiser. Use a specific title, clear description, and realistic eligibility notes.',
      },
      {
        heading: 'Keep the schedule complete',
        body: 'Add registration deadlines, opening sessions, build time, submission windows, judging slots, and result announcements. Complete schedules reduce repeated support questions.',
      },
      {
        heading: 'Prepare review-ready assets',
        body: 'Upload a clean banner, add contact details, and mention sponsor or prize information only when it is confirmed. This helps admins approve the event faster.',
      },
    ],
  },
  {
    slug: 'submission-day-playbook',
    title: 'Submission day playbook for student teams',
    excerpt: 'A calm final-day routine for demos, repositories, decks, and last-minute checks.',
    category: 'Participants',
    author: 'EngiNow Community',
    date: 'May 29, 2026',
    readTime: '6 min read',
    hero: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        heading: 'Freeze the demo path',
        body: 'Pick the exact path you will show judges and stop adding major features near the deadline. A reliable demo beats an ambitious build that only works on one laptop.',
      },
      {
        heading: 'Document setup clearly',
        body: 'Your repository should include environment variables, install commands, seeded demo credentials, screenshots, and known limitations. Judges should not have to reverse-engineer your project.',
      },
      {
        heading: 'Assign final owners',
        body: 'One teammate should handle the deck, one should verify the submission form, one should test deployment, and one should prepare the spoken pitch. Shared responsibility is useful; shared confusion is not.',
      },
    ],
  },
]

export const successStories = [
  {
    name: 'Aditya Shah',
    college: 'SVNIT Surat',
    role: 'Web Developer & Hacker',
    result: 'Reached finals in 3 campus hackathons',
    feedback: 'EngiNow changed how I find hackathons. The unified student registration saved us time, and my team registered for three hackathons in a single afternoon.',
    initials: 'AS',
    featured: true,
  },
  {
    name: 'Kriti Patel',
    college: 'NIT Surat',
    role: 'AI/ML Enthusiast',
    result: 'Built a portfolio-ready AI project',
    feedback: 'I attended the Generative AI workshop through EngiNow and networked with speakers from top companies. Finding verified workshops has never been this simple.',
    initials: 'KP',
    featured: false,
  },
  {
    name: 'Devan Sharma',
    college: 'DAIICT',
    role: 'Club Coordinator',
    result: 'Managed 400+ registrations',
    feedback: 'As a club coordinator, I tracked registrations in real time. It replaced messy spreadsheets and helped our team focus on the event experience.',
    initials: 'DS',
    featured: false,
  },
  {
    name: 'Meera Nair',
    college: 'VIT Vellore',
    role: 'Product Designer',
    result: 'Won best UX prototype',
    feedback: 'The event pages helped us compare rubrics before joining. We chose the right design sprint and used the final project as a case study.',
    initials: 'MN',
    featured: false,
  },
]

export const footerPageContent = {
  terms: {
    title: 'Terms of Service',
    eyebrow: 'Legal',
    icon: Scale,
    updated: 'Last Updated: 6/19/2026',
    intro: 'Welcome to Enginow. These Terms of Service ("Terms") govern your access to and use of our website, products, and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.',
    sections: [
      {
        heading: '1. Introduction',
        body: 'Welcome to Enginow. These Terms of Service ("Terms") govern your access to and use of our website, products, and services. By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.',
      },
      {
        heading: '2. Definitions',
        body: 'Enginow refers to our company, website, and services. Services refers to our website, courses, learning materials, and related offerings. User refers to any individual who accesses or uses our Services. Content refers to all materials, information, and resources available through our Services.',
      },
      {
        heading: '3. Account Registration',
        body: 'To access certain features of our Services, you may need to register for an account. You agree to provide accurate, current, and complete information during registration and to keep it accurate, current, and complete. You are responsible for safeguarding your password and all activities under your account. Notify us immediately of any unauthorized use.',
      },
      {
        heading: '4. User Conduct',
        body: 'You agree not to use our Services in violation of any law, impersonate another person or entity, restrict anyone else from using the Services, attempt unauthorized access, use the Services for unlawful purposes, solicit unlawful acts, or harvest contact information from other users.',
      },
      {
        heading: '5. Intellectual Property',
        body: 'Our Services and their contents, features, and functionality are owned by Enginow, its licensors, or other providers and are protected by intellectual property laws. These Terms permit personal, non-commercial use only. You may not reproduce, distribute, modify, publicly display, republish, download, store, or transmit material except for temporary browser storage, automatic browser caching, or printing/downloading one reasonable copy for personal, non-commercial use.',
      },
      {
        heading: '6. Payment Terms',
        body: 'Certain aspects of our Services may require payment. Payments are processed securely through payment processors. By providing payment information, you represent that you are authorized to use the payment method. Prices may change without notice, and we may modify or discontinue any Service without notice.',
      },
      {
        heading: '7. Refund Policy',
        body: 'Our refund policy varies depending on the specific product or service purchased. Please refer to the specific terms provided at the time of purchase for applicable refund terms.',
      },
      {
        heading: '8. Limitation of Liability',
        body: 'To the fullest extent permitted by law, Enginow shall not be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, goodwill, use, data, or other intangible losses, resulting from your access to or use of the Services, inability to access or use the Services, third-party conduct or content, content obtained from the Services, or unauthorized access, use, or alteration of transmissions or content.',
      },
      {
        heading: '9. Changes to Terms',
        body: 'We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the new Terms and updating the Last Updated date. Continued use after modifications constitutes acknowledgment and agreement to the modified Terms.',
      },
      {
        heading: '10. Updates & Revision History',
        body: '6/19/2026: Updated formatting and clarified refund and payment terms. Previous: Terms originally published. Refer to site archive for details.',
      },
      {
        heading: '11. Contact Information',
        body: 'Questions about the Terms should be sent to terms@enginow.in.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Privacy',
    icon: Lock,
    updated: 'Last Updated: 6/19/2026',
    intro: 'Welcome to Enginow ("we," "our," or "us"). We are committed to protecting your privacy and handling your personal information with care. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices you have regarding your information when you visit our website or use our services.',
    sections: [
      {
        heading: 'Introduction',
        body: 'Welcome to Enginow ("we," "our," or "us"). We are committed to protecting your privacy and handling your personal information with care. This Privacy Policy explains what information we collect, why we collect it, how we use it, and the choices you have regarding your information when you visit our website or use our services.',
      },
      {
        heading: 'Information We Collect',
        body: 'We collect information to provide and improve our services. This may include personal information such as name, email address, phone number, and contact details; educational information such as course progress, assessment results, certifications, and learning preferences; technical and usage data such as IP address, browser and device information, pages visited, time spent on pages, and analytics data; and payment information processed by third-party payment providers to complete purchases.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'We use information to provide, maintain, and improve educational content and platform features; process orders, payments, and related communications; respond to inquiries, feedback, and support requests; send important account, product, and security notices; personalize content, recommendations, and marketing where permitted; and analyze usage patterns and trends to enhance performance and user experience.',
      },
      {
        heading: 'Sharing and Disclosure',
        body: 'We do not sell your personal information. We may share information with trusted service providers such as hosting, payment, and analytics providers; with partners for co-branded or joint offerings when you opt in; in connection with a corporate transaction such as merger, acquisition, or sale of assets; or when required by law, legal process, or to protect rights, property, or safety.',
      },
      {
        heading: 'Your Rights and Choices',
        body: 'Depending on your jurisdiction, you may have rights to access or obtain a copy of your personal data, correct inaccurate or incomplete information, request deletion or restriction of processing, withdraw consent where processing is based on consent, and exercise data portability where applicable.',
      },
      {
        heading: 'Cookies and Tracking Technologies',
        body: 'We and our partners use cookies and similar technologies to operate the site, analyze usage, and deliver relevant content. You can manage cookie preferences via your browser or device settings. Disabling certain cookies may affect functionality.',
      },
      {
        heading: 'Security and Data Retention',
        body: 'We implement administrative, technical, and physical safeguards to protect your information. While we strive to use commercially reasonable measures, no security system is impenetrable. We retain personal data only as long as necessary to fulfill the purposes described in this policy or as required by law.',
      },
      {
        heading: "Children's Privacy",
        body: 'Our services are not intended for children under 13, or under the minimum age in your jurisdiction. We do not knowingly collect personal information from children without verifiable parental consent. If you believe we have collected such data, contact us to request deletion.',
      },
      {
        heading: 'Changes to This Privacy Policy',
        body: 'We may update this policy periodically. When we make material changes, we will update the Last Updated date and, where appropriate, provide additional notice. Continued use of our services after changes indicates acceptance of the updated policy.',
      },
      {
        heading: 'Contact Us',
        body: 'If you have questions, requests, or concerns about this Privacy Policy or our practices, contact us at privacy@enginow.in. Address: Tech Park, Sector 62, Noida, Uttar Pradesh 201301, India.',
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    eyebrow: 'Payments',
    icon: HandCoins,
    updated: 'Updated June 2026',
    intro: 'Most EngiNow listings are free to browse. This page explains how refunds should be handled if paid events are enabled.',
    sections: [
      {
        heading: 'Free events',
        body: 'If an event is free, no refund is applicable. Participants can review cancellation or withdrawal options from the event details where available.',
      },
      {
        heading: 'Paid events',
        body: 'For paid events, refund eligibility depends on the organiser policy displayed during registration. EngiNow can help route support requests to the organiser.',
      },
      {
        heading: 'Cancelled events',
        body: 'If a paid event is cancelled, the organiser should communicate the refund process, timeline, and any required participant action.',
      },
    ],
  },
  faqs: {
    title: 'FAQs',
    eyebrow: 'Support',
    icon: FileQuestion,
    updated: 'Updated June 2026',
    intro: 'Quick answers to common participant and organiser questions.',
    sections: [
      {
        heading: 'How do I register for an event?',
        body: 'Open the event page, review eligibility and deadlines, sign in, and complete the registration flow shown on the page.',
      },
      {
        heading: 'Can organisers publish events directly?',
        body: 'Organisers can create event drafts. Admin review may be required before an event becomes visible to participants.',
      },
      {
        heading: 'Where do I submit a project?',
        body: 'Submission options appear on eligible event pages after registration, based on the event schedule and organiser settings.',
      },
    ],
  },
  help: {
    title: 'Help Center',
    eyebrow: 'Support',
    icon: HelpCircle,
    updated: 'Updated June 2026',
    intro: 'Find the fastest route for common account, event, registration, and organiser support needs.',
    sections: [
      {
        heading: 'Participant help',
        body: 'For registration or submission issues, check the event page first, then contact the organiser using the listed contact details.',
      },
      {
        heading: 'Organiser help',
        body: 'Review event completeness, media uploads, schedule details, and contact information before sending an event for approval.',
      },
      {
        heading: 'Account help',
        body: 'Use account settings to update profile details or password information. For access issues, reach out through the contact page.',
      },
    ],
  },
}

export const companyHighlights = [
  {
    title: 'Student-first discovery',
    description: 'EngiNow helps engineering students find relevant events, hackathons, workshops, and competitions without jumping between scattered forms.',
    icon: Users,
  },
  {
    title: 'Verified organiser workflows',
    description: 'Organisers can publish complete event pages, manage registrations, and keep participants informed from one operating surface.',
    icon: ShieldCheck,
  },
  {
    title: 'Career-building outcomes',
    description: 'The platform is designed around practical participation: real projects, stronger portfolios, better teams, and clearer event operations.',
    icon: Award,
  },
]

export const companyStats = [
  { label: 'Student-focused categories', value: '12+' },
  { label: 'Sample event workflows', value: '30+' },
  { label: 'Core user roles', value: '3' },
  { label: 'Platform goal', value: '1 clear hub' },
]

export const supportChannels = [
  { title: 'Event questions', description: 'Use the organiser contact details on each event page.', icon: CalendarCheck },
  { title: 'Platform questions', description: 'Use the contact page for account, access, or general platform help.', icon: BookOpen },
]
