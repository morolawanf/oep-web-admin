'use client';
import { useState } from 'react';
import { Button, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler } from 'react-hook-form';
import { salesData } from '@/data/sales-data';
import {
  CreateSalesInput,
  createSalesSchema,
} from '@/validators/create-sale.schema';
import SaleInfoForm from './components/SaleInfoForm';
import SaleTypeSpecificFields from './components/SaleTypeSpecificFields';
import SaleVariantsForm from './components/SaleVariantsForm';

// Define ProductType based on salesData structure if not already available globally
// This is a simplified version, adjust according to your actual data structure
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
  // Add other fields from sale.product like coverImage if they are different from 'image'
  coverImage?: string;
}

const initialDefaultValues: CreateSalesInput = {
  title: '',
  type: 'Normal',
  product: '',
  campaign: '',
  limit: 0,
  deleted: false,
  startDate: new Date(), // Ensure this is a Date object
  endDate: new Date(), // Ensure this is a Date object
  variants: [
    {
      attributeName: 'All',
      attributeValue: 'All',
      discount: 10,
      maxBuys: 0,
      boughtCount: 0,
    },
  ],
};

export default function CreateSales() {
  const [isLoading, setLoading] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(salesData);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  const onSubmit: SubmitHandler<CreateSalesInput> = (data) => {
    setLoading(true);
    console.log('Submitting Sale Data:', data);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Sale created successfully! (Check console for data)');
      // Potentially reset form or redirect user
    }, 2000);
  };

  const handleSearch = (query: string) => {
    setFilteredProducts(
      salesData.filter((sale) =>
        sale.product.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const description =
    'Fill in the details below to create a new sale. Set the title, type, product, campaign, and variants.';

  return (
    <Form<CreateSalesInput>
      onSubmit={onSubmit}
      validationSchema={createSalesSchema}
      useFormProps={{
        mode: 'onChange',
        defaultValues: initialDefaultValues,
      }}
      className="isomorphic-form flex max-w-3xl flex-col justify-start gap-3 rounded-lg bg-white p-0.5"
    >
      {({
        register,
        control,
        setValue,
        reset,
        watch,
        formState: { errors },
        handleSubmit,
      }) => {
        return (
          <>
            <Text className="mb-2 text-sm text-gray-500">{description}</Text>

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

            <footer className="mt-6 flex justify-end gap-3 border-t pt-6">
              <Button
                type="button" // Or reset type if you implement form reset
                variant="outline"
                className="w-full @xl:w-auto"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 @xl:w-auto"
                onClick={handleSubmit(onSubmit)} // Ensure RHF's handleSubmit is used
              >
                Create Sale
              </Button>
            </footer>
          </>
        );
      }}
    </Form>
  );
}
