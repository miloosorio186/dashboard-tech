
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  company: {
    title: string;
    department: string;
  };
}

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  stock: number;
}

export interface Cart {
  id: number;
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
  }>;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  views: number;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
}

const BASE_URL = 'https://dummyjson.com';

export const dataService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${BASE_URL}/users?limit=6`);
      const data = await res.json();
      return data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  getProducts: async (): Promise<Product[]> => {
    try {
      const res = await fetch(`${BASE_URL}/products?limit=6`);
      const data = await res.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getCarts: async (): Promise<Cart[]> => {
    try {
      const res = await fetch(`${BASE_URL}/carts?limit=5`);
      const data = await res.json();
      return data.carts;
    } catch (error) {
      console.error('Error fetching carts:', error);
      return [];
    }
  },

  getPosts: async (): Promise<Post[]> => {
    try {
      const res = await fetch(`${BASE_URL}/posts?limit=4`);
      const data = await res.json();
      return data.posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }
};
