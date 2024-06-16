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
export function CreateJob() {
  const { toast } = useToast();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [seats, setSeats] = useState();

  const [recruiterId, setRecruiterId] = useState("");
  const [currUser, setCurrUser] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const DataLoader = async () => {
      console.log("came in useEffect");
      const candidateId = window.sessionStorage.getItem("userId");
      setRecruiterId(candidateId);
      // console.log(userId);
      const role = window.sessionStorage.getItem("userRole");
      setUserRole(role);

      const requestData = {
        userId: recruiterId,
        role: role,
      };

      const apiUrl = `http://localhost:8080/users/userInfo/${candidateId}/${role}`;
      await axios
        .get(apiUrl, requestData)
        .then((response) => {
          // Handle successful response
          // console.log("User data:", response);
          setCurrUser(response.data);
        })
        .catch((error) => {
          // Handle error
          console.error("Error fetching user data:", error);
        });
      // console.log("user useeffect is", user);

      console.log("User role:", userRole);

      console.log("Hit");
    };

    DataLoader();
  }, []);

  const handleCreateJob = async () => {
    console.log(
      title,
      requirements,
      location,
      salary,
      description,
      seats,
      recruiterId
    );

    if (currUser.company === "") {
      toast({
        title: "Job can't be created, update your company name...",
      });
    } else {
      try {
        const response = await axios.post(`http://localhost:8080/jobs/`, {
          title,
          requirements,
          location,
          salaryRange: salary,
          description,
          seats,
          recruiterId,
        });
        toast({
          title: "Job created successfully",
        });
        // console.log("success", response.data.message);
      } catch (error) {
        console.error(
          "Failed to add interviewee:",
          error.response?.data?.error || error.message
        );
      }
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
     <Navbar index_={1} Role={"Recruiter"}/>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SideNavbar index_={1} Role={"Recruiter"}/>
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
