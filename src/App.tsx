import './App.css'
import imgbg from '@/assets/imgbg.jpeg'
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

            <CardContent className="grow flex items-center">
              <p className="text-gray-900 font-medium">Card Content goes here...</p>
            </CardContent>

            <CardFooter className="border-t border-white/40 pt-4">
              <p className="text-sm text-gray-800">Card Footer</p>
            </CardFooter>

          </Card>
        </div>
      </div>
    </>
  )
}

export default App