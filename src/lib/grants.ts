// Opportunity Grants — November 2026. Copy is verbatim from Tito's list; do not
// rewrite, reorder or summarise. Each grant keeps the lines under its name as
// written, label and text, in order ("Who", "Amount", "Deadline", "Check Nov",
// ...). The page makes every URL and email inside them clickable.

export type GrantField = [label: string, text: string]

export type Grant = {
  n: number
  name: string
  fields: GrantField[]
}

export type GrantCategory = {
  id: string
  title: string
  subtitle?: string
  grants: Grant[]
}

// Only these lines are closing dates. "Date", "Event", "Starts" and the like
// are event days, not deadlines, so they never mark a grant closed.
const DEADLINE_LABELS = new Set(['Deadline', 'Closes'])

export function deadlineText(grant: Grant): string | null {
  return grant.fields.find(([label]) => DEADLINE_LABELS.has(label))?.[1] ?? null
}

export const GRANTS_INTRO = [
  'HERE’S THE 30 OPPORTUNITIES FUNDING LIST (+ 10 MORE!)',
  'THAT ARE NIGERIAN-ELIGIBLE WITH LINKS AND ALL CLOSE IN NOVEMBER, 2026',
]

export const GRANTS_DISCLAIMER = {
  title: 'IMPORTANT DISCLAIMER',
  lead: [
    'This grant list was compiled by Tito Finance for informational purposes only, using information from official websites and public announcements available as of November 2026.',
    'While we have made every effort to ensure accuracy, grant deadlines, requirements, and funding amounts are subject to change by the organizers without notice.',
  ],
  adviseTitle: 'We strongly advise you to:',
  advise: [
    'Verify all information directly on the official grant website',
    'Read the full eligibility guidelines before applying.',
    'Never pay anyone who promises to guarantee your selection.',
  ],
  closing: [
    'Tito Finance is not affiliated with, nor does it represent, any of the organizations listed.',
    'We do not process applications nor guarantee funding.  Applying does not guarantee selection.',
    'Please do your own research properly before submitting any application or sharing sensitive personal documents.',
  ],
}

