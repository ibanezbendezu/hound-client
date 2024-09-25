"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

const data: Repo[] = [
	{
		id: "m5gr84i9",
		name: "success",
		owner: "ken99@yahoo.com",
		photo: "https://avatars.githubusercontent.com/u/103289218?v=4",
		url: "https://github.com/ibanezbendezu/tingeso-ev1"
	},
	{
		id: "3u1reuv4",
		name: "success",
		owner: "Abe45@gmail.com",
		photo: "https://avatars.githubusercontent.com/u/103289218?v=4",
		url: "https://github.com/ibanezbendezu/tingeso-ev1"
	},
	{
		id: "derv1ws0",
		name: "processing",
		owner: "Monserrat44@gmail.com",
		photo: "https://avatars.githubusercontent.com/u/103289218?v=4",
		url: "https://github.com/ibanezbendezu/tingeso-ev1"
	},
	{
		id: "5kma53ae",
		name: "success",
		owner: "Silas22@gmail.com",
		photo: "https://avatars.githubusercontent.com/u/103289218?v=4",
		url: "https://github.com/ibanezbendezu/tingeso-ev1"
	},
	{
		id: "bhqecj4p",
		name: "failed",
		owner: "carmella@hotmail.com",
		photo: "https://avatars.githubusercontent.com/u/103289218?v=4",
		url: "https://github.com/ibanezbendezu/tingeso-ev1"
	},
]

export type Repo = {
	id: string
	name: string
	owner: string
	photo: string
	url: string
}

export const columns: ColumnDef<Repo>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nombre del repositorio
				<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>
			)
		},
		cell: ({ row }) =><div className="lowercase">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "photo",
		header: () => {
			return (
				<User className="h-5 w-5" />
			)
		},
		cell: ({ row }) => {
			return (
				<div className="flex items-center">
					<Avatar className="h-5 w-5">
						<AvatarImage src={row.getValue("photo")}/>
					</Avatar>
				</div>
			)
		},
	},
	{
		accessorKey: "owner",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Usuario
				<ArrowUpDown className="ml-2 h-4 w-4"/>
				</Button>
			)
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("owner")}</div>,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
		const repo = row.original

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Abre el menú</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Opciones</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => navigator.clipboard.writeText(repo.url)}
					>
						Copia la URL
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Ir a GitHub</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
		},
	},
]

export function DataTable({ rawData }: { rawData: any }) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [repos, setRepos] = React.useState<Repo[]>([])

	React.useEffect(() => {
		if (rawData && Array.isArray(rawData)) {
			const d = rawData.map((repo: any) => ({
				id: repo.id,
				name: repo.name,
				owner: repo.owner.login,
				photo: repo.owner.avatar_url,
				url: repo.url,
			}))
			console.log("Data dentro de DataTable", d)
			setRepos(d)
		}
	}, [rawData])

	const table = useReactTable({
		data: repos,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<div className="w-full">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No hay resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} repositorio(s) seleccionado(s).
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Siguiente
					</Button>
				</div>
			</div>
		</div>
	)
}
