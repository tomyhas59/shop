import { GetServerSideProps } from "next";
import ProductDetail from "@/components/products/ProductDetail";
import { GET_PRODUCT, Product } from "@/graphql/products";
import { graphqlFetcher } from "@/queryClient";

interface Props {
  product: Product;
}

const ProductDetailPage = ({ product }: Props) => {
  return (
    <div className="product-detail-page">
      <ProductDetail {...product} />
    </div>
  );
};

export default ProductDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const data = await graphqlFetcher<{ product: Product }>(GET_PRODUCT, {
      id,
    });

    if (!data.product) {
      return { notFound: true };
    }

    return {
      props: {
        product: data.product,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
