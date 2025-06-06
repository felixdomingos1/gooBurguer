import { OrderStatus } from "@prisma/client";
import { Burger } from "./burgers";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  burger: Burger;
  specialRequest?: string;
}

export interface OrderCardProps {
  order: {
    id: string;
    address: string;
    phone: string;
    notes: string | null;
    userId: string;
    total: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    user?: {
      name?: string | null;
      email?: string | null;
    };
    items: OrderItem[];
  };
  showStatus?: boolean;
  showUser?: boolean;
  showEstimatedTime?: string;
}