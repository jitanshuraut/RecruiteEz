import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-12 md:py-26 gap-8">
      <div className="text-center lg:text-start space-y-6 ">
        <main className="text-5xl md:text-6xl font-bold  ">
          <h1 className="inline text-bgCol">
            Streamline Your{" "}
            <span className=" text-azure-radiance-500  bg-clip-text">
              Recruitment
            </span>{" "}
            Process
          </h1>{" "}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Manage job postings, track applications, and connect with top
          candidates all in one place. Simplify your hiring workflow and find
          the best talent faster.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4 ">
          <Link to="/login">
            <Button className="w-full md:w-1/3 text-lochmara-500 bg-bgCol ">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <img src="/images/bg.png" className="w-[98%]" alt="" />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
