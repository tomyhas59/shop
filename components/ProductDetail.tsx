/* eslint-disable @next/next/no-img-element */
import { Product } from "@/graphql/products";

const ProductDetail = ({
  createAt,
  description,
  imageUrl,
  price,
  title,
  id,
}: Product) => {
  return (
    <div className="productDetail">
      <p className="createAt">{createAt}</p>
      <p className="title">{title}</p>
      <img className="image" src={imageUrl} alt={title} />
      <p className="description">{description}</p>
      <span className="price">{price}달러</span>
    </div>
  );
};

export default ProductDetail;
