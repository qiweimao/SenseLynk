import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { useForm } from "react-hook-form"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Settings = () => {

  const [SystemSettings, setSystemSettings] = useState([]);
  const location = useLocation(); // Use useLocation hook to access location object
  const queryParams = new URLSearchParams(location.search);
  const device = queryParams.get('device') || 'gateway'; // Default to 'gateway' if no device parameter is provided

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/system-configuration?device=${device}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setSystemSettings(data);
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 100000);
    return () => clearInterval(intervalId);
  }, [device]); // Include device in dependency array to fetch data when device changes


  // How to differentiate between scenario 1 and 2 ?

  // Scenario 1
  // If you are accessing this page remotely, this logger is already connected to WiFi.
  // DO NOT change the credentials

  // Scenario 2
  // If you are with the logger, feel free to update the credentials
  // If WiFi connection fails, this logger with fallback to AP mode for you access.

  const form_wifi = useForm(
    {
      defaultValues: {
        WIFI_SSID: "",
        WIFI_PASSWORD:"",
      },
    }
  )
  
  const form_time = useForm(
    {
      defaultValues: {
        UTC_OFFSET:"",
      },
    }
  )
  const form_lora = useForm(
    {
      defaultValues: {
        LORA_MODE:"",
        PAIRING_KEY:"",
        DEVICE_NAME:"",
      },
    }
  )

  const { toast } = useToast()

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`/api/system-configuration/update?device=${device}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  function onSubmit(data) {
    handleSubmit(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const handleClick = (placeholder, setValue) => () => {
    const currentValue = form_wifi.getValues().WIFI_SSID; // Adjust this to match the field you're working with
    if (!currentValue) {
      setValue(placeholder);
    }
  };

  const handleReboot = async () => {
    try {
      const response = await fetch('/reboot', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('Reboot initiated');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Wi-Fi</CardTitle>
          <CardDescription>Enter your network credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form_wifi}>
            <form onSubmit={form_wifi.handleSubmit(onSubmit)} className="w-2/3 space-y-2">
              <FormField
                control={form_wifi.control}
                name="WIFI_SSID"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Network Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={SystemSettings.WIFI_SSID}
                        {...field}
                        onClick={handleClick(SystemSettings.WIFI_SSID, field.onChange)}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <FormField
                control={form_wifi.control}
                name="WIFI_PASSWORD"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••••" type="password" {...field}
                            onClick={handleClick(SystemSettings.WIFI_SSID, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Time</CardTitle>
          <CardDescription>Time below is used across the entire network.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form_time}>
            <form onSubmit={form_time.handleSubmit(onSubmit)} className="w-2/3 space-y-2">
              <FormField
                control={form_time.control}
                name="UTC_OFFSET"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>utcOffset</FormLabel>
                    <FormControl>
                      <Input placeholder={SystemSettings.utcOffset} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Time Zone</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="py-4">
        <CardHeader>
          <CardTitle>LoRa</CardTitle>
          <CardDescription>Enter your network credentials below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form_lora}>
            <form onSubmit={form_lora.handleSubmit(onSubmit)} className="w-2/3 space-y-2">
                <FormField
                  control={form_lora.control}
                  name="DEVICE_NAME"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Name</FormLabel>
                      <FormControl>
                        <Input placeholder={SystemSettings.DEVICE_NAME} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form_lora.control}
                name="LORA_MODE"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <FormControl>
                      {/* <Label htmlFor="picture">Picture</Label> */}
                      <Input 
                        placeholder={SystemSettings.LORA_MODE ? "Gateway" : "Node"}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form_lora.control}
                name="PAIRING_KEY"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pairing Key</FormLabel>
                    <FormControl>
                      <Input placeholder={SystemSettings.PAIRING_KEY} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="py-4">
        <CardHeader>
          <CardTitle>Reboot</CardTitle>
          <CardDescription>Reboot the logger, might lose connection for a moment.</CardDescription>
          <Button type="button" className="bg-red-500" onClick={handleReboot}>Reboot</Button>
        </CardHeader>
        <CardContent className="space-y-2">
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}

export default Settings