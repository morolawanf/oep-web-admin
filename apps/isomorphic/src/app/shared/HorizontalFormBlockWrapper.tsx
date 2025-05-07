import cn from '@core/utils/class-names';
import React from 'react';
import { Text, Title } from 'rizzui';

const HorizontalFormBlockWrapper = ({
  title,
  description,
  children,
  className,
  subClassName,
  isModalView = true,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
  subClassName?: string;
  isModalView?: boolean;
}>) => {
  return (
    <div
      className={cn(
        className,
        isModalView ? '@5xl:grid @5xl:grid-cols-6' : ' '
      )}
    >
      {isModalView && (
        <div className="col-span-2 mb-6 pe-4 @5xl:mb-0">
          <Title as="h6" className="font-semibold">
            {title}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{description}</Text>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5',
          isModalView ? 'col-span-4' : ' ',
          subClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalFormBlockWrapper;
