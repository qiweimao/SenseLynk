import React, { useState } from 'react'
import { useAsyncDebounce } from 'react-table'
// import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'


export const GlobalFilter = ( { filter, setFilter} ) => {

  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce(() => {
    setFilter(value || undefined);
  }, 500)

  return (
    <Input placeholder="Search" value={value || ''} onChange = {(e) => 
    {
      setValue(e.target.value)
      onChange(e.target.value);
    }} className=""
    />
  )
}