import React, { useState, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Tabs_Holder from "@/components/ui/Tabs_Holder";
import { Get_All_Jobs } from "@/api/Candidate_Apis";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";

const AppliedJobs = () => {
  const Tab_header = [
    {
      class_: false,
      name: "Name",
    },
    {
      class_: true,
      name: "Applied",
    },
    {
      class_: true,
      name: "Created at",
    },
    {
      class_: true,
      name: "Action",
    },
  ];

  const [userId, setUserId] = useState(window.sessionStorage.getItem("userId"));
  const [userRole, setUserRole] = useState(
    window.sessionStorage.getItem("userRole")
  );
  const [jobs, setJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);

  const requestData = {
    userId: userId,
    role: userRole,
  };

  const { data, status, isFetching } = useQuery({
    queryKey: ["jobs:UserApplied", userId],
    queryFn: Get_All_Jobs,
    staleTime: 1 * 1000,
  });

  useEffect(() => {
    if (status === "success" && data) {
      console.log("--------------------------------");
      console.log(data);
      console.log("--------------------------------");
      setJobs(data);
    }
  }, [status, data]);

  useEffect(() => {
    const matched = jobs
      .map((job) => {
        const candidate = job.candidates.find(
          (candidate) => candidate.candidateId === userId
        );
        if (candidate?.status === "Applied") {
          return {
            jobId: job._id,
            role: job.title,
            companyName: job.company,
            location: job.location,
            appliedDate: candidate.applyDate,
            status: candidate.status,
          };
        }
        return null;
      })
      .filter((job) => job !== null);

    matched.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    setMatchedJobs(matched);
    setJobsApplied(matched.length);
    setInterviewCount(
      matched.filter((job) => job.status === "Interview").length
    );
    setHiredCount(matched.filter((job) => job.status === "Hired").length);
    setRecentJobs(matched.slice(0, 10));
  }, [jobs, userId]);

  if (isFetching) {
    return (
      <>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Navbar index_={2} Role={"candidate"} />
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
        <Navbar index_={2} Role={"candidate"} />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={2} Role={"candidate"} />
            <Nav_Top_Heading Title={"Applied Jobs"} />
            <Profile_Button Role={"candidate"} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {/* //table */}
            <main className="grid flex-1 items-start ">
              <Tabs defaultValue="Job">
                <TabsContent value="Job">
                  <Tabs_Holder
                    TableHead_Data={Tab_header}
                    card_Title={"Total Applied Jobs"}
                    card_Description={""}
                  >
                    {matchedJobs && matchedJobs.length > 0 ? (
                      matchedJobs.map((job) => {
                        return (
                          <TableRow>
                            <TableCell className="font-medium">
                              {job.role}
                            </TableCell>
                            <TableCell className="font-medium">
                              {job.companyName}
                            </TableCell>

                            <TableCell className="hidden md:table-cell">
                              {job.location}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {job.appliedDate}
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline">{job.status}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan="number_of_columns">
                          No Jobs found
                        </TableCell>
                      </TableRow>
                    )}
                  </Tabs_Holder>
                </TabsContent>
              </Tabs>
            </main>
          </main>
        </div>
      </div>
    );
  }
};

export default AppliedJobs;
