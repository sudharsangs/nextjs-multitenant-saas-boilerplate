<script lang="ts">
	import { registerUser } from "$lib/api/auth";
	import type { FormEventHandler } from "svelte/elements";

   let email: string = ""
    let password: string = "";
    let username: string = "";
    let phone: string = "";
    let first_name: string = "";
    let last_name: string = "";
	
	const handleSubmit = async (event:Event) => {
		event.preventDefault();
		const response = await registerUser(
            email,
            password,
            username,
            phone,
            first_name,
            last_name
        )
        console.log(response)
	};
</script>

<div class="flex items-center justify-center h-full">
	<div class="w-full max-w-md space-y-6 rounded-lg bg-white p-8 ">
		<h2 class="text-center text-2xl font-bold">Create an account</h2>
		<form on:submit={handleSubmit} class="space-y-4">
            <div class="flex gap-2">
                <div>
                    <label class="label" for="first_name">
                        <span class="label-text
                        ">First Name</span>
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        bind:value={first_name}
                        class="input input-bordered w-full"
                        required
                    />
                </div>
                <div>
                    <label class="label" for="last_name">
                        <span class="label-text
                        ">Last Name</span>
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        bind:value={last_name}
                        class="input input-bordered w-full"
                        required
                    />
                </div>
            </div>
            <div class="form-control">
                <label class="label" for="username">
                    <span class="label-text
                    ">Username</span>
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
				<label class="label" for="email">
					<span class="label-text">Email</span>
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					class="input input-bordered w-full"
					required
				/>
			</div>
            <div class="form-control">
                <label class="label" for="phone">
                    <span class="label-text">Phone</span>
                </label>
                <input
                    id="phone"
                    type="text"
                    bind:value={phone}
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
				<button type="submit" class="btn btn-primary w-full">Register</button>
			</div>
		</form>
	</div>
</div>

