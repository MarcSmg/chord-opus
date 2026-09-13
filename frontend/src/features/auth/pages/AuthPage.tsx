import { SlidingTabs } from "@/shared/ui/SlidingTabs";
import type { BrowserTab } from "@/shared/ui/BrowserTabs";
import { AuthShell } from "../components/AuthShell";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import Heading from "../../../shared/ui/Heading";
import { useNavigate } from "react-router-dom";


const AUTH_TABS: BrowserTab[] = [
  { id: 'login', label: 'Login' },
  { id: 'signup', label: 'Create Account' }
];

type AuthPageProps = {
  initialMode: "login" | "signup";
}

export const AuthPage = ({initialMode}: AuthPageProps) => {

  const navigate = useNavigate();

  // const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = (id: string) => {
    navigate(`/${id}`, { replace: true })
  }

  return (
    <div className=" relative flex justify-center items-center min-h-screen w-full bg-linear-to-t from-primary from-80% to-accent-bold md:bg-linear-to-t md:from-white md:to-white md:h-auto md:px-[15%] lg:px-[20%]">
      <Heading className=" absolute top-30 w-full text-white text-center md:hidden" >ChordOpus</Heading>
      <div
        className="fixed w-full -mb-1 bg-ui-card bottom-0 left-0 right-0 min-h-[60vh] border border-stroke-subtle rounded-t-3xl shadow-detail-md overflow-hidden md:relative md:h-fit"
      >
        <div
          className="flex flex-col justify-center p-8 h-full"
        >
          
          <SlidingTabs
            tabs={AUTH_TABS}
            activeTabId={initialMode}
            onActiveTabChange={handleTabChange}
            className="w-full md:w-150"
          />

          <AuthShell activeKey={initialMode}>
            {initialMode === 'login' ? <LoginForm /> : <SignupForm />}
          </AuthShell>        
        </div>
      </div>
    </div>
  )
}
