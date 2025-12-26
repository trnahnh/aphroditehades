import { Button } from "@/components/ui/button"
import { LucideSearch, LucideSearchCode } from "lucide-react"

const LandingPage = () => {
  return (
    <>
      <div className="flex flex-col justify-center pt-20 items-center font-bold text-7xl">
        <Button variant={"outline"} className="group overflow-hidden rounded-2xl">
          <LucideSearch className="group-hover:hidden transition-opacity" />
          Check for deepfake
          <LucideSearchCode className="hidden group-hover:block mr-2 transition-all"/>
        </Button>
        <h1 className="mt-10">Detect Deepfake Content</h1>
        <h1 className="mt-5">with Precision</h1>
      </div>
    </>
  )
}

export default LandingPage