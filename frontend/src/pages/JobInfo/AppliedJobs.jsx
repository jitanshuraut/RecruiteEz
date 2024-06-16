import React, { useState, useEffect } from "react";
import useDataFetch from "@/hooks/useDataFetch";
import { useNavigate } from "react-router-dom";
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
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Tabs_Holder from "@/components/ui/Tabs_Holder";

const AppliedJobs = () => {
  const jobs = useDataFetch("http://localhost:8080/jobs/all");
  console.log(jobs);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    //  console.log("came in useEffect");

    const candidateId = window.sessionStorage.getItem("userId");
    setUserId(candidateId);

    console.log(userId);
    // console.log("Hit")
  }, []);

  const matchedJobs = [];

  jobs.forEach((job) => {
    const candidateArray = job.candidates;

    for (let i = 0; i < candidateArray.length; i++) {
      if (
        candidateArray[i].candidateId === userId &&
        candidateArray[i].status === "Applied"
      ) {
        matchedJobs.push({
          jobId: job._id,
          role: job.title,
          companyName: job.company,
          location: job.location,
          appliedDate: candidateArray[i].applyDate,
          status: candidateArray[i].status,
        });

        break;
      }
    }
  });

  matchedJobs.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  console.log(matchedJobs);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
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
      <Navbar index_={0} Role={"candidate"} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SideNavbar index_={0} Role={"candidate"} />
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
};

export default AppliedJobs;
