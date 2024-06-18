import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { Get_All_Post } from "@/api/Jobs_Api";

const SearchJobs = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  const { data, status, isFetching } = useQuery({
    queryKey: ["jobs:AllTheJobs", window.sessionStorage.getItem("userId")],
    queryFn: Get_All_Post,
  });

  useEffect(() => {
    if (status === "success" && data) {
      const activeJobs = data.filter((job) => job.active);
      setFilteredJobs(activeJobs);
    }
  }, [data, status]);

  useEffect(() => {
    const filterJobs = async () => {
      let filtered = data ? data.filter((job) => job.active) : [];

      if (role) {
        filtered = filtered.filter((job) =>
          job.title.toLowerCase().includes(role.toLowerCase())
        );
      }

      if (company) {
        filtered = filtered.filter((job) =>
          job.company.toLowerCase().includes(company.toLowerCase())
        );
      }
      setFilteredJobs(filtered);
    };

    filterJobs();
  }, [role, company, data]);

  const handleApplyFilter = () => {
    setOpen(false);
  };

  const handleNavigation = (id) => {
    navigate("/job-description", { state: { jobId: id } });
  };

  if (isFetching) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Navbar index_={1} Role={"candidate"} />
        <div className="flex justify-center items-center h-[100vh] w-full">
          <BounceLoader color="#37383a" loading size={100} />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="grid min-h-screen w-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar index_={1} Role={"candidate"} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SideNavbar index_={1} Role={"candidate"} />
          <Nav_Top_Heading Title={"Search Jobs"} />
          <Profile_Button Role={"candidate"} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <main className="grid flex-1 items-start ">
            <Card>
              <div className="p-4 flex justify-between">
                <div className="text-xl font-medium">Active Jobs</div>
                <div>
                  <Dialog
                    open={open}
                    onOpenChange={setOpen}
                    className="bg-slate-900"
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-gray-800">
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label htmlFor="role">Search By Role</Label>
                          </div>
                          <Input
                            id="role"
                            type="text"
                            required
                            placeholder="Search"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label htmlFor="company">Search By Company</Label>
                          </div>
                          <Input
                            id="company"
                            type="text"
                            required
                            placeholder="Search"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleApplyFilter}>Apply</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Location
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created at
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <TableRow key={job._id}>
                          <TableCell className="font-medium">
                            {job.title}
                          </TableCell>
                          <TableCell className="font-medium">
                            {job.company}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {job.location}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {job.createdAt}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleNavigation(job._id)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5}>No Jobs found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </main>
      </div>
    </div>
  );
};

export default SearchJobs;
