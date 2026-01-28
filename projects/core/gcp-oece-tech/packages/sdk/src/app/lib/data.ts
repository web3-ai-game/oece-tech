import { Cloud, Database, Server, Cpu } from 'lucide-react';

export const products = [
  {
    icon: Cloud,
    name: 'Elastic Cloud',
    description: 'Scalable and resilient cloud computing for any workload. Deploy virtual machines in seconds.',
    price: '$0.05/hour',
    features: ['On-demand scaling', '99.99% uptime SLA', 'Global data centers'],
  },
  {
    icon: Database,
    name: 'Managed Databases',
    description: 'Fully managed SQL and NoSQL databases. Focus on your app, not database administration.',
    price: '$0.10/hour',
    features: ['Automated backups', 'High availability', 'Read replicas'],
  },
  {
    icon: Server,
    name: 'Enterprise Kubernetes',
    description: 'Deploy and manage containerized applications with our robust Kubernetes engine.',
    price: '$0.08/hour',
    features: ['Auto-scaling clusters', 'Private networking', 'Integrated monitoring'],
  },
  {
    icon: Cpu,
    name: 'AI & Machine Learning',
    description: 'Powerful tools and infrastructure to build, train, and deploy machine learning models at scale.',
    price: 'Custom',
    features: ['GPU acceleration', 'Jupyter notebooks', 'Pre-trained models'],
  },
];

export const testimonials = [
  {
    id: '1',
    company: 'InnovateCorp',
    logoId: 'innovateCorpLogo',
    quote: "Enterprise Cloud Hub's infrastructure has been a game-changer for our scalability. Their support is second to none.",
    author: 'Jane Doe',
    title: 'CTO, InnovateCorp',
  },
  {
    id: '2',
    company: 'QuantumLeap',
    logoId: 'quantumLeapLogo',
    quote: 'Migrating to Enterprise Cloud Hub was seamless. We saw a 30% reduction in our operational costs within the first quarter.',
    author: 'John Smith',
    title: 'CEO, QuantumLeap',
  },
  {
    id: '3',
    company: 'Synergy Systems',
    logoId: 'synergySystemsLogo',
    quote: 'The reliability and performance of their managed database service are exceptional. It allows our team to focus on innovation.',
    author: 'Emily White',
    title: 'Head of Engineering, Synergy Systems',
  },
];
