import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Profile_Button from "@/components/ui/Profile_Button";
import Tabs_Holder from "@/components/ui/Tabs_Holder";

export function InterviewsAll() {
  const navigate = useNavigate();
  const [recruiterId, setRecruiterid] = useState(
    window.sessionStorage.getItem("userId")
  );
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviewCandidates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/jobs/interviews/${recruiterId}`
        );
        console.log(response.data);
        setCandidates(response.data);
      } catch (err) {
        setError("Failed to fetch candidates: " + err.message);
        setLoading(false);
      }
    };

    if (recruiterId) {
      fetchInterviewCandidates();
    }
  }, [recruiterId]);
  console.log("candidates : ", candidates);

  async function fetchCandidateDetails(candidateId) {
    try {
      const response = await fetch(
        `http://localhost:8080/jobs/candidate/${candidateId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch candidate details");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      setLoading(false);
      return null;
    }
  }

  async function enhanceCandidates() {
    for (let i = 0; i < candidates.length; i++) {
      const candidateDetails = await fetchCandidateDetails(
        candidates[i].candidateId
      );
      if (candidateDetails) {
        candidates[i].candidateName = candidateDetails.name;
        candidates[i].candidateEmail = candidateDetails.email;
      }
    }
    console.log("Enhanced candidates:", candidates);
    setLoading(false);
    return candidates;
  }

  useEffect(() => {
    if (candidates.length > 0) {
      enhanceCandidates();
    }
  }, [candidates]);

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

  if (loading) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={3} Role={"Recruiter"} />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={3} Role={"Recruiter"} />
            <Nav_Top_Heading Title={"Interview Sceduled"} />
            <Profile_Button Role={"recruiter"} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            Not Found
            <div></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar index_={3} Role={"Recruiter"} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SideNavbar index_={3} Role={"Recruiter"} />
          <Nav_Top_Heading Title={"Interview Sceduled"} />
          <Profile_Button Role={"recruiter"} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="week">
              <TabsContent value="week">
                <Tabs_Holder
                  TableHead_Data={Tab_header}
                  card_Title={"Candidates Interviews Scheduled"}
                  card_Description={"Interview pending candidates for the job."}
                >
                  {candidates && candidates.length > 0 ? (
                    candidates.map((candidate, index) => (
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">
                            {candidate.candidateName
                              ? candidate.candidateName
                              : "Unknown"}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {candidate.candidateEmail ?? "Not Available"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {candidate.jobTitle ?? "Not Available"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="outline">
                            Interview
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {candidate.applyDate.slice(0, 10) ?? "Not Available"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {candidate.interviewDate ?? "Not Available"}
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
