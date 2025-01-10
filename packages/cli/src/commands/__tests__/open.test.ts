import { runCommand } from './utils.js';
import open from 'open';
import { vi, describe, expect, it } from 'vitest';

vi.mock('open');

describe('open command', () => {
    it('opens sheet in browser', async () => {
        await runCommand(['open', '--id=this-is-fake-sheet-id']);

        expect(open).toHaveBeenCalledWith(`https://docs.google.com/spreadsheets/d/this-is-fake-sheet-id`);
    });

    it('throws when id not provided', async () => {
        await expect(runCommand(['open'])).rejects.toThrow(`💥 Sheet id is required for open of translations`);
    });
});