export const GRANT_CATEGORIES: GrantCategory[] = [
  {
    id: 'category-a',
    title: 'PART A: NIGERIA',
    grants: [
      {
        n: 1,
        name: 'Orange Corners Nigeria Cohort 16',
        fields: [
          ['About', '6-month incubation for 18-35yr Lagos founders. Training, coaching, mentorship, prototype funding for sustainable businesses.'],
          ['Amount', 'Up to €30,000'],
          ['Deadline', 'Nov 30, 2026'],
          ['Link', 'soar.fatefoundation.org/auth/login'],
        ],
      },
      {
        n: 2,
        name: 'TRISEG SME Programme',
        fields: [
          ['About', 'Trade for Resilient, Inclusive & Sustainable Growth. For processed food SMEs to become export-ready for Canada market, buyer linkages, finance access.'],
          ['Deadline', 'Nov 30, 2026'],
          ['Link', 'https://ee-eu.kobotoolbox.org/single/1qdcnMDz'],
        ],
      },
      {
        n: 3,
        name: 'Open Arts Fund - Up to ₦500k unrestricted',
        fields: [
          ['Who', 'Artists/creatives based in Nigeria whose project helps Northern Nigeria creative scene'],
          ['Deadline', 'Nov 10'],
          ['Apply', 'Email PDF to info@openartsworld.org subject "Open Arts Fund"'],
        ],
      },
      {
        n: 4,
        name: 'Open Arts Community Fund - Up to ₦500k + event at Open Arts Space',
        fields: [
          ['Who', 'Only Open Arts Community members with membership code'],
          ['Deadline', 'Nov 10'],
          ['Apply', 'info@openartsworld.org subject "Open Arts Community Fund"'],
        ],
      },
      {
        n: 5,
        name: 'EWA Deal Room Grant Pool - Lagos',
        fields: [
          ['Who', 'African creative businesses seeking investment, part of Entertainment Week Africa'],
          ['Date', 'Nov 17-22'],
          ['Link', 'https://ewa.africa'],
        ],
      },
      {
        n: 6,
        name: 'Orange Corners Nigeria Incubation - €30k value + incubation',
        fields: [
          ['Who', 'Nigerian entrepreneurs 18-35 with validated business idea'],
          ['Deadline', 'Nov 30'],
          ['Link', 'https://orangecorners.com/nigeria'],
        ],
      },
      {
        n: 7,
        name: 'Swarovski Foundation Creatives for Our Future - €20,000',
        fields: [
          ['Who', 'Creatives 21-30 by Nov 9, fashion/design/art/architecture/tech, project linked to SDGs'],
          ['Deadline', 'Nov 9, 11:59pm GMT'],
          ['Link', 'https://www.swarovskifoundation.com/creatives-for-our-future'],
        ],
      },
      {
        n: 8,
        name: 'WIMBIZ Impact Investment - Up to ₦6m',
        fields: [
          ['Who', 'Women-owned businesses in Nigeria'],
          ['Event', 'Nov 5-6 conference'],
          ['Link', 'https://wimbiz.org'],
        ],
      },
      {
        n: 9,
        name: 'Anzisha Venture Building Fellowship - Share of $40k + coaching',
        fields: [
          ['Who', 'African founders 15-22 already running a real business'],
          ['Deadline', 'Nov 10'],
          ['Link', 'https://anzisha.org'],
        ],
      },
      {
        n: 10,
        name: 'ARTCATION ₦2m Creative Grant',
        fields: [
          ['Who', 'Nigerian visual artists, designers, interdisciplinary creatives'],
          ['Period', 'Q1 shortlist in Nov'],
          ['Link', 'https://artcation.com.ng'],
        ],
      },
      {
        n: 11,
        name: 'Creative Economy Development Fund (CEDF) Phase 2',
        fields: [
          ['Who', 'Nigerian creative MSMEs - film, music, fashion, publishing, gaming'],
          ['Type', 'Debt/equity/grant up to $100k'],
          ['Link', 'https://cedf.gov.ng'],
        ],
      },
      {
        n: 12,
        name: 'LSETF MSME Fund - ₦250k to ₦5m',
        fields: [
          ['Who', 'Lagos-based business owners with LASRRA + CAC'],
          ['Window', 'Opens Nov'],
          ['Link', 'https://lsetf.ng'],
        ],
      },
      {
        n: 13,
        name: 'FATE Foundation AEP - Training + grant pipeline',
        fields: [
          ['Who', 'Aspiring Nigerian entrepreneurs with business less than 2 years'],
          ['Cohort', 'Nov'],
          ['Link', 'https://fatefoundation.org'],
        ],
      },
      {
        n: 14,
        name: 'Tony Elumelu Foundation Alumni Top-up - $5k',
        fields: [
          ['Who', 'Existing TEF alumni only'],
          ['Check', 'https://tefconnect.com in Nov'],
        ],
      },
      {
        n: 15,
        name: 'Sterling Bank / SMEDAN Matching Fund',
        fields: [
          ['Who', 'SMEDAN-registered Nigerian MSMEs'],
          ['', 'Apply via Sterling OneBank app'],
        ],
      },
      {
        n: 16,
        name: 'Prince Casper Foundation Impact Grants - ₦500k/200k/100k',
        fields: [
          ['Who', 'Educators & education-focused creative entrepreneurs in rural/underserved Nigerian schools'],
          ['Deadline', 'Nov 6, 11:59pm WAT'],
        ],
      },
      {
        n: 17,
        name: 'SMEDAN MSME Conference Marketplace - 30 Free Booths',
        fields: [
          ['Who', 'Nigerian businesses 2+ years, CAC registered, for exhibition Nov 8-10'],
          ['Link', 'https://conference.smedan.gov.ng/marketplace'],
        ],
      },
      {
        n: 18,
        name: 'NIMASA BEAP - Blue Economy Accelerator',
        fields: [
          ['Who', 'Nigerian businesses in maritime, logistics, media, tourism'],
          ['Link', 'https://nimasa.gov.ng'],
        ],
      },
      {
        n: 19,
        name: 'British Council UK-Nigeria Creative Fund',
        fields: [
          ['Who', 'Nigerian creative businesses collaborating with UK creatives'],
          ['Link', 'https://www.britishcouncil.org.ng'],
        ],
      },
      {
        n: 20,
        name: 'Africa Business Heroes - $100k to $300k',
        fields: [
          ['Who', 'African entrepreneurs with operating business + revenue'],
          ['Announcement', 'Nov'],
          ['Link', 'https://africabusinessheroes.org'],
        ],
      },
      {
        n: 21,
        name: 'GoGettaz Agripreneur Prize - $50k total + mentorship',
        fields: [
          ['Who', 'Youth 18-35 in agribusiness including creative food/baking'],
          ['Link', 'https://gogettaz.africa'],
        ],
      },
      {
        n: 22,
        name: 'CcHUB Growth Capital',
        fields: [
          ['Who', 'Early-stage Lagos tech & creative startups'],
          ['Link', 'https://cchub.africa'],
        ],
      },
      {
        n: 23,
        name: 'Afreximbank CANEX Creatives Prize',
        fields: [
          ['Who', 'African creatives in fashion, film, music, craft'],
          ['Link', 'https://canex.africa'],
        ],
      },
      {
        n: 24,
        name: 'Heirs Insurance Innovation Challenge',
        fields: [['Who', 'Nigerian SMEs with insurance/protection ideas']],
      },
      {
        n: 25,
        name: 'Google for Startups Africa - $100k credits + non-dilutive',
        fields: [
          ['Who', 'African tech startups Seed to Series A'],
          ['Link', 'https://campus.google.com'],
        ],
      },
      {
        n: 26,
        name: 'Meta Small Business Grants',
        fields: [
          ['Who', 'Nigerian small businesses running ads on Facebook/Instagram'],
          ['Link', 'https://www.facebook.com/business/small-business/grants'],
        ],
      },
      {
        n: 27,
        name: 'YouWin Connect Naija',
        fields: [
          ['Who', 'Nigerian youth 18-40 with business plan'],
          ['Link', 'https://youwin.org.ng'],
        ],
      },
      {
        n: 28,
        name: 'Bank of Industry Creative Industry Fund',
        fields: [
          ['Who', 'Nigerian creatives in film, fashion, music production'],
          ['Link', 'https://www.boi.ng'],
        ],
      },
      {
        n: 29,
        name: 'Nigerian First Fair - Ecobank Centre',
        fields: [
          ['Who', 'Made-in-Nigeria product businesses'],
          ['Register', 'https://conference.smedan.gov.ng'],
        ],
      },
      {
        n: 30,
        name: 'SMEDAN Portal - Get ID',
        fields: [
          ['Who', 'EVERY Nigerian business owner who wants any FG grant'],
          ['Link', 'https://portal.smedan.gov.ng/signup'],
        ],
      },
    ],
  },
  {
    id: 'category-b',
    title: 'PART B: DIASPORA / GLOBAL FOR NIGERIANS ABROAD',
    grants: [
      {
        n: 31,
        name: 'Harambeans Africa Jobs Fund Prize - $20k + path to $100k pilot',
        fields: [
          ['Who', 'Born in Africa OR of African descent, building export/manufacturing in Africa'],
          ['Winner announced', 'Nov 12 London'],
          ['Link', 'https://harambeans.com'],
        ],
      },
      {
        n: 32,
        name: 'Somalia Business Plan Competition - $20k',
        fields: [
          ['Who', 'African diaspora willing to build in Somalia/Horn, export-focused founders'],
          ['Deadline', 'Nov 6'],
        ],
      },
      {
        n: 33,
        name: 'Commonwealth Startup Fellowship - £2,000 + Accra bootcamp + London capstone',
        fields: [
          ['Who', 'Citizens of 44 Commonwealth countries including Nigeria, graduate-level, startup with 12 months+ paying customers'],
          ['Starts', 'Nov 16'],
          ['Link', 'https://comsec.apply.capp.co'],
        ],
      },
      {
        n: 34,
        name: 'UK Government Start Up Loans - £500 to £25k + mentoring',
        fields: [
          ['Who', 'UK residents including ethnic minority founders'],
          ['Link', 'https://www.startuploans.co.uk'],
        ],
      },
      {
        n: 35,
        name: 'Erase Indifference Challenge - €20k main + seven €10k',
        fields: [
          ['Who', 'NGOs, startups, companies globally tackling indifference'],
          ['Closes', 'Dec 4, shortlist in Nov'],
        ],
      },
      {
        n: 36,
        name: 'Mandela Washington Fellowship',
        fields: [
          ['Who', 'Young African leaders 25-35'],
          ['Check Nov', 'https://yali.state.gov'],
        ],
      },
      {
        n: 37,
        name: 'Canada Black Entrepreneurship Program Training',
        fields: [['Who', 'Black entrepreneurs in Canada']],
      },
      {
        n: 38,
        name: 'Visa Foundation Business Grant - Up to $250k',
        fields: [['Who', 'Nonprofits that support small businesses']],
      },
      {
        n: 39,
        name: 'Adobe Creative Residency Community Fund - $10k',
        fields: [
          ['Who', 'Global creatives including African diaspora'],
          ['Link', 'https://adobe.com/creative-residency'],
        ],
      },
      {
        n: 40,
        name: 'YouTube Black Voices Fund UK/US',
        fields: [
          ['Who', 'Black creators in US/UK including Nigerian diaspora'],
          ['Link', 'https://www.youtube.com/blackvoices'],
        ],
      },
      {
        n: 41,
        name: 'Canva x AfriLabs Diaspora Creative Grants',
        fields: [['Who', 'African creatives & diaspora using design for social impact']],
      },
      {
        n: 42,
        name: 'GlobalGiving Accelerator + $5k matching',
        fields: [
          ['Who', 'Nonprofits globally including diaspora-led African NGOs'],
          ['Link', 'https://www.globalgiving.org/accelerator'],
        ],
      },
      {
        n: 43,
        name: 'World Bank Youth Innovation Fund - 10k-50k',
        fields: [
          ['Who', 'Youth 18-35 globally with Africa-focused solutions'],
          ['Link', 'https://www.worldbank.org'],
        ],
      },
      {
        n: 44,
        name: 'Black Entrepreneurship Program Canada',
        fields: [
          ['Who', 'Black-led nonprofits delivering training/mentorship to Black entrepreneurs'],
          ['Link', 'https://ised-isde.canada.ca'],
        ],
      },
    ],
  },
]


