"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import "../../styles/login.css";

const LoginComponent = () => {
  //usename: eve.holt@reqres.in
  //password: cityslicka
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (rememberMe) {
      setFormData({
        email: savedEmail || "",
        password: savedPassword || "",
        rememberMe,
      });
    }
  }, []);

  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    if (!formData.email || !formData.password) {
      setError("لطفاً تمام فیلدها را پر کنید");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post("https://reqres.in/api/login", {
        email: formData.email,
        password: formData.password,
      });
  
      if (response.status === 200) {
        alert("ورود موفقیت‌آمیز بود!");
        console.log("Token:", response.data.token);
  
        // Save data to localStorage if "rememberMe" is checked
        if (formData.rememberMe) {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("password", formData.password);
          localStorage.setItem("rememberMe", "true");
        } else {
          // Clear data from localStorage if "rememberMe" is not checked
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("rememberMe");
        }
  
        window.location.href = "/dashboard"; // Redirect to dashboard
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("خطایی در سرور رخ داده است");
        }
      } else {
        setError("یک خطای ناشناخته رخ داده است");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="login"
      className="h-screen w-screen flex justify-center items-center px-5 md:px-0"
    >
      <div className="sm:shadow-xl bg-white w-full md:w-2/3 rounded-xl flex">
        <div className="w-full md:w-1/2 bg-white px-8 py-8 md:py-12 lg:py-24 flex justify-center items-center flex-col rounded-xl md:rounded-s-xl gap-5">
          <Image
            className="bg-[#287839] flex md:hidden p-3"
            width={136}
            height={80}
            src="/images/wimenu-logo.png"
            alt="menu-login"
          />
          <h1 className="text-lg md:text-xl lg:text-2xl">
            ورود به حساب کاربری
          </h1>
          {error && (
            <div className="text-red-500 text-sm mb-3">{error}</div>
          )}
          <form
            className="w-full flex flex-col py-4 gap-8"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-100 border-0 rounded-xl py-2 lg:py-3 !outline-0 !shadow-none !ring-0"
              placeholder="ایمیل"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-100 border-0 rounded-xl py-2 lg:py-3 !outline-0 !shadow-none !ring-0"
              placeholder="رمز عبور"
            />
            <div className="flex justify-start items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                id="remember-me"
                className="bg-slate-200 rounded-sm border-0 !outline-0 !shadow-none !ring-offset-0 !ring-0"
              />
              <label htmlFor="remember-me">مرا به خاطر داشته باش</label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#287839] text-white font-bold inline-block rounded-lg text-lg py-2 lg:py-3"
              disabled={loading}
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
        </div>
        <div className="hidden md:flex md:w-1/2 bg-[#319245] md:rounded-e-xl">
          <div className="w-full h-full bg-[url('/images/background-wave.svg')] bg-cover flex justify-center items-center p-4">
            <Image
              className=""
              width={300}
              height={400}
              src="/images/wimenu-logo.png"
              alt="menu-phone"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;
