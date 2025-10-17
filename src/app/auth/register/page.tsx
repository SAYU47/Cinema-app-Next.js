import RegisterForm from "@/components/RegisterForm/RegisterForm";

export default async function LoginPage() {
  return (
    <div className=" flex w-[100%] justify-center items-center">
      <div className="flex flex-col  w-[800px] ">
        <RegisterForm />
      </div>
    </div>
  );
}