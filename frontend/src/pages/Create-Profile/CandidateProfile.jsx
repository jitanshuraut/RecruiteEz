import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Profile_Button from "@/components/ui/Profile_Button";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { Get_Profile } from "@/api/Candidate_Apis";

const CandidateProfile = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState(window.sessionStorage.getItem("userId"));
  const [userRole, setUserRole] = useState(
    window.sessionStorage.getItem("userRole")
  );
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("name", name);
    console.log(formData);
    toast({
      title: "Please wait profile is updating ...",
    });
    const apiUrl = `http://localhost:8080/users/updateCandidate/${userId}`;
    await axios
      .post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("User data:", response);
      })
      .catch((error) => {
        toast({
          title: error,
        });
      });

    toast({
      title: "Profile Updated Successfully",
    });
  };

  const [resumeFile, setResumeFile] = useState(null);

  const handleResumeFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const requestData = {
    userId: userId,
    role: userRole,
  };

  const { data, status, isFetching } = useQuery({
    queryKey: ["User:Profile_can", userId, userRole, requestData],
    queryFn: Get_Profile,
    staleTime: 1 * 1000,
  });

  useEffect(() => {
    if (status === "success" && data) {
      setName(data.name);
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
        <Navbar index_={0} Role={"candidate"} />

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={0} Role={"candidate"} />
            <Nav_Top_Heading Title={"Candidate Profile"} />
            <Profile_Button Role={"candidate"} />
          </header>

          <div className="w-full h-screen xl:min-h-screen mt-12">
            <div className="flex items-center justify-center py-1">
              <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold mb-4">Update Profile</h1>
                </div>
                <form
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                  className="grid gap-4"
                >
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="name">Name</Label>
                    </div>
                    <Input
                      id="name"
                      type="text"
                      // required
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="resume">Upload Resume</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      encType="multipart/form-data"
                      onChange={(e) => {
                        handleResumeFileChange(e);
                      }}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Update Profile
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CandidateProfile;
