import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import { Get_Profile } from "@/api/Candidate_Apis";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Create_Jobs } from "@/api/Jobs_Api";

export function CreateJob() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [seats, setSeats] = useState("");
  const [userId, setUserId] = useState(window.sessionStorage.getItem("userId"));
  const [currUser, setCurrUser] = useState({});
  const [userRole, setUserRole] = useState(
    window.sessionStorage.getItem("userRole")
  );

  const requestData = {
    userId: userId,
    role: userRole,
  };

  const newJob = {
    title,
    requirements,
    location,
    salary,
    description,
    seats,
    recruiterId: userId,
  };

  const mutation = useMutation({
    mutationFn: () => Create_Jobs(newJob),
    onSuccess: (data) => {
      console.log("Success", data);
      toast({
        title: "Job created successfully",
      });
      queryClient.invalidateQueries(["recruiter:jobs_dashborad", userId]); // Update cache
    },
    onError: (error) => {
      console.log("Error", error);
      toast({
        title: error.response?.data?.error || error.message,
      });
    },
  });

  const { data, status, isFetching } = useQuery({
    queryKey: ["User:Profile", userId, userRole, requestData],
    queryFn: Get_Profile,
  });

  useEffect(() => {
    if (status === "success" && data) {
      setCurrUser(data);
    }
  }, [status, data]);

  const handleCreateJob = () => {
    if (!currUser.company) {
      toast({
        title: "Job can't be created, update your company name...",
      });
    } else {
      mutation.mutate();
    }
  };

  if (isFetching) {
    return (
      <>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Navbar index_={1} Role={"candidate"} />
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
        <Navbar index_={1} Role={"Recruiter"} />
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={1} Role={"Recruiter"} />
            <Nav_Top_Heading Title={"Create a New Job"} />
            <Profile_Button Role={"recruiter"} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {/* //form */}

            <Card x-chunk="dashboard-07-chunk-0">
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>add the details about the job</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Title</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full text-black"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Desciption</Label>
                    <Textarea
                      id="description"
                      className="min-h-32"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Location</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Requirements</Label>
                    <Textarea
                      id="description"
                      className="min-h-32"
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Salary-Range</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Vacancy</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      onChange={(e) => setSeats(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="w-10">
              <Button
                type="submit"
                className="flex items center"
                onClick={() => {
                  handleCreateJob();
                }}
              >
                Create Job
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
