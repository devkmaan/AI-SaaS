const LandingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  // bg-[#111827] bg-gradient-to-tl from-blue-700 to-gray-600 
  
  return (
    <main className="h-full  overflow-auto bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900">
      <div className="mx-auto max-w-screen-xl h-full w-full">
        {children}
      </div>
    </main>
   );
}
 
export default LandingLayout;