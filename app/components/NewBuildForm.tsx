"use client";

import { useState } from "react";
import { newBuildHelper } from "@/utils/helpers";
import { Upload, Plus, X, Link as LinkIcon } from "lucide-react";

type Make = { id: number; name: string };
type Model = { id: number; name: string; make_id: number };

export default function NewBuildForm({ makes, models }: { makes: Make[]; models: Model[] }) {
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [partLinks, setPartLinks] = useState<string[]>([""]);

  const filteredModels = selectedMake
    ? models.filter((m) => m.make_id === selectedMake)
    : [];

  const addPartLink = () => setPartLinks((prev) => [...prev, ""]);
  const removePartLink = (idx: number) =>
    setPartLinks((prev) => prev.filter((_, i) => i !== idx));
  const updatePartLink = (idx: number, value: string) =>
    setPartLinks((prev) => prev.map((v, i) => (i === idx ? value : v)));

  return (
    <form action={newBuildHelper} className="te-border-thick te-shadow bg-[var(--background)] p-6 sm:p-8 flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="font-pixel text-[9px] uppercase tracking-wider">
          Title
        </label>
        <input
          type="text"
          name="title"
          required
          placeholder="e.g. My 1995 NSX Track Build"
          className="te-border bg-te-grey text-sm px-4 py-3 outline-none focus:border-te-orange"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="font-pixel text-[9px] uppercase tracking-wider">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={5}
          placeholder="Tell us about your build..."
          className="te-border bg-te-grey text-sm px-4 py-3 outline-none focus:border-te-orange resize-none"
        />
      </div>

      {/* Make & Model row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-pixel text-[9px] uppercase tracking-wider">
            Make
          </label>
          <select
            name="make_id"
            required
            onChange={(e) => setSelectedMake(Number(e.target.value))}
            className="te-border bg-te-grey text-sm px-4 py-3 outline-none focus:border-te-orange cursor-pointer"
          >
            <option value="">Select a make</option>
            {makes.map((make) => (
              <option key={make.id} value={make.id}>
                {make.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-pixel text-[9px] uppercase tracking-wider">
            Model
          </label>
          <select
            name="model_id"
            required
            disabled={!selectedMake}
            className="te-border bg-te-grey text-sm px-4 py-3 outline-none focus:border-te-orange cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Select a model</option>
            {filteredModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div className="flex flex-col gap-2">
        <label className="font-pixel text-[9px] uppercase tracking-wider">
          Upload Images
        </label>
        <label className="te-border border-dashed bg-te-grey p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-te-orange transition-colors">
          <Upload size={24} strokeWidth={2} className="text-gray-500" />
          <span className="text-xs text-gray-500">
            Click to select images
          </span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            required
            className="hidden"
          />
        </label>
      </div>

      {/* Parts list */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="font-pixel text-[9px] uppercase tracking-wider">
            Parts List
          </label>
          <span className="text-[10px] text-gray-500 font-mono">
            {partLinks.filter((l) => l.trim()).length} added
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-1">
          Add links to the parts you used. Optional.
        </p>

        <div className="flex flex-col gap-2">
          {partLinks.map((link, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="te-border bg-te-grey w-10 h-[46px] flex items-center justify-center shrink-0">
                <LinkIcon size={14} strokeWidth={2.5} className="text-gray-500" />
              </div>
              <input
                type="url"
                name="part_link"
                value={link}
                onChange={(e) => updatePartLink(idx, e.target.value)}
                placeholder="https://..."
                className="te-border bg-te-grey text-sm px-4 py-3 outline-none focus:border-te-orange flex-1 min-w-0"
              />
              {partLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePartLink(idx)}
                  aria-label="Remove part"
                  className="te-border w-10 h-[46px] flex items-center justify-center hover:bg-te-red hover:text-white transition-colors shrink-0"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addPartLink}
          className="te-border font-pixel text-[9px] uppercase px-4 py-2 flex items-center justify-center gap-2 hover:bg-te-yellow transition-colors self-start mt-1"
        >
          <Plus size={12} strokeWidth={3} />
          Add Part
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="te-border-thick te-shadow te-card-hover w-full py-3 px-6 font-pixel text-[10px] uppercase bg-te-orange text-te-dark cursor-pointer mt-2"
      >
        Create Build
      </button>
    </form>
  );
}
