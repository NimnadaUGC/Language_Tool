import type { ConversionResult, LanguageId as CoreLanguageId } from './engine/types';

export type LanguageId = CoreLanguageId;
export type InputMode = 'csb' | 'phonetic';
export type TypingSpeed = 'slow' | 'moderate' | 'fast';
export type UserMode = 'guest' | 'demo-member';
export type PlanPreview = 'free' | 'pro-preview';

export interface ConversionAdapter {
  id: LanguageId;
  label: string;
  nativeLabel: string;
  script: string;
  accent: string;
  convert(source: string): string;
  analyze(source: string): ConversionResult;
  examples: readonly { input: string; output: string }[];
}

export interface DocumentRecord {
  id: string;
  title: string;
  content: string;
  phoneticSource: string;
  inputMode: InputMode;
  language: LanguageId;
  createdAt: number;
  updatedAt: number;
}

export interface AppPreferences {
  language: LanguageId;
  typingSpeed: TypingSpeed;
  userMode: UserMode;
  displayName: string;
  planPreview: PlanPreview;
  proNotified: boolean;
}

export const defaultPreferences: AppPreferences = {
  language: 'singlish',
  typingSpeed: 'moderate',
  userMode: 'guest',
  displayName: '',
  planPreview: 'free',
  proNotified: false,
};
