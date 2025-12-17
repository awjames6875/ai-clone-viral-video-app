"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Clock,
  Copy,
  Check,
  AlertCircle,
  Play,
} from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { HashtagInput } from "@/components/hashtag-input";
import { createBrowserClient, type Script } from "@/lib/supabase";
import { formatRelativeTime, formatHashtags } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VideoPreviewPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [script, setScript] = useState<Script | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [error, setError] = useState("");

  // Form state
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Lazy init supabase
  const supabaseRef = useRef<ReturnType<typeof createBrowserClient> | null>(null);
  const getSupabase = () => {
    if (!supabaseRef.current) {
      supabaseRef.current = createBrowserClient();
    }
    return supabaseRef.current;
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabase();
      // Get user
      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData.user?.email);

      // Get script
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Video not found");
        setIsLoading(false);
        return;
      }

      const scriptData = data as Script;
      setScript(scriptData);
      setCaption(scriptData.caption || scriptData.script_json?.caption || "");
      setHashtags(scriptData.hashtags || scriptData.script_json?.hashtags || []);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!script) return;
    setIsSaving(true);
    const supabase = getSupabase();

    await supabase
      .from("scripts")
      .update({ caption, hashtags })
      .eq("id", id);

    setIsSaving(false);
  };

  const handlePost = async () => {
    if (!script || script.status !== "Video Ready (Preview)" || script.processed) return;
    setIsPosting(true);
    setError("");

    try {
      // Save changes first
      await handleSave();

      // Call post API
      const response = await fetch("/api/videos/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script_id: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to post video");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsPosting(false);
    }
  };

  const copyCaption = () => {
    const fullCaption = `${caption} ${formatHashtags(hashtags)}`;
    navigator.clipboard.writeText(fullCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userEmail={userEmail} />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface rounded w-1/3" />
            <div className="aspect-[9/16] max-w-sm bg-surface rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen bg-background">
        <Header userEmail={userEmail} />
        <main className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-foreground-secondary">Video not found</p>
          <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
            Back to dashboard
          </Link>
        </main>
      </div>
    );
  }

  const canPost = script.status === "Video Ready (Preview)" && !script.processed;
  const isPosted = script.status === "Posted";

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back and actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>

          {canPost && (
            <Button
              onClick={handlePost}
              disabled={isPosting}
              isLoading={isPosting}
            >
              <Send className="w-4 h-4" />
              Post to Socials
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-status-failed/10 border border-status-failed/20 rounded-lg flex items-center gap-2 text-status-failed text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                  Video Preview
                </span>
                <StatusBadge status={script.status} />
              </div>

              {script.video_url ? (
                <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden">
                  <video
                    src={script.video_url}
                    controls
                    className="w-full h-full object-contain"
                    poster=""
                  />
                </div>
              ) : (
                <div className="aspect-[9/16] bg-surface rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-foreground-muted mx-auto mb-2" />
                    <p className="text-foreground-secondary text-sm">
                      Video not available
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-xs text-foreground-muted">
                <Clock className="w-3 h-3" />
                Created {formatRelativeTime(script.created_at)}
              </div>
            </div>
          </motion.div>

          {/* Caption editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                  Post Details
                </span>
                {!isPosted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCaption}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-status-posted" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <Input
                  label="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Post caption..."
                  disabled={isPosted}
                />

                <HashtagInput
                  label="Hashtags"
                  value={hashtags}
                  onChange={setHashtags}
                />

                {!isPosted && (
                  <Button
                    variant="secondary"
                    onClick={handleSave}
                    disabled={isSaving}
                    isLoading={isSaving}
                    className="w-full"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            {/* Preview of full caption */}
            <div className="card p-4">
              <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                Full Caption Preview
              </span>
              <p className="mt-2 text-sm text-foreground-secondary font-mono bg-surface-hover p-3 rounded">
                {caption} {formatHashtags(hashtags)}
              </p>
            </div>

            {/* Error display */}
            {script.error_message && (
              <div className="card p-4 border-status-failed/50">
                <span className="text-xs font-medium text-status-failed uppercase tracking-wider">
                  Error
                </span>
                <p className="mt-2 text-sm text-foreground-secondary">
                  {script.error_message}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
