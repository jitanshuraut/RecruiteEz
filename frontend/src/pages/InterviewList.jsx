import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Tabs_Holder from "@/components/ui/Tabs_Holder";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import {
  Get_Job,
  handle_Reject,
  hireCandidate,
  job_Candidates,
  job_Interviews,
} from "@/api/Jobs_Api";
import { useState, useEffect } from "react";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Profile_Button from "@/components/ui/Profile_Button";

export function InterviewList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState([]);
  const [jobInterviews, setJobInterviews] = useState([]);
  const queryClient = useQueryClient();

  const { jobId } = location.state || {};
  console.log(jobId);

  const {
    data: dataJob,
    status: statusJob,
    isFetching: isFetchingJob,
  } = useQuery({
    queryKey: ["recruiter:jobs", jobId],
    queryFn: Get_Job,
  });

  useEffect(() => {
    if (statusJob === "success" && dataJob) {
      setJob(dataJob);
      console.log("Job");
      console.log(dataJob);
    }
  }, [statusJob, dataJob]);

  const {
    data: dataIntv,
    status: statusIntv,
    isFetching: isFetchingIntv,
  } = useQuery({
    queryKey: ["recruiter:jobs_int", jobId],
    queryFn: job_Interviews,
  });

  useEffect(() => {
    if (statusIntv === "success" && dataIntv) {
      setJobInterviews(dataIntv);
      console.log("initialized");
      console.log(dataIntv);
    }
  }, [statusIntv, dataIntv]);

  const hireMutation = useMutation({
    mutationFn: hireCandidate,
    onSuccess: (data) => {
      console.log(data.message);
      queryClient.invalidateQueries(["recruiter:jobs_hired", jobId]);
    },
    onError: (error) => {
      console.error(
        "Failed to hire candidate:",
        error.response?.data?.error || error.message
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: handle_Reject,
    onSuccess: (data) => {
      console.log(data.message);
      // Optionally refetch or update the cache
      queryClient.invalidateQueries(["recruiter:jobs", jobId]);
    },
    onError: (error) => {
      console.error(
        "Failed to reject candidate:",
        error.response?.data?.error || error.message
      );
    },
  });

  const handleHired = (userId, index) => {
    console.log(userId, index);
    hireMutation.mutate({ jobId, userId });
  };

  const handleReject = (userId, index) => {
    console.log(userId, index);
    rejectMutation.mutate({ jobId, userId });
  };

  const tabHeader = [
    {
      class_: false,
      name: "Candidate",
    },
    {
      class_: true,
      name: "Job",
    },
    {
      class_: true,
      name: "Status",
    },
    {
      class_: true,
      name: "Applied Date",
    },
    {
      class_: true,
      name: "Interview Date & Time",
    },
  ];

  if (isFetchingIntv) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={0} Role={"Recruiter"} />
        <div className="flex justify-center items-center h-[100vh] w-full">
          <BounceLoader color="#37383a" loading size={100} />
        </div>
      </div>
    );
  } else if (statusIntv === "error" || statusJob === "error") {
    return <div>Error fetching data</div>;
  } else if (statusIntv === "success" && dataIntv) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={3} Role={"Recruiter"} />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={3} Role={"Recruiter"} />
            <Nav_Top_Heading Title={`Interviews Pending - ${job.title}`} />
            <Profile_Button Role={"recruiter"} />
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {/* //table */}

            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <Tabs defaultValue="week">
                <TabsContent value="week">
                  <Tabs_Holder
                    TableHead_Data={tabHeader}
                    card_Title={"Candidates Interviews Pending"}
                    card_Description={
                      "Interview pending candidates for the job."
                    }
                  >
                    {jobInterviews && jobInterviews.length > 0 ? (
                      jobInterviews.map((candidate, index) => (
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {candidate.email}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {candidate.gender === 1 ? "Male" : "Female"}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              {job?.candidates[index]?.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {candidate.interviewDate ?? "Not Available"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant=""
                              size="sm"
                              onClick={() => {
                                handleHired(candidate._id, index);
                              }}
                            >
                              Hire
                            </Button>
                            <Button
                              variant="outline"
                              className="ml-5"
                              size="sm"
                              onClick={() => {
                                handleReject(candidate._id, index);
                              }}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="number_of_columns">
                          No candidates found.
                        </TableCell>
                      </TableRow>
                    )}
                  </Tabs_Holder>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
