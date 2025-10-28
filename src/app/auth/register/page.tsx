import RegisterForm from '@/components/RegisterForm/RegisterForm';

export default async function LoginPage() {
  return (
    <div className=" flex w-[100%] justify-center items-center h-dvh">
      <div className="flex flex-col  w-[700px] p-10 ">
        <RegisterForm />
      </div>
    </div>
  );
}
