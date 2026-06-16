import './App.css'
import imgbg from '@/assets/imgbg.jpeg'
import logo from '@/assets/logo.png'
import githubLogo from '@/assets/2111432.png'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Toaster } from "sonner"
import * as z from "zod"
import { Copy, Eye, EyeOff } from "lucide-react"
import { v4 as uuidv4 } from "uuid";
const crypto = globalThis.crypto;
import { Analytics } from '@vercel/analytics/react';


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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Site = {
  id: string;
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


const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);

  // Helper to convert ArrayBuffer to Hex string
  function bufToHex(buffer: ArrayBuffer): string {
    return Array.prototype.map.call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2)).join('');
  }

  // Helper to convert Hex string to ArrayBuffer
  function hexToBuf(hex: string): ArrayBuffer {
    if (hex.length % 2 !== 0) return new ArrayBuffer(0);
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes.buffer;
  }

  // Derive a CryptoKey from a secret key using PBKDF2
  async function getCryptoKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt as unknown as BufferSource, 
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  // Encrypt plaintext and return 'iv_hex:ciphertext_hex'
  async function aesEncrypt(plaintext: string, key?: CryptoKey): Promise<string> {
    try {
      const activeKey = key || sessionKey;
      if (!activeKey) throw new Error("No session key available for encryption");
      const ec = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: 'AES-CBC',
          iv: iv as unknown as BufferSource,
        },
        activeKey,
        ec.encode(plaintext)
      );
      return `${bufToHex(iv.buffer)}:${bufToHex(ciphertext)}`;
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  // Decrypt 'iv_hex:ciphertext_hex' to plaintext
  async function aesDecrypt(encryptedStr: string, key?: CryptoKey): Promise<string> {
    try {
      const activeKey = key || sessionKey;
      if (!activeKey) return encryptedStr;
      if (!encryptedStr || !encryptedStr.includes(':')) {
        return encryptedStr;
      }
      const [ivHex, ciphertextHex] = encryptedStr.split(':');
      if (!ivHex || !ciphertextHex) return encryptedStr;

      const iv = new Uint8Array(hexToBuf(ivHex));
      const ciphertext = hexToBuf(ciphertextHex);

      const plaintext = await crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv: iv as unknown as BufferSource,
        },
        activeKey,
        ciphertext
      );
      const dec = new TextDecoder();
      return dec.decode(plaintext);
    } catch (error) {
      console.error("Decryption error:", error);
      return ""; 
    }
  }
  const getSiteName = (url: string) => {
    if (!url) return "New Site";
    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      const domain = new URL(formattedUrl).hostname;
      const namePart = domain.replace('www.', '').split('.')[0];
      return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    } catch (e) {
      return url.substring(0, 15) + "...";
    }
  };
  const getDomain = (url: string) => {
    if (!url) return null;
    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      return new URL(formattedUrl).hostname;
    } catch (e) {
      return null;
    }
  };
  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem("passman_sites");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Master Password UI States
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState("");
  const isSetup = localStorage.getItem("passman_password_check") === null;

  const handleUnlock = async () => {
    if (masterPasswordInput.trim().length === 0) {
      toast.error("Please enter a Master Password.");
      return;
    }
    
    try {
      if (isSetup) {
        // First time setup: Generate a random salt
        const saltArray = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = bufToHex(saltArray.buffer);
        localStorage.setItem("passman_salt", saltHex);

        const derivedKey = await getCryptoKey(masterPasswordInput, saltArray);
        const verifyString = await aesEncrypt("passman-verify", derivedKey);
        localStorage.setItem("passman_password_check", verifyString);
        setSessionKey(derivedKey);
        setIsUnlocked(true);
        setMasterPasswordInput("");
        toast.success("Master Password configured!");
      } else {
        // Login: Retrieve the stored salt
        const storedSaltHex = localStorage.getItem("passman_salt");
        if (!storedSaltHex) throw new Error("Salt missing");
        const saltArray = new Uint8Array(hexToBuf(storedSaltHex));

        const derivedKey = await getCryptoKey(masterPasswordInput, saltArray);
        const storedVerify = localStorage.getItem("passman_password_check");
        if (!storedVerify) throw new Error("Verification string missing");
        
        const decrypted = await aesDecrypt(storedVerify, derivedKey);
        if (decrypted === "passman-verify") {
          setSessionKey(derivedKey);
          setIsUnlocked(true);
          setMasterPasswordInput("");
          toast.success("Vault Unlocked!");
        } else {
          toast.error("Incorrect Master Password.");
        }
      }
    } catch (e) {
      toast.error("Incorrect Master Password.");
    }
  };


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data.url.trim() && !data.username.trim() && !data.password.trim()) {
      toast.error("Please fill in at least one field!");
      return;
    }

    let encryptedPassword = "";
    if (data.password) {
      try {
        encryptedPassword = await aesEncrypt(data.password);
      } catch (e) {
        toast.error("Critical Security Error: Failed to encrypt password. Save aborted.");
        return;
      }
    }

    const newSite = {
      id: selectedSite?.id || uuidv4(),
      url: data.url,
      username: data.username,
      password: encryptedPassword,
    };

    let updatedSites;
    if (sites.some(s => s.id === newSite.id)) {
      updatedSites = sites.map(s => s.id === newSite.id ? newSite : s);
    } else {
      updatedSites = [...sites, newSite];
    }

    setSites(updatedSites);
    localStorage.setItem("passman_sites", JSON.stringify(updatedSites));

    toast.success("Credentials saved!");
    setSelectedSite(null);
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
    const resetForm = async () => {
      if (selectedSite) {
        const decryptedPassword = selectedSite.password ? await aesDecrypt(selectedSite.password) : "";
        form.reset({
          url: selectedSite.url || "",
          username: selectedSite.username || "",
          password: decryptedPassword
        });
      }
    };
    resetForm();
  }, [selectedSite, form]);

  const CopyText = (text: string) => {
    toast.success("Text Copied Succesfully!!")
    navigator.clipboard.writeText(text);
  }

  const HandleDelete = () => {
    if (!selectedSite) return;
    const updatedSites = sites.filter(s => s.id !== selectedSite.id);
    setSites(updatedSites);
    localStorage.setItem("passman_sites", JSON.stringify(updatedSites));
    setSelectedSite(null);
    toast.success("Credentials deleted!");
  }

  return (
    <>
      <Toaster position="top-right" />
      <Analytics />

      {/* Lock Screen Dialog */}
      <Dialog open={!isUnlocked}>
        <DialogContent 
          onPointerDownOutside={(e) => e.preventDefault()} 
          onEscapeKeyDown={(e) => e.preventDefault()} 
          showCloseButton={false}
          className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl rounded-3xl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">
              {isSetup ? "Create Master Password" : "Vault Locked"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {isSetup 
                ? "Set a Master Password to encrypt your credentials. You will need this to unlock your vault." 
                : "Please enter your Master Password to decrypt and access your credentials."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4 pb-2">
            <Input 
              type="password" 
              placeholder="Enter Master Password" 
              value={masterPasswordInput}
              onChange={(e) => setMasterPasswordInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock() }}
              className="bg-white/60 border-gray-200 focus-visible:ring-gray-400/30 text-lg tracking-widest h-11 placeholder:text-sm placeholder:tracking-normal w-full"
            />
            <Button 
              onClick={handleUnlock} 
              className="w-full h-11 text-base bg-gray-900 text-white hover:bg-gray-800 shadow-md rounded-xl"
            >
              {isSetup ? "Setup Vault" : "Unlock Vault"}
              <lord-icon
                src="https://cdn.lordicon.com/jxwksmzg.json"
                trigger="hover"
                colors="primary:#1f3f4f"
                style={{ width: "22px", height: "22px", marginLeft: "4px" }}
              ></lord-icon>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative w-full h-screen overflow-hidden">
        <img src={imgbg} className='absolute inset-0 w-full h-full object-cover -z-10' alt="Background" />
        <img src={logo} className="absolute top-1.5 left-1 h-8 md:top-1 md:h-8 object-contain z-10 " alt="PassMan Logo" />
        <a href="https://github.com/SwarnabhG07/passman" target="_blank" rel="noreferrer" className="absolute top-1 right-3 z-10" title="View source on GitHub">
          <img src={githubLogo} alt="GitHub" className="h-10 md:h-11 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity drop-shadow-sm" />
        </a>

        <div className="flex items-center justify-center h-full transition-all duration-500 ease-in-out md:p-4 max-md:px-6 max-md:pt-12 max-md:pb-6">
          <Card className="w-full h-full md:w-[90%] md:h-[90%] flex flex-col justify-between bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-2 transition-all duration-500 max-md:rounded-3xl transform-gpu backface-hidden">

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-gray-900">All Keys</CardTitle>
                  <CardDescription className="text-gray-800">{sites.length}</CardDescription>
                </div>
                {/* <CardAction>Card Action</CardAction> */}
              </div>
            </CardHeader>

            <CardContent className="grow flex flex-col md:flex-row w-full h-full gap-3 overflow-y-auto md:overflow-hidden">

              <div className={`flex flex-col h-full overflow-y-auto transition-all duration-500 ease-in-out pr-2 w-full order-2 md:order-1 ${selectedSite ? 'md:w-[55%]' : ''}`}>
                <div className="flex justify-end mb-2 shrink-0 pr-1">
                  <Button onClick={() => setSelectedSite({ id: uuidv4(), url: '', username: '' })}
                    size="icon"
                    className="rounded-full bg-gray-900 h-8 w-26 text-sm gap-1 text-white hover:bg-gray-800 shadow-md pb-0"
                  >
                    Add Site
                    <lord-icon
                      src="https://cdn.lordicon.com/efxgwrkc.json"
                      trigger="hover"
                      colors="primary:#ffffff"
                      style={{ width: "20px", height: "20px" }}>
                    </lord-icon>
                  </Button>
                </div>

                {sites.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className="flex items-center gap-3 border border-gray-200 bg-white/40 p-4 rounded-xl mb-3 cursor-pointer hover:bg-white/70 transition-colors shadow-sm"
                  >

                    {/* 2. The Favicon Container */}
                    <div className="w-10 h-10 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden border border-gray-100">
                      {getDomain(site.url) ? (
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${getDomain(site.url)}&sz=128`}
                          alt="logo"
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <span className="text-lg">🌍</span>
                      )}
                    </div>

                    {/* 3. The Text Container */}

                    <div className="flex flex-col overflow-hidden">
                      <p className="font-bold text-gray-900 truncate">{getSiteName(site.url)}</p>
                      <p className="text-sm text-gray-700 truncate">{site.username}</p>
                    </div>

                  </div>
                ))}
              </div>

              {selectedSite && (
                <div className="detail-panel w-full md:w-[45%] shrink-0 h-fit bg-white/50 backdrop-blur-md rounded-xl p-3 md:p-4 relative flex flex-col shadow-inner border border-white/40 animate-in duration-300 md:overflow-y-auto order-1 md:order-2">

                  <button
                    onClick={() => setSelectedSite(null)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-900/5 hover:bg-gray-900/10 text-gray-600 transition-colors"
                  >
                    ✕
                  </button>



                  {/* Dynamic Header: Shows Logo and Clean Name */}
                  <div className="mt-1 flex flex-col items-center text-center mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center text-2xl mb-1 md:mb-2 shadow-sm border border-gray-100 overflow-hidden">

                      {getDomain(selectedSite.url) ? (
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${getDomain(selectedSite.url)}&sz=128`}
                          alt="logo"
                          className="w-6 h-6 md:w-8 md:h-8 object-contain"
                        />
                      ) : (
                        <span>🌍</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-full">
                      {selectedSite.url && <div className="w-8 shrink-0" />}
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2 text-center">
                        {getSiteName(selectedSite.url)}
                      </h2>
                      {selectedSite.url && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ml-1" asChild>
                          <a href={selectedSite.url.startsWith('http') ? selectedSite.url : `https://${selectedSite.url}`} target="_blank" rel="noreferrer">
                            <lord-icon
                              src="https://cdn.lordicon.com/zllgguxq.json"
                              trigger="hover"
                              colors="primary:#000000"
                              style={{ width: "20px", height: "20px" }}
                            ></lord-icon>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Form Area with Placeholders */}
                  <div className="flex flex-col gap-2 md:gap-3 w-full pb-1">

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Website URL
                      </label>

                      <div className="flex items-center gap-2">

                        <Input
                          {...form.register("url")}
                          placeholder="https://example.com"
                          className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm h-9 text-sm w-full"
                        />

                        <Button
                          onClick={() => CopyText(form.getValues("url"))}
                          type="button"
                          size="icon"
                          className="h-9 w-9 shrink-0 bg-black hover:bg-gray-800 shadow-sm rounded-md"
                        >
                          <Copy className="w-4 h-4 text-white" />
                        </Button>

                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Username
                      </label>

                      <div className="flex items-center gap-2">

                        <Input
                          {...form.register("username")}
                          placeholder="user@example.com"
                          className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm h-9 text-sm w-full"
                        />

                        <Button
                          onClick={() => CopyText(form.getValues("username"))}
                          type="button"
                          size="icon"
                          className="h-9 w-9 shrink-0 bg-black hover:bg-gray-800 shadow-sm rounded-md"
                        >
                          <Copy className="w-4 h-4 text-white" />
                        </Button>

                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider pl-1">
                        Password
                      </label>

                      <div className="flex items-center gap-2">

                        <div className="relative w-full">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...form.register("password")}
                            placeholder="Enter password"
                            className="bg-white/60 border-white/50 focus-visible:ring-gray-400/30 shadow-sm text-lg tracking-widest h-9 placeholder:text-sm placeholder:tracking-normal w-full pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>

                        <Button onClick={() => CopyText(form.getValues("password"))}
                          type="button"
                          size="icon"
                          className="h-9 w-9 shrink-0 bg-black hover:bg-gray-800 shadow-sm rounded-md"
                        >
                          <Copy className="w-4 h-4 text-white" />
                        </Button>

                      </div>
                    </div>

                    <div className="mt-auto pt-3 md:pt-6 flex justify-between items-center w-full">

                      <div>
                        {selectedSite.url !== '' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 bg-red-500/10 hover:bg-red-500/20 hover:text-red-700 flex gap-1 items-center max-md:h-9 max-md:w-9 max-md:p-0 max-md:justify-center"
                              >
                                <span className="hidden md:inline">Delete</span>
                                <lord-icon
                                  src="https://cdn.lordicon.com/xyfswyxf.json"
                                  trigger="hover"
                                  style={{ width: "20px", height: "20px" }}
                                ></lord-icon>
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl sm:max-w-106.25">
                              <DialogHeader>
                                <DialogTitle className="text-gray-900">Are you absolutely sure?</DialogTitle>
                                <DialogDescription className="text-gray-600 pt-2">
                                  This action cannot be undone. This will permanently delete your credentials for<p className="font-bold text-gray-900 truncate">Site - {getSiteName(selectedSite.url)}</p>
                                  <p className="font-bold text-sm text-gray-700 truncate">Username - {selectedSite.username}</p>
                                </DialogDescription>
                              </DialogHeader>

                              {/* Dialog Footer */}
                              <DialogFooter className="flex gap-2 sm:justify-end">
                                <DialogClose asChild>
                                  <Button
                                    variant="ghost"
                                    className="bg-gray-200 text-gray-600 hover:bg-gray-300"
                                  >
                                    Cancel<lord-icon
                                      src="https://cdn.lordicon.com/vgpkjbvw.json"
                                      trigger="hover"
                                      colors="primary:#000000"
                                      style={{ width: "20px", height: "20px" }}
                                    ></lord-icon>
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    onClick={HandleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-md"
                                  >
                                    Yes, delete it
                                    <lord-icon
                                      src="https://cdn.lordicon.com/xyfswyxf.json"
                                      trigger="hover"
                                      style={{ width: "20px", height: "20px" }}
                                    ></lord-icon>
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>

                      {/* Save & Cancel Buttons */}
                      <div className="flex gap-2 ">
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