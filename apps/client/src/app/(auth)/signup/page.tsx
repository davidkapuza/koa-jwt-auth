"use client";
import React, { useState } from "react";
import api from "../../../shared/api";
import { AuthResponse } from "../../../shared/types";
import { toast } from "react-toastify";
import axios from "axios";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};
const defaultValues = {
  name: "",
  email: "",
  password: "",
  password_confirm: "",
};

function SignUp() {
  const [formData, setFormData] = useState<SignUpForm>(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post<AuthResponse>("api/signup", formData);
      localStorage.setItem("accessToken", response.data.accessToken);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message, {
          theme: "colored",
        });
      } else {
        console.error("Unexpected error", error);
      }
    }
  };

  return (
    <>
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Sign up</h1>
        <p className="py-6">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
      >
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">User name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="user name"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="text"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm password</span>
            </label>
            <input
              type="text"
              name="password_confirm"
              placeholder="confirm password"
              value={formData.password_confirm}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Sign up</button>
          </div>
        </div>
      </form>
    </>
  );
}

export default SignUp;
