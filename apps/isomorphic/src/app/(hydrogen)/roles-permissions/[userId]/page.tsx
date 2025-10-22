import UserDetailClient from './user-detail-client';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;
  return <UserDetailClient userId={userId} />;
}
