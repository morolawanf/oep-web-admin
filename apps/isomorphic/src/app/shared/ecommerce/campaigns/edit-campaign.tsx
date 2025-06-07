'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Switch,
  Text,
  Title,
  Textarea,
  Drawer,
  Badge,
  ActionIcon,
} from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler, Controller } from 'react-hook-form';
import {
  CampaignDataType,
  CampaignChildProduct,
  CampaignChildSale,
} from '@/data/campaigns-data';
import {
  PiCheckBold,
  PiXBold,
  PiImageBold,
  PiPlusBold,
  PiTrashBold,
  PiMagnifyingGlassBold,
} from 'react-icons/pi';
import Image from 'next/image';
import UploadZone from '@core/ui/file-upload/upload-zone';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { createColumnHelper } from '@tanstack/react-table';

// Mock data for products and sales selection
const availableProducts = [
  {
    _id: '1',
    name: 'Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    price: 199.99,
  },
  {
    _id: '2',
    name: 'Smart Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    price: 299.99,
  },
  {
    _id: '3',
    name: 'Laptop Stand',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200',
    price: 89.99,
  },
];

const availableSales = [
  {
    _id: '1',
    title: 'Flash Sale 50% Off',
    type: 'Flash' as const,
    discount: 50,
    product: availableProducts[0],
    startDate: '2025-02-01T00:00:00.000Z',
    endDate: '2025-02-07T23:59:59.000Z',
  },
  {
    _id: '2',
    title: 'Limited Weekend Deal',
    type: 'Limited' as const,
    discount: 30,
    product: availableProducts[1],
    startDate: '2025-02-08T00:00:00.000Z',
    endDate: '2025-02-09T23:59:59.000Z',
  },
];

// Column definitions for products table
const productColumnHelper = createColumnHelper<CampaignChildProduct>();
const productColumns = [
  productColumnHelper.display({
    id: 'product',
    header: 'Product',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded">
          <Image
            src={row.original.image}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
        <Text className="font-medium">{row.original.name}</Text>
      </div>
    ),
  }),
  productColumnHelper.accessor('price', {
    header: 'Price',
    cell: ({ getValue }) => <Text className="font-medium">${getValue()}</Text>,
  }),
  productColumnHelper.display({
    id: 'action',
    header: 'Action',
    size: 80,
    cell: ({ row, table }) => (
      <ActionIcon
        size="sm"
        variant="flat"
        color="danger"
        onClick={() => {
          const meta = table.options.meta as any;
          meta?.removeProduct?.(row.original._id);
        }}
      >
        <PiTrashBold className="h-4 w-4" />
      </ActionIcon>
    ),
  }),
];

// Column definitions for sales table
const saleColumnHelper = createColumnHelper<CampaignChildSale>();
const saleColumns = [
  saleColumnHelper.display({
    id: 'sale',
    header: 'Sale',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded">
          <Image
            src={row.original.product.image}
            alt={row.original.title}
            fill
            className="object-cover"
          />
        </div>
        <Text className="font-medium">{row.original.title}</Text>
      </div>
    ),
  }),
  saleColumnHelper.accessor('discount', {
    header: 'Discount',
    cell: ({ getValue }) => <Text className="font-medium">{getValue()}%</Text>,
  }),
  saleColumnHelper.accessor('type', {
    header: 'Type',
    cell: ({ getValue }) => (
      <Badge
        variant="flat"
        color={
          getValue() === 'Flash'
            ? 'danger'
            : getValue() === 'Limited'
              ? 'warning'
              : 'secondary'
        }
      >
        {getValue()}
      </Badge>
    ),
  }),
  saleColumnHelper.display({
    id: 'action',
    header: 'Action',
    size: 80,
    cell: ({ row, table }) => (
      <ActionIcon
        size="sm"
        variant="flat"
        color="danger"
        onClick={() => {
          const meta = table.options.meta as any;
          meta?.removeSale?.(row.original._id);
        }}
      >
        <PiTrashBold className="h-4 w-4" />
      </ActionIcon>
    ),
  }),
];

