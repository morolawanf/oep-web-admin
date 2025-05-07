import { BannerType } from '@/app/shared/ecommerce/banners/banner-types';

export const banners: BannerType[] = [
  {
    _id: '1',
    name: 'Main Banner',
    imageUrl:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/bags.webp',
    pageLink: '/home',
    active: true,
    category: 'A',
    createdAt: new Date('2025-04-01'),
  },
  {
    _id: '2',
    name: 'Sale Sunglass',
    imageUrl:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/sunglass.webp',
    pageLink: '/sale',
    active: false,
    category: 'B',
    createdAt: new Date('2025-04-10'),
  },
  {
    _id: '3',
    name: 'Watch Promo',
    imageUrl:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/watch.webp',
    pageLink: '/watches',
    active: true,
    category: 'C',
    createdAt: new Date('2025-04-15'),
  },
  {
    _id: '4',
    name: 'Sneaker Drop',
    imageUrl:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/sneakers.webp',
    pageLink: '/sneakers',
    active: false,
    category: 'D',
    createdAt: new Date('2025-04-20'),
  },
  {
    _id: '5',
    name: 'Chair Event',
    imageUrl:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/chair.webp',
    pageLink: '/chairs',
    active: true,
    category: 'E',
    createdAt: new Date('2025-04-25'),
  },
  {
    _id: '6',
    name: 'Tools Special',
    imageUrl:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/tools.webp',
    pageLink: '/tools',
    active: false,
    category: 'A',
    createdAt: new Date('2025-04-28'),
  },
  {
    _id: '7',
    name: 'Kids Collection',
    imageUrl:
      'https://isomorphic-furyroad.s3.amazonaws.com/public/categories/kids.webp',
    pageLink: '/kids',
    active: true,
    category: 'B',
    createdAt: new Date('2025-05-01'),
  },
];
