import './App.css'
import imgbg from '@/assets/imgbg.jpeg'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"


import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Site = {
  id: number;
  url: string;
  username: string;
  password?: string;
};

const formSchema = z.object({
  username: z
    .string()
  ,
  url: z
    .string()
  ,
  password: z.string(),
})

function App() {
  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem("passman_sites");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  // const [form, setform] = useState({ site: "", })

  // 4. The actual save logic
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const newSite = {
      id: selectedSite?.id || Date.now(),
      ...data
    };

    let updatedSites;
    // Check if we are updating an existing site or adding a new one
    if (sites.some(s => s.id === newSite.id)) {
      updatedSites = sites.map(s => s.id === newSite.id ? newSite : s);
    } else {
      updatedSites = [...sites, newSite];
    }

    setSites(updatedSites);
    localStorage.setItem("passman_sites", JSON.stringify(updatedSites));

    toast.success("Credentials saved!");
    setSelectedSite(null); // Close the right panel
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      username: "",
      password: ""
    },
  });
  React.useEffect(() => {
    if (selectedSite) {
      form.reset({
        url: selectedSite.url || "",
        username: selectedSite.username || "",
        password: selectedSite.password || ""
      });
    }
  }, [selectedSite, form]);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <img src={imgbg} className='absolute inset-0 w-full h-full object-cover -z-10' alt="Background" />
        <p className="absolute top-1 left-4 text-2xl font-bold tracking-widest text-black z-10">
          PassMan.
        </p>

        <div className="flex items-center justify-center h-full p-4">
          <Card className="w-[90%] h-[90%] flex flex-col justify-between bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-2">

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-gray-900">All Keys</CardTitle>
                  <CardDescription className="text-gray-800">128</CardDescription>
                </div>
                <CardAction>Card Action</CardAction>
              </div>
            </CardHeader>

            <CardContent className="grow flex flex-row w-full h-full gap-3 overflow-hidden">

              <div className={`flex flex-col h-full overflow-y-auto transition-all duration-500 ease-in-out pr-2 ${selectedSite ? 'w-[55%]' : 'w-full'}`}>
                <div className="flex justify-end mb-2 shrink-0 pr-1">
                  <Button onClick={() => setSelectedSite({ id: Date.now(), url: '', username: '' })}
                    size="icon"
                    className="rounded-full bg-gray-900 text-white hover:bg-gray-800 shadow-sm h-8 w-8 text-lg font-light pb-0.5"
                  >
                    +
                  </Button>
                </div>

                {sites.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className="border border-gray-200 bg-white/40 p-4 rounded-xl mb-3 cursor-pointer hover:bg-white/70 transition-colors shadow-sm"
                  >
                    <p className="font-bold text-gray-900">{site.url}</p>
                    <p className="text-sm text-gray-700">{site.username}</p>
                  </div>
                ))}
              </div>

              {selectedSite && (
                <div className="w-[45%] h-fit bg-white/50 backdrop-blur-md rounded-xl p-4 relative flex flex-col shadow-inner border border-white/40 animate-in slide-in-from-right-4 duration-300 overflow-y-auto hide-scrollbar">

                  <button
                    onClick={() => setSelectedSite(null)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/5 hover:bg-gray-900/10 text-gray-600 transition-colors"
                  >
                    ✕
                  </button>

                  {/* Dynamic Header: Shourl, or "New Site" if blank */}
                  <div className="mt-1 flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-2 shadow-sm border border-gray-100">
                      🌍
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedSite.url || "New Site"}
                    </h2>
                  </div>

                  {/* Form Area with Placeholders */}
                  <div className="flex flex-col gap-3 w-full pb-1">

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Website URL
                      </label>
                      <Input
                        {...form.register("url")}
                        placeholder="https://example.com"
                        className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Username
                      </label>
                      <Input
                        {...form.register("username")}
                        placeholder="user@example.com"
                        className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Password
                      </label>
                      <Input
                        type="password"
                        {...form.register("password")}
                        placeholder="Enter a secure password"
                        className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm text-lg tracking-widest h-9 placeholder:text-sm placeholder:tracking-normal"
                      />
                    </div>

                    {/* Fixed Action Buttons Container */}
                    <div className="mt-auto pt-6 flex justify-between items-center w-full">

                      {/* Only show the Delete button if this is an existing site (has a name) */}
                      <div>
                        {selectedSite.url !== '' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 bg-red-500/10 hover:bg-red-500/20 hover:text-red-700 flex gap-2 items-center"
                              >
                                Delete
                                <lord-icon
                                  src="https://cdn.lordicon.com/xyfswyxf.json"
                                  trigger="hover"
                                  style={{ width: "20px", height: "20px" }}
                                ></lord-icon>
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900">Are you absolutely sure?</DialogTitle>
                                <DialogDescription className="text-gray-600 pt-2">
                                  This action cannot be undone. This will permanently delete your credentials for <span className="font-bold text-gray-900">{selectedSite.url}</span>.
                                </DialogDescription>
                              </DialogHeader>

                              {/* Dialog Footer */}
                              <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                                <DialogClose asChild>
                                  <Button
                                    variant="ghost"
                                    className="bg-gray-200 text-gray-600 hover:bg-gray-300"
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    onClick={() => {
                                      setSelectedSite(null);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                                  >
                                    Yes, delete it
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>

                      {/* Save & Cancel Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSite(null)}
                          className="bg-gray-200 text-gray-600 hover:bg-gray-300"
                        >
                          Cancel
                          <lord-icon
                            src="https://cdn.lordicon.com/vgpkjbvw.json"
                            trigger="hover"
                            colors="primary:#000000"
                            style={{ width: "20px", height: "20px" }}
                          ></lord-icon>
                        </Button>
                        <Button
                          onClick={form.handleSubmit(onSubmit)}
                          size="sm"
                          className="bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                        >
                          Save
                          <lord-icon
                            src="https://cdn.lordicon.com/zdfcfvwu.json"
                            trigger="hover"
                            colors="primary:#ffffff"
                            style={{ width: "20px", height: "20px" }}
                          ></lord-icon>
                        </Button>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </CardContent>

          </Card>
        </div>
      </div>
    </>
  )
}

export default App