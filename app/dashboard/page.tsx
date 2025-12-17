"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Inbox } from "lucide-react";
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

  // Filter scripts
  const filteredScripts = useMemo(() => {
    if (activeTab === "all") return scripts;
    return scripts.filter((script) => script.status === activeTab);
  }, [scripts, activeTab]);

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

        {/* Status tabs */}
        <div className="mb-6">
          <StatusTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={counts}
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
