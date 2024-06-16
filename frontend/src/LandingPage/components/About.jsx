import { Statistics } from "./Statistics";


export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src="/images/bg-2.png"
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Company
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Welcome to Recureiing Platform, where job seekers and recruiters
                connect effortlessly. Our advanced ATS system streamlines the
                hiring process, ensuring efficient and effective recruitment.
                Whether you're seeking your dream job or the perfect candidate,
                our platform offers comprehensive tools and resources tailored
                to your needs. Join us to experience a seamless, innovative, and
                user-friendly approach to employment and recruitment. Your
                career journey starts here
              </p>
            </div>
            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
