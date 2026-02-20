export default function AdminOrders() {
    const orders = [
        { id: 1, user: "Swathi", total: 499, status: "Preparing" },
        { id: 2, user: "Ravi", total: 299, status: "Delivered" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Orders</h1>

            <div className="bg-white rounded-xl shadow p-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="flex justify-between border-b py-4"
                    >
                        <span>
                            #{order.id} - {order.user} - ₹{order.total}
                        </span>
                        <span className="font-semibold">{order.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}