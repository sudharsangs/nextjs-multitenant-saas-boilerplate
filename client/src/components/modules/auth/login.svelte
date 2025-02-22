<script lang="ts">
	import { goto } from '$app/navigation';
	import { loginUser } from '$lib/api/auth';

	let username = '';
	let password = '';
	let showToast = false;

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		const response = await loginUser(username, password);
		if (response.token?.length > 0) {
			showToast = true;
			setTimeout(() => {
				showToast = false;
				goto('/dashboard');
			}, 3000);
		}
	};
</script>

<div class="flex h-full items-center justify-center">
	<div class="w-full max-w-md space-y-6 rounded-lg bg-white p-8">
		<h2 class="text-center text-2xl font-bold">Login</h2>
		<form on:submit={handleSubmit} class="space-y-4">
			<div class="form-control">
				<label class="label" for="email">
					<span class="label-text">Username</span>
				</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					class="input input-bordered w-full"
					required
				/>
			</div>
			<div class="form-control">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					class="input input-bordered w-full"
					required
				/>
			</div>
			<div class="form-control mt-6">
				<button type="submit" class="btn btn-primary w-full">Login</button>
			</div>
		</form>
	</div>
	{#if showToast}
		<div class="toast toast-end">
			<div class="alert alert-info">
				<span>Login Successful</span>
			</div>
			<div class="alert alert-success">
				<span>Redirecting to dashboard!</span>
			</div>
		</div>
	{/if}
</div>
