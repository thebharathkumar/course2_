"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface ColumnSetting {
  id: number;
  column_key: string;
  display_name: string;
  visible: number;
  is_filter: number;
  filter_label: string | null;
  sort_order: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ColumnSetting[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin");
          return;
        }
        setAuthenticated(true);
        return res.json();
      })
      .finally(() => setLoading(false));
  }, [router]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings || []);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchSettings();
    }
  }, [authenticated, fetchSettings]);

  const handleLogout = async () => {
    await fetch("/api/auth/verify", { method: "DELETE" });
    router.push("/admin");
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadResult(
          `Successfully uploaded ${data.rowCount} courses with ${data.columns.length} columns.`
        );
        fetchSettings();
      } else {
        setUploadResult(`Error: ${data.error}`);
      }
    } catch {
      setUploadResult("Error: Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const toggleVisible = (columnKey: string) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.column_key === columnKey
          ? { ...s, visible: s.visible ? 0 : 1 }
          : s
      )
    );
  };

  const toggleFilter = (columnKey: string) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.column_key === columnKey
          ? { ...s, is_filter: s.is_filter ? 0 : 1 }
          : s
      )
    );
  };

  const updateDisplayName = (columnKey: string, displayName: string) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.column_key === columnKey ? { ...s, display_name: displayName } : s
      )
    );
  };

  const updateFilterLabel = (columnKey: string, filterLabel: string) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.column_key === columnKey ? { ...s, filter_label: filterLabel } : s
      )
    );
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaveResult(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: settings.map((s) => ({
            column_key: s.column_key,
            display_name: s.display_name,
            visible: s.visible,
            is_filter: s.is_filter,
            filter_label: s.filter_label,
          })),
        }),
      });

      if (res.ok) {
        setSaveResult("Settings saved successfully!");
        fetchSettings();
      } else {
        const data = await res.json();
        setSaveResult(`Error: ${data.error}`);
      }
    } catch {
      setSaveResult("Error: Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage course equivalency data and display settings
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload Excel File
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Upload an Excel (.xlsx, .xls) or CSV file containing course
            equivalency data. The first row should contain column headers.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 mb-2">
              Drag and drop your file here, or
            </p>
            <label className="inline-block">
              <span
                className="px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer transition-colors"
                style={{ backgroundColor: "#003da5" }}
              >
                {uploading ? "Uploading..." : "Browse Files"}
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInput}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {uploadResult && (
            <div
              className={`mt-4 px-4 py-3 rounded-md text-sm ${
                uploadResult.startsWith("Error")
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-green-50 border border-green-200 text-green-700"
              }`}
            >
              {uploadResult}
            </div>
          )}
        </div>

        {/* Column Settings */}
        {settings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Column Display Settings
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Choose which columns to display on the public website and which
              columns to use as filters. You can also customize display names.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Excel Column
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Display Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Show on Website
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Use as Filter
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Filter Label
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settings.map((setting) => (
                    <tr key={setting.column_key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                        {setting.column_key}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={setting.display_name}
                          onChange={(e) =>
                            updateDisplayName(
                              setting.column_key,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleVisible(setting.column_key)}
                          className="w-10 h-6 rounded-full transition-colors relative"
                          style={{ backgroundColor: setting.visible ? '#2563eb' : '#d1d5db' }}
                        >
                          <span
                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                            style={{ left: setting.visible ? '18px' : '2px' }}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleFilter(setting.column_key)}
                          className="w-10 h-6 rounded-full transition-colors relative"
                          style={{ backgroundColor: setting.is_filter ? '#16a34a' : '#d1d5db' }}
                        >
                          <span
                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                            style={{ left: setting.is_filter ? '18px' : '2px' }}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={setting.filter_label || ""}
                          onChange={(e) =>
                            updateFilterLabel(
                              setting.column_key,
                              e.target.value
                            )
                          }
                          placeholder={setting.display_name}
                          disabled={!setting.is_filter}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#003da5" }}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Settings"
                )}
              </button>

              {saveResult && (
                <span
                  className={`text-sm ${
                    saveResult.startsWith("Error")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {saveResult}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
