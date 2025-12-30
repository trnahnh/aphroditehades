import { Button } from "@/components/ui/button";
import { ArrowRightIcon, LucideSearch, LucideSearchCode } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col justify-center pt-25 items-center">
        <Button
          variant="outline"
          className="group overflow-hidden rounded-2xl"
        >
          <LucideSearch className="group-hover:hidden transition-opacity" />
          Check for deepfake
          <LucideSearchCode className="hidden group-hover:block mr-2 transition-all" />
        </Button>
        <div className="font-bold text-7xl text-center mt-10">
          <h1>
            Detect{" "}
            <span className="bg-linear-to-r from-purple-500 to-blue-100 bg-clip-text text-transparent hover:drop-shadow-[0_0_3px_rgba(60,130,240,0.8)]">
              Deepfake
            </span>{" "}
            Content
          </h1>
          <h1 className="mt-10">
            with{" "}
            <span className="bg-linear-to-r from-blue-500 to-slate-100 bg-clip-text text-transparent hover:drop-shadow-[0_0_3px_rgba(60,130,240,0.8)]">
              Precision
            </span>
          </h1>
        </div>
        <div className="text-center mt-10">
          <p className="text-md">
            Upload any image, video or audio. Get instant verification.
          </p>
          <p className="mt-2">
            Let{" "}
            <span className="bg-linear-to-r from-blue-500 to-white bg-clip-text text-transparent">
              <b>AI-powered analysis</b>
            </span>{" "}
            catch what the eye can't.
          </p>
          <p className="mt-2">
            Completely{" "}
            <span className="bg-linear-to-r from-white to-amber-400 bg-clip-text text-transparent">
              <b>free</b>
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button asChild>
            <Link to="/dashboard" className="flex items-center">
              Get Started
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative pt-20 pb-20 md:py-32 px-4 w-full max-w-5xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/3 bg-linear-to-r from-purple-500/20 to-blue-500/20 blur-[5rem]" />
        <div className="relative rounded-xl p-2 ring-1 ring-inset ring-foreground/20 bg-opacity-50 backdrop-blur-3xl">
          <img
            src="/assets/dashboard-dark.svg"
            alt="Dashboard"
            className="w-full rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
          />
          <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-linear-to-t from-background z-40" />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
