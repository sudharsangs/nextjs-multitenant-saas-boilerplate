<script lang="ts">
	import { page } from '$app/state';
	import {
		Warehouse,
		Box,
		Container,
		Scroll,
		Presentation,
		UsersRound,
		Power,
		Building2,
		CircleUser,
		Contact,
		Menu,
		SkipBack,

		SkipForward

	} from 'lucide-svelte';

	const navItems = [
		{ href: '/dashboard', icon: Presentation, label: 'Dashboard' },
		{ href: '/dashboard/orders', icon: Container, label: 'Orders' },
		{ href: '/dashboard/customers', icon: UsersRound, label: 'Customers' },
		{ href: '/dashboard/inventory', icon: Box, label: 'Inventory' },
		{ href: '/dashboard/invoice', icon: Scroll, label: 'Invoices' },
		{ href: '/dashboard/warehouse', icon: Warehouse, label: 'Warehouse' }
	];

	const userNavItems = [
		{ href: '/dashboard/company', icon: Building2, label: 'Company' },
		{ href: '/dashboard/users', icon: Contact, label: 'Users' },
		{ href: '/dashboard/profile', icon: CircleUser, label: 'Profile' }
	];

	let isOpen = true;

	function toggleSidebar() {
		isOpen = !isOpen;
	}
</script>

<div class="flex h-screen">
	<div class="fixed bg-gray-800 text-white transition-all w-64 duration-300" class:closed={!isOpen}>
		<div class="p-4">
			{#if isOpen}
				<h1 class="text-2xl font-bold">Orderly</h1>
			{:else}
				<h1 class="text-2xl font-bold">O</h1>
			{/if}
		</div>
		<button 
			class="p-4 absolute -right-6 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full"
			on:click={toggleSidebar}
		>
			{#if isOpen}
				<SkipBack />
			{:else}
				<SkipForward />
			{/if}
		</button>
		<div
			class="flex h-[95vh] flex-col justify-between transition-all duration-300"
			class:closed={!isOpen}
		>
			<nav class="mt-5">
				{#each navItems as { href, icon: Icon, label }}
					<a
						{href}
						class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
						class:bg-primary={page.url.pathname === href}
					>
						<Icon />
						{#if isOpen}
							{label}
						{/if}
					</a>
				{/each}
			</nav>
			<div>
				{#each userNavItems as { href, icon: Icon, label }}
					<a
						{href}
						class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-700"
						class:bg-primary={page.url.pathname === href}
					>
						<Icon />
						{#if isOpen}
							{label}
						{/if}
					</a>
				{/each}
				<button class="mb-10 flex cursor-pointer items-center gap-2 px-4 py-2.5 hover:text-sky-100">
					<Power />
					{#if isOpen}
						Logout
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div class="w-64" class:closed={!isOpen}></div>
	<div class="flex-1 bg-gray-100 p-6">
		<slot></slot>
	</div>
</div>

<style>
	.closed {
		width: 4rem;
	}
</style>
