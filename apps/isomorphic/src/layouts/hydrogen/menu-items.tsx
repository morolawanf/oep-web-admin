import { DUMMY_ID } from '@/config/constants';
import { routes } from '@/config/routes';
import {
  PiAirplaneTiltDuotone,
  PiApplePodcastsLogoDuotone,
  PiArrowsOutDuotone,
  PiArrowsOutLineHorizontalDuotone,
  PiBellSimpleRingingDuotone,
  PiBinocularsDuotone,
  PiBriefcaseDuotone,
  PiBrowserDuotone,
  PiCalendarDuotone,
  PiCalendarPlusDuotone,
  PiCaretCircleUpDownDuotone,
  PiChartBarDuotone,
  PiChartLineUpDuotone,
  PiChartPieSliceDuotone,
  PiChatCenteredDotsDuotone,
  PiClipboardTextDuotone,
  PiCodesandboxLogoDuotone,
  PiCoinDuotone,
  PiCreditCardDuotone,
  PiCurrencyCircleDollarDuotone,
  PiCurrencyDollarDuotone,
  PiEnvelopeDuotone,
  PiEnvelopeSimpleOpenDuotone,
  PiFeatherDuotone,
  PiFlagBanner,
  PiFolderDuotone,
  PiFolderLockDuotone,
  PiFoldersDuotone,
  PiFolderUserDuotone,
  PiGridFourDuotone,
  PiHammerDuotone,
  PiHeadsetDuotone,
  PiHourglassSimpleDuotone,
  PiHouseLineDuotone,
  PiListNumbersDuotone,
  PiLockKeyDuotone,
  PiMapPinLineDuotone,
  PiNewspaperClippingDuotone,
  PiNoteBlankDuotone,
  PiPackageDuotone,
  PiPresentationChartDuotone,
  PiPushPinDuotone,
  PiRocketLaunchDuotone,
  PiScalesDuotone,
  PiShapesDuotone,
  PiShieldCheckDuotone,
  PiShootingStarDuotone,
  PiShoppingCartDuotone,
  PiSparkleDuotone,
  PiSquaresFourDuotone,
  PiStairsDuotone,
  PiStepsDuotone,
  PiTableDuotone,
  PiUserCircleDuotone,
  PiUserDuotone,
  PiUserGearDuotone,
  PiUserPlusDuotone,
} from 'react-icons/pi';
import { GoHome, GoPeople } from 'react-icons/go';
import { MdOutlineCampaign, MdOutlineSell } from 'react-icons/md';
import { IoReturnDownBack } from 'react-icons/io5';
// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // label start
  {
    name: 'Overview',
  },
  {
    name: 'Home',
    href: '/',
    icon: <GoHome />,
  },
  {
    name: 'Products',
    href: routes.eCommerce.products,
    icon: <PiPackageDuotone />,
  },
  {
    name: 'Categories',
    href: routes.eCommerce.categories,
    icon: <PiSquaresFourDuotone />,
  },
  {
    name: 'Orders',
    href: routes.eCommerce.orders,
    icon: <PiShoppingCartDuotone />,
  },
  {
    name: 'Returns',
    href: routes.eCommerce.returns,
    icon: <IoReturnDownBack />,
  },
  {
    name: 'Reviews',
    href: routes.eCommerce.reviews,
    icon: <GoPeople />,
  },
  {
    name: 'Invoice',
    href: '#',
    icon: <PiCurrencyDollarDuotone />,
    dropdownItems: [
      {
        name: 'Builder',
        href: routes.invoice.builder,
      },
      {
        name: 'List',
        href: routes.invoice.home,
      },
      {
        name: 'Details',
        href: routes.invoice.details(DUMMY_ID),
      },
      {
        name: 'Create',
        href: routes.invoice.create,
      },
      {
        name: 'Edit',
        href: routes.invoice.edit(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Coupons',
    href: routes.eCommerce.coupons,
    icon: <PiNewspaperClippingDuotone />,
  },
  {
    name: 'Banner',
    href: routes.eCommerce.banners,
    icon: <PiFlagBanner />,
  },
  {
    name: 'Sale',
    href: routes.eCommerce.flashSales,
    icon: <MdOutlineSell />,
  },
  {
    name: 'Campaign',
    href: routes.eCommerce.campaign,
    icon: <MdOutlineCampaign />,
  },
  {
    name: 'Gallery',
    href: routes.file.manager,
    icon: <PiFoldersDuotone />,
  },
  {
    name: 'Account Settings',
    href: routes.forms.profileSettings,
    icon: <PiUserGearDuotone />,
  },
  {
    name: 'Roles & Permissions',
    href: routes.rolesPermissions,
    icon: <PiFolderLockDuotone />,
  },
  {
    name: 'Logistics',
    href: '#',
    icon: <PiPackageDuotone />,
    dropdownItems: [
      {
        name: 'Shipment List',
        href: routes.logistics.shipmentList,
      },
      {
        name: 'Shipment Details',
        href: routes.logistics.shipmentDetails(DUMMY_ID),
      },
      {
        name: 'Create Shipment',
        href: routes.logistics.createShipment,
      },
      {
        name: 'Edit Shipment',
        href: routes.logistics.editShipment(DUMMY_ID),
      },
      {
        name: 'Customer Profile',
        href: routes.logistics.customerProfile,
      },
      {
        name: 'Tracking',
        href: routes.logistics.tracking(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Store Settings',
    href: routes.jobBoard.dashboard,
    icon: <PiShapesDuotone />,
  },
];
