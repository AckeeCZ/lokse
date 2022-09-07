/*
 * Get html content as a list of string rows, identify which rows
 *  belong to the desired section and return them
 */
export function getSection(rows: string[], sectionName: string): string[] {
  // eslint-disable-next-line unicorn/no-array-reduce
  const sectionIndexes = rows.reduce<number[]>(function (all, section, i) {
    if (section.includes("<h2")) {
      all.push(i);
    }

    return all;
  }, []);

  const nameRegexp = new RegExp(sectionName, "i");
  const sectionPosition = sectionIndexes.findIndex((index) =>
    nameRegexp.test(rows[index])
  );

  if (sectionPosition > -1) {
    const neededSectionIndex = sectionIndexes[sectionPosition];
    const nextSectionIndex = sectionIndexes[sectionPosition + 1];

    return rows.slice(neededSectionIndex, nextSectionIndex);
  }

  return [];
}
