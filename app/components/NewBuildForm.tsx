"use client";

import { useState } from "react";
import { newBuildHelper } from "@/utils/helpers";

export default function NewBuildForm({ makes, models }) {
  const [selectedMake, setSelectedMake] = useState<number | null>(null);

  const filteredModels = selectedMake
    ? models.filter((m) => m.make_id === selectedMake)
    : [];

  return (
    <form action={newBuildHelper}>
      {/* Title */}
      <div>
        <label>Title</label>
        <input type="text" name="title" required />
      </div>

      {/* Description */}
      <div>
        <label>Description</label>
        <textarea name="description" required rows={5} />
      </div>

      {/* Make */}
      <div>
        <label>Make</label>
        <select
          name="make_id"
          required
          onChange={(e) => setSelectedMake(Number(e.target.value))}
        >
          <option value="">Select a make</option>
          {makes.map((make) => (
            <option key={make.id} value={make.id}>
              {make.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label>Model</label>
        <select name="model_id" required disabled={!selectedMake}>
          <option value="">Select a model</option>
          {filteredModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Images */}
      <div>
        <label>Upload Images</label>
        <input type="file" name="images" accept="image/*" multiple required />
      </div>

      <button type="submit">Create Build</button>
    </form>
  );
}
