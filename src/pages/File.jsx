import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import TwoLineChart from "../components/TwoLineChart"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

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


const File = () => {
  const [FileList, setFileList] = useState([]);
  const location = useLocation(); // Use useLocation hook to access location object
  const queryParams = new URLSearchParams(location.search);
  const device = queryParams.get('device') || 'gateway'; // Default to 'gateway' if no device parameter is provided

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {

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

    fetchData();
    const intervalId = setInterval(fetchData, 100000);
    return () => clearInterval(intervalId);
  }, [device])

  const handleRowClick = (item) => {
    setSelectedRow(item);
    setIsDialogOpen(true);
    console.log('Row clicked');
    console.log(isDialogOpen);
  };
  
  const handleButtonClick = async () => {
    try {
      // Trigger the fetch request
      let request_url="";
      if(device === "gateway"){
        request_url = `/downloadhandler~/data/${selectedRow.filename}`
      }
      else{
        request_url = `/downloadhandler~/node/${device}/data/${selectedRow.filename}`
      }
      const response = await fetch(request_url, {
        method: 'GET', // GET request doesn't have a body
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Handling the file response
      const blob = await response.blob(); // Process the response as a Blob
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedRow.filename}`; // Provide the name you want for the downloaded file
      document.body.appendChild(a);
      a.click(); // Trigger the download
  
      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };


  return (
    <div>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {FileList.length > 0 ? (
            FileList.map((item, index) => (
              <TableRow key={index} onClick={() => handleRowClick(item)}>
                <TableCell className="whitespace-nowrap">{item.filename}</TableCell>
                <TableCell className="whitespace-nowrap">{item.size}</TableCell>
                <TableCell className="whitespace-nowrap">{item.lastmodified}</TableCell>
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
      {/* <TwoLineChart device={device} filename={selectedRow ? selectedRow.filename : null} /> */}

      <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>File: {selectedRow ? selectedRow.filename : null}</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className='mx-[-10px] md:px-10'>
            <TwoLineChart device={device} filename={selectedRow ? selectedRow.filename : null} />
          </div>
          <DrawerFooter>
            {selectedRow && (
                <div>
                    <Button onClick={handleButtonClick}>
                      Download
                    </Button>
                </div>
              )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Toaster />
    </div>
  )
}

export default File
