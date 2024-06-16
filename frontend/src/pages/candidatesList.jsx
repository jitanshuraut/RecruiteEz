import { useLocation } from "react-router-dom";
import { ChevronRight, Eye, Star, CalendarCheck } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useDataFetch from "@/hooks/useDataFetch";
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
// import TimePicker from 'react-time-picker';
import dayjs from "dayjs";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import Tabs_Holder from "@/components/ui/Tabs_Holder";

export function CandidatesList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId } = location.state || {};
  console.log(jobId);

  const job = useDataFetch(`http://localhost:8080/jobs/${jobId}`);
  console.log(job);

  const jobCandidates = useDataFetch(
    `http://localhost:8080/jobs/${jobId}/candidates`
  );
  console.log(jobCandidates);

  const handleSelected = async (index) => {
    try {
      if (jobCandidates[index].status == "Selected") {
        jobCandidates[index].status = "NotSelected";
        console.log("hit selected");
      } else {
        jobCandidates[index].status = "Selected";
        console.log("hit not selected");
      }
      const response = await axios.put(
        `http://localhost:8080/jobs/toggle-selected/${jobId}`,
        {
          index,
        }
      );
      console.log("hii");
      console.log(jobCandidates[index].status);

      console.log("Toggle Success:", response.data);
    } catch (error) {
      console.error("Error toggling selected:", error);
    }
  };

  const handleInterview = async (index) => {
    const userId = jobCandidates[index]._id;
    console.log("Interview:", index, userId);
    const formattedDateTime = `${format(dateTime.date, "dd/MM/yyyy")} ${
      dateTime.time.$H
    }:${dateTime.time.$m}`;
    console.log(formattedDateTime);

    try {
      const response = await axios.put(
        `http://localhost:8080/jobs/${jobId}/add-interviewee`,
        {
          userId: userId,
          index: index,
          interviewDate: formattedDateTime,
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

  const [dateTime, setDateTime] = React.useState({
    date: new Date(),
    time: "10:00",
  });

  const head_all = [
    {
      class_: false,
      name: "Candidates",
    },
    {
      class_: true,
      name: "Gender",
    },
    {
      class_: true,
      name: "Status",
    },
    {
      class_: true,
      name: "Date",
    },
    {
      class_: true,
      name: "Resume",
    },
    {
      class_: true,
      name: "Select",
    },
  ];

  const head_selected = [];
  head_selected.push(...head_all);
  head_selected.push({ class_: true, name: "Schedule Interview" });

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar index_={0} Role={"Recruiter"} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SideNavbar index_={0} Role={"Recruiter"} />
          <Nav_Top_Heading Title={`All Candidates - ${job.title}`} />
          <Profile_Button Role={"recruiter"} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* //table */}

          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all">All Candidates</TabsTrigger>
                  <TabsTrigger value="top">Top Candidates</TabsTrigger>
                  <TabsTrigger value="selected">
                    Selected Candidates
                  </TabsTrigger>
                </TabsList>

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => handleJobClick(job._id)}
                  >
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      View All
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
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
                          {candidate.gender === 1 ? "Male" : "Female"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="outline">
                            {job.candidates[index]?.status ?? "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {job.candidates[index].appliedDate?.slice(0, 10) ??
                            "Not Available"}
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
                  card_Description={"Candidates selected for this role."}
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
                              {job.candidates[index].status ?? "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {job.candidates[index].appliedDate?.slice(0, 10) ??
                              "Not Available"}
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
                                  <DialogTitle>Schedule Interview</DialogTitle>
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
                                      <DemoContainer
                                        components={["TimePicker"]}
                                      >
                                        <TimePicker
                                          label="Select a time"
                                          onChange={(newValue) =>
                                            setDateTime({
                                              ...dateTime,
                                              time: newValue,
                                            })
                                          }
                                        />
                                      </DemoContainer>
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
