'use client';

import { Fragment, useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ActionIcon,
  Empty,
  SearchNotFoundIcon,
  Button,
  Title,
  Input,
  cn,
  Loader,
} from 'rizzui';
import {
  PiMagnifyingGlassBold,
  PiXBold,
} from 'react-icons/pi';
import { menuItems } from '@/layouts/hydrogen/menu-items';
import { usePermissions } from '@/hooks/queries/usePermissions';

export default function SearchList({ onClose }: { onClose?: () => void }) {
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const { hasPermission, isLoading } = usePermissions();

  // Filter menu items based on permissions and flatten dropdown items
  const accessibleMenuItems = useMemo(() => {
    if (isLoading) return [];

    const flattenedItems: any[] = [];

    menuItems.forEach((item) => {
      // Check permissions for the item
      let hasAccess = true;
      if (item.permission) {
        if (item.permission.resource.length === 0) {
          hasAccess = true; // Wildcard permissions
        } else {
          hasAccess = hasPermission(item.permission.resource, item.permission.action);
        }
      }

      if (!hasAccess) return;

      // If item has href '#', skip it but include its dropdown items
      if (item.href === '#' && item.dropdownItems) {
        // Add all dropdown items directly with parent prefix
        item.dropdownItems.forEach((dropdownItem) => {
          flattenedItems.push({
            ...dropdownItem,
            name: `${item.name} - ${dropdownItem.name}`, // Prefix with parent name
            icon: item.icon, // Use parent icon for dropdown items
            permission: item.permission, // Inherit parent permission
          });
        });
      } else if (item.href && item.href !== '#') {
        // Add the item itself if it has a valid href
        flattenedItems.push(item);
        
        // Also add dropdown items if they exist
        if (item.dropdownItems) {
          item.dropdownItems.forEach((dropdownItem) => {
            flattenedItems.push({
              ...dropdownItem,
              name: `${item.name} - ${dropdownItem.name}`, // Prefix with parent name
              icon: item.icon, // Use parent icon
              permission: item.permission, // Inherit parent permission
            });
          });
        }
      } else if (!item.href) {
        // Section labels (no href at all)
        flattenedItems.push(item);
      }
    });

    return flattenedItems;
  }, [isLoading, hasPermission]);

  // Filter accessible menu items by search text
  const menuItemsFiltered = useMemo(() => {
    if (searchText.length === 0) return accessibleMenuItems;

    return accessibleMenuItems.filter((item) => {
      const label = item.name.toLowerCase();
      const search = searchText.toLowerCase();
      return label.includes(search);
    });
  }, [accessibleMenuItems, searchText]);

  useEffect(() => {
    if (inputRef?.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
    return () => {
      inputRef.current = null;
    };
  }, []);

  return (
    <>
      <div className="flex items-center px-5 py-4">
        <Input
          variant="flat"
          value={searchText}
          ref={inputRef}
          onChange={(e) => setSearchText(() => e.target.value)}
          placeholder="Search pages here"
          className="flex-1"
          prefix={
            <PiMagnifyingGlassBold className="h-[18px] w-[18px] text-gray-600" />
          }
          suffix={
            searchText && (
              <Button
                size="sm"
                variant="text"
                className="h-auto w-auto px-0"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchText(() => '');
                }}
              >
                Clear
              </Button>
            )
          }
        />
        <ActionIcon
          variant="text"
          size="sm"
          className="ms-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <PiXBold className="h-5 w-5" />
        </ActionIcon>
      </div>

      <div className="custom-scrollbar max-h-[60vh] overflow-y-auto border-t border-gray-300 px-2 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader variant="spinner" size="lg" />
          </div>
        ) : (
          <>
            {menuItemsFiltered.length === 0 ? (
              <Empty
                className="scale-75"
                image={<SearchNotFoundIcon />}
                text="No Result Found"
                textClassName="text-xl"
              />
            ) : null}

            {menuItemsFiltered.map((item, index) => {
              return (
                <Fragment key={item.name + '-' + index}>
                  {item?.href ? (
                    <Link
                      href={item?.href as string}
                      onClick={onClose}
                      className="relative my-0.5 flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus-visible:bg-gray-100 dark:hover:bg-gray-50/50 dark:hover:backdrop-blur-lg"
                    >
                      <span className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-500">
                        {item.icon}
                      </span>

                      <span className="ms-3 grid gap-0.5">
                        <span className="font-medium capitalize text-gray-900 dark:text-gray-700">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item?.href as string}
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <Title
                      as="h6"
                      className={cn(
                        'mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500',
                        index !== 0 && 'mt-6 4xl:mt-7'
                      )}
                    >
                      {item.name}
                    </Title>
                  )}
                </Fragment>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
