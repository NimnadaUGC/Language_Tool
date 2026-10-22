import { analyze } from './index';
import type { ConversionAdapter, LanguageId } from '../types';

export const adapters: Record<LanguageId, ConversionAdapter> = {
  singlish: {
    id: 'singlish', label: 'Singlish', nativeLabel: 'සිංහල', script: 'Sinhala', accent: '#f02f42',
    convert: (source) => analyze(source, 'singlish').unicode,
    analyze: (source) => analyze(source, 'singlish'),
    examples: [{ input: 'mama', output: 'මම' }, { input: 'oyaata', output: 'ඔයාට' }],
  },
  tanglish: {
    id: 'tanglish', label: 'Tanglish', nativeLabel: 'தமிழ்', script: 'Tamil', accent: '#7828e9',
    convert: (source) => analyze(source, 'tanglish').unicode,
    analyze: (source) => analyze(source, 'tanglish'),
    examples: [{ input: 'thamizh', output: 'தமிழ்' }, { input: 'eppadi', output: 'எப்படி' }],
  },
  hinglish: {
    id: 'hinglish', label: 'Hinglish', nativeLabel: 'हिंदी', script: 'Devanagari', accent: '#00a85a',
    convert: (source) => analyze(source, 'hinglish').unicode,
    analyze: (source) => analyze(source, 'hinglish'),
    examples: [{ input: 'namaste', output: 'नमस्ते' }, { input: 'shakti', output: 'शक्ति' }],
  },
};