type EditCampaignFormData = Omit<
  CampaignDataType,
  '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;

interface EditCampaignProps {
  campaign?: CampaignDataType;
  onSubmit?: (data: any) => void;
}

export default function EditCampaign({
  campaign,
  onSubmit,
}: EditCampaignProps) {
  const [isLoading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    CampaignChildProduct[]
  >([]);
  const [selectedSales, setSelectedSales] = useState<CampaignChildSale[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const [isSalesDrawerOpen, setIsSalesDrawerOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [salesSearchQuery, setSalesSearchQuery] = useState('');
  // Table configurations
  const productsTable = useTanStackTable<CampaignChildProduct>({
    tableData: selectedProducts,
    columnConfig: productColumns,
    options: {
      meta: {
        removeProduct: (productId: string) => removeProduct(productId),
      } as any,
      enableSorting: false,
      enableColumnResizing: false,
    },
  });

  const salesTable = useTanStackTable<CampaignChildSale>({
    tableData: selectedSales,
    columnConfig: saleColumns,
    options: {
      meta: {
        removeSale: (saleId: string) => removeSale(saleId),
      } as any,
      enableSorting: false,
      enableColumnResizing: false,
    },
  });
  // Initialize state when campaign data is available
  useEffect(() => {
    if (campaign) {
      setSelectedProducts(campaign.children?.products || []);
      setSelectedSales(campaign.children?.sales || []);
      setUploadedImage(campaign.image || '');
    }
  }, [campaign]);

  // Sync table data when state changes
  useEffect(() => {
    if (productsTable?.setData) {
      productsTable.setData(selectedProducts);
    }
  }, [selectedProducts, productsTable?.setData]);

  useEffect(() => {
    if (salesTable?.setData) {
      salesTable.setData(selectedSales);
    }
  }, [selectedSales, salesTable?.setData]);

  const handleFormSubmit = (data: EditCampaignFormData) => {
    setLoading(true);
    const updatedCampaign = {
      ...data,
      _id: campaign?._id || Date.now().toString(),
      children: {
        products: selectedProducts,
        sales: selectedSales,
      },
      image:
        uploadedImage ||
        data.image ||
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      updatedAt: new Date().toISOString(),
      updatedBy: 'current-user-id',
      // Keep existing metadata if editing
      createdAt: campaign?.createdAt || new Date().toISOString(),
      createdBy: campaign?.createdBy || 'current-user-id',
    };

    setTimeout(() => {
      setLoading(false);
      console.log('updateCampaign data ->', updatedCampaign);
      if (onSubmit) {
        onSubmit(updatedCampaign);
      }
    }, 600);
  }; // Helper functions for managing products and sales
  const addProduct = (product: CampaignChildProduct) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts((prev) => [...prev, product]);
    }
    setIsProductDrawerOpen(false);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const addSale = (sale: CampaignChildSale) => {
    if (!selectedSales.find((s) => s._id === sale._id)) {
      setSelectedSales((prev) => [...prev, sale]);
    }
    setIsSalesDrawerOpen(false);
  };

  const removeSale = (saleId: string) => {
    setSelectedSales((prev) => prev.filter((s) => s._id !== saleId));
  };

  // Filter functions for search
  const filteredProducts = availableProducts.filter(
    (product) =>
      product._id.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  const filteredSales = availableSales.filter(
    (sale) =>
      sale._id.toLowerCase().includes(salesSearchQuery.toLowerCase()) ||
      sale.title.toLowerCase().includes(salesSearchQuery.toLowerCase())
  );
  const description = campaign
    ? 'Update your marketing campaign details, products, and sales.'
    : 'Create a new marketing campaign with products and sales.';

  // For edit mode, don't render until we have campaign data
  if (campaign === undefined) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Text className="text-gray-500">Loading campaign data...</Text>
      </div>
    );
  }
  return (
    <>
      <Form<EditCampaignFormData>
        key={campaign ? campaign._id : 'create'} // Force re-render when campaign changes
        onSubmit={handleFormSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: campaign
            ? {
                title: campaign.title,
                description: campaign.description,
                image: campaign.image,
                isActive: campaign.isActive,
                deleted: campaign.deleted,
                children: {
                  products: campaign.children?.products || [],
                  sales: campaign.children?.sales || [],
                },
              }
            : {
                title: '',
                description: '',
                image: '',
                isActive: true,
                deleted: false,
                children: {
                  products: [],
                  sales: [],
                },
              },
        }}
        className="isomorphic-form flex max-w-[800px] flex-col gap-6"
      >
        {({
          register,
          control,
          setValue,
          getValues,
          watch,
          formState: { errors },
        }) => {
          const watchedImage = watch('image');

          // Only update uploadedImage if it's different and from the form
          useEffect(() => {
            if (
              watchedImage &&
              watchedImage !== uploadedImage &&
              !uploadedImage
            ) {
              setUploadedImage(watchedImage);
            }
          }, [watchedImage, uploadedImage]);

          return (
            <>
              <div className="col-span-2 mb-1 pe-4 @5xl:mb-0">
                <Text className="mt-1 text-sm text-gray-500">
                  {description}
                </Text>
              </div>

              <div className="flex flex-col gap-6">
                {/* Campaign Image Upload */}
                <div>
                  <label className="mb-3 block font-medium text-gray-900">
                    Campaign Image
                  </label>
                  {uploadedImage ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        src={uploadedImage}
                        alt="Campaign"
                        fill
                        className="object-cover"
                      />
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="absolute right-2 top-2"
                        onClick={() => {
                          setUploadedImage('');
                          setValue('image', '');
                        }}
                      >
                        <PiXBold className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadZone
                      name="image"
                      getValues={getValues}
                      setValue={setValue}
                      className="h-48"
                    />
                  )}
                </div>
                {/* Basic Information */}
                <div className="grid gap-4 @lg:grid-cols-2">
                  <Input
                    label="Campaign Title"
                    placeholder="Valentine's Day Sale"
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message}
                    className="col-span-2"
                  />
                  <Textarea
                    label="Campaign Description"
                    placeholder="Describe your campaign and what makes it special..."
                    {...register('description', {
                      required: 'Description is required',
                    })}
                    error={errors.description?.message}
                    className="col-span-2"
                    rows={3}
                  />
                </div>
                {/* Campaign Status */}
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <Text className="font-medium text-gray-900">
                          Campaign Status
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {field.value
                            ? 'Campaign is active and visible'
                            : 'Campaign is inactive'}
                        </Text>
                      </div>
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        size="lg"
                      />
                    </div>
                  )}
                />{' '}
                {/* Products Management */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Title as="h4" className="text-base font-semibold">
                      Campaign Products
                    </Title>
                    <Button
                      size="sm"
                      onClick={() => setIsProductDrawerOpen(true)}
                      className="gap-1"
                    >
                      <PiPlusBold className="h-4 w-4" />
                      Add Products
                    </Button>
                  </div>
                  {selectedProducts.length > 0 ? (
                    <Table
                      table={productsTable.table}
                      variant="modern"
                      classNames={{
                        container: 'border border-muted rounded-md',
                        rowClassName: 'last:border-0',
                      }}
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300">
                      <Text className="text-gray-500">
                        No products selected
                      </Text>
                    </div>
                  )}
                </div>
                {/* Sales Management */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <Title as="h4" className="text-base font-semibold">
                      Campaign Sales
                    </Title>
                    <Button
                      size="sm"
                      onClick={() => setIsSalesDrawerOpen(true)}
                      className="gap-1"
                    >
                      <PiPlusBold className="h-4 w-4" />
                      Add Sales
                    </Button>
                  </div>{' '}
                  {selectedSales.length > 0 ? (
                    <Table
                      table={salesTable.table}
                      variant="modern"
                      classNames={{
                        container: 'border border-muted rounded-md',
                        rowClassName: 'last:border-0',
                      }}
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300">
                      <Text className="text-gray-500">No sales selected</Text>
                    </div>
                  )}
                </div>
                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full @xl:w-auto"
                    disabled={
                      selectedProducts.length === 0 &&
                      selectedSales.length === 0
                    }
                  >
                    <PiCheckBold className="me-1.5 h-4 w-4" />
                    {campaign ? 'Update Campaign' : 'Create Campaign'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full @xl:w-auto"
                  >
                    Save as Draft
                  </Button>{' '}
                </div>
              </div>
            </>
          );
        }}
      </Form>{' '}
      {/* Product Selection Drawer */}
      <Drawer
        isOpen={isProductDrawerOpen}
        onClose={() => {
          setIsProductDrawerOpen(false);
          setProductSearchQuery(''); // Clear search when closing
        }}
        size="lg"
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Title as="h3" className="text-lg font-semibold">
              Select Products
            </Title>
            <ActionIcon
              size="sm"
              variant="flat"
              onClick={() => {
                setIsProductDrawerOpen(false);
                setProductSearchQuery(''); // Clear search when closing
              }}
            >
              <PiXBold className="h-4 w-4" />
            </ActionIcon>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="Search products by ID or name..."
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              prefix={
                <PiMagnifyingGlassBold className="h-4 w-4 text-gray-400" />
              }
              clearable
              onClear={() => setProductSearchQuery('')}
            />
          </div>

          <div className="space-y-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isSelected = selectedProducts.find(
                  (p) => p._id === product._id
                );
                return (
                  <div
                    key={product._id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => addProduct(product)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Text className="font-medium">{product.name}</Text>
                        <Text className="text-sm text-gray-500">
                          ${product.price}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          ID: {product._id}
                        </Text>
                      </div>
                      {isSelected && (
                        <Badge color="success" variant="flat">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-32 items-center justify-center text-gray-500">
                <Text>No products found matching your search</Text>
              </div>
            )}
          </div>
        </div>
      </Drawer>{' '}
      {/* Sales Selection Drawer */}
      <Drawer
        isOpen={isSalesDrawerOpen}
        onClose={() => {
          setIsSalesDrawerOpen(false);
          setSalesSearchQuery(''); // Clear search when closing
        }}
        size="lg"
      >
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <Title as="h3" className="text-lg font-semibold">
              Select Sales
            </Title>
            <ActionIcon
              size="sm"
              variant="flat"
              onClick={() => {
                setIsSalesDrawerOpen(false);
                setSalesSearchQuery(''); // Clear search when closing
              }}
            >
              <PiXBold className="h-4 w-4" />
            </ActionIcon>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="Search sales by ID or title..."
              value={salesSearchQuery}
              onChange={(e) => setSalesSearchQuery(e.target.value)}
              prefix={
                <PiMagnifyingGlassBold className="h-4 w-4 text-gray-400" />
              }
              clearable
              onClear={() => setSalesSearchQuery('')}
            />
          </div>

          <div className="space-y-3">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const isSelected = selectedSales.find(
                  (s) => s._id === sale._id
                );
                return (
                  <div
                    key={sale._id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => addSale(sale)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded">
                        <Image
                          src={sale.product.image}
                          alt={sale.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Text className="font-medium">{sale.title}</Text>
                        <Text className="text-sm text-gray-500">
                          {sale.discount}% off • {sale.type}
                        </Text>
                        <Text className="text-xs text-gray-400">
                          ID: {sale._id} • Product: {sale.product.name}
                        </Text>
                      </div>
                      {isSelected && (
                        <Badge color="success" variant="flat">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-32 items-center justify-center text-gray-500">
                <Text>No sales found matching your search</Text>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
