// Opportunity Grants — November 2026. Copy is verbatim from Tito's list; do not
// rewrite, reorder or summarise. Each grant keeps the lines under its name as
// written, label and text, in order ("Who", "Amount", "Deadline", "Check Nov",
// ...). The page makes every URL and email inside them clickable.

export type GrantField = [label: string, text: string]

export type Grant = {
  /** Unique across the whole page */
  n: number
  /** Number shown on the row, when the list numbers from 1 again */
  listNo?: number
  name: string
  fields: GrantField[]
}

export type GrantCategory = {
  id: string
  title: string
  subtitle?: string
  /** What the count under the title calls its rows. Defaults to "grant". */
  unit?: string
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
    'This grant and scholarship list was compiled by Tito Finance for informational purposes only, using information from official websites and public announcements available as of November 2026.',
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
  {
    id: 'category-c',
    title: 'PART C: 60 SCHOLARSHIPS FOR UNDER 45',
    subtitle: 'HERE’S THE 60 SCHOLARSHIP OPPORTUNITIES THAT ARE NIGERIAN-ELIGIBLE',
    unit: 'scholarship',
    grants: [
      {
        n: 101,
        listNo: 1,
        name: 'DAAD In-Country / In-Region Scholarship 2027',
        fields: [
          ['For', 'Masters students from Sub-Saharan Africa studying in 8 African countries'],
          ['Deadline', '12 Nov 2026'],
          ['Age', 'No strict limit, need Bachelor + 2 years experience'],
          ['Link', 'https://www.daad.org.za/en/study-research-in-south-africa/daad-in-region-scholarships/'],
        ],
      },
      {
        n: 102,
        listNo: 2,
        name: 'ALCHE Mastercard Foundation Scholars - Mauritius',
        fields: [
          ['For', 'Undergraduate Africans who need financial aid'],
          ['Deadline', '14 Nov 2026'],
          ['Age', '26 & below encouraged'],
          ['Link', 'https://alcheducation.com/apply-now/'],
        ],
      },
      {
        n: 103,
        listNo: 3,
        name: 'UBC International Scholars Program - Canada',
        fields: [
          ['For', 'First-degree Undergraduate, entry Sept 2027'],
          ['Deadline', '15 Nov 2026'],
          ['Age', 'Must be secondary school leaver'],
          ['Link', 'https://undergraduatescholarships.ubc.ca/prog/2027_international_scholars_program_application/'],
        ],
      },
      {
        n: 104,
        listNo: 4,
        name: 'DAAD EPOS Göttingen - Development Economics',
        fields: [
          ['For', 'Masters for working professionals from developing countries'],
          ['Deadline', '15 Nov 2026'],
          ['Age', '36 max typical'],
          ['Link', 'https://www.uni-goettingen.de/en/572462.html'],
        ],
      },
      {
        n: 105,
        listNo: 5,
        name: 'University of Edinburgh Mastercard Foundation Scholarship',
        fields: [
          ['For', 'Masters - African citizens'],
          ['Deadline', '19 Nov 2026'],
          ['Age', '35 or younger'],
          ['Link', 'https://edinburgh-global.ed.ac.uk/mastercard-foundation-scholars-program/apply-for-a-scholarship/how-to-apply'],
        ],
      },
      {
        n: 106,
        listNo: 6,
        name: 'Mastercard Foundation at ALU - Rwanda',
        fields: [
          ['For', 'Undergraduate in Kigali, Rwanda'],
          ['Deadline', '30 Nov 2026'],
          ['Age', '18-30 typical'],
          ['Link', 'https://www.alueducation.com/mastercard-foundation-scholars-program-at-alu/'],
        ],
      },
      {
        n: 107,
        listNo: 7,
        name: 'ETH Zurich Excellence Scholarship ESOP - Switzerland',
        fields: [
          ['For', 'Masters - Fully funded, tuition + CHF 13,500/semester'],
          ['Deadline', '30 Nov 2026'],
          ['Age', 'No age limit'],
          ['Link', 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html'],
        ],
      },
      {
        n: 108,
        listNo: 8,
        name: 'Yenching Academy - Peking University, China',
        fields: [
          ['For', 'Masters - Any nationality, fully funded'],
          ['Deadline', '30 Nov 2026'],
          ['Age', 'Under 28'],
          ['Link', 'https://yenchingacademy.pku.edu.cn/ADMISSIONS.htm'],
        ],
      },
      {
        n: 109,
        listNo: 9,
        name: 'Germany-CGIAR++ PhD Scholarship Hub',
        fields: [
          ['For', 'PhD - Agriculture/Climate at German universities'],
          ['Deadline', '30 Nov 2026'],
          ['Age', 'Under 40, €1,800/month'],
          ['Link', 'https://hub.landscapealliance.org/phd-research-scholarship'],
        ],
      },
      {
        n: 110,
        listNo: 10,
        name: 'NNPC/SNEPCo National University Scholarship',
        fields: [
          ['For', 'Nigerian 2nd year students in public universities'],
          ['Deadline', '30 Nov 2026'],
          ['Age', 'Undergraduate, CGPA 3.5/5 required'],
          ['Link', 'https://candidate.scholastica.ng/schemes/NNPCLTDSNEPCo25'],
        ],
      },
      {
        n: 111,
        listNo: 11,
        name: 'NDDC Postgraduate Scholarship',
        fields: [
          ['For', 'Niger Delta indigenes - Postgraduate'],
          ['Deadline', '8 Nov 2026'],
          ['Age', 'Not older than 40 years'],
        ],
      },
      {
        n: 112,
        listNo: 12,
        name: 'AUC Mastercard Foundation Graduate Fellowship - Egypt',
        fields: [
          ['For', 'African citizens living in Africa - Masters/PhD'],
          ['Deadline', '2 Nov 2026'],
          ['Age', '35 or younger'],
          ['Link', 'https://www.aucegypt.edu/admissions/fellowships/mastercard-foundation-scholars-program'],
        ],
      },
      {
        n: 113,
        listNo: 13,
        name: 'Commonwealth Shared Scholarship - UK',
        fields: [
          ['For', 'Masters for Commonwealth citizens - low/middle income'],
          ['Deadline', '8 Dec 2026'],
          ['Age', 'No age limit, need 2:1 degree - Under 45 can apply'],
          ['Link', 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships-applications/'],
        ],
      },
      {
        n: 114,
        listNo: 14,
        name: 'ADB-Japan Scholarship - Hawaii, USA',
        fields: [
          ['For', 'Masters in Development fields - Asian Development Bank member countries including Nigeria'],
          ['Deadline', '1 Dec 2026'],
          ['Age', 'No strict age, need Bachelor + work exp'],
          ['Link', 'https://www.adb.org/work-with-us/careers/japan-scholarship-program'],
        ],
      },
      {
        n: 115,
        listNo: 15,
        name: 'Erasmus Mundus MAPP - Europe',
        fields: [
          ['For', 'Masters in Public Policy - All nationalities'],
          ['Deadline', '1 Dec 2026'],
          ['Age', 'No age limit'],
          ['Link', 'https://www.mundusmapp.org/admissions-calendar/'],
        ],
      },
      {
        n: 116,
        listNo: 16,
        name: 'TU Delft Excellence Scholarship - Netherlands',
        fields: [
          ['For', 'Masters - 2 year MSc, any country'],
          ['Deadline', '1 Dec 2026'],
          ['Age', 'No age limit, need high CGPA'],
          ['Link', 'https://www.tudelft.nl/en/education/study-programme-orientation/practical-matters/scholarships'],
        ],
      },
      {
        n: 117,
        listNo: 17,
        name: 'Jim Leech Mastercard Fellowship - Canada (Virtual)',
        fields: [
          ['For', 'Entrepreneurship fellowship, 8 months virtual'],
          ['Deadline', '1 Dec 2026'],
          ['Age', 'Under 35'],
          ['Link', 'https://www.queensu.ca/innovationcentre/jim-leech-mastercard-foundation-fellowship'],
        ],
      },
      {
        n: 118,
        listNo: 18,
        name: 'Sciences Po Mastercard Foundation - France',
        fields: [
          ['For', '2-year Masters in Paris - African citizens'],
          ['Deadline', '14 Dec 2026'],
          ['Age', 'Under 35'],
          ['Link', 'https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/mastercard-foundation-scholarships/graduate-study/'],
        ],
      },
      {
        n: 119,
        listNo: 19,
        name: 'NOHA Erasmus Mundus - Humanitarian Action - Europe',
        fields: [
          ['For', 'Masters across European universities'],
          ['Deadline', '15 Dec 2026'],
          ['Age', 'No age limit'],
          ['Link', 'https://apply.nohanet.org/'],
        ],
      },
      {
        n: 120,
        listNo: 20,
        name: 'Carnegie Mellon Africa - Rwanda',
        fields: [
          ['For', 'Masters in IT/Engineering - Africans'],
          ['Deadline', '15 Dec 2026 - Early Admission'],
          ['Age', 'Under 35'],
          ['Link', 'https://www.africa.engineering.cmu.edu/admissions/how-to-apply/index.html'],
        ],
      },
      {
        n: 121,
        listNo: 21,
        name: 'Gates Cambridge Scholarship - UK',
        fields: [
          ['For', 'Masters & PhD at Cambridge - Any country outside UK'],
          ['Deadline', '8 Dec 2026 or 6 Jan 2027 by course'],
          ['Age', 'No age limit'],
          ['Link', 'https://www.gatescambridge.org/apply/timeline/'],
        ],
      },
      {
        n: 122,
        listNo: 22,
        name: 'France Excellence Eiffel Scholarship - France',
        fields: [
          ['For', 'Masters & PhD - French university nominates you'],
          ['Deadline', '6 Jan 2027'],
          ['Age', 'Masters under 27, PhD under 32'],
          ['Link', 'https://www.campusfrance.org/en/france-excellence-eiffel-scholarship-program'],
        ],
      },
      {
        n: 123,
        listNo: 23,
        name: 'Oxford-Weidenfeld & Hoffmann - UK',
        fields: [
          ['For', 'Masters at Oxford - 100% fees + £21,805 living'],
          ['Deadline', '6 Jan 2027'],
          ['Age', 'Under 35, leadership potential'],
          ['Link', 'https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarship-search/weidenfeld-hoffmann-scholarships-and-leadership-programme'],
        ],
      },
      {
        n: 124,
        listNo: 24,
        name: 'Swedish Institute Global Professionals - Sweden',
        fields: [
          ['For', 'Masters in Sweden - Africans eligible, 3000hrs work exp'],
          ['Deadline', '15 Jan 2027'],
          ['Age', 'No age limit, mid-career'],
          ['Link', 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/'],
        ],
      },
      {
        n: 125,
        listNo: 25,
        name: 'ENS Scholarship - France',
        fields: [
          ['For', 'Masters/Diploma - All countries - €1000/month + room'],
          ['Deadline', '15 Dec 2026'],
          ['Age', 'Under 26 for Masters'],
          ['Link', 'https://www.ens.psl.eu/en/une-formation-d-exception/admissions/international/international-selection'],
        ],
      },
      {
        n: 126,
        listNo: 26,
        name: 'MBZUAI Scholarship - UAE',
        fields: [
          ['For', 'Masters & PhD in AI - Abu Dhabi - Fully funded PhD'],
          ['Deadline', '15 Dec 2026'],
          ['Age', 'Under 35'],
          ['Link', 'https://mbzuai.ac.ae/admissions/graduate-masters-admissions'],
        ],
      },
      {
        n: 127,
        listNo: 27,
        name: 'Berlin School of Economics PhD - Germany',
        fields: [
          ['For', 'PhD Economics - Fully funded'],
          ['Deadline', '15 Jan 2027'],
          ['Age', 'Under 35'],
          ['Link', 'https://berlinschoolofeconomics.de/phd-programm/application'],
        ],
      },
      {
        n: 128,
        listNo: 28,
        name: 'Clarendon Scholarship - Oxford - UK',
        fields: [
          ['For', 'Masters & DPhil - All nationalities'],
          ['Deadline', 'Dec 2026 / Jan 2027 by course'],
          ['Age', 'No limit'],
          ['Link', 'https://www.ox.ac.uk/admissions/graduate/fees-and-funding/funding/clarendon/applicants'],
        ],
      },
      {
        n: 129,
        listNo: 29,
        name: 'Ashesi University Mastercard - Ghana',
        fields: [
          ['For', 'Undergraduate - Africans needing aid'],
          ['Deadline', 'December 2026 (Round 4)'],
          ['Age', '18-25'],
          ['Link', 'https://ashesi.edu.gh/how-to-apply/'],
        ],
      },
      {
        n: 130,
        listNo: 30,
        name: 'Erasmus Mundus EMMIR - Migration & Intercultural Relations',
        fields: [
          ['For', 'Masters - EU + non-EU'],
          ['Deadline', '20 Dec 2026'],
          ['Age', 'No limit'],
          ['Link', 'https://www.emmir.org/applications'],
        ],
      },
      {
        n: 131,
        listNo: 31,
        name: 'Erasmus Mundus Green Energy Market & Finance',
        fields: [
          ['For', 'Masters - Finance/Energy'],
          ['Deadline', '7 Jan 2027'],
          ['Age', 'No limit'],
          ['Link', 'https://site.unibo.it/grenfin-emjm/en'],
        ],
      },
      {
        n: 132,
        listNo: 32,
        name: 'Erasmus Mundus Euroculture',
        fields: [
          ['For', 'Masters - European Studies'],
          ['Deadline', '15 Jan 2027'],
          ['Age', 'No limit'],
          ['Link', 'https://euroculture.wsmip.uj.edu.pl/admissions'],
        ],
      },
      {
        n: 133,
        listNo: 33,
        name: 'CEU Yehuda Elkana Fellowship - Vienna',
        fields: [
          ['For', 'PhD - Fully funded'],
          ['Deadline', '15 Jan 2027'],
          ['Age', 'Under 40'],
          ['Link', 'https://elkana.ceu.edu/call-applications-yehuda-elkana-fellowship'],
        ],
      },
      {
        n: 134,
        listNo: 34,
        name: 'LJMU Vice-Chancellor PhD - Liverpool',
        fields: [
          ['For', 'PhD - UK & International'],
          ['Deadline', '29 Jan 2027'],
          ['Age', 'Under 45'],
          ['Link', 'https://www.ljmu.ac.uk/research/phd-studentship-application'],
        ],
      },
      {
        n: 135,
        listNo: 35,
        name: 'African Union Youth Fellowship',
        fields: [
          ['For', 'Fellowship for young Africans in AU'],
          ['Deadline', '31 Dec 2026'],
          ['Age', '18-35'],
        ],
      },
      {
        n: 136,
        listNo: 36,
        name: 'Tony Elumelu Foundation Entrepreneurship',
        fields: [
          ['For', 'African Entrepreneurs'],
          ['Deadline', 'Dec/Jan'],
          ['Age', '18-45'],
          ['Link', 'https://www.tonyelumelufoundation.org/tef-entrepreneurship-programme/faqs'],
        ],
      },
      {
        n: 137,
        listNo: 37,
        name: 'Mastercard Foundation UCT - South Africa',
        fields: [
          ['For', 'Postgrad'],
          ['Deadline', 'Dec 2026'],
          ['Age', 'Under 35'],
          ['Link', 'https://uct.ac.za/mastercardfdn/apply-mastercard-foundation-scholars-program'],
        ],
      },
      {
        n: 138,
        listNo: 38,
        name: 'Mastercard Foundation Cambridge - UK',
        fields: [
          ['For', 'Masters'],
          ['Deadline', 'Dec/Jan'],
          ['Age', 'Under 35'],
          ['Link', 'https://www.mastercardfoundation.fund.cam.ac.uk/faq'],
        ],
      },
      {
        n: 139,
        listNo: 39,
        name: 'Mastercard Foundation UC Berkeley - USA',
        fields: [
          ['For', 'Masters'],
          ['Deadline', 'Dec 2026'],
          ['Age', 'Under 35'],
          ['Link', 'https://mcfscholarsprogram.berkeley.edu/apply-be-mastercard-foundation-scholar-uc-berkeley'],
        ],
      },
      {
        n: 140,
        listNo: 40,
        name: 'Australia Awards Africa',
        fields: [
          ['For', 'Masters - Mid-career'],
          ['Deadline', 'Feb 2027'],
          ['Age', 'Under 45'],
          ['Link', 'https://australiaawardsafrica.org/awards/apply/'],
        ],
      },
      {
        n: 141,
        listNo: 41,
        name: 'Türkiye Bursları',
        fields: [
          ['For', 'BSc/MSc/PhD - All levels'],
          ['Deadline', 'Feb 2027'],
          ['Age', 'BSc <21, MSc <30, PhD <35'],
          ['Link', 'https://turkiyeburslari.gov.tr/scholarshipsprograms'],
        ],
      },
      {
        n: 142,
        listNo: 42,
        name: 'ICCR India Scholarship',
        fields: [
          ['For', 'BSc/MSc/PhD'],
          ['Deadline', 'Feb-Apr 2027'],
          ['Age', 'Under 40'],
          ['Link', 'https://a2ascholarships.iccr.gov.in/home/getAllSchemeList'],
        ],
      },
      {
        n: 143,
        listNo: 43,
        name: 'Romanian Govt Scholarship',
        fields: [
          ['For', 'BSc/MSc/PhD'],
          ['Deadline', 'March 2027'],
          ['Age', 'BSc <25, MSc <35'],
          ['Link', 'https://scholarships.studyinromania.gov.ro/'],
        ],
      },
      {
        n: 144,
        listNo: 44,
        name: 'Slovak Govt Scholarship',
        fields: [
          ['For', 'BSc/MSc'],
          ['Deadline', 'Apr-May 2027'],
          ['Age', 'Under 35'],
          ['Link', 'https://www.minedu.sk/scholarships-of-the-government-of-the-slovak-republic/'],
        ],
      },
      {
        n: 145,
        listNo: 45,
        name: 'Stipendium Hungaricum - Hungary',
        fields: [
          ['For', 'BSc/MSc/PhD'],
          ['Deadline', 'Jan 2027'],
          ['Age', 'Under 40'],
          ['Link', 'https://stipendiumhungaricum.hu/apply/'],
        ],
      },
      {
        n: 146,
        listNo: 46,
        name: 'DAAD Helmut Schmidt Public Policy',
        fields: [
          ['For', 'Masters'],
          ['Deadline', 'July'],
          ['Age', 'Under 36'],
          ['Link', 'https://www.daad.de/en/studying-in-germany/scholarships/daad-funding-programmes/helmut-schmidt-programme/'],
        ],
      },
      {
        n: 147,
        listNo: 47,
        name: 'Erasmus Mundus Joint Masters (other courses)',
        fields: [
          ['For', 'Masters'],
          ['Deadline', 'Oct-Jan'],
          ['Age', 'No limit'],
          ['Link', 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters'],
        ],
      },
      {
        n: 148,
        listNo: 48,
        name: 'Chevening - UK (Next cycle prep)',
        fields: [
          ['For', 'Masters'],
          ['Deadline', 'Aug-Oct 2027'],
          ['Age', 'No limit, 2 yrs exp'],
          ['Link', 'https://www.chevening.org/scholarships/'],
        ],
      },
      {
        n: 149,
        listNo: 49,
        name: 'Commonwealth Masters - UK',
        fields: [
          ['For', 'Masters'],
          ['Deadline', 'Oct 2027'],
          ['Age', 'No limit'],
          ['Link', 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/'],
        ],
      },
      {
        n: 150,
        listNo: 50,
        name: 'Rhodes Scholarship West Africa',
        fields: [
          ['For', 'Masters'],
          ['Deadline', 'Aug 2027'],
          ['Age', '18-24'],
          ['Link', 'https://www.rhodeshouse.ox.ac.uk/scholarships/applications/west-africa/eligibilitycriteria/'],
        ],
      },
      {
        n: 151,
        listNo: 51,
        name: 'Mandela Washington Fellowship - USA',
        fields: [
          ['For', 'Young Leaders'],
          ['Deadline', 'Sept'],
          ['Age', '25-35'],
          ['Link', 'https://www.mandelawashingtonfellowship.org/'],
        ],
      },
      {
        n: 152,
        listNo: 52,
        name: 'Acumen Fellowship',
        fields: [
          ['For', 'Social Entrepreneurs'],
          ['Deadline', 'Dec'],
          ['Age', 'Under 40'],
          ['Link', 'https://fellowship.acumenacademy.org/west-africa'],
        ],
      },
      {
        n: 153,
        listNo: 53,
        name: 'Anzisha Prize - Africa',
        fields: [
          ['For', 'Young Entrepreneurs'],
          ['Deadline', 'Dec'],
          ['Age', '15-22'],
          ['Link', 'https://anzisha.org/anzisha-prize/apply/'],
        ],
      },
      {
        n: 154,
        listNo: 54,
        name: 'LEAP Africa Fellowship',
        fields: [
          ['For', 'Youth Leadership'],
          ['Deadline', 'Dec'],
          ['Age', '18-35'],
          ['Link', 'https://leapafrica.org/sip/'],
        ],
      },
      {
        n: 155,
        listNo: 55,
        name: 'Carrington Youth Fellowship - Nigeria',
        fields: [
          ['For', 'Young Professionals Lagos'],
          ['Deadline', 'Dec'],
          ['Age', '18-35'],
        ],
      },
      {
        n: 156,
        listNo: 56,
        name: 'YALI Regional Leadership - Africa',
        fields: [
          ['For', 'Young Leaders'],
          ['Deadline', 'Dec/Jan'],
          ['Age', '18-35'],
        ],
      },
      {
        n: 157,
        listNo: 57,
        name: 'Obama Foundation Scholars - USA',
        fields: [
          ['For', 'Emerging Leaders'],
          ['Deadline', 'Dec'],
          ['Age', '25-40'],
        ],
      },
      {
        n: 158,
        listNo: 58,
        name: 'Atlantic Fellows LSE - UK',
        fields: [
          ['For', 'Social Equity'],
          ['Deadline', '11 Jan 2027'],
          ['Age', 'Under 45'],
          ['Link', 'https://www.lse.ac.uk/study-at-lse/Graduate/fees-and-funding/residential-atlantic-fellowship'],
        ],
      },
      {
        n: 159,
        listNo: 59,
        name: 'SA-CERN Excellence Bursary - South Africa',
        fields: [
          ['For', 'Physics Students'],
          ['Deadline', 'Rolling'],
          ['Age', 'Under 35'],
        ],
      },
      {
        n: 160,
        listNo: 60,
        name: 'Mastercard Foundation Associates - Nigeria/Ghana',
        fields: [
          ['For', 'Graduates Work Placement'],
          ['Deadline', 'Rolling'],
          ['Age', 'Under 35'],
          ['Link', 'https://mastercardfdn.org/associates-program'],
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
