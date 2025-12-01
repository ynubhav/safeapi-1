import SignUpForm from "@/components/signup/authcomponent";
import SideComponent from "@/components/signup/side-component";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen min-h-screen bg-[#181A1D] flex justify-center items-center gap-10">
      <Link href={'/'} className="flex absolute top-0 left-0 justify-start items-center">
        <img
          className="h-20 items-start"
          src="veloxlogo.svg"
          alt="velox logo"
        />
        <h1 className="font-bold text-slate-300 italic text-left text-4xl py-2 z-10">
          Velox
        </h1>
      </Link>
      <SideComponent />
      <SignUpForm />
    </div>
  );
}
