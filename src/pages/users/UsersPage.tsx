// "use client";

// import { useEffect, useState } from "react";
// import { getUsers } from "@/services/user.service";

// type User = {
//   id: number;
//   name: string;
// };

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([]);
// console.log("users",users);

//   useEffect(() => {
//     getUsers().then(setUsers);
//   }, []);

//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <h2 className="text-xl font-semibold mb-2">Users</h2>

//       {users.length === 0 ? (
//         <p>No users found</p>
//       ) : (
//         <ul className="space-y-1">
//           {users.map((user) => (
//             <li key={user.id} className="border p-2 rounded">
//               {user.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

export default function UsersPage() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Users</h2>
      <p className="text-gray-600 mt-2">
        Users page UI component
      </p>
    </div>
  );
}