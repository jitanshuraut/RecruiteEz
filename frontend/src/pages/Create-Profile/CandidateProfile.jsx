import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Profile_Button from "@/components/ui/Profile_Button";

const CandidateProfile = () => {
  const { toast } = useToast();
  // const [customFileName, setCustomFileName] = useState("");
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currUser, setCurrUser] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [resumeFile, setResumeFile] = useState(null);

  const handleResumeFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleProfileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  // const [customFileName, setCustomFileName] = useState("");
  // const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const DataLoader = async () => {
      console.log("came in useEffect");
      const candidateId = window.sessionStorage.getItem("userId");
      setUserId(candidateId);
      console.log(userId);
      const role = window.sessionStorage.getItem("userRole");
      setUserRole(role);

      const requestData = {
        userId: candidateId,
        role: role,
      };

      const apiUrl = `http://localhost:8080/users/userInfo/${candidateId}/${role}`;
      await axios
        .get(apiUrl, requestData)
        .then((response) => {
          // Handle successful response
          // console.log("User data:", response);
          setCurrUser(response.data);
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching user data:", error);
        });
      // console.log("user useeffect is", user);

      console.log("User role:", userRole);

      console.log("Hit");
    };

    DataLoader();
  }, []);

  console.log(currUser);

  const [name, setName] = useState(currUser.name == null ? "" : currUser.name);
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(name);
    // console.log(companyName);

    const requestData = {
      role: userRole,
      name: name,
    };

    const formData = new FormData();

    // formData.append("profilPic", selectedFile);
    formData.append("file", resumeFile);
    // formData.append("role", userRole);
    // formData.append("company", companyName);
    formData.append("name", name);

    // Include custom filename
    // Include custom filename
    console.log(formData);
    toast({
      title: "Please wait profile is updating ...",
    });
    // const apiUrl = `http://localhost:8080/users/updateCandidate/${userId}`;
    const apiUrl = `http://localhost:8080/users/updateCandidate/${userId}`;
    await axios
      .post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Handle successful response
        console.log("User data:", response);
        // setCurrUser(response.data);
      })
      .catch((error) => {
        // Handle error
        toast({
          title: error,
        });
      });

    toast({
      title: "Profile Updated Successfully",
    });
    // navigate("/candidate-dashboard");
  };

  if (!currUser) {
    return <h1>Loading</h1>;
  }

 

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
              <form onSubmit={handleSubmit} className="grid gap-4">
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
                    onChange={handleResumeFileChange}
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
};

export default CandidateProfile;
