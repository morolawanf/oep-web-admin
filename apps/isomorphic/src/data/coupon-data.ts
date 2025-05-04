export type CouponDataType = {
  coupon: string;
  startDate: Date;
  endDate: Date;
  discount: number;
  active: boolean;
  timesUsed: number;
  couponType: 'one-off' | 'one-off-user' | 'normal';
  creator: string;
  deleted: boolean;
  createdAt: Date;
  _id: string;
};

export const couponData: CouponDataType[] = [
  {
    coupon: 'SAVE10',
    startDate: new Date('2025-05-01T00:00:00.000Z'),
    endDate: new Date('2025-05-31T00:00:00.000Z'),
    discount: 10,
    active: true,
    timesUsed: 5,
    couponType: 'normal',
    creator: 'userObjectId1',
    deleted: true,
    createdAt: new Date('2025-05-01T00:00:00.000Z'),
    _id: 'couponObjectId1',
  },
  {
    coupon: 'WELCOME20',
    startDate: new Date('2025-05-01T00:00:00.000Z'),
    endDate: new Date('2025-06-01T00:00:00.000Z'),
    discount: 20,
    active: true,
    timesUsed: 0,
    couponType: 'one-off',
    creator: 'userObjectId2',
    deleted: false,
    createdAt: new Date('2025-05-01T00:00:00.000Z'),
    _id: 'couponObjectId2',
  },
];
