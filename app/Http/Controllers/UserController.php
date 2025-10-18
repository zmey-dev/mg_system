<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empreendimento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Only master can access
        if ($request->user()->role !== 'master') {
            abort(403, 'Unauthorized access');
        }

        $users = User::with('empreendimento')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function create(Request $request)
    {
        // Only master can access
        if ($request->user()->role !== 'master') {
            abort(403, 'Unauthorized access');
        }

        $empreendimentos = Empreendimento::select('empreendimento_id', 'empreendimento_nome')
            ->orderBy('empreendimento_nome')
            ->get();

        return Inertia::render('Users/Create', [
            'empreendimentos' => $empreendimentos,
        ]);
    }

    public function store(Request $request)
    {
        // Only master can access
        if ($request->user()->role !== 'master') {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:master,sindico,gestor,auditor',
            'empreendimento_id' => 'nullable|exists:empreendimentos,empreendimento_id',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'empreendimento_id' => $validated['empreendimento_id'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(Request $request, $id)
    {
        // Only master can access
        if ($request->user()->role !== 'master') {
            abort(403, 'Unauthorized access');
        }

        $user = User::with('empreendimento')->findOrFail($id);

        $empreendimentos = Empreendimento::select('empreendimento_id', 'empreendimento_nome')
            ->orderBy('empreendimento_nome')
            ->get();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'empreendimentos' => $empreendimentos,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Only master can access
        if ($request->user()->role !== 'master') {
            abort(403, 'Unauthorized access');
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:master,sindico,gestor,auditor',
            'empreendimento_id' => 'nullable|exists:empreendimentos,empreendimento_id',
            'is_active' => 'boolean',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'empreendimento_id' => $validated['empreendimento_id'],
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, $id)
    {
        // Only master can access
        if ($request->user()->role !== 'master') {
            abort(403, 'Unauthorized access');
        }

        $user = User::findOrFail($id);

        // Prevent deleting self
        if ($user->id === $request->user()->id) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
