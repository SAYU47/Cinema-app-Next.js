import LoginForm from '@/components/LoginForm/LoginForm';

export default async function LoginPage() {
  return (
    <div className=" flex w-[100%] justify-center items-center h-dvh">
      <div className="flex flex-col  min-w-[700px] p-10 ">
        <LoginForm />
      </div>
    </div>
  );
}
