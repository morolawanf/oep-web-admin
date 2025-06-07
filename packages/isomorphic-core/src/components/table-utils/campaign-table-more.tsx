"use client";

import PencilIcon from "@core/components/icons/pencil";
import TrashIcon from "@core/components/icons/trash";
import EyeIcon from "@core/components/icons/eye";
import Link from "next/link";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { ActionIcon, Button, Popover } from "rizzui";
import { routes } from "../../config/routes";

export function CampaignTableMoreAction({ id, onDelete, disabled = false }: { id: string; disabled?: boolean; onDelete?: () => void }) {
  return (
    <Popover placement="left">
      <Popover.Trigger>
        <ActionIcon variant="text">
          <PiDotsThreeVerticalBold className="h-6 w-6 text-gray-500 hover:text-gray-1000" />
        </ActionIcon>
      </Popover.Trigger>
      <Popover.Content className="min-w-[140px] px-0">
        <div className="text-gray-700">
          <Link href={routes.eCommerce.CampaignDetails(id)}>
            <Button variant="text" className="flex w-full items-center justify-start px-4 py-2.5 focus:outline-none">
              <EyeIcon className="me-2 h-[18px] w-[18px] text-gray-500" />
              View
            </Button>
          </Link>
          {disabled ? null : (
            <Link href={routes.eCommerce.editCampaign(id)}>
              <Button variant="text" className="flex w-full items-center justify-start px-4 py-2.5 focus:outline-none">
                <PencilIcon className="me-2 h-[18px] w-[18px] text-gray-500" />
                Edit
              </Button>
            </Link>
          )}
          <Button
            disabled={disabled}
            variant="text"
            className="flex w-full items-center justify-start px-4 py-2.5 focus:outline-none"
            onClick={() => {
              if (!disabled && onDelete) onDelete();
            }}>
            <TrashIcon className="me-2 h-[18px] w-[18px] text-gray-500" />
            Delete
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
