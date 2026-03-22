const psychologistProfiles = [
  {
    slug: 'bhagyavathi',
    legacyIds: ['5', 'bhagyavathi'],
    seoTitle: 'Bhagyavathi | Counseling Psychologist',
    seoDescription: 'Dynamic psychologist profile for Bhagyavathi on Soulamore.',
    hero: {
      name: 'Bhagyavathi',
      role: 'Counseling Psychologist (Integrative)',
      avatarInitial: 'B',
      cta: { label: 'Book Appointment', href: '/portal/login.html' },
      stats: [
        { icon: 'fas fa-user-md', label: 'Trauma-Informed' },
        { icon: 'fas fa-language', label: 'English, Tamil' },
        { icon: 'fas fa-video', label: 'Video Consult' },
        { icon: 'fas fa-wallet', label: 'Rs. 1,000 / Session' }
      ]
    },
    tabs: [
      { id: 'overview', label: 'Overview', sections: ['about', 'style'] },
      { id: 'focus', label: 'Focus', sections: ['areas-of-focus', 'testimonials'] },
      { id: 'details', label: 'Details', sections: ['service-details', 'crisis-policy'] }
    ],
    defaultTab: 'overview',
    sections: [
      {
        id: 'about',
        tab: 'overview',
        column: 'main',
        type: 'rich-text',
        title: 'About Me',
        icon: 'fas fa-user',
        paragraphs: [
          '"I had a lot of issues, and as I overcame them, I want to help others live a free life authentically and to their best potential."',
          "My name is Bhagyavathi. I'm from Chennai, currently living in Mayapur, West Bengal. Almost four years ago, I began my healing journey. I faced my traumas, got lots of help, and I've been sharing my journey on Instagram. I integrate trauma-informed practices into my counseling approach, understanding the complexities of trauma on the nervous system.",
          'My work is grounded in creating a safe space where clients can explore their experiences and heal at their own pace. I emphasize being conscious about how we speak to ourselves.'
        ]
      },
      {
        id: 'style',
        tab: 'overview',
        column: 'main',
        type: 'style-session',
        title: 'Therapeutic Style',
        icon: 'fas fa-feather-alt',
        intro: 'How I work with clients:',
        tags: ['Trauma-informed', 'Integrative', 'Grounded', 'Safe pacing', 'Self-compassion'],
        noteTitle: 'First Session',
        note: 'Our first session is a space to understand what feels heavy right now, what support has or has not worked before, and what pace feels safe for you.'
      },
      {
        id: 'areas-of-focus',
        tab: 'focus',
        column: 'main',
        type: 'focus-list',
        title: 'Areas of Focus',
        icon: 'fas fa-briefcase',
        items: [
          {
            icon: 'fas fa-heart-broken',
            title: 'Trauma and Abuse Recovery',
            subtitle: 'Narcissistic abuse, domestic violence, trauma recovery'
          },
          {
            icon: 'fas fa-users',
            title: 'Relationships',
            subtitle: 'Marriage issues, relationship dynamics, relational healing'
          },
          {
            icon: 'fas fa-brain',
            title: 'Integrative Counseling',
            subtitle: 'PG Diploma in Psychology with a trauma-aware lens'
          }
        ]
      },
      {
        id: 'testimonials',
        tab: 'focus',
        column: 'main',
        type: 'quotes',
        title: 'Wall of Love',
        icon: 'fas fa-comments',
        items: [
          {
            quote: 'I have attended three sessions with Bhagya. Speaking to her felt so light and safe. Thank you for making me feel seen and validated.',
            author: 'Client (3 sessions)'
          },
          {
            quote: "I can't believe how much this session helped me accept myself as I am. Best session in 22 years.",
            author: 'Client (22 years old)'
          },
          {
            quote: 'Each session I could see how much you were celebrating my growth. I am in safe hands.',
            author: 'Long-term client'
          }
        ]
      },
      {
        id: 'service-details',
        tab: 'details',
        column: 'side',
        type: 'info-list',
        title: 'Service Details',
        icon: 'fas fa-info-circle',
        items: [
          {
            label: 'Specializations',
            kind: 'tags',
            value: ['Trauma', 'Narcissistic Abuse', 'Relationships', 'Healing']
          },
          {
            label: 'Availability',
            kind: 'status',
            value: 'Accepting New Clients',
            accent: 'success'
          },
          {
            label: 'Session Format',
            kind: 'text',
            value: 'Online (Video / Audio)'
          },
          {
            label: 'Experience',
            kind: 'text',
            value: '4+ years (personal and professional)' 
          }
        ]
      },
      {
        id: 'crisis-policy',
        tab: 'details',
        column: 'side',
        type: 'notice',
        title: 'Crisis Policy',
        icon: 'fas fa-exclamation-triangle',
        tone: 'alert',
        body: [
          'I am not available for 24/7 emergency support.',
          'If you are in immediate danger, please contact local emergency services or use Soulamore immediate crisis resources.'
        ]
      }
    ]
  }
];

