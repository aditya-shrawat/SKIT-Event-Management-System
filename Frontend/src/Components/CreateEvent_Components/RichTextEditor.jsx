import { useState, useRef } from "react";
import { Bold, Italic } from "lucide-react";

const RichTextEditor = ({ formData, setFormData, errors }) => {
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
  });
  const editorRef = useRef(null);

  // Handle text formatting
  const formatText = (command) => {
    document.execCommand(command, false, null);
    updateActiveFormats();
    editorRef.current.focus();
  };

  // Update active format states
  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
    });
  };

  // Handle content change
  const handleContentChange = () => {
    const content = editorRef.current.innerHTML;
    setFormData((prev) => ({
      ...prev,
      details: content,
    }));
    updateActiveFormats();
  };

  return (
    <div className="md:col-span-2">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Details <span className="text-red-500">*</span>
        </label>

        {/* Rich Text Editor Toolbar */}
        <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex gap-2">
          <button
            type="button"
            onClick={() => formatText("bold")}
            className={`p-2 rounded focus:outline-none transition-colors ${
              activeFormats.bold
                ? "bg-[#00bebe] text-white hover:bg-[#00A1A1]"
                : "hover:bg-gray-200 text-gray-600"
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => formatText("italic")}
            className={`p-2 rounded focus:outline-none transition-colors ${
              activeFormats.italic
                ? "bg-[#00bebe] text-white hover:bg-[#00A1A1]"
                : "hover:bg-gray-200 text-gray-600"
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
        </div>

        {/* Rich Text Editor Content Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          className={`w-full px-4 py-3 border-l border-r border-b rounded-b-lg focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none min-h-[100px] ${
            errors.details ? "border-red-300" : "border-gray-300"
          }`}
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            fontSize: "14px",
            lineHeight: "1.5",
          }}
          data-placeholder="Detailed description of the event"
        />

        {/* Placeholder styling */}
        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            cursor: text;
          }
        `}</style>

        {errors.details && (
          <p className="mt-1 text-sm text-red-600">{errors.details}</p>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
