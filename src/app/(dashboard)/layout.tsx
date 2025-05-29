import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../modules/dashboard/ui/components/dashboard-sidebar"
import DashBoardNavBar from "../modules/dashboard/ui/components/dashboard-navbar"
interface Props {
    children:React.ReactNode
}
const layout = ({children} : Props) => {
  return (
    <SidebarProvider>
        <DashboardSidebar/>
        <main className="flex flex-col h-screen w-screen bg-muted">
          <DashBoardNavBar/>
        {children}
        </main>
    </SidebarProvider>
  )
}

export default layout