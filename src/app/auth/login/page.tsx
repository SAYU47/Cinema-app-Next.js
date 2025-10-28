import LoginForm from '@/components/LoginForm/LoginForm';

export default async function LoginPage() {
  return (
    <div className=" flex w-[100%] justify-center items-center">
      <div className="flex flex-col  w-[800px] ">
        <LoginForm />
      </div>
    </div>
  );
}
