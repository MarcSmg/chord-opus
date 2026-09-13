import { NavItem } from "../../../shared/ui/NavItem";
import type { MenuItem } from "../../../shared/types/navigation";
import { motion } from "motion/react";
import { SidebarExpand, SidebarCollapse } from "iconoir-react";
import { useSidebar } from "@/context/SidebarContext";

const Sidebar = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const {isSidebarExtended: isExtended, setSidebarExtended: setIsExtended} = useSidebar();

  const toggleMenu = () => {
    setIsExtended((prev) => !prev);
  }

  return (
    <aside
      className={"hidden sticky top-0 p-3 m-0 overflow-y-auto md:block no-scrollbar shrink-0"}
      style={{ width: "fit-content" }}
    >
      <motion.nav
        animate={{ width: isExtended ? 250 :"auto" }}
        initial={{ width: "auto" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative h-full py-5 border border-stroke-subtle rounded-2xl overflow-hidden flex flex-col"
        style={{
          boxShadow: "rgba(0, 1, 0, 0.1) 0px 8px 24px"
        }}
      >
        <div className="flex justify-end px-2 mb-10 mt-2">
          <div
            className="size-11 rounded-xl cursor-pointer flex items-center justify-center //hover:bg-accent-soft/40 transition-colors duration-200"
            onClick={toggleMenu}
          >
            {isExtended ? <SidebarCollapse className="text-content-muted" width={18} height={18} strokeWidth={2} /> : <SidebarExpand className="text-content-muted" width={18} height={18} strokeWidth={2} />}
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2 w-full">
          {menuItems.map((item) => (
            <NavItem
              key={item.to}
              {...item} 
            />
          ))}
        </div>
      </motion.nav>
    </aside>
  )
}

export default Sidebar