const peerProfiles = [
  {
    slug: 'aditya-mental-wellness',
    legacyIds: ['aditya', '1'],
    seoTitle: 'Aditya | Peer Support Profile',
    seoDescription: 'Dynamic peer profile placeholder based on the mental wellness peer format.',
    themeClass: 'theme-anxiety',
    hero: {
      name: 'Aditya',
      role: 'Mental Wellness Peer',
      avatarInitial: 'A',
      quote: '"You do not have to know what to say here. We can just sit with it."',
      badges: [
        { icon: 'fas fa-certificate', label: 'Trained Peer' },
        { icon: 'fas fa-comment', label: 'Chat' },
        { icon: 'fas fa-phone', label: 'Call' },
        { icon: 'fas fa-language', label: 'English, Hindi' }
      ]
    },
    tabs: [
      { id: 'about', label: 'About', sections: ['about', 'fit'] },
      { id: 'conversation', label: 'Conversation Style', sections: ['style', 'conversation'] },
      { id: 'care', label: 'Care Boundaries', sections: ['reviews', 'boundaries'] }
    ],
    defaultTab: 'about',
    cta: {
      primary: { label: 'Start a Conversation', href: '/portal/login.html' },
      secondaryNote: 'You can begin with a single sentence. Or none at all.',
      saveLabel: 'Not sure yet? Save this peer'
    },
    sections: [
      {
        id: 'about',
        tab: 'about',
        type: 'rich-text',
        title: 'A little about me',
        icon: 'far fa-user',
        paragraphs: [
          "I am here for conversations that feel tangled, slow, or unfinished. I know what it is like when thoughts do not stop looping, and when explaining yourself feels harder than just staying quiet.",
          "You do not need to arrive with clarity. We can find it together, or simply sit with what is. I have navigated my own path through academic pressure and burnout, and I understand the weight of expectations."
        ]
      },
      {
        id: 'fit',
        tab: 'about',
        type: 'check-list',
        title: 'This space may feel right if...',
        icon: 'far fa-check-circle',
        items: [
          'You are overthinking small things that do not feel small.',
          'You feel emotionally tired but are not sure why.',
          'You are carrying things you have not said out loud yet.',
          'You want a calm listener, not a problem-solver.',
          'You are not ready for therapy, but you do not want to be alone.'
        ]
      },
      {
        id: 'style',
        tab: 'conversation',
        type: 'chip-list',
        title: 'How I show up',
        icon: 'far fa-comments',
        items: ['Slow-paced', 'Gentle questions', 'Comfortable with silence', 'Reflective', 'Patient']
      },
      {
        id: 'conversation',
        tab: 'conversation',
        type: 'check-list',
        title: 'What our conversation looks like',
        icon: 'far fa-clock',
        items: [
          'We start wherever you are. There is no fixed agenda.',
          'You can talk, type, or take breaks.',
          'I will not interrupt or rush you.',
          'There is no right outcome expected from one conversation.'
        ]
      },
      {
        id: 'reviews',
        tab: 'care',
        type: 'reviews',
        title: 'Wall of Love',
        icon: 'far fa-heart',
        items: [
          {
            quote: 'I did not feel judged. It felt like someone could actually stay with the mess without trying to fix me immediately.',
            author: 'Anonymous peer member'
          },
          {
            quote: 'The pace helped. I could think before I answered and that made it easier to stay honest.',
            author: 'Student, campus community'
          }
        ]
      },
      {
        id: 'boundaries',
        tab: 'care',
        type: 'boundary',
        title: 'A gentle note on boundaries',
        body: 'Peers at Soulamore do not diagnose or treat mental health conditions. If you are feeling unsafe or in crisis, I will help you find immediate professional support. This space is about being heard, not being fixed.'
      }
    ]
  }
];

