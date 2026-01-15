import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import {  Table, } from "@chakra-ui/react"

import { Chart, useChart } from "@chakra-ui/charts"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

interface ElectricityDataJSON {
    id: number;
    date: string;
    totalProduction: string;  
    totalConsumption: string;
    averagePrice: string;
}

function App() {
  const [data, setData] = useState<ElectricityDataJSON[]>([])

  useEffect(() => {
    
      axios.get('http://localhost:3000/api/electricity/',{params:{dateFrom: "2024-01-01"}}).then((response) => {
        console.log(response.data)
        const vali = []
        for(const item of response.data){
          vali.push(item[0])
        }
        console.log("uliuliiuliuii",vali)
        setData(vali as ElectricityDataJSON[])
      
    }).catch((error) => {
      console.error('Error fetching data:', error)
    })
  
  
  }, []);

  const columnHelper = createColumnHelper<ElectricityDataJSON>();

  const columns = [
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("totalProduction", {
      header: "totalProduction",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("totalConsumption", {
      header: "Total Consumption",
      cell: (info) => `${info.getValue() !== null ? info.getValue() : "Data not available"}`,
      //cell: (info) => ()=>{info.getValue() === "null" ? "Data not available" : info.getValue()},
    }),
    columnHelper.accessor("averagePrice", {
      header: "Average Price c/kWh",
      cell: (info) => info.getValue(),
    }),
  ]

  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
  })


    
  return (
    <div style={{height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center"}}>
      
      
      <Table.Root size="sm" variant="outline" native>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody style={{ overflowY: "scroll", maxHeight: "4000px" }}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          
          </Table.Root>
      
  </div>
  )
}

export default App
