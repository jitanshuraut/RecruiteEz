import React from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Tabs_Holder from "@/components/ui/Tabs_Holder.jsx";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar.jsx";
import SideNavbar from "@/components/ui/SideNavbar.jsx";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import { Get_recruiter_Jobs } from "@/api/Recruiter_Apis.jsx";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toggle_Job } from "@/api/Jobs_Api.jsx";
import { useToast } from "@/components/ui/use-toast";

export function EditJobStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [recruiterId, setRecruiterid] = useState(
    window.sessionStorage.getItem("userId")
  );
  const [jobs, setJobs] = useState([]);

  const handleToggle = async (jobId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/jobs/${jobId}/status`,
        {
          active: !currentStatus,
        }
      );

      // Update the local state with the new job data
      setJobs(jobs.map((job) => (job._id === jobId ? response.data : job)));
      toast({
        title: "Toggel Successfully",
      });
    } catch (error) {
      console.error("Failed to update job status", error);
    }
  };

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

  const { data, status, isFetching } = useQuery({
    queryKey: ["recruiter:jobs_edit", recruiterId],
    queryFn: Get_recruiter_Jobs,
    staleTime: 2 * 1000,
  });

  useEffect(() => {
    if (status === "success" && data) {
      setJobs(data);
    }
  }, [status, data]);

  if (isFetching) {
    return (
      <>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Navbar index_={2} Role={"Recruiter"} />
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
        <Navbar index_={2} Role={"Recruiter"} />

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={2} Role={"Recruiter"} />
            <Nav_Top_Heading Title={"Edit Job Status"} />
            <Profile_Button Role={"recruiter"} />
          </header>
          {/* <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
           */}

          {/* //table */}
          <main className="grid flex-1 items-start ">
            <Tabs defaultValue="Edit Job">
              <TabsContent value="Edit Job">
                <Tabs_Holder
                  TableHead_Data={Tab_header}
                  card_Title={"Recent Posted Jobs"}
                  card_Description={
                    "Manage your jobs and view all candidates who applied."
                  }
                >
                  {jobs.map((job, index) => (
                    <TableRow key={job._id}>
                      <TableCell className="font-medium">{job.title}</TableCell>

                      <TableCell className="hidden md:table-cell">
                        {job?.candidates?.length ?? 0}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {job.hired.length}/{job.seats}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {job.createdAt.slice(0, 10)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Button
                          variant="secondary"
                          onClick={() => handleToggle(job._id, job.active)}
                        >
                          {job.active ? "Disable" : "Enable"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </Tabs_Holder>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    );
  }
}
