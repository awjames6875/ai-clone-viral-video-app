"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { HashtagInput } from "@/components/hashtag-input";
import { createBrowserClient, type Script } from "@/lib/supabase";
import { formatRelativeTime } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ScriptEditorPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [script, setScript] = useState<Script | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [error, setError] = useState("");

  // Form state
  const [spokenScript, setSpokenScript] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [onScreenText, setOnScreenText] = useState("");
  const [musicTrack, setMusicTrack] = useState("");

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
        setError("Script not found");
        setIsLoading(false);
        return;
      }

      const scriptData = data as Script;
      setScript(scriptData);

      // Populate form
      setSpokenScript(scriptData.script_json?.spoken_script || "");
      setCaption(scriptData.caption || scriptData.script_json?.caption || "");
      setHashtags(scriptData.hashtags || scriptData.script_json?.hashtags || []);
      setOnScreenText(scriptData.script_json?.on_screen_text || "");
      setMusicTrack(scriptData.music_track || scriptData.script_json?.music_track || "");

      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!script) return;
    setIsSaving(true);
    setError("");

    const supabase = getSupabase();
    const { error } = await supabase
      .from("scripts")
      .update({
        caption,
        hashtags,
        music_track: musicTrack,
        script_json: {
          ...script.script_json,
          spoken_script: spokenScript,
          caption,
          hashtags,
          on_screen_text: onScreenText,
          music_track: musicTrack,
        },
      })
      .eq("id", id);

    if (error) {
      setError("Failed to save changes");
    }

    setIsSaving(false);
  };

  const handleApprove = async () => {
    if (!script || script.status !== "Pending Script") return;
    setIsApproving(true);
    setError("");

    try {
      // Save changes first
      await handleSave();

      // Call approve API
      const response = await fetch("/api/scripts/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script_id: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to approve script");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userEmail={userEmail} />
        <main className="max-w-3xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-surface rounded w-1/3" />
            <div className="h-4 bg-surface rounded w-1/2" />
            <div className="h-40 bg-surface rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen bg-background">
        <Header userEmail={userEmail} />
        <main className="max-w-3xl mx-auto px-4 py-6 text-center">
          <p className="text-foreground-secondary">Script not found</p>
          <Link href="/dashboard" className="text-primary hover:underline mt-2 inline-block">
            Back to dashboard
          </Link>
        </main>
      </div>
    );
  }

  const canApprove = script.status === "Pending Script";
  const isReadOnly = script.status !== "Pending Script";

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={userEmail} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Back link and actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Scripts
          </Link>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={isSaving}
                isLoading={isSaving}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            )}
            {canApprove && (
              <Button
                onClick={handleApprove}
                disabled={isApproving}
                isLoading={isApproving}
              >
                <Sparkles className="w-4 h-4" />
                Create Video
              </Button>
            )}
          </div>
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

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 mb-6"
        >
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-foreground-muted">Status</span>
              <StatusBadge status={script.status} />
            </div>
            <div className="flex items-center gap-2 text-foreground-secondary">
              <Clock className="w-4 h-4" />
              {formatRelativeTime(script.created_at)}
            </div>
            {script.source_video_url && (
              <a
                href={script.source_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                Source video
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Spoken script */}
          <Textarea
            label="Spoken Script"
            value={spokenScript}
            onChange={(e) => setSpokenScript(e.target.value)}
            placeholder="The script your avatar will speak..."
            showCount
            maxLength={2000}
            disabled={isReadOnly}
            className="min-h-[200px]"
          />

          {/* Caption and hashtags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Post caption..."
              disabled={isReadOnly}
            />
            <HashtagInput
              label="Hashtags"
              value={hashtags}
              onChange={setHashtags}
            />
          </div>

          {/* On-screen text and music */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="On-Screen Text"
              value={onScreenText}
              onChange={(e) => setOnScreenText(e.target.value)}
              placeholder="Text overlays for the video..."
              disabled={isReadOnly}
              className="min-h-[100px]"
            />
            <Input
              label="Music Track"
              value={musicTrack}
              onChange={(e) => setMusicTrack(e.target.value)}
              placeholder="Suggested music..."
              disabled={isReadOnly}
            />
          </div>

          {/* Analysis accordion */}
          {script.analysis_json && (
            <div className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover transition-colors"
              >
                <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wider">
                  Gemini Analysis
                </span>
                {showAnalysis ? (
                  <ChevronUp className="w-4 h-4 text-foreground-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-foreground-muted" />
                )}
              </button>
              {showAnalysis && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 space-y-3 text-sm"
                >
                  <div>
                    <span className="text-foreground-muted">Summary:</span>
                    <p className="text-foreground-secondary mt-1">
                      {script.analysis_json.summary}
                    </p>
                  </div>
                  <div>
                    <span className="text-foreground-muted">Hook:</span>
                    <p className="text-foreground-secondary mt-1">
                      {script.analysis_json.hook}
                    </p>
                  </div>
                  {script.analysis_json.emotional_triggers && (
                    <div>
                      <span className="text-foreground-muted">Emotional Triggers:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {script.analysis_json.emotional_triggers.map((trigger) => (
                          <span
                            key={trigger}
                            className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs"
                          >
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {script.analysis_json.key_elements && (
                    <div>
                      <span className="text-foreground-muted">Key Elements:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {script.analysis_json.key_elements.map((element) => (
                          <span
                            key={element}
                            className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded text-xs"
                          >
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
