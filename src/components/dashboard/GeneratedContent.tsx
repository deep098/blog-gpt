'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText } from 'lucide-react';

type Props = {
  generatedContent: string;
  isGenerating: boolean;
  setGeneratedContent: (value: string) => void;
  saveContent: () => void;
  exportGeneratedContent: (format: 'md' | 'txt') => void;
};

export default function GeneratedContentCard({
  generatedContent,
  isGenerating,
  setGeneratedContent,
  saveContent,
  exportGeneratedContent,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
        <CardDescription>Your AI-generated content will appear here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Generated content will appear here..."
          value={generatedContent}
          onChange={(e) => setGeneratedContent(e.target.value)}
          className="min-h-[300px] resize-none"
          readOnly={isGenerating}
          
        />

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={saveContent}
            disabled={!generatedContent.trim()}
            variant="outline"
            className="flex-1"
          >
            Save Content
          </Button>
          <Button
            onClick={() => exportGeneratedContent('md')}
            disabled={!generatedContent.trim()}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            .md
          </Button>
          <Button
            onClick={() => exportGeneratedContent('txt')}
            disabled={!generatedContent.trim()}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            .txt
          </Button>
          <Button
            onClick={() => setGeneratedContent('')}
            variant="outline"
            disabled={!generatedContent.trim()}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}