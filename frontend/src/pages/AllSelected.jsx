import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Tabs_Holder from "@/components/ui/Tabs_Holder";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";

export function AllSelected() {
  const navigate = useNavigate();
  const recruiterId = window.sessionStorage.getItem("userId");
  const queryClient = useQueryClient();

  const fetchInterviewCandidates = async ({ queryKey }) => {
    const [_, recruiterId] = queryKey;
    const response = await axios.get(
      `http://localhost:8080/jobs/selected/${recruiterId}`
    );
    return response.data;
  };

  const fetchCandidateDetails = async (candidateId) => {
    const response = await fetch(
      `http://localhost:8080/jobs/candidate/${candidateId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch candidate details");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: candidates = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["selectedCandidates", recruiterId],
    queryFn: fetchInterviewCandidates,
    enabled: !!recruiterId,
    staleTime: 2 * 1000,
  });

  useEffect(() => {
    const enhanceCandidates = async () => {
      const enhancedCandidates = await Promise.all(
        candidates.map(async (candidate) => {
          const candidateDetails = await fetchCandidateDetails(
            candidate.candidateId
          );
          return {
            ...candidate,
            candidateName: candidateDetails.name,
            candidateEmail: candidateDetails.email,
          };
        })
      );
      queryClient.setQueryData(
        ["selectedCandidates", recruiterId],
        enhancedCandidates
      );
    };

    if (candidates.length > 0) {
      enhanceCandidates();
    }
  }, [candidates, recruiterId, queryClient]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={5} Role={"Recruiter"} />
        <div className="flex justify-center items-center h-[100vh] w-full">
          <BounceLoader color="#37383a" loading size={100} />
        </div>
      </div>
    );
  }
  if (error) {
    return <div>{`Failed to fetch candidates: ${error.message}`}</div>;
  }
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
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar index_={5} Role={"Recruiter"} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SideNavbar index_={5} Role={"Recruiter"} />
          <Nav_Top_Heading Title={"Selected Candidates"} />
          <Profile_Button Role={"recruiter"} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* //form */}
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="week">
              <TabsContent value="week">
                <Tabs_Holder
                  TableHead_Data={Tab_header}
                  card_Title={"Candidates Selected"}
                  card_Description={
                    "Selected candidates for all the job posted yet."
                  }
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
                            Selected
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {candidate.applyDate.slice(0, 10) ?? "Not Available"}
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
