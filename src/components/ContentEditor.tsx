"use client";
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Save, Eye, Edit3, Plus, X, Download, FileText } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  content_type: 'ideas' | 'outline' | 'draft';
  tags: string[];
  niche: string;
  audience: string;
  word_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentEditorProps {
  initialContent?: string;
  initialTitle?: string;
  contentType?: 'ideas' | 'outline' | 'draft';
  niche?: string;
  audience?: string;
  onSave?: (contentId: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  initialContent = '',
  initialTitle = '',
  contentType = 'draft',
  niche = '',
  audience = '',
  onSave
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedContents, setSavedContents] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  // Load saved content on component mount
  useEffect(() => {
    loadSavedContent();
  }, []);

  // Update word count when content changes
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const loadSavedContent = async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setSavedContents(data.content || []);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content');
      return;
    }

    setIsSaving(true);
    
    try {
      const contentData = {
        title: title.trim(),
        content: content.trim(),
        content_type: contentType,
        tags,
        niche,
        audience,
        word_count: wordCount,
        is_published: false,
      };

      const url = selectedContent 
        ? `/api/content/${selectedContent.id}` 
        : '/api/content';
      
      const method = selectedContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save content');
      }

      alert(selectedContent ? 'Content updated successfully!' : 'Content saved successfully!');
      
      // Reload the content list
      loadSavedContent();
      
      // Call the onSave callback if provided
      if (onSave) {
        onSave(data.id);
      }

    } catch (error) {
      console.error('Error saving content:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleLoadContent = (contentItem: ContentItem) => {
    setSelectedContent(contentItem);
    setTitle(contentItem.title);
    setContent(contentItem.content);
    setTags(contentItem.tags || []);
    setIsEditing(false);
  };

  const handleNewContent = () => {
    setSelectedContent(null);
    setTitle(initialTitle);
    setContent(initialContent);
    setTags([]);
    setIsEditing(true);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Content deleted successfully!');
        loadSavedContent();
        if (selectedContent?.id === contentId) {
          handleNewContent();
        }
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };

  const exportContent = (format: 'md' | 'txt') => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content before exporting');
      return;
    }

    let exportContent = '';
    let filename = '';
    let mimeType = '';

    if (format === 'md') {
      // Format as Markdown
      exportContent = `# ${title}\n\n`;
      
      // Add metadata
      if (tags.length > 0) {
        exportContent += `**Tags:** ${tags.join(', ')}\n`;
      }
      if (niche) {
        exportContent += `**Niche:** ${niche}\n`;
      }
      if (audience) {
        exportContent += `**Audience:** ${audience}\n`;
      }
      exportContent += `**Word Count:** ${wordCount}\n`;
      exportContent += `**Created:** ${new Date().toLocaleDateString()}\n\n---\n\n`;
      
      // Add content
      exportContent += content;
      
      filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      mimeType = 'text/markdown';
    } else {
      // Format as plain text
      exportContent = `${title}\n${'='.repeat(title.length)}\n\n`;
      
      // Add metadata
      if (tags.length > 0) {
        exportContent += `Tags: ${tags.join(', ')}\n`;
      }
      if (niche) {
        exportContent += `Niche: ${niche}\n`;
      }
      if (audience) {
        exportContent += `Audience: ${audience}\n`;
      }
      exportContent += `Word Count: ${wordCount}\n`;
      exportContent += `Created: ${new Date().toLocaleDateString()}\n\n`;
      exportContent += '-'.repeat(50) + '\n\n';
      
      // Add content
      exportContent += content;
      
      filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      mimeType = 'text/plain';
    }

    // Create and download file
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Content Editor</h2>
        <div className="flex gap-2">
          <Button onClick={handleNewContent} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
          >
            {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Saved Content Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Saved Content</CardTitle>
            <CardDescription>Your saved articles and drafts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {savedContents.length === 0 ? (
              <p className="text-sm text-gray-500">No saved content yet</p>
            ) : (
              savedContents.map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedContent?.id === item.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleLoadContent(item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.content_type}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContent(item.id);
                      }}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter content title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Word Count</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{wordCount} words</Badge>
                    <Badge variant="outline">{contentType}</Badge>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} size="sm">Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                {isEditing ? 'Edit your content' : 'Preview your content'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your content here..."
                  className="min-h-[400px] font-mono"
                />
              ) : (
                <div className="min-h-[400px] p-4 border rounded bg-gray-50">
                  <div className="prose max-w-none">
                    {content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button 
                onClick={() => exportContent('md')}
                disabled={!title.trim() || !content.trim()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export as Markdown
              </Button>
              <Button 
                onClick={() => exportContent('txt')}
                disabled={!title.trim() || !content.trim()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export as Text
              </Button>
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !content.trim()}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : selectedContent ? 'Update Content' : 'Save Content'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;