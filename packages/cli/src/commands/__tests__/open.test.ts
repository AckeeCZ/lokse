import { vi, describe, expect, it } from 'vitest';
import { runCommand } from './utils.js';

vi.mock('open', () => {
    const mock = vi.fn();
    return { default: mock };
});

describe('open command', async () => {
    const open = await import('open').then(v => v.default);
    it('opens sheet in browser', async () => {
        await runCommand(['open', '--id=this-is-fake-sheet-id']);
        expect(open).toHaveBeenCalledWith(`https://docs.google.com/spreadsheets/d/this-is-fake-sheet-id`);
    });

    it('throws when id not provided', async () => {
        await expect(runCommand(['open'])).rejects.toThrow(`💥 Sheet id is required for open of translations`);
    });
});
