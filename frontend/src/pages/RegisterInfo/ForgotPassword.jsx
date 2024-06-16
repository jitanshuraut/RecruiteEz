import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [role, setRole] = useState("0");

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ email, newPassword, answer, role });
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/forgot-password",
        {
          email: email,
          password: newPassword,
          answer: answer,
          role: role,
        }
      );

      if (res && res.data.success) {
        // toast.success(res.data && res.data.message);
        // toast({
        //   title: res.data.message,
        // });

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      // toast({
      //   title: res.data.message,
      // });
    }
  };

  const handleRoleChange = (event) => {
    const value = parseInt(event.target.value); // Convert value to integer
    setRole(value); // Update role state based on selected value
  };

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="answer">Favourite Sport</Label>
              </div>
              <Input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                placeholder="Enter Favourite Sport"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">New Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="max-w-xs">
              <label htmlFor="selectRole" className="block mb-2">
                Are you a Recruiter ?
              </label>
              <div id="selectRole" className="flex space-x-4">
                <input
                  type="radio"
                  id="no"
                  name="role"
                  value="0"
                  checked={role === 0}
                  onChange={handleRoleChange}
                  className="form-radio text-blue-500"
                />
                <label htmlFor="no" className="cursor-pointer">
                  No
                </label>
                <input
                  type="radio"
                  id="yes"
                  name="role"
                  value="1"
                  checked={role === 1}
                  onChange={handleRoleChange}
                  className="form-radio text-blue-500"
                />
                <label htmlFor="yes" className="cursor-pointer">
                  Yes
                </label>
              </div>
            </div>
            <Button onClick={handleSubmit} type="submit" className="w-full">
              Reset
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <p className="underline" onClick={() => navigate("/login")}>
              Login
            </p>
          </div>
        </div>
      </div>
      <div className="hidden bg-bgCol lg:block">
        <div className="h-full w-full ">
          <img
            src="./images/Login4.jpg"
            alt="Image"
            width=""
            height=""
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
