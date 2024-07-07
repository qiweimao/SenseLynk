import React, { useMemo } from 'react'
import { useTable, useGlobalFilter, useFilters } from 'react-table'
import { GlobalFilter } from './GlobalFilter'
import { ColumnFilter } from './ColumnFilter'
import { COLUMNS } from './columns'
import MOCK_DATA from './MOCK_DATA'
// import './table.css'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const DataTable = () => {

  const columns = useMemo(()=> COLUMNS, []);
  const data = useMemo(()=> MOCK_DATA, []);
  const defaultColumn = useMemo(() => {
    return  {
        Filter: ColumnFilter
    }
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter
  } = useTable({
        columns,
        data,
        defaultColumn,
  }, useGlobalFilter, useFilters)

  const { globalFilter } = state;

  return (
    <div className="flex-row">
      <div className='mb-3'>
        <GlobalFilter filter={globalFilter} setFilter = {setGlobalFilter} />
      </div>
      <div className='rounded-md border'>
        <Table {...getTableProps()}>
            <TableHeader>
                {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column)=>(
                            <TableHead {...column.getHeaderProps()}>
                                {column.render('Header')}
                                {/* <div> {column.canFilter ? column.render('Filter'): null} </div> */}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody {...getTableBodyProps()}>
                {rows.map((row) =>{
                    prepareRow(row);
                    return(
                      <TableRow {...row.getRowProps()}>
                          {row.cells.map((cell)=>{
                              return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                          })}
                      </TableRow>
                    )
                })}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DataTable