function findProfile(catalog, key) {
  if (!key) return null;
  const normalized = String(key).trim().toLowerCase();
  return catalog.find((profile) => {
    const keys = [profile.slug, ...(profile.legacyIds || [])].map((value) => String(value).trim().toLowerCase());
    return keys.includes(normalized);
  }) || null;
}

export function resolvePsychologistProfile(key) {
  return findProfile(psychologistProfiles, key);
}

export function resolvePeerProfile(key) {
  return findProfile(peerProfiles, key);
}

export function mapPsychologistRecordToProfile(record, key = 'dynamic-psychologist') {
  if (!record) return null;

  const name = record.displayName || record.name || 'Psychologist';
  const role = record.title || record.role || 'Psychologist';
  const qualification = record.qualification || 'Verified Professional';
  const languages = Array.isArray(record.languages)
    ? record.languages.join(', ')
    : (record.languages || 'English');
  const fee = record.sessionFee || record.rate || 'Contract';
  const expertise = Array.isArray(record.expertise) && record.expertise.length > 0
    ? record.expertise
    : ['Emotional wellbeing'];
  const styleTags = Array.isArray(record.therapeuticStyle) && record.therapeuticStyle.length > 0
    ? record.therapeuticStyle
    : ['Reflective', 'Grounded'];
  const values = Array.isArray(record.values) && record.values.length > 0
    ? record.values
    : ['Confidential', 'Respectful'];

  return {
    slug: String(key),
    legacyIds: [String(key)],
    seoTitle: `${name} | Psychologist Profile`,
    seoDescription: `Dynamic psychologist profile for ${name} on Soulamore.`,
    hero: {
      name,
      role,
      avatarInitial: name.charAt(0).toUpperCase(),
      cta: { label: 'Book Appointment', href: '/portal/login.html' },
      stats: [
        { icon: 'fas fa-user-md', label: qualification },
        { icon: 'fas fa-language', label: languages },
        { icon: 'fas fa-video', label: 'Online' },
        { icon: 'fas fa-wallet', label: `${fee === 'Contract' ? fee : `Rs. ${fee}`} / Session` }
      ]
    },
    tabs: [
      { id: 'overview', label: 'Overview', sections: ['about', 'style'] },
      { id: 'focus', label: 'Focus', sections: ['expertise'] },
      { id: 'details', label: 'Details', sections: ['service-details'] }
    ],
    defaultTab: 'overview',
    sections: [
      {
        id: 'about',
        tab: 'overview',
        column: 'main',
        type: 'rich-text',
        title: 'About Me',
        icon: 'fas fa-user',
        paragraphs: [record.bio || 'This professional has not added a detailed bio yet.']
      },
      {
        id: 'style',
        tab: 'overview',
        column: 'main',
        type: 'style-session',
        title: 'Therapeutic Style',
        icon: 'fas fa-feather-alt',
        intro: 'How I work with clients:',
        tags: styleTags,
        noteTitle: 'First Session',
        note: record.firstSessionExpectations || 'We begin by understanding what feels most important for you right now.'
      },
      {
        id: 'expertise',
        tab: 'focus',
        column: 'main',
        type: 'focus-list',
        title: 'Areas of Expertise',
        icon: 'fas fa-briefcase',
        items: expertise.map((item) => ({
          icon: 'fas fa-brain',
          title: item,
          subtitle: 'Mapped from professional profile data'
        }))
      },
      {
        id: 'service-details',
        tab: 'details',
        column: 'side',
        type: 'info-list',
        title: 'Service Details',
        icon: 'fas fa-info-circle',
        items: [
          { label: 'License', kind: 'text', value: record.licenseNumber || 'Verified' },
          { label: 'Values', kind: 'tags', value: values },
          { label: 'Languages', kind: 'text', value: languages }
        ]
      }
    ]
  };
}

export { psychologistProfiles, peerProfiles };
