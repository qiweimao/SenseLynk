import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const sensorTypes = {
  "0": "Unknown",
  "1": "VWPZ",
  "2": "Barometer",
  "3": "GeoPhone",
  "4": "Inclinometer",
  "5": "Rain Gauge"
};

const Sensor = () => {
  const [DataCollectionSettings, setDataCollectionSettings] = useState([]);
  const location = useLocation(); // Use useLocation hook to access location object
  const queryParams = new URLSearchParams(location.search);
  const device = queryParams.get('device') || 'gateway'; // Default to 'gateway' if no device parameter is provided

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = () => {
    fetch(`/api/collection-configuration?device=${device}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setDataCollectionSettings(data)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation for gateway info:', error);
      });
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 100000);
    return () => clearInterval(intervalId);
  }, [device])

  const handleRowClick = (item) => {
    setSelectedRow(item);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRow(null);
  };

  const form = useForm(
    {
      defaultValues: {
        channel:"",
        pin:"",
        sensor:"",
        enabled:"",
        interval:"",
      },
    }
  )

  useEffect(() => {
    if (selectedRow) {
      form.reset({
        channel: selectedRow.channel,
        pin: selectedRow.pin,
        sensor: selectedRow.sensor,
        enabled: selectedRow.enabled,
        interval: selectedRow.interval,
      });
    }
  }, [selectedRow, form]);

  const { toast } = useToast()

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`/api/collection-configuration/update?device=${device}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      console.log(result);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  function onSubmit(data) {
    console.log(data);
    handleSubmit(data);
    fetchData();
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ch.</TableHead>
            <TableHead>On/Off</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Pin</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DataCollectionSettings.length > 0 ? (
            DataCollectionSettings.map((item, index) => (
              <TableRow key={index} onClick={() => handleRowClick(item)}>
                <TableCell>{item.channel}</TableCell>
                <TableCell>
                  {/* {item.enabled ? 'on' : 'off'} */}
                  <Switch
                    checked={item.enabled}
                    // onCheckedChange={field.onChange}
                  />
                  </TableCell>
                <TableCell className="whitespace-nowrap">{sensorTypes[item.sensor]}</TableCell>
                <TableCell>{item.interval}</TableCell>
                <TableCell>{item.pin}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Date(item.time).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>Loading...</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow></TableRow>
        </TableFooter>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Channel {selectedRow && selectedRow.channel}</DialogTitle>
            <DialogDescription>
              {/* Make changes to channel mappings here. Click save when you're done. */}
            </DialogDescription>
          </DialogHeader>
          {selectedRow && (
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}  className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className='flex items-center'>
                    <div className="flex grow items-center "> {/* Container for label and switch */}
                      <FormLabel className='pr-2 grow'>Collection Enabled</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="sensor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sensor Type</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                          <SelectValue placeholder={sensorTypes[selectedRow.sensor] || "Select a sensor"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Unknown</SelectItem>
                          <SelectItem value="1">VWPZ</SelectItem>
                          <SelectItem value="2">Barometer</SelectItem>
                          <SelectItem value="3">GeoPhone</SelectItem>
                          <SelectItem value="4">Inclinometer</SelectItem>
                          <SelectItem value="5">Rain Gauge</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        You can manage email addresses in your{" "}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin</FormLabel>
                      <FormControl>
                        <Input placeholder={selectedRow.pin} {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the physical pin the sensor is connected to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interval</FormLabel>
                      <FormControl>
                        <Input placeholder={selectedRow.interval} {...field} />
                      </FormControl>
                      <FormDescription>
                        This is how often the logger takes readings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
              </Form>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

export default Sensor
