"use client";

import Image from "next/image";
import api from "../../../shared/api";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter()
  const handleLogout = async () => {
    await api.post("/api/signout");
    router.push("/signin")
  };
  return (
    <div className="justify-end navbar bg-base-100">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Image
              fill
              className="p-2.5"
              src="https://api.dicebear.com/6.x/bottts/png?seed=Pumpkin"
              alt="avatar"
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Theme
              <span className="badge">Coming soon</span>
            </a>
          </li>
          <li>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
