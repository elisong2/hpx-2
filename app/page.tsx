import Image from "next/image";
import LoginButton from "./components/LoginLogoutButton";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>
        Born from a lifelong love of cars and technology, HPX-2 is the
        PCPartPicker for car enthusiasts.
      </h1>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <LoginButton />
        {/* <SignInWithGoogleButton /> */}
      </main>
      <footer className=""></footer>
    </div>
  );
}
