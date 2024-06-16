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
import useDataFetch from "@/hooks/useDataFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Tabs_Holder from "@/components/ui/Tabs_Holder";

export function InterviewList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = location.state || {};
  console.log(jobId);

  const job = useDataFetch(`http://localhost:8080/jobs/${jobId}`);
  console.log(job);

  const jobCandidates = useDataFetch(
    `http://localhost:8080/jobs/${jobId}/candidates`
  );
  console.log(jobCandidates);

  const jobInterviews = useDataFetch(
    `http://localhost:8080/jobs/${jobId}/interviews`
  );
  console.log(jobInterviews);

  const handleHired = async (userId, index) => {
    console.log(userId, index);
    try {
      const response = await axios.put(
        `http://localhost:8080/jobs/${jobId}/hire-candidate`,
        {
          candidateId: userId,
        }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Failed to add interviewee:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleReject = async (userId, index) => {
    console.log(userId, index);
    try {
      const response = await axios.put(
        `http://localhost:8080/jobs/${jobId}/reject`,
        {
          userId,
        }
      );

      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Failed to add interviewee:",
        error.response?.data?.error || error.message
      );
    }
  };

  const Tab_header = [
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
                  TableHead_Data={Tab_header}
                  card_Title={"Candidates Interviews Pending"}
                  card_Description={"Interview pending candidates for the job."}
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
