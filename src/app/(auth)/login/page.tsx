import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 justify-center md:min-h-screen">
      <div className="text-4xl font-bold text-white text-center bg-gradient-to-b from-[#2CA6E0] to-[#00809C] md:min-h-screen">
        <Image
          src="/welcome.svg"
          alt="Welcome"
          width={0}
          height={0}
          priority={true}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="md:max-h-full max-h-60 pb-4"
        />
        <div className="text-2xl md:block hidden">
          <strong>WELCOME TO</strong>
          <br />
          MODERN CONNECT
        </div>
      </div>
      <div className="text-lg text-center place-items-center md:pt-12 pt-4 min-h-screen">
        <Image src="/logo.svg" alt="Modern Connect" width={195} height={70} className="md:w-[195px] w-[140px] m-4" />
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
