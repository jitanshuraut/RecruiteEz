import React from "react";

import { CircleUser } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { ViewResume } from "../viewResume";
import Navbar from "@/components/ui/Navbar";
import SideNavbar from "@/components/ui/SideNavbar";
import Profile_Button from "@/components/ui/Profile_Button";
import Nav_Top_Heading from "@/components/ui/Nav_Top_Heading";
import { Get_Profile } from "@/api/Candidate_Apis";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";

const ShowCandidateProfile = () => {
  const [userId, setUserId] = useState(window.sessionStorage.getItem("userId"));
  const [currUser, setCurrUser] = useState([]);
  const [userRole, setUserRole] = useState(
    window.sessionStorage.getItem("userRole")
  );

  const requestData = {
    userId: userId,
    role: userRole,
  };

  const { data, status, isFetching } = useQuery({
    queryKey: ["User:Profile_show_can", userId, userRole, requestData],
    queryFn: Get_Profile,
    staleTime: 2 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (status === "success" && data) {
      setCurrUser(data);
    }
  }, [status, data]);

  if (isFetching) {
    return (
      <>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <Navbar index_={0} Role={"candidate"} />
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
        <Navbar index_={0} Role={"candidate"} />

        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SideNavbar index_={0} Role={"candidate"} />
            <Nav_Top_Heading Title={"Candidate Profile"} />
            <Profile_Button Role={"candidate"} />
          </header>

          <main>
            <div className="w-full h-screen lg:grid lg:grid-cols-3">
              <div className="lg:col-span-1 bg-gray-200">
                <div className="flex items-start">
                  <div className="flex gap-1 p-2 lg:gap-1 lg:p-2 h-4/5">
                    <div className="flex justify-center">
                      <Card className="w-full">
                        <CardContent className="grid gap-6 p-4">
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-10 h-10 relative rounded-full overflow-hidden">
                              <Avatar>
                                <AvatarImage alt="@shadcn" />
                                <AvatarFallback>
                                  <CircleUser className="h-10 w-10" />
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>

                          <div className="grid gap-3 text-md px-1 mx-1 py-2 my-2 font-medium">
                            <div className="my-2">
                              Name:
                              <span className="text-gray-600 mx-4">
                                {currUser.name}
                              </span>
                            </div>

                            <div className="">
                              Email:
                              <span className="text-gray-600 mx-4">
                                {currUser.email}
                              </span>
                            </div>

                            <div className="">
                              Gender:
                              <span className="text-gray-600 mx-4">
                                {currUser.gender === 0
                                  ? "Male"
                                  : currUser.gender === 1
                                  ? "Female"
                                  : "Other"}
                              </span>
                            </div>

                            <div className="">
                              Favourite Sport:
                              <span className="text-gray-600 mx-2">
                                {currUser.answer}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 w-full h-screen object-cover">
                <ViewResume UserId={userId} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
};

export default ShowCandidateProfile;
