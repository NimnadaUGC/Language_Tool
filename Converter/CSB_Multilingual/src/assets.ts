import type { WritingMode } from './engine';

function publicAsset(filename: string): string {
  return `${import.meta.env.BASE_URL}assets/${filename}`;
}

export const languageImages: Record<WritingMode, string> = {
  singlish: publicAsset('singlish_trans.png'),
  tanglish: publicAsset('tanglish_trans.png'),
  hinglish: publicAsset('hinglish_trans.png'),
  mixed: publicAsset('multilingual_trans.png'),
};
