import { useState, useEffect, useCallback } from "react";
import { cmsApi, type CmsType } from "@/api/cms";

const DEFAULT_HTML = "<p><br></p>";

export function useCms(type: CmsType) {
  const [content, setContent] = useState<string>(DEFAULT_HTML);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    cmsApi
      .list()
      .then((res) => {
        if (cancelled) return;
        const items = (res as { items?: { type: string; description: string }[] }).items ?? [];
        const item = items.find((i) => i.type === type);
        setContent(item?.description?.trim() ? item.description : DEFAULT_HTML);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [type]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await cmsApi.update({ type, description: content });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      throw err;
    } finally {
      setSaving(false);
    }
  }, [type, content]);

  return { content, setContent, loading, saving, error, save };
}
