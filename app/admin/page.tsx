export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold">Total Orders</h2>
                    <p className="text-2xl font-bold mt-2">120</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold">Total Revenue</h2>
                    <p className="text-2xl font-bold mt-2">₹45,000</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold">Total Users</h2>
                    <p className="text-2xl font-bold mt-2">78</p>
                </div>
            </div>
        </div>
    );
}