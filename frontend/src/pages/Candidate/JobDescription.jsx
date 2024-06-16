import React, { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import useDataFetch from "@/hooks/useDataFetch";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";

const JobDescription = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId } = location.state || {};
  const [userId, setUserId] = useState("");

  useEffect(() => {
    //  console.log("came in useEffect");
    const candidateId = window.sessionStorage.getItem("userId");
    setUserId(candidateId);

    console.log(userId);
    // console.log("Hit")
  }, []);

  // if (userId) {
  //   console.log("cc id is set");
  // } else {
  //   console.log("cc id is not set");
  // }

  // console.log(userId);
  const job = useDataFetch(`http://localhost:8080/jobs/${jobId}`);

  console.log("job is", job);

  const handleApply = async () => {
    // console.log(userId);
    // console.log(job);
    try {
      let token = sessionStorage.getItem("token");
      console.log("token is,", token);
      const response = await axios.post("http://localhost:8080/jobs/apply", {
        jobId,
        token: token,
      });
      // console.log("response is", response.data);
      toast({
        title: response.data,
      });
    } catch (error) {
      console.error("Error Applying for the job", error.response.data);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // const timestamp = job.createdAt;
  // const date = new Date(timestamp);
  // const formattedDate = date.toISOString().split("T")[0];
  // console.log(formattedDate);
  // const formattedDate = timeStamp.slice(0, 10);
  // console.log(formattedDate);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar index_={0} Role={"candidate"} />

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SideNavbar index_={0} Role={"candidate"} />
          <Nav_Top_Heading Title={"Job Description"} />
          <Profile_Button Role={"candidate"} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* //table */}
          <main className="grid flex-1 items-start ">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>

              <div className="p-4">
                <div>
                  <div>
                    <span className="font-medium">Location</span>
                    <span className="mx-4">{job.location}</span>
                  </div>
                  <div>
                    <span className="font-medium">Date Created:</span>
                    <span className="mx-4">{job.createdAt}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-center font-medium">Job Description:</p>
                  <div className="p-6 text-xs overflow-y-scroll h-[45vh]">
                    {job.description}
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => navigate("/search-jobs")}
                  variant="outline"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    handleApply();
                    toast({
                      title: " Job Applied Successfully",
                    });
                  }}
                >
                  Apply
                </Button>
              </CardFooter>
            </Card>
          </main>
        </main>
      </div>
    </div>
  );
};

export default JobDescription;
