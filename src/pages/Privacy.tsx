import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCms } from "@/hooks/useCms";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = ["header", "bold", "italic", "underline", "list", "bullet", "link"];

export default function PrivacyPage() {
  const { content, setContent, loading, saving, error, save } = useCms("privacy");

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSave = async () => {
    try {
      await save();
      toast.success("Privacy content saved successfully.");
    } catch {
      toast.error("Failed to save.");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm border p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Privacy</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </div>
      <style>
        {`
          .quill-wrapper .ql-container {
            min-height: 250px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
          }
          .quill-wrapper .ql-toolbar {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
          .quill-wrapper .ql-editor {
            min-height: 200px;
          }
        `}
      </style>
    </div>
  );
}