import './App.css'
import imgbg from '@/assets/imgbg.jpeg'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Site = {
  id: number;
  name: string;
  username: string;
};

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  const [sites, setsites] = useState([
    { id: 1, name: 'Airtable', username: 'ryan@example.com' },
    { id: 2, name: 'Airbnb', username: 'ryan@example.com' }
  ]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <img src={imgbg} className='absolute inset-0 w-full h-full object-cover -z-10' alt="Background" />

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

              <div className={`flex flex-col h-full overflow-y-auto transition-all duration-500 ease-in-out pr-2 ${selectedSite ? 'w-[55%]' : 'w-full'

                }`}>
                <div className="flex justify-end mb-2 shrink-0 pr-1">
                  <Button
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
                    <p className="font-bold text-gray-900">{site.name}</p>
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

                  <div className="mt-1 flex flex-col items-center text-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-2 shadow-sm border border-gray-100">
                      🌍
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedSite.name}
                    </h2>
                  </div>

                  {/* Form Area - Tighter Gaps and Inputs */}
                  <div className="flex flex-col gap-3 w-full pb-1">

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Website URL
                      </label>
                      <Input
                        defaultValue={`https://${selectedSite.name.toLowerCase()}.com`}
                        className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Username
                      </label>
                      <Input
                        defaultValue={selectedSite.username}
                        className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm h-9 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Password
                      </label>
                      <Input
                        type="password"
                        defaultValue="hiddenpassword123"
                        className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm text-lg tracking-widest h-9"
                      />
                    </div>

                    {/* Action Buttons - Swapped to size="sm" */}
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSite(null)}
                        className="text-gray-600 hover:bg-gray-900/5"
                      >
                        Cancel
                      </Button>
                      <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800 shadow-md">
                        Save
                      </Button>
                    </div>

                  </div>
                </div>
              )}
            </CardContent>

            {/* <CardFooter className="border-t border-white/40 pt-4">
              <p className="text-sm text-gray-800">Card Footer</p>
            </CardFooter> */}

          </Card>
        </div>
      </div>
    </>
  )
}

export default App