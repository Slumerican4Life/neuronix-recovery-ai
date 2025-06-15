
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FileAnalysis {
  confidence: number;
  damage: 'none' | 'minor' | 'moderate' | 'severe';
}

export const useFileAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFileWithAI = async (file: File, fileSignature: string): Promise<FileAnalysis> => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('lyra-chat', {
        body: {
          message: `Analyze this file for recovery: ${file.name} (${file.type}, ${file.size} bytes). File signature: ${fileSignature}. Assess damage level and recovery confidence (0-100%).`,
          conversationHistory: []
        }
      });

      if (error) throw error;

      // Parse AI response for confidence and damage assessment
      const response = data.response.toLowerCase();
      let confidence = 85; // Default confidence
      let damage: 'none' | 'minor' | 'moderate' | 'severe' = 'none';

      // Extract confidence percentage
      const confidenceMatch = response.match(/(\d+)%/);
      if (confidenceMatch) {
        confidence = parseInt(confidenceMatch[1]);
      }

      // Assess damage based on AI analysis
      if (response.includes('severe') || response.includes('corrupted') || confidence < 30) {
        damage = 'severe';
      } else if (response.includes('moderate') || response.includes('partial') || confidence < 60) {
        damage = 'moderate';
      } else if (response.includes('minor') || response.includes('slight') || confidence < 85) {
        damage = 'minor';
      }

      return { confidence, damage };
    } catch (error) {
      console.error('AI analysis error:', error);
      return { confidence: 70, damage: 'minor' };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeFileWithAI, isAnalyzing };
};
