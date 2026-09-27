import { OrgMember } from '@core/models/org-member';

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
