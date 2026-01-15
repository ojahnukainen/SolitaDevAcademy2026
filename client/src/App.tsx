import { useEffect, useState, useMemo, } from 'react'
import './App.css'
import axios from 'axios'
import { Flex, HStack } from '@chakra-ui/react'
import { ElectricityTable } from './components/table/ElectricityTable'
import { TablePagination} from './components/table/TablePagination'

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

import {
  type PaginationState,
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table'
import { VStack } from '@chakra-ui/react'

import type ElectricityDataJSON from '@/types'
import { getElectricityColumns } from './components/table/TableColumns'


function App() {
  const [serverData, setServerData] = useState<ElectricityDataJSON[]>([])

  useEffect(() => {
      axios.get('http://localhost:3000/api/electricity/',{params:{dateFrom: "2024-01-01"}}).then((response) => {
          console.log("nodeserver resoponse", response.data)
          
          setServerData(response.data as ElectricityDataJSON[])
        
      }).catch((error) => {
        console.error('Error fetching data:', error)
      })
        

    }, []);

  async function fetchData(options: {
    pageIndex: number
    pageSize: number
  }) {

    console.log("fetch data func", serverData)
    return {
      rows: serverData.slice(
        options.pageIndex * options.pageSize,
        (options.pageIndex + 1) * options.pageSize,
    ),
      pageCount: Math.ceil(serverData.length / options.pageSize),
      rowCount: serverData.length,
    }}

  const columns = useMemo<ColumnDef<ElectricityDataJSON>[]>(
    () => getElectricityColumns(), [])

  const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 20,
    })

  const dataQuery = useQuery({
    queryKey: ['serverData', serverData],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  })

  const defaultData = useMemo(() => [], [])

  const table = useReactTable({
      data: dataQuery.data?.rows ?? defaultData,
      columns,
      // pageCount: dataQuery.data?.pageCount ?? -1, //you can now pass in `rowCount` instead of pageCount and `pageCount` will be calculated internally (new in v8.13.0)
      rowCount: dataQuery.data?.rowCount, // new in v8.13.0 - alternatively, just pass in `pageCount` directly
      
      state: {
        pagination,
      },
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true, //we're doing manual "server-side" pagination
      // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
      debugTable: true,
  })


 

  return (
    <div style={{height: "80%", width: "80%", display: "flex", justifyContent: "center", alignItems: "center"}}>
    <Flex direction="column" gap="4" width="100%" height="100%" justify="center" align="center">
      <ElectricityTable table={table} dataQuery={dataQuery} />
      <TablePagination pagination={pagination} setPagination={setPagination} dataQuery={dataQuery} />
    </Flex>
      
         
  </div>
  )
}

export default App