export const GRANTS_CLOSING = {
  title: 'LOVED THIS LIST?',
  body: [
    'Grants are just one part of making money work for you.',
    'Inside the Tito Finance Community, we break down how to earn more, manage what you have, and grow your money - every week - without the jargon.',
    'If you want your money to finally work for you, not against you.',
  ],
  registerLabel: 'REGISTER FOR MY FREE STOCK 101 SESSION HERE:',
  registerText: 'https://www.titofinance.com/stock-101',
  community: 'We have daily tips, monthly challenges, co-working sessions and office hours to keep you accountable.',
  follow: "Follow me so you don't miss the next money opportunity.",
  socials: [
    { label: 'ON INSTAGRAM:', handle: '@teetobee', href: 'https://www.instagram.com/teetobee' },
    { label: 'ON TIKTOK:', handle: '@titobioreolorun', href: 'https://www.tiktok.com/@titobioreolorun' },
    { label: 'ON X:', handle: '@titonaija', href: 'https://x.com/titonaija' },
    // "@TITOBI OREOLORUN" is a display name, not a valid handle; points at the
    // channel the rest of the site already links.
    { label: 'ON YOUTUBE:', handle: '@TITOBI OREOLORUN', href: 'https://www.youtube.com/@teetobee' },
  ],
}

export const GRANT_COUNT = GRANT_CATEGORIES.reduce((sum, c) => sum + c.grants.length, 0)
