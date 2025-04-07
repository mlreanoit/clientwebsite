const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex justify-center items-center my-[50px] py-[50px]bg-gray-100">
      {children}
    </main>
  );
};

export default AuthLayout;
