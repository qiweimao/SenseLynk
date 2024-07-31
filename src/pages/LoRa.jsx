import React, {useState, useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const LoRa = () => {

  const [LoRaStatus, setLoRaStatus] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRowClick = (item) => {
    setSelectedRow(item);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/lora-network-status')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        setLoRaStatus(data)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation for gateway info:', error);
      });
    }
      fetchData();
      const intervalId = setInterval(fetchData, 100000);
      return () => clearInterval(intervalId);
  }, [])


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>LoRa Status</CardTitle>
          <CardDescription>
            List of LoRa peers are shown below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {!(LoRaStatus === null) && LoRaStatus.length > 0 ? (
                <Table key={LoRaStatus.time}>
                  <TableCaption></TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Peer</TableHead>
                      <TableHead>MAC</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>status</TableHead>
                      <TableHead >RSSI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LoRaStatus.map((item, index) => (
                      <TableRow key={item.name} onClick={() => handleRowClick(item)}>
                        <TableCell className="whitespace-nowrap">{item.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.mac}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.lastCommsTime}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.status}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.rssi}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                    </TableRow>
                  </TableFooter>
                </Table>
                ) : (
                <p>Loading...</p> 
              )}
        </CardContent>
        <CardFooter>
          <Button>Refresh</Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Station Info</DialogTitle>
          <DialogHeader>
            <DialogTitle>Station Name: {selectedRow && selectedRow.name}</DialogTitle>
            <DialogDescription>
              Click to edit settings of this station.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-between'>
            <Link to={`/settings?device=${selectedRow && selectedRow.name}`}>
              <Button>System</Button>
            </Link>
            <Link to={`/sensor?device=${selectedRow && selectedRow.name}`}>
              <Button>Sensor</Button>
            </Link>
            <Link to={`/files?device=${selectedRow && selectedRow.name}`}>
              <Button>Files</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LoRa