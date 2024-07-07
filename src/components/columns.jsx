import { format } from 'date-fns'

export const COLUMNS = [
    // {
    //     Header: "Id",
    //     Footer: "Id",
    //     accessor: "id",
    //     disableFilters: true
    // },
    {
        Header: "Name",
        Footer: "Name",
        accessor: "name",
    },
    // {
    //     Header: "Address",
    //     Footer: "Address",
    //     accessor: "address",
    // },
    // {
    //     Header: "Signal Strength",
    //     Footer: "Signal Strength",
    //     accessor: "signal_strength",
    // },
    {
        Header: "Last Message Time",
        Footer: "Last Message Time",
        accessor: "last_message_time",
        Cell: ({ value }) => { return format(new Date(value), "dd/MM/yyyy")}
    },
    {
        Header: "Up Time",
        Footer: "Up Time",
        accessor: "up_time",
    },
]

export const GROUPED_COLUMNS = [
    {
        Header: "Id",
        Footer: "Id",
        accessor: "id",
    },

    {
        Header: "Name",
        Footer: "Name",
        columns: [
            {
                Header: "Name",
                Footer: "Name",
                accessor: "name",
            },
            {
                Header: "Address",
                Footer: "Address",
                accessor: "address",
            },
        ]
    },

    {
        Header: "Info",
        Footer: "Info",
        columns:[
            {
                Header: "Signal Strength",
                Footer: "Signal Strength",
                accessor: "signal_strength",
            },
            {
                Header: "Last Message Time",
                Footer: "Last Message Time",
                accessor: "last_message_time",
            },
            {
                Header: "Up Time",
                Footer: "Up Time",
                accessor: "up_time",
            },
        ]
    }
]