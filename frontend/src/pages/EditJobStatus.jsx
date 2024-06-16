import React from "react";
import useDataFetch from "../hooks/useDataFetch.jsx";
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

export function EditJobStatus() {
  const [recruiterId, setRecruiterId] = useState("");
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const userId = window.sessionStorage.getItem("userId");
    if (userId) {
      setRecruiterId(userId);
    } else {
      console.error("No recruiter ID found");
    }
  }, []);

  // Effect to fetch jobs only when recruiterId is set
  useEffect(() => {
    const fetchJobs = async () => {
      if (!recruiterId) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/jobs/all/recruiter?recruiterId=${recruiterId}`
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };

    fetchJobs();
  }, [recruiterId]); // This effect runs when recruiterId changes

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
    } catch (error) {
      console.error("Failed to update job status", error);
    }
  };

  const navigate = useNavigate();


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
