"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Inbox, FileText, Clock, Video, CheckCircle, Search } from "lucide-react";
import { Header } from "@/components/header";
import { StatusTabs } from "@/components/status-tabs";
import { ScriptCard, ScriptCardSkeleton } from "@/components/script-card";
import { Button } from "@/components/ui/button";
import { createBrowserClient, type Script, type ScriptStatus } from "@/lib/supabase";

type TabStatus = ScriptStatus | "all";

export default function DashboardPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState<string>();

  // Lazy init supabase client
  const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(null);
  const getSupabase = () => {
    if (!supabaseRef.current) {
      supabaseRef.current = createBrowserClient();
    }
    return supabaseRef.current;
  };

  const fetchScripts = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("scripts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setScripts(data as Script[]);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    const supabase = getSupabase();

    // Get user
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email);
    });

    // Fetch scripts
    fetchScripts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("scripts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scripts" },
        () => {
          fetchScripts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate counts
  const counts = useMemo(() => {
    const result: Record<ScriptStatus, number> = {
      "Pending Script": 0,
      "Script Approved": 0,
      "Video Ready (Preview)": 0,
      Posted: 0,
      Failed: 0,
    };

    scripts.forEach((script) => {
      result[script.status]++;
    });

    return result;
  }, [scripts]);

  // Calculate posted this week
  const postedThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return scripts.filter(
      (s) => s.status === "Posted" && new Date(s.posted_at || s.updated_at) > weekAgo
    ).length;
  }, [scripts]);

  // Filter scripts by status and search query
  const filteredScripts = useMemo(() => {
    let result = scripts;

    // Filter by status
    if (activeTab !== "all") {
      result = result.filter((script) => script.status === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((script) => {
        const hook = script.script_json?.hook || script.analysis_json?.hook || "";
        const caption = script.caption || script.script_json?.caption || "";
        return hook.toLowerCase().includes(query) || caption.toLowerCase().includes(query);
      });
    }

    return result;
  }, [scripts, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Scripts</h1>
            <p className="text-sm text-foreground-secondary">
              Manage your viral video scripts
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchScripts(true)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card p-3">
            <div className="flex items-center gap-2 text-foreground-muted mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Total</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{scripts.length}</p>
          </div>
          <div className="card p-3">
            <div className="flex items-center gap-2 text-status-pending mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Pending</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{counts["Pending Script"]}</p>
          </div>
          <div className="card p-3">
            <div className="flex items-center gap-2 text-status-ready mb-1">
              <Video className="w-4 h-4" />
              <span className="text-xs">Ready to Post</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{counts["Video Ready (Preview)"]}</p>
          </div>
          <div className="card p-3">
            <div className="flex items-center gap-2 text-status-posted mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Posted (7d)</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{postedThisWeek}</p>
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-6">
          <StatusTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
          />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by hook or caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        {/* Scripts list */}
        <div className="space-y-3">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 3 }).map((_, i) => (
              <ScriptCardSkeleton key={i} />
            ))
          ) : filteredScripts.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface mb-4">
                <Inbox className="w-6 h-6 text-foreground-muted" />
              </div>
              <p className="text-foreground-secondary">
                {activeTab === "all"
                  ? "No scripts yet. They'll appear here after the daily scrape."
                  : `No ${activeTab.toLowerCase()} scripts.`}
              </p>
            </motion.div>
          ) : (
            // Script cards
            <AnimatePresence mode="popLayout">
              {filteredScripts.map((script, index) => (
                <ScriptCard key={script.id} script={script} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
