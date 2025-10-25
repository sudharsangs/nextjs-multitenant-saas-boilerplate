"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

type AuditLog = {
  id: string;
  companyId: string | null;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT';
  entityType: string;
  entityId: string;
  changes: any | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<AuditLog[]>(`/audit-logs?limit=100`);
      if (res.success && res.data) {
        setLogs(res.data as unknown as AuditLog[]);
      } else if (res.error) {
        setError(res.error);
      }
    } catch {
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter((l) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.entityType.toLowerCase().includes(q) ||
      l.entityId.toLowerCase().includes(q) ||
      (l.userId || '').toLowerCase().includes(q)
    );
  });

  const formatDateTime = (s: string) => new Date(s).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
          <p className="text-muted-foreground">Track important actions across your workspace.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest 100 events for your company</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Search by user, entity, action…" value={query} onChange={(e) => setQuery(e.target.value)} className="w-72" />
              <Button variant="outline" onClick={fetchLogs}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-sm text-muted-foreground">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-6">No results</TableCell>
                    </TableRow>
                  ) : filtered.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="whitespace-nowrap">{formatDateTime(l.createdAt)}</TableCell>
                      <TableCell className="font-mono text-xs">{l.userId}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded px-2 py-1 text-xs ${l.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{l.action}</span>
                      </TableCell>
                      <TableCell>{l.entityType}</TableCell>
                      <TableCell className="font-mono text-xs">{l.entityId}</TableCell>
                      <TableCell className="font-mono text-xs">{l.ipAddress || '—'}</TableCell>
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

