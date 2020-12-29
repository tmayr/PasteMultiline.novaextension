nova.commands.register("tm.paste", async (editor, text, start) => {
  const clipboard = await nova.clipboard.readText();
  const parts = clipboard.split("\n");

  // since we're modifying the ranges as we're pasting
  // we need to add to our rangeStart whatever we pasted
  // before to keep the cursor position correct
  let rangeOffset = 0;
  editor.edit((edit) => {
    editor.selectedRanges.forEach((range, i) => {
      // we assume each range will have a part to paste
      let part = parts.shift();

      // if there are no more parts available, exit
      if (!part) return;

      // if we have double quotes surrounding thie string, we assume it's a multiline string
      if (part.startsWith('"')) {
        // since we split before by line, we need to find out when the closing quote is
        do {
          part += parts.shift();
        } while (!part.endsWith('"'));

        // remove the first and last char corresponding to quotes
        part = part.substring(1);
        part = part.substring(0, part.length - 1);
      }

      edit.insert(range.start + rangeOffset, part);
      rangeOffset = rangeOffset + part.length;
    });
  });
});
