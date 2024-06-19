import { useLocation } from "react-router-dom";
import {
  ChevronRight,
  CreditCard,
  Users,
  Eye,
  Star,
  CalendarCheck,
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Profile_Button from "@/components/ui/Profile_Button";
import Tabs_Holder from "@/components/ui/Tabs_Holder";
import Card_Holder from "@/components/ui/Card_Holder";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { Get_recruiter_Jobs } from "@/api/Recruiter_Apis.jsx";
import { Get_Job, job_Candidates } from "@/api/Jobs_Api";
import TimePicker from "react-time-picker";
import { useToast } from "@/components/ui/use-toast";

export function JobDashboard() {
  const location = useLocation();
  const { jobId } = location.state || {};
  const navigate = useNavigate();
  const [value, onChange] = useState("10:00");
  const { toast } = useToast();

  const [job, setJob] = useState([]);
  const [jobCandidates, setJobCandidates] = useState([]);
  const [starClicker, setStarClicker] = useState(0);
  const [dateTime, setDateTime] = useState({
    date: new Date(),
    time: "10:00",
  });

  const {
    data: data_job,
    status: status_job,
    isFetching: isFetching_job,
  } = useQuery({
    queryKey: ["recruiter:jobs", jobId],
    queryFn: Get_Job,
  });

  const {
    data: data_can,
    status: status_can,
    isFetching: isFetching_can,
  } = useQuery({
    queryKey: ["recruiter:candidates", jobId],
    queryFn: job_Candidates,
  });

  useEffect(() => {
    if (status_job === "success" && data_job) {
      setJob(data_job);
    }
  }, [status_job, data_job]);

  useEffect(() => {
    if (status_can === "success" && data_can) {
      setJobCandidates(data_can);
      console.log(data_can);
    }
  }, [status_can, data_can]);

  const handleJobClick2 = (id) => {
    navigate("/interviewlist", { state: { jobId: id } });
  };

  const handleSelected = async (index) => {
    try {
      setStarClicker(starClicker + 1);
      const updatedCandidates = [...job.candidates];
      updatedCandidates[index].status =
        updatedCandidates[index].status === "Selected" ? "Applied" : "Selected";
      setJob({ ...job, candidates: updatedCandidates });

      const response = await axios.put(
        `http://localhost:8080/jobs/toggle-selected/${jobId}`,
        { index }
      );

      console.log("Toggle Success:", response.data);
    } catch (error) {
      console.error("Error toggling selected:", error);
    }
  };

  useEffect(() => {
    console.log("Selected from useEffect");
  }, [starClicker]);

  const handleInterview = async (index) => {
    const userId = jobCandidates[index]._id;
    console.log("Interview:", index, userId);
    const formattedDateTime = value;

    try {
      const response = await axios.put(
        `http://localhost:8080/jobs/${jobId}/add-interviewee`,
        {
          userId,
          index,
          interviewDate: formattedDateTime,
          recruiterId: window.sessionStorage.getItem("userId"),
        }
      );

      console.log(response.data);
      toast({ title: "Send Email Succesfully" });
    } catch (error) {
      console.error(
        "Failed to add interviewee:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleResumeOpen = (candidateId) => {
    const url = `/resume/${candidateId}`;
    window.open(url, "_blank");
  };

  const head_all = [
    { class_: false, name: "Candidates" },
    { class_: true, name: "Gender" },
    { class_: true, name: "Status" },
    { class_: true, name: "Date" },
    { class_: true, name: "ATS" },
    { class_: true, name: "Resume" },
    { class_: true, name: "Select" },
  ];

  const head_selected = [
    { class_: false, name: "Candidates" },
    { class_: true, name: "Gender" },
    { class_: true, name: "Status" },
    { class_: true, name: "Date" },
    { class_: true, name: "Resume" },
    { class_: true, name: "Select" },
    { class_: true, name: "Schedule Interview" },
  ];

  if (isFetching_can) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={0} Role={"Recruiter"} />
        <div className="flex justify-center items-center h-[100vh] w-full">
          <BounceLoader color="#37383a" loading size={100} />
        </div>
      </div>
    );
  } else if (status_can === "error" || status_job === "error") {
    return <div>Error fetching data</div>;
  } else if (
    status_can === "success" &&
    data_can &&
    status_job === "success" &&
    data_job
  ) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={0} Role={"Recruiter"} />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={0} Role={"Recruiter"} />
            <Nav_Top_Heading Title={`Dashboard - ${job.title}`} />
            <Profile_Button Role={"recruiter"} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card_Holder
                Title={"Candidates Applied for this Role"}
                Content={job?.candidates?.length ?? 0}
              />
              <Card_Holder
                Title={"Candidates Hired for this Role"}
                Content={job?.hired?.length ?? 0}
              />

              <Card_Holder
                Title={"Candidates Hired for this Role"}
                Content={job?.hired?.length ?? 0}
              />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Interview Pending
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6"
                    onClick={() => handleJobClick2(job._id)}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {job?.interviews?.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* //table */}

            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <Tabs defaultValue="all">
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="all">All Candidates</TabsTrigger>
                    <TabsTrigger value="selected">
                      Selected Candidates
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="all">
                  <Tabs_Holder
                    TableHead_Data={head_all}
                    card_Title={"All Candidates"}
                    card_Description={"Recently applied for this role."}
                  >
                    {jobCandidates && jobCandidates.length > 0 ? (
                      jobCandidates.map((candidate, index) => (
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {candidate.email}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {candidate.gender === 0
                              ? "Male"
                              : candidate.gender === 1
                              ? "Female"
                              : "Other"}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="outline">
                              {candidate.status ?? "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {candidate.applyDate?.slice(0, 10) ??
                              "Not Available"}
                          </TableCell>

                          <TableCell className="hidden md:table-cell">
                            {job.candidates[index].ATS_Score}
                          </TableCell>
                          <TableCell className="text-right">
                            <Eye
                              onClick={() => handleResumeOpen(candidate._id)}
                              className="h-5 w-5"
                              color="#313944"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {job.candidates[index].status === "Selected" ? (
                              <Star
                                className="h-5 w-5"
                                color="#313944"
                                fill="#313944"
                                onClick={() => handleSelected(index)}
                              />
                            ) : (
                              <Star
                                className="h-5 w-5"
                                color="#313944"
                                onClick={() => handleSelected(index)}
                              />
                            )}
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

                <TabsContent value="selected">
                  <Tabs_Holder
                    TableHead_Data={head_selected}
                    card_Title={"Selected Candidates"}
                    card_Description={" Candidates selected for this role."}
                  >
                    {jobCandidates && jobCandidates.length > 0 ? (
                      jobCandidates
                        .map((candidate, index) => ({ candidate, index }))
                        .filter(
                          ({ candidate, index }) =>
                            job.candidates[index].status === "Selected"
                        )
                        .map(({ candidate, index }) => (
                          <TableRow>
                            <TableCell>
                              <div className="font-medium">
                                {candidate.name}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {candidate.email}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {candidate.gender === 1 ? "Male" : "Female"}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge className="text-xs" variant="outline">
                                {job.candidates[index].status ?? "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {job.candidates[index].appliedDate?.slice(
                                0,
                                10
                              ) ?? "Not Available"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Eye className="h-5 w-5" color="#313944" />
                            </TableCell>
                            <TableCell className="text-right">
                              {job.candidates[index].status === "Selected" ? (
                                <Star
                                  className="h-5 w-5"
                                  color="#313944"
                                  fill="#313944"
                                  onClick={() => handleSelected(index)}
                                />
                              ) : (
                                <Star
                                  className="h-5 w-5"
                                  color="#313944"
                                  onClick={() => handleSelected(index)}
                                />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <CalendarCheck
                                    className="h-5 w-5"
                                    color="#313944"
                                  />
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Schedule Interview
                                    </DialogTitle>
                                    <DialogDescription>
                                      Select Date and Time to Schedule an
                                      interview with the candidate.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="flex items-center  gap-4">
                                      <Label
                                        htmlFor="name"
                                        className="text-right"
                                      >
                                        Date
                                      </Label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-[244px] h-[56px] justify-start text-left font-normal",
                                              !dateTime.date &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateTime.date ? (
                                              format(dateTime.date, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={dateTime.date}
                                            onSelect={(newDate) =>
                                              setDateTime({
                                                ...dateTime,
                                                date: newDate,
                                              })
                                            }
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                    <div className="flex items-center  gap-4">
                                      <Label
                                        htmlFor="time"
                                        className="text-right"
                                      >
                                        Time
                                      </Label>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        {/* <DemoContainer
                                          components={["TimePicker"]}
                                        > */}
                                        <TimePicker
                                          onChange={onChange}
                                          value={value}
                                        />
                                        {/* </DemoContainer> */}
                                      </LocalizationProvider>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      type="submit"
                                      onClick={() => handleInterview(index)}
                                    >
                                      Send Email
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
            <div></div>
          </main>
        </div>
      </div>
    );
  }
}
