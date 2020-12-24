nova.commands.register("tm.paste", async (editor, text, start) => {
  const clipboard = await nova.clipboard.readText();
  const parts = clipboard.split("\n");

  editor.edit((edit) => {
    editor.selectedRanges.forEach((range, i) => {
      // we assume each range will have a part to paste
      const part = parts[i];

      // if we selected more lines than parts available
      // don't paste anything
      if (!part) return;

      // since we're modifying the ranges as we're pasting
      // we need to add to our rangeStart whatever we pasted
      // before to keep the cursor position correct
      let rangeStart = range.start;
      if (i > 0) {
        rangeStart = range.start + parts[i - 1].length;
      }

      edit.insert(rangeStart, part);
    });
  });
});