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
    slug: 'first-hackathon-what-actually-matters',
    title: "First Hackathon? Here's What Actually Matters",
    excerpt: 'Your first hackathon can feel noisy, but a few basics make the weekend easier. Focus on choosing the right team, validating one clear idea, reading the judging criteria early, and saving enough time for a calm final presentation.',
    category: 'Hackathons',
    author: 'Enginow Team',
    date: 'July 2, 2026',
    readTime: '5 min read',
    hero: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        heading: 'Pick people before picking features',
        body: 'A balanced team matters more than a huge idea. Try to have someone who can build the core product, someone who can think through users, and someone who can explain the work clearly during the demo.',
      },
      {
        heading: 'Validate one idea quickly',
        body: 'Before writing too much code, ask what problem you are solving and who would actually use it. A small idea that works well usually scores better than a large idea that cannot be explained or demonstrated.',
      },
      {
        heading: 'Protect time for the pitch',
        body: 'Judges often remember the story as much as the build. Keep the demo path simple, mention what you learned, and leave enough time to rehearse instead of adding one more unfinished feature.',
      },
    ],
  },
  {
    slug: 'planned-campus-tech-fest-without-chaos',
    title: 'How We Planned a Campus Tech Fest Without the Last-Minute Chaos',
    excerpt: 'Student events become much smoother when registrations, volunteer roles, schedules, and communication are handled early. A little structure before launch can save the organizing team from messy spreadsheets and repeated questions later.',
    category: 'Events',
    author: 'Community Team',
    date: 'June 28, 2026',
    readTime: '6 min read',
    hero: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        heading: 'Start with clean registrations',
        body: 'Clear registration forms help organizers plan rooms, certificates, kits, and communication. Collect only what you need, but make sure the essentials are captured before participants arrive.',
      },
      {
        heading: 'Give volunteers specific ownership',
        body: 'A volunteer list is not enough. Assign people to help desk, stage coordination, participant support, judging, and announcements so everyone knows what they are responsible for during the event.',
      },
      {
        heading: 'Communicate before confusion starts',
        body: 'Most last-minute chaos comes from unclear updates. Share schedules, venue details, deadlines, and contact points in one place so participants do not have to chase multiple messages.',
      },
    ],
  },
  {
    slug: 'portfolio-recruiters-actually-open',
    title: 'Building a Portfolio That Recruiters Actually Open',
    excerpt: 'A strong student portfolio is not just a list of links. It should show your best projects, hackathon work, internships, GitHub activity, and technical writing in a way that helps recruiters understand your skills quickly.',
    category: 'Career',
    author: 'Career Desk',
    date: 'June 21, 2026',
    readTime: '7 min read',
    hero: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        heading: 'Lead with your strongest work',
        body: 'Recruiters may only spend a minute on your profile, so put your most relevant projects first. Mention the problem, your role, the tech stack, and what changed because of the project.',
      },
      {
        heading: 'Make GitHub easy to review',
        body: 'Clean READMEs, screenshots, setup steps, and short demo videos make a big difference. A project that is easy to understand often feels more credible than one with only a repository link.',
      },
      {
        heading: 'Use blogs to explain your thinking',
        body: 'Technical blogs do not need to be perfect essays. Write about what you built, what broke, and what you learned. It shows communication skills that matter in internships and placements.',
      },
    ],
  },
  {
    slug: 'ai-tools-engineering-students-2026',
    title: 'AI Tools Every Engineering Student Should Know in 2026',
    excerpt: 'AI tools can help with coding, debugging, documentation, presentations, note-taking, and learning. The key is to use them responsibly so they support your thinking instead of replacing it.',
    category: 'AI',
    author: 'Enginow Editorial',
    date: 'June 14, 2026',
    readTime: '6 min read',
    hero: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
    sections: [
      {
        heading: 'Use AI as a study partner',
        body: 'AI assistants can explain concepts, generate practice questions, and help compare approaches. The best results come when you ask specific questions and verify the answer with trusted sources.',
      },
      {
        heading: 'Speed up routine project work',
        body: 'For coding, AI tools can help draft boilerplate, debug errors, summarize documentation, and improve comments. Keep reviewing the output carefully, especially when security or correctness matters.',
      },
      {
        heading: 'Stay responsible and original',
        body: 'Do not submit generated work without understanding it. Use AI to learn faster, improve drafts, and explore ideas, but make sure your final project still reflects your own decisions and effort.',
      },
    ],
  },
]

export const successStories = [
  {
    name: 'Aarav Mehta',
    college: 'DAIICT Gandhinagar',
    role: 'Computer Science Student',
    result: 'Reached the finals in 2 national hackathons',
    feedback: 'During my second year, I wanted to participate in more hackathons but keeping track of registrations was honestly a mess. I came across Enginow while looking for upcoming events, and it made everything much simpler. I could explore multiple hackathons in one place, compare them, and register without jumping between different websites. My team ended up reaching the finals in two hackathons, and the experience really boosted our confidence.',
    initials: 'AM',
    featured: true,
  },
  {
    name: 'Priya Nair',
    college: 'NIT Calicut',
    role: 'AI/ML Student',
    result: 'Built my first AI application through a workshop',
    feedback: 'I joined an AI workshop that I found on Enginow because I wanted to learn something beyond what we were doing in college. The sessions were practical, and I got to interact with mentors who shared real industry insights. By the end of the workshop, I had built my first AI project, which later became one of the strongest projects in my internship portfolio.',
    initials: 'PN',
    featured: false,
  },
  {
    name: 'Rahul Verma',
    college: 'VIT Vellore',
    role: 'Technical Club Coordinator',
    result: 'Managed registrations for 650+ participants',
    feedback: 'As the coordinator of our college\'s technical club, organizing events usually meant spending hours managing registrations and answering the same questions repeatedly. Using Enginow made the entire process much more organized. Participants could easily access event details, and our team finally had more time to focus on making the event itself better instead of handling spreadsheets.',
    initials: 'RV',
    featured: false,
  },
  {
    name: 'Sneha Kulkarni',
    college: 'MIT World Peace University, Pune',
    role: 'UI/UX Designer',
    result: 'Won Best UI/UX Design at a campus hackathon',
    feedback: 'I had always wanted to participate in a design hackathon but never knew where to find good opportunities. Through Enginow, I discovered a campus design challenge that matched my interests. I met an amazing team, worked on a real problem statement, and we ended up winning the Best UI/UX Design award. That project is still one of the first things I talk about during interviews.',
    initials: 'SK',
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
        body: 'Simply open the event page, review the eligibility criteria and deadlines, sign in to your account, and complete the registration process by following the on-screen instructions. You\'ll receive a confirmation once your registration is successful.',
      },
      {
        heading: 'Can I register for more than one event?',
        body: 'Yes. You can register for multiple events as long as their schedules don\'t overlap and you meet the eligibility requirements for each event. Your registrations will appear separately in your account.',
      },
      {
        heading: 'How will I know if my registration is confirmed?',
        body: 'After completing your registration, you\'ll see an on-screen confirmation message. If the organizer has enabled notifications, you\'ll also receive a confirmation email with your registration details.',
      },
      {
        heading: 'Can I edit my registration details after submitting?',
        body: 'Some events allow you to update basic information before the registration deadline. Once registrations close, any changes may require approval from the event organizer.',
      },
      {
        heading: 'What should I do if I face issues while registering?',
        body: 'First, make sure all required fields are filled correctly and that you have a stable internet connection. If the problem continues, refresh the page or contact the event organizer through the support section for assistance.',
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
