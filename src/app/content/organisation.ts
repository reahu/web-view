import { OrgHeading, OrgMember } from '@core/models/org-member';

// The chart's heading, as printed: the company and the title in Khmer, English and Chinese.
// Letter case is the page's (the print is in capitals), so screen readers don't spell it out.
export const ORGANISATION_HEADING: OrgHeading = {
  company: [
    { lang: 'km', text: 'ក្រុមហ៊ុន ម៉ាលីន កោះកុង ភីស ឌីវេឡុបមិន ឯ.ក' },
    { lang: 'en', text: 'Malin Koh Kong Peace Development Co., Ltd.' },
    { lang: 'zh-Hans', text: '马林戈公和平发展有限公司' },
  ],
  title: [
    { lang: 'km', text: 'រចនាសម្ព័ន្ធ' },
    { lang: 'en', text: 'Organizational structure' },
    { lang: 'zh-Hans', text: '组织架构' },
  ],
};

// From the client's organisation chart (PDF), in its left-to-right order. Photos are the
// chart's own portraits; everyone agreed to theirs being online (user, 2026-09-24).
export const ORGANISATION: readonly OrgMember[] = [
  {
    id: 'sor-bunmalin',
    name: 'Sor Bunmalin',
    photo: '/images/people/sor-bunmalin.webp',
    role: 'org.role.president',
    reportsTo: [],
  },
  {
    id: 'cheng-phally',
    name: 'Cheng Phally',
    photo: '/images/people/cheng-phally.webp',
    role: 'org.role.ceo',
    reportsTo: ['sor-bunmalin'],
  },
  {
    id: 'jia-junxian',
    name: 'Jia Junxian',
    photo: '/images/people/jia-junxian.webp',
    role: 'org.role.ird',
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'hok-cheaven',
    name: 'Hok Cheaven',
    photo: '/images/people/hok-cheaven.webp',
    role: 'org.role.ddir',
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'vith-sreymey',
    name: 'Vith Sreymey',
    photo: '/images/people/vith-sreymey.webp',
    role: 'org.role.eaer',
    reportsTo: ['jia-junxian', 'hok-cheaven'],
  },
  {
    id: 'cai-liangrong',
    name: 'Cai Liangrong',
    photo: '/images/people/cai-liangrong.webp',
    role: 'org.role.cto',
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'zhang-quanjian',
    name: 'Zhang Quanjian',
    photo: '/images/people/zhang-quanjian.webp',
    role: 'org.role.technician',
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'khun-chanthol',
    name: 'Khun Chanthol',
    photo: '/images/people/khun-chanthol.webp',
    role: 'org.role.kpm',
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'sroy-chendy',
    name: 'Sroy Chendy',
    photo: '/images/people/sroy-chendy.webp',
    role: 'org.role.mm',
    reportsTo: ['khun-chanthol'],
  },
  {
    id: 'cha-vin',
    name: 'Cha Vin',
    photo: '/images/people/cha-vin.webp',
    role: 'org.role.sm',
    reportsTo: ['khun-chanthol'],
  },
  {
    id: 'shang-deyao',
    name: 'Shang Deyao',
    photo: '/images/people/shang-deyao.webp',
    role: 'org.role.technician',
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'chroy-thea',
    name: 'Chroy Thea',
    photo: '/images/people/chroy-thea.webp',
    role: 'org.role.am',
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'cai-rixin',
    name: 'Cai Rixin',
    photo: '/images/people/cai-rixin.webp',
    role: 'org.role.fd',
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'ya-ratha',
    name: 'Ya Ratha',
    photo: '/images/people/ya-ratha.webp',
    role: 'org.role.cashier',
    reportsTo: ['chroy-thea', 'cai-rixin'],
  },
];
