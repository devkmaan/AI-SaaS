import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "./ui/mobile-sidebar"
import { getApiLimit } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription";

const Navbar = async() => {

  const apiLimitCount = await getApiLimit();
  const isPro = await checkSubscription();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/"/>
      </div>
    </div>
  )
}

export default Navbar