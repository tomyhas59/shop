import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, DELETE_CART, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import pullCartImg from "@/public/pullCart.png";
import emptyCartImg from "@/public/emptyCart.png";
import Image from "next/image";
import { useRouter } from "next/router";

const ProductItem = ({ imageUrl, price, title, id, reviewsCount }: Product) => {
  const { user } = useUser();
  const uid = user?.uid;
  const router = useRouter();

  //카트 담을 때 ui 반영
  const { data, refetch } = useQuery<{ cart: Cart[] }>(
    [QueryKeys.CART, uid],
    () => {
      if (uid) return graphqlFetcher<{ cart: Cart[] }>(GET_CART, { uid });
      return Promise.resolve({ cart: [] });
    },
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);
  const [addedCart, setAddedCart] = useState(isAddedToCart);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { mutate: addCart } = useMutation(
    ({ uid, id }: { uid: string; id: string }) =>
      graphqlFetcher(ADD_CART, { uid, id })
  );

  const { mutate: deleteCart } = useMutation((id: string) =>
    graphqlFetcher(DELETE_CART, { id })
  );

  const findCartIdByProductId = (productId: string) => {
    const cartItem = data?.cart.find((item) => item.product.id === productId);
    return cartItem?.id;
  };

  const handleCartData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) return alert("로그인이 필요합니다");
    if (uid) {
      if (!addedCart) {
        addCart({ uid, id });
      } else {
        const cartId = findCartIdByProductId(id);
        if (cartId) {
          deleteCart(cartId);
        }
      }
      setAddedCart(!addedCart);
    }
  };

  useEffect(() => {
    setAddedCart(isAddedToCart);
  }, [data, isAddedToCart]);

  const formattedPrice = formatPrice(price);

  const goToProductDetail = () => {
    router.push(`/products/${id}`);
  };

  // 3D Tilt(기울기) Effect
  useEffect(() => {
    const boxes = document.querySelectorAll(
      ".product-item"
    ) as NodeListOf<HTMLElement>;

    const handleMouseMove = (e: MouseEvent) => {
      const box = e.currentTarget as HTMLElement;
      const { width, height, left, top } = box.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;

      const rotateX = (mouseY / height - 0.5) * 30;
      const rotateY = (mouseX / width - 0.5) * 30;

      box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const box = e.currentTarget as HTMLElement;
      box.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    boxes.forEach((box) => {
      box.addEventListener("mousemove", handleMouseMove);
      box.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      boxes.forEach((box) => {
        box.removeEventListener("mousemove", handleMouseMove);
        box.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <li className="product-item" onClick={goToProductDetail}>
      <img className="product-image" src={imageUrl} alt={title} />
      <p className="product-title">{title}</p>
      <span className="product-price">{formattedPrice}원</span>
      <button className="add-to-cart" onClick={handleCartData}>
        <Image
          className="cart-icon"
          src={addedCart ? pullCartImg : emptyCartImg}
          alt={addedCart ? "Added to cart" : "Add to cart"}
        />
      </button>
      <div className="reviewsCount">리뷰({reviewsCount})</div>
    </li>
  );
};

export default ProductItem;
