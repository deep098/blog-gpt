import {Card,CardContent,CardHeader,CardDescription,CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  niche: string;
  audience: string;
  contentType: string;
  setNiche: (val: string) => void;
  setAudience: (val: string) => void;
  setContentType: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
};

export default function ContentForm({
  niche,
  audience,
  contentType,
  setNiche,
  setAudience,
  setContentType,
  onGenerate,
  isGenerating,
}: Props) {
    return (
        <Card>
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>
              Tell us about your niche and target audience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche/Topic *</Label>
              <Input
                id="niche"
                placeholder="e.g., Digital Marketing, Health & Fitness, Tech Startups"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="placeholder:text-gray-400 placeholder:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Small business owners, Fitness enthusiasts, Tech entrepreneurs"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="placeholder:text-gray-400 placeholder:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Tabs value={contentType} onValueChange={setContentType}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ideas">Ideas</TabsTrigger>
                  <TabsTrigger value="outline">Outline</TabsTrigger>
                  <TabsTrigger value="draft">Full Draft</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Button
                onClick={onGenerate}
                disabled={isGenerating || !niche.trim()}
                className="w-full"
                >
                {isGenerating ? 'Generating...' : `Generate ${contentType}`}
            </Button>
          </CardContent>
        </Card>
    )
}