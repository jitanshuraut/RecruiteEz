
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function SignUp() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [role, setRole] = useState("0");
  const [gender, setGender] = useState("0");

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          email: registerEmail,
          password: registerPassword,
          answer,
          role,
          gender,
        }
      );
      console.log(res);

      if (res && res.data.success) {
        // toast.success(res.data && res.data.message);

        toast({
          title: "User registered Successfully",
        });

        try {
          const res = await axios.post(
            "http://localhost:8080/api/v1/auth/login",
            {
              email: registerEmail,
              password: registerPassword,
            }
          );

          console.log(registerEmail, registerPassword);

          if (res && res.data.success) {
            navigate("/login");
         
            // }
          } else {
            // toast.error(res.data.message);
            // console.log(res.data.message);
            toast({
              title: res.data.message,
            });
          }
        } catch (error) {
          console.log(error);
          // toast.error("Something went wrong");
          toast({
            title: "something went wrong",
          });
        }
      } else {
        toast({
          title: res.data.message,
        });
      }
    } catch (error) {
      // console.log(error);
      toast({
        title: "something went wrong",
      });
    }
  };

  const handleRoleChange = (event) => {
    const value = parseInt(event.target.value); // Convert value to integer
    setRole(value); // Update role state based on selected value
  };

  const handleGenderChange = (event) => {
    const value = parseInt(event.target.value); // Convert value to integer
    setGender(value); // Update role state based on selected value
  };

  // console.log(process.env.REACT_APP_API);

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[500px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </div>
              <Input
                id="confirmPassword"
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
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

            <div className="max-w-xs">
              <label htmlFor="selectGender" className="block mb-2">
                Gender
              </label>

              <div id="selectGender" className="flex space-x-4">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="0"
                  checked={gender === 0}
                  onChange={handleGenderChange}
                  className="form-radio text-blue-500"
                />
                <label htmlFor="male" className="cursor-pointer">
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="1"
                  checked={gender === 1}
                  onChange={handleGenderChange}
                  className="form-radio text-blue-500"
                />
                <label htmlFor="female" className="cursor-pointer">
                  Female
                </label>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="2"
                  checked={gender === 2}
                  onChange={handleGenderChange}
                  className="form-radio text-blue-500"
                />
                <label htmlFor="other" className="cursor-pointer">
                  Other
                </label>
              </div>
            </div>

            <Button onClick={handleSubmit} type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account? {/* ************* */}
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
}
