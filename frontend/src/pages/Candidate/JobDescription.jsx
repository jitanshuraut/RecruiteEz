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
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { Apply_Job, Get_Job } from "@/api/Jobs_Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const JobDescription = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId } = location.state || {};
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(window.sessionStorage.getItem("userId"));
  console.log(userId);

  const { data, status, isFetching } = useQuery({
    queryKey: ["jobs:JobDescription", jobId],
    queryFn: Get_Job,
    staleTime: 5 * 1000,
  });

  const Apply_Mutation = useMutation({
    mutationFn: (jobId) => Apply_Job(jobId),
    onSuccess: (data) => {
      console.log("Success", data);
      toast({ title: "Job Applied Successfully" });
      queryClient.invalidateQueries(["jobs:CandidateDashBoard", userId]); // Update cache
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const handleApply = () => {
    Apply_Mutation.mutate(jobId);
  };

  if (isFetching) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={0} Role={"candidate"} />
        <div className="flex justify-center items-center h-[100vh] w-full">
          <BounceLoader color="#37383a" loading size={100} />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <div>Error fetching data</div>;
  }

  if (status === "success" && data) {
    const job = data;
    console.log("job is", job);

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
  }

  return null;
};

export default JobDescription;
