import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import { Get_Profile } from "@/api/Candidate_Apis";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState(window.sessionStorage.getItem("userId"));
  const [userRole, setUserRole] = useState(
    window.sessionStorage.getItem("userRole")
  );
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");

  const requestData = {
    userId: userId,
    role: userRole,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(name);
    console.log(companyName);

    const requestData = {
      company: companyName,
      name: name,
    };

    toast({
      title: "Please wait profile is updating ...",
    });

    const apiUrl = `http://localhost:8080/users/updateRecruiter/${userId}`;
    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("User data:", response.data);
      toast({
        title: "Profile Updated Successfully",
      });
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
      });
    }
  };

  const { data, status, isFetching } = useQuery({
    queryKey: ["User:Profile_rec", userId, userRole, requestData],
    queryFn: Get_Profile,
  });

  useEffect(() => {
    if (status === "success" && data) {
      setName(data.name);
      setCompanyName(data.company);
    }
  }, [status, data]);

  if (isFetching) {
    return (
      <>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Navbar index_={0} Role={"candidate"} />
          <div className="flex justify-center items-center h-[100vh] w-full">
            <BounceLoader color="#37383a" loading size={100} />
          </div>
        </div>
      </>
    );
  } else if (status === "error") {
    return <div>Error fetching data</div>;
  } else if (status === "success" && data) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={0} Role={"Recruiter"} />

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={0} Role={"Recruiter"} />
            <Nav_Top_Heading Title={"Recruiter Profile"} />
            <Profile_Button Role={"Recruiter"} />
          </header>

          <div className="w-full h-screen xl:min-h-screen mt-12">
            <div className="flex items-center justify-center py-1">
              <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="name">Name</Label>
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* <div className="grid gap-4"> */}
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="company-name">Company Name</Label>
                    </div>
                    <Input
                      id="company-name"
                      type="text"
                      placeholder="Enter Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="picture">Upload Profile Pic</Label>
                      <Input
                        id="picture"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div> */}

                  <Button type="submit" className="w-full">
                    Update Profile
                  </Button>
                  {/* </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default RecruiterProfile;
