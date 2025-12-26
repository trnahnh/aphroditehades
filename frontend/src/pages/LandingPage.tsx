import { Button } from "@/components/ui/button"
import { LucideSearch, LucideSearchCode } from "lucide-react"

const LandingPage = () => {
  return (
    <>
      <div className="flex flex-col justify-center pt-25 items-center">
        <Button variant={"outline"} className="group overflow-hidden rounded-2xl">
          <LucideSearch className="group-hover:hidden transition-opacity" />
          Check for deepfake
          <LucideSearchCode className="hidden group-hover:block mr-2 transition-all" />
        </Button>
        <div className="font-semibold text-7xl text-center mt-10">
          <h1 className="">Detect <span className="bg-linear-to-r from-purple-500 to-blue-100 bg-clip-text text-transparent">
            Deepfake
          </span> Content</h1>
          <h1 className="mt-10">with <span className="bg-linear-to-r from-blue-500 to-slate-100 bg-clip-text text-transparent">
            Precision
          </span></h1>
        </div>
        <div className="text-center mt-10">
          <p className="text-md">
            Upload any image, video or audio ✏️
            Get instant verification ⚡️.
          </p>
          <p className="mt-2">
            Let <span className="bg-linear-to-r from-blue-400 to-sky-100 bg-clip-text text-transparent">
              AI-powered analysis
            </span> catches what the eye can't 🚩.
          </p>
          <p className="mt-2">
            Completely <span className="bg-linear-to-r from-white to-amber-400 bg-clip-text text-transparent">
              for free ✨!
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default LandingPage