<script lang="ts">
	import { page } from '$app/state';
	import { Warehouse, Box, Container, Scroll, Presentation, UsersRound } from 'lucide-svelte';
</script>

<div class="flex h-screen">
	<div class="w-64 bg-gray-800 text-white">
		<div class="p-4">
			<h1 class="text-2xl font-bold">Orderly</h1>
		</div>
		<nav class="mt-5">
            <a
                href="/dashboard"
                class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
                class:bg-primary={page.url.pathname === '/dashboard'}
            >
                <Presentation />
                Dashboard
            </a>
			<a
				href="/dashboard/orders"
				class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
                class:bg-primary={page.url.pathname === '/dashboard/orders'}
			>
				<Container />
				Orders
			</a>
			<a
				href="/dashboard/customers"
				class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
                class:bg-primary={page.url.pathname === '/dashboard/customers'}
			>
				<UsersRound />
				Customers
			</a>
			<a
				href="/dashboard/inventory"
				class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
                class:bg-primary={page.url.pathname === '/dashboard/inventory'}
			>
				<Box />
				Inventory
			</a>
			<a
				href="/dashboard/invoice"
				class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
                class:bg-primary={page.url.pathname === '/dashboard/invoice'}
			>
				<Scroll />
				Invoices
			</a>
			<a
				href="/dashboard/warehouse"
				class="flex items-center gap-2  px-4 py-2.5 hover:bg-gray-700"
                class:bg-primary={page.url.pathname === '/dashboard/warehouse'}
			>
				<Warehouse />
				Warehouse
			</a>
		</nav>
	</div>
	<div class="flex-1 bg-gray-100 p-6">
		<slot></slot>
	</div>
</div>
