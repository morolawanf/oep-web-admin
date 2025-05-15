'use client';
import { useState, useEffect } from 'react'; // Ensured React imports
import { Button, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { salesData } from '@/data/sales-data';
import {
  CreateSalesInput,
  createSalesSchema,
} from '@/validators/create-sale.schema';
import SaleInfoForm from './components/SaleInfoForm';
import SaleTypeSpecificFields from './components/SaleTypeSpecificFields';
import SaleVariantsForm from './components/SaleVariantsForm';

// Define ProductType based on salesData structure
interface ProductType {
  _id: string;
  name: string;
  image: string;
  stock: number;
  slug: string;
  category: {
    _id: string;
    name: string;
  };
  subCategories: {
    _id: string;
    name: string;
  };
  attributes: {
    name: string;
    children: {
      name: string;
      price: number;
      discount: number;
      stock: number;
      image: string;
    }[];
  }[];
  coverImage?: string;
}

// This should align with CreateSalesInput but might include _id, createdAt, etc.
interface SaleDataType extends CreateSalesInput {
  _id: string;
  // Add any other fields that your backend returns for a sale
}

interface EditSalesProps {
  saleId: string; // ID of the sale to edit
}

// Placeholder: Simulate fetching a sale by ID
const fetchSaleById = async (id: string): Promise<SaleDataType | null> => {
  console.log(`Fetching sale with ID: ${id}`);
  // In a real app, this would be an API call to your backend
  // For demonstration, using a mock. Replace with actual API call.
  // This mock assumes salesData might contain product info, but not full sale objects.
  // You'll need to fetch the actual sale object by its ID.
  const mockSaleProductDetails = salesData.find(
    (p) => p.product._id === '664fdf8a24fbb2a2c03eabe0'
  ); // Example product ID from salesData

  if (id === 'sale_to_edit_123' && mockSaleProductDetails) {
    // Example sale ID
    return {
      _id: id,
      title: 'Summer Discount Bonanza',
      type: 'Limited',
      product: mockSaleProductDetails.product._id, // Product ID string
      campaign: '', // campaign ID string or undefined
      limit: 50, // For 'Limited', this should match sum of maxBuys
      deleted: false,
      startDate: new Date(new Date().setDate(new Date().getDate() - 5)), // Example: 5 days ago
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)), // Example: 10 days from now
      variants: [
        {
          attributeName: 'Color',
          attributeValue: 'Black', // must match existing product attribute values
          discount: 15,
          maxBuys: 30,
          boughtCount: 5,
        },
        {
          attributeName: 'Color',
          attributeValue: 'White', // must match existing product attribute values
          discount: 10,
          maxBuys: 20,
          boughtCount: 2,
        },
      ],
      isActive: true,
      // createdBy and updatedBy would typically come from the backend
    };
  }
  // Fallback mock for a different sale type if needed for testing
  const mockNormalSaleProduct = salesData.find(
    (p) => p.product._id === '664fdf8a24fbb2a2c03eabe2'
  );
  if (id === 'sale_to_edit_456' && mockNormalSaleProduct) {
    return {
      _id: id,
      title: 'Regular Product Sale',
      type: 'Normal',
      product: mockNormalSaleProduct.product._id,
      campaign: undefined,
      limit: 0, // Not strictly enforced for Normal, but schema might require it
      deleted: false,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      variants: [
        {
          attributeName: 'All',
          attributeValue: 'All',
          discount: 5,
          maxBuys: 0, // Not applicable for Normal type in terms of total limit sync
          boughtCount: 10,
        },
      ],
      isActive: true,
    };
  }

  console.warn(
    `Mock sale data not found for ID: ${id}. You need to implement a real fetch or expand mock.`
  );
  return null;
};

