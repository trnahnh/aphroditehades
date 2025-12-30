import { Button } from "@/components/ui/button";
import { LucideSearch, LucideSearchCode } from "lucide-react";

const LandingPage = () => {
  return (
    <>
      {/* ------------------------------------Landing text------------------------------------ */}
      <div className="flex flex-col justify-center pt-25 items-center">
        <Button
          variant={"outline"}
          className="group overflow-hidden rounded-2xl"
        >
          <LucideSearch className="group-hover:hidden transition-opacity" />
          Check for deepfake
          <LucideSearchCode className="hidden group-hover:block mr-2 transition-all" />
        </Button>
        <div className="font-bold text-7xl text-center mt-10">
          <h1 className="">
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
            Upload any image, video or audio ✏️ Get instant verification ⚡️.
          </p>
          <p className="mt-2">
            Let{" "}
            <span className="bg-linear-to-r from-blue-500 to-white bg-clip-text text-transparent">
              <b>AI-powered analysis</b>
            </span>{" "}
            catches what the eye can't 🚩.
          </p>
          <p className="mt-2">
            Completely{" "}
            <span className="bg-linear-to-r from-white to-amber-400 bg-clip-text text-transparent">
              <b>for free</b> ✨!
            </span>
          </p>
        </div>
      </div>
      {/* ------------------------------------Landing text------------------------------------ */}
    </>
  );
};

export default LandingPage;
