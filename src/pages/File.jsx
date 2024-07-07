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

const File = () => {
  const [FileList, setFileList] = useState([]);
  const location = useLocation(); // Use useLocation hook to access location object
  const queryParams = new URLSearchParams(location.search);
  const device = queryParams.get('device') || 'gateway'; // Default to 'gateway' if no device parameter is provided

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = () => {
    fetch(`/api/files?device=${device}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFileList(data)
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
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {FileList.length > 0 ? (
            FileList.map((item, index) => (
              <TableRow key={index} onClick={() => handleRowClick(item)}>
                <TableCell>{item.filename}</TableCell>
                <TableCell>{item.size}</TableCell>
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
            <DialogTitle>File Info: {selectedRow && selectedRow.filename}</DialogTitle>
            <DialogDescription>
              {/* Make changes to channel mappings here. Click save when you're done. */}
            </DialogDescription>
          </DialogHeader>
          {selectedRow && (
            <p>haha</p>
          )}
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

export default File
