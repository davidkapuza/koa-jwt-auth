"use client";
import React, { useState } from "react";
import api from "../../../shared/api";
import { AuthResponse } from "../../../shared/types";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

type SignInForm = {
  email: string;
  password: string;
};
const defaultValues = {
  email: "",
  password: "",
};

function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignInForm>(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>("api/signin", formData);
      localStorage.setItem("accessToken", response.data.accessToken);
      if (response?.status === 200) {
        router.push('/profile')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message, {
          theme: "colored",
        });
      } else {
        console.error("Unexpected error", error);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Sign in</h1>
        <p className="py-6">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100"
      >
        <div className="card-body">
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
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              className="input input-bordered"
            />
          </div>
          <div className="mt-6 form-control">
            <button className="btn btn-primary">
              <span className={isLoading ? "loading loading-spinner" : ""}>
                Sign in
              </span>
            </button>
          </div>
          <small className="label-text-alt">
            Dont have account?{" "}
            <a href="/signup" className="font-semibold link link-hover">
              Sign up
            </a>
          </small>
        </div>
      </form>
    </>
  );
}

export default SignIn;
