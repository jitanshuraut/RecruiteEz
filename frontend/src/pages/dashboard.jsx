import React from "react";
import { ChevronRight } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar.jsx";
import SideNavbar from "@/components/ui/SideNavbar.jsx";
import Tabs_Holder from "@/components/ui/Tabs_Holder.jsx";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading.jsx";
import Profile_Button from "@/components/ui/Profile_Button.jsx";
import Card_Holder from "@/components/ui/Card_Holder.jsx";
import { Get_recruiter_Jobs } from "@/api/Recruiter_Apis.jsx";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";

export function Dashboard() {
  const [recruiterId, setRecruiterid] = useState(
    window.sessionStorage.getItem("userId")
  );

  const navigate = useNavigate();
  const handleJobClick = (id) => {
    navigate("/jobdashboard", { state: { jobId: id } });
  };

  const [jobs, setJobs] = useState([]);
  const [totalCandidates, settotalCandidates] = useState("");
  const [totalHired, settotalHired] = useState("");
  const [totalInterviews, settotalInterviews] = useState("");

  const Tab_header = [
    {
      class_: false,
      name: "Name",
    },
    {
      class_: false,
      name: "Status",
    },
    {
      class_: true,
      name: "Applied",
    },
    {
      class_: true,
      name: "Hired",
    },
    {
      class_: true,
      name: "Created at",
    },
  ];

  const { data, status, isFetching } = useQuery({
    queryKey: ["recruiter:jobs_dashborad", recruiterId],
    queryFn: Get_recruiter_Jobs,
    staleTime: 3 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (status === "success" && data) {
      setJobs(data);
    }
  }, [status, data]);

  useEffect(() => {
    const totalCandidates_ = jobs.reduce(
      (total, job) => total + job.candidates.length,
      0
    );

    const totalHired_ = jobs.reduce(
      (total, job) => total + job.hired.length,
      0
    );

    const totalInterviews_ = jobs.reduce(
      (total, job) => total + job.interviews.length,
      0
    );

    settotalCandidates(totalCandidates_);
    settotalHired(totalHired_);
    settotalInterviews(totalInterviews_);
  }, [jobs, recruiterId]);

  if (isFetching) {
    return (
      <>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Navbar index_={0} Role={"Recruiter"} />
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
            <SideNavbar index_={0} />
            <Nav_Top_Heading Title={"Dash Board"} />
            <Profile_Button Role={"recruiter"} />
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card_Holder Title={"Total Active Jobs"} Content={jobs.length} />
              <Card_Holder
                Title={"Total Candidates Applied"}
                Content={totalCandidates}
              />
              <Card_Holder
                Title={"Total Candidates Hired"}
                Content={totalHired}
              />
              <Card_Holder
                Title={"Total Interview Pending"}
                Content={totalInterviews ?? 0}
              />
            </div>

            {/* //table */}
            <main className="grid flex-1 items-start ">
              <Tabs defaultValue="Recent Job">
                <TabsContent value="Recent Job">
                  <Tabs_Holder
                    TableHead_Data={Tab_header}
                    card_Title={"Recent Posted Jobs"}
                    card_Description={
                      "Manage your jobs and view all candidates who applied."
                    }
                  >
                    {jobs.map((job, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {job.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {job.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {job?.candidates?.length ?? 0}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {job.hired.length}/{job.seats}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {job.createdAt.slice(0, 10)}
                        </TableCell>
                        <TableCell
                          className="hidden md:table-cell"
                          onClick={() => handleJobClick(job._id)}
                        >
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                          >
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <ChevronRight className="h-10 w-5" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Tabs_Holder>
                </TabsContent>
              </Tabs>
            </main>
          </main>
        </div>
      </div>
    );
  }
}
