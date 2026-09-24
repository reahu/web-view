import { OrgMember } from '@core/models/org-member';

// From the client's organisation chart (PDF), in its left-to-right order. Names and
// titles only: photos stay off until each person agrees to theirs being online.
export const ORGANISATION: readonly OrgMember[] = [
  {
    id: 'sor-bunmalin',
    name: 'Sor Bunmalin',
    role: $localize`:@@org.role.president:President`,
    reportsTo: [],
  },
  {
    id: 'cheng-phally',
    name: 'Cheng Phally',
    role: $localize`:@@org.role.ceo:Chief Executive Officer`,
    reportsTo: ['sor-bunmalin'],
  },
  {
    id: 'jia-junxian',
    name: 'Jia Junxian',
    role: $localize`:@@org.role.ird:International Relations Director`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'hok-cheaven',
    name: 'Hok Cheaven',
    role: $localize`:@@org.role.ddir:Director of Domestic & International Relations`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'vith-sreymey',
    name: 'Vith Sreymey',
    role: $localize`:@@org.role.eaer:Executive Assistant & External Relations`,
    reportsTo: ['jia-junxian', 'hok-cheaven'],
  },
  {
    id: 'cai-liangrong',
    name: 'Cai Liangrong',
    role: $localize`:@@org.role.cto:Chief Technical Officer`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'zhang-quanjian',
    name: 'Zhang Quanjian',
    role: $localize`:@@org.role.technician:Technician`,
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'khun-chanthol',
    name: 'Khun Chanthol',
    role: $localize`:@@org.role.kpm:Koh Kong Provincial Manager`,
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'sroy-chendy',
    name: 'Sroy Chendy',
    role: $localize`:@@org.role.mm:Machinery Manager`,
    reportsTo: ['khun-chanthol'],
  },
  {
    id: 'cha-vin',
    name: 'Cha Vin',
    role: $localize`:@@org.role.sm:Site Manager`,
    reportsTo: ['khun-chanthol'],
  },
  {
    id: 'shang-deyao',
    name: 'Shang Deyao',
    role: $localize`:@@org.role.technician:Technician`,
    reportsTo: ['cai-liangrong'],
  },
  {
    id: 'chroy-thea',
    name: 'Chroy Thea',
    role: $localize`:@@org.role.am:Administration Manager`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'cai-rixin',
    name: 'Cai Rixin',
    role: $localize`:@@org.role.fd:Finance Director`,
    reportsTo: ['cheng-phally'],
  },
  {
    id: 'ya-ratha',
    name: 'Ya Ratha',
    role: $localize`:@@org.role.cashier:Cashier`,
    reportsTo: ['chroy-thea', 'cai-rixin'],
  },
];
