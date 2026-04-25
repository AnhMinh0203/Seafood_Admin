export interface CartItem {
  id: string;            
  productId: string;
  productName: string;
  unitName: string;
  price: number;
  imageUrl: string;
  quantity: number;     
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartQuantityDto {
  cartId: string;
  quantity: number;
}