export default function EditSales({ saleId }: EditSalesProps) {
  const [isLoading, setLoading] = useState(true); // Start with loading true
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(salesData); // Full product list for selector
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [initialSaleData, setInitialSaleData] = useState<SaleDataType | null>(
    null
  );

  const methods = useForm<CreateSalesInput>({
    mode: 'onChange',
    resolver: async (data, context, options) => {
      // console.log('Validating form data:', data);
      const result = await createSalesSchema.safeParseAsync(data);
      console.log(result);

      // console.log('Validation result:', result);
      return result as any; // Casting for now, ensure proper resolver typing
    },
  });

  useEffect(() => {
    if (saleId) {
      setLoading(true);
      fetchSaleById(saleId)
        .then((data) => {
          if (data) {
            setInitialSaleData(data); // Store the originally fetched data for reset
            // Find the full product object from salesData (or your product list source)
            const productDetails = salesData.find(
              (p) => p.product._id === data.product
            )?.product as ProductType | undefined;

            setSelectedProduct(productDetails || null);

            // Format data for the form, especially dates and numeric types
            const formData: CreateSalesInput = {
              ...data,
              startDate: data.startDate ? new Date(data.startDate) : new Date(),
              endDate: data.endDate ? new Date(data.endDate) : new Date(),
              limit: Number(data.limit) || 0,
              variants: data.variants.map((v) => ({
                ...v,
                discount: Number(v.discount) || 0,
                maxBuys: Number(v.maxBuys) || 0,
                boughtCount: Number(v.boughtCount) || 0,
              })),
            };
            methods.reset(formData); // Populate the form with fetched data
          } else {
            console.error(`Sale with ID ${saleId} not found.`);
            // Handle sale not found (e.g., show a message or redirect)
          }
        })
        .catch((error) => {
          console.error('Error fetching sale data:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [saleId, methods.reset]); // methods.reset is stable, saleId is the key dependency

  const onSubmit: SubmitHandler<CreateSalesInput> = async (data) => {
    setIsSubmitting(true);
    console.log('Updating Sale Data:', data);
    // Simulate API call for update
    try {
      // const response = await yourActualUpdateApiCall(saleId, data);
      // console.log('Update successful', response);
      alert('Sale updated successfully! (Check console for data)');
      // Optionally, re-fetch data or update initialSaleData
      // setInitialSaleData({ ...initialSaleData, ...data, _id: saleId });
    } catch (error) {
      console.error('Failed to update sale:', error);
      alert('Failed to update sale. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (query: string) => {
    setFilteredProducts(
      salesData.filter((item) =>
        item.product.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const description =
    'Modify the details below to update the sale. Adjust the title, type, product, campaign, and variants as needed.';

  if (isLoading) {
    return (
      <div className="p-6">
        <Text className="text-center">Loading sale data...</Text>
      </div>
    );
  }

  if (!initialSaleData && !isLoading) {
    return (
      <div className="p-6">
        <Text className="text-center text-red-500">
          Sale not found or failed to load.
        </Text>
      </div>
    );
  }

  return (
    <Form<CreateSalesInput>
      onSubmit={onSubmit} // Pass the submit handler to RHF Form component
      useFormProps={{
        ...methods,
        mode: methods.formState.isSubmitted ? 'onSubmit' : 'onChange', // Example mapping
        defaultValues: methods.getValues(), // Map default values
      }} // Pass mapped RHF methods
      className="isomorphic-form flex max-w-3xl flex-col justify-start gap-3 rounded-lg bg-white"
    >
      {({
        register,
        control,
        setValue,
        watch,
        formState: { errors, isDirty },
      }) => {
        return (
          <>
            <Text className="mb-6 text-sm text-gray-500">{description}</Text>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <SaleInfoForm
                  control={control}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  isDrawerOpen={isDrawerOpen}
                  setDrawerOpen={setDrawerOpen}
                  filteredProducts={filteredProducts}
                  handleSearch={handleSearch}
                  isEditMode={true}
                />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SaleTypeSpecificFields
                control={control}
                errors={errors}
                watch={watch}
                register={register}
              />
            </section>

            <section>
              <SaleVariantsForm
                control={control}
                errors={errors}
                watch={watch}
                register={register}
                setValue={setValue}
                selectedProduct={selectedProduct}
              />
            </section>

            <footer className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <Button
                type="submit"
                disabled={!isDirty}
                isLoading={isSubmitting}
                className={`w-full text-white @xl:w-auto ${
                  !isDirty
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                Update Sale
              </Button>
            </footer>
          </>
        );
      }}
    </Form>
  );
}
