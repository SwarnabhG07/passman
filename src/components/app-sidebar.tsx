import * as React from "react"
import { 
  Key, 
  Globe, 
  CreditCard, 
  FileText, 
  User, 
  Shuffle, 
  ShieldCheck, 
  Settings, 
  Trash2, 
  Lock, 
  Search,
  LogOut,
  ChevronUp,
  UserCheck
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

// Define the menu items and categories
export type Category = 
  | "all" 
  | "logins" 
  | "cards" 
  | "notes" 
  | "identities" 
  | "generator" 
  | "security" 
  | "settings" 
  | "trash";

interface AppSidebarProps {
  currentCategory: Category;
  setCurrentCategory: (category: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function AppSidebar({ 
  currentCategory, 
  setCurrentCategory,
  searchQuery,
  setSearchQuery
}: AppSidebarProps) {
  const { state } = useSidebar();

  const vaultItems = [
    { id: "all" as Category, label: "All Items", icon: Key },
    { id: "logins" as Category, label: "Logins", icon: Globe },
    { id: "cards" as Category, label: "Credit Cards", icon: CreditCard },
    { id: "notes" as Category, label: "Secure Notes", icon: FileText },
    { id: "identities" as Category, label: "Identities", icon: User },
  ];

  const toolItems = [
    { id: "generator" as Category, label: "Password Generator", icon: Shuffle },
    { id: "security" as Category, label: "Security Check", icon: ShieldCheck },
  ];

  const manageItems = [
    { id: "settings" as Category, label: "Settings", icon: Settings },
    { id: "trash" as Category, label: "Trash", icon: Trash2 },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar/50 backdrop-blur-md">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-sidebar-border/50 py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-105">
            <Lock className="h-5 w-5" />
          </div>
          {state !== "collapsed" && (
            <div className="flex flex-col">
              <span className="font-semibold leading-none text-foreground tracking-wide">PassMan</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">Secure Vault</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-4">
        {/* Quick Search */}
        {state !== "collapsed" && (
          <div className="px-2 mb-4 relative">
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <SidebarInput 
              placeholder="Search vault..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/60 border-sidebar-border focus:border-primary/50 transition-colors"
            />
          </div>
        )}

        {/* Vault Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-3 uppercase tracking-wider">Vault</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {vaultItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={currentCategory === item.id}
                    onClick={() => setCurrentCategory(item.id)}
                    tooltip={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      currentCategory === item.id 
                        ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/10" 
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Section */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-3 uppercase tracking-wider">Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={currentCategory === item.id}
                    onClick={() => setCurrentCategory(item.id)}
                    tooltip={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      currentCategory === item.id 
                        ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/10" 
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 px-3 uppercase tracking-wider">Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={currentCategory === item.id}
                    onClick={() => setCurrentCategory(item.id)}
                    tooltip={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      currentCategory === item.id 
                        ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/10" 
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold shadow-inner">
              SG
            </div>
            {state !== "collapsed" && (
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground leading-tight">Swarnabh G.</span>
                <span className="text-[10px] text-muted-foreground">Pro Member</span>
              </div>
            )}
          </div>
          {state !== "collapsed" && (
            <button 
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
