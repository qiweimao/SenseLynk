import React, {useState, useEffect} from 'react'

import {
  Activity,
  Radio,
  GlobeLock,
  BatteryCharging,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from '../components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

import { SimpleLineChart } from '../components'

const Home = () => {

  const [gatewayInfo, setGatewayInfo] = useState([]);
  const [voltageHistory, setVoltageHistory] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/gateway-metadata')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        setGatewayInfo(data)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation for gateway info:', error);
      });
    }
      fetchData();
      const intervalId = setInterval(fetchData, 100000);
      return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/voltage-history')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        setVoltageHistory(data)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation for voltage-history:', error);
      });
    }
      fetchData();
      const intervalId = setInterval(fetchData, 100000);
      return () => clearInterval(intervalId);
  }, [])

  return (
    <div className='flex grow flex-col'>
      <div className="grid gap-2 md:grid-cols-2 md:gap-2 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Device ID
            </CardTitle>
            <GlobeLock className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className='flex justify-between'>
            <div>
              <div className="text-2xl font-bold">Gateway</div>
              <p className="text-xs text-muted-foreground">
                IP: {gatewayInfo.map(info => { return info ? info.ip : 'loading' })}
              </p>
              <p className="text-xs text-muted-foreground">
                MAC: {gatewayInfo.map(info => { return info ? info.macAddress : 'loading' })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Card x-chunk="dashboard-01-chunk-1" className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Battery Voltage
              </CardTitle>
              <BatteryCharging className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{gatewayInfo.map(info => { return info ? info.batteryVoltage : 'loading' })}</div>
                <p className="text-xs text-muted-foreground">
                  {gatewayInfo.map(info => {
                      const batteryVoltage = parseFloat(info.batteryVoltage);
                      return !isNaN(batteryVoltage) ? `${Math.floor((batteryVoltage / 4.2) * 100)}%` : 'loading';
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: charging
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
              <DialogTitle>Battery Voltage</DialogTitle>
            <DialogHeader>
              <DialogDescription>
                {/* Make changes to your profile here. Click save when you're done. */}
              </DialogDescription>
            </DialogHeader>
            <div className=" h-60 md:h-72">
              <SimpleLineChart data={voltageHistory} x={"time"} y={"voltage"} />
            </div>
            <DialogFooter className="flex flex-row">
              <Button variant="outline" type="submit">1D</Button>
              <Button variant="outline" type="submit">5D</Button>
              <Button variant="outline" type="submit">1M</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">LoRa Network</CardTitle>
            <Radio className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Online{gatewayInfo.map(info => { return info ? info.lora_count : 'loading' })}</div>
            <p className="text-xs text-muted-foreground">
              Connected to:{gatewayInfo.map(info => { return info ? info.offline_lora_count : 'loading' })} offline
            </p>
            <p className="text-xs text-muted-foreground">
              Last comm: 2024-06-30 00:00
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Up Time</CardTitle>
            <Activity className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days 5 hours{gatewayInfo.map(info => { return info ? info.sensors_count : 'loading' })}</div>
            <p className="text-xs text-muted-foreground">
            Last restart time:{gatewayInfo.map(info => { return info ? info.offline_sensors_count : 'loading' })} offline
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="hidden grow mt-4 gap-4 md:grid md:grid-cols-1 md:gap-4 lg:grid-cols-1">
        <Card className="lg:col-span-2" x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Events</CardTitle>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home