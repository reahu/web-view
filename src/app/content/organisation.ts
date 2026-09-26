import { OrgMember } from '@core/models/org-member';

// From the client's organisation chart (PDF), in its left-to-right order. Photos are the
// chart's own portraits; everyone agreed to theirs being online (user, 2026-09-24).
export const ORGANISATION: readonly OrgMember[] = [
  {
    id: 'sor-bunmalin',
    name: 'Sor Bunmalin',
    photo: '/images/people/sor-bunmalin.webp',
    role: $localize`:@@org.role.president:President`,
    reportsTo: [],
  },
  {
    id: 'cheng-phally',
    name: 'Cheng Phally',
    photo: '/images/people/cheng-phally.webp',
    role: $localize`:@@org.role.ceo:Chief Executive Officer`,
    reportsTo: ['sor-bunmalin'],
  },
  {
    id: 'jia-junxian',
    name: 'Jia Junxian',
    photo: '/images/people/jia-junxian.webp',
    role: $localize`:@@org.role.ird:International Relations Director`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'hok-cheaven',
    name: 'Hok Cheaven',
    photo: '/images/people/hok-cheaven.webp',
    role: $localize`:@@org.role.ddir:Director of Domestic & International Relations`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'vith-sreymey',
    name: 'Vith Sreymey',
    photo: '/images/people/vith-sreymey.webp',
    role: $localize`:@@org.role.eaer:Executive Assistant & External Relations`,
    reportsTo: ['jia-junxian', 'hok-cheaven'],
  },
  {
    id: 'cai-liangrong',
    name: 'Cai Liangrong',
    photo: '/images/people/cai-liangrong.webp',
    role: $localize`:@@org.role.cto:Chief Technical Officer`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'zhang-quanjian',
    name: 'Zhang Quanjian',
    photo: '/images/people/zhang-quanjian.webp',
    role: $localize`:@@org.role.technician:Technician`,
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'khun-chanthol',
    name: 'Khun Chanthol',
    photo: '/images/people/khun-chanthol.webp',
    role: $localize`:@@org.role.kpm:Koh Kong Provincial Manager`,
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'sroy-chendy',
    name: 'Sroy Chendy',
    photo: '/images/people/sroy-chendy.webp',
    role: $localize`:@@org.role.mm:Machinery Manager`,
    reportsTo: ['khun-chanthol'],
  },
  {
    id: 'cha-vin',
    name: 'Cha Vin',
    photo: '/images/people/cha-vin.webp',
    role: $localize`:@@org.role.sm:Site Manager`,
    reportsTo: ['khun-chanthol'],
  },
  {
    id: 'shang-deyao',
    name: 'Shang Deyao',
    photo: '/images/people/shang-deyao.webp',
    role: $localize`:@@org.role.technician:Technician`,
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'chroy-thea',
    name: 'Chroy Thea',
    photo: '/images/people/chroy-thea.webp',
    role: $localize`:@@org.role.am:Administration Manager`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'cai-rixin',
    name: 'Cai Rixin',
    photo: '/images/people/cai-rixin.webp',
    role: $localize`:@@org.role.fd:Finance Director`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'ya-ratha',
    name: 'Ya Ratha',
    photo: '/images/people/ya-ratha.webp',
    role: $localize`:@@org.role.cashier:Cashier`,
    reportsTo: ['chroy-thea', 'cai-rixin'],
  },
];
