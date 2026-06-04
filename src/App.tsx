import './App.css'
import imgbg from '@/assets/imgbg.jpeg'
import { useState } from 'react'

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
                  <CardTitle className="text-2xl text-gray-900">Card Title</CardTitle>
                  <CardDescription className="text-gray-800">Card Description</CardDescription>
                </div>
                <CardAction>Card Action</CardAction>
              </div>
            </CardHeader>

            <CardContent className="grow flex flex-row w-full h-full p-4 gap-4 overflow-hidden">
              <div className={`flex flex-col h-full overflow-y-auto transition-all duration-500 ease-in-out pr-2 ${selectedSite ? 'w-[55%]' : 'w-full'
                }`}>
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
              <div className='right '></div>
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