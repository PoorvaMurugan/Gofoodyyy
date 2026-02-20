export default function AdminUsers() {
    const users = [
        { id: 1, name: "Swathi", email: "swathi@gmail.com" },
        { id: 2, name: "Ravi", email: "ravi@gmail.com" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users</h1>

            <div className="bg-white rounded-xl shadow p-6">
                {users.map((user) => (
                    <div key={user.id} className="border-b py-4">
                        {user.name} - {user.email}
                    </div>
                ))}
            </div>
        </div>
    );
}