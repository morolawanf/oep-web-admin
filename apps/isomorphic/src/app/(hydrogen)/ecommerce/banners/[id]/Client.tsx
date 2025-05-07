import Link from 'next/link';
import { PiCheckCircleFill, PiXCircleFill } from 'react-icons/pi';

type BannerDetailsProps = {
  _id: string;
  name: string;
  imageUrl: string;
  pageLink: string;
  active: boolean;
  category: string;
  createdAt: Date;
};

const BannerDetails = ({ banner }: { banner: BannerDetailsProps }) => {
  return (
    <div className="mt-8 flex flex-col gap-8 @md:flex-row @md:items-start">
      {/* Image */}
      <div className="aspect-video w-full max-w-[800px] flex-shrink-0">
        <img
          src={banner.imageUrl}
          alt={banner.name}
          className="h-full w-auto max-w-[800px] rounded-lg border bg-gray-50 object-cover"
        />
      </div>
      {/* Info */}
      <div className="grid flex-1 gap-4">
        <div>
          <h2 className="text-2xl font-bold">{banner.name}</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-md inline-flex items-center gap-1 rounded bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
              Category: <span className="font-semibold">{banner.category}</span>
            </span>
            <span className="text-md inline-flex items-center gap-1 rounded bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
              Status:{' '}
              {banner.active ? (
                <span className="flex items-center gap-1 text-green-600">
                  <PiCheckCircleFill /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500">
                  <PiXCircleFill /> Inactive
                </span>
              )}
            </span>
          </div>
        </div>
        <div>
          <div className="text-md font-bold text-gray-500">Page Link:</div>
          <a
            href={banner.pageLink}
            className="break-all text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {banner.pageLink}
          </a>
        </div>
        <div className="flex flex-col gap-1 text-gray-400">
          <div className="text-md font-bold text-gray-500">Created:</div>
          <span>
            {banner.createdAt.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-gray-400">
          <div className="text-md font-bold text-gray-500">ID</div>
          <span>{banner._id}</span>
        </div>
      </div>
    </div>
  );
};
export default BannerDetails;
