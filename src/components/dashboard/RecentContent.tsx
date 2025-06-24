'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  content_type: 'ideas' | 'outline' | 'draft';
  tags: string[];
  niche: string;
  audience: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

interface RecentContentProps {
  refresh: boolean;
}

export default function RecentContent({ refresh }: RecentContentProps) {
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    loadRecentContent();
  }, [refresh]);

  const loadRecentContent = async () => {
    setIsLoadingContent(true);
    try {
      const response = await fetch('/api/content?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentContent(data.content || []);
      }
    } catch (error) {
      console.error('Error loading recent content:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const exportContentItem = (item: ContentItem, format: 'md' | 'txt') => {
    let exportContent = '';
    let filename = '';
    let mimeType = '';

    if (format === 'md') {
      exportContent = `# ${item.title}\n\n`;
      if (item.tags.length > 0) exportContent += `**Tags:** ${item.tags.join(', ')}\n`;
      if (item.niche) exportContent += `**Niche:** ${item.niche}\n`;
      if (item.audience) exportContent += `**Audience:** ${item.audience}\n`;
      exportContent += `**Content Type:** ${item.content_type}\n`;
      exportContent += `**Word Count:** ${item.word_count}\n`;
      exportContent += `**Created:** ${new Date(item.created_at).toLocaleDateString()}\n\n---\n\n`;
      exportContent += item.content;
      filename = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      mimeType = 'text/markdown';
    } else {
      exportContent = `${item.title}\n${'='.repeat(item.title.length)}\n\n`;
      if (item.tags.length > 0) exportContent += `Tags: ${item.tags.join(', ')}\n`;
      if (item.niche) exportContent += `Niche: ${item.niche}\n`;
      if (item.audience) exportContent += `Audience: ${item.audience}\n`;
      exportContent += `Content Type: ${item.content_type}\n`;
      exportContent += `Word Count: ${item.word_count}\n`;
      exportContent += `Created: ${new Date(item.created_at).toLocaleDateString()}\n\n`;
      exportContent += '-'.repeat(50) + '\n\n';
      exportContent += item.content;
      filename = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Content</CardTitle>
            <CardDescription>Your recently saved content pieces</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <a href="/editor">Manage All Content</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingContent ? (
          <div className="text-center py-8 text-gray-500">
            <p>Loading recent content...</p>
          </div>
        ) : recentContent.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No saved content yet. Generate and save your first piece!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentContent.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{item.content_type}</Badge>
                      <Badge variant="outline">{item.word_count} words</Badge>
                      {item.niche && <Badge variant="secondary">{item.niche}</Badge>}
                    </div>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/editor?load=${item.id}`}>Edit</a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportContentItem(item, "md")}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      .md
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportContentItem(item, "txt")}
                      className="flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      .txt
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {recentContent.length >= 5 && (
              <div className="text-center pt-4">
                <Button variant="outline" asChild>
                  <a href="/editor">View All Content</a>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
