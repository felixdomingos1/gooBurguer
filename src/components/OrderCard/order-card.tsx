"use client";

import { OrderCardProps } from "@/lib/types/order";
import { parseBurger } from "@/lib/utils/utils";

export default function OrderCard({
  order,
  showStatus = true,
  showUser = false,
  showEstimatedTime,
}: OrderCardProps) {
  const transformedItems = order.items.map(item => ({
    ...item,
    burger: parseBurger(item.burger)
  }));
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h2>
          <p className="text-gray-600">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {showStatus && (
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "PREPARING"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "READY"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                }`}
            >
              {order.status}
            </span>
            {showEstimatedTime && (
              <span className="text-sm text-gray-500 mt-1">
                {showEstimatedTime}
              </span>
            )}
          </div>
        )}
      </div>

      {showUser && order.user && (
        <div className="mb-4">
          <h3 className="font-medium">Customer</h3>
          <p>{order.user.name}</p>
          <p className="text-gray-600">{order.user.email}</p>
          <p className="text-gray-600">{order.phone}</p>
          <p className="text-gray-600">{order.address}</p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-medium">Items</h3>
        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.id} className="py-2 flex justify-between">
              <div>
                <p>{item.burger.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
                {item.specialRequest && (
                  <p className="text-sm text-gray-500">
                    Note: {item.specialRequest}
                  </p>
                )}
              </div>
              <p className="font-medium">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <p className="font-medium">Total</p>
        <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
      </div>

      {order.notes && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-medium">Notes</h3>
          <p className="text-gray-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
}