"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyIcon, PlusIcon, Trash2Icon, CopyIcon, CheckIcon } from "lucide-react";

type ApiKeyRow = {
  id: string;
  name: string;
  key: string;
  permissions: unknown;
  expiresAt: string | null;
  lastUsedAt: string | null;
  isActive: boolean;
  createdAt: string;
};

type CreateKeyResponse = {
  id: string;
  name: string;
  key: string;
  permissions: unknown;
  expiresAt: string | null;
  lastUsedAt: string | null;
  isActive: boolean;
  createdAt: string;
  token: string;
};

const formatDateTime = (value: string | null) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    return d.toLocaleString();
  } catch {
    return value;
  }
};

export default function ApiKeysSettingsPage() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [permRead, setPermRead] = useState(true);
  const [permWrite, setPermWrite] = useState(false);
  const [permAdmin, setPermAdmin] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const permissionsPayload = useMemo(() => {
    const perms: string[] = [];
    if (permRead) perms.push("read");
    if (permWrite) perms.push("write");
    if (permAdmin) perms.push("admin");
    return perms;
  }, [permRead, permWrite, permAdmin]);

  const fetchKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiKeyRow[]>("/api-keys");
      if (res.success && res.data) {
        setKeys(res.data as unknown as ApiKeyRow[]);
      } else {
        setError(res.error || "Failed to load API keys");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const onCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await api.post<{ data: CreateKeyResponse }>("/api-keys", {
        name: name.trim(),
        permissions: permissionsPayload,
        expiresAt: expiresAt || null,
      });
      if (res.success && res.data) {
        const payload = (res.data as any).data as CreateKeyResponse;
        setCreatedToken(payload.token);
        await fetchKeys();
      } else {
        setError(res.error || "Failed to create API key");
      }
    } catch {
      setError("An unexpected error occurred while creating key");
    } finally {
      setCreating(false);
    }
  };

  const onRevoke = async (id: string) => {
    if (!confirm("Revoke this API key? Applications using it will stop working.")) return;
    try {
      const res = await api.delete(`/api-keys/${id}`);
      if (res.success) {
        await fetchKeys();
      } else {
        alert(res.error || "Failed to revoke key");
      }
    } catch {
      alert("An unexpected error occurred");
    }
  };

  const onCopy = async () => {
    if (!createdToken) return;
    try {
      await navigator.clipboard.writeText(createdToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const resetForm = () => {
    setName("");
    setExpiresAt("");
    setPermRead(true);
    setPermWrite(false);
    setPermAdmin(false);
    setCreatedToken(null);
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <p className="text-muted-foreground">Create and manage keys for programmatic access.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" /> New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!createdToken ? (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Key</DialogTitle>
                  <DialogDescription>Give the key a name, set permissions and optional expiry.</DialogDescription>
                </DialogHeader>
                {error && (
                  <Alert className="mb-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Name</Label>
                    <Input id="key-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Production backend" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires (optional)</Label>
                    <Input id="expires" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex gap-4 text-sm">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={permRead} onChange={(e) => setPermRead(e.target.checked)} /> Read
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={permWrite} onChange={(e) => setPermWrite(e.target.checked)} /> Write
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={permAdmin} onChange={(e) => setPermAdmin(e.target.checked)} /> Admin
                      </label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => { setOpen(false); }}>
                    Cancel
                  </Button>
                  <Button onClick={onCreate} disabled={!name.trim() || creating}>
                    {creating ? 'Creating…' : 'Create'}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>API Key Created</DialogTitle>
                  <DialogDescription>Copy this token now. You will not be able to see it again.</DialogDescription>
                </DialogHeader>
                <div className="bg-muted p-3 rounded font-mono text-sm break-all select-all">
                  {createdToken}
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="secondary" onClick={onCopy}>
                    {copied ? (<><CheckIcon className="h-4 w-4 mr-2" /> Copied</>) : (<><CopyIcon className="h-4 w-4 mr-2" /> Copy</>)}
                  </Button>
                  <Button onClick={() => { setOpen(false); }}>
                    Done
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyIcon className="h-5 w-5" /> API Keys</CardTitle>
          <CardDescription>Keys are scoped to your company and can be revoked at any time.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">Loading…</div>
          ) : error ? (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-6">
                        No API keys yet. Create your first one.
                      </TableCell>
                    </TableRow>
                  ) : keys.map((k) => (
                    <TableRow key={k.id}>
                      <TableCell className="font-medium">{k.name}</TableCell>
                      <TableCell className="font-mono text-xs">{k.key}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded px-2 py-1 text-xs ${k.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {k.isActive ? 'Active' : 'Revoked'}
                        </span>
                      </TableCell>
                      <TableCell>{formatDateTime(k.expiresAt)}</TableCell>
                      <TableCell>{formatDateTime(k.lastUsedAt)}</TableCell>
                      <TableCell>{formatDateTime(k.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="sm" onClick={() => onRevoke(k.id)} disabled={!k.isActive}>
                          <Trash2Icon className="h-4 w-4 mr-1" /> Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

