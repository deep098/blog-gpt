"use client"
import React, { useState } from "react";

import GeneratedContentCard from "./dashboard/GeneratedContent";
import ContentForm from "./dashboard/ContentForm";
import Title from "./dashboard/Title"
import RecentContent from "./dashboard/RecentContent"

export default function Dashboard() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("ideas");
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // Add refresh state for RecentContent
  const [refreshRecentContent, setRefreshRecentContent] = useState(false);

  const handleGenerate = async () => {
    if (!niche.trim()) {
      alert('Please enter your niche/topic');
      return;
    }

    setIsGenerating(true);

    try {
      const apiEndpoints = {
        ideas: '/api/generate-ideas',
        outline: '/api/generate-outline',
        draft: '/api/generate-draft',
      };

      const response = await fetch(apiEndpoints[contentType as keyof typeof apiEndpoints], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, audience }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate content');

      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContent = async () => {
    if (!generatedContent.trim()) return alert('No content to save');

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${contentType} for ${niche}`,
          content: generatedContent,
          content_type: contentType,
          niche,
          audience,
          word_count: generatedContent.trim().split(/\s+/).length,
          tags: [contentType, niche].filter(Boolean),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save content');

      alert('Content saved successfully!');
      
      setRefreshRecentContent(prev => !prev);
      
    } catch (error) {
      console.error('Save failed:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const exportGeneratedContent = (format: 'md' | 'txt') => {
    if (!generatedContent.trim()) return alert('No content to export');

    const title = `${contentType} for ${niche}`;
    let content = '', filename = '', mimeType = '';

    if (format === 'md') {
      content = `# ${title}\n\n**Niche:** ${niche}\n**Audience:** ${audience}\n**Type:** ${contentType}\n\n---\n\n${generatedContent}`;
      filename = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
      mimeType = 'text/markdown';
    } else {
      content = `${title}\n${'='.repeat(title.length)}\n\nNiche: ${niche}\nAudience: ${audience}\nType: ${contentType}\n\n${generatedContent}`;
      filename = `${title.replace(/[^a-z0-9]/gi, '_')}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Title/>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <ContentForm
          niche={niche}
          audience={audience}
          contentType={contentType}
          setNiche={setNiche}
          setAudience={setAudience}
          setContentType={setContentType}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Output Panel */}
        <GeneratedContentCard
            generatedContent={generatedContent}
            isGenerating={isGenerating}
            setGeneratedContent={setGeneratedContent}
            saveContent={saveContent}
            exportGeneratedContent={exportGeneratedContent}
        />
      </div>

      {/* Recent Content Section */}
      <RecentContent refresh={refreshRecentContent} />
    </div>
  );
}