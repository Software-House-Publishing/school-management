export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface PressItem {
  id: string;
  slug: string;
  date: string;
  title: string;
  source: string;
  content: string;
  image?: string;
}

export const jobOpenings: JobOpening[] = [
  {
    id: '1',
    slug: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Engineer to help us build the future of education technology. You will be working with a modern tech stack including React, TypeScript, and Tailwind CSS.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of web performance and accessibility',
      'Experience with modern state management (Zustand, Redux, etc.)',
      'Passion for education and building user-centric products'
    ]
  },
  {
    id: '2',
    slug: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our design team to create intuitive and beautiful experiences for students, teachers, and administrators. You will be involved in the entire product development process, from research to visual design.',
    requirements: [
      '3+ years of product design experience',
      'Strong portfolio demonstrating UI/UX skills',
      'Proficiency in Figma and prototyping tools',
      'Ability to communicate design decisions effectively'
    ]
  },
  {
    id: '3',
    slug: 'customer-success-manager',
    title: 'Customer Success Manager',
    department: 'Sales',
    location: 'London, UK',
    type: 'Full-time',
    description: 'We are seeking a Customer Success Manager to ensure our school partners achieve their goals with Classivo. You will be the trusted advisor for our customers.',
    requirements: [
      '2+ years of experience in Customer Success or Account Management',
      'Excellent communication and relationship-building skills',
      'Experience in EdTech is a plus',
      'Ability to manage multiple accounts and priorities'
    ]
  },
  {
    id: '4',
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Contract',
    description: 'Help us scale our infrastructure and improve our deployment pipelines. You will work closely with the engineering team to ensure reliability and security.',
    requirements: [
      'Experience with AWS, Docker, and Kubernetes',
      'Strong knowledge of CI/CD pipelines (GitHub Actions)',
      'Infrastructure as Code experience (Terraform)',
      'Security-first mindset'
    ]
  },
];

export const pressItems: PressItem[] = [
  {
    id: '1',
    slug: 'academiaos-raises-series-b',
    date: 'Oct 24, 2023',
    title: 'Classivo Raises Series B Funding to Expand Global Reach',
    source: 'TechCrunch',
    content: 'Classivo, the leading school management platform, today announced it has raised Series B funding led by top-tier venture capital firms. This investment will accelerate our mission to transform education globally.'
  },
  {
    id: '2',
    slug: 'new-ai-features-launch',
    date: 'Sep 15, 2023',
    title: 'New AI Features Launch to Help Teachers Save Time',
    source: 'EdSurge',
    content: 'We are excited to introduce a suite of new AI-powered features designed to reduce administrative burden for teachers. From automated grading assistance to personalized lesson planning, these tools are game-changers.'
  },
  {
    id: '3',
    slug: 'academiaos-named-best-cms',
    date: 'Aug 01, 2023',
    title: 'Classivo Named Best School Management System of 2023',
    source: 'Education Week',
    content: 'Classivo has been recognized as the Best School Management System of 2023 by Education Week. This award highlights our commitment to excellence and our positive impact on schools around the world.'
  },
];
