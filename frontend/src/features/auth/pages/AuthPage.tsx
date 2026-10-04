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

export const AuthPage = ({ initialMode }: AuthPageProps) => {

  const navigate = useNavigate();

  // const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = (id: string) => {
    navigate(`/${id}`, { replace: true })
  }

  return (
    <div className=" relative flex justify-center items-center min-h-screen w-full bg-primary md:bg-ui-bg md:h-auto md:px-4">
      <div
        className="fixed w-full -mb-1 bg-ui-card bottom-0 left-0 right-0 min-h-[60vh] border border-stroke-subtle rounded-t-4xl shadow-detail-md overflow-hidden md:relative md:h-fit md:w-full md:rounded-4xl md:max-w-6xl"
      >
        <div
          className="relative flex flex-col items-center gap-5 p-8 pt-10 h-full"
        >
          <SlidingTabs
            tabs={AUTH_TABS}
            activeTabId={initialMode}
            onActiveTabChange={handleTabChange}
            className="w-full md:absolute md:top-8 md:left-1/2 md:w-150 transition-all"
          />
          <AuthShell activeKey={initialMode}>
            {initialMode === 'login' ? <LoginForm /> : <SignupForm />}
          </AuthShell>
        </div>
      </div>
    </div>
  )